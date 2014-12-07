'use strict';

/*
 * Defining the Package
 */
var Module = require('meanio').Module;

var GroupEvents = new Module('groupevents');

/*
 * All MEAN packages require registration
 * Dependency injection is used to define required modules
 */
GroupEvents.register(function(app, auth, database) {

  //We enable routing. By default the Package Object is passed to the routes
  GroupEvents.routes(app, auth, database);

  //We are adding a link to the main menu for all authenticated users
 
  GroupEvents.aggregateAsset('css', 'groupevents.css');

  return GroupEvents;
});
