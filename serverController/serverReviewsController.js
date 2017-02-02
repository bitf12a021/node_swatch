var Reviews=require('../model/Reviews');
var Photo=require('../model/Photo');
var Location=require('../model/Location');

module.exports.allReviews=function(req,res){

}
module.exports.allLocationDetails=function(req,res){
Location.find({},function(err,result){
res.json(result);
});
}
module.exports.oneLocationScore=function(req,res){
var locId = req.param('locId');
console.log(locId);
    
Reviews.find({_p_Location:locId},function(err,result){
var oneLocReview=result;
var cleanScore=0;
var cleanCount=0;
var serviceScore=0;
var serviceCount=0;
var accessScore=0;
var accessCount=0;
var costScore=0;
var costCount=0;
var indexScore=0;
var indexCount=0;
for(var i=0;i<oneLocReview.length;i++){
if(oneLocReview[i].Cleanliness){
cleanScore=cleanScore+oneLocReview[i].Cleanliness;
cleanCount++;

}
if(oneLocReview[i].Service){
serviceScore=serviceScore+oneLocReview[i].Service;
serviceCount++;

}
if(oneLocReview[i].Accessibility){
accessScore=accessScore+oneLocReview[i].Accessibility;
accessCount++;

}
if(oneLocReview[i].Score){
indexScore=indexScore+oneLocReview[i].Score;
indexCount++;

}
if(oneLocReview[i].Cost){
costScore=costScore+oneLocReview[i].Cost;
costCount++;

}
}
var avg1=0;
var avg2=0;
var avg3=0;
var avg4=0;
var avg5=0;
var tempArray=new Array();
if(cleanCount!=0){
avg1=cleanScore/cleanCount;
tempArray.push(avg1);
}
if(accessCount!=0){
avg2=accessScore/accessCount;
tempArray.push(avg2);
}
if(costCount!=0){
avg3=costScore/costCount;
tempArray.push(avg3);
}
if(serviceCount!=0){
avg4=serviceScore/serviceCount;
tempArray.push(avg4);
}
if(indexCount!=0){
avg5=indexScore/indexCount;
tempArray.push(avg5);
}
Location.find({_id:locId},function(err,result){
res.json({"LocationInfo":result,"Cleanliness":avg1,"Accessibility":avg2,"Cost":avg3,"Service":avg4,"Index":avg5});
});
//res.json({"Cleanliness":avg1,"Accessibility":avg2,"Cost":avg3,"Service":avg4,"Index":avg5});

});
}
module.exports.allPhoto=function(req,res){
console.log("In allReviews");

Photo.aggregate([{$lookup:{from:"Review",localField:"_p_Review",foreignField:"_id",as:"Reviewer"}}],function(err,result){
var all=JSON.stringify(result);
console.log(result);
res.json(result);
});

}

//get inforamtion of location based on Id test URL: localhost:3000/api/Location?locId=H62y4ce2kE
module.exports.oneLocationDetails=function(req,res){

//I am searching location based on location ID
var locId = req.param('locId');// receiving parameter from http req object
console.log(locId);
var arr=new Array();
var object={};
console.log("In allLocation");
//here query to get all info of the location based on LocationID
Location.find({_id:locId},function(err,result){
if(err){
console.log('error in allLocation');
res.send(object);//if error sending empty json
}

object.Location=result;
// query result data stored in an array to send back to client
arr.push(result);
//console.log(result);

//here getting reviews of location
//var x="Location$"+result[0]._id.toString(); // I have changed the foriegn key from _p_Location : "Location$key" to _p_Location:"key" Reason: to  aggregate data
var x=result[0]._id.toString(); 
console.log(x);// verifying recieved locId is same as Id of Location recieved in result of above query
// qurey to  get reviews of location based on ID
Reviews.find({_p_Location: x},function(err,result){
if(err){
console.log('error in Reviews');
res.send(object);
}
console.log(result);

object.Review=result;
arr.push(result);// query result data stored in an array to send back to client
console.log(result[3]._id.toString());
var revID="Review$"+result[3]._id.toString();
//here getting photo of location with the help of review here review no 3 has the photo Id thats why I hard code , we can automate it by editing documents
Photo.find({_p_Review:revID},function(err,result){
if(err){
console.log('error in Photos');
res.send(object);
}
object.Photos=result;
arr.push(result);
// here sending all data location, reviews and photo to client
res.json(arr);
});

});

});

}


