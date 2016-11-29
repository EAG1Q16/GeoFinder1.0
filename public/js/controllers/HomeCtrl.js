angular.module('GeoFinderApp').controller('HomeCtrl',['$scope','$location','$rootScope','$http','$routeParams', '$window', function($scope, $location, $rootScope, $http, $routeParams, $window){

    // when landing on the page get user
    $http.get('/user/sessionid')
        .success(function(data) {
            $rootScope.UserSessionId = data;
            $rootScope.UserSessionUri = data._id;
            $scope.UserHome = data;

            // is logges in get users following adventures
            $http.get('/user/recomendedadv/' + $rootScope.UserSessionUri)
                .success(function(data) {
                    $scope.FollowingAdvs = data.following;
                    console.log($scope.FollowingAdvs);
                })
                .error(function(data) {
                    console.log('not logged');
                });
        })
        .error(function(data) {
            console.log('not logged');
        });

}]);