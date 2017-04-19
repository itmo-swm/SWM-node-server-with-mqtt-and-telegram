var config = { 
				address: 
						{
							'private_net':{

									'TheBank' : '<address>',
									'User1' : '<address>', //can be a ComDAO member
									'User2' : '<address>', //can be a ComDAO member
									'User3' : '<address>', //can be a ComDAO member
									'User4': '<address>', // can be a waste thrower
									'SGBFactory' : '<address>', // the comDAO fund is to be sent to this address, simulating the purchase of SGB from its factory
									'ComDAO' : '<address>',
									'coin_base': '<address>',								

							},

							'test_net':{

								'TheBank' : '<address>',
								'User1' : '<address>',
								'User2' : '<address>',
								'User3' : '<address>',
								'User4': '<address>', // has account in bank
								'SGBFactory' : '<address>', // the comDAO fund is to be sent to this address
								'ComDAO' : '<address>',
								'coin_base': '<address>',								

							}		

						},
				'ABI':{
							'TheBank' : '[{"constant":true,"inputs":[],"name":"totalSupplyOfPercCoin","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"newExchangeRate","type":"uint256"}],"name":"changeExchangeRate","outputs":[{"name":"newRate","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"exchangeRate","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"totalSupplyOfEther","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"bankAddress","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_amt","type":"uint256"}],"name":"transfer","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_amt","type":"uint256"}],"name":"payOnUsersBehalf","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_receiver","type":"address"},{"name":"_amt","type":"uint256"}],"name":"mintCoin","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"inputs":[{"name":"initialExchangeRate","type":"uint256"},{"name":"name","type":"string"},{"name":"symbol","type":"string"}],"payable":false,"type":"constructor"},{"payable":true,"type":"fallback"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_oldRate","type":"uint256"},{"indexed":false,"name":"_newRate","type":"uint256"}],"name":"ExchangeRateChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_from","type":"address"},{"indexed":true,"name":"_to","type":"address"},{"indexed":false,"name":"_amt","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_from","type":"address"},{"indexed":true,"name":"_to","type":"address"},{"indexed":false,"name":"_amt","type":"uint256"}],"name":"BankTransfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_createdAmt","type":"uint256"}],"name":"NewPercCoinsCreated","type":"event"}]',
							'SGBFactory' : '[{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"investmentFrom","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"inputs":[],"payable":false,"type":"constructor"},{"payable":true,"type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"sender","type":"address"},{"indexed":false,"name":"amt","type":"uint256"}],"name":"FundsReceived","type":"event"}]',
							'ComDAO' : '[{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"proposals","outputs":[{"name":"recipient","type":"address"},{"name":"amount","type":"uint256"},{"name":"description","type":"string"},{"name":"votingDeadline","type":"uint256"},{"name":"executed","type":"bool"},{"name":"proposalPassed","type":"bool"},{"name":"numberOfVotes","type":"uint256"},{"name":"currentResult","type":"int256"},{"name":"proposalHash","type":"bytes32"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"targetMember","type":"address"}],"name":"removeMember","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"proposalNumber","type":"uint256"},{"name":"transactionBytecode","type":"bytes"}],"name":"executeProposal","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"sgbCollection","outputs":[{"name":"sgb_id","type":"uint256"},{"name":"lat","type":"string"},{"name":"lon","type":"string"},{"name":"rate","type":"uint256"},{"name":"max_capacity","type":"uint256"},{"name":"current_waste_level","type":"uint256"},{"name":"owner_account","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"memberId","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"recordCollection","outputs":[{"name":"record_id","type":"uint256"},{"name":"user","type":"address"},{"name":"sgb_id","type":"uint256"},{"name":"amount_of_waste","type":"uint256"},{"name":"message","type":"string"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"minimumQuorumForProposals","type":"uint256"},{"name":"minutesForDebate","type":"uint256"},{"name":"marginOfVotesForMajority","type":"int256"},{"name":"congressLeader","type":"address"}],"name":"Congress","outputs":[],"payable":true,"type":"function"},{"constant":true,"inputs":[],"name":"numProposals","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"members","outputs":[{"name":"member","type":"address"},{"name":"name","type":"string"},{"name":"memberSince","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"latitude","type":"string"},{"name":"longitude","type":"string"},{"name":"rate","type":"uint256"},{"name":"max","type":"uint256"},{"name":"current","type":"uint256"},{"name":"owner","type":"address"}],"name":"addSGB","outputs":[{"name":"id","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"debatingPeriodInMinutes","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"minimumQuorum","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_value","type":"uint256"},{"name":"_token","type":"address"},{"name":"_extraData","type":"bytes"}],"name":"receiveApproval","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"majorityMargin","outputs":[{"name":"","type":"int256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"beneficiary","type":"address"},{"name":"etherAmount","type":"uint256"},{"name":"JobDescription","type":"string"},{"name":"transactionBytecode","type":"bytes"}],"name":"newProposal","outputs":[{"name":"proposalID","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"user_address","type":"address"},{"name":"sgb_id","type":"uint256"},{"name":"waste","type":"uint256"},{"name":"message","type":"string"}],"name":"addRecord","outputs":[{"name":"id","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"minimumQuorumForProposals","type":"uint256"},{"name":"minutesForDebate","type":"uint256"},{"name":"marginOfVotesForMajority","type":"int256"}],"name":"changeVotingRules","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"targetMember","type":"address"},{"name":"memberName","type":"string"}],"name":"addMember","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"proposalNumber","type":"uint256"},{"name":"supportsProposal","type":"bool"},{"name":"justificationText","type":"string"}],"name":"vote","outputs":[{"name":"voteID","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"proposalNumber","type":"uint256"},{"name":"beneficiary","type":"address"},{"name":"etherAmount","type":"uint256"},{"name":"transactionBytecode","type":"bytes"}],"name":"checkProposalCode","outputs":[{"name":"codeChecksOut","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"type":"function"},{"payable":true,"type":"fallback"},{"anonymous":false,"inputs":[{"indexed":false,"name":"proposalID","type":"uint256"},{"indexed":false,"name":"recipient","type":"address"},{"indexed":false,"name":"amount","type":"uint256"},{"indexed":false,"name":"description","type":"string"}],"name":"ProposalAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"proposalID","type":"uint256"},{"indexed":false,"name":"position","type":"bool"},{"indexed":false,"name":"voter","type":"address"},{"indexed":false,"name":"justification","type":"string"}],"name":"Voted","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"proposalID","type":"uint256"},{"indexed":false,"name":"result","type":"int256"},{"indexed":false,"name":"quorum","type":"uint256"},{"indexed":false,"name":"active","type":"bool"}],"name":"ProposalTallied","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"member","type":"address"},{"indexed":false,"name":"isMember","type":"bool"}],"name":"MembershipChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"minimumQuorum","type":"uint256"},{"indexed":false,"name":"debatingPeriodInMinutes","type":"uint256"},{"indexed":false,"name":"majorityMargin","type":"int256"}],"name":"ChangeOfRules","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"sgbId","type":"uint256"},{"indexed":true,"name":"message","type":"string"}],"name":"SGBUpdate","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"user","type":"address"},{"indexed":true,"name":"sgb_id","type":"uint256"},{"indexed":false,"name":"waste_amt","type":"uint256"},{"indexed":true,"name":"message","type":"string"}],"name":"RecordUpdate","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"sender","type":"address"},{"indexed":false,"name":"amount","type":"uint256"}],"name":"receivedEther","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_from","type":"address"},{"indexed":false,"name":"_value","type":"uint256"},{"indexed":false,"name":"_token","type":"address"},{"indexed":false,"name":"_extraData","type":"bytes"}],"name":"receivedTokens","type":"event"}]'

					},
				'password' : {

							'coin_base' : '<password>'
				},
				'rpc_server_private' : '<ip>',
				'rpc_port_private'   : 5678,
				'rpc_server_test' : 'localhost',
				'rpc_port_test'   : 8545,
				'api_key':'<telegram api key>',
				'db' : 'mongodb://localhost/smart-waste-management-development',
				'mosquito_broker': 'mqtt://<broker ip>:1883',
				'price_api' : 'https://coinmarketcap-nexuist.rhcloud.com/api/eth',
				'map_url' : 'https://vast-falls-42691.herokuapp.com/maps/' //url for the sgb simulator. It can be found in github

			};


module.exports = config;

