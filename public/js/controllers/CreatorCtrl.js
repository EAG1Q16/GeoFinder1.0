/**
 * Created by mbmarkus on 4/11/16.
 */
angular.module('GeoFinderApp').controller('CreatorCtrl',['$scope','$rootScope','$http','uiGmapGoogleMapApi',
    '$timeout', function($scope, $rootScope, $http, GoogleMapApi, $timeout){


    /**
     * Init zone
     *
     */
    $scope.ErrorMsg = null;
    $scope.SuccessMsg = null;
    $scope.NewAdventure = {};
    $scope.NewHint = {};
    var MapBox = [{"featureType":"water","stylers":[{"saturation":43},{"lightness":-11},{"hue":"#0088ff"}]},{"featureType":"road","elementType":"geometry.fill","stylers":[{"hue":"#ff0000"},{"saturation":-100},{"lightness":99}]},{"featureType":"road","elementType":"geometry.stroke","stylers":[{"color":"#808080"},{"lightness":54}]},{"featureType":"landscape.man_made","elementType":"geometry.fill","stylers":[{"color":"#ece2d9"}]},{"featureType":"poi.park","elementType":"geometry.fill","stylers":[{"color":"#ccdca1"}]},{"featureType":"road","elementType":"labels.text.fill","stylers":[{"color":"#767676"}]},{"featureType":"road","elementType":"labels.text.stroke","stylers":[{"color":"#ffffff"}]},{"featureType":"poi","stylers":[{"visibility":"off"}]},{"featureType":"landscape.natural","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"color":"#b8cb93"}]},{"featureType":"poi.park","stylers":[{"visibility":"on"}]},{"featureType":"poi.sports_complex","stylers":[{"visibility":"on"}]},{"featureType":"poi.medical","stylers":[{"visibility":"on"}]},{"featureType":"poi.business","stylers":[{"visibility":"simplified"}]}];
    var BlackMap = [{"elementType":"geometry","stylers":[{"color":"#242f3e"}]},{"elementType":"labels.text.fill","stylers":[{"color":"#746855"}]},{"elementType":"labels.text.stroke","stylers":[{"color":"#242f3e"}]},{"featureType":"administrative.locality","elementType":"labels.text.fill","stylers":[{"color":"#d59563"}]},{"featureType":"poi","elementType":"labels.text.fill","stylers":[{"color":"#d59563"}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#263c3f"}]},{"featureType":"poi.park","elementType":"labels.text.fill","stylers":[{"color":"#6b9a76"}]},{"featureType":"road","elementType":"geometry","stylers":[{"color":"#38414e"}]},{"featureType":"road","elementType":"geometry.stroke","stylers":[{"color":"#212a37"}]},{"featureType":"road","elementType":"labels.text.fill","stylers":[{"color":"#9ca5b3"}]},{"featureType":"road.highway","elementType":"geometry","stylers":[{"color":"#746855"}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#1f2835"}]},{"featureType":"road.highway","elementType":"labels.text.fill","stylers":[{"color":"#f3d19c"}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#2f3948"}]},{"featureType":"transit.station","elementType":"labels.text.fill","stylers":[{"color":"#d59563"}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#17263c"}]},{"featureType":"water","elementType":"labels.text.fill","stylers":[{"color":"#515c6d"}]},{"featureType":"water","elementType":"labels.text.stroke","stylers":[{"color":"#17263c"}]}];
    $scope.stylemap = "Night";
    $scope.options = {
        styles: MapBox,
        scrollwheel: false
    };
    $scope.windowOptions = {
        visible: false
    };
    $scope.StatusHint = true;
    $scope.SelectedAdv = null;


    /**
     * Map zone
     */

    /**
     *need to do $scope.$apply to trigger the digest cycle when the geolocation arrives and to update all the watchers.
     */
    //Declaración del mapa
    $scope.map = { center: { latitude: 0.1, longitude: 0.1 }, zoom: 2 };

    //Función de golocalización y puesta del marker centrado en pantalla
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position){
            $scope.$apply(function(){
                $scope.map = { center: { latitude: position.coords.latitude, longitude: position.coords.longitude }, zoom: 16 };

                $scope.$watchCollection("marker.coords", function(newVal, oldVal) {
                    $scope.map.center.latitude = $scope.marker.coords.latitude;
                    $scope.map.center.longitude = $scope.marker.coords.longitude;

                    $scope.NewAdventure.location_coordinates = [$scope.marker.coords.longitude, $scope.marker.coords.latitude];
                    $scope.NewHint.location_coordinates = [$scope.marker.coords.longitude, $scope.marker.coords.latitude];
                    console.log($scope.NewAdventure.location_coordinates);
                    if (_.isEqual(newVal, oldVal))
                        return;
                    $scope.coordsUpdates++;
                });

            });
        });
    }
    else if (!navigator.geolocation){
        $scope.ErrorMsg = ('No se ha permitido el acceso a la posición del usuario.');
    }

    $scope.ShowAdventuresonMap = function (){
        var markersAdventures = [];
        $http.get('/adventures/')
            .success(function (data) {
                angular.forEach(data, function (value, key) {
                    //For color icons
                    var dificon;
                    switch (value.difficulty){
                        case "Fácil":
                            dificon = '/images/MapIcons/extended-icons5_101.png';
                            break;
                        case "Mediana":
                            dificon = '/images/MapIcons/extended-icons5_102.png';
                            break;
                        case "Díficil":
                            dificon = '/images/MapIcons/extended-icons5_103.png';
                            break;
                        default:
                            dificon = '/images/MapIcons/extended-icons5_05.png';
                            break;
                    }

                    markersAdventures.push(
                        {
                            name: value.name,
                            description: value.description,
                            image: value.image,
                            difficulty: value.difficulty,
                            _id: value._id,
                            latitude: value.location.coordinates[1],
                            longitude: value.location.coordinates[0],
                            showWindow: false,
                            options: {
                                icon: dificon,
                                animation: 0,
                                title: value.name,
                                labelAnchor: "26 0",
                                labelClass: "marker-labels"
                            }
                        }
                    );
                });
                console.log(markersAdventures);
            })
            .error(function (data) {
                console.log(data);
            })

        $scope.map.markerAdventures = markersAdventures;
    };

    $scope.SwitchStyleMap = function (style){
        switch(style){
            case "Night":
                $scope.options.styles = MapBox;
                break;
            case "Day":
                $scope.options.styles = BlackMap;
                break;
            default:
                $scope.options.styles = MapBox;
                break;
        }
    };

    /**
     * Creator Adventure Zone
     * @constructor
     */


    $scope.CreateAdventure = function(){
        if ($rootScope.UserSessionId._id != null) {

            $scope.NewAdventure.location_type = 'Point';
            $http.post('/adventures/createadventure/', $scope.NewAdventure)
                .success(function (data) {
                    console.log(data);
                    //Reprint Coordinates
                    $scope.NewAdventure.location_coordinates = [$scope.marker.coords.longitude, $scope.marker.coords.latitude];
                    $scope.SuccessMsg = "Adventura creada";
                    $timeout(function () {
                        $scope.SuccessMsg = null;
                    }, 3000);

                    var Newassign = {};
                    Newassign.adventure_id = data._id;
                    Newassign.user_id = $rootScope.UserSessionId._id;

                    $http.post('/user/acreatedadv/', Newassign)
                        .success(function (data) {
                            $scope.NewAdventure = {}; //clear the form
                        })
                        .error(function (data) {
                            console.log('Error:' + data);
                        });
                })
                .error(function (data) {
                    console.log('Error:' + data);
                });
        }
        else $scope.ErrorMsg = ('Es necesario estar registrado');
    };

    /**
     * Hints Zone
     * @constructor
     */

    $scope.CreateHint = function(advid){
        console.log(advid);

        if ($rootScope.UserSessionId._id != null) {

            $scope.NewHint.location_type = 'Point';
            $scope.NewHint._id = advid;

            $http.post('/hints/createhint/', $scope.NewHint)
                .success(function (data) {
                    console.log(data);
                    //Reprint Coordinates
                    $scope.NewHint.location_coordinates = [$scope.marker.coords.longitude, $scope.marker.coords.latitude];
                    $scope.SuccessMsg = "Pista creada";
                    $timeout(function () {
                        $scope.SuccessMsg = null;
                    }, 3000);

                    var Newassign = {};
                    Newassign.hint_id = data._id;
                    Newassign.adventure_id = advid;

                    console.log(Newassign);

                    $http.post('/adventures/ahintdadv/', Newassign)
                        .success(function (data) {
                            $scope.NewHint = {}; //clear the form
                        })
                        .error(function (data) {
                            console.log('Error:' + data);
                        });
                })
                .error(function (data) {
                    console.log('Error:' + data);
                });
        }
        else $scope.ErrorMsg = ('Es necesario estar registrado');
    };

    $scope.ActivHintCreator = function (status) {
        if (status){
            $scope.StatusHint = false;
        }
        else {
            $scope.StatusHint = true;
        }
    };

    $scope.SelAdventureforHint = function (id) {
        console.log(id);
        $scope.SelectedAdv = id;
    };
}]);
