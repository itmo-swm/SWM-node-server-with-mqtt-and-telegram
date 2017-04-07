var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var SGBSchema = new Schema({
  
                      location : {
                    	            type : { type : String }, //type: "Point" is not supported. Refer http://stackoverflow.com/questions/32199658/create-find-geolocation-in-mongoose 
                    	            coordinates : [ Number, Number ]
                            	 },
                      minimum_balance_required : { type : Number, default: 0.25 },  //user should have at least this balance in their ethereum wallet. The min_bal_required cant be less than 0.25 ETH
                      owner_type : {
                    		             type: String,
                    			           enum: ["PRIVATE", "GOVERNMENTAL", "COMMUNITY" , "JOINT_VENTURE"]
                    			         }, // Only one of these options are possible for owner_type
                      max_capacity 	: { type: Number, required: true }, // Maximum amount of waste it can handle (in KG).
                      current_state : { type: Number, default: 0.00 }, // Current amount of waste sgb has. If Max_capacity - Current State = 2 or less, the is_full flag is set
                      owner_account : { type: String, required: true }, // this is the account to which ether will be transferred from the user account
                      fixed_unit_cost : { type: Number, required: true} // in ETH, it is to be calculated as the total investement on SGB / (No of projected Transaction for return of investment)

                    });


// these are more like model methods. forExample: <SGB_Detail_Schema_object>.date returns the current timestamp
SGBSchema.virtual('timestamp')
  .get(function(){
    return this._id.getTimestamp();
  });

//is_full : Boolean, // shows the current status, will be easier to query this to find out SGBs that are full in an area
SGBSchema.virtual('is_full').get(function(){

	if(this.max_capacity - this.current_state <= 2)
		return true;
	return false;

});

//percent_used : String, // will be easier to query this field to find the probable full SGBs
SGBSchema.virtual('remaining_capacity').get(function(){

	var diff = this.max_capacity - this.current_state;
	return (diff/this.max_capacity)*100;

});

//type of waste virtual function

module.exports = mongoose.model('SGB', SGBSchema);

