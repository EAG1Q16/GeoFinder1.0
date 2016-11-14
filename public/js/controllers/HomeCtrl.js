/**
 * Created by tonim on 14/11/2016.
 */
angular.module('GeoFinderApp').controller('HomeCtrl',['$scope','$location','$rootScope','$http','$routeParams', function($scope, $location, $rootScope, $http, $routeParams){

    // when landing on the page get user
    $http.get('/user/sessionid')
        .success(function(data) {
            $rootScope.UserSessionId = data._id;
            console.log($rootScope.UserSessionId)

        })
        .error(function(data) {
            console.log('not logged');
        });

}]);