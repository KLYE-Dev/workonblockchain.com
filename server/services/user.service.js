var config = require('config.json');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');
var mongo = require('mongoskin');
const users = require('../model/users');
const CandidateProfile = require('../model/candidate_profile');
var image = require('../model/image');
const fileUpload = require('express-fileupload');
var crypto = require('crypto');
var nodemailer = require('nodemailer');
var jwt_hash = require('jwt-simple');
const EmployerProfile = require('../model/employer_profile');
var md5 = require('md5');
const chat = require('../model/chat');

var service = {};

//////////authentication function///////
service.authenticate = authenticate;
service.forgot_password=forgot_password;
service.reset_password=reset_password;
service.emailVerify=emailVerify;

///////////candidate functions////////////////
service.getAll = getAll;
service.getById = getById;
service.create = create;
service.delete = _delete;
service.about_data = about_data;
service.job_data = job_data;
service.resume_data = resume_data;
service.experience_data = experience_data;
service.save_image = save_image;
service.update_candidate_profile = update_candidate_profile;

/////////////employer functions////////////////
service.create_employer =create_employer;
service.getCompany = getCompany;
service.get_company_byId = get_company_byId;
service.company_summary = company_summary;
service.about_company = about_company;
service.save_employer_image =save_employer_image;

/////////referal and chat functions////////////
service.search = search;
service.refreal_email = refreal_email;
service.get_refr_code = get_refr_code;
service.get_candidate=get_candidate;
service.insert_message = insert_message;
service.get_messages = get_messages;
service.get_user_messages = get_user_messages;
 
module.exports = service;

var emails = ['gmail.com' , 'hotmail.com.com' , 'yahoo.com'];

/***************authentication functions implementation******************/

/////////login//////////////////////////
function authenticate(email, password,type) 
{
	var deferred = Q.defer();
	   

    users.findOne({ email: email }, function (err, user) 
    {
       
        if (err) deferred.reject(err.name + ': ' + err.message);
        console.log(user);
        
        if (user && bcrypt.compareSync(password, user.password)) 
        {   
           
            console.log(user.type);
			if(user.type=='candidate')
            {
                CandidateProfile.findOne({ _creator:  user._id }, function (err, data) 
                {
                   
                    if (err) deferred.reject(err.name + ': ' + err.message);

                    else
                    {
                        deferred.resolve({ 
                            _id:data._id,
                            _creator: data._creator,
                            email: user.email,
                            email_hash: user.email_hash,
                            ref_link: user.ref_link,
							type:user.type,
                            token: jwt.sign({ sub: user._id }, config.secret)
                            });
                    }   


                });
            }
            if(user.type=='company')
            {
                    //console.log("company");
                EmployerProfile.findOne({ _creator:  user._id }, function (err, data) 
                {
                    //console.log(data);
                    if (err) deferred.reject(err.name + ': ' + err.message);

                    else
                    {
                        deferred.resolve({ 
                            _id:data._id,
                            _creator: data._creator,
                            email: user.email,
                            email_hash: user.email_hash,
                            ref_link: user.ref_link,
							type: user.type,
                            token: jwt.sign({ sub: user._id }, config.secret)
                            });
                    }   


                });
            }

           
        } 
        else 
        {
            deferred.reject("Password didn't match");
        }
    });
 
    return deferred.promise;
}

//////////////////forgot_password/////////////////////////////
function forgot_password(email)
{
    var deferred = Q.defer();
    users.findOne({ email :email  }, function (err, result)
        {          
            if (err) 
                deferred.reject(err.name + ': ' + err.message);

            if(result)
            {   
                updateData(result);
            }
            else
            {
                 deferred.resolve({error:'Email Not Found'});
            }

        });
 
        function updateData(data) 
        {
            var hashStr = crypto.createHash('md5').update(email).digest('hex');
            var email_data = {};
            email_data.password_key = hashStr;
            email_data.email = data.email;
            email_data.name = data.first_name;
            email_data.expiry = new Date(new Date().getTime() +  1800 *1000);

            var set = 
            {
                password_key: hashStr,

            };
            users.update({ _id: mongo.helper.toObjectID(data._id) },{ $set: set }, function (err, doc) 
            {
                if (err) 
                    deferred.reject(err.name + ': ' + err.message);
                else
                {
                    forgot_passwordEmail_send(email_data)
                    deferred.resolve({msg:'Email Send'});
                }
            });
        }

 
    return deferred.promise;

}

