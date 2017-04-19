var config = require('./config'),
	mongoose = require('mongoose'),
	telegram = require('./telegram'),
	mqtt_client = require('./mqtt-client');
    
mongoose.connect(config.db);
var db = mongoose.connection;

db.on('error', function () {
  throw new Error('unable to connect to database at ' + config.db);
});

// api loaded after mongoose connection
require('./api');

telegram.connect();




    