var config = require('config.json');
var express = require('express');
var router = express.Router();
var userService = require('services/user.service');
var multer = require('multer');
const fileUpload = require('express-fileupload');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname)
  }
});

var upload = multer({ storage: storage }).single('photo');

/******** routes ****************/
///////authenticated routes//////
router.post('/authenticate', authenticate);
router.put('/emailVerify/:email_hash' , emailVerify);
router.put('/forgot_password/:email' , forgot_password);
router.put('/reset_password/:hash' , reset_password);

////////candidate routes//////////
router.post('/register', register);
router.get('/', getAll);
router.get('/current/:id', getCurrent);
router.delete('/:_id', _delete);
router.put('/welcome/about/:_id', about);
router.put('/welcome/job/:_id', job);
router.put('/welcome/resume/:_id', resume);
router.put('/welcome/exp/:_id', experience);
router.post('/image/:_id', image);
router.put('/update_profile/:_id' , update_candidate_profile);

////////company routes///////////
router.post('/create_employer', create_employer);
router.get('/company', getCompany);
router.get('/current_company/:id', getCurrentCompany);
router.put('/company_wizard/:_id',company_summary);
router.put('/about_company/:_id' , about_company);
router.post('/employer_image/:_id', employer_image);

//////referral and chat routes////
router.post('/search' , search_data);
router.post('/send_refreal',refreal_email_send);
router.post('/get_refrence_code',get_refrence_code);
router.post('/get_candidate', get_candidate);
router.post('/insert_message', insert_message);
router.post('/get_messages', get_messages);
router.post('/get_user_messages', get_user_messages);

module.exports = router;

/***********authentication functions **************/

////for login authentication to verify the user////////////////

function authenticate(req, res) 
{
    userService.authenticate(req.body.email, req.body.password).then(function (user) 
    {
        if (user) 
        {
            // authentication successful
            res.json(user);
        } 
        else 
        {
            // authentication failed
            res.json({msg: 'Username or password is incorrect'});
        }
    })
    .catch(function (err) 
    {
        res.json({error: err});
    });
}

///////////verify_email_address////////////////////////////
function emailVerify(req,res)
{
    //console.log(req.params.token);
     userService.emailVerify(req.params.email_hash).then(function (err, data) 
    {
        if (data) 
        {
            res.json(data);
        } 
        else 
        {  
           res.send(err);
        }
    })
   

}

///////////forgot_password////////////////////////////
function forgot_password(req,res)
{
    console.log(req.params.email);
     userService.forgot_password(req.params.email).then(function (err, data) 
    {
        if (data) 
        {
            res.json(data);
        } 
        else 
        {  
           res.send(err);
        }
    })
    .catch(function (err) 
    {
        res.json({error: err});
    });

}

///////////reset_password////////////////////////////
function reset_password(req,res)
{
    console.log(req.params.hash);
     userService.reset_password(req.params.hash,req.body).then(function (err, data) 
    {
        if (data) 
        {
            res.json(data);
        } 
        else 
        {  
           res.send(err);
        }
    })
    .catch(function (err) 
    {
        res.json({error: err});
    });

}

/***********authentication functions ends**************/

/*********** candidate functions *********************/

///////to create new candidate//////////////////////////// 

function register(req, res) 
{
    userService.create(req.body).then(function (data) 
    {
        res.json(data);
    })
    .catch(function (err) 
    {
        res.json({error: err});
    });
}

//////////get sign-up data from db of all candidate////////////

function getAll(req, res) 
{
    userService.getAll().then(function (users) 
    {   
        res.send(users);
    })
    .catch(function (err) 
    {
        res.status(400).send(err);
    });
}

//////////get sign-up data from db of specific candidate////////////

function getCurrent(req, res) 
{
    userService.getById(req.params.id).then(function (user) 
    {
        if (user) 
        {
            res.send(user);
        } 
        else 
        {
            res.sendStatus(404);
        }
    })
    .catch(function (err) 
    {
        res.status(400).send(err);
    });
}


//////////delete sign-up data from db of specific candidate////////////

function _delete(req, res) 
{
    userService.delete(req.params._id).then(function () 
    {
        res.json('success');
    })
    .catch(function (err) 
    {
        res.status(400).send(err);
    });
}

///// for save candidate "about(sign-up)" data in db//////////////////
function about(req,res)
{

    userService.about_data(req.params._id,req.body).then(function (err, data) 
    {
        if (data) 
        {
            res.json(data);
        } 
        else 
        {  
           res.send(err);
        }
    })
    .catch(function (err) 
    {
        res.json({error: err});
    });

}

///// for save  candidate "job(sign-up)" data in db//////////////////

function job(req,res)
{
    userService.job_data(req.params._id,req.body).then(function (err, data) 
    {
        if (data) 
        {
            res.json(data);
        } 
        else 
        {
            res.send(err);
        }
    })
    .catch(function (err) 
    {
        res.json({error: err});
    });
}

///// for save candidate "resume(blockchain experience)" data in db//////////////////

function resume(req,res)
{
    userService.resume_data(req.params._id,req.body).then(function (err, data) 
    {
        if (data) 
        {
            res.json(data);
        } 
        else 
        {
            res.send(err);
        }
    })
    .catch(function (err) 
    {
        res.json({error: err});
    });
}

///// for save candidate "experience(history)" data in db//////////////////

function experience(req,res)
{
    //console.log(req.body);
     userService.experience_data(req.params._id,req.body).then(function (err, data) 
    {
        if (data) 
        {
            res.json(data);
        } 
        else 
        {
            res.send(err);
        }
    })
    .catch(function (err) 
    {
        res.json({error: err});
    });
    //console.log(req.body.experience);
}



