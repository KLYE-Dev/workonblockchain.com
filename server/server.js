require('rootpath')();
var express = require('express');
var app = express();
var cors = require('cors');
var bodyParser = require('body-parser');
var expressJwt = require('express-jwt');
var config = require('config.json');
 var mongoose = require('mongoose');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
 
// use JWT auth to secure the api, the token can be passed in the authorization header or querystring
/*app.use(expressJwt({
    secret: config.secret,
    getToken: function (req) {
        if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
            return req.headers.authorization.split(' ')[1];
        } else if (req.query && req.query.token) {
            return req.query.token;
        }
        return null;
    }
}).unless({ path: ['/users/authenticate', '/users/register'] }));*/
 
// routes
app.use('/users', require('./controller/users.controller'));

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/blockchain');

//on connection
mongoose.connection.on('connected',()=>
{
    console.log('Connected to mongodb database at 27017');
});

mongoose.connection.on('error',(err)=>
{
    if(err)
    {
        console.log('Error in database connection'+ err);
    }
});
// start server
var port = process.env.NODE_ENV === 'production' ? 80 : 4000;
var server = app.listen(port, function () 
{
    console.log('Server listening on port ' + port);
});