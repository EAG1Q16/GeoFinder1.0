/**
 * Created by mbmarkus on 4/11/16.
 */
angular.module('GeoFinderApp').controller('MapsCtrl',['$scope','$http','uiGmapGoogleMapApi', function($scope, $http, GoogleMapApi){

    $scope.NewAdventure = {};
    var MapBox = [{"featureType":"water","stylers":[{"saturation":43},{"lightness":-11},{"hue":"#0088ff"}]},{"featureType":"road","elementType":"geometry.fill","stylers":[{"hue":"#ff0000"},{"saturation":-100},{"lightness":99}]},{"featureType":"road","elementType":"geometry.stroke","stylers":[{"color":"#808080"},{"lightness":54}]},{"featureType":"landscape.man_made","elementType":"geometry.fill","stylers":[{"color":"#ece2d9"}]},{"featureType":"poi.park","elementType":"geometry.fill","stylers":[{"color":"#ccdca1"}]},{"featureType":"road","elementType":"labels.text.fill","stylers":[{"color":"#767676"}]},{"featureType":"road","elementType":"labels.text.stroke","stylers":[{"color":"#ffffff"}]},{"featureType":"poi","stylers":[{"visibility":"off"}]},{"featureType":"landscape.natural","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"color":"#b8cb93"}]},{"featureType":"poi.park","stylers":[{"visibility":"on"}]},{"featureType":"poi.sports_complex","stylers":[{"visibility":"on"}]},{"featureType":"poi.medical","stylers":[{"visibility":"on"}]},{"featureType":"poi.business","stylers":[{"visibility":"simplified"}]}];
    var BlackMap = [{"elementType":"geometry","stylers":[{"color":"#242f3e"}]},{"elementType":"labels.text.fill","stylers":[{"color":"#746855"}]},{"elementType":"labels.text.stroke","stylers":[{"color":"#242f3e"}]},{"featureType":"administrative.locality","elementType":"labels.text.fill","stylers":[{"color":"#d59563"}]},{"featureType":"poi","elementType":"labels.text.fill","stylers":[{"color":"#d59563"}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#263c3f"}]},{"featureType":"poi.park","elementType":"labels.text.fill","stylers":[{"color":"#6b9a76"}]},{"featureType":"road","elementType":"geometry","stylers":[{"color":"#38414e"}]},{"featureType":"road","elementType":"geometry.stroke","stylers":[{"color":"#212a37"}]},{"featureType":"road","elementType":"labels.text.fill","stylers":[{"color":"#9ca5b3"}]},{"featureType":"road.highway","elementType":"geometry","stylers":[{"color":"#746855"}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#1f2835"}]},{"featureType":"road.highway","elementType":"labels.text.fill","stylers":[{"color":"#f3d19c"}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#2f3948"}]},{"featureType":"transit.station","elementType":"labels.text.fill","stylers":[{"color":"#d59563"}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#17263c"}]},{"featureType":"water","elementType":"labels.text.fill","stylers":[{"color":"#515c6d"}]},{"featureType":"water","elementType":"labels.text.stroke","stylers":[{"color":"#17263c"}]}];
    $scope.stylemap = "Night";

    $scope.options = {
        styles: BlackMap,
        scrollwheel: false
    };

    $scope.map = { center: { latitude: 45, longitude: -73 }, zoom: 16 };
    /**
     *need to do $scope.$apply to trigger the digest cycle when the geolocation arrives and to update all the watchers.
     */

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position){
            $scope.$apply(function(){
                $scope.map = { center: { latitude: position.coords.latitude, longitude: position.coords.longitude }, zoom: 16 };

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

                $scope.coordsUpdates = 0;
                $scope.dynamicMoveCtr = 0;


                $scope.$watchCollection("marker.coords", function(newVal, oldVal) {
                    $scope.map.center.latitude = $scope.marker.coords.latitude;
                    $scope.map.center.longitude = $scope.marker.coords.longitude;

                    $scope.NewAdventure.location_coordinates = [$scope.marker.coords.longitude, $scope.marker.coords.latitude];
                    console.log($scope.NewAdventure.location_coordinates);
                    if (_.isEqual(newVal, oldVal))
                        return;
                    $scope.coordsUpdates++;
                });

            });
        });
    }

    $scope.CreateAdventure = function(){
        $scope.NewAdventure.location_type = 'Point';
        $http.post('/adventures/createadventure/', $scope.NewAdventure)
            .success(function(data){
                $scope.NewAdventure = {}; //clear the form
                console.log(data);
                //Reprint Coordinates
                $scope.NewAdventure.location_coordinates = [$scope.marker.coords.longitude, $scope.marker.coords.latitude];
            })
            .error(function(data){
                console.log('Error:' + data);
            });
    };

    $scope.SwitchStyle = function(style) {
        $scope.options.styles = style;
    };

    $scope.SwitchStyleMap = function (){
        switch($scope.stylemap){
            case "Night":
                $scope.SwitchStyle(MapBox);
                console.log($scope.options.styles);
                $scope.stylemap = "Adventure";
                break;
            case "Adventure":
                $scope.SwitchStyle(BlackMap);
                $scope.stylemap = "Night";
                break;
            default:
                $scope.SwitchStyle(BlackMap);
                $scope.stylemap = "Night";
                break;
        }
    }
}]);
