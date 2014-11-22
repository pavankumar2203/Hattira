'use strict';

(function() {
  // Groups Controller Spec
  describe('MEAN controllers', function() {
    describe('GroupsController', function() {
      beforeEach(function() {
        this.addMatchers({
          toEqualData: function(expected) {
            return angular.equals(this.actual, expected);
          }
        });
      });

      beforeEach(function() {
        module('mean');
        module('mean.system');
        module('mean.groups');
      });

      // Initialize the controller and a mock scope
      var GroupsController,
        scope,
        $httpBackend,
        $stateParams,
        $location;

      beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {

        scope = $rootScope.$new();

        GroupsController = $controller('GroupsController', {
          $scope: scope,
	  keywords: []
        });

        $stateParams = _$stateParams_;

        $httpBackend = _$httpBackend_;

        $location = _$location_;

      }));
     it('$scope.remove() should send a DELETE request with a valid groupId ' +
        'and remove the group from the scope', inject(function(Groups) {
	  $httpBackend.when('GET', 'keywords').respond([]);
          // fixture rideshare
          var group = new Groups({
            _id: '525a8422f6d0f87f0e407a33'
          });

          // mock rideshares in scope
          scope.groups = [];
          scope.groups.push(group);

          // test expected rideshare DELETE request
          $httpBackend.expectDELETE(/groups\/([0-9a-fA-F]{24})$/).respond(204);

          // run controller
          scope.remove(group);
          $httpBackend.flush();

          // test after successful delete URL location groups list
          //expect($location.path()).toBe('/groups');
          expect(scope.groups.length).toBe(0);

        }));

    });
  });
}());
