/**
 * Created by tonim on 14/11/2016.
 */

angular.module('GeoFinderApp').controller('AdventureProfileCtrl',['$scope','$rootScope','$location','$http','$routeParams', function($scope, $rootScope, $location, $http, $routeParams){


    // when landing on the page get adventure
    $http.get('/adventures/id/:id')
        .success(function(data) {

            console.log(data);
            $scope.AdventureProfileInfo = data;

        })
        .error(function(data) {
            console.log('Error: ' + data);
        });

}]);