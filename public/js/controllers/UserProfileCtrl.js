/**
 * Created by tonim on 03/11/2016.
 */
angular.module('GeoFinderApp').controller('ProfileCtrl',['$scope','$rootScope','$location','$http','$routeParams','$mdToast', function($scope, $rootScope, $location, $http, $routeParams, $mdToast){
    $scope.PassFun = {
        password: '',
        test: ''
    };
    // when landing on the page get user session
    $http.get('/user/sessionid')
        .success(function(data) {
            $rootScope.UserSessionId = data;
            $rootScope.UserSessionUri = data._id;
            $scope.ImageUri = '/user/update/image/' + $rootScope.UserSessionUri;
            // when landing on the page get user
            $http.get('/user/my/' + $rootScope.UserSessionId._id)
                .success(function(data) {
                    $scope.UpdatedUser = data;
                    $scope.UserProfileInfo = {
                       name: data.name,
                       username: data.username,
                       photo: data.photo,
                       description: data.description,
                       email: data.email,
                        referalid: data.referalid
                    };
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

   $scope.UpdateName = function() {
       if($scope.UpdatedUser.name == ""){
           $scope.UpdatedUser.name = $scope.UserProfileInfo.name;
       }
       if ($scope.UpdatedUser.name != $scope.UserProfileInfo.name){
           $http.put('/user/update/name/' + $rootScope.UserSessionId._id, $scope.UpdatedUser)
               .success(function(data){
                   console.log(data);
                   $scope.UpdatedUser = data;
                   $scope.UserProfileInfo = {
                       name: data.name,
                       username: data.username,
                       photo: data.photo,
                       description: data.description,
                       email: data.email

                   };
                   var el = angular.element(document.getElementById('testid'));
                   var toast = $mdToast.simple()
                       .textContent('Nombre modificado correctamente')
                       .action('OK')
                       .highlightAction(false)
                       .hideDelay(8000)
                       .parent(el)
                       .position('top right');
                   $mdToast.show(toast);
                   console.log($scope.UserProfileInfo);
               })
               .error(function(data) {
                   console.log('Error' + data);
               });
       }
   };

   $scope.UpdateUsername = function() {
       console.log('username2',$scope.UserProfileInfo.username);
       if($scope.UpdatedUser.username == ""){
           $scope.UpdatedUser.username = $scope.UserProfileInfo.username;
       }
       if ($scope.UpdatedUser.username != $scope.UserProfileInfo.username) {
           console.log($scope.UpdatedUser);
           $http.put('/user/update/username/' + $rootScope.UserSessionId._id, $scope.UpdatedUser)
               .success(function (data) {
                   console.log(data);
                   $scope.UpdatedUser = data;
                   $scope.UserProfileInfo = {
                       name: data.name,
                       username: data.username,
                       photo: data.photo,
                       description: data.description,
                       email: data.email
                   };
                   var el = angular.element(document.getElementById('testid'));
                   var toast = $mdToast.simple()
                       .textContent('Nombre de usuario modificado correctamente')
                       .action('OK')
                       .highlightAction(false)
                       .hideDelay(8000)
                       .parent(el)
                       .position('top right');
                   $mdToast.show(toast);
                   console.log($scope.UserProfileInfo);
               })
               .error(function (data) {
                   console.log('Error' + data);
                   var el = angular.element(document.getElementById('testid'));
                   var toast = $mdToast.simple()
                       .textContent('Este nombre de usuario ya existe prueba con otro')
                       .action('¡Alerta!')
                       .highlightAction(false)
                       .hideDelay(8000)
                       .parent(el)
                       .position('top right');
                   $mdToast.show(toast);
                   console.log($scope.UserProfileInfo);
               });
       }
   };

    $scope.UpdateEmail = function() {
        if($scope.UpdatedUser.email == ""){
            $scope.UpdatedUser.email = $scope.UserProfileInfo.email;
        }
        if ($scope.UpdatedUser.email != $scope.UserProfileInfo.email) {
            $http.put('/user/update/email/' + $rootScope.UserSessionId._id, $scope.UpdatedUser)
                .success(function (data) {
                    console.log(data);
                    $scope.UpdatedUser = data;
                    $scope.UserProfileInfo = {
                        name: data.name,
                        username: data.username,
                        photo: data.photo,
                        description: data.description,
                        email: data.email
                    };
                    var el = angular.element(document.getElementById('testid'));
                    var toast = $mdToast.simple()
                        .textContent('Correo modificado correctamente')
                        .action('OK')
                        .highlightAction(false)
                        .hideDelay(8000)
                        .parent(el)
                        .position('top right');
                    $mdToast.show(toast);
                    console.log($scope.UserProfileInfo);
                })
                .error(function (data) {
                    console.log('Error' + data);
                });
        }
    };

    $scope.UpdateDescription = function() {
        if($scope.UpdatedUser.description == ""){
            $scope.UpdatedUser.description = $scope.UserProfileInfo.description;
        }
        if ($scope.UpdatedUser.description != $scope.UserProfileInfo.description) {
            console.log($scope.UpdatedUser.description);
            $http.put('/user/update/description/' + $rootScope.UserSessionId._id, $scope.UpdatedUser)
                .success(function (data) {
                    console.log(data);
                    $scope.UpdatedUser = data;
                    $scope.UserProfileInfo = {
                        name: data.name,
                        username: data.username,
                        photo: data.photo,
                        description: data.description,
                        email: data.email
                    };
                    var el = angular.element(document.getElementById('testid'));
                    var toast = $mdToast.simple()
                        .textContent('Descripción modificada correctamente')
                        .action('OK')
                        .highlightAction(false)
                        .hideDelay(8000)
                        .parent(el)
                        .position('top right');
                    $mdToast.show(toast);
                    console.log($scope.UserProfileInfo);
                })
                .error(function (data) {
                    console.log('Error' + data);
                });
        }
    };

    $scope.UpdatePhoto = function() {
        if($scope.UpdatedUser.photo == ""){
            $scope.UpdatedUser.photo = $scope.UserProfileInfo.photo;
        }
        if ($scope.UpdatedUser.photo != $scope.UserProfileInfo.photo) {
            console.log($scope.UpdatedUser);
            $http.put('/user/update/photo/' + $rootScope.UserSessionId._id, $scope.UpdatedUser)
                .success(function (data) {
                    console.log(data);
                    $rootScope.UserSessionId = data;
                    $scope.UpdatedUser = data;
                    $scope.UserProfileInfo = {
                        name: data.name,
                        username: data.username,
                        photo: data.photo,
                        description: data.description,
                        email: data.email
                    };
                    var el = angular.element(document.getElementById('testid'));
                    var toast = $mdToast.simple()
                        .textContent('Imagen modificada correctamente')
                        .action('OK')
                        .highlightAction(false)
                        .hideDelay(8000)
                        .parent(el)
                        .position('top right');
                    $mdToast.show(toast);
                    console.log($scope.UserProfileInfo);
                })
                .error(function (data) {
                    console.log('Error' + data);
                });
        }
    };

    $scope.UpdatePassword = function() {
        console.log($scope.PassFun);
        if ($scope.PassFun.password == $scope.PassFun.test && $scope.PassFun.password != "" && $scope.PassFun.test != "" ){
            $http.put('/user/update/password/' + $rootScope.UserSessionId._id, $scope.PassFun)
                .success(function(data){
                    console.log(data);
                    $scope.UpdatedUser = data;
                    $scope.UserProfileInfo = {
                        name: data.name,
                        username: data.username,
                        photo: data.photo,
                        description: data.description,
                        email: data.email
                    };
                    $scope.PassFun = {
                        password: '',
                        test: ''
                    };
                    var el = angular.element(document.getElementById('testid'));
                    var toast = $mdToast.simple()
                        .textContent('Contraseña modificada correctamente')
                        .action('OK')
                        .highlightAction(false)
                        .hideDelay(8000)
                        .parent(el)
                        .position('top right');
                    $mdToast.show(toast);
                    console.log($scope.UserProfileInfo);
                })
                .error(function(data) {
                    console.log('Error' + data);
                });
        }else{
            var el = angular.element(document.getElementById('testid'));
            var toast = $mdToast.simple()
                .textContent('Asegurate de que las contraseñas coincidan')
                .action('¡Alerta!')
                .highlightAction(false)
                .hideDelay(8000)
                .parent(el)
                .position('top right');
            $mdToast.show(toast);
            console.log($scope.UserProfileInfo);
        }
    };

    $scope.StopFollowUser = function (id) {
        var el = angular.element(document.getElementById(id));
        var toast = $mdToast.simple()
            .textContent('Estas seguro de dejar de seguir a este aventurero')
            .action('SI')
            .highlightAction(false)
            .hideDelay(1000)
            .parent(el)
            .position('top right');
        $mdToast.show(toast);
        $mdToast.show(toast).then(function(response) {
            if (response == 'ok') {
                $http.delete('/user/unfollow/' + id + '/' + $rootScope.UserSessionId._id)
                    .success(function (data) {
                        console.log(data);
                        $scope.FollowingUsers = data.following;
                    })
                    .error(function (data) {
                        console.log('Error' + data);
                    });
            }
        });
    };

    $scope.replaceElement = function () {
        angular.element(document.getElementById('InputFileID')).click();
    };

    $scope.uploadFile = function(){
        var file = $scope.myFile;
        var fd = new FormData();
        fd.append('file', file);
        console.log('mi fichero',file);
        $http.post('/user/update/image/' + $rootScope.UserSessionUri,fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        })
            .success(function(data){
                console.log("success!!");
                $rootScope.UserSessionId = data;
                $scope.UpdatedUser = data;
                $scope.myFile = undefined;
                var el = angular.element(document.getElementById('testid'));
                var toast = $mdToast.simple()
                    .textContent('Imagen modificada correctamente')
                    .action('OK')
                    .highlightAction(false)
                    .hideDelay(8000)
                    .parent(el)
                    .position('top right');
                $mdToast.show(toast);
            })
            .error(function(err){
                console.log("error!!");
                var el = angular.element(document.getElementById('testid'));
                var toast = $mdToast.simple()
                    .textContent('Error al modificar la imagen')
                    .action('OK')
                    .highlightAction(false)
                    .hideDelay(8000)
                    .parent(el)
                    .position('top right');
                $mdToast.show(toast);
            });

        angular.element(document.querySelector('#InputFile')).click().then(function () {

            var file = $scope.myFile;
            var fd = new FormData();
            fd.append('file', file);
            console.log('mi fichero',file);

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
        });


    };

    $scope.cancelUpload = function () {
        $scope.myFile = undefined;
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