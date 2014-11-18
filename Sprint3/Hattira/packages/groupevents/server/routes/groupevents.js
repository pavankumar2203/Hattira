'use strict';

var groupevents = require('../controllers/groupevents');

// Event authorization helpers
var hasAuthorization = function(req, res, next) {
  if (!req.user.isAdmin && req.event.created_by.id !== req.user.id) {
    return res.send(401, 'User is not authorized');
  }
  next();
};

module.exports = function(Events, app, auth) {

  app.route('/groupevents')
    .get(groupevents.all)
    .post(auth.requiresLogin, groupevents.create);
  app.route('/groupevents/:eventId')
    .get(groupevents.show)
    .put(auth.requiresLogin, hasAuthorization, groupevents.update)
    .delete(auth.requiresLogin, hasAuthorization, groupevents.destroy);

  // Finish with setting up the eventId param
  app.param('eventId', groupevents.event);
};
