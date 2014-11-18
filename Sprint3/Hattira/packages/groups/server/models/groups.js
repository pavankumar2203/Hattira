'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;


/**
 * Group Schema
 */
var GroupSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  members: [{
    type: Schema.ObjectId,
    ref: 'User'
  }],
  tags: [{
    type: Schema.ObjectId,
    ref: 'Keyword'
  }],
  created_by: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  groupevents: [
  {
    type: Schema.ObjectId,
    ref: 'GroupEvents'
  }]
});

/**
 * Validations
 */
GroupSchema.path('name').validate(function(title) {
  return !!title;
}, 'Name cannot be blank');

GroupSchema.path('description').validate(function(content) {
  return !!content;
}, 'Description cannot be blank');

/**
 * Statics
 */
GroupSchema.statics.load = function(id, cb) {
  this.findOne({
    _id: id
  }).populate('created_by', 'name username').exec(cb);
};

mongoose.model('Group', GroupSchema);
