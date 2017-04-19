var config = require('./config');
var rpc_server = "http://"+config.rpc_server_test+":"+config.rpc_port_test;
var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider(rpc_server));

var TheBank = web3.eth.contract(JSON.parse(config.ABI.TheBank)),
	TheBankContract = TheBank.at(config.address.test_net.TheBank),
	ComDAO = web3.eth.contract(JSON.parse(config.ABI.ComDAO)),
	ComDAOContract = ComDAO.at(config.address.test_net.ComDAO);

var from_wei	= function(wei_amt,to){
					return web3.fromWei(wei_amt,to);
				};
var to_wei		= function(amt,frm){
					return web3.toWei(amt,frm);
				};

exports.TheBank = TheBankContract;
exports.ComDAO  = ComDAOContract;
exports.from_wei = from_wei;
exports.to_wei = to_wei;