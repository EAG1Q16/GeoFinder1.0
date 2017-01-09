/**
 * Created by mbmarkus on 4/11/16.
 */
angular.module('GeoFinderApp').controller('CreatorCtrl2',['$scope','$rootScope','$http',
    '$timeout','$interval', function($scope, $rootScope, $http, $timeout, $interval){

        var height = document.getElementById('lleno').offsetHeight;
        console.log(height);
        $scope.style = "height:"+ height + 'px;';

        $scope.ShowAdventuresonMap = function () {
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

                        markersAdventures[key] = new google.maps.Marker({
                            title: value.name,
                            icon: dificon,
                            animation: 0
                        });
                        var latlng = new google.maps.LatLng(value.location.coordinates[1],value.location.coordinates[0]);
                        markersAdventures[key].setPosition(latlng);
                        markersAdventures[key].setMap($scope.map)
                        console.log($scope.map);
                    });
                })
                .error(function (data) {
                    console.log(data);
                })
        };

        $timeout( $scope.ShowAdventuresonMap, 1);
}]);
