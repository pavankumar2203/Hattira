'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;


/**
 * Keyword Schema
 */
var KeywordSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  keyword_name: {
    type: String,
    required: true,
    trim: true
  },
});

/**
 * Validations
 */
KeywordSchema.path('keyword_name').validate(function(keyword_name) {
  return !!keyword_name;
}, 'Keyword name cannot be blank');

/**
 * Statics
 */
KeywordSchema.statics.load = function(id, cb) {
  this.findOne({
    _id: id
  }).populate('created_by', 'name username').exec(cb);
};

mongoose.model('Keyword', KeywordSchema);
