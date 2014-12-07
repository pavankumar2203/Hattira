'use strict';

angular.module('mean.system').controller('IndexController', ['$scope', 'Global', 'NearByEvents', 'geolocation', 'HomePage',
  function($scope, Global, NearByEvents, geolocation, HomePage) {
    $scope.global = Global;
    $scope.nevents = [];
    geolocation.getLocation().then(function(data){
       var mylat = data.coords.latitude;
       var mylng = data.coords.longitude;
       NearByEvents.getnearby({lat:mylat, lng:mylng}, function(data){ $scope.nevents = data; console.log($scope.nevents); });
    });

    $scope.fillnumbers = function() {

      HomePage.query(function(data) {
       if(data)
       {
          $scope.subscribedgroups = data.subscribedgroups;
          $scope.groupsaround = data.groupsaround;
          $scope.events = data.events;
          $scope.groups = data.groups;
          $scope.eventsList = data.eventsList;         
       }
        
      });
    };
  }
]);
