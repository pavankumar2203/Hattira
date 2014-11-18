'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  GroupEvents = mongoose.model('GroupEvents'),
  Group = mongoose.model('Group'),
  _ = require('lodash');


/**
 * Find event by id
 */
exports.event = function(req, res, next, id) {
  GroupEvents.load(id, function(err, event) {
    if (err) return next(err);
    if (!event) return next(new Error('Failed to load event ' + id));
    req.event = event;
    next();
  });
};

/**
 * Create a event
 */
exports.create = function(req, res) {
  var events = new GroupEvents(req.body);
  events.created_by = req.user;  
  Group.find({_id : events.group},function(err,group){
    events.group = group[0]._id;
    //save it to the group schema as well.
    Group.update({ '_id': group[0]._id },{ $addToSet: {groupevents: events._id}},function(err){
                        if(err)
                        console.log('Error occured while subscribing' + err);
                    });

    events.save(function(err) {
    if (err) {
      console.log(err);
      return res.status(500).json( {
        error: 'Cannot save the event'
      });
    }
    res.json(events);
  });
  });

  //also notify your group members.

};

/**
 * Update a event
 */
exports.update = function(req, res) {
  var event = req.event;

  event = _.extend(event, req.body);

  event.save(function(err) {
    if (err) {
      return res.json(500, {
        error: 'Cannot update the event'
      });
    }
    res.json(event);

  });
};

/**
  Add members to the event
*/
exports.addmembers = function(req,res){
  var event = req.event;

  event.members = _.extend(event,req.body);
  event.save(function(err) {
    if (err) {
      return res.json(500, {
        error: 'Cannot update the event'
      });
    }
    res.json(event);

  });
}; 


/**
 * Delete a event
 */
exports.destroy = function(req, res) {
  var event = req.event;

  event.remove(function(err) {
    if (err) {
      return res.json(500, {
        error: 'Cannot be deleted'
      });
    }
    res.json(event);

  });
};

/**
 * Show a event
 */
exports.show = function(req, res) {
  res.json(req.event);
};

/**
 * List of Events
 */
exports.all = function(req, res) {
  GroupEvents.find().sort('-created').populate('user', 'name username').exec(function(err, events) {
    if (err) {
      return res.json(500, {
        error: 'Cannot list the events'
      });
    }
    res.json(events);

  });
};
