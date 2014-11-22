'use strict';

angular.module('mean.groups',['localytics.directives']).controller('GroupsController', ['$scope', '$http', '$stateParams', '$location', 'Global', 'Groups', 'Rsvp', 'GetKeywords', 'MemberGroups',
  function($scope, $http, $stateParams, $location, Global, Groups, Rsvp, GetKeywords, MemberGroups) {
      $scope.sKeyword = [];
      $scope.keywords_lang = {
        python: 'Python',
        java: 'Java',
        clojure: 'Clojure',
        haskell: 'Haskell',
        coffee: 'Coffee',
        erlanng: 'Erlang'
      };
    GetKeywords.getall(function(data){ console.log(data);});
    $scope.global = Global;
    $scope.hasAuthorization = function(group) {
      if (!group || !group.created_by) return false;
      return group.created_by === $scope.global.user._id;
    };

   $scope.findMember = function(group) {
       var arrlen = group.members.length;
	for(var i=0; i<arrlen; i++)  { if( group.members[i] == $scope.global.user._id) return true; }
       return false;
     };

    $scope.findkeyword = function(keyword) {
      /*Keywords.get({
        keywordId: keyword
      }, function(keyword) {
        $scope.chosenkeyword = keyword;
      });*/
    };

    $scope.create = function(isValid) {
      if (isValid) {
        if(this.selectedKeyword)
          $scope.findkeyword(this.selectedKeyword.originalObject._id);
        else
          $scope.chosenkeyword = {};
        var group = new Groups({
          name: this.name,
          description: this.description,
	  tags: $scope.chosenkeyword
        });
        group.$save(function(response) {
          $location.path('groups/' + response._id);
        });

        this.name = '';
        this.description = '';
      } else {
        $scope.submitted = true;
      }
    };
   $scope.remove = function(group) {
      if (group) {
        group.$remove(function(response) {
          for (var i in $scope.groups) {
            if ($scope.groups[i] === group) {
              $scope.groups.splice(i, 1);
            }
          }
          $location.path('groups');
        });
      } else {
        $scope.group.$remove(function(response) {
          $location.path('groups');
        });
      }
    };

    $scope.update = function(isValid) {
      if (isValid) {
        var group = $scope.group;
        if (!group.updated) {
          group.updated = [];
        }
        group.updated.push(new Date().getTime());

        group.$update(function() {
          $location.path('groups/' + group._id);
        });
      } else {
        $scope.submitted = true;
      }
    };

   $scope.addmembers = function(group) {
     if(group) {
        group.members.push($scope.global.user._id);
	group.$update(function(response) {
          $location.path('groups/' + response._id);
        });
        //also update user profile
        MemberGroups.subscribe({'data':group._id},function(data) {
        console.log('subscription added to group number ' + group._id);
        
      });
     }
     $location.path('/');
   };


   $scope.RSVP = function(groupevent) {
      Rsvp.rsvp({'data':groupevent._id},function(data) {
        console.log('RSVPed to event ' + groupevent._id);
        
      });
      $location.path('/');
   };


    $scope.find = function() {
      Groups.query(function(groups) {
        $scope.groups = groups;
      });
    };

    $scope.findOne = function() {
      Groups.get({
        groupId: $stateParams.groupId
      }, function(group) {


        $scope.group = group.group;
        $scope.groupeventslist = group.groupeventslist;
      });
    };
  }
]);
