    var proj_config = require('./config'),
    rpc_server = "http://"+proj_config.rpc_server+":"+proj_config.rpc_port,
    TeleBot = require('telebot'),
    bot = new TeleBot(proj_config.api_key),
    /*web3 = require('web3'),*/
    Blockchain = require('./Blockchain'),
    TheBankContract = Blockchain.TheBank,
    http = require('http'),
    fs = require('fs'),
    randomstring = require("randomstring"),
    request = require('request'),
    qr_image_format = 'png',
    min_bal_required = 0,
    mongoose = require('mongoose'),
    SGB = require('./models/sgb'),
    Transaction = require('./models/transactions');

    // The SGBs lying in a circle with user's location and this radius (in KM) are queried for in the database
    const km_radius = 3;
    const map_marker_colors = ['blue','green','red','orange'];
    bot.use(require('./node_modules/telebot/modules/ask.js'));

    // Buttons
    bot.on(['/hello','/back'], msg => {

      let markup = bot.keyboard([
        
        ['/throw', '/collect','/back', '/hide']
      ], { resize: true });

      return bot.sendMessage(msg.from.id, 'Smart Waste Management Menu.', { markup });

    });

    // Hide keyboard
    bot.on('/hide', msg => {
      return bot.sendMessage(
        msg.from.id, 'Hide keyboard example. Type /back to show.', { markup: 'hide' }
      );
    });

    bot.on('/throw', msg => {

      const id = msg.from.id;
  
      // Ask user name
      return bot.sendMessage(id, 'Please enter your Ethereum account: ', { ask: 'throw' });

    });


    bot.on('ask.throw', msg => {

      let fromId = msg.from.id;
      chat_id = fromId;
      let firstName = msg.from.first_name;
      let reply = msg.message_id;
      //let text = msg.text.split(" ");
      //let account = text[1];
      let account = msg.text;
      //let waste_type = text[2].toUpperCase(); 
      let waste_type = "ORGANIC"; 
      let balance = TheBankContract.balanceOf.call(account,{from: proj_config.address.TheBank}).valueOf();
      balance = Blockchain.from_wei(balance,"ether"); 

      // check if the balance  of use is more than min_balance_required
      if(balance <= min_bal_required)
          return bot.sendMessage(fromId, `Sorry you don't have sufficient balance. Minimum balance needed is 0.25 ETH.`, { reply });

      // insert the user account, waste type , a random_string to generate qr to transactons collection
      var rand_for_qr = randomstring.generate(10);
      var trans_object = prepareTransactionObject(rand_for_qr,account,waste_type);
      trans_object.save(
          function(err){
            if(err)
              console.log(err);
            else
              console.log('successful insertion: '+rand_for_qr);
          });
    
      // generate QR code with the random string
      var qr = require('qr-image'),
      qr_image_format = 'png',
      qr_png = qr.image(rand_for_qr, { type: qr_image_format }),
      qr_image_name = Date.now()+'.'+qr_image_format,
      image_folder = './qr-images/',
      qr_image_path = image_folder + qr_image_name,
      write_stream = fs.createWriteStream(qr_image_path);
      qr_png.pipe(write_stream);
      write_stream.on('close',function(){
        // send QR
        bot.sendPhoto(fromId, qr_image_path , { fileName:qr_image_name });
        // request location
        var response_text = `Dispose. Waste type: `+ waste_type+`. Account balance: `+ balance+ ` Please send your location `;
        var markup = bot.keyboard([[bot.button('location','Send location: ')]],"once"); 
        return bot.sendMessage(fromId, response_text, { markup, ask: 'thrower_location' });
      });
    });

    //listens to the location message of waste thrower
    bot.on('ask.thrower_location', msg => {
      // this location event is fired whenever a location is sent in the chat by the user
      // to map the event with the appropriate chat, the chat id can be mapped.
      const {latitude, longitude} = msg.location;
      console.log(latitude+","+longitude);   
      let fromId = msg.from.id,
      firstName = msg.from.first_name,
      reply = msg.message_id,
      query = getSGBLocationsQuery(latitude,longitude,km_radius);

      // query the db for the closest SGB location where min_bal_required < user.balance
      SGB.findOne(query).then(function(validSGB){  
          if(Object.keys(validSGB).length === 0 )
            return bot.sendMessage(fromId, `Sorry there are no SGB in `+ km_radius +` km circle your location`, { reply });
          //getting ETH to EUR conversion
          //It will be displayed in the google map
          request(proj_config.price_api,function(err,res,data){
            var exchange = JSON.parse(data).price.eur.toFixed(2); 
            var map_url = "https://vast-falls-42691.herokuapp.com/maps/?lat="+validSGB.location.coordinates[0]+"&lon="+validSGB.location.coordinates[1]+"&clat="+latitude+"&clon="+longitude+"&percent_filled="+validSGB.percent_used+"&exchange="+exchange;
            console.log(map_url);
            return bot.sendMessage(fromId, map_url, { reply });
          });
      });       
    });


  bot.on('/collect', msg => {

      const id = msg.from.id;
  
      // Ask user name
      return bot.sendMessage(id, 'Please enter your Ethereum account: ', { ask: 'collect' });

  });


  // It will return all the sgb that are >= 50% filled. There are associated bounties on all the SGBs which is also displayed.
  bot.on('ask.collect', msg => {

    

  });    



    

    function getSGBLocationsQuery(latitude,longitude,radiusInKM){

      var center = {"loc" : {
                            "type" : "Point",
                            "coordinates" : [
                                    latitude,
                                    longitude
                                  ]
                            }
                    }
      // db.sgbs.findOne({"location": { $geoWithin : { $centerSphere : [59.9445047,30.2929776,0.00047088369172814315] } } })
      var query = {
                    "location" : {
                        $geoWithin : {
                            $centerSphere : [center.loc.coordinates, kmToRadian(radiusInKM) ]
                        }
                    }
                };
      return query;  
    }

    function kmToRadian(distanceInKM){
      
      var earthRadiusInKM = 6371;
      return distanceInKM / earthRadiusInKM;

    }

    function prepareTransactionObject(rand_for_qr,user_account,waste_type){

      var trans_data = { 

          "user_account" : user_account,
          "qr_code" : rand_for_qr,
          "waste_type" : waste_type
        };

      return new Transaction(trans_data);
    }

module.exports=bot;