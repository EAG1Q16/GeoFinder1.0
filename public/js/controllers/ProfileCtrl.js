/**
 * Created by tonim on 03/11/2016.
 */
angular.module('GeoFinderApp').controller('ProfileCtrl',['$scope','$http','$routeParams', function($scope, $http, $routeParams){
    $scope.LogoutUser = function() {
        $http.get('/user/logout')
            .success(function(data){
                console.log(data);
            })
            .error(function(data){
                console.log('Error:' + data);
            });
    };

}]);