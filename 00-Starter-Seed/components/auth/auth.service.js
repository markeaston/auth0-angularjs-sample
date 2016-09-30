(function() {

  'use strict';

  angular
    .module('app')
    .service('authService', authService);

  authService.$inject = ['$rootScope', 'lock', 'authManager', '$state'];

  function authService($rootScope, lock, authManager, $state) {

    var userProfile = JSON.parse(localStorage.getItem('profile')) || {};

    function getUserProfile() {
      return userProfile;
    }

    function setUserProfile(profile) {
      userProfile = profile;
    }

    function login() {
      lock.show();
    }

    // Logging out just requires removing the user's
    // id_token and profile
    function logout() {
      localStorage.removeItem('id_token');
      localStorage.removeItem('profile');
      authManager.unauthenticate();
      userProfile = {};
    }

    // Set up the logic for when a user authenticates
    // This method is called from app.run.js
    function registerAuthenticationListener() {
      lock.on('authenticated', function(authResult) {
        localStorage.setItem('id_token', authResult.idToken);
        authManager.authenticate();

        lock.getProfile(authResult.idToken, function(error, profile) {
          if (error) {
            console.log(error);
          }

          localStorage.setItem('profile', JSON.stringify(profile));
          setUserProfile(profile);
          $state.go('app.test.home');
          $rootScope.$broadcast('userProfileSet', profile);
        });
      });
    }

    return {
      getUserProfile: getUserProfile,
      login: login,
      logout: logout,
      registerAuthenticationListener: registerAuthenticationListener,
    }
  }
})();
