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
    //Si el Mostrar todas las Aventuras propias esta activo
    $scope.CheckBoxYourAdvActive = false;
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
    //Señalizador del Final de Hints
    $scope.IsFinal = false;

    //Visualizador
    $scope.IsVisualizeActive = false;

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
        $scope.IsFinal = false;

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
                        case "Difícil":
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

    $scope.ShowMyAdventuresonMap = function (){
            $scope.CleanMap();
            var markersAdventures = [];
            $http.get('/user/my/adventures/'+ $rootScope.UserSessionId._id)
                .success(function (data) {
                    angular.forEach(data.adventures.created, function (value, key) {
                        //For color icons
                        var dificon;
                        switch (value.difficulty){
                            case "Fácil":
                                dificon = '/images/icons/extended-icons5_101.png';
                                break;
                            case "Media":
                                dificon = '/images/icons/extended-icons5_102.png';
                                break;
                            case "Difícil":
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
                $scope.SelectedAdv = data;
                angular.forEach(data.hints, function (value) {

                    var icon = '';

                    if (value.final){
                        icon = '/images/icons/ic_beenhere_black_48px.svg';
                    }
                    else icon = '/images/icons/ic_assistant_photo_black_48px.svg';

                    if (value.indication.distance == 0)
                    {
                        markersHints.push(
                            {
                                index: value.index,
                                text: value.text,
                                final: value.final,
                                image: value.image,
                                _id: value._id,
                                latitude: value.location.coordinates[1],
                                longitude: value.location.coordinates[0],
                                showWindow: false,
                                options: {
                                    icon: icon,
                                    animation: google.maps.Animation.DROP,
                                    title: value.text,
                                    labelAnchor: "26 0",
                                    labelClass: "marker-labels"
                                }
                            }
                        );
                    }
                    else{
                        markersHints.push(
                            {
                                index: value.index,
                                indication: {
                                    distance: 'Distancia de la próxima pista: '+ value.indication.distance,
                                    sense: 'Rumbo: '+ value.indication.sense
                                },
                                text: value.text,
                                final: value.final,
                                image: value.image,
                                _id: value._id,
                                latitude: value.location.coordinates[1],
                                longitude: value.location.coordinates[0],
                                showWindow: false,
                                options: {
                                    icon: icon,
                                    animation: google.maps.Animation.DROP,
                                    title: value.text,
                                    labelAnchor: "26 0",
                                    labelClass: "marker-labels"
                                }
                            }
                        );
                    }

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

        //Limpieza del Visualize
        $scope.IsVisualizeActive = false;

        if ($scope.CheckBoxYourAdvActive){
            //Desactivo la otra
            $scope.CheckBoxYourAdvActive = false;
            $scope.CleanMap();
        }
        if (!$scope.IsCheckBoxMarkAdvActive){
            $scope.IsCheckBoxMarkAdvActive = true;
            $scope.ShowAdventuresonMap();
        }
        else {
            $scope.IsCheckBoxMarkAdvActive = false;
            $scope.CleanMap();
        }
    };

    $scope.CheckBoxYourAdv = function () {

        //Limpieza del Visualize
        $scope.IsVisualizeActive = false;

        if($scope.IsCheckBoxMarkAdvActive){
            //Desactivo la otra
            $scope.IsCheckBoxMarkAdvActive = false;
        }

        if (!$scope.CheckBoxYourAdvActive){
            $scope.CheckBoxYourAdvActive = true;
            $scope.ShowMyAdventuresonMap();
        }
        else {
            $scope.CheckBoxYourAdvActive = false;
            $scope.CleanMap();
        }
    };

    $scope.SwitchStyleMap = function (style){
        switch(style){
            case "Diurno":
                $scope.options.styles = MapBox;
                if($scope.IsAdventureInputsFilled || $scope.IsNewHintFilled){
                    $scope.map.createMarker.options.icon = '/images/icons/ic_place_black_48px.svg';
                }
                angular.forEach($scope.map.markersHints, function (value) {
                    if(value.final){
                        value.options.icon = '/images/icons/ic_beenhere_black_48px.svg';
                    }
                    else
                    value.options.icon = '/images/icons/ic_assistant_photo_black_48px.svg';
                });
                break;
            case "Nocturno":
                $scope.options.styles = BlackMap;
                if($scope.IsAdventureInputsFilled || $scope.IsNewHintFilled){
                    $scope.map.createMarker.options.icon = '/images/icons/ic_place_white_48px.svg';
                }
                angular.forEach($scope.map.markersHints, function (value) {
                    if(value.final){
                        value.options.icon = '/images/icons/ic_beenhere_white_48px.svg';
                    }
                    else
                        value.options.icon = '/images/icons/ic_assistant_photo_white_48px.svg';
                });

                break;
            default:
                $scope.options.styles = MapBox;
                if($scope.IsAdventureInputsFilled || $scope.IsNewHintFilled){
                    $scope.map.createMarker.options.icon = '/images/icons/ic_place_black_48px.svg';
                }
                angular.forEach($scope.map.markersHints, function (value) {
                    if(value.final){
                        value.options.icon = '/images/icons/ic_beenhere_black_48px.svg';
                    }
                    else
                        value.options.icon = '/images/icons/ic_assistant_photo_black_48px.svg';
                });
                break;
        }
    };

    /**
     * Creator Adventure Zone
     * @constructor
     */

    $scope.CreateAdventure = function(){
        $scope.CleanMap();

        if ($rootScope.UserSessionId._id != null) {

            $scope.NewAdventure.location_type = 'Point';
            console.log($scope.NewAdventure);

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

                    $scope.NewHint = {
                        _id: data._id,
                        text: $scope.NewAdventure.hinttext,
                        image: $scope.NewAdventure.hintimage,
                        location_type : 'Point',
                        location_coordinates : [$scope.map.createMarker.longitude, $scope.map.createMarker.latitude]
                    };

                    $http.post('/user/acreatedadv/', Newassign)
                        .success(function (data) {

                            $http.post('/hints/createhint/', $scope.NewHint)
                                .success(function (data) {
                                    console.log(data);

                                    var Newassign = {};
                                    Newassign.hint_id = data._id;
                                    Newassign.adventure_id = $scope.NewHint._id;

                                    console.log(Newassign);

                                    $http.post('/adventures/ahintdadv/', Newassign)
                                        .success(function (data) {
                                            $scope.NewHint = {}; //clear the form
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

            $scope.map.center.latitude = $scope.map.createMarker.latitude;
            $scope.map.center.longitude = $scope.map.createMarker.longitude;

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
                            //Limpio el mapa
                            $scope.CleanMap();

                            var confirm = $mdDialog.confirm()
                                .title('Agregación de Pistas')
                                .textContent('Tu Aventura ya esta creada, ahora añadiremos más Pistas')
                                .ariaLabel('Lucky day')
                                .targetEvent(ev)
                                .ok('Siguiente');

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

            $scope.NewHint.location_type = 'Point';
            $scope.NewHint._id = $scope.SelectedAdv._id;

            $http.post('/hints/createhint/', $scope.NewHint)
                .success(function (data) {
                    console.log(data);

                    var Newassign = {};
                    Newassign.hint_id = data._id;
                    Newassign.adventure_id = $scope.SelectedAdv._id;

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
    };

    $scope.CreateFinalHint = function () {

        console.log("Entrado en FinalHint");

        $scope.NewHint.location_type = 'Point';
        $scope.NewHint._id = $scope.SelectedAdv._id;
        $scope.NewHint.text = 'Felicidades has completado la Aventura';
        $scope.NewHint.image = 'http://res.cloudinary.com/geofinder/image/upload/v1485003782/trophy.gif';

        $http.post('/hints/createhint/', $scope.NewHint)
            .success(function (data) {
                console.log(data);

                var Newassign = {};
                Newassign.hint_id = data._id;
                Newassign.adventure_id = $scope.SelectedAdv._id;

                console.log(Newassign);

                var User = {};
                User.id = $rootScope.UserSessionId._id;

                $http.put('/hints/makefinal/'+ data._id, User)
                    .success(function (data) {

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

            })
            .error(function (data) {
                console.log('Error:' + data);
            });
    };

    $scope.SelAdventureforHint = function (id) {

        console.log(id);
        $http.get('/adventures/id/' + id)
            .success(function(data) {
                $scope.SelectedAdv = data;
                //Activación del Visualize
                $scope.IsVisualizeActive = true;
                $scope.ShowHintofAdventureonMap();

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
                    .textContent('Agregación cancelada!')
                    .action('OK')
                    .highlightAction(false)
                    .hideDelay(5000)
                    .parent(el)
                    .position('top');
                $mdToast.show(toast);
                $scope.NewHint = {};
            }
            else {

                $scope.map.center.latitude = $scope.map.createMarker.latitude;
                $scope.map.center.longitude = $scope.map.createMarker.longitude;

                $scope.IsMarkerCreatorActive = true;
                $scope.IsNewHintFilled = true;
                $scope.CleanMap();

                $mdToast.show({
                    hideDelay   : 0,
                    position    : 'top right',
                    controller  : 'CreatorCtrl',
                    templateUrl : 'assignHint.html',
                    parent: el
                }).then(function () {
                    //Cerramos la Toast
                    $scope.IsMarkerCreatorActive = false;
                    console.log("Marker Cerrado:"+ $scope.IsMarkerCreatorActive);

                    if ($scope.IsFinal){

                        $scope.CreateFinalHint();

                        $scope.IsAdventureInputsFilled = false;
                        $scope.IsAdventurePos = false;
                        $scope.IsFirstHintFilled = false;
                        $scope.IsAdventureFinished = false;
                        $scope.IsMarkerCreatorActive = false;

                        //Segunda Parte
                        $scope.IsNewHintFilled = false;
                        $scope.IsFinal = false;

                        var toast = $mdToast.simple()
                            .textContent('Pista Final Añadida')
                            .action('OK')
                            .highlightAction(false)
                            .hideDelay(3000)
                            .parent(el)
                            .position('top left');
                        $mdToast.show(toast).then(function () {

                            var toast2 = $mdToast.simple()
                                .textContent('Aventura Completada')
                                .action('OK')
                                .highlightAction(false)
                                .hideDelay(3000)
                                .parent(el)
                                .position('top left');
                            $mdToast.show(toast2).then(function () {
                               //Final
                                $scope.NewHint = {};

                            });
                        });
                    }
                    else {
                        $scope.CreateHint($scope.SelectedAdv._id);

                        var toast = $mdToast.simple()
                            .textContent('Pista Creada')
                            .action('OK')
                            .highlightAction(false)
                            .hideDelay(8000)
                            .parent(el)
                            .position('top left');
                        $mdToast.show(toast);

                        $scope.NewHint = {};
                    }

                })
            }
        });
    };


    /**
     *  Image Zone
     */
    $scope.uploadFileForAdv = function(){
        var file = $scope.myFile;
        var fd = new FormData();
        fd.append('file', file);
        console.log('mi fichero',file);

        $http.post('/hints/update/image/',fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        })
            .success(function(data){
                console.log("success!!");
                $scope.NewAdventure.image = data;

            })
            .error(function(err){
                console.log("error!!");
            });
    };
    $scope.uploadFileForFirstHint = function(){
        var file = $scope.myFile;
        var fd = new FormData();
        fd.append('file', file);
        console.log('mi fichero',file);

        $http.post('/adventures/upload/image/',fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        })
            .success(function(data){
                console.log("success!!");
                $scope.NewAdventure.hintimage = data;
            })
            .error(function(err){
                console.log("error!!");
            });
    };
    $scope.uploadFileForHints = function(){
        var file = $scope.myFile;
        var fd = new FormData();
        fd.append('file', file);
        console.log('mi fichero',file);

        $http.post('/adventures/upload/image/',fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        })
            .success(function(data){
                console.log("success!!");
                $scope.NewHint.image = data;
            })
            .error(function(err){
                console.log("error!!");
            });
    };


    $scope.replaceElement1 = function () {
        angular.element(document.querySelector('#InputFile1')).click();
    };
    $scope.replaceElement2 = function () {
        angular.element(document.querySelector('#InputFile2')).click();
    };
    $scope.replaceElement3 = function () {
        angular.element(document.querySelector('#InputFile3')).click();
    };

}])
    .directive('fileModel', ['$parse', function ($parse) {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                var model = $parse(attrs.fileModel);
                var modelSetter = model.assign;

                element.bind('change', function(){
                    scope.$apply(function(){
                        modelSetter(scope, element[0].files[0]);
                    });
                });
            }
        };
    }]);

