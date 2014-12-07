'use strict';

//events service used for events REST endpoint
angular.module('mean.groupevents').factory('GroupEvents', ['$resource',
  function($resource) {
    return $resource('groupevents/:eventId', {
      eventId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);



