const chai = require('chai');
const chaiHttp = require('chai-http');
const crypto = require('crypto');
const server = require('../../../../server');
const mongo = require('../../../helpers/mongo');
const users = require('../../../../model/mongoose/users');
const docGenerator = require('../../../helpers/docGenerator-v2');
const candidateHelper = require('./candidateHelpers');
const syncQueue = require('../../../../model/mongoose/sync_queue');

const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
chai.use(chaiHttp);

describe('create new candidate', function () {

    afterEach(async function () {
        console.log('dropping database');
        await mongo.drop();
    })

    describe('post /users/candidates', function () {

        it('it should create candidate profile', async function () {
            const candidate = docGenerator.candidate();

            const res = await
            candidateHelper.signupCandidate(candidate);
            res.should.have.status(200);

            const userDoc = await users.findOneByEmail(candidate.email);
            userDoc.email.should.equal(candidate.email);
            userDoc.is_verify.should.equal(0);
            userDoc.is_approved.should.equal(0);
            userDoc.is_admin.should.equal(0);
            userDoc.disable_account.should.equal(false);
            userDoc.type.should.equal("candidate");
            should.exist(userDoc.jwt_token);

            const salt = userDoc.salt;
            let hash = crypto.createHmac('sha512', salt);
            hash.update(candidate.password);
            const hashedPasswordAndSalt = hash.digest('hex');
            userDoc.password_hash.should.equal(hashedPasswordAndSalt);
            userDoc.marketing_emails.should.equal(false);

        })

        it('it should add new candidate to the sync queue', async function () {
            // const candidate = docGenerator.candidate();
            //
            // const res = await candidateHelper.signupCandidate(candidate);
            //
            // const syncDoc = await syncQueue.findOne({"user.email": candidate.email});
            //
            // syncDoc.queue.should.equal("candidate");
            // syncDoc.operation.should.equal("POST");
            // syncDoc.status.should.equal("pending");
            // expect(syncDoc.added_to_queue).to.exist;
        })
    })
});