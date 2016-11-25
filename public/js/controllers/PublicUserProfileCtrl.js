/**
 * Created by tonim on 14/11/2016.
 */
angular.module('GeoFinderApp').controller('PublicUserProfileCtrl',['$scope','$rootScope','$window','$location','$http','$routeParams', function($scope, $rootScope, $window, $location, $http, $routeParams){

    var puserID = window.location.href.split("/").pop();

    // when landing on the page get adventure
    $http.get('/user/my/' + puserID)
        .success(function(data) {
            console.log(data);
            $scope.pUserProfileInfo = data;
            $scope.CreatedAdventures = data.adventures.created;
            $scope.AdventuresLength = data.adventures.created.length;
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });
    // when landing on the page search if user is followed
        $http.get('/user/isfollowing/' + puserID +'/'+ $rootScope.UserSessionUri)
            .success(function(data) {
                console.log(data);
                $scope.isfollowing = data;
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });


    $scope.followUser = function () {
        $http.post('/user/follow/' + puserID, $rootScope.UserSessionId)
            .success(function(data){
                $http.get('/user/isfollowing/' + puserID +'/'+ $rootScope.UserSessionUri)
                    .success(function(data) {
                        $scope.isfollowing = data;
                        $http.get('/user/my/' + puserID)
                            .success(function(data) {
                                $scope.pUserProfileInfo = data;
                                $scope.CreatedAdventures = data.adventures.created;
                                $scope.AdventuresLength = data.adventures.created.length;
                            })
                            .error(function(data) {
                                console.log('Error: ' + data);
                            });
                    })
                    .error(function(data) {
                        console.log('Error: ' + data);
                    });
            })
            .error(function(data) {
                console.log('Error' + data);
            });
    };

    $scope.stopfollowUser = function () {
        $http.delete('/user/unfollow/' + puserID +'/'+ $rootScope.UserSessionId._id)
            .success(function(data){
                $http.get('/user/isfollowing/' + puserID +'/'+ $rootScope.UserSessionUri)
                    .success(function(data) {
                        $scope.isfollowing = data;
                        $http.get('/user/my/' + puserID)
                            .success(function(data) {
                                $scope.pUserProfileInfo = data;
                                $scope.CreatedAdventures = data.adventures.created;
                                $scope.AdventuresLength = data.adventures.created.length;
                            })
                            .error(function(data) {
                                console.log('Error: ' + data);
                            });
                    })
                    .error(function(data) {
                        console.log('Error: ' + data);
                    });
            })
            .error(function(data) {
                console.log('Error' + data);
            });
    };

}]);