//other filter functions have same logic but little change because of category we want to filter
module.exports.cleanFilter=function(req,res){

Reviews.aggregate([{$lookup:{from:"Location",localField:"_p_Location",foreignField:"_id",as:"Loc"}}],function(err,result){
//This query will aggregate data from two collections(Review and Location) and return reviews with location info
var object={};

var arr=new Array();
var idArr=new Array();
var scoreArr= new Array();

if(err)
console.log(err);
console.log(result);

for(var i=0;i<result.length;i++){
if(result[i].Loc.length>0){
//if(result[i].Loc[0].Category=="Restaurants"){
var key=result[i].Loc[0]._id.toString();

if(!object[key]){
idArr.push(result[i].Loc[0]._id.toString());
console.log("in if");
for(var j=0;j<result.length;j++){
if(result[j].Loc.length>0){
if(result[j].Loc[0]._id==result[i].Loc[0]._id)
{
console.log(result[j].Loc[0]._id);
arr.push(result[j]);
}
}
}
object[key]=arr;

arr=[];
}
//object[result[i].Loc[0]._id].push(result[i]);
//}

}
}
//console.log(idArr);
for(var k=0;k<idArr.length;k++){
var oneLocReview=object[idArr[k]];
var cleanScore=0;
var cleanCount=0;
for(var i=0;i<oneLocReview.length;i++){
if(oneLocReview[i].Cleanliness){
cleanScore=cleanScore+oneLocReview[i].Cleanliness;
cleanCount++;

}

}
var avg=cleanScore/cleanCount;
if(avg)
scoreArr.push({"LocationId":idArr[k],"avg":avg,"LocationInfo":oneLocReview[0].Loc});
//object[idArr[k]].AvgCleanliness=avg;
else
scoreArr.push({"LocationId":idArr[k],"avg":0,"LocationInfo":oneLocReview[0].Loc});
//object[idArr[k]].AvgCleanliness=0;
}
//Sorting to get top 3
scoreArr.sort(function(obj1, obj2) {
	// descending
	return obj2.avg - obj1.avg;
});
//sending sorted array back
res.json(scoreArr);
});
};


module.exports.accessFilter=function(req,res){
Reviews.aggregate([{$lookup:{from:"Location",localField:"_p_Location",foreignField:"_id",as:"Loc"}}],function(err,result){
var object={};

var arr=new Array();
var idArr=new Array();
var scoreArr= new Array();

if(err)
console.log(err);
console.log("Access filter query result\n"+result);
for(var i=0;i<result.length;i++){
if(result[i].Loc.length>0){
//if(result[i].Loc[0].Category=="Restaurants"){
var key=result[i].Loc[0]._id.toString();

if(!object[key]){
idArr.push(result[i].Loc[0]._id.toString());
console.log("in if");
for(var j=0;j<result.length;j++){
if(result[j].Loc.length>0){
if(result[j].Loc[0]._id==result[i].Loc[0]._id)
{
console.log(result[j].Loc[0]._id);
arr.push(result[j]);
}
}
}
object[key]=arr;

arr=[];
}
//object[result[i].Loc[0]._id].push(result[i]);
//}

}
}
//console.log(idArr);
for(var k=0;k<idArr.length;k++){
var oneLocReview=object[idArr[k]];
var accessScore=0;
var accessCount=0;
for(var i=0;i<oneLocReview.length;i++){
if(oneLocReview[i].Accessibility){
accessScore=accessScore+oneLocReview[i].Accessibility;
accessCount++;

}

}
var avg=accessScore/accessCount;
if(avg)
scoreArr.push({"LocationId":idArr[k],"avg":avg,"LocationInfo":oneLocReview[0].Loc});
//object[idArr[k]].AvgCleanliness=avg;
else
scoreArr.push({"LocationId":idArr[k],"avg":0,"LocationInfo":oneLocReview[0].Loc});
//object[idArr[k]].AvgCleanliness=0;
}

scoreArr.sort(function(obj1, obj2) {
	// descending: top 3
	return obj2.avg - obj1.avg;
});


res.json(scoreArr);
});
};


