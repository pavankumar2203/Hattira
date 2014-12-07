'use strict';

var mean = require('meanio'),
    mongoose = require('mongoose'),
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

console.log('getn numbers ' + req.user);

 Profile.find({ 'user': req.user }, function (err, profile) { 

  console.log(profile + '=====' + profile[0]);
  
   if(profile && profile[0])
   {
   
     var obj = {};
     obj.subscribedgroups = profile[0].membergroups.length;
     
     obj.groupsaround = 0;
  
     var Interests = [];
     
     for (var i = 0; i < req.user.Interests.length; i=i+1) {
       Interests.push(mongoose.Types.ObjectId(req.user.Interests[i]));
     }

     console.log('interesets '+ Interests);

     Group.find({ 'tags': { $in: Interests } }, function (err, groups) {
      obj.groups = groups;
     });
     

     var now = new Date();

     GroupEvents.find({ $and: [ { '_id': { $in: profile[0].rsvpevents } }, { 'event_time': { $gt: now } } ] } ,  function (err, events) {
      if(err){}
      obj.eventsList = events;
      obj.events = events.length;
        res.json(obj);
      });
   }
   else
   {
    res.send();
   }
   
});
};
