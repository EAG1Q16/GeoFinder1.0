/**
 * Created by tonim on 03/11/2016.
 */
angular.module('GeoFinderApp').controller('ProfileCtrl',['$scope','$rootScope','$location','$http','$routeParams', function($scope, $rootScope, $location, $http, $routeParams){

    // when landing on the page get user session
    $http.get('/user/sessionid')
        .success(function(data) {
            $rootScope.UserSessionId = data;
            $rootScope.UserSessionUri = data._id;
            $scope.ImageUri = '/user/update/image/' + $rootScope.UserSessionUri;
            // when landing on the page get user
            $http.get('/user/my/' + $rootScope.UserSessionId._id)
                .success(function(data) {
                    $scope.UserProfileInfo = data;
                    $scope.FollowingUsers = data.following;
                    console.log($scope.UserProfileInfo);
                    console.log($scope.FollowingUsers);

                })
                .error(function(data) {
                    console.log('Error: ' + data);
                });
        })
        .error(function(data) {
            console.log('not logged');
        });

   $scope.UpdatedUser = {};

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

    $scope.UpdateEmail = function() {
        console.log('modificamos usuario');
        console.log($scope.UpdatedUser.email);
        $http.put('/user/update/email/' + $rootScope.UserSessionId._id, $scope.UpdatedUser)
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

    $scope.StopFollowUser = function (id) {
        $http.delete('/user/unfollow/' + id +'/'+ $rootScope.UserSessionId._id)
            .success(function(data){
                console.log(data);
                $scope.FollowingUsers = data.following;

            })
            .error(function(data) {
                console.log('Error' + data);
            });
    };

    $scope.replaceElement = function () {
        angular.element(document.querySelector('#InputFile')).click();
    };

    $scope.uploadFile = function(){

        var file = $scope.myFile;
        var fd = new FormData();
        fd.append('file', file);
        console.log('mi fichero',file);
        console.log('fd que nosek es',fd);

        $http.post('/user/update/image/' + $rootScope.UserSessionUri,fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        })
            .success(function(data){
                console.log("success!!");
                $rootScope.UserSessionId = data;
                $scope.UserProfileInfo = data;
            })
            .error(function(err){
                console.log("error!!");
            });
    };
}]).directive('fileModel', ['$parse', function ($parse) {
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