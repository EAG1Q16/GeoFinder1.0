/**
 * Created by tonim on 05/10/2016.
 */

var GeoFinderApp = angular.module('GeoFinderApp', ['ngRoute', 'uiGmapgoogle-maps','ui.bootstrap','ngMaterial']);

GeoFinderApp.config(['$routeProvider', function($routeProvider){

    $routeProvider
    .when('/index', {
        templateUrl: './views/home.html',
        controller: 'HomeCtrl'
        })
        .otherwise({
            redirectTo: '/index'
    })
    .when('/login', {
        templateUrl: './views/login.html',
        controller: 'LoginCtrl'
        })
        .otherwise({
            redirectTo: '/index'
        })
    .when('/register', {
        templateUrl: './views/register.html',
        controller: 'RegisterCtrl'
    })
        .otherwise({
            redirectTo: '/index'
        })
    .when('/profile', {
            templateUrl: './views/profile.html',
            controller: 'ProfileCtrl',
            resolve:{
                factory: checkRouting
            }
        })
        .otherwise({
            redirectTo: '/index'
        })
    .when('/adventures', {
        templateUrl: './views/adventures.html',
        controller: 'AdventuresCtrl',
        resolve:{
            factory: checkRouting
        }
    })
        .otherwise({
            redirectTo: '/index'
        })
    .when('/creator', {
        templateUrl: './views/creator.html',
        controller: 'CreatorCtrl'
        //resolve:{
        //    factory: checkRouting
        //}
        })
        .otherwise({
            redirectTo: '/index'
        })
    .when('/adventureprofile/:id', {
            templateUrl: './views/adventureProfile.html',
            controller: 'PublicAdventureProfileCtrl'
        })
        .otherwise({
            redirectTo: '/index'
        })
    .when('/userprofile/:id', {
        templateUrl: './views/publicUserProfile.html',
        controller: 'PublicUserProfileCtrl'
    })
        .otherwise({
            redirectTo: '/index'

    })
    .when('/useradventures', {
        templateUrl: './views/useradventures.html',
        controller: 'UserAdventuresCtrl',
        resolve:{
            factory: checkRouting
        }
    })
        .otherwise({
            redirectTo: '/index'
    })
    .when('/ranking', {
        templateUrl: './views/ranking.html',
        controller: 'RankingCtrl',
        resolve:{
            factory: checkRouting
        }
    })
    .otherwise({
            redirectTo: '/index'
    })
    .when('/unauthorized', {
            templateUrl: './views/notlogged.html'
    })
    .otherwise({
            redirectTo: '/index'
    });
    
}]);

var checkRouting = function ($q, $rootScope, $location, $http) {
    // when landing on the page get user session
    $http.get('/user/sessionid')
        .success(function(data) {
                return true;
        })
        .error(function(data) {
            $location.path("/unauthorized");
            return false;
        });

};



/*
GeoFinderApp.config(
    ['uiGmapGoogleMapApiProvider', function(GoogleMapApiProviders) {
        GoogleMapApiProviders.configure({
            china: true
        });
    }],
    function(uiGmapGoogleMapApiProvider) {
            uiGmapGoogleMapApiProvider.configure({
                key: 'AIzaSyB82JOzgkrMP_ViC8v3aE9P2VHEWX5aaAE',
                v: '3', //defaults to latest 3.X anyhow
                libraries: 'weather,geometry,visualization'
            });
        }
);
 */




