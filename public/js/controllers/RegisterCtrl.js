/**
 * Created by tonim on 17/10/2016.
 */
/**
 * Created by tonim on 05/10/2016.
 */
angular.module('GeoFinderApp').controller('RegisterCtrl',['$scope','$location','$http','$routeParams', function($scope, $location, $http, $routeParams){

    $scope.NewUser = {};

    $scope.RegisterUser = function(){
        $http.post('/user/signup', $scope.NewUser)
            .success(function(data){
                $scope.NewUser = {}; //clear the form
                console.log('nice usuario registrado');
                console.log(data);
                $location.path('/login');


            })
            .error(function(data){
                console.log('Error:' + data);
                $scope.ErrorMsg = ('¡Faltan Campos!');
            });
    };

}]);




