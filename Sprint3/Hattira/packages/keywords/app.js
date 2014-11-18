'use strict';

/*
 * Defining the Package
 */
var Module = require('meanio').Module;

var Keywords = new Module('keywords');

Keywords.register(function(app, auth, database) {

  //We enable routing. By default the Package Object is passed to the routes
  Keywords.routes(app, auth, database);

  Keywords.aggregateAsset('css', 'keywords.css');

  return Keywords;
});
