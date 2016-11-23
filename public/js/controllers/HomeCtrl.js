angular.module('GeoFinderApp').controller('HomeCtrl',['$scope','$location','$rootScope','$http','$routeParams', '$window', function($scope, $location, $rootScope, $http, $routeParams, $window){

    // when landing on the page get user
    $http.get('/user/sessionid')
        .success(function(data) {
            $rootScope.UserSessionId = data;
            $rootScope.UserSessionUri = data._id;
            console.log($rootScope.UserSessionId);
            $scope.UserHome = data;
            console.log($scope.UserHome.adventures.created.length)

        })
        .error(function(data) {
            console.log('not logged');
        });

}]);