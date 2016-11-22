/**
 * Created by tonim on 17/10/2016.
 */
/**
 * Created by tonim on 05/10/2016.
 */
angular.module('GeoFinderApp').controller('RegisterCtrl',['$scope','$location','$http','$routeParams', function($scope, $location, $http, $routeParams){

    $scope.NewUser = {};

    $scope.RegisterUser = function(){
        $http.post('/user/signup', $scope.NewUser)
            .success(function(data){
                $scope.UserRegistred = {
                    username: $scope.NewUser.username,
                    password: $scope.NewUser.password
                };
                $http.post('/user/login', $scope.UserRegistred)
                    .success(function(data){
                        $location.path('/index');
                    })
                    .error(function(data){
                        console.log('Error:' + data);
                    });
            })
            .error(function(data){
                console.log('Error:' + data);
                $scope.ErrorMsg = (data);
            });
    };

}]);




