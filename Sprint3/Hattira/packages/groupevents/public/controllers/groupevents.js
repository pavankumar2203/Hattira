'use strict';

angular.module('mean.groupevents',['ngAutocomplete']).controller('EventsController', ['$scope', '$stateParams', '$location', 'Global', 'GroupEvents',
  function($scope, $stateParams, $location, Global, GroupEvents) {
    $scope.global = Global;
    $scope.details = '';
    $scope.options = '';

    $scope.hasAuthorization = function(event) {
      if (!event || !event.user) return false;
      return $scope.global.isAdmin || event.user._id === $scope.global.user._id;
    };

    $scope.create = function(isValid) {

      var groupId = window.location.hash.split('/')[2];

      console.log(groupId);

      console.log('is the form valid' + isValid);

      if (isValid) {
        var events = new GroupEvents({
          name: this.name,
          description: this.description,
          event_time: this.event_time,
          group: groupId,
          venue:this.venue
        });

        console.log(events);

        events.$save(function(response) {
          console.log(response._id);
          $location.path('groupevents/' + response._id);
        });

        this.name = '';
        this.description = '';
      } else {
        $scope.submitted = true;
      }
    };

    $scope.remove = function(event) {
      if (event) {
        event.$remove(function(response) {
          for (var i in $scope.events) {
            if ($scope.events[i] === event) {
              $scope.events.splice(i, 1);
            }
          }
          $location.path('groupevents');
        });
      } else {
        $scope.event.$remove(function(response) {
          $location.path('groupevents');
        });
      }
    };

    $scope.update = function(isValid) {
      if (isValid) {
        var event = $scope.event;
        if (!event.updated) {
          event.updated = [];
        }
        event.updated.push(new Date().getTime());

        event.$update(function() {
          $location.path('groupevents/' + event._id);
        });
      } else {
        $scope.submitted = true;
      }
    };

    $scope.find = function() {
      GroupEvents.query(function(events) {
        $scope.events = events;
      });
    };

    $scope.findOne = function() {
      GroupEvents.get({
        eventId: $stateParams.eventId
      }, function(event) {
        $scope.event = event;
      });
    };
  }
]);
