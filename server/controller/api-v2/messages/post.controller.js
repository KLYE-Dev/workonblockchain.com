const auth = require('../../middleware/auth-v2');
const Schema = require('mongoose').Schema;
const enumerations = require('../../../model/enumerations');
const errors = require('../../services/errors');
const sanitize = require('../../services/sanitize');
const messages = require('../../../model/mongoose/messages');
const messageHelper = require('../messageHelpers');
const multer = require('../../../controller/middleware/multer');
const settings = require('../../../settings');

module.exports.request = {
    type: 'post',
    path: '/messages'
};

const bodySchema = new Schema({
    receiver_id: {
        type: String,
        required: true
    },
    msg_tag: {
        type: String,
        enum: enumerations.chatMsgTypes,
        required: true
    },
    message: {
        normal: {
            type: new Schema({
                message: {
                    type: String,
                    required: true
                }
            }),
            required: false
        },
        job_offer: {
            type: new Schema({
                title: {
                    type: String,
                    required: true
                },
                salary: {
                    type: Number,
                    required: true
                },
                salary_currency: {
                    type: String,
                    enum: enumerations.currencies,
                    required: true
                },
                type: {
                    type: String,
                    enum: enumerations.jobTypes,
                    required: true
                },
                description: {
                    type: String,
                    required: false
                }
            }),
            required: false
        },
    }
});

module.exports.inputValidation = {
    body: bodySchema
};

module.exports.auth = async function (req) {
    console.log('in auth');
    await auth.isValidUser(req);
}

function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

const checkJobOfferAccepted = async function (userType, sender_id, receiver_id) {
    let messageDoc;
    if (userType === 'candidate') {
        messageDoc = await messages.findOne({
            sender_id: sender_id,
            receiver_id: receiver_id,
            msg_tag: 'job_offer_accepted'
        });
    } else {
        messageDoc = await messages.findOne({
            sender_id: receiver_id,
            receiver_id: sender_id,
            msg_tag: 'job_offer_accepted'
        });
    }
    if (!messageDoc) errors.throwError("Job offer has not been accepted", 400);
};

const checkMessageSenderType = function (userType, expectedType) {
    if (userType !== expectedType) errors.throwError("Message can only be sent by a " + expectedType, 400);
}

const sendMessage = async function (newMessage) {
    const messageDoc = await messages.insert(newMessage);
    return messageDoc;
};

const checkLastEmpoymentOffer = async function (sender_id,receiver_id){
    console.log(sender_id);
    console.log(receiver_id);
    const lastEmploymentOfferDoc = await
        messages.findLastJobOffer({
            sender_id: sender_id,
            receiver_id: receiver_id,
            msg_tag: 'employment_offer'
        });
    console.log('after call');
    console.log(lastEmploymentOfferDoc);
    if(lastEmploymentOfferDoc)
        errors.throwError("Last employment offer needs to be accepted or rejected before a new offer can be sent", 400);

    /*if (lastEmploymentOfferDoc) {
        const responseToOfferDoc = await
            messages.findOne({
                $or: [{
                    "message.employment_offer_accepted.employment_offer_id": lastEmploymentOfferDoc._id
                }, {
                    "message.employment_offer_rejected.employment_offer_id": lastEmploymentOfferDoc._id
                }]
            });
        if (!responseToOfferDoc) {
            errors.throwError("Last employment offer needs to be accepted or rejected before a new offer can be sent", 400);
        }
    }*/
}

