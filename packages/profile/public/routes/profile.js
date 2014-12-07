'use strict';

//Setting up route
angular.module('mean.profile').config(['$stateProvider',
  function($stateProvider) {
    // Check if the user is connected
    var checkLoggedin = function($q, $timeout, $http, $location) {
      // Initialize a new promise
      var deferred = $q.defer();

      // Make an AJAX call to check if the user is logged in
      $http.get('/loggedin').success(function(user) {
        if (user !== '0') $timeout(deferred.resolve);
        else {
          $timeout(deferred.reject);
          $location.url('/login');
        }
      });

      return deferred.promise;
    };

    // states for my app
    $stateProvider
      .state('my profile', {
        url: '/profile',
        templateUrl: 'profile/views/profile.html',
        resolve: {
          loggedin: checkLoggedin
        }
      });
  }
]);
