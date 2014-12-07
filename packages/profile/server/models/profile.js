'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;


/**
 * Profile Schema
 */
var ProfileSchema = new Schema({
  picture:{
    type: String,
    required: false,
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  membergroups:[{
    type: Schema.ObjectId,
    ref: 'Group'
  }],
  rsvpevents:[{
    type: Schema.ObjectId,
    ref: 'GroupEvents'
  }]
});



/**
 * Statics
 */
ProfileSchema.statics.load = function(id, cb) {
  this.findOne({
    _id: id
  }).populate('user', 'name username').exec(cb);
};

mongoose.model('Profile', ProfileSchema);
