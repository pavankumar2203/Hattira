'use strict';

/*
 * Defining the Package
 */
var Module = require('meanio').Module;

var Groups = new Module('groups');

/*
 * All MEAN packages require registration
 * Dependency injection is used to define required modules
 */
Groups.register(function(app, auth, database) {

  //We enable routing. By default the Package Object is passed to the routes
  Groups.routes(app, auth, database);
  Groups.menus.add({
    'roles': ['authenticated'],
    'title': 'Groups',
    'link': 'all groups'
  });
  Groups.menus.add({
    'roles': ['authenticated'],
    'title': 'Create New Group',
    'link': 'create group'
  });

  //We are adding a link to the main menu for all authenticated users
 
  //Groups.aggregateAsset('js','/packages/system/public/services/menus.js', {group:'footer', absolute:true, weight:-9999});
  //Groups.aggregateAsset('js', 'test.js', {group: 'footer', weight: -1});

  Groups.aggregateAsset('css', 'groups.css');

  return Groups;
});
