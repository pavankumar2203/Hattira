'use strict';

/*
 * Defining the Package
 */
var Module = require('meanio').Module;

var MeanUser = new Module('users');

MeanUser.register(function(app, auth, passport, database) {

  //We enable routing. By default the Package Object is passed to the routes
  MeanUser.routes(app, auth, database, passport);

  MeanUser.aggregateAsset('js', 'meanUser.js');

  return MeanUser;
});
