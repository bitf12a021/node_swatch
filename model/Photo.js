var mongoose=require('mongoose');
module.exports=mongoose.model('Photo',{ 
         "_created_at": Date,
          "_p_Review": String
},'Photo');