///// for save candidate "image(sign-up)"  in db///////////////////

function image(req, res) 
{
    upload(req, res, function (err) 
    {    
        if (err) 
        {
            return
        }
        else
        {
            var path = req.file.filename;
            userService.save_image(path , req.params._id).then(function (err, about) 
            {
                if (about) 
                {
                    res.json(about);
                } 
                else 
                {
                    res.json(err);
                }
            })
            .catch(function (err) 
            {
                res.json({error: err});
            });  
        }

    })    
}

///// for update the candidate profile data ///////////////////

function update_candidate_profile(req, res) 
{
	userService.update_candidate_profile(req.params._id, req.body).then(function (err, data) 
	{
		if (data) 
		{
		     res.json(data);
		} 
		else 
		{  
		     res.send(err);
		}
	})
	.catch(function (err) 
	{
		res.json({error: err});
	});
}

/*********candidate functions end **********/

/********employer functions****************/

///////////Create Employer////////////////////////////
function create_employer(req,res)
{

    userService.create_employer(req.body).then(function (err, data) 
    {
        if (data) 
        {
            res.json(data);
        } 
        else 
        {  
           res.send(err);
        }
    })
    .catch(function (err) 
    {
        res.json({error: err});
    });

}

//////////get sign-up data from db of all companies////////////

function getCompany(req, res) 
{
    userService.getCompany().then(function (users) 
    {   
        res.send(users);
    })
    .catch(function (err) 
    {
        res.status(400).send(err);
    });
}



//////////get sign-up data from db of specific company////////////
function getCurrentCompany(req, res) 
{
    userService.get_company_byId(req.params.id).then(function (user) 
    {
        if (user) 
        {
            res.send(user);
        } 
        else 
        {
            res.sendStatus(404);
        }
    })
    .catch(function (err) 
    {
        res.status(400).send(err);
    });
}

///////////add company summary or Terms& conditions in db////////////////////////////
function company_summary(req,res)
{
    
    userService.company_summary(req.params._id,req.body).then(function (err, data) 
    {
        if (data) 
        {
            res.json(data);
        } 
        else 
        {  
           res.send(err);
        }
    })
    .catch(function (err) 
    {
        res.json({error: err});
    });

}

///////////add company summary or Terms& conditions in db////////////////////////////
function about_company(req,res)
{
    
    userService.about_company(req.params._id,req.body).then(function (err, data) 
    {
        if (data) 
        {
            res.json(data);
        } 
        else 
        {  
           res.send(err);
        }
    })
    .catch(function (err) 
    {
        res.json({error: err});
    });

}


///// for save "employer image(sign-up)"  in db///////////////////

function employer_image(req, res) 
{
    upload(req, res, function (err) 
    {    //console.log(req.file.filename);
        if (err) 
        {
            return
        }
        else
        {
            var path = req.file.originalname;
            userService.save_employer_image(req.file.filename , req.params._id).then(function (err, about) 
            {
                if (about) 
                {
                    res.json(about);
                } 
                else 
                {
                    res.json(err);
                }
            })
            .catch(function (err) 
            {
                res.json({error: err});
            });  
        }

    })    
}


 
/**********employer functions end *************/

function search_data(req,res)
{
    //console.log(req.body.search);
    userService.search(req.body.search).then(function (err, data) 
    {
        if (data) 
        {
            res.json(data);
        } 
        else 
        {  
           res.send(err);
        }
    })
    .catch(function (err) 
    {
        res.json({error: err});
    });
}

//to send email for referral
function refreal_email_send(req, res) {
    userService.refreal_email(req.body).then(function (data){
        console.log('done');
		res.json(data);
    })
    .catch(function (err) 
    {
        res.json({error: err});
    });
}

//use to get referral code of a user
function get_refrence_code(req, res) {
    userService.get_refr_code(req.body).then(function (data){
        console.log('done');
		res.json(data);
    })
    .catch(function (err) 
    {
        res.json({error: err});
    });
}

//////////getting all candidates ////////////

function get_candidate(req, res) 
{
    userService.get_candidate(req.body.type).then(function (user) 
    {
        if (user) 
        {
            res.send(user);
        } 
        else 
        {
            res.sendStatus(404);
        }
    })
    .catch(function (err) 
    {
        res.status(400).send(err);
    });
}

//////////inserting message in DB ////////////

function insert_message(req, res) 
{
    userService.insert_message(req.body).then(function (data) 
    {
        if (data) 
        {
			console.log(data);
            res.send(data);
        } 
        else 
        {
            res.sendStatus(404);
        }
    })
    .catch(function (err) 
    {
        res.status(400).send(err);
    });
}

//////////get messages of a user/company from DB ////////////

function get_messages(req, res) 
{
    userService.get_messages(req.body.receiver_id,req.body.sender_id).then(function (data) 
    {
        if (data) 
        {
            res.send(data);
        } 
        else 
        {
            res.sendStatus(404);
        }
    })
    .catch(function (err) 
    {
        res.status(400).send(err);
    });
}

//////////get messages of a user from DB ////////////

function get_user_messages(req, res) 
{
    userService.get_user_messages(req.body.id).then(function (data) 
    {
        if (data) 
        {
            res.send(data);
        } 
        else 
        {
            res.sendStatus(404);
        }
    })
    .catch(function (err) 
    {
        res.status(400).send(err);
    });
}