module.exports.costFilter=function(req,res){
Reviews.aggregate([{$lookup:{from:"Location",localField:"_p_Location",foreignField:"_id",as:"Loc"}}],function(err,result){
var object={};

var arr=new Array();
var idArr=new Array();
var scoreArr= new Array();

if(err)
console.log(err);

for(var i=0;i<result.length;i++){
if(result[i].Loc.length>0){
//if(result[i].Loc[0].Category=="Restaurants"){
var key=result[i].Loc[0]._id.toString();

if(!object[key]){
idArr.push(result[i].Loc[0]._id.toString());
console.log("in if");
for(var j=0;j<result.length;j++){
if(result[j].Loc.length>0){
if(result[j].Loc[0]._id==result[i].Loc[0]._id)
{
console.log(result[j].Loc[0]._id);
arr.push(result[j]);
}
}
}
object[key]=arr;

arr=[];
}
//object[result[i].Loc[0]._id].push(result[i]);
//}

}
}
//console.log(idArr);
for(var k=0;k<idArr.length;k++){
var oneLocReview=object[idArr[k]];
var costScore=0;
var costCount=0;
for(var i=0;i<oneLocReview.length;i++){
if(oneLocReview[i].Cost){
costScore=costScore+oneLocReview[i].Cost;
costCount++;

}

}
var avg=costScore/costCount;
if(avg)
scoreArr.push({"LocationId":idArr[k],"avg":avg,"LocationInfo":oneLocReview[0].Loc});
//object[idArr[k]].AvgCleanliness=avg;
else
scoreArr.push({"LocationId":idArr[k],"avg":0,"LocationInfo":oneLocReview[0].Loc});
//object[idArr[k]].AvgCleanliness=0;
}


scoreArr.sort(function(obj1, obj2) {
	// descending: top 3
	return obj2.avg - obj1.avg;
});
res.json(scoreArr);
});

};

module.exports.wellServedFilter=function(req,res){
Reviews.aggregate([{$lookup:{from:"Location",localField:"_p_Location",foreignField:"_id",as:"Loc"}}],function(err,result){
var object={};

var arr=new Array();
var idArr=new Array();
var scoreArr= new Array();

if(err)
console.log(err);

for(var i=0;i<result.length;i++){
if(result[i].Loc.length>0){
//if(result[i].Loc[0].Category=="Restaurants"){
var key=result[i].Loc[0]._id.toString();

if(!object[key]){
idArr.push(result[i].Loc[0]._id.toString());
console.log("in if");
for(var j=0;j<result.length;j++){
if(result[j].Loc.length>0){
if(result[j].Loc[0]._id==result[i].Loc[0]._id)
{
console.log(result[j].Loc[0]._id);
arr.push(result[j]);
}
}
}
object[key]=arr;

arr=[];
}
//object[result[i].Loc[0]._id].push(result[i]);
//}

}
}
//console.log(idArr);
for(var k=0;k<idArr.length;k++){
var oneLocReview=object[idArr[k]];
var serviceScore=0;
var serviceCount=0;
for(var i=0;i<oneLocReview.length;i++){
if(oneLocReview[i].Service){
serviceScore=serviceScore+oneLocReview[i].Service;
serviceCount++;

}

}
var avg=serviceScore/serviceCount;
if(avg)
scoreArr.push({"LocationId":idArr[k],"avg":avg,"LocationInfo":oneLocReview[0].Loc});
//object[idArr[k]].AvgCleanliness=avg;
else
scoreArr.push({"LocationId":idArr[k],"avg":0,"LocationInfo":oneLocReview[0].Loc});
//object[idArr[k]].AvgCleanliness=0;
}

scoreArr.sort(function(obj1, obj2) {
	// descending: top 3
	return obj2.avg - obj1.avg;
});

res.json(scoreArr);
});

};

module.exports.indexScoreFilter=function(req,res){
Reviews.aggregate([{$lookup:{from:"Location",localField:"_p_Location",foreignField:"_id",as:"Loc"}}],function(err,result){
var object={};

var arr=new Array();
var idArr=new Array();
var scoreArr= new Array();

if(err)
console.log(err);

for(var i=0;i<result.length;i++){
if(result[i].Loc.length>0){
//if(result[i].Loc[0].Category=="Restaurants"){
var key=result[i].Loc[0]._id.toString();

if(!object[key]){
idArr.push(result[i].Loc[0]._id.toString());
console.log("in if");
for(var j=0;j<result.length;j++){
if(result[j].Loc.length>0){
if(result[j].Loc[0]._id==result[i].Loc[0]._id)
{
console.log(result[j].Loc[0]._id);
arr.push(result[j]);
}
}
}
object[key]=arr;

arr=[];
}
//object[result[i].Loc[0]._id].push(result[i]);
//}

}
}
//console.log(idArr);
for(var k=0;k<idArr.length;k++){
var oneLocReview=object[idArr[k]];
var indexScore=0;
var indexCount=0;
for(var i=0;i<oneLocReview.length;i++){
if(oneLocReview[i].Score){
indexScore=indexScore+oneLocReview[i].Score;
indexCount++;

}

}
var avg=indexScore/indexCount;
if(avg)
scoreArr.push({"LocationId":idArr[k],"avg":avg,"LocationInfo":oneLocReview[0].Loc});
//object[idArr[k]].AvgCleanliness=avg;
else
scoreArr.push({"LocationId":idArr[k],"avg":0,"LocationInfo":oneLocReview[0].Loc});
//object[idArr[k]].AvgCleanliness=0;
}

scoreArr.sort(function(obj1, obj2) {
	// descending: top 3
	return obj2.avg - obj1.avg;
});

res.json(scoreArr);
});

};