function forgot_passwordEmail_send(hash)
{

    nodemailer.createTestAccount((err, account) => 
    {
        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
        host: 'mail.mwancloud.com',
        port: 25,
        secure: false,
        tls:{
        rejectUnauthorized: false
        }, // true for 465, false for other ports
        auth: {
            user: 'workonblockchain@mwancloud.com', 
            pass: 'e71$AGVy' 
        }
        });

        let mailOptions = 
        {
            from: 'workonblockchain@mwancloud.com', 
            to : hash.email,
            subject : "Welcome to TEST",
            text : 'Visit this http://workonblockchain.mwancloud.com/reset_password/'+hash.password_key,
            html : '<a href="http://workonblockchain.mwancloud.com/reset_password/'+hash.password_key+'"><H2>Reset Password</H2></a>'

        };

        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => 
        {
            if (error) 
            {
                return console.log(error);
            }
            //console.log('Message sent: %s', info.messageId);
            //console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        });
    });
}

//////////////////Reset Password///////////////////////
function reset_password(hash,data)
{
    	var deferred = Q.defer();   
        users.findOne({ password_key :hash  }, function (err, result)
        {       
            if (err) 
                deferred.reject(err.name + ': ' + err.message);
            else
                updateData(result._id);
               
        });
 
        function updateData(_id) 
        {
            var user = _.omit(data, 'password'); 
            // add hashed password to user object
            user.password = bcrypt.hashSync(data.password, 10);
            var set = 
            {
                password:  user.password,
            };
            users.update({ _id: mongo.helper.toObjectID(_id) },{ $set: set }, function (err, doc) 
            {
                if (err) 
                    deferred.reject(err.name + ': ' + err.message);
                else
                {
                    deferred.resolve({msg:'Password reset successfully'});
                }
            });
        }
        
    return deferred.promise;
}

/////////////////emailVerify///////////////////////////
function emailVerify(token)
{
    var deferred = Q.defer()   
    var data = jwt_hash.decode(token,config.secret,'HS256');  
    if(new Date(data.expiry) > new Date())
    {
       users.findOne(  { email_hash:token  }, function (err, result)
        {          
            if (err) 
                deferred.reject(err.name + ': ' + err.message);

            else   
                updateData(result._id);  
        });
 
        function updateData(_id) 
        {
            var set = 
            {
                is_verify: 1,
            };
            users.update({ _id: mongo.helper.toObjectID(_id) },{ $set: set }, function (err, doc) 
            {
                if (err) 
                    deferred.reject(err.name + ': ' + err.message);
                else
                    deferred.resolve({msg:'Email Verified'});
            });
        }
    }

    else
    {
        deferred.reject( "Link is expired");
    
    }
    return deferred.promise;

}

//////////////send verify email when user signup///////////////////////////
function verify_send_email(info)
{    
    nodemailer.createTestAccount((err, account) => 
    {

        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
        host: 'mail.mwancloud.com',
        port: 25,
        secure: false,
        tls:{
        rejectUnauthorized: false
        }, // true for 465, false for other ports
        auth: {
            user: 'workonblockchain@mwancloud.com', 
            pass: 'e71$AGVy' 
        }
        });

        // setup email data with unicode symbols
        let mailOptions = 
        {
            from: 'workonblockchain@mwancloud.com', // sender address
            to : info.email,
            subject : "Welcome to TEST",
            text : 'Visit this http://workonblockchain.mwancloud.com/verify_email/'+info.token,
            html : '<p>Hi '+info.name+'</p> <br/> <p> Please click on the link below to verify your email for workonblockchain.com. </p><br/><a href="http://workonblockchain.mwancloud.com/verify_email/'+info.token+'"><H2>Verify Email</H2></a><p>If you cannot click on the link, please copy and paste it into your browser.</p><br/><p>Thanks,</p><p> Work on Blockchain team!</p>'
           
        };

        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => 
        {
            if (error) 
            {
                return console.log(error);
            }
            //console.log('Message sent: %s', info.messageId);
            //console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        });
    });
}

