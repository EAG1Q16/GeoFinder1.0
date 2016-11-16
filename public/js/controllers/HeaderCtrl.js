/**
 * Created by Andrea on 06/11/2016.
 */
<!--TYPEAHEAD-->
angular.module('GeoFinderApp').controller('HeaderCtrl',['$scope','$http','$routeParams','$rootScope' ,function($scope, $http, $routeParams, $rootScope){

    $scope.data ={
        Options:[
            {Name : 'Usuarios',ID: '1'},
            {Name : 'Aventuras',ID: '2'}],
        selectedOption: {Name : 'Usuarios',ID: '1'}
    };


   /*$scope.selectedUser = $scope.JSON.ResponseObject[0];
    console.log($scope.JSON.ResponseObject[1]);
    console.log($scope.userSelected);*/
    
    //$scope.selectedUserName = $scope.selectedUser.Name;
    //console.log($scope.selectedUser.Name)

//Search functions
console.log('hola ID' + $scope.data.selectedOption.ID);
if ($scope.data.selectedOption.ID == 1){
    console.log("Estoy en el uno");
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

        window.location.href = "#/userprofile/" + $model._id;
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
if ($scope.data.selectedOption.ID == 2){
    console.log("Estoy en el dos");
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

        window.location.href = "#/adventureprofile/" + $model._id;
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