module.exports.endpoint = async function (req, res) {
    console.log('in endpoint');
    const userType = req.auth.user.type;
    const sender_id = req.auth.user._id;
    let receiver_id,newMessage;
    let path = '';

    if(isEmpty(req.body)){
        console.log("fileeeeeeeeee");
        multer.single('photo')(req, {}, function (err) {
            if (err) throw err
            if(req.file){
                console.log(req.file);
                console.log('file is coming');
                if (req.file) {
                    if (settings.isLiveApplication()) {
                        path = req.file.location; // for S3 bucket
                    } else {
                        path = settings.FILE_URL + req.file.filename;
                    }
                }
            }
            else{
                console.log('no file');
                console.log(req.body);
            }

            receiver_id = req.body.receiver_id;
            newMessage = {
                sender_id: sender_id,
                receiver_id: receiver_id,
                msg_tag: req.body.msg_tag,
                is_read: false,
                date_created: Date.now(),
                message: {}
            };

            if (req.body.msg_tag === "file" || req.body.msg_tag === "normal") {
                checkJobOfferAccepted(userType, sender_id, receiver_id);
                console.log(path);
                let file = {};
                file.url = path;
                newMessage.message.file = file;
            }
            else if (req.body.msg_tag === "employment_offer") {
                checkMessageSenderType(userType, 'company');
                checkJobOfferAccepted(userType, sender_id, receiver_id);
                checkLastEmpoymentOffer(sender_id, receiver_id);
                let employment_offer = {};

                console.log(newMessage);
                if(path){
                    employment_offer.file_url = path;
                }

                req.body.description = sanitize.sanitizeHtml(req.body.description);
                req.body.description = messageHelper.replaceLineBreaksHtml(req.body.description);

                employment_offer.title = req.body.title;
                employment_offer.salary = req.body.salary;
                employment_offer.salary_currency = req.body.salary_currency;
                employment_offer.type = req.body.type;
                employment_offer.start_date = req.body.start_date;
                employment_offer.description = req.body.description;
                newMessage.message.employment_offer = employment_offer;
                console.log(employment_offer);
            }
            const messageDoc = sendMessage(newMessage);
            res.send(messageDoc);
        });
    }
    else{
        console.log('no file');
        const body = req.body;
        console.log(body);

        receiver_id = body.receiver_id;
        newMessage = {
            sender_id: sender_id,
            receiver_id: receiver_id,
            msg_tag: body.msg_tag,
            is_read: false,
            date_created: Date.now(),
            message: {}
        };

        if (body.msg_tag === "normal") {
            checkJobOfferAccepted(userType, sender_id, receiver_id);

            body.message.normal.message = sanitize.sanitizeHtml(body.message.normal.message);
            body.message.normal.message = messageHelper.replaceLineBreaksHtml(body.message.normal.message);
            newMessage.message.normal = body.message.normal;
        }
        else if (body.msg_tag === "job_offer") {
            checkMessageSenderType(userType, 'company');

            const messageDoc = await
            messages.findOne({
                sender_id: sender_id,
                receiver_id: receiver_id,
                msg_tag: 'job_offer'
            });
            if (messageDoc) errors.throwError("Job offer already sent", 400);

            body.message.job_offer.description = sanitize.sanitizeHtml(body.message.job_offer.description);
            body.message.job_offer.description = messageHelper.replaceLineBreaksHtml(body.message.job_offer.description);
            newMessage.message.job_offer = body.message.job_offer;
        }
        else if (body.msg_tag === "job_offer_accepted") {
            checkMessageSenderType(userType, 'candidate');

            const messageDoc = await
            messages.findOne({
                sender_id: sender_id,
                receiver_id: receiver_id,
                msg_tag: 'job_offer_accepted'
            });
            if (messageDoc) errors.throwError("Job offer already accepted", 400);

            newMessage.message.job_offer_accepted = body.message.job_offer_accepted;
        }
        else if (body.msg_tag === "job_offer_rejected") {
            checkMessageSenderType(userType, 'candidate');

            const messageDoc = await
            messages.findOne({
                $or: [{
                    sender_id: sender_id,
                    receiver_id: receiver_id,
                    msg_tag: 'job_offer_accepted'
                }, {
                    sender_id: sender_id,
                    receiver_id: receiver_id,
                    msg_tag: 'job_offer_rejected'
                }]
            });
            if (messageDoc) errors.throwError("Job offer already accepted or rejected", 400);

            newMessage.message.job_offer_rejected = body.message.job_offer_rejected;
        }
        else if (body.msg_tag === "interview_offer") {
            checkMessageSenderType(userType, 'company');
            checkJobOfferAccepted(userType, sender_id, receiver_id);

            if (body.message.interview_offer.description) {
                body.message.interview_offer.description = sanitize.sanitizeHtml(body.message.interview_offer.description);
                body.message.interview_offer.description = messageHelper.replaceLineBreaksHtml(body.message.interview_offer.description);
            }
            newMessage.message.interview_offer = body.message.interview_offer;
        }
        else if (body.msg_tag === "employment_offer_accepted") {
            checkMessageSenderType(userType, 'candidate');
            checkJobOfferAccepted(userType, sender_id, receiver_id);

            let messageDoc = await
            messages.findOne({
                _id: messages.employment_offer_accepted.employment_offer_id
            });
            if (!messageDoc) errors.throwError("Employment offer not found", 400);

            messageDoc = await
            messages.findOne({
                msg_status: 'employment_offer_accepted',
                "messages.employment_offer_accepted.employment_offer_id": messages.employment_offer_accepted.employment_offer_id
            });
            if (!messageDoc) errors.throwError("Employment offer has already been accepted", 400);

            newMessage.message.employment_offer_accepted = body.message.employment_offer_accepted;
        }
        else if (body.msg_tag === "employment_offer_rejected") {
            checkMessageSenderType(userType, 'candidate');
            checkJobOfferAccepted(userType, sender_id, receiver_id);

            let messageDoc = await
            messages.findOne({
                _id: messages.employment_offer_rejected.employment_offer_id
            });
            if (!messageDoc) errors.throwError("Employment offer not found", 400);

            messageDoc = await
            messages.findOne({
                msg_status: 'employment_offer_rejected',
                "messages.employment_offer_rejected.employment_offer_id": messages.employment_offer_rejected.employment_offer_id
            });
            if (!messageDoc) errors.throwError("Employment offer has already been rejected", 400);

            newMessage.message.employment_offer_rejected = body.message.employment_offer_rejected;
        }

        const messageDoc = sendMessage(newMessage);
        res.send(messageDoc);
    }
}