/**************authenticaion functions implementation ends*************/

/**************candidate functions implementation**********************/

////////////get all candidates detail////////////////
function getAll() 
{
    var deferred = Q.defer();  
    CandidateProfile.find().populate('_creator').exec(function(err, result) 
    {
        if (err) 
            return handleError(err);
        else
            deferred.resolve(result);

    });

    return deferred.promise;
}

///////////get specific candidate detail/////////////////////////
function getById(_id) 
{
    var deferred = Q.defer();
    CandidateProfile.findById(_id).populate('_creator').exec(function(err, result) 
    {
        if (err) 
            return handleError(err);
        else
            deferred.resolve(result);


    });

    return deferred.promise;
}

//////////////////register candidate//////////////////
function create(userParam) 
{
    var deferred = Q.defer();
    var count=0;
    users.findOne({ email: userParam.email }, function (err, user) 
    {
         if (err) 
             deferred.reject(err.name + ': ' + err.message);
 
         if (user) 
         {
             deferred.reject('Email "' + userParam.email + '" is already taken');
         } 
         else 
         {
              createUser();
         }
    });
			
     function createUser() 
     {
          var is_verify;
          if(userParam.social_type!="")
          {
              is_verify =1;
          }
          var hashStr = crypto.createHash('md5').update(userParam.email).digest('hex');
          var user_info = {};
          user_info.hash = hashStr;
          user_info.email = userParam.email;
          user_info.name = userParam.first_name;
          user_info.expiry = new Date(new Date().getTime() +  1800 *1000);  
          var token = jwt_hash.encode(user_info,config.secret,'HS256');
          user_info.token = token;
          // set user object to userParam without the cleartext password
          var user = _.omit(userParam, 'password'); 
          // add hashed password to user object
          user.password = bcrypt.hashSync(userParam.password, 10);
          email = userParam.email;
		  email = email.split("@"); 
		  email = md5(email[0]);
		  email = md5(email);
		  let newUser = new users
		  ({
			  email: userParam.email,
			  password: user.password,
			  type: userParam.type,
			  ref_link: email,
			  social_type: userParam.social_type,
			  email_hash: token,
			  is_verify:is_verify
		  });

          newUser.save((err,user)=>
          {
             if(err)
             {
                 deferred.reject(err.name + ': ' + err.message);
             }
             else
             {
                let info = new CandidateProfile
                ({
                    _creator : newUser._id
                });
	
                info.save((err,user)=>
                {
                   if(err)
                   {
                       deferred.reject(err.name + ': ' + err.message);
                   }
                   else
                   { 
                       if(newUser.social_type == "")
                       {
                           verify_send_email(user_info);
                       }
                       deferred.resolve
                       ({
                           _id:user.id,
                           _creator: newUser._id,
                           email_hash:newUser.email_hash,
                           type:newUser.type,
                           email: newUser.email,
						   ref_link: newUser.ref_link,
						   type: newUser.type,
                           token: jwt.sign({ sub: user._id }, config.secret)
                       });
                     }
                  });      
               	}
             });       
         }
   
    return deferred.promise;
}

////////////delete any specific candidate from db//////////////////////////////////
function _delete(_id) {
   var deferred = Q.defer();
   CandidateProfile.remove({ _creator: mongo.helper.toObjectID(_id) },function (err) 
   {
        if (err) 
            deferred.reject(err.name + ': ' + err.message);
 
            users.remove({ _id: mongo.helper.toObjectID(_id) }, function (err) 
            {
                if (err) 
                    deferred.reject(err.name + ': ' + err.message);
                else 
                    deferred.resolve();
            });
    }); 
  
    return deferred.promise;
}

