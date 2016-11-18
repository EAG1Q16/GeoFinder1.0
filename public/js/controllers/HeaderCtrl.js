/**
 * Created by Andrea on 06/11/2016.
 */
angular.module('GeoFinderApp').controller('HeaderCtrl',['$scope','$rootScope','$http','$routeParams',function($scope, $rootScope, $http, $routeParams){

    function clear() {
        $scope.model = {}; 
    }
    

    $scope.options = [{
        id: 1,
        name: 'Usuarios'
    },{
        id: 2,
        name: 'Aventuras'
    }];

    $scope.sel = $scope.options[0];
    
    $scope.flag = true;
    
    searcher();
    function  searcher() {
        if ($scope.flag){
            $scope.sel = $scope.options[0];
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
            $scope.flag = false;

        }


        else{
            $scope.sel = $scope.options[1];
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
            $scope.flag =true;

        }
    }


    $scope.cambio = (function () {

        searcher();

    });

}]);

