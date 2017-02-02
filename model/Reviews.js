var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var reviewSchema=new Schema({

    "Review": String,
    "Cleanliness": Number,
    "Accessibility": Number,
    "Cost": Number,
    "Service": Number,
    "Score": Number,
    "Status": Number,
    "Photo": Buffer,
    "_p_Location":String,
    "ZomatoID": Number,
    "Email": String,
    "IPAddress": String,
    "_id":String
});
module.exports=mongoose.model('Reviews',reviewSchema,'Review');