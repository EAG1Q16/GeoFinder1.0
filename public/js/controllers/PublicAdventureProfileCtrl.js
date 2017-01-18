/**
 * Created by tonim on 14/11/2016.
 */

angular.module('GeoFinderApp').controller('PublicAdventureProfileCtrl',['$scope','$rootScope','$window','$location','$http','$routeParams', 'uiGmapGoogleMapApi', function($scope, $rootScope, $window, $location, $http, $routeParams, uiGmapGoogleMapApi){

    var adventureID = window.location.href.split("/").pop();

    /*$scope.labels =["Java", "Hadoop", "Hive", "PIG", "MapReduce", "Git"];

    $scope.data = [
        [28, 48, 40, 19, 96, 100]
    ];*/

    // when landing on the page get user
    $http.get('/user/sessionid')
        .success(function(data) {
            $rootScope.UserSessionId = data;
            $rootScope.UserSessionUri = data._id;
            // when landing on the page search if user is followed
            $http.get('/user/isadvfav/' + adventureID +'/'+ $rootScope.UserSessionUri)
                .success(function(data) {
                    console.log(data);
                    $scope.isfollowing = data;
                    console.log($scope.isfollowing);
                })
                .error(function(data) {
                    console.log('Error: ' + data);
                });
        })
        .error(function(data) {
            console.log('not logged');
        });

    console.log(adventureID);
    $scope.map = { center: { latitude: 0.1, longitude: 0.1 }, zoom: 2 };

    $scope.comments = {};
    
    // when landing on the page get adventure
    $http.get('/adventures/id/' + adventureID)
        .success(function(data) {

            $scope.AdventureProfileInfo = data;
            $scope.comments = data.comments;
            console.log($scope.comments);
            console.log($scope.AdventureProfileInfo);
            angular.forEach($scope.comments, function (comment, key) {
                comment.commentdate = moment(comment.commentdate, "").fromNow();
            })
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
    $scope.NewComment = {};

    $scope.addcomment = function () {
        $http.post('/comments/' + $rootScope.UserSessionId._id, $scope.NewComment)
            .success(function (data) {
                $scope.NewComment = {};
                $scope.reccomment = data;
                console.log("holaaaaaaaaaaaaaaaa");
                console.log($scope.reccomment);
                $http.post('/comments/addtoadventure/' + adventureID ,$scope.reccomment)
                    .success(function (data) {
                        console.log("entro en el success");
                        $scope.comments = data.comments;
                        angular.forEach($scope.comments, function (comment, key) {
                            comment.commentdate = moment(comment.commentdate, "").fromNow();
                        })
                        console.log("aqui");
                        

                    })
                    .error(function (data) {
                        console.log("Error" + data)
                    });
            })
            .error(function (data) {
                console.log("Error" + data);
            });
    };
    
    $scope.deletecomment = function (cmd_id) {
      $http.delete('/comments/deletecomment/' + cmd_id + '/' + adventureID)
          .success(function (data) {
              $scope.comments = data.comments;
              angular.forEach($scope.comments, function (comment, key) {
                  comment.commentdate = moment(comment.commentdate, "").fromNow();
              })
          })
          .error(function (data) {
              console.log("Error" + data);
          });
    };

    $scope.FavAdventure = function() {
        $http.post('/user/afavadv/' + adventureID, $rootScope.UserSessionId)
            .success(function(data){
                $scope.AdventureProfileInfo = data;
                $http.get('/user/isadvfav/' + adventureID +'/'+ $rootScope.UserSessionUri)
                    .success(function(data) {
                        console.log(data);
                        $scope.isfollowing = data;
                        console.log($scope.isfollowing);
                    })
                    .error(function(data) {
                        console.log('Error: ' + data);
                    });

            })
            .error(function(data) {
                console.log('Error' + data);
            });
    };

    $scope.UnFavAdventure = function() {
        $http.delete('/user/uafavadv/' + adventureID +'/'+ $rootScope.UserSessionId._id)
            .success(function(data){
                $scope.AdventureProfileInfo = data;
                $http.get('/user/isadvfav/' + adventureID +'/'+ $rootScope.UserSessionUri)
                    .success(function(data) {
                        console.log(data);
                        $scope.isfollowing = data;
                        console.log($scope.isfollowing);
                    })
                    .error(function(data) {
                        console.log('Error: ' + data);
                    });

            })
            .error(function(data) {
                console.log('Error' + data);
            });
    };
    //TEst Charts ---------------------------------------------------//
    $scope.labels =["Eating", "Drinking", "Sleeping", "Designing", "Coding", "Cycling", "Running"];

    $scope.data = [
        [65, 59, 90, 81, 56, 55, 40],
        [28, 48, 40, 19, 96, 27, 100]
    ];

    $scope.labels = ["Número de pistas", "Número de comentarios", "Veces jugada"];
    $scope.data = [6, 8, 5];

}]);