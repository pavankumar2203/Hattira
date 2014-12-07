'use strict';

//Keywords service used for Keywords REST endpoint
angular.module('mean.keywords').factory('Keywords', ['$resource',
  function($resource) {
    return $resource('keywords/:keywordId', {
      keywordId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
