/**
 * Created by mbmarkus on 4/11/16.
 */
angular.module('GeoFinderApp').controller('CreatorCtrl2',['$scope','$rootScope','$http',
    '$timeout','NgMap', function($scope, $rootScope, $http, $timeout, NgMap){
        var height = document.getElementById('lleno').offsetHeight;
        console.log(height);
        $scope.style = {
            height: height + 'px;'
        };

    NgMap.getMap().then(function(map) {
        });
}]);
