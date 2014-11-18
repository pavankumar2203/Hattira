'use strict';

/*
 * Defining the Package
 */
var Module = require('meanio').Module;

var Profile = new Module('profile');

/*
 * All MEAN packages require registration
 * Dependency injection is used to define required modules
 */
Profile.register(function(app, auth, database) {

  //We enable routing. By default the Package Object is passed to the routes
  Profile.routes(app, auth, database);

  Profile.aggregateAsset('css', 'profile.css');

  return Profile;
});
