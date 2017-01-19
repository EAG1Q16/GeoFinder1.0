/**
 * Created by mbmarkus on 4/11/16.
 */
angular.module('GeoFinderApp').controller('CreatorCtrl',['$scope','$rootScope','$http','uiGmapGoogleMapApi',
    '$timeout','uiGmapIsReady','$mdDialog','$mdToast', function($scope, $rootScope, $http, GoogleMapApi, $timeout, uiGmapIsReady,
                                         $mdDialog, $mdToast){

    /**
     * Init zone
     *
     */
    $scope.NewAdventure = {};
    $scope.NewHint = {};
    var MapBox = [{"featureType":"water","stylers":[{"saturation":43},{"lightness":-11},{"hue":"#0088ff"}]},{"featureType":"road","elementType":"geometry.fill","stylers":[{"hue":"#ff0000"},{"saturation":-100},{"lightness":99}]},{"featureType":"road","elementType":"geometry.stroke","stylers":[{"color":"#808080"},{"lightness":54}]},{"featureType":"landscape.man_made","elementType":"geometry.fill","stylers":[{"color":"#ece2d9"}]},{"featureType":"poi.park","elementType":"geometry.fill","stylers":[{"color":"#ccdca1"}]},{"featureType":"road","elementType":"labels.text.fill","stylers":[{"color":"#767676"}]},{"featureType":"road","elementType":"labels.text.stroke","stylers":[{"color":"#ffffff"}]},{"featureType":"poi","stylers":[{"visibility":"off"}]},{"featureType":"landscape.natural","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"color":"#b8cb93"}]},{"featureType":"poi.park","stylers":[{"visibility":"on"}]},{"featureType":"poi.sports_complex","stylers":[{"visibility":"on"}]},{"featureType":"poi.medical","stylers":[{"visibility":"on"}]},{"featureType":"poi.business","stylers":[{"visibility":"simplified"}]}];
    var BlackMap = [{"elementType":"geometry","stylers":[{"color":"#242f3e"}]},{"elementType":"labels.text.fill","stylers":[{"color":"#746855"}]},{"elementType":"labels.text.stroke","stylers":[{"color":"#242f3e"}]},{"featureType":"administrative.locality","elementType":"labels.text.fill","stylers":[{"color":"#d59563"}]},{"featureType":"poi","elementType":"labels.text.fill","stylers":[{"color":"#d59563"}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#263c3f"}]},{"featureType":"poi.park","elementType":"labels.text.fill","stylers":[{"color":"#6b9a76"}]},{"featureType":"road","elementType":"geometry","stylers":[{"color":"#38414e"}]},{"featureType":"road","elementType":"geometry.stroke","stylers":[{"color":"#212a37"}]},{"featureType":"road","elementType":"labels.text.fill","stylers":[{"color":"#9ca5b3"}]},{"featureType":"road.highway","elementType":"geometry","stylers":[{"color":"#746855"}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#1f2835"}]},{"featureType":"road.highway","elementType":"labels.text.fill","stylers":[{"color":"#f3d19c"}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#2f3948"}]},{"featureType":"transit.station","elementType":"labels.text.fill","stylers":[{"color":"#d59563"}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#17263c"}]},{"featureType":"water","elementType":"labels.text.fill","stylers":[{"color":"#515c6d"}]},{"featureType":"water","elementType":"labels.text.stroke","stylers":[{"color":"#17263c"}]}];
    $scope.stylemap = "Diurno";
    $scope.options = {
        styles: MapBox,
        scrollwheel: false
    };
    $scope.windowOptions = {
        visible: false
    };
    $scope.SelectedAdv = {};
    
    var el = angular.element(document.getElementById('map'));
    
    /**
     *  Status 
     */
    //Primera Parte
    //Si el Mostrar todas las Aventuras esta activo
    $scope.IsCheckBoxMarkAdvActive = false;
    //Si el MDialog de Creación de Aventura ha sido aplicado
    $scope.IsAdventureInputsFilled = false;
    //Si la Localización de la aventura ha sido aplicada
    $scope.IsAdventurePos = false;
    //Si la primera Pista ha sido rellenada
    $scope.IsFirstHintFilled = false;
    //Si la Aventura ha sido finalizada --> Pasamos a Pistas
    $scope.IsAdventureFinished = false;
    //Activador del Marker
    $scope.IsMarkerCreatorActive = false;

    //Segunda Parte
    $scope.IsNewHintFilled = false;

    //Tabs
    $scope.IsTabVistaActive = true;
    $scope.IsTabAventurasActive = false;
    $scope.IsTabPistasActive = false;

    $scope.SwitchTabs = function (active){
        switch(active){
            case "Vista":
                $scope.IsTabVistaActive = true;
                $scope.IsTabAventurasActive = false;
                $scope.IsTabPistasActive = false;
                break;
            case "Aventuras":
                $scope.IsTabVistaActive = false;
                $scope.IsTabAventurasActive = true;
                $scope.IsTabPistasActive = false;
                break;
            case "Pistas":
                $scope.IsTabVistaActive = false;
                $scope.IsTabAventurasActive = false;
                $scope.IsTabPistasActive = true;
                break;
            default:
                $scope.IsTabVistaActive = true;
                $scope.IsTabAventurasActive = false;
                $scope.IsTabPistasActive = false;
                break;
        }
    };
    /**
     * MDDialog Zone
     */

    $scope.log = function() {
        console.log($scope.NewAdventure);
        console.log($scope.NewHint);
        console.log($scope.SelectedAdv);
    };

    $scope.hide = function() {
        $mdDialog.hide();
    };

    $scope.cancel = function() {
        $scope.NewAdventure = {};
        $scope.NewHint = {};
        $mdDialog.hide();

        $scope.IsAdventureInputsFilled = false;
        //Si la Localización de la aventura ha sido aplicada
        $scope.IsAdventurePos = false;
        //Si la primera Pista ha sido rellenada
        $scope.IsFirstHintFilled = false;
        //Activador del Marker
        $scope.IsMarkerCreatorActive = false;

        $scope.IsNewHintFilled = false;

    };

    $scope.showCustomToast = function() {
        $mdToast.show({
            hideDelay   : 0,
            position    : 'top right',
            controller  : 'CreatorCtrl',
            templateUrl : 'toast-template.html',
            parent: el
        });
    };

    $scope.closeToast = function() {
        if (isDlgOpen) return;

        $mdToast
            .hide()
            .then(function() {
                isDlgOpen = false;
            });
    };

    $scope.openMoreInfo = function(e) {
        if ( isDlgOpen ) return;
        isDlgOpen = true;

        $mdDialog
            .show($mdDialog
                .alert()
                .title('More info goes here.')
                .textContent('Something witty.')
                .ariaLabel('More info')
                .ok('Got it')
                .targetEvent(e)
            )
            .then(function() {
                isDlgOpen = false;
            })
    };


    /**
     * Map zone
     */
    $scope.map = {
        show: true,
        control: {},
        version: "uknown",
        heatLayerCallback: function (layer) {
            //set the heat layers backend data
            var mockHeatLayer = new MockHeatLayer(layer);
        },
        center: {
            latitude: 45,
            longitude: -73
        },
        showTraffic: true,
        showBicycling: false,
        showWeather: false,
        showHeat: false,
        options: {
            streetViewControl: false,
            panControl: false,
            maxZoom: 20,
            minZoom: 3
        },
        zoom: 3,
        dragging: false,
        bounds: {},
        clickedMarker: {
            id: 0,
            options: {}
        }
    };
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

                $scope.map.createMarker = {
                    id: 1,
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    options: {
                        icon: '/images/icons/ic_place_black_48px.svg',
                        animation: google.maps.Animation.DROP,
                        draggable: true,
                        raiseOnDrag: true
                    }
                };


                $scope.$watchCollection("map.createMarker", function(newVal, oldVal) {
                    $scope.map.center.latitude = $scope.map.createMarker.latitude;
                    $scope.map.center.longitude = $scope.map.createMarker.longitude;

                    $scope.NewAdventure.location_coordinates = [$scope.map.createMarker.longitude, $scope.map.createMarker.latitude];
                    $scope.NewHint.location_coordinates = [$scope.map.createMarker.longitude, $scope.map.createMarker.latitude];

                    console.log($scope.NewAdventure.location_coordinates);
                    if (_.isEqual(newVal, oldVal))
                        return;
                });

            });
        });
    }
    else if (!navigator.geolocation){
        $scope.ErrorMsg = ('No se ha permitido el acceso a la posición del usuario.');
    }

    $scope.ShowAdventuresonMap = function (){
        $scope.CleanMap();
        var markersAdventures = [];
        $http.get('/adventures/')
            .success(function (data) {
                angular.forEach(data, function (value, key) {
                    //For color icons
                    var dificon;
                    switch (value.difficulty){
                        case "Fácil":
                            dificon = '/images/icons/extended-icons5_101.png';
                            break;
                        case "Media":
                            dificon = '/images/icons/extended-icons5_102.png';
                            break;
                        case "Díficil":
                            dificon = '/images/icons/extended-icons5_103.png';
                            break;
                        default:
                            dificon = '/images/icons/extended-icons5_05.png';
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

    $scope.ShowHintofAdventureonMap = function (){
        $scope.CleanMap();

        var markersHints = [];
        $http.get('/adventures/id/'+ $scope.SelectedAdv._id)
            .success(function (data) {
                angular.forEach(data.hints, function (value) {
                    markersHints.push(
                        {
                            index: value.index,
                            indication: {
                                distance: value.indication.distance,
                                sense: value.indication.sense
                            },
                            text: value.text,
                            image: value.image,
                            _id: value._id,
                            latitude: value.location.coordinates[1],
                            longitude: value.location.coordinates[0],
                            showWindow: false,
                            options: {
                                icon: '/images/icons/ic_assistant_photo_black_48px.svg',
                                animation: google.maps.Animation.DROP,
                                title: value.text,
                                labelAnchor: "26 0",
                                labelClass: "marker-labels"
                            }
                        }
                    );
                });
                console.log(markersHints);
                $scope.map.markersHints = markersHints;
            })
            .error(function (data) {
                console.log(data);
            });

        };

    $scope.CleanMap = function () {
        $scope.map.markersHints = [];
        $scope.map.markerAdventures = [];
    };

    $scope.CheckBoxMarkersAventure = function () {
        if (!$scope.IsCheckBoxMarkAdvActive){
            $scope.IsCheckBoxMarkAdvActive = true;
            $scope.ShowAdventuresonMap();
        }
        else {
            $scope.IsCheckBoxMarkAdvActive = false;
            $scope.CleanMap();
        }
    };

    $scope.SwitchStyleMap = function (style){
        switch(style){
            case "Diurno":
                $scope.options.styles = MapBox;
                if($scope.IsAdventureInputsFilled){
                    $scope.map.createMarker.options.icon = '/images/icons/ic_place_black_48px.svg';
                }
                angular.forEach($scope.map.markersHints, function (value) {
                    value.options.icon = '/images/icons/ic_assistant_photo_black_48px.svg'
                });
                break;
            case "Nocturno":
                $scope.options.styles = BlackMap;
                if($scope.IsAdventureInputsFilled){
                    $scope.map.createMarker.options.icon = '/images/icons/ic_place_white_48px.svg';
                }
                angular.forEach($scope.map.markersHints, function (value) {
                    value.options.icon = '/images/icons/ic_assistant_photo_white_48px.svg'
                });

                break;
            default:
                $scope.options.styles = MapBox;
                if($scope.IsAdventureInputsFilled){
                    $scope.map.createMarker.options.icon = '/images/icons/ic_place_black_48px.svg';
                }
                angular.forEach($scope.map.markersHints, function (value) {
                    value.options.icon = '/images/icons/ic_assistant_photo_black_48px.svg'
                });
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
            $scope.NewAdventure.hint = {
                direction : 'Test N',
                text: $scope.NewAdventure.hinttext,
                image: $scope.NewAdventure.hintimage
            };

            $http.post('/adventures/createadventure/', $scope.NewAdventure)
                .success(function (data) {
                    //[0] necessario para eliminar el array
                    $scope.SelectedAdv = data;
                    console.log(data);
                    //Reprint Coordinates
                    $scope.NewAdventure.location_coordinates = [$scope.map.createMarker.longitude, $scope.map.createMarker.latitude];

                    var Newassign = {};
                    Newassign.adventure_id = data._id;
                    Newassign.user_id = $rootScope.UserSessionId._id;

                    $http.post('/user/acreatedadv/', Newassign)
                        .success(function (data) {
                            $scope.NewAdventure = {};
                            //clear the form
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

    $scope.showProcessCrAdv = function(ev) {
        $mdDialog.show({
            controller: function () {
                this.parent = $scope;
            },
            controllerAs: 'ctrl',
            templateUrl: 'dialogCreateAdv.tmpl.html',
            targetEvent: ev,
            clickOutsideToClose:true,
            fullscreen: $scope.customFullscreen
            // Only for -xs, -sm breakpoints.
        }).then(function() {
            console.log($scope.NewAdventure);
            if(!$scope.IsAdventureInputsFilled){
                var toast = $mdToast.simple()
                    .textContent('Creación cancelada!')
                    .action('OK')
                    .highlightAction(false)
                    .hideDelay(5000)
                    .parent(el)
                    .position('top');
                $mdToast.show(toast);
                $scope.NewAdventure = {};
                $scope.SwitchTabs("Aventuras");
            }
            else
            {
                $scope.IsAdventurePos = true;
                $scope.SwitchTabs("Vista");
                $mdToast.show({
                    hideDelay   : 0,
                    position    : 'top right',
                    controller  : 'CreatorCtrl',
                    templateUrl : 'assignPoint.html',
                    parent: el
                }).then(function () {
                    //Cerramos la Toast
                    $scope.IsMarkerCreatorActive = false;
                    console.log("Marker Cerrado:"+ $scope.IsMarkerCreatorActive);

                    $mdDialog.show({
                        controller: function () { this.parent = $scope; },
                        controllerAs: 'ctrl',
                        templateUrl: 'dialogAggHint.tmpl.html',
                        targetEvent: ev,
                        clickOutsideToClose:true,
                        fullscreen: $scope.customFullscreen
                        // Only for -xs, -sm breakpoints.
                    }).then(function() {
                        if(!$scope.IsFirstHintFilled){
                            var toast = $mdToast.simple()
                                .textContent('Creación cancelada!')
                                .action('OK')
                                .highlightAction(false)
                                .hideDelay(5000)
                                .parent(el)
                                .position('top');
                            $mdToast.show(toast);
                            $scope.NewAdventure = {};
                            $scope.SwitchTabs("Aventuras");
                        }
                        else {
                            console.log($scope.NewAdventure);

                            $scope.IsAdventureInputsFilled = false;
                            //Si la Localización de la aventura ha sido aplicada
                            $scope.IsAdventurePos = false;
                            //Si la primera Pista ha sido rellenada
                            $scope.IsFirstHintFilled = false;
                            //Activador del Marker
                            $scope.IsMarkerCreatorActive = false;

                            $scope.CreateAdventure();

                            //Habilito el boton de Agregar
                            $scope.IsAdventureFinished = true;

                            var confirm = $mdDialog.confirm()
                                .title('Agregación de Pistas')
                                .textContent('Tu Aventura ya esta creada, ahora pasaremos al crear Pistas')
                                .ariaLabel('Lucky day')
                                .targetEvent(ev)
                                .ok('Please do it!');

                            $mdDialog.show(confirm).then(function() {

                                console.log($scope.SelectedAdv);
                                var toast = $mdToast.simple()
                                    .textContent('Aventura Creada: '+ $scope.SelectedAdv.name + ' - Dificultad: '+ $scope.SelectedAdv.difficulty)
                                    .action('OK')
                                    .highlightAction(false)
                                    .hideDelay(8000)
                                    .parent(el)
                                    .position('top left');
                                $mdToast.show(toast);

                                $scope.ShowHintofAdventureonMap();

                            });
                        }

                    });
                })
            }
        });
    };

    /**
     * Hints Zone
     * @constructor
     */

    $scope.CreateHint = function(advid){
        console.log(advid);

        if ($rootScope.UserSessionId._id != null) {

            $scope.NewHint.location_type = 'Point';
            $scope.NewHint._id = $scope.SelectedAdv._id;

            $http.post('/hints/createhint/', $scope.NewHint)
                .success(function (data) {
                    console.log(data);
                    //Reprint Coordinates
                    $scope.SuccessMsg = "Pista creada";
                    $timeout(function () {
                        $scope.SuccessMsg = null;
                    }, 3000);

                    var Newassign = {};
                    Newassign.hint_id = data._id;
                    Newassign.adventure_id = $rootScope.SelectedAdv._id;

                    console.log(Newassign);

                    $http.post('/adventures/ahintdadv/', Newassign)
                        .success(function (data) {
                            $scope.NewHint = {}; //clear the form
                            $scope.ShowHintofAdventureonMap();
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

    $scope.SelAdventureforHint = function (id) {
        console.log(id);
        $http.get('/adventures/id/' + id)
            .success(function(data) {
                $scope.SelectedAdv = data;
                console.log($scope.SelectedAdv);

            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

    $scope.showPopUpCrHint = function(ev) {
        $mdDialog.show({
            controller: function () {this.parent = $scope;},
            controllerAs: 'ctrl',
            templateUrl: 'dialogAggHintWFinal.tmpl.html',
            targetEvent: ev,
            clickOutsideToClose:true,
            fullscreen: $scope.customFullscreen
            // Only for -xs, -sm breakpoints.
        }).then(function() {
            console.log($scope.NewHint);
            if(!$scope.IsNewHintFilled){
                var toast = $mdToast.simple()
                    .textContent('Creación cancelada!')
                    .action('OK')
                    .highlightAction(false)
                    .hideDelay(5000)
                    .parent(el)
                    .position('top');
                $mdToast.show(toast);
                $scope.NewHint = {};
            }
            else {
                $scope.IsNewHintFilled = true;
                $scope.SwitchTabs("Vista");
                $mdToast.show({
                    hideDelay   : 0,
                    position    : 'top right',
                    controller  : 'CreatorCtrl',
                    templateUrl : 'assignPoint.html',
                    parent: el
                }).then(function () {
                    //Cerramos la Toast
                    $scope.IsMarkerCreatorActive = false;
                    console.log("Marker Cerrado:"+ $scope.IsMarkerCreatorActive);

                    $mdDialog.show({
                        controller: function () { this.parent = $scope; },
                        controllerAs: 'ctrl',
                        templateUrl: 'dialogAggHint.tmpl.html',
                        targetEvent: ev,
                        clickOutsideToClose:true,
                        fullscreen: $scope.customFullscreen
                        // Only for -xs, -sm breakpoints.
                    }).then(function() {
                        if(!$scope.IsFirstHintFilled){
                            var toast = $mdToast.simple()
                                .textContent('Creación cancelada!')
                                .action('OK')
                                .highlightAction(false)
                                .hideDelay(5000)
                                .parent(el)
                                .position('top');
                            $mdToast.show(toast);
                            $scope.NewAdventure = {};
                            $scope.SwitchTabs("Aventuras");
                        }
                        else {
                            console.log($scope.NewAdventure);

                            $scope.IsAdventureInputsFilled = false;
                            //Si la Localización de la aventura ha sido aplicada
                            $scope.IsAdventurePos = false;
                            //Si la primera Pista ha sido rellenada
                            $scope.IsFirstHintFilled = false;
                            //Activador del Marker
                            $scope.IsMarkerCreatorActive = false;

                            $scope.CreateAdventure();

                            //Habilito el boton de Agregar
                            $scope.IsAdventureFinished = true;

                            var confirm = $mdDialog.confirm()
                                .title('Agregación de Pistas')
                                .textContent('Tu Aventura ya esta creada, ahora pasaremos al crear Pistas')
                                .ariaLabel('Lucky day')
                                .targetEvent(ev)
                                .ok('Please do it!');

                            $mdDialog.show(confirm).then(function() {

                                console.log($scope.SelectedAdv);
                                var toast = $mdToast.simple()
                                    .textContent('Aventura Creada: '+ $scope.SelectedAdv.name + ' - Dificultad: '+ $scope.SelectedAdv.difficulty)
                                    .action('OK')
                                    .highlightAction(false)
                                    .hideDelay(8000)
                                    .parent(el)
                                    .position('top left');
                                $mdToast.show(toast);

                                $scope.ShowHintofAdventureonMap();

                            });
                        }

                    });
                })
            }
        });
    };


}]);