////////////insert candidate wizard "about" panel data////////////////////
function about_data(_id, userParam) 
{
    var deferred = Q.defer();
    var _id = _id;

    CandidateProfile.findOne({ _creator: _id }, function (err, data) 
    {
        if (err) 
            deferred.reject(err.name + ': ' + err.message);

        else 
            updateUser(_id);
        
    });
 
    function updateUser(_id) 
    {

        var set = 
        {   
            first_name:userParam.first_name,
            last_name:userParam.last_name,
            github_account: userParam.github_account,
            stackexchange_account: userParam.exchange_account,
            contact_number: userParam.contact_number,
            nationality: userParam.nationality,
            image:userParam.image_src,
            gender : userParam.gender
        };

        CandidateProfile.update({ _creator: mongo.helper.toObjectID(_id) },{ $set: set },function (err, doc) 
        {
            if (err) 
                deferred.reject(err.name + ': ' + err.message);
            else
                deferred.resolve(set);
        });
    }
 
    return deferred.promise;
}


////////////insert candidate wizard "Job" panel data////////////////////

function job_data(_id, userParam) 
{
    var deferred = Q.defer();
    CandidateProfile.findOne({ _creator: _id }, function (err, data) 
    {
        if (err) 
            deferred.reject(err.name + ': ' + err.message);

        else   
            updateJob(_id);
        
    });
 
    function updateJob(_id) 
    {
        var set = 
        {
            country: userParam.country,
            roles: userParam.roles,
            interest_area: userParam.interest_area,
            expected_salary_currency: userParam.base_currency,
            expected_salary: userParam.expected_salary,
            availability_day: userParam.availability_day
        };
        CandidateProfile.update({ _creator: mongo.helper.toObjectID(_id) },{ $set: set }, function (err, doc) 
        {
            if (err) 
                deferred.reject(err.name + ': ' + err.message);
            else
                deferred.resolve(set);
        });
    }
 
    return deferred.promise;
}

////////////insert candidate wizard "blockchain" panel data////////////////////

function resume_data(_id, userParam) 
{
    var deferred = Q.defer();
    CandidateProfile.findOne({ _creator: _id }, function (err, data) 
    {
        if (err) 
            deferred.reject(err.name + ': ' + err.message);

        else   
            updateResume(_id);
        
    });
 
    function updateResume(_id) 
    {
        var set = 
        {
            why_work: userParam.why_work,
            commercial_platform: userParam.commercial_experience_year,
            experimented_platform: userParam.experience_year,
            platforms: userParam.platforms
        };
        CandidateProfile.update({ _creator: mongo.helper.toObjectID(_id) },{ $set: set }, function (err, doc) 
        {
            if (err) 
                deferred.reject(err.name + ': ' + err.message);
            else
                deferred.resolve(set);
        });
    }
 
    return deferred.promise;
}

////////////insert candidate wizard "experience" panel data////////////////////

function experience_data(_id, userParam)
{
    var deferred = Q.defer();
    CandidateProfile.findOne({ _creator: _id }, function (err, data) 
    {
        if (err) 
            deferred.reject(err.name + ': ' + err.message);

        else   
            updateExp(_id);
        
    });
 
    function updateExp(_id) 
    {
        
        var set = 
        {
            current_salary: userParam.detail.salary,
            languages: userParam.detail.language,
            experience_roles: userParam.language_exp,
            work_experience: userParam.detail.roles,
            work_experience_year : userParam.platform_exp,
            education :  userParam.education,
            history: userParam.work,
            description :userParam.detail.intro,
            current_currency : userParam.detail.current_currency


        };
        CandidateProfile.update({ _creator: mongo.helper.toObjectID(_id) },{ $set: set }, function (err, doc) 
        {
            if (err) 
                deferred.reject(err.name + ': ' + err.message);
            else
                deferred.resolve(set);
        });
    }
 
    return deferred.promise;
}

////////////insert candidate image////////////////////

function save_image(filename,_id) 
{
    var deferred = Q.defer();
    CandidateProfile.findOne({ _creator: _id }, function (err, data) 
    {
        if (err) 
            deferred.reject(err.name + ': ' + err.message);
        else 
            updateImage(_id);
     });
 
    function updateImage(_id) 
    {
        var set = 
        {
           image:filename
        };
 
        CandidateProfile.update({ _creator: mongo.helper.toObjectID(_id) },{ $set: set },function (err, doc) 
        {
            if (err) 
                deferred.reject(err.name + ': ' + err.message);
            else
                deferred.resolve(set);
        });
    }
 
    return deferred.promise;       
}

