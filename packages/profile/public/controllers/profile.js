'use strict';

angular.module('mean.profile',['angularFileUpload', 'ui.select']).controller('ProfileController', ['$scope', '$upload', '$stateParams', '$location', 'Global', 'Profile', 'ProfileInfo', 'GroupsInfo', 'MemberGroupsInfo',
  function($scope, $upload,$stateParams, $location, Global, Profile, ProfileInfo, GroupsInfo, MemberGroupsInfo) {
    $scope.global = Global;
    $scope.hasAuthorization = function(profile) {
      if (!profile || !profile.user) return false;
      return $scope.global.isAdmin || profile.user._id === $scope.global.user._id;
    };

     $scope.find = function() {
      Profile.query(function(data) {
       if(data)
       {
          if(data[0] && data[0].picture)     
          $scope.uploadedImage = data[0].picture;
       }
        
      });
    };


     $scope.mygroups = function() {
      GroupsInfo.query(function(data) {    
        $scope.groups = data;
      });
    };


     $scope.membergroups = function() {
      MemberGroupsInfo.query(function(data) {  
       $scope.groups = data;
      
      });
    };

     $scope.create = function() {
      ProfileInfo.query(function(data) {
        $scope.user = data;
      });
    };


     $scope.saveInfo = function(user) {
        //run ajax query to submit the fields.
        var results = [];
        if(this.multi.selectedKeywords.length > 0)
        {  
          for(var i = 0;i<this.multi.selectedKeywords.length;i+=1){
           results.push(this.multi.selectedKeywords[i]._id);
          }
        }
        user.Interests = results;
        console.log(user);
        user = JSON.stringify(user);
        console.log('I am trying to save information'+ user);
        $scope.user = user;

      ProfileInfo.save({'data':user},function(data) {
        $scope.user = data;
        
      });
    };

    $scope.onFileSelect = function(image) {
            if (angular.isArray(image)) {
                image = image[0];
            }

            if (image.type !== 'image/png' && image.type !== 'image/jpeg') {
                alert('Only PNG and JPEG are accepted.');
                return;
            }
            $scope.uploadInProgress = true;
            $scope.uploadProgress = 0;

            $scope.upload = $upload.upload({
                url: '/profile',
                method: 'POST',
                file: image
            }).progress(function(event) {
                $scope.uploadProgress = Math.floor(event.loaded / event.total);
                $scope.$apply();
            }).success(function(data, status, headers, config) {
                $scope.uploadInProgress = false;    
                 $scope.uploadedImage = data;      
            }).error(function(err) {
                $scope.uploadInProgress = false;
                console.log('Error uploading file: ' + err.message || err);
            });
        };


  }
]);
