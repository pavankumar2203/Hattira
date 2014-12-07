'use strict';

var keywords = require('../controllers/keywords');

// Keyword authorization helpers
var hasAuthorization = function(req, res, next) {
  if (!req.user.isAdmin && req.keyword.user.id !== req.user.id) {
    return res.send(401, 'User is not authorized');
  }
  next();
};

module.exports = function(Keywords, app, auth) {

  app.route('/keywords')
    .get(keywords.all)
    .post(auth.requiresLogin, keywords.create);
  app.route('/keywords/:keywordId')
    .get(keywords.show)
    .put(auth.requiresLogin, hasAuthorization, keywords.update)
    .delete(auth.requiresLogin, hasAuthorization, keywords.destroy);

  // Finish with setting up the keywordId param
  app.param('keywordId', keywords.keyword);
};
