(function() {

  'use strict';

  angular
    .module('app', ['ui.router', 'auth0.lock', 'angular-jwt', 'auth0.auth0'])
    .config(config);

    config.$inject = ['$httpProvider', 'lockProvider', 'jwtOptionsProvider', 'jwtInterceptorProvider', '$stateProvider', '$urlRouterProvider','$locationProvider'];

    function config($httpProvider, lockProvider, jwtOptionsProvider, jwtInterceptorProvider, $stateProvider, $urlRouterProvider, $locationProvider) {

    $urlRouterProvider.when('', 'login');
    $urlRouterProvider.when('/', 'login');

      // Initialization for the Lock widget
      lockProvider.init({
        clientID: AUTH0_CLIENT_ID,
        domain: AUTH0_DOMAIN,
        options: {
          auth: {
            params: {
              scope: 'openid offline_access'    //offline_access so that we get a refresh token   
            }
          }
        }
      });

      // Configuration for angular-jwt
      jwtOptionsProvider.config({
        tokenGetter: function() {
          var token = localStorage.getItem('id_token');
          return token;
        },
        whiteListedDomains: ['localhost'],
        unauthenticatedRedirectPath: '/login'
      });

      $locationProvider.html5Mode(true);
      
      // Add the jwtInterceptor to the array of HTTP interceptors
      // so that JWTs are attached as Authorization headers
      $httpProvider.interceptors.push('jwtInterceptor');

      $stateProvider
        .state('login', {
          url: '/login',
          controller: 'loginController',
          templateUrl: 'components/login/login.html'
        })      
        .state('app', {
            abstract: true
        }) 
        .state('app.test', {
          abstract: true,       
          url: '/'      
        })   
        .state('app.test.home', {
          url: 'home',
          controller: 'homeController',
          templateUrl: 'components/home/home.html'
        })
        .state('app.test.ping', {
          url: 'ping',
          controller: 'pingController',
          templateUrl: 'components/ping/ping.html'
        });

      $urlRouterProvider.otherwise('/');
    }

})();
