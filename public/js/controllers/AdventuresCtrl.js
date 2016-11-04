/**
 * Created by mbmarkus on 3/11/16.
 */
angular.module('GeoFinderApp').controller('AdventuresCtrl',['$scope','$http','$routeParams',function($scope, $http, $routeParams){
    $scope.NewAdventure = {};

    // when landing on the page, get all user and show them
    $http.get('/adventures')
        .success(function(data) {
            $scope.adventures = data;
            console.log(data);

        })
        .error(function(data) {
            console.log('Error: ' + data);
        });

    $scope.CreateAdventure = function(){
        $http.post('/adventures/createadventure/', $scope.NewAdventure)
            .success(function(data){
                $scope.NewAdventure = {}; //clear the form
                $scope.adventures = data;
                console.log(data);
            })
            .error(function(data){
                console.log('Error:' + data);
            });
    };
    $scope.DeleteAdventure = function(id){
        $http.delete('/adventures/removeadventure/' + id)
            .success(function(data) {
                $scope.adventures = {};
                $scope.adventures = data;
            })
            .error(function(data) {
                console.log('Error:' + data);
            });
    };
}]);