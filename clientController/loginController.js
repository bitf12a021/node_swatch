var app= angular.module('authorizeApplication',['ngResource']);
app.controller('SignInController',function($scope,$resource)
{
  
    $scope.login = function () {
        var loginService= $resource('/api/VerifyUser');
        loginService.query({email:$scope.user.email,password:$scope.user.password},function(results){
        if(results[0].value){
            console.log("success");
            window.location ='/';
         
        }
            else
console.log(false);
     });
    };
});
