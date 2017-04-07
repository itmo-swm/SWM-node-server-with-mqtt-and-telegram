var config = require('./config'),
	mongoose = require('mongoose');
mongoose.connect(config.db);
var db = mongoose.connection;

db.on('error', function () {
  throw new Error('unable to connect to database at ' + config.db);
});

var telegram = require('./telegram');

telegram.connect();