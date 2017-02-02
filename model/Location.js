var mongoose=require('mongoose');
module.exports=mongoose.model('Location',{ 
         "Name":String,
	 "Category":String
	 ,"_id":String
},'Location');

