/**
 * Created by tonim on 04/01/2017.
 */

angular.module('GeoFinderApp').controller('RankingCtrl',['$scope','$http','$routeParams','$window','$rootScope',function($scope, $http, $routeParams,$window, $rootScope){
    $scope.range = {
        min: 0,
        max: 99999
    };

    $scope.Campista = function () {
        $scope.range = {
            min: 0,
            max: 150
        };
    };

    $scope.Navegante = function () {
        $scope.range = {
            min: 150,
            max: 300
        };
    };

    $scope.Montanero = function () {
        $scope.range = {
            min: 300,
            max: 450
        };
    };

    $scope.Aventurero= function () {
        $scope.range = {
            min: 450,
            max: 99999
        };
    };
    // when landing on the page get user session
    $http.get('/user/sessionid')
        .success(function(data) {
            $rootScope.UserSessionId = data;
            $rootScope.UserSessionUri = data._id;
        })
        .error(function(data) {
            console.log('not logged');
        });

    // when landing on the page get all the users
    $http.get('/user')
        .success(function(data) {
            $scope.users = data;
            console.log($scope.users);
        })
        .error(function(data) {
            console.log('som error hapened getting the users');
        });

    $scope.getAll = function () {
        $http.get('/user')
            .success(function(data) {
                $scope.users = data;
                console.log($scope.users);
                $scope.range = {
                    min: 0,
                    max: 99999
                };
            })
            .error(function(data) {
                console.log('som error hapened getting the users');
            });
    };
}]);