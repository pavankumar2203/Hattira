'use strict';

angular.module('mean.profile',['angularFileUpload']).controller('ProfileController', ['$scope', '$upload', '$stateParams', '$location', 'Global', 'Profile', 'ProfileInfo', 'GroupsInfo', 'MemberGroupsInfo',
  function($scope, $upload,$stateParams, $location, Global, Profile, ProfileInfo, GroupsInfo, MemberGroupsInfo) {
    $scope.global = Global;

    $scope.hasAuthorization = function(profile) {
      if (!profile || !profile.user) return false;
      return $scope.global.isAdmin || profile.user._id === $scope.global.user._id;
    };

     $scope.find = function() {
      Profile.query(function(data) {
       
       //console.log(data);
       if(data)
       {
          //data = JSON.parse(JSON.stringify(data));  
          //console.log(data[0].picture);
          if(data[0] && data[0].picture)     
          $scope.uploadedImage = data[0].picture;
       }
        
      });
    };


     $scope.mygroups = function() {
      GroupsInfo.query(function(data) {
       
       // data = JSON.parse(JSON.stringify(data));       
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
        user = JSON.stringify(user);
        console.log('I am trying to save information'+ user);
        $scope.user = user;

      ProfileInfo.save({'data':user},function(data) {
        console.log('query is called' + data.name);
        $scope.user = data;
        
      });
    };


    $scope.onFileSelect = function(image) {
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
                url: '/profile',
                method: 'POST',
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


  }
]);
