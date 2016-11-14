/**
 * Created by Andrea on 05/11/2016.
 */

angular.module('GeoFinderApp').controller('HomeCtrl',['$scope','$http','$routeParams','$window',function($scope, $http, $routeParams, $window){

    $scope.Searcher = function() {
        $window.location.href= "#/adventures";
    }
}]);