'use strict';
// To avoid displaying unneccesary social logins
var clientIdProperty = 'clientID',
  defaultPrefix = 'DEFAULT_';

angular.module('mean.users')
  .controller('AuthCtrl', ['$scope', '$rootScope', '$http', '$location', 'Global', 'GetKeywords',
    function($scope, $rootScope, $http, $location, Global, GetKeywords) {
      // This object will contain list of available social buttons to authorize
      $scope.socialButtons = {};
      $scope.socialButtonsCounter = 0;

      $scope.global = Global;

      $scope.keywords = [];
      $scope.multi = {};
      $scope.multi.selectedKeywords = [];
      GetKeywords.getall(function(data){ $scope.keywords = data;});

      $http.get('/get-config')
        .success(function(config) {
          for (var conf in config) {
            // Do not show auth providers that have the value DEFAULT as their clientID
            if (config[conf].hasOwnProperty(clientIdProperty) && config[conf][clientIdProperty].indexOf(defaultPrefix) === -1) {
              $scope.socialButtons[conf] = true;
              $scope.socialButtonsCounter += 1;
            }
          }
        });
    }
  ])
  .controller('LoginCtrl', ['$scope', '$rootScope', '$http', '$location', 'Global',
    function($scope, $rootScope, $http, $location, Global) {
      // This object will be filled by the form
      $scope.user = {};
      $scope.global = Global;
      $scope.global.registerForm = false;
      $scope.input = {
        placeholder: 'Password',
        confirmPlaceholder: 'Repeat Password',
        iconClass: '',
        tooltipText: 'Show password'
      };

      // Register the login() function
      $scope.login = function() {

        console.log($scope.global);

        $http.post('/login', {
          email: $scope.user.email,
          password: $scope.user.password
        })
          .success(function(response) {
            // authentication OK
            $scope.loginError = 0;
            $rootScope.user = response.user;
            $rootScope.$emit('loggedin');
            if (response.redirect) {
              if (window.location.href === response.redirect) {
                //This is so an admin user will get full admin page
                window.location.reload();
              } else {
                window.location = response.redirect;
              }
            } else {
              $location.url('/');
            }
          })
          .error(function() {

            console.log('after login' + JSON.stringify($scope.global));
        
            $scope.loginerror = 'Authentication failed.';
          });
      };
    }
  ])
  .controller('RegisterCtrl', ['$scope', '$rootScope', '$http', '$location', 'Global',
    function($scope, $rootScope, $http, $location, Global) {
      $scope.user = {};
      $scope.global = Global;
      $scope.global.registerForm = true;
      $scope.input = {
        type: 'password',
        placeholder: 'Password',
        placeholderConfirmPass: 'Repeat Password',
        iconClassConfirmPass: '',
        tooltipText: 'Show password',
        tooltipTextConfirmPass: 'Show password'
      };

      $scope.register = function() {
        $scope.usernameError = null;
        $scope.registerError = null;
        var results = [];
        if(this.multi.selectedKeywords.length > 0)
        {
         for(var i = 0;i<this.multi.selectedKeywords.length;i+=1){
           results.push(this.multi.selectedKeywords[i]._id);
         }
        }
        $http.post('/register', {
          email: $scope.user.email,
          password: $scope.user.password,
          confirmPassword: $scope.user.confirmPassword,
          username: $scope.user.username,
          name: $scope.user.name,
          Bio: $scope.user.Bio,
          Interests: results
        })
          .success(function(response) {
            $scope.response = response;
          })
          .error(function(error) {
            // Error: authentication failed
            if (error === 'Username already taken') {
              $scope.usernameError = error;
            } else if (error === 'Email already taken') {
              $scope.emailError = error;
            } else $scope.registerError = error;
          });
      };
    }
  ])
  .controller('ForgotPasswordCtrl', ['$scope', '$rootScope', '$http', '$location', 'Global',
    function($scope, $rootScope, $http, $location, Global) {
      $scope.user = {};
      $scope.global = Global;
      $scope.global.registerForm = false;
      $scope.forgotpassword = function() {
        $http.post('/forgot-password', {
          text: $scope.user.email
        })
          .success(function(response) {
            $scope.response = response;
          })
          .error(function(error) {
            $scope.response = error;
          });
      };
    }
  ])
.controller('ClickRegistrationCtrl', ['$scope', '$rootScope', '$http', '$location', '$stateParams', 'Global',
    function($scope, $rootScope, $http, $location,$stateParams, Global) {
      $scope.user = {};
      $scope.global = Global;
      $scope.global.registerForm = false;
      $scope.clickedregistration = function() {
                $http.post('/clickregistration/' + $stateParams.tokenId, { })
          .success(function(response) {
            $rootScope.user = response.user;
            $rootScope.$emit('loggedin');
            if (response.redirect) {
              if (window.location.href === response.redirect) {
                //This is so an admin user will get full admin page
                window.location.reload();
              } else {
                window.location = response.redirect;
              }
            } else {
              $location.url('/');
            }
          })
          .error(function(error) {
            if (error.msg === 'Token invalid or expired')
              $scope.resetpassworderror = 'Could not update password as token is invalid or may have expired';
            else
              $scope.validationError = error;
          });


      };
    }
  ])


  .controller('ResetPasswordCtrl', ['$scope', '$rootScope', '$http', '$location', '$stateParams', 'Global',
    function($scope, $rootScope, $http, $location, $stateParams, Global) {
      $scope.user = {};
      $scope.global = Global;
      $scope.global.registerForm = false;
      $scope.resetpassword = function() {
        $http.post('/reset/' + $stateParams.tokenId, {
          password: $scope.user.password,
          confirmPassword: $scope.user.confirmPassword
        })
          .success(function(response) {
            $rootScope.user = response.user;
            $rootScope.$emit('loggedin');
            if (response.redirect) {
              if (window.location.href === response.redirect) {
                //This is so an admin user will get full admin page
                window.location.reload();
              } else {
                window.location = response.redirect;
              }
            } else {
              $location.url('/');
            }
          })
          .error(function(error) {
            if (error.msg === 'Token invalid or expired')
              $scope.resetpassworderror = 'Could not update password as token is invalid or may have expired';
            else
              $scope.validationError = error;
          });
      };
    }
  ]);