function update_candidate_profile(_id,userParam)
{
	 var deferred = Q.defer();
	 var _id = _id;
	// console.log(userParam);
	//console.log(userParam.education);
	 CandidateProfile.findOne({ _creator: _id }, function (err, data) 
	 {
	     if (err) 
	         deferred.reject(err.name + ': ' + err.message);

	     else 
	         updateUser(_id);
	        
	 });
	 
	 function updateUser(_id) 
	 {
        var set = 
	    {   
	         first_name:userParam.detail.first_name,
	         last_name:userParam.detail.last_name,
	         github_account: userParam.detail.github_account,
	         stackexchange_account: userParam.detail.exchange_account,
	         contact_number: userParam.detail.contact_number,
	         nationality: userParam.detail.nationality,
	         gender : userParam.detail.gender,
	         country: userParam.detail.country,
	         roles: userParam.detail.roles,
	         interest_area: userParam.detail.interest_area,
	         expected_salary_currency: userParam.detail.base_currency,
	         expected_salary: userParam.detail.expected_salary,
	         availability_day: userParam.detail.availability_day,
	         why_work: userParam.detail.why_work,
	         commercial_platform: userParam.detail.commercial_experience_year,
	         experimented_platform: userParam.detail.experience_year,
	         platforms: userParam.detail.platforms,
	         current_salary: userParam.detail.salary,
	         current_currency : userParam.detail.current_currency,
	         languages: userParam.detail.language,
	         experience_roles: userParam.detail.language_experience_year,
	         work_experience_year : userParam.detail.platform_exp,
	         education :  userParam.education,
	         history: userParam.work,
	         description :userParam.detail.intro
	         
	      };

	      CandidateProfile.update({ _creator: mongo.helper.toObjectID(_id) },{ $set: set },function (err, doc) 
	      {
	          if (err) 
	              deferred.reject(err.name + ': ' + err.message);
	          else
	              deferred.resolve(set);
	      });
	  }
	 
	  return deferred.promise;
}

/**************candidate functions implementation end**********************/

/**************employer functions implementation *************************/

///////////////create employer/////////////////////////////////////////////

function create_employer(userParam) 
{
    var deferred = Q.defer();
    var count=0;
   

     var str = userParam.email;
    var email_split = str.split('@');

    for (var i = 0; i < emails.length; i++) 
    {
        if(emails[i] == email_split[1])
        {
            count++;
        }

    }
    if(count == 1)
    {
        deferred.reject('Please enter your company email');
    }
    else
    {    
        users.findOne({ email: userParam.email }, function (err, user) 
        {
            if (err) 
                deferred.reject(err.name + ': ' + err.message);
 
            if (user) 
            {
                deferred.reject('Email "' + userParam.email + '" is already taken');
            } 
            else 
            {
                createEmployer();
            }
        });
    }

    function createEmployer() 
    {

        var hashStr = crypto.createHash('md5').update(userParam.email).digest('hex');
        var company_info = {};
        company_info.hash = hashStr;
        company_info.email = userParam.email;
        company_info.name = userParam.first_name;
        company_info.expiry = new Date(new Date().getTime() +  1800 *1000);
        var token = jwt_hash.encode(company_info,config.secret,'HS256');
        company_info.token = token;
        // set user object to userParam without the cleartext password
        var user = _.omit(userParam, 'password'); 
        // add hashed password to user object
        user.password = bcrypt.hashSync(userParam.password, 10);
        let newUser = new users
        ({
            email: userParam.email,
            password: user.password,
            type: userParam.type,
            email_hash: token,
               
        });

        newUser.save((err,user)=>
        {
            if(err)
            {
                deferred.reject(err.name + ': ' + err.message);
            }
            else
            {
                let info = new EmployerProfile
                ({
                    _creator : newUser._id,
                    first_name : userParam.first_name,
                    last_name: userParam.last_name,
                    job_title:userParam.job_title,
                    company_name: userParam.company_name,
                    company_website:userParam.company_website,
                    company_phone:userParam.phone_number,
                    company_country:userParam.country,
                    company_city:userParam.city,
                    company_postcode:userParam.postal_code,

                });
                
                info.save((err,user)=>
                {
                    if(err)
                    {
                        deferred.reject(err.name + ': ' + err.message);
                    }
                    else
                    {
                        verify_send_email(company_info);
                        deferred.resolve
                        ({
                             _id:user.id,
                             _creator: newUser._id,
                             type:newUser.type,
                            email_hash:newUser.email_hash,
                            email: newUser.email,
                            token: jwt.sign({ sub: user._id }, config.secret)
                        });
                      }
               });      
            }
        });       
    }
    

    return deferred.promise;
}

