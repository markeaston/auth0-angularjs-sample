(function() {

  'use strict';

  angular
    .module('app')
        .run(registerEventHandler);

    registerEventHandler.$inject = ['$rootScope', 'authService', 'authManager', 'lock', 'jwtHelper'];

    function registerEventHandler($rootScope, authService, authManager, lock, jwtHelper) {
      
      // Put the authService on $rootScope so its methods
      // can be accessed from the nav bar
      $rootScope.authService = authService;

      lock.interceptHash();       // See https://auth0.com/forum/t/authenticated-event-not-triggering/3554/45 for why this is added      

      // Register the authentication listener that is
      // set up in auth.service.js
      authService.registerAuthenticationListener();

      // Use the authManager from angular-jwt to check for
      // the user's authentication state when the page is
      // refreshed and maintain authentication
      authManager.checkAuthOnRefresh();

      // Listen for 401 unauthorized requests and redirect
      // the user to the login page
      authManager.redirectWhenUnauthenticated();

      // See if the token has expired. If it has use the refresh token to get a new token
      // and then reauthenticate the user with the new token. 
      $rootScope.$on('$locationChangeStart', function () {
          var token = authService.getToken();
          var refreshToken = authService.getRefreshToken();
          if (token) {
              if (jwtHelper.isTokenExpired(token)) {
                  angularAuth0.refreshToken(refreshToken, function (err, delegationResult) {
                      if (delegationResult) {
                          token = delegationResult.id_token;
                          localStorage.setItem('id_token', token);
                          authService.setToken(token);
                          authManager.authenticate(authService.getUserProfile(), token);
                      }
                      $state.go('app.runner.flowsin');
                  });
              }
          }

        });

    }

})();