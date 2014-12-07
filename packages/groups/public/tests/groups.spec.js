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
      it('$scope.find() should create an array with at least one group object ' +
        'fetched from XHR', function() {
          $httpBackend.when('GET', 'keywords').respond([]);
          // test expected GET request
          $httpBackend.expectGET('groups').respond([{
            name: 'Python nerds',
            description: 'This is a group for Pythonistas'
          }]);

          // run controller
          scope.find();
          $httpBackend.flush();

          // test scope value
          expect(scope.groups).toEqualData([{
            name: 'Python nerds',
            description: 'This is a group for Pythonistas'
          }]);

        });

      it('$scope.update(true) should update a valid group', inject(function(Groups) {
        $httpBackend.when('GET', 'keywords').respond([]);
        // fixture rideshare
        var putGroupData = function() {
          return {
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Python nerds',
            to: 'Pythonistas!'
          };
        };

        // mock group object from form
        var group = new Groups(putGroupData());

        // mock group in scope
        scope.group = group;

        // test PUT happens correctly
        $httpBackend.expectPUT(/groups\/([0-9a-fA-F]{24})$/).respond();
        
        scope.update(true);
        $httpBackend.flush();

        // test URL location to new object
        expect($location.path()).toBe('/groups/' + putGroupData()._id);

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
