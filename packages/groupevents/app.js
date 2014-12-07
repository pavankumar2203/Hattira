'use strict';

var Module = require('meanio').Module;

var GroupEvents = new Module('groupevents');

GroupEvents.register(function(app, auth, database) {

  GroupEvents.routes(app, auth, database);
  GroupEvents.aggregateAsset('css', 'groupevents.css');

  return GroupEvents;
});
