'use strict';

angular.module('mean.system',['geolocation']).controller('HeaderController', ['$scope', '$rootScope', 'Global', 'Menus', 'geolocation',
  function($scope, $rootScope, Global, Menus, geolocation) {
    $scope.global = Global;
    $scope.menus = {};
    // Default hard coded menu items for main menu
    var defaultMainMenu = [];

    // Query menus added by modules. Only returns menus that user is allowed to see.
    function queryMenu(name, defaultMenu) {

      Menus.query({
        name: name,
        defaultMenu: defaultMenu
      }, function(menu) {
        $scope.menus[name] = menu;
      });
    }

    // Query server for menus and check permissions
    queryMenu('main', defaultMainMenu);

    $scope.isCollapsed = false;

    $rootScope.$on('loggedin', function() {
      //tell the user its logged in.
      $scope.global.authenticated = true;
       $scope.global = {
        authenticated: true,
        user: $rootScope.user
      };
      queryMenu('main', defaultMainMenu);
  
    });

  }
]);
