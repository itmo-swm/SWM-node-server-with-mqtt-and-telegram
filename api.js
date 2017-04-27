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

//shows the balance of two test accounts
route.get('/api/account', function (req, res) {
  	// the api requests the balance of the ComDAO and Shubi from blockchain
  	var shubi_balance_in_wei = TheBank.balanceOf.call(config.address.test_net.Shubi,{from: config.address.test_net.coin_base});
  	var comdao_balance_in_wei = TheBank.balanceOf.call(config.address.test_net.ComDAO,{from: config.address.test_net.coin_base});
  	var shubi_balance_in_ether = blockchain.from_wei(shubi_balance_in_wei,"ether");
  	var comdao_balance_in_ether = blockchain.from_wei(comdao_balance_in_wei,"ether");
  	var response = '{"shubi" : {"wei":"'+shubi_balance_in_wei+'","ETH":"'+shubi_balance_in_ether+'","account":"'+config.address.test_net.Shubi+'"}, "comdao" : {"wei":"'+comdao_balance_in_wei+'","ETH":"'+comdao_balance_in_ether+'","account":"'+config.address.test_net.ComDAO+'"}}';
  	res.send(JSON.parse(response));
});

//returns info of a particular sgb like current_amt_of_waste, percent_filled etc
route.get('/api/info/:sgb_id', function (req, res) {
    
    SGB.findById(req.params.sgb_id).then(function(sgb){

      var response = '{"current_waste_amt": '+ sgb.current_state+', "total_capacity": '+sgb.max_capacity+',"percent_used": '+sgb.percent_used+',"rate":'+sgb.fixed_unit_cost+'}';
      //to enable CORS
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "X-Requested-With");
      res.send(JSON.parse(response));
    }); 
  
});

//returns total waste in the system
route.get('/api/total_waste', function(req,res){

    SGB.aggregate(
                  { 
                    $group: {
                              _id:'',
                              current_state: { $sum: '$current_state'} 
                            } 
                  }, 
                  { 
                    $project: {
                                _id: 0,
                                current_state: '$current_state' 
                              } 
                  }).then(function(result){
                      result = result[0]; //sends an array 
                      //to enable CORS
                      res.header("Access-Control-Allow-Origin", "*");
                      res.header("Access-Control-Allow-Headers", "X-Requested-With");
                      res.send(result);            
                  });

});

// get all the smart bins that are filled certain percent, within a circle of certain radius, and certain center
/*

    Params list:
    percent : what percent of bin is filled 
    radius : the radius of the circle (in km)
    lat and lon : lat,lon of the center of the circle, this lat,lon is the center and above radius is the radius of the circle. 
    All sgb lying within this area is returned.

*/
route.get('/api/filled_bins/:percent/:radius/:lat/:lon', function(req,res){
    var percent = req.params.percent,
        radius = req.params.radius,
        lat = req.params.lat,
        lon = req.params.lon;

    var query = {
                      "location" : {
                          $geoWithin : {
                              $centerSphere : [[lat,lon], kmToRadian(radius)]
                          }
                      },
                      "current_state" : { $gte: percent }
                  };

    SGB.find(query,{ location : 1, current_state: 1, percent_used: 1 }).then(function(result){
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "X-Requested-With");
      res.send(result);            
    });

    /* http://localhost:3000/api/filled_bins/10/3/60.009105/30.279111 */
});


function kmToRadian(distanceInKM){
      
      var earthRadiusInKM = 6371;
      return distanceInKM / earthRadiusInKM;

}


route.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});