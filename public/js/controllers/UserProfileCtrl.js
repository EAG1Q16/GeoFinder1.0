/**
 * Created by tonim on 03/11/2016.
 */
angular.module('GeoFinderApp').controller('ProfileCtrl',['$scope','$rootScope','$location','$http','$routeParams', function($scope, $rootScope, $location, $http, $routeParams){
    console.log('Rootscope en profile' + $rootScope.UserSessionId);

    // when landing on the page get user
   $http.get('/user/my/' + $rootScope.UserSessionId)
        .success(function(data) {
            $scope.UserProfileInfo = data;

        })
        .error(function(data) {
            console.log('Error: ' + data);
        });

}]);