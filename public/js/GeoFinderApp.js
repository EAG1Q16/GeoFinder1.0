/**
 * Created by tonim on 05/10/2016.
 */

var GeoFinderApp = angular.module('GeoFinderApp', ['ngRoute','uiGmapgoogle-maps','ui.bootstrap']);

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
            controller: 'ProfileCtrl'
        })
        .otherwise({
            redirectTo: '/index'
        })
    .when('/adventures', {
        templateUrl: './views/adventures.html',
        controller: 'AdventuresCtrl'
    })
        .otherwise({
            redirectTo: '/index'
        })
    .when('/maps', {
        templateUrl: './views/maps.html',
        controller: 'MapsCtrl'
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
        });
    
}]);



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




