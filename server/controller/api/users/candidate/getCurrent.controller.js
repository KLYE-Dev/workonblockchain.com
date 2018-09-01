var Q = require('q');
const CandidateProfile = require('../../../../model/candidate_profile');
const logger = require('../../../services/logger');
const filterReturnData = require('../filterReturnData');

//////////get sign-up data from db of specific candidate////////////
console.log("current");
module.exports = function (req, res)
    {
	    //let userId = req.auth.user._id;
        getById(req.params._id).then(function (user)
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

function getById(_id)
{
    var deferred = Q.defer();
   
    CandidateProfile.findById(_id).populate('_creator').exec(function(err, result)
    {
        //console.log(result);
        if (err){
            logger.error(err.message, {stack: err.stack});
            deferred.reject(err.name + ': ' + err.message);
        }
        if(!result)
        {
            CandidateProfile.find({_creator : _id}).populate('_creator' ).exec(function(err, result)
            {
                if (err){
                    logger.error(err.message, {stack: err.stack});
                    deferred.reject(err.name + ': ' + err.message);
                }
                else
                {	
                	var query_result = result[0].toObject();      
                    deferred.resolve(filterReturnData.removeSensativeData(query_result));
                }
            });
        }
        else
        {
        	var query_result = result.toObject();        	
        	deferred.resolve(filterReturnData.removeSensativeData(query_result));
        }


    });

    return deferred.promise;

}