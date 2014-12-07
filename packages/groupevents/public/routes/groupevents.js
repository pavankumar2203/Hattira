'use strict';

//Setting up route
angular.module('mean.groupevents').config(['$stateProvider',
  function($stateProvider) {
    // Check if the user is connected
    var checkLoggedin = function($q, $timeout, $http, $location) {
      // Initialize a new promise
      var deferred = $q.defer();

      // Make an AJAX call to check if the user is logged in
      $http.get('/loggedin').success(function(user) {
        // Authenticated
        if (user !== '0') $timeout(deferred.resolve);

        // Not Authenticated
        else {
          $timeout(deferred.reject);
          $location.url('/login');
        }
      });

      return deferred.promise;
    };

    // states for my app
    $stateProvider
      .state('all events', {
        url: '/groupevents',
        templateUrl: 'groupevents/views/list.html',
        resolve: {
          loggedin: checkLoggedin
        }
      })
      .state('create event', {
        url: '/groupevents/:groupId/create',
        templateUrl: 'groupevents/views/create.html',
        resolve: {
          loggedin: checkLoggedin
        }
      })
      .state('edit event', {
        url: '/groupevents/:eventId/edit',
        templateUrl: 'groupevents/views/edit.html',
        resolve: {
          loggedin: checkLoggedin
        }
      })
      .state('event by id', {
        url: '/groupevents/:eventId',
        templateUrl: 'groupevents/views/view.html',
        resolve: {
          loggedin: checkLoggedin
        }
      });

  }
]);
