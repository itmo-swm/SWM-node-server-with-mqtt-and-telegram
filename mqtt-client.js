var config = require('./config');
const mqtt = require('mqtt');
const client = mqtt.connect(config.mosquito_broker);

var PUB_AUTHENTICATE_TOPIC = "SERVER/Authenticate";
var PUB_WASTE_TOPIC = "SERVER/Waste";
var SUB_AUTHENTICATE_TOPIC = "SGB/Authenticate";
var SUB_WASTE_TOPIC = "SGB/Waste";

var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider(config.rpc_server+':'+config.rpc_port));

var TheBank = web3.eth.contract(JSON.parse(proj_config.ABI.TheBank)),
    TheBankContract = TheBank.at(proj_config.address.TheBank);
    
client.subscribe(SUB_AUTHENTICATE_TOPIC);
client.subscribe(SUB_WASTE_TOPIC);

console.log("Edge-hub listening to "+SUB_AUTHENTICATE_TOPIC+ " and "+SUB_WASTE_TOPIC);  


client.on('message', function(topic, incoming_message){  
    
    message = incoming_message.toString();
    /*console.log("Topic: "+ topic +" Message: "+message);
    console.log('Redis cache: '+redis.get(message));*/


    if(topic === SUB_AUTHENTICATE_TOPIC){

        // check the transaction table for the random string.
        // if the string exists, send open message
        

        client.publish(PUB_AUTHENTICATE_TOPIC, response);
        
    }else if(topic === SUB_WASTE_TOPIC){

        var msg = JSON.parse(message);

        console.log("user: "+msg.user_address, "sgb: "+msg.sgb_id, "amt: "+msg.waste_amt, "owner: "+msg.sgb_owner);
        // a web3 call is to be made here. The SGBManager saves the transaction and calculates the price and returns it in callback
        // when the price is received, another request is made TheBank contract to make the transfer from the bank to the SGB owner which would be the ComDAO in this case

        /*client.publish(PUB_WASTE_TOPIC);*/


        ComDAO.addRecord(message.user_address, message.sgb_id, message.waste_amt, message.sgb_owner).then(function(price){

            var charge = price.valueOf();
            TheBank.payOnUsersBehalf(message.user_address,message.sgb_owner,charge, {from: config.address.TheBank }).then(function(res){

                console.log(res);
                // do stuff here
            });


        });

        
    }else{

        client.publish(PUB_AUTHENTICATE_TOPIC,"Response topic unknown");
        console.log("Incorrect");   
    }
    
    return;
});

