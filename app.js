var config = require('./config'),
	mongoose = require('mongoose'),
	telegram = require('./telegram'),
	mqtt_client = require('./mqtt-client');

mongoose.connect(config.db);
var db = mongoose.connection;

db.on('error', function () {
  throw new Error('unable to connect to database at ' + config.db);
});

/*var SGB = require('./models/sgb'),
Transaction = require('./models/transactions');

Transaction.where({qr_code: "LrfQsSJDvc"}).findOne().then(function(transaction){

            if(Object.keys(transaction).length === 0){
                console.log("No data found");
            }
            else{

                var user_account = transaction.user_account;
                SGB.findById("58bb1a6224f4ec03f1e91d04").then(function(sgb){
                	console.log(sgb);
                	if(Object.keys(sgb).length === 0){
		                console.log("No data found");
		            }
                    var owner_account = "0x85ded4eae096d15de9bee720a6e91eb28603a7e6";  
                    var service_charge = 0.05 * 500 * 1000; //fixed unit cost is in ether so converting it to Finney by * 1000
                    // the "current_state" of this sgb is to be updated here. This helps to return the most fit waste bin to users using telegram app
                    // waste bin can be sorted based on the amount of waste they have
                    // It can be beneficial to waste collector and waste bin users both
                    sgb.current_state = 500;                                        
                    sgb.save(function(err){
                        if(!err)
                            console.log("Current state of "+sgb._id+" is updated.");
                        else
                            console.log("Couldn't update the current_state of "+sgb._id);
                    });
                    
                            console.log("Transfer of "+service_charge+ " to "+owner_account);
                        // the mongdb transactions collection should be updated here
                        transaction.waste_weight = Number(500);
                        transaction.transaction_cost = Number(service_charge);
                        transaction.sgb_id = mongoose.Types.ObjectId("58bb1a6224f4ec03f1e91d04");
                        transaction.save(function(err){
                            console.log("Transaction: "+transaction._id+" has been updated");
                        });
                    });
            }
        });
*/

/*const request = require('request');
request(config.price_api,function(err,res,data){
    var info = JSON.parse(data);
    console.log("1 ETH: "+info.price.usd+" EUR");
});
*/

require('./price-calculator');

telegram.connect();

    