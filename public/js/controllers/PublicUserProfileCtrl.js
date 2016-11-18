/**
 * Created by tonim on 14/11/2016.
 */
angular.module('GeoFinderApp').controller('PublicUserProfileCtrl',['$scope','$rootScope','$window','$location','$http','$routeParams', function($scope, $rootScope, $window, $location, $http, $routeParams){

    var puserID = window.location.href.split("/").pop();
    console.log(puserID);

    // when landing on the page get adventure
    $http.get('/user/my/' + puserID)
        .success(function(data) {
            console.log(data);
            $scope.pUserProfileInfo = data;

        })
        .error(function(data) {
            console.log('Error: ' + data);
        });

}]);