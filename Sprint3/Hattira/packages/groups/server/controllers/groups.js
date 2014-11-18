'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Group = mongoose.model('Group'),
  GroupEvents = mongoose.model('GroupEvents'),
  _ = require('lodash');


/**
 * Find group by id
 */
exports.group = function(req, res, next, id) {
  Group.load(id, function(err, group) {
    if (err) return next(err);
    if (!group) return next(new Error('Failed to load group ' + id));
    req.group = group;
    next();
  });
};

/**
 * Create a group
 */
exports.create = function(req, res) {
  var group = new Group(req.body);
  group.created_by = req.user;
  group.members = req.user;
  group.save(function(err) {
    if (err) {
      return res.json(500, {
        error: 'Cannot save the group'
      });
    }
    res.json(group);

  });
  //group.update({$push:{'members':req.user._id}});
};

/**
 * Update a group
 */
exports.update = function(req, res) {
  var group = req.group;

  group = _.extend(group, req.body);

  group.save(function(err) {
    if (err) {
      return res.json(500, {
        error: 'Cannot update the group'
      });
    }
    res.json(group);

  });
};

/**
 * Delete a group
 */
exports.destroy = function(req, res) {
  var group = req.group;

  group.remove(function(err) {
    if (err) {
      return res.json(500, {
        error: 'Cannot be deleted'
      });
    }
    res.json(group);

  });
};

/**
 * Show a group
 */
exports.show = function(req, res) {

  var groupinfo = {};

  groupinfo.group = req.group;

  GroupEvents.find({ '_id': { $in: groupinfo.group.groupevents } }, function (err, eventsinfo) {
    console.log(eventsinfo);
        groupinfo.groupeventslist = eventsinfo;
        console.log(groupinfo);
        res.json(groupinfo);
        });
};

/**
 * List of Groups
 */
exports.all = function(req, res) {
  Group.find().sort('-created').populate('user', 'name username').exec(function(err, groups) {
    if (err) {
      return res.json(500, {
        error: 'Cannot list the groups'
      });
    }
    res.json(groups);

  });
};
