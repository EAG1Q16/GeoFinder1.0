/**
 * Created by Andrea on 06/11/2016.
 */
<!--TYPEAHEAD-->
angular.module('GeoFinderApp').controller('HeaderCtrl',['$scope','$http','$routeParams',function($scope, $http, $routeParams){

    $scope.JSON ={
        "ResponseObject":
            [{
            "Name" : "Usuarios",
            "ID": 1},
            {
            "Name" : "Aventuras",
            "ID": 2
            }]
    };

    $scope.selectedUser = $scope.JSON.ResponseObject[0];
    
    //$scope.selectedUserName = $scope.selectedUser.Name;
    //console.log($scope.selectedUser.Name)

//Search functions

if ($scope.selectedUser.ID = 1){
    $http.get('/user')
        .success(function(data) {
            $scope.users = data;
            console.log(data);

        })
        .error(function(data) {
            console.log('Error: ' + data);
        });


    $scope.selected = undefined;

    
    $scope.onSelect = function ($item, $model, $label) {

        //$location.path('/profile/'+ $model.username);
        $scope.$item = $item;
        $scope.$model = $model;
        $scope.$label = $label;
        console.log($model);
        $scope.userSelected = $model.username;

    };

    

    $scope.modelOptions = {
        debounce: {
            default: 500,
            blur: 250
        },
        getterSetter: true
    };

}
if ($scope.selectedUser.ID = 2){
    $http.get('/adventures')
        .success(function(data) {
            $scope.adventures = data;
            console.log(data);

        })
        .error(function(data) {
            console.log('Error: ' + data);
        });
    $scope.selected = undefined;


    $scope.onSelect = function ($item, $model, $label) {

        window.location.href = "#/adventureProfile/" + $model._id;
        $scope.$item = $item;
        $scope.$model = $model;
        $scope.$label = $label;
        console.log($model);
        $scope.userSelected = $model.name;

    };

    $scope.modelOptions = {
        debounce: {
            default: 500,
            blur: 250
        },
        getterSetter: true
    };
}
}]);