module.exports.calcRankFilter=function(req,res){
    console.log('ok here');
    Reviews.find({},function(err,result){
        for(var i=0;i<result.length;i++){
            if(result[i]._p_Location!=undefined){
                if(result[i]._p_Location.length>10){
            var previousValue=result[i]._p_Location;
            var query={'_p_Location':previousValue},
                options = { multi: true };
            var newValue=result[i]._p_Location.split('$');
            console.log(newValue[1]);
            Reviews.update(query,{ $set: { _p_Location:  newValue[1]}}, options, function(err,result){console.log('updated');});
                    }
            }
        }
    });
Reviews.aggregate([{$lookup:{from:"Location",localField:"_p_Location",foreignField:"_id",as:"Loc"}}],function(err,result){
var object={};

var arr=new Array();
var idArr=new Array();
var scoreArr= new Array();

if(err)
console.log(err);

for(var i=0;i<result.length;i++){
if(result[i].Loc.length>0){
//if(result[i].Loc[0].Category=="Restaurants"){
var key=result[i].Loc[0]._id.toString();

if(!object[key]){
idArr.push(result[i].Loc[0]._id.toString());
console.log("in if");
for(var j=0;j<result.length;j++){
if(result[j].Loc.length>0){
if(result[j].Loc[0]._id==result[i].Loc[0]._id)
{
console.log(result[j].Loc[0]._id);
arr.push(result[j]);
}
}
}
object[key]=arr;

arr=[];
}
//object[result[i].Loc[0]._id].push(result[i]);
//}

}
}
//console.log(idArr);
for(var k=0;k<idArr.length;k++){
var oneLocReview=object[idArr[k]];
var cleanScore=0;
var cleanCount=0;
var serviceScore=0;
var serviceCount=0;
var accessScore=0;
var accessCount=0;
var costScore=0;
var costCount=0;
var indexScore=0;
var indexCount=0;
var revLen=oneLocReview.length;
console.log(revLen);
for(var i=0;i<oneLocReview.length;i++){
if(oneLocReview[i].Cleanliness){
cleanScore=cleanScore+oneLocReview[i].Cleanliness;
cleanCount++;

}
if(oneLocReview[i].Service){
serviceScore=serviceScore+oneLocReview[i].Service;
serviceCount++;

}
if(oneLocReview[i].Accessibility){
accessScore=accessScore+oneLocReview[i].Accessibility;
accessCount++;

}
if(oneLocReview[i].Score){
indexScore=indexScore+oneLocReview[i].Score;
indexCount++;

}
if(oneLocReview[i].Cost){
costScore=costScore+oneLocReview[i].Cost;
costCount++;

}
}
var avg1=0;
var avg2=0;
var avg3=0;
var avg4=0;
var avg5=0;
var tempArray=new Array();
if(cleanCount!=0){
avg1=cleanScore/cleanCount;
tempArray.push(avg1);
}
if(accessCount!=0){
avg2=accessScore/accessCount;
tempArray.push(avg2);
}
if(costCount!=0){
avg3=costScore/costCount;
tempArray.push(avg3);
}
if(serviceCount!=0){
avg4=serviceScore/serviceCount;
tempArray.push(avg4);
}
if(indexCount!=0){
avg5=indexScore/indexCount;
tempArray.push(avg5);
}
var sum=0;
for(var d=0;d<tempArray.length;d++)
{
sum=sum+tempArray[d];
}
var average=0;
if(sum&&tempArray.length)
average=sum/5;

scoreArr.push({"LocationId":idArr[k],"avg":average,"LocationInfo":oneLocReview[0].Loc,"Cleanliness":avg1,"Accessibility":avg2,"Cost":avg3,"Service":avg4,"Index":avg5});


}

scoreArr.sort(function(obj1, obj2) {
	// descending: top 3
	return obj2.avg - obj1.avg;
});

res.json(scoreArr);
});
};


module.exports.getUserReview=function(req,res){
var userId = "_User$"+req.param('userId');
console.log(userId);
Reviews.find({_p_Creator:userId},function(err,result){

res.json(result);
});
}



