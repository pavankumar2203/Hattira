'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Keyword = mongoose.model('Keyword'),
  _ = require('lodash');


/**
 * Find keyword by id
 */
exports.keyword = function(req, res, next, id) {
  Keyword.load(id, function(err, keyword) {
    if (err) return next(err);
    if (!keyword) return next(new Error('Failed to load keyword ' + id));
    req.keyword = keyword;
    next();
  });
};

/**
 * Create an keyword
 */
exports.create = function(req, res) {
  var keyword = new Keyword(req.body);
  keyword.user = req.user;

  keyword.save(function(err) {
    if (err) {
      return res.json(500, {
        error: 'Cannot save the keyword'
      });
    }
    res.json(keyword);

  });
};

/**
 * Update an keyword
 */
exports.update = function(req, res) {
  var keyword = req.keyword;

  keyword = _.extend(keyword, req.body);

  keyword.save(function(err) {
    if (err) {
      return res.json(500, {
        error: 'Cannot update the keyword'
      });
    }
    res.json(keyword);

  });
};

/**
 * Delete an keyword
 */
exports.destroy = function(req, res) {
  var keyword = req.keyword;

  keyword.remove(function(err) {
    if (err) {
      return res.json(500, {
        error: 'Cannot delete the keyword'
      });
    }
    res.json(keyword);

  });
};

/**
 * Show an keyword
 */
exports.show = function(req, res) {
  res.json(req.keyword);
};

/**
 * List of Keywords
 */
exports.all = function(req, res) {
  Keyword.find().sort('-created').populate('user', 'name username').exec(function(err, keywords) {
    if (err) {
      return res.json(500, {
        error: 'Cannot list the keywords'
      });
    }
    res.json(keywords);

  });
};
