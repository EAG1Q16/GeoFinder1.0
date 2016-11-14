/**
 * Created by tonim on 05/10/2016.
 */
var GeoFinderApp = angular.module('GeoFinderApp', ['ngRoute','ui.bootstrap']);

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
        });
    
}]);


