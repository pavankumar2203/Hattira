'use strict';

//Setting up route
angular.module('mean.groups').config(['$stateProvider',
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
      .state('all groups', {
        url: '/groups',
        templateUrl: 'groups/views/list.html',
        resolve: {
          loggedin: checkLoggedin
        }
      })
      .state('create group', {
        url: '/groups/create',
        templateUrl: 'groups/views/create.html',
        resolve: {
          loggedin: checkLoggedin
        }
      })
      .state('edit group', {
        url: '/groupdetails/:groupId/edit',
        templateUrl: 'groups/views/edit.html',
        resolve: {
          loggedin: checkLoggedin
        }
      })
      .state('group by id', {
        url: '/groups/:groupId',
        templateUrl: 'groups/views/view.html',
        resolve: {
          loggedin: checkLoggedin
        }
      });

  }
]);
