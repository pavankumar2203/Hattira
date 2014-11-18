'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;


/**
 * Event Schema
 */
var EventSchema = new Schema({
  event_time: {
    type: Date
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
  tags: [{
    type: Schema.ObjectId,
    ref: 'Keyword'
  }],
  group: {
    type: Schema.ObjectId,
    ref: 'group',
    required:true
  },
  venue: {
    type: String,
    required: true,
    trim: true
  },
  attendees: [{
    type: Schema.ObjectId,
    ref: 'User'
  }],
  speakers: [{
    type:Schema.ObjectId,
    ref:'User'
  }],
  sponsors: {
    type:String,
    trim: true
  },
  created: {
    type: Date,
    default: Date.now,
    required: true
  },
  created_by: {
    type: Schema.ObjectId,
    ref: 'User',
    required:true
  }
});

/**
 * Validations
 */
EventSchema.path('name').validate(function(title) {
  return !!title;
}, 'Name cannot be blank');

EventSchema.path('description').validate(function(content) {
  return !!content;
}, 'Description cannot be blank');


EventSchema.path('event_time').validate(function(event_time) {
  return !!event_time;
}, 'Event date and time cannot be empty');

EventSchema.path('venue').validate(function(venue) {
  return !!venue;
}, 'Venue cannot be blank');
/**
 * Statics
 */
EventSchema.statics.load = function(id, cb) {
  this.findOne({
    _id: id
  }).populate('created_by', 'name username').exec(cb);
};

mongoose.model('GroupEvents', EventSchema);
