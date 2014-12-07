'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  GroupEvents = mongoose.model('GroupEvent'),
  Group = mongoose.model('Group'),
  _ = require('lodash');

var uuid = require('node-uuid'),
    multiparty = require('multiparty'),
    fs = require('fs');

exports.posteventImage = function(req,res) {

var eventID = req.params.eventID;
console.log(eventID);

    var form = new multiparty.Form();
    form.parse(req, function(err, fields, files,eventId) {
        console.log('file name '+ JSON.stringify(files));
        var file = files.file[0];
        var contentType = file.headers['content-type'];
        var tmpPath = file.path;
        var extIndex = tmpPath.lastIndexOf('.');
        var extension = (extIndex < 0) ? '' : tmpPath.substr(extIndex);
        // uuid is for generating unique filenames. 
        var fileName = uuid.v4() + extension;
        var directory = __dirname.split('/');
        var newdirectory = '';
        for (var i = 0; i <= directory.length - 4; i=i+1) {
          if(i === 0)
            newdirectory = directory[i];
          else
            newdirectory = newdirectory + '/'+ directory[i];
        }
        var destPath = newdirectory + '/system/public/assets/static/images/' + fileName;
        if (contentType !== 'image/png' && contentType !== 'image/jpeg') {
            fs.unlink(tmpPath);
            return res.status(400).send('Unsupported file type.');
        }
        GroupEvents.update({ '_id': eventID },{ 'eventpictureURL': fileName},function(err){
            if(err)
            console.log('Error occured while subscribing' + err);
        });       
      fs.rename(tmpPath, destPath, function(err) {
            if (err) {
                console.log('Image is not saved');
                return res.status(400).send('Image is not saved:');
            }
        });
  });



};


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


exports.show = function(req, res) {
  console.log('trying to show an event here ');

  res.json(req.event);
};

exports.nearbyevents = function(req,res){
  var data = [];
  console.log(req.params);
  var lat = parseFloat(req.params.lat);
  var lng = parseFloat(req.params.lng);
  GroupEvents.find({ point: {$near:[lat, lng], $maxDistance: 3000.0 }}, function(err,response)
    {
      data = response;
      res.send(data);
  });
};

exports.all = function(req, res) {
  res.send();
};


exports.postImage = function(req, res) {
var eventID = req.params.eventID;
    var form = new multiparty.Form();
    form.parse(req, function(err, fields, files,eventId) {
        console.log('file name '+ JSON.stringify(files));
        var file = files.file[0];
        var contentType = file.headers['content-type'];
        var tmpPath = file.path;
        var extIndex = tmpPath.lastIndexOf('.');
        var extension = (extIndex < 0) ? '' : tmpPath.substr(extIndex);
        // uuid is for generating unique filenames. 
        var fileName = uuid.v4() + extension;
        console.log('full dir name '+ __dirname);
        // this will work only on linux machine. change it to \\ if it is windows
        var directory = __dirname.split('/');
        var newdirectory = '';
        for (var i = 0; i <= directory.length - 4; i=i+1) {
          if(i === 0)
            newdirectory = directory[i];
          else
            newdirectory = newdirectory + '/'+ directory[i];
        }
        var destPath = newdirectory + '/system/public/assets/static/images/' + fileName;

        console.log('destPath is '+ destPath);
        
      if (contentType !== 'image/png' && contentType !== 'image/jpeg') {
            fs.unlink(tmpPath);
            return res.status(400).send('Unsupported file type.');
        }
        GroupEvents.update({ '_id': eventID },{ $addToSet: {album: fileName}},function(err){
            if(err)
            console.log('Error occured while subscribing' + err);
        });       
      fs.rename(tmpPath, destPath, function(err) {
            if (err) {
                console.log('Image is not saved');
                return res.status(400).send('Image is not saved:');
            }
        });
  });
};
