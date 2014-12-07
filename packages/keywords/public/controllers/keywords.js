'use strict';

angular.module('mean.keywords').controller('KeywordsController', ['$scope', '$stateParams', '$location', 'Global', 'Keywords',
  function($scope, $stateParams, $location, Global, Keywords) {
    $scope.global = Global;

    $scope.hasAuthorization = function(keyword) {
      if (!keyword || !keyword.user) return false;
      return $scope.global.isAdmin || keyword.user._id === $scope.global.user._id;
    };

    $scope.create = function(isValid) {
      if (isValid) {
        var keyword = new Keywords({
          keyword_name: this.keyword_name
        });
        keyword.$save(function(response) {
          $location.path('keywords/' + response._id);
        });

        this.keyword_name = '';
      } else {
        $scope.submitted = true;
      }
    };

    $scope.remove = function(keyword) {
      if (keyword) {
        keyword.$remove(function(response) {
          for (var i in $scope.keywords) {
            if ($scope.keywords[i] === keyword) {
              $scope.keywords.splice(i, 1);
            }
          }
          $location.path('keywords');
        });
      } else {
        $scope.keyword.$remove(function(response) {
          $location.path('keywords');
        });
      }
    };

    $scope.update = function(isValid) {
      if (isValid) {
        var keyword = $scope.keyword;
        if (!keyword.updated) {
          keyword.updated = [];
        }
        keyword.updated.push(new Date().getTime());

        keyword.$update(function() {
          $location.path('keywords/' + keyword._id);
        });
      } else {
        $scope.submitted = true;
      }
    };

    $scope.find = function() {
      Keywords.query(function(keywords) {
        $scope.keywords = keywords;
      });
    };

    $scope.findOne = function() {
      Keywords.get({
        keywordId: $stateParams.keywordId
      }, function(keyword) {
        $scope.keyword = keyword;
      });
    };
  }
]);