///////////////get all companies detail/////////////////////////////////////////////

function getCompany() 
{
    var deferred = Q.defer();
   
    EmployerProfile.find().populate('_creator').exec(function(err, result) 
    {
        if (err) 
            return handleError(err);
        else
            deferred.resolve(result);
        //console.log(result);
    });

    return deferred.promise;
}

///////////////get any specific company detail/////////////////////////////////////////

function get_company_byId(_id) 
{
    var deferred = Q.defer();
    EmployerProfile.findById(_id).populate('_creator').exec(function(err, result) 
    {
        if (err) 
            return handleError(err);
        else
            deferred.resolve(result);


    });

    return deferred.promise;
}


/////////////////////insert company wizard "terms section data"///////////////////////
function company_summary(_id, companyParam) 
{
	
    var deferred = Q.defer();
    var _id = _id;

    EmployerProfile.findOne({ _creator: _id }, function (err, data) 
    {
        if (err) 
            deferred.reject(err.name + ': ' + err.message);

        else 
            updateEmployer(_id);
        
    });
 
    function updateEmployer(_id) 
    {

        var set = 
        {   
        	company_pay:companyParam.company_pay,
        	company_declare:companyParam.company_declare,
        	company_found: companyParam.company_found,
        	only_summary: companyParam.only_summary,
           
        };

        EmployerProfile.update({ _creator: mongo.helper.toObjectID(_id) },{ $set: set },function (err, doc) 
        {
            if (err) 
                deferred.reject(err.name + ': ' + err.message);
            else
                deferred.resolve(set);
        });
    }
 
    return deferred.promise;
}

//////////////insert company wizard "about-company section data"///////////////////
function about_company(_id, companyParam) 
{
    var deferred = Q.defer();
    var _id = _id;

    EmployerProfile.findOne({ _creator: _id }, function (err, data) 
    {
        if (err) 
            deferred.reject(err.name + ': ' + err.message);

        else 
            updateEmployer(_id);
        
    });
 
    function updateEmployer(_id) 
    {

        var set = 
        {   
        	company_founded:companyParam.company_founded,
        	no_of_employees:companyParam.no_of_employees,
        	company_funded: companyParam.company_funded,
        	company_logo: companyParam.company_logo,
        	company_description:companyParam.company_description,       	
           
        };

        EmployerProfile.update({ _creator: mongo.helper.toObjectID(_id) },{ $set: set },function (err, doc) 
        {
            if (err) 
                deferred.reject(err.name + ': ' + err.message);
            else
                deferred.resolve(set);
        });
    }
 
    return deferred.promise;
}

////////////employer image//////////////////////////
function save_employer_image(filename,_id) 
{
    var deferred = Q.defer();
    EmployerProfile.findOne({ _creator: _id }, function (err, data) 
    {
        if (err) 
            deferred.reject(err.name + ': ' + err.message);
        else 
            updateImage(_id);
     });
 
    function updateImage(_id) 
    {
        var set = 
        {
        		company_logo:filename
        };
 
        EmployerProfile.update({ _creator: mongo.helper.toObjectID(_id) },{ $set: set },function (err, doc) 
        {
            if (err) 
                deferred.reject(err.name + ': ' + err.message);
            else
                deferred.resolve(set);
        });
    }
 
    return deferred.promise;       
}

/**************employer functions implementation ends *************************/


