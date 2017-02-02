

//client side script 
var app= angular.module('reviewApplication',['ngResource']);
app.controller('ReviewController',function($timeout,$scope,$resource)
{
    var Reviews= $resource('/api/Reviews');
    var LocationRanking=$resource('/api/CalculateRank');
    var LocationCleanlinessRanking=$resource('/api/CleanlinessFilter');
    var LocationAccessibilityRanking=$resource('/api/AccessibleFilter');
    var LocationCostRanking=$resource('/api/CostFilter');
    var LocationServiceRanking=$resource('/api/WellServedFilter');
    var LocationScores=$resource('/api/getLocationScore');
    var LocationRankings=$resource('/api/AllRankingOfLocId');
  $timeout(function(){
     LocationRanking.query(function(results){
         $scope.Location1=results[0];
         $scope.Location2=results[1];
         $scope.Location3=results[2];
         $scope.AllResult=results;
     });
      
     LocationCleanlinessRanking.query(function(results){
         $scope.CleanLocation1=results[0];
         $scope.CleanLocation2=results[1];
         $scope.CleanLocation3=results[2];
     });
     LocationAccessibilityRanking.query(function(results){
         $scope.AccessibleLocation1=results[0];
         $scope.AccessibleLocation2=results[1];
         $scope.AccessibleLocation3=results[2];
     });
     LocationCostRanking.query(function(results){
         $scope.CostLocation1=results[0];
         $scope.CostLocation2=results[1];
         $scope.CostLocation3=results[2];
     });
      LocationServiceRanking.query(function(results){
         $scope.ServiceLocation1=results[0];
         $scope.ServiceLocation2=results[1];
         $scope.ServiceLocation3=results[2];
     });
      /*LocationRankings.query({locId:"P3j4SZC5cC"},function(results){
          $scope.AllRankingOfLoc=results;
          
      });
      LocationScores.query({locId:"P3j4SZC5cC"},function(results){
          $scope.AllScoresOfLoc=results;
      });*/
      
    });
    

    
    
    
});