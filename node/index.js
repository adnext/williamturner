/*
 * web-node
 *
 *
 */

// set up ======================================================================
var express = require('express');
var app = express(); 					// create our app w/ express
var port = process.env.PORT || 5002; 			// set the port
var database = require('./config/database'); 			// load the database config
var cassandra = require('cassandra-driver');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

var dbCli = new cassandra.Client(database);
dbCli.connect(function (err) {
    if (err) {
        console.log('could not connect to cassandra: ' + err.message)
        process.exit(1);
    }
    console.log('connected to cassandra')
});

// configuration ===============================================================
app.use(express.static(__dirname + '/app')); 		// set the static files location /public/img will be /img for users
app.use('/bower_components', express.static('bower_components'));
app.use(morgan('dev')); // log every request to the console
app.use(bodyParser.urlencoded({'extended': 'true'})); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({type: 'application/vnd.api+json'})); // parse application/vnd.api+json as json
app.use(methodOverride('X-HTTP-Method-Override')); // override with the X-HTTP-Method-Override header in the request

// routes ======================================================================
require('./server/routes.js')(app, dbCli);

// listen (start app with node server.js) ======================================
//app.listen(port);

require('./api/turnerApi.js')(port, dbCli);

console.log("App listening on port " + port);