function search(data) 
{
    var deferred = Q.defer();

   CandidateProfile.find({ $or: [ { country: {$regex: data}  }, { nationality:{$regex: data} } ] }, function (err, data) 
    {
       
        if (err) deferred.reject(err.name + ': ' + err.message);
        
        if (data) 
        {

            deferred.resolve(data)
         
        } 
        else 
        {
  
            deferred.reject();
        }
    });
 
    return deferred.promise;
}


 

function refreal_email(data){
	var deferred = Q.defer();
    nodemailer.createTestAccount((err, account) => {

        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
        host: 'mail.mwancloud.com',
        port: 25,
        secure: false,
        tls:{
        rejectUnauthorized: false
        }, // true for 465, false for other ports
        auth: {
            user: 'workonblockchain@mwancloud.com', 
            pass: 'e71$AGVy' 
        }
        });

        // setup email data with unicode symbols
        let mailOptions = 
        {
            from: 'workonblockchain@mwancloud.com', // sender address
            to : 'sadiaabbas326@gmail.com',
            subject : "Welcome to TEST",
            text : 'Visit this http://localhost:4200/reset_password/'+hash,
            html : '<a href="http://localhost:4200/reset_password/'+hash+'"><H2>Reset Password</H2></a>'

        };

        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => 
        {
            if (error) 
            {
                return console.log(error);
            }
            //console.log('Message sent: %s', info.messageId);
            //console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        });
    });
}

function get_refr_code(data){
	var deferred = Q.defer();

    users.findOne({ ref_code: data.code }, function (err, user) 
    {
        if (err){ 
            deferred.reject(err.name + ': ' + err.message);
		}
        else{
            deferred.resolve(user);
        }
    });
	return deferred.promise;
}



function get_candidate(user_type) 
{
	var deferred = Q.defer();

    users.find({ type: user_type }, function (err, user) 
    {
       // console.log(bcrypt.compareSync(password, user.password));
        if (err) deferred.reject(err.name + ': ' + err.message);
      
        if (user){
			deferred.resolve({ 
				users:user
			});
        } 
        else 
        {
            deferred.reject("Password didn't match");
            //deferred.resolve();
        }
    });
 
    return deferred.promise;
}


function insert_message(data){
	var deferred = Q.defer();
	let newChat = new chat({
		sender_id: data.sender_id,
		receiver_id: data.receiver_id,
		sender_name: data.sender_name,
		receiver_name: data.receiver_name,
		message: data.message,
		is_read: 0
	});

	newChat.save((err,data)=>
	{
		if(err){
			console.log(err);
			deferred.reject(err.name + ': ' + err.message);
		}
		else{
			console.log('done');
			deferred.resolve({Success:'Msg sent'});
		}
	});
	return deferred.promise;
}

function get_messages(receiver_id,sender_id){
	var deferred = Q.defer();
	/*$or : [
        { $and : [ { receiver_id : {$regex: receiver_id} }, { sender_id : {$regex: sender_id} } ] },
        { $and : [ { receiver_id : {$regex: sender_id} } }, { sender_id : {$regex: receiver_id} } ] }
    ]*/
	chat.find({
		$or : [
			{ $and : [ { receiver_id : {$regex: receiver_id} }, { sender_id : {$regex: sender_id} } ] },
			{ $and : [ { receiver_id : {$regex: sender_id} }, { sender_id : {$regex: receiver_id} } ] }
		]	
		}, function (err, data) 
    {
		if (err){
			console.log(err);
			deferred.reject(err.name + ': ' + err.message);
        }
        else{
			console.log(data);
			deferred.resolve({ 
				datas:data
			});
		}
	});
	return deferred.promise;
}

function get_user_messages(id){
	var deferred = Q.defer();
	chat.find({
		$or:[{receiver_id:{$regex: id}},{sender_id: {$regex: id}}]
	}, function (err, data) 
    {
		if (err){
			console.log(err);
			deferred.reject(err.name + ': ' + err.message);
        }
        else{
			console.log(data);
			deferred.resolve({ 
				datas:data
			});
		}
	});
	return deferred.promise;
}