/**
 * Created by tonim on 14/11/2016.
 */

angular.module('GeoFinderApp').controller('PublicAdventureProfileCtrl',['$scope','$rootScope','$window','$location','$http','$routeParams', function($scope, $rootScope, $window, $location, $http, $routeParams){

    var adventureID = window.location.href.split("/").pop();
    console.log(adventureID);

    // when landing on the page get adventure
    $http.get('/adventures/id/' + adventureID)
        .success(function(data) {

            console.log(data);
            $scope.AdventureProfileInfo = data;

        })
        .error(function(data) {
            console.log('Error: ' + data);
        });

}]);