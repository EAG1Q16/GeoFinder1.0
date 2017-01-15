/**
 * Created by Marta_ on 03/01/2017.
 */

angular.module('GeoFinderApp').controller('UserAdventuresCtrl',['$scope', '$rootScope','$location','$http','$routeParams', function($scope, $rootScope, $location, $http, $routeParams){
    console.log("USERADVENTURES");

    // when landing on the page get the adventures
    $http.get('/user/sessionid')
        .success(function(data) {
            $rootScope.UserSessionId = data;
            $rootScope.UserSessionUri = data._id;
            // when landing on the page get user
            $http.get('/user/my/' + $rootScope.UserSessionId._id)
                .success(function(data) {
                    console.log("Obtengo las aventuras");
                    console.log(data);
                    $scope.creadas = data.adventures.created;
                    $scope.favoritas = data.adventures.favs;
                    $scope.jugadas = data.adventures.played;
                })
                .error(function(data) {
                    console.log('Error: ' + data);
                });
        })
        .error(function(data) {
            console.log('Error: ', data);
        });

    PerfilAventura = function (id) {
        console.log("Ir al perfil de avenruar");
        $location.path('/adventureprofile/'+id);
    }

    $scope.UnFavAdventure = function(id) {
        $http.delete('/user/uafavadv/' + id +'/'+ $rootScope.UserSessionId._id)
            .success(function(data){
                $http.get('/user/sessionid')
                    .success(function(data) {
                        $rootScope.UserSessionId = data;
                        $rootScope.UserSessionUri = data._id;
                        // when landing on the page get user
                        $http.get('/user/my/' + $rootScope.UserSessionId._id)
                            .success(function(data) {
                                console.log("Obtengo las aventuras");
                                console.log(data);
                                $scope.creadas = data.adventures.created;
                                $scope.favoritas = data.adventures.favs;
                                $scope.jugadas = data.adventures.played;
                            })
                            .error(function(data) {
                                console.log('Error: ' + data);
                            });
                    })
                    .error(function(data) {
                        console.log('Error: ', data);
                    });
            })
            .error(function(data) {
                console.log('Error' + data);
            });
    };
}]);