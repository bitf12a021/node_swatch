var express = require('express'),
bodyParser=require('body-parser'),
serverController=require('./serverController/serverReviewsController'),
    loginController=require('./serverController/serverLoginController'),
    session = require('express-session');
    app     = express();
app.use(session({secret: 'makarbasi'}));
app.use(bodyParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
 var mongoose=require('mongoose');
 //connecting to swatchbaharat database
mongoose.connect('mongodb://swatchbharat:yenamandra@ds023438.mlab.com:23438/swatchbharat');



mongoose.connection.on('open',function(){
console.log('opened mongodb');
});
mongoose.connection.on('close',function(){
console.log('closed mongodb');
});
app.get('/swatchbharat',function(req,res){
    
res.sendFile(__dirname+'/login.html');

});
app.get('/',function(req,res){
    var sess=req.session;
    if(sess.email)
        res.sendFile(__dirname+'/index.html');
    else
        res.sendFile(__dirname+'/login.html');

});

app.get('/details',function(req,res){
res.sendFile(__dirname+'/details.html');
});
app.get('/api/VerifyUser',loginController.verifyUser);

app.use('/Contents',express.static(__dirname+'/Contents'));
app.use('/css',express.static(__dirname+'/css'));
app.use('/js',express.static(__dirname+'/js'));
app.use('/fonts',express.static(__dirname+'/fonts'));
app.use('/images',express.static(__dirname+'/images'));
app.use('/img',express.static(__dirname+'/img'));
app.use('/clientController',express.static(__dirname+'/clientController'));
app.get('/api/Reviews',serverController.allReviews);
app.get('/api/Photo',serverController.allPhoto);
//routing urls start this server and browse these urls to test
app.get('/api/AllLocation',serverController.allLocationDetails);// return details of all location
app.get('/api/Location',serverController.oneLocationDetails);//to get location details based on ID
app.get('/api/CleanlinessFilter',serverController.cleanFilter);//to get location based on cleanliness
app.get('/api/AccessibleFilter',serverController.accessFilter);//to get location based on accessibility
app.get('/api/CostFilter',serverController.costFilter);//to get location based on cost
app.get('/api/IndexScoreFilter',serverController.indexScoreFilter);//to get location based on IndexScore
app.get('/api/WellServedFilter',serverController.wellServedFilter);//to get location based on service
app.get('/api/CalculateRank',serverController.calcRankFilter);//to get location based on overall rank
app.get('/api/AllRankingOfLocId',serverController.oneLocationRanking);//return ranking of single location based on id
app.get('/api/getUserReview',serverController.getUserReview);////to get all reviews of a user
app.get('/api/getReviewsByLocId',serverController.oneLocationReview);//to get reviews of one location based on id
app.get('/api/getLocationScore',serverController.oneLocationScore);
app.listen(3001,function(){
    console.log('The server is running, ' +
 ' please open your browser at http://localhost:%s',
 3001);
});