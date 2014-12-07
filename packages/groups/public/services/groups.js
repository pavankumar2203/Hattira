'use strict';

//Groups service used for groups REST endpoint
angular.module('mean.groups').factory('Groups', ['$resource',
  function($resource) {
    return $resource('groups/:groupId', {
      groupId: '@_id'
    });
  }
]);

angular.module('mean.groups').factory('GroupDetails', ['$resource',
  function($resource) {
    return $resource('groupdetails/:groupId', {
      groupId: '@_id'
    });
  }
]);

angular.module('mean.groups').factory('GetKeywords', ['$resource',
  function($resource){
  	return $resource('keywords',{
  	 },{'getall':{method:'GET',isArray:true}});
    }
]);

angular.module('mean.groups').factory('MemberGroups', ['$resource',
  function($resource) {
    return $resource('memberprofile', {
      
      }, {'subscribe' : {method: 'POST',params:{data:'data'},isArray:false}});
  }
]);

angular.module('mean.groups').factory('Rsvp', ['$resource',
  function($resource) {
    return $resource('rsvp', {
      
      }, {'rsvp' : {method: 'POST',params:{data:'data'},isArray:false}});
  }
]);

