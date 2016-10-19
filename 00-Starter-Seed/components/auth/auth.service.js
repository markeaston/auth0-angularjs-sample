(function() {

  'use strict';

  angular
    .module('app')
    .service('authService', authService);

  authService.$inject = ['$rootScope', 'lock', 'authManager', '$state'];

  function authService($rootScope, lock, authManager, $state) {

    var userProfile = JSON.parse(localStorage.getItem('profile')) || {};
    var idToken = localStorage.getItem('id_token');
    var refreshToken = localStorage.getItem('refresh_token');

    function getToken() {
      return idToken;
    }

    function getRefreshToken() {
      return refreshToken;
    }


    function getUserProfile() {
      return userProfile;
    }

    function setUserProfile(profile) {
      userProfile = profile;
    }

    function setToken(token) {
      idToken = token;
    }

  function setRefreshToken(token) {
      refreshToken = token;
    }

    function login() {
      lock.show();
    }

    // Logging out just requires removing the user's
    // id_token and profile
    function logout() {
      localStorage.removeItem('id_token');
      localStorage.removeItem('refresh_token');      
      localStorage.removeItem('profile');
      authManager.unauthenticate();
      userProfile = {};
      idToken = null;
      refreshToken = null;
    }

    // Set up the logic for when a user authenticates
    // This method is called from app.run.js
    function registerAuthenticationListener() {
      lock.on('authenticated', function(authResult) {
        localStorage.setItem('id_token', authResult.idToken);
        setToken(authResult.idToken);
        setRefreshToken(authResult.refreshToken);
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
      getToken: getToken,
      setToken: setToken,      
      getRefreshToken: getRefreshToken,
      login: login,
      logout: logout,
      registerAuthenticationListener: registerAuthenticationListener,
    }
  }
})();