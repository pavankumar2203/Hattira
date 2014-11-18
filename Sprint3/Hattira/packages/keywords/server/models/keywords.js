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
  title: {
    type: String,
    required: true,
    trim: true
  },
});

/**
 * Validations
 */
KeywordSchema.path('title').validate(function(title) {
  return !!title;
}, 'Title cannot be blank');

mongoose.model('Keyword', KeywordSchema);
