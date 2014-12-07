 'use strict';

// User routes use users controller
var users = require('../controllers/users'),
    config = require('meanio').loadConfig();

module.exports = function(MeanUser, app, auth, database, passport) {

  app.route('/logout')
    .get(users.signout);
  app.route('/users/me')
    .get(users.me);

  // Setting up the users api
  app.route('/register')
    .post(users.create);

  app.route('/forgot-password')
    .post(users.forgotpassword);

  app.route('/reset/:token')
    .post(users.resetpassword);

  app.route('/clickregistration/:token')
    .post(users.clickregistration);


  // Setting up the userId param
  app.param('userId', users.user);

  // AngularJS route to check for authentication
  app.route('/loggedin')
    .get(function(req, res) {
      res.send(req.isAuthenticated() ? req.user : '0');
    });

  // Setting the local strategy route
  app.route('/login')
    .post(passport.authenticate('local', {
      failureFlash: true
    }), function(req, res,next) {

console.log('new user' + req.user.enableLogin);

if(req.user.enableLogin)
{
  console.log('enabling login');

        res.send({
        user: req.user,
        redirect: (req.user.roles.indexOf('admin') !== -1) ? req.get('referer') : false
      });

}
else
{
  console.log('not enabling login');

    //throw an error since email is not checked yet
    next(new Error('authentication failed'));

}
  

    });

  // AngularJS route to get config of social buttons
  app.route('/get-config')
    .get(function (req, res) {
      res.send(config);
    });

  // Setting the facebook oauth routes
  app.route('/auth/facebook')
    .get(passport.authenticate('facebook', {
      scope: ['email', 'user_about_me'],
      failureRedirect: '#!/login'
    }), users.signin);

  app.route('/auth/facebook/callback')
    .get(passport.authenticate('facebook', {
      failureRedirect: '#!/login'
    }), users.authCallback);

  // Setting the github oauth routes
  app.route('/auth/github')
    .get(passport.authenticate('github', {
      failureRedirect: '#!/login'
    }), users.signin);

  app.route('/auth/github/callback')
    .get(passport.authenticate('github', {
      failureRedirect: '#!/login'
    }), users.authCallback);

};
