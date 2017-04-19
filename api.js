var express = require('express'),
	route = express(),
	config = require('./config'),
  mongoose = require('mongoose'),
  SGB = require('./models/sgb'),
  Transaction = require('./models/transactions'),
	blockchain = require('./Blockchain'),
	TheBank = blockchain.TheBank;


route.get('/api/balance/:account', function (req, res) {
  	// the api requests the balance of the user from blockchain
  	var bank_account = req.params.account;
  	var balance_in_wei = TheBank.balanceOf.call(bank_account,{from: config.address.coin_base});
  	var balance_in_eth = blockchain.from_wei(balance_in_wei,"ether");
  	var response = '{"balance_in_wei" : "'+balance_in_wei+'", "balance_in_eth" : "'+balance_in_eth+'"}';
  	res.send(response);
});


route.get('/api/account', function (req, res) {
  	// the api requests the balance of the ComDAO and Shubi from blockchain
  	var shubi_balance_in_wei = TheBank.balanceOf.call(config.address.Shubi,{from: config.address.coin_base});
  	var comdao_balance_in_wei = TheBank.balanceOf.call(config.address.ComDAO,{from: config.address.coin_base});
  	var shubi_balance_in_ether = blockchain.from_wei(shubi_balance_in_wei,"ether");
  	var comdao_balance_in_ether = blockchain.from_wei(comdao_balance_in_wei,"ether");
  	var response = '{"shubi" : {"wei":"'+shubi_balance_in_wei+'","ETH":"'+shubi_balance_in_ether+'","account":"'+config.address.Shubi+'"}, "comdao" : {"wei":"'+comdao_balance_in_wei+'","ETH":"'+comdao_balance_in_ether+'","account":"'+config.address.ComDAO+'"}}';
  	res.send(JSON.parse(response));
});

route.get('/api/info/:sgb_id', function (req, res) {
    
    SGB.findById(req.params.sgb_id).then(function(sgb){

      var response = '{"current_waste_amt": '+ sgb.current_state+', "total_capacity": '+sgb.max_capacity+',"percent_used": '+sgb.percent_used+',"rate":'+sgb.fixed_unit_cost+'}';
      //to enable CORS
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "X-Requested-With");
      res.send(JSON.parse(response));
    }); 
  
});




route.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});