const auth = require('../../../middleware/auth-v2');
const Schema = require('mongoose').Schema;
const enumerations = require('../../../../model/enumerations');
const regexes = require('../../../../model/regexes');
const multer = require('../../../../controller/middleware/multer');
const objects = require('../../../services/objects');
const companies = require('../../../../model/mongoose/companies');
const errors = require('../../../services/errors');
const users = require('../../../../model/mongoose/users');
const serviceSync = require('../../../services/serviceSync');
const dtaDocEmail = require('../../../services/email/emails/dtaDocEmail');
const filterReturnData = require('../filterReturnData');

module.exports.request = {
    type: 'patch',
    path: '/users/companies'
};

const querySchema = new Schema({
    admin: Boolean,
    user_id: String
});

const bodySchema = new Schema({
    first_name: {
        type:String
    },
    last_name: {
        type:String
    },
    job_title: {
        type:String
    },
    company_website: {
        type:String,
        validate: regexes.url
    },
    country_code: {
        type:String
    },
    company_phone: {
        type:String
    },
    company_city: {
        type:String
    },
    company_postcode: {
        type:String
    },
    company_founded: {
        type:Number,
        min: 1800
    },
    no_of_employees: {
        type:Number,
        min: 1
    },
    company_funded: {
        type:String
    },
    company_logo: {
        type: String,
        validate: regexes.url
    },
    company_description: {
        type: String,
        maxlength: 3000
    },
    canadian_commercial_company: Boolean,
    usa_privacy_shield: Boolean,
    dta_doc_link: {
        type: String,
        validate: regexes.url
    },
    discount: Number,
    pricing_plan: {
        type: String,
        enum: enumerations.pricingPlans
    },
    history : {
        type:[new Schema({
            pricing_plan: {
                type: String,
                enum: enumerations.pricingPlans
            },
            discount: Number,
            timestamp: {
                type: Date,
                required:true,
            },
            updated_by: {
                type: Schema.Types.ObjectId,
                ref: "Users",
                required:true
            }
        })]
    },
    when_receive_email_notitfications : {
        type : String ,
        enum : enumerations.email_notificaiton
    },
    hear_about_wob: {
        type: String,
        enum: enumerations.hearAboutWob
    },
    hear_about_wob_other_info:  String,
    unset_hear_about_wob_other_info: Boolean,
    gdpr_compliance: Boolean
});

module.exports.inputValidation = {
    query: querySchema,
    body: bodySchema
};

module.exports.files = async function(req) {
    await multer.uploadOneFile(req, "company_logo"); //fot DTA doc too
    //await multer.uploadOneFile(req, "dta_doc");
}

module.exports.auth = async function (req) {
    await auth.isLoggedIn(req);
    if (req.query.admin) {
        await auth.isAdmin(req);
    }
    else {
        await auth.isCompanyType(req);
    }

}


module.exports.endpoint = async function (req, res) {
    let userId;
    let employerDoc;
    const timestamp = new Date();
    const updatedUserID = req.auth.user._id;
    let pushObj = {};

    if (req.query.admin) {
        userId = req.query.user_id;
        employerDoc = await companies.findOne({ _creator: userId });
    }
    else {
        userId = req.auth.user._id;
        employerDoc = await companies.findOne({ _creator: userId });
    }
    if(employerDoc){
        const queryBody = req.body;
        let employerUpdate = {};
        let userUpdate = {};
        let unset = {};

        if(queryBody.gdpr_compliance && employerDoc.company_country && enumerations.euCountries.indexOf(employerDoc.company_country) === -1) {
            userUpdate.is_approved = 1;

            const requireDta = function() {
                if(!req.query.admin && (!req.file || !req.file.path)) errors.throwError("DTA document upload required", 400);

                if(!req.query.admin){
                    dtaDocEmail.sendEmail(employerDoc.company_name, employerDoc.company_country, req.file.path, userId);
                    employerUpdate.dta_doc_link = req.file.path;
                }

                userUpdate.is_approved = 0;
            }

            if (employerDoc.company_country === "Canada") {
                if (!queryBody.canadian_commercial_company && queryBody.canadian_commercial_company !== false) errors.throwError("Must answer question as a Canadian company", 400);
                if (queryBody.canadian_commercial_company === 'false' || queryBody.canadian_commercial_company === false) requireDta()
            } else if (employerDoc.company_country === "United States") {
                if (!queryBody.usa_privacy_shield  && queryBody.usa_privacy_shield !== false) errors.throwError("Must answer question as a US company", 400);
                if (queryBody.usa_privacy_shield === 'false' || queryBody.usa_privacy_shield === false) requireDta()
            } else {
                requireDta();
            }

            if (queryBody.canadian_commercial_company || queryBody.canadian_commercial_company === 'false' ) employerUpdate.canadian_commercial_company = queryBody.canadian_commercial_company;
            if (queryBody.usa_privacy_shield || queryBody.usa_privacy_shield === 'false' ) employerUpdate.usa_privacy_shield = queryBody.usa_privacy_shield;
        }
        if((!queryBody.gdpr_compliance && !queryBody.canadian_commercial_company && !queryBody.usa_privacy_shield) && req.file && req.file.path) employerUpdate.company_logo = req.file.path;

        else {
            if(queryBody.hear_about_wob) userUpdate.hear_about_wob = queryBody.hear_about_wob;
            if(queryBody.hear_about_wob_other_info) userUpdate.hear_about_wob_other_info = queryBody.hear_about_wob_other_info;
            if(queryBody.unset_hear_about_wob_other_info) unset['hear_about_wob_other_info'] = 1;
            if (queryBody.first_name) employerUpdate.first_name = queryBody.first_name;
            if (queryBody.last_name) employerUpdate.last_name = queryBody.last_name;
            if (queryBody.job_title) employerUpdate.job_title = queryBody.job_title;
            if (queryBody.company_name) {
                const companyDoc = await companies.findOne({company_name: queryBody.company_name});
                if (companyDoc) errors.throwError("Company with name " + queryBody.company_name + " already exists", 400);

                employerUpdate.company_name = queryBody.company_name;
            }
            if (queryBody.company_website) employerUpdate.company_website = queryBody.company_website;
            if (queryBody.company_phone) employerUpdate.company_phone = queryBody.company_phone;
            if (queryBody.company_city) employerUpdate.company_city = queryBody.company_city;
            if (queryBody.company_postcode) employerUpdate.company_postcode = queryBody.company_postcode;
            if (queryBody.company_founded) employerUpdate.company_founded = queryBody.company_founded;
            if (queryBody.no_of_employees) employerUpdate.no_of_employees = queryBody.no_of_employees;
            if (queryBody.company_funded) employerUpdate.company_funded = queryBody.company_funded;
            if (queryBody.company_description) employerUpdate.company_description = queryBody.company_description;
            if (queryBody.when_receive_email_notitfications) employerUpdate.when_receive_email_notitfications = queryBody.when_receive_email_notitfications;
            if(!req.query.admin && queryBody.pricing_plan && (employerDoc.pricing_plan !== queryBody.pricing_plan)) {
                employerUpdate.pricing_plan = queryBody.pricing_plan;
                let history = {
                    pricing_plan: queryBody.pricing_plan,
                    timestamp : timestamp,
                    updated_by: updatedUserID,
                };
                pushObj = {
                    $push: {
                        'history': {
                            $each: [history],
                            $position: 0
                        }
                    }
                }
            }

            if(req.query.admin && queryBody.discount > -1 && (employerDoc.discount !== queryBody.discount)) {
                employerUpdate.discount = queryBody.discount;
                let history = {
                    discount: queryBody.discount,
                    timestamp: timestamp,
                    updated_by: updatedUserID,
                };
                pushObj = {
                    $push: {
                        'history': {
                            $each: [history],
                            $position: 0
                        }
                    }
                }
            }
        }

        let updateObj = {};
        if(!objects.isEmpty(userUpdate))
            updateObj.$set = userUpdate;
        if(!objects.isEmpty(unset))
            updateObj.$unset=  unset;
        if(!objects.isEmpty(updateObj))
            await users.update({_id: userId}, updateObj);

        if(!objects.isEmpty(pushObj)){
            pushObj.$set = employerUpdate;
            await companies.update({ _id: employerDoc._id },pushObj);
        }
        else await companies.updateOne({ _id: employerDoc._id },{ $set: employerUpdate});

        const updatedEmployerDoc = await companies.findOneAndPopulate(userId);

        await serviceSync.pushToQueue("PATCH", {
            user: updatedEmployerDoc._creator,
            company: updatedEmployerDoc
        });
        const employerProfileRemovedData = filterReturnData.removeSensativeData(objects.copyObject(updatedEmployerDoc._creator));
        let employerCreatorRes = updatedEmployerDoc;
        employerCreatorRes._creator = employerProfileRemovedData;
        res.send(employerCreatorRes);
    }
    else {
        errors.throwError("Company account not found", 404);
    }
}