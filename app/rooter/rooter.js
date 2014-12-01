'use strict';
angular.module('app', ['ngRoute','ngDraggable','app.mix','app.team','app.help'])
    .config(function ($routeProvider) {
        $routeProvider.
            when('/mix', {
                templateUrl: 'templates/mix/mix.html',
                controller: 'mixCtrl'
            }).
            when('/help', {
                templateUrl: 'templates/help/help.html',
                controller: 'helpCtrl'
            }).
            when('/team', {
                templateUrl: 'templates/team/team.html',
                controller: 'teamCtrl'
            }).
            otherwise({
                redirectTo: '/mix'
            });
});

