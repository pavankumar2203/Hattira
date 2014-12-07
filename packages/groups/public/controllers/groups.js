'use strict';

angular.module('mean.groups',['ngSanitize', 'ui.select','angularFileUpload']).controller('GroupsController', ['$scope', '$upload','$http', '$stateParams', '$location', 'Global', 'Groups', 'Rsvp', 'GetKeywords', 'GroupDetails', 'MemberGroups',
  function($scope, $upload , $http, $stateParams, $location, Global, Groups, Rsvp, GetKeywords, GroupDetails, MemberGroups) {
    $scope.keywords = [];
    $scope.multi = {}; 
    $scope.multi.selectedKeywords = [];

    GetKeywords.getall(function(data){ $scope.keywords = data; console.log(data);});
    $scope.global = Global;
    $scope.hasAuthorization = function(group) {
      if (!group || !group.created_by) return false;
      return group.created_by === $scope.global.user._id;
    };


    $scope.onFileSelect = function(image) {

      var groupID = window.location.hash.split('/')[2];

            if (angular.isArray(image)) {
                image = image[0];
            }

            // This is how I handle file types in client side
            if (image.type !== 'image/png' && image.type !== 'image/jpeg') {
                alert('Only PNG and JPEG are accepted.');
                return;
            }

            $scope.uploadInProgress = true;
            $scope.uploadProgress = 0;


            $scope.upload = $upload.upload({
                url: '/groupimage/' +groupID,
                method: 'POST',
                 data: {groupID:groupID},
                file: image
            }).progress(function(event) {
                $scope.uploadProgress = Math.floor(event.loaded / event.total);
                $scope.$apply();
            }).success(function(data, status, headers, config) {
                $scope.uploadInProgress = false;
                // If you need uploaded file immediately 
                //console.log('data is received ' + data);
                //$scope.uploadedImage = JSON.parse(data);      
                 $scope.uploadedImage = data;      
            }).error(function(err) {
                $scope.uploadInProgress = false;
                console.log('Error uploading file: ' + err.message || err);
            });
        };



   $scope.findMember = function(group) {
       var arrlen = group.members.length;
	     for(var i=0; i<arrlen; i+=1)  { if( group.members[i] === $scope.global.user._id) return true; }
       return false;
     };

    $scope.create = function(isValid) {
      if (isValid) {
        var results = [];
        if(this.multi.selectedKeywords.length > 0)
        {  
          for(var i = 0;i<this.multi.selectedKeywords.length;i+=1){
	         results.push(this.multi.selectedKeywords[i]._id);
          }
        }
        var group = new Groups({
          name: this.name,
          description: this.description,
	        tags: results
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

        group.$save(function() {
          $location.path('groups/' + group._id);
        });
      } else {
        $scope.submitted = true;
      }
    };

   $scope.addmembers = function(group) {
     if(group) {
        group.members.push($scope.global.user._id);
        group.$save(function(response) {
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
      }, function(data) {
        $scope.group = data.group;
        $scope.groupeventslist = data.groupeventslist;
        
      });
    };
    $scope.findGroup = function() {
      GroupDetails.get({
        groupId: $stateParams.groupId
      }, function(group) {
        $scope.group = group;
      });
    };
  }
]);
