const chai = require('chai');
const chaiHttp = require('chai-http');
const crypto = require('crypto');
const server = require('../../../../server');
const mongo = require('../../../helpers/mongo');
const Users = require('../../../../model/users');
const Companies = require('../../../../model/employer_profile');
const docGenerator = require('../../../helpers/docGenerator');
const companyHelper = require('./companyHelpers');

const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
chai.use(chaiHttp);

describe('get current company detail', function () {

    afterEach(async () => {
        console.log('dropping database');
        await mongo.drop();
    })

    describe('GET /users/current_company/:_id', () => {

        it('it should get only current company profile detail', async () => {

            const company = docGenerator.company();
            const companyRes = await companyHelper.signupCompany(company);

            const userDoc = await Users.findOne({email: company.email}).lean();

            const getCurrentCompany = await companyHelper.getCurrentCompany(userDoc._id , userDoc.jwt_token);
            getCurrentCompany.body._creator.email.should.equal(company.email);
            getCurrentCompany.body.first_name.should.equal(company.first_name);
            getCurrentCompany.body.last_name.should.equal(company.last_name);

        })
    })
});