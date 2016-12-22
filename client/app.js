'use strict';

/* jshint unused:false */
angular.module('app', ['ngMessages', 'ngAnimate', "ui.router", "satellizer", "toastr"])
  .config(function($stateProvider, $urlRouterProvider, $authProvider, routeProvider) {
    /* inject:routes */
    /* endinject */

    /* inject:configs */
    /* endinject */

    $urlRouterProvider.otherwise('/');
  });
