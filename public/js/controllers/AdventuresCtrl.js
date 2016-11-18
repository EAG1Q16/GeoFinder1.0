/**
 * Created by mbmarkus on 3/11/16.
 */
angular.module('GeoFinderApp').controller('AdventuresCtrl',['$scope','$http','$routeParams','$window',function($scope, $http, $routeParams,$window){
    $scope.NewAdventure = {};

    $scope.cerca = false;
    
    // when landing on the page, get all user and show them
    $http.get('/adventures')
        .success(function(data) {
            $scope.adventures = data;
            console.log(data);
            $scope.cerca = false;

        })
        .error(function(data) {
            console.log('Error: ' + data);
        });

    $scope.CreateAdventure = function(){
        $http.post('/adventures/createadventure/', $scope.NewAdventure)
            .success(function(data){
                $scope.NewAdventure = {}; //clear the form
                $scope.adventures = data;
                console.log(data);
            })
            .error(function(data){
                console.log('Error:' + data);
            });
    };
    $scope.DeleteAdventure = function(id) {
        $http.delete('/adventures/removeadventure/' + id)
            .success(function (data) {
                $scope.adventures = {};
                $scope.adventures = data;
            })
            .error(function (data) {
                console.log('Error:' + data);
            });
    };


    $scope.searchNearby = function() {
        $window.navigator.geolocation.getCurrentPosition(function (position) {
            $scope.cerca = true;
            $scope.$apply(function () {
                $scope.lat = position.coords.latitude;
                $scope.lng = position.coords.longitude;

                console.log($scope.lat);
                console.log($scope.lng);

                $scope.cordenada = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                };


                $http.post('adventures/near', $scope.cordenada)
                    .success(function (data) {
                        $scope.probando = (data);
                        //console.log("cercanas"+ $scope.probando[0].name);
                    })
                    .error(function (data) {
                        console.log('Error: ' + data);
                    });


                var geocoder = new google.maps.Geocoder();
                var latlng = new google.maps.LatLng($scope.lat, $scope.lng);


                var request = {
                    latLng: latlng
                };
                geocoder.geocode(request, function (data, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                        if (data[0] != null) {
                            console.log("address is: " + data[0].formatted_address);
                        } else {
                            console.log("No address available");
                        }
                    }
                })


            })
        });
    };

    $scope.getTodas=function () {
        $http.get('/adventures')
            .success(function(data) {
                $scope.adventures = data;
                console.log(data);
                $scope.cerca = false;

            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
        
    };
    

}]);
