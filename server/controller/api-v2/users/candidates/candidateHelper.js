const request = require('request');
const querystring = require('querystring');
const settings = require('../../../../settings');
const {google} = require('googleapis');
const OAuth2 = google.auth.OAuth2;
const linkedinOAuth = settings.linkedinCredentials;
const Linkedin = require('node-linkedin')(linkedinOAuth.clientId, linkedinOAuth.clientSecret, linkedinOAuth.redirectUrl);


const googleAuth = module.exports.googleAuth = async function googleAuth(googleCode) {
    const googleConfig = settings.googleCredentials;
    const oauth = new OAuth2(
        googleConfig.clientId,
        googleConfig.clientSecret,
        googleConfig.redirectUrl
    );
    const plus = google.plus('v1');
    const data = await getGoogleAccountFromCode(googleCode, oauth, plus);
    return data;

}

async function getGoogleAccountFromCode(googleCode, oauth, plus) {
    try {
        const {tokens} = await oauth.getToken(googleCode);
        // add the tokens to the google api so we have access to the account
        oauth.setCredentials(tokens);

        const response = await plus.people.get({userId: 'me', auth: oauth});
        const emailAddress = response.data.emails[0].value;
        return {
            email: emailAddress,
            google_id: response.data.id,
            first_name: response.data.name.familyName,
            last_name: response.data.name.givenName
        }
    }
    catch (error) {
        return {error: error};
    }
}

const linkedinAuth = module.exports.linkedinAuth = async function linkedinAuth(linkedinCode) {

    const form = {
        client_id: linkedinOAuth.clientId,
        client_secret: linkedinOAuth.clientSecret,
        redirect_uri: linkedinOAuth.redirectUrl,
        grant_type: 'authorization_code',
        code: linkedinCode
    };
    const token = await getLinkedinAccessToken(form);
    console.log(token);
    const data = await getLinkedinAccountFromCode(token);
    console.log(data);
    return data;

}

async function getLinkedinAccessToken(inputData) {

    const formData = querystring.stringify(inputData);
    const contentLength = formData.length;
    await request({
        headers: {
            'Content-Length': contentLength,
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        uri: 'https://www.linkedin.com/uas/oauth2/accessToken',
        body: formData,
        method: 'POST'
    }, function (error, res, body) {
        if (error) return {error : error};
        else {
            const responseData = JSON.parse(body);
            console.log(responseData.access_token);
            return responseData.access_token;
        }
    });
}

async function getLinkedinAccountFromCode(code) {
    const linkedin = Linkedin.init(code);
    linkedin.people.me(['id', 'first-name', 'last-name','email-address'], function(err, $in) {
        const userData = $in;
        console.log(userData);
        return {
            email: userData.emailAddress,
            google_id: userData.id,
            first_name: userData.firstName,
            last_name: userData.lastName
        }
    });
}
