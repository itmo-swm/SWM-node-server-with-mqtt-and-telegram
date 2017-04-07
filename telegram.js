    var proj_config = require('./config'),
    rpc_server = "http://"+proj_config.rpc_server+":"+proj_config.rpc_port,
    TeleBot = require('telebot'),
    bot = new TeleBot(proj_config.api_key),
    web3 = require('web3'),
    http = require('http'),
    fs = require('fs'),
    randomstring = require("randomstring"),
    qr_image_format = 'png',
    Web3 = require('web3'),
    web3 = new Web3(new Web3.providers.HttpProvider(rpc_server)),
    TheBank = web3.eth.contract(JSON.parse(proj_config.ABI.TheBank)),
    TheBankContract = TheBank.at(proj_config.address.TheBank),
    min_bal_required = 0,
    mongoose = require('mongoose'),
    SGB = require('./models/sgb'),
    Transaction = require('./models/transactions'),
    image_folder = './qr-images';


    if(!fs.exists(image_folder))
       fs.mkdirSync(image_folder);

    // The SGBs lying in a circle with user's location and this radius (in KM) are queried for in the database
    const km_radius = 3;
    const map_marker_colors = ['blue','green','red','orange'];


    bot.on('/dispose', msg => {

      let fromId = msg.from.id;
      chat_id = fromId;
      let firstName = msg.from.first_name;
      let reply = msg.message_id;
      let text = msg.text.split(" ");
      let account = text[1];
      let waste_type = text[2].toUpperCase(); 
      let balance = TheBankContract.balanceOf.call(account,{from: proj_config.address.TheBank}).valueOf();      

      // check if the balance  of use is more than min_balance_required
      if(balance <= min_bal_required)
          return bot.sendMessage(fromId, `Sorry you don't have sufficient balance. Minimum balance needed is 0.25 ETH.`, { reply });

      // insert the user account, waste type , a random_string to generate qr to transactons collection
      var rand_for_qr = randomstring.generate(10);
    
      // generate QR code with the random string
      var qr = require('qr-image'),
      qr_image_format = 'png',
      qr_png = qr.image(rand_for_qr, { type: qr_image_format }),
      qr_image_name = Date.now()+'.'+qr_image_format,
      qr_image_path = image_folder + qr_image_name,
      write_stream = fs.createWriteStream(qr_image_path);
      qr_png.pipe(write_stream);
      write_stream.on('close',function(){
        // send QR
        bot.sendPhoto(fromId, qr_image_path , { fileName:qr_image_name });
        // request location
        var response_text = `Dispose. Waste type: `+ waste_type+`. Account balance: `+ balance+ ` Please send your location `;
        var markup = bot.keyboard([[bot.button('location','Send location: ')]],"once"); 
        return bot.sendMessage(fromId, response_text, { markup });
      });

        
  
    });

    bot.on('location', msg => {

      // this location event is fired whenever a location is sent in the chat by the user
      // to map the event with the appropriate chat, the chat id can be mapped.

      const {latitude, longitude} = msg.location;   
      let fromId = msg.from.id,
      firstName = msg.from.first_name,
      reply = msg.message_id,
      query = getSGBLocationsQuery(latitude,longitude,km_radius);


      console.log(latitude,longitude);
      // query the db for the closest SGB location where min_bal_required < user.balance
      SGB.find(query).then(function(validSGB){  
        /*
            if validSGB is empty, return appropriate messsage
            
        */
          if(Object.keys(validSGB).length === 0 )
            return bot.sendMessage(fromId, `Sorry there are no SGB in `+ km_radius +` km circle your location`, { reply });

          /*
            else 
            // prepare static google map image using the SGB locations returned
            return static google map with location markers
          */
          
          //a sample of how the attributes of markers are to be defined to place in the static google map.
          //color:blue|label:S|60.120326,30.2857044&markers=color:green|label:G|59.9445047,30.2929776&markers=color:red|label:C|59.9399965,30.2963032
          var marker_attribute = "";
          validSGB.forEach(function(item,index){
            console.log("remaining_capacity (in percent): "+item.remaining_capacity);
            marker_attribute += "markers=color:" + map_marker_colors[Math.floor(Math.random() * map_marker_colors.length)] + "|label:"+ (index + 1) + "|";
            marker_attribute += item.location.coordinates[0]+","+item.location.coordinates[1];
            if(index != Object.keys(validSGB).length - 1 )
              marker_attribute += "&";

          });
          var google_static_marker_url = "http://maps.google.com/maps/api/staticmap?zoom=16&size=512x512&maptype=roadmap&"+marker_attribute+"&sensor=false"
          console.log(google_static_marker_url);
          return bot.sendMessage(fromId, google_static_marker_url, { reply });

      });       
    });

/*    bot.on('/location', msg => {

      let fromId = msg.from.id;
      let firstName = msg.from.first_name;
      let reply = msg.message_id;
      console.log("You have requested a location!");
      return bot.sendVenue(fromId, [[59.934280,30.335099],[59.920010,30.345066]], "My Current address","Saint Petersberg, Russia", { reply });
    });
*/

    function getSGBLocationsQuery(latitude,longitude,radiusInKM){

      var center = {"loc" : {
                            "type" : "Point",
                            "coordinates" : [
                                    latitude,
                                    longitude
                                  ]
                            }
                    }

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