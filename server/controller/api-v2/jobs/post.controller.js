const Schema = require('mongoose').Schema;
const jobs = require('../../../model/mongoose/jobs');
const companies = require('../../../model/mongoose/companies');
const errors = require('../../services/errors');
const auth = require('../../middleware/auth-v2');
const enumerations = require('../../../model/enumerations');

module.exports.request = {
    type: 'post',
    path: '/jobs'
};

const querySchema = new Schema({
    admin: {
        type: String,
        enum: ['true', 'false']
    },
    company_id: String
});

const bodySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: enumerations.jobStatus,
        default: "open"
    },
    work_type : {
        type: String,
        enum: enumerations.workTypes,
        required: true
    },
    locations: {
        type: [{
            city_id: {
                type : Schema.Types.ObjectId,
                ref: 'Cities'
            },
            city: String,
            country: String,
            remote: Boolean,

        }],
        required: true
    },
    visa_needed: {
        type: Boolean,
        default:false
    },
    job_type: [{
        type: String,
        enum: enumerations.employmentTypes
    }],
    positions: {
        type: [{
            type: String,
            required : true,
            enum: enumerations.workRoles
        }],
        required: true
    },
    expected_salary_min: {
        type: Number,
        min: 1
    },
    expected_salary_max: {
        type: Number,
        min: 1
    },
    expected_hourly_rate_min: {
        type: Number,
        min: 1
    },
    expected_hourly_rate_max: {
        type: Number,
        min: 1
    },
    currency: {
        type: String,
        enum: enumerations.currencies
    },
    num_people_desired: {
        type:Number,
        required: true,
        min: 1
    },
    required_skills: {
        type:[new Schema({
            skills_id: {
                type : Schema.Types.ObjectId,
                ref: 'Skills'
            },
            type: String,
            name: String,
            exp_year: Number
        })]
    },
    not_required_skills: {
        type:[new Schema({
            skills_id: {
                type : Schema.Types.ObjectId,
                ref: 'Skills'
            },
            type: String,
            name: String,
        })]
    },
    description : {
        type : String,
        maxlength: 3000
    }
});

module.exports.inputValidation = {
    query: querySchema,
    body: bodySchema
};

module.exports.auth = async function (req) {
    await auth.isLoggedIn(req);
    if (req.query.admin === true || req.query.admin === 'true')  await auth.isAdmin(req);
    else  await auth.isCompanyType(req);
}

module.exports.endpoint = async function (req, res) {
    let company_id;
    if (req.query.admin === true || req.query.admin === 'true') {
        company_id = req.query.company_id
    }
    else {
        const companyDoc = await companies.findOne({_creator: req.auth.user._id});
        company_id = companyDoc._id
    }
    const timestamp = new Date();

    let newJobDoc = req.body;
    newJobDoc.company_id = company_id;
    newJobDoc.created = timestamp;
    newJobDoc.modified = timestamp;

    const jobDoc = await jobs.insert(newJobDoc);
    await companies.updateOne({_id: company_id}, {$push: {job_ids: jobDoc._id}});

    res.send(jobDoc)
}