module.exports.oneLocationRanking=function(req,res){
var locId = req.param('locId');
Reviews.aggregate([{$lookup:{from:"Location",localField:"_p_Location",foreignField:"_id",as:"Loc"}}],function(err,result){
var object={};

var arr=new Array();
var idArr=new Array();
var scoreArr= new Array();

if(err)
console.log(err);

for(var i=0;i<result.length;i++){
if(result[i].Loc.length>0){
//if(result[i].Loc[0].Category=="Restaurants"){
var key=result[i].Loc[0]._id.toString();

if(!object[key]){
idArr.push(result[i].Loc[0]._id.toString());
console.log("in if");
for(var j=0;j<result.length;j++){
if(result[j].Loc.length>0){
if(result[j].Loc[0]._id==result[i].Loc[0]._id)
{
console.log(result[j].Loc[0]._id);
arr.push(result[j]);
}
}
}
object[key]=arr;

arr=[];
}
//object[result[i].Loc[0]._id].push(result[i]);
//}

}
}
//console.log(idArr);
for(var k=0;k<idArr.length;k++){
var oneLocReview=object[idArr[k]];
var cleanScore=0;
var cleanCount=0;
var serviceScore=0;
var serviceCount=0;
var accessScore=0;
var accessCount=0;
var costScore=0;
var costCount=0;
var indexScore=0;
var indexCount=0;
for(var i=0;i<oneLocReview.length;i++){
if(oneLocReview[i].Cleanliness){
cleanScore=cleanScore+oneLocReview[i].Cleanliness;
cleanCount++;

}
if(oneLocReview[i].Service){
serviceScore=serviceScore+oneLocReview[i].Service;
serviceCount++;

}
if(oneLocReview[i].Accessibility){
accessScore=accessScore+oneLocReview[i].Accessibility;
accessCount++;

}
if(oneLocReview[i].Score){
indexScore=indexScore+oneLocReview[i].Score;
indexCount++;

}
if(oneLocReview[i].Cost){
costScore=costScore+oneLocReview[i].Cost;
costCount++;

}
}
var avg1=cleanScore/cleanCount;
var avg2=costScore/costCount;
var avg3=serviceScore/serviceCount;
var avg4=accessScore/accessCount;
var avg5=indexScore/indexCount;
var tempObject={};
tempObject.LocationId=idArr[k];
if(avg1)
tempObject.Cleanliness=avg1;
else
tempObject.Cleanliness=0;
if(avg2)
tempObject.Cost=avg2;
else
tempObject.Cost=0;
if(avg3)
tempObject.Service=avg3;
else
tempObject.Service=0;
if(avg4)
tempObject.Accessibility=avg4;
else
tempObject.Accessibility=0;
if(avg5)
tempObject.IndexScore=avg5;
else
tempObject.IndexScore=0;

tempObject.LocationInfo=oneLocReview[0].Loc;


scoreArr.push(tempObject);


}

var cleanRank=0,accessRank=0,costRank=0,serviceRank=0,indexRank=0;
//console.log(scoreArr);
scoreArr.sort(function(obj1, obj2) {
	return obj2.Cleanliness - obj1.Cleanliness;
});
cleanRank=scoreArr.map(function(e) { return e.LocationId; }).indexOf(locId)+1;
scoreArr.sort(function(obj1, obj2) {
	return obj2.Cost - obj1.Cost;
});
costRank=scoreArr.map(function(e) { return e.LocationId; }).indexOf(locId)+1;

scoreArr.sort(function(obj1, obj2) {
	return obj2.Accessibility - obj1.Accessibility;
});
accessRank=scoreArr.map(function(e) { return e.LocationId; }).indexOf(locId)+1;

scoreArr.sort(function(obj1, obj2) {
	return obj2.IndexScore - obj1.IndexScore;
});
indexRank=scoreArr.map(function(e) { return e.LocationId; }).indexOf(locId)+1;
scoreArr.sort(function(obj1, obj2) {
	return obj2.Service - obj1.Service;
});
serviceRank=scoreArr.map(function(e) { return e.LocationId; }).indexOf(locId)+1;

var responseObject={"Cleanliness":cleanRank,"Accessibility":accessRank,"Service":serviceRank,"Cost":costRank,"Index":indexRank};
console.log(responseObject);
res.json(responseObject);
});
}

module.exports.oneLocationReview=function(req,res){
var locId = req.param('locId');
Reviews.find({_p_Location:locId},function(err,results){
res.json(results);
});
}




