angular.module('GeoFinderApp').controller('HomeCtrl',['$scope','$location','$rootScope','$http','$routeParams', '$window', function($scope, $location, $rootScope, $http, $routeParams, $window){

    // when landing on the page get user
    $http.get('/user/sessionid')
        .success(function(data) {
            $rootScope.UserSessionId = data._id;
            console.log($rootScope.UserSessionId)

        })
        .error(function(data) {
            console.log('not logged');
        });

    $scope.Searcher = function() {
        $window.location.href= "#/adventures";
    };

}]);