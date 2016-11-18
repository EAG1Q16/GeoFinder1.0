/**
 * Created by tonim on 03/11/2016.
 */
angular.module('GeoFinderApp').controller('ProfileCtrl',['$scope','$rootScope','$location','$http','$routeParams', function($scope, $rootScope, $location, $http, $routeParams){
    console.log('Rootscope en profile' + $rootScope.UserSessionId);
    $scope.UpdatedUser = {};

    // when landing on the page get user
   $http.get('/user/my/' + $rootScope.UserSessionId._id)
        .success(function(data) {
            $scope.UserProfileInfo = data;
            console.log($scope.UserProfileInfo);

        })
        .error(function(data) {
            console.log('Error: ' + data);
        });

   $scope.UpdateName = function() {
       console.log('modificamos usuario');
        console.log($scope.UpdatedUser.name);
        $http.put('/user/update/name/' + $rootScope.UserSessionId._id, $scope.UpdatedUser)
            .success(function(data){
                console.log(data);
                $scope.UserProfileInfo = data;
                console.log($scope.UserProfileInfo);
                $scope.UpdatedUser = {};
            })
            .error(function(data) {
                console.log('Error' + data);
                $scope.UpdatedUser = {};
            });
   };

   $scope.UpdateUsername = function() {
        console.log($scope.UpdatedUser);
        $http.put('/user/update/username/' + $rootScope.UserSessionId._id, $scope.UpdatedUser)
            .success(function(data){
                console.log(data);
                $scope.UserProfileInfo = data;
                console.log($scope.UserProfileInfo);
                $scope.UpdatedUser = {};
            })
            .error(function(data) {
                console.log('Error' + data);
                $scope.UpdatedUser = {};
            });
   };

    $scope.UpdateDescription = function() {
        console.log($scope.UpdatedUser.description);
        $http.put('/user/update/description/' + $rootScope.UserSessionId._id, $scope.UpdatedUser)
            .success(function(data){
                console.log(data);
                $scope.UserProfileInfo = data;
                console.log($scope.UserProfileInfo);
                $scope.UpdatedUser = {};
            })
            .error(function(data) {
                console.log('Error' + data);
                $scope.UpdatedUser = {};
            });
    };

    $scope.UpdatePhoto = function() {
        console.log($scope.UpdatedUser);
        $http.put('/user/update/photo/' + $rootScope.UserSessionId._id, $scope.UpdatedUser)
            .success(function(data){
                console.log(data);
                $scope.UserProfileInfo = data;
                console.log($scope.UserProfileInfo);
                $scope.UpdatedUser = {};
            })
            .error(function(data) {
                console.log('Error' + data);
                $scope.UpdatedUser = {};
            });
    };

    $scope.UpdatePassword = function() {
        console.log($scope.UpdatedUser);
        $http.put('/user/update/password/' + $rootScope.UserSessionId._id, $scope.UpdatedUser)
            .success(function(data){
                console.log(data);
                $scope.UserProfileInfo = data;
                console.log($scope.UserProfileInfo);
                $scope.UpdatedUser = {};
            })
            .error(function(data) {
                console.log('Error' + data);
                $scope.UpdatedUser = {};
            });
    };

}]);