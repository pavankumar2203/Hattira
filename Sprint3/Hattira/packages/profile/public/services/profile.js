'use strict';

//Articles service used for articles REST endpoint
angular.module('mean.profile').factory('Profile', ['$resource',
  function($resource) {
    return $resource('profile', {
      
    });
  }
]);


angular.module('mean.profile').factory('ProfileInfo', ['$resource',
  function($resource) {
    return $resource('profileinfo', {
      
      },{'query': {method: 'GET', isArray: false}, 'save' : {method: 'POST',params:{data:'data'},isArray:false}});
  }
]);



angular.module('mean.profile').factory('GroupsInfo', ['$resource',
  function($resource) {
    return $resource('groupsinfo', {
      
      },{'query': {method: 'GET', isArray: true}});
  }
]);





angular.module('mean.profile').factory('MemberGroupsInfo', ['$resource',
  function($resource) {
    return $resource('membergroupsinfo', {
      
      },{'query': {method: 'GET', isArray: true}});
  }
]);

