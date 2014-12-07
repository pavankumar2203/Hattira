'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Group = mongoose.model('Group'),
  GroupEvents = mongoose.model('GroupEvent'),
  _ = require('lodash');


var uuid = require('node-uuid'),
    multiparty = require('multiparty'),
    fs = require('fs');

exports.postImage = function(req,res) {

var groupID = req.params.groupID;
    var form = new multiparty.Form();
    form.parse(req, function(err, fields, files,groupId) {
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
        Group.update({ '_id': groupID },{ 'grouppictureURL': fileName},function(err){
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
};

/**
 * Update a group
 */
exports.update = function(req, res) {
  var group = req.group;
  console.log('this is in update');
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
        res.json(groupinfo);
        });
};


exports.showinfo = function(req, res) {
  res.json(req.group);
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
