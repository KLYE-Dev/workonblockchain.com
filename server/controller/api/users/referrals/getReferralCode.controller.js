var Q = require('q');
const users = require('../../../../model/users');
const logger = require('../../../services/logger');

//use to get referral code of a user

module.exports = function (req, res) {
    //console.log(req.body);
    get_refr_code(req.body).then(function (data){
        console.log('done');
        res.json(data);
    })
        .catch(function (err)
        {
            res.json({error: err});
        });
}

function get_refr_code(data){
    var deferred = Q.defer();

    users.findOne({ ref_link: data.code }, function (err, user)
    {
        if (err){
            logger.error(err.message, {stack: err.stack});
            deferred.reject(err.name + ': ' + err.message);
        }
        else{
            //console.log(user);
            deferred.resolve(user);
        }
    });
    return deferred.promise;
}