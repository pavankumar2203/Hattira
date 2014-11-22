'use strict';

var mean = require('meanio');
var mongoose = require('mongoose'),
  Profile = mongoose.model('Profile'),
  GroupEvents = mongoose.model('GroupEvent'),
  Group = mongoose.model('Group');


exports.render = function(req, res) {

  var modules = [];
  // Preparing angular modules list with dependencies
  for (var name in mean.modules) {
    modules.push({
      name: name,
      module: 'mean.' + name,
      angularDependencies: mean.modules[name].angularDependencies
    });
  }

  function isAdmin() {
    return req.user && req.user.roles.indexOf('admin') !== -1;
  }

  // Send some basic starting info to the view
  res.render('index', {
    user: req.user ? {
      name: req.user.name,
      _id: req.user._id,
      username: req.user.username,
      roles: req.user.roles
    } : {},
    modules: modules,
    isAdmin: isAdmin,
    adminEnabled: isAdmin() && mean.moduleEnabled('mean-admin')
  });
};


exports.getnumbers = function(req, res) {

 Profile.find({ 'user': req.user }, function (err, profile) {
   
   if(profile && profile[0])
   {
   
   var obj = {};
   obj.subscribedgroups = profile[0].membergroups.length;
   obj.events = profile[0].rsvpevents.length;
   obj.groupsaround = 0;

  console.log('"'+req.user.Interests+'"');

  var Interests = [];
  Interests.push(req.user.Interests);

   Group.find({ 'created_by': req.user }, function (err, groups) {
    obj.groups = groups;
   });
   //get the interests of the user and search group tags.
console.log(profile[0].rsvpevents);
    GroupEvents.find({ '_id': { $in: profile[0].rsvpevents } }, function (err, events) {
      if(err)
         console.log(err);
   
    obj.eventsList = events;
      res.json(obj);
   });


   }
   else
   {
    res.send();
   }
   
});
};
