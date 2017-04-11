/* This module calculates the total price of waste disposal for the user. It uses real-time Crypto-exchange API to calculate the price */
/* 
	Waste produced is measured in grams. Cost is calculated as 5% of the waste_amt. So, 2500 gm of waste costs 125 cents
	For convenience and test, we have used 1 PercCoin = 1 Szabo.
	1 Ether = 10^6 szabo
	At present, 1 Eth = 50 EUR = 5000 cents
	So, 5000 Cents = 10^6 szabo
	Hence, 125 Cents = (10^6/5000)*125 = 25000 Szabo.
	Decimals arent supported in Solidity, so price is rounded off at last
	
 */
var config 	= require('./config'),
	request = require('request');
	price_in_szabo = "";
const price_rate = 0.05; // 5% of total waste


var calc = function(waste_amt){
	request(config.price_api,function(err,res,data){
    	var exchange = Number(JSON.parse(data).price.eur); // converting into euro-cents
    	console.log("Ex: "+exchange);
    	exchange = exchange * 100;
    	console.log("ex:"+exchange);
    	var rounded_waste_amt = 2500; // in grams
    	console.log("wa: "+rounded_waste_amt);
		var price_in_cents = rounded_waste_amt * price_rate;
		console.log("pic: "+price_in_cents);
		price_in_szabo =  (Math.pow(10,6) / exchange) * price_in_cents;
		
		console.log("pis: "+Math.round(price_in_szabo));	
 	});
 	
}
calc();
module.exports = calc;
