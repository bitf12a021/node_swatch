var Users=require('../model/Users');
module.exports.verifyUser=function(req,res){
    var email = req.param('email');
    //var password = req.param('password');
    console.log(email);
    //console.log(password);

    
    Users.find({email:email},function(err,result){
         
        if(err){
            console.log(err);
            res.send([{value:false}]);
            }
        if(typeof(result[0])!="undefined"){
        if(result[0].email){
            req.session.email=email;
            req.session.username=result[0].username;
            //req.session.password=password;
            res.send([{value:true,username:result[0].username}]);
        }else{
            res.send([{value:false}]);
        }
            }
});

}