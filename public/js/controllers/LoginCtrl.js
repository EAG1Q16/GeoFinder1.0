/**
 * Created by tonim on 21/10/2016.
 */
angular.module('GeoFinderApp').controller('LoginCtrl',['$scope','$location','$rootScope','$http','$routeParams', function($scope, $location, $rootScope, $http, $routeParams){

    $scope.LogUser = {};

    $scope.LoginUser = function(){
        $http.post('/user/login', $scope.LogUser)
            .success(function(data){
                $scope.LogUser = {}; //clear the form
                $location.path('/index');
            })
            .error(function(data){
                console.log('Error:' + data);
            });
    };

}]);