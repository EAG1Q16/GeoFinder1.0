/**
 * Created by tonim on 14/11/2016.
 */

angular.module('GeoFinderApp').controller('PublicAdventureProfileCtrl',['$scope','$rootScope','$window','$location','$http','$routeParams', 'uiGmapGoogleMapApi', function($scope, $rootScope, $window, $location, $http, $routeParams, uiGmapGoogleMapApi){

    var adventureID = window.location.href.split("/").pop();
    console.log(adventureID);
    $scope.map = { center: { latitude: 0.1, longitude: 0.1 }, zoom: 2 };

    // when landing on the page get adventure
    $http.get('/adventures/id/' + adventureID)
        .success(function(data) {

            $scope.AdventureProfileInfo = data;
            console.log($scope.AdventureProfileInfo);
            $scope.map = { center: { latitude: $scope.AdventureProfileInfo.location.coordinates[1], longitude: $scope.AdventureProfileInfo.location.coordinates[0] }, zoom: 16 };

            $scope.marker = {
                id: 0,
                coords: {
                    latitude: $scope.map.center.latitude,
                    longitude: $scope.map.center.longitude
                },
                options: {
                    draggable: true
                },
                events: {
                    dragend: function(marker, eventName, args) {

                        $scope.marker.options = {
                            draggable: true,
                            labelContent: "",
                            labelAnchor: "100 0",
                            labelClass: "marker-labels"
                        };
                    }
                }
            };

        })
        .error(function(data) {
            console.log('Error: ' + data);
        });

}]);