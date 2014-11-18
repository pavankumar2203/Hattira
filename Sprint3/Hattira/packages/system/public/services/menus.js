'use strict';

angular.module('mean.system').factory('Menus', ['$resource',
  function($resource) {
    return $resource('admin/menu/:name', {
      name: '@name',
      defaultMenu: '@defaultMenu'
    });
  }
]);

angular.module('mean.system').factory('HomePage', ['$resource',
  function($resource) {
    return $resource('homepage', {
      
      },{'query': {method: 'GET', isArray: false}});
  }
]);
