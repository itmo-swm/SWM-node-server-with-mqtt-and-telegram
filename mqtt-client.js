var config = require('./config');
const mqtt = require('mqtt');
const client = mqtt.connect(config.mosquito_broker);
const request = require('request');

var PUB_AUTHENTICATE_TOPIC = "SERVER/Authenticate";
var PUB_WASTE_TOPIC = "SERVER/Waste";
var SUB_AUTHENTICATE_TOPIC = "SGB/Authenticate";
var SUB_WASTE_TOPIC = "SGB/Waste";

var rpc_server = "http://"+config.rpc_server+":"+config.rpc_port;
var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider(rpc_server));

var TheBank = web3.eth.contract(JSON.parse(config.ABI.TheBank)),
TheBankContract = TheBank.at(config.address.TheBank),
ComDAO = web3.eth.contract(JSON.parse(config.ABI.ComDAO)),
ComDAOContract = ComDAO.at(config.address.ComDAO);

var mongoose = require('mongoose'),
SGB = require('./models/sgb'),
Transaction = require('./models/transactions');

client.subscribe(SUB_AUTHENTICATE_TOPIC);
client.subscribe(SUB_WASTE_TOPIC);

console.log("Edge-hub listening to "+SUB_AUTHENTICATE_TOPIC+ " and "+SUB_WASTE_TOPIC);  
client.on('message', function(topic, incoming_message){  
    message = incoming_message.toString();
    if(topic === SUB_AUTHENTICATE_TOPIC){
        // check the transaction table for the random string and the transaction_cost. If transaction_cost is not null, then the qr_code is already used once. So deny it.
        // if the string exists, send open Message
        Transaction.find({qr_code : message,transaction_cost: null }).then(function(res){
            var response = '';
            if(Object.keys(res).length === 0)
                response = '{"open" : "false"}';
            else
                response = '{"open" : "true"}';
            console.log(response);
            client.publish(PUB_AUTHENTICATE_TOPIC, response);                
        });
    }else if(topic === SUB_WASTE_TOPIC){
        var msg = JSON.parse(message);
        console.log("Received from SGB :  sgb: "+msg.sgb_id, "amt: "+msg.waste_amt, "qr_code: " +msg.qr_code );
        // from sgb_id we can get sgb_owner(to), from qr_code we can get user_address(from), from waste_amt we can calculate price of service
        // then we can transfer the given amount from user_account to sgb_owner (which will be ComDAO's account number in TheBank's balanceOf[] )
        // after successfull callback on transfer of PercCoin, we can add send the mqtt request back to the sgb
        Transaction.where({qr_code: msg.qr_code}).findOne().then(function(transaction){
            if(Object.keys(transaction).length === 0){
                client.publish(PUB_WASTE_TOPIC,'{"message": "Waste data received","status":"ERROR","info":"Could not find qr_code in db"}');
            }
            else{
                var user_account = transaction.user_account;
                var sgb_object_id = mongoose.Types.ObjectId(msg.sgb_id);
                SGB.findById(msg.sgb_id).then(function(sgb){
                    var owner_account = sgb.owner_account;                
                    /* 
                        Waste produced is measured in grams. Cost is calculated as 5% of the waste_amt. So, 2500 gm of waste costs 125 cents
                        For convenience and test, we have used 1 PercCoin = 1 Szabo.
                        1 Ether = 10^6 szabo
                        At present, 1 Eth = 50 EUR = 5000 cents
                        So, 5000 Cents = 10^6 szabo
                        Hence, 125 Cents = (10^6/5000)*125 = 25000 Szabo.
                        Decimals arent supported in Solidity, so price is rounded off at last
                        
                     */
                     // getting realtime ether-eur conversion from cryto exchange API
                    request(config.price_api,function(err,res,data){
                        var exchange = Number(JSON.parse(data).price.eur); // converting into euro-cents
                        exchange = exchange * 100; //converting to cent
                        var price_in_cents = msg.waste_amt * sgb.fixed_unit_cost;
                        var service_charge =  (Math.pow(10,6) / exchange) * price_in_cents;
                        service_charge = Math.round(service_charge); 
                        // solidity doesnt take decimal values so rounding the price to nearest whole number szabo value   
                        // the "current_state" of this sgb is to be updated here. This helps to return the most fit waste bin to users using telegram app
                        // waste bin can be sorted based on the amount of waste they have
                        // It can be beneficial to waste collector and waste bin users both
                        sgb.current_state = msg.waste_amt;                                        
                        sgb.save(function(err){
                            if(!err)
                                console.log("Current state of "+sgb._id+" is updated.");
                            else
                                console.log("Couldn't update the current_state of "+sgb.sgb_id);
                        });
                        web3.personal.unlockAccount(config.address.coin_base,config.password.coin_base,5461);
                            /* 
                                It has to be executed from the coin_base account, as the coin_base account is the one that created the bank account
                                So the bank owner is assigned as coin_base account which is the only authorised account to execute this transfer
                            */
                            TheBankContract.payOnUsersBehalf(user_account,owner_account,service_charge,{from: config.address.coin_base},function(err,res){
                                console.log("Transfer of "+service_charge+ " to "+owner_account);
                                // the mongdb transactions collection should be updated here
                                transaction.waste_weight = Number(msg.waste_amt);
                                transaction.transaction_cost = Number(service_charge);
                                transaction.sgb = mongoose.Types.ObjectId(msg.sgb_id); // this is not saving in the database currently
                                transaction.save(function(err){
                                    console.log("Transaction: "+transaction._id+" has been updated");
                                });
                        });
                            client.publish(PUB_WASTE_TOPIC,'{"message": "Waste data received","status":"SUCCESS", "info":"Transaction being mined. Check contract events"}');
                    });
                });
            }
        });
    }else{
        client.publish(PUB_AUTHENTICATE_TOPIC,"Response topic unknown");
        console.log("Incorrect");   
    }
    return;
});

