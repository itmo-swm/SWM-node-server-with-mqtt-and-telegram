var Blockchain = require('./Blockchain');
var TheBankContract = Blockchain.TheBank;
var web3 = Blockchain.web3;
var config = require('./config');

//console.time("twoThread");
/*web3.personal.unlockAccount(config.address.private_net.coin_base,config.password.coin_base,5461);
TheBankContract.payOnUsersBehalf(config.address.private_net.Shubi,config.address.private_net.ComDAO,"10640561821664184",{from: config.address.private_net.coin_base},function(err,res){
	console.timeEnd("twoThread");
	console.log("err:"+err);
	console.log("res:"+res);
});*/

console.time("read");
console.log(TheBankContract);
var test = TheBankContract.balanceOf.call(config.address.private_net.Shubi,{from: config.address.private_net.coin_base}).valueOf();
console.timeEnd("read");
console.log(test);



