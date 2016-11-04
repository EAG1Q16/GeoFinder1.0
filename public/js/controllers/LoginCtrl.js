/**
 * Created by tonim on 21/10/2016.
 */
angular.module('GeoFinderApp').controller('LoginCtrl',['$scope','$http','$routeParams', function($scope, $http, $routeParams){

    $scope.LogUser = {};

    $scope.LoginUser = function(){
        $http.post('/user/login', $scope.LogUser)
            .success(function(data){
                $scope.LogUser = {}; //clear the form
                console.log(data);
                console.log("UserLoged");
            })
            .error(function(data){
                console.log('Error:' + data);
            });
    };

}]);