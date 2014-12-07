'use strict';

var groups = require('../controllers/groups');

// Group authorization helpers
var hasAuthorization = function(req, res, next) {
  if (!req.user.isAdmin && req.group.created_by.id !== req.user.id) {
    return res.send(401, 'User is not authorized');
  }
  next();
};

module.exports = function(Groups, app, auth) {

  app.route('/groups')
    .get(groups.all)
    .post(auth.requiresLogin, groups.create);
      
  app.route('/groups/:groupId')
    .get(groups.show)
    .put(auth.requiresLogin, hasAuthorization, groups.update)
    .post(auth.requiresLogin, hasAuthorization, groups.update)
    .delete(auth.requiresLogin, hasAuthorization, groups.destroy);

  app.route('/groupdetails/:groupId')
    .get(groups.showinfo)
    .post(auth.requiresLogin, hasAuthorization, groups.update)
    .delete(auth.requiresLogin, hasAuthorization, groups.destroy);
  

  app.param('groupId', groups.group);
    app.route('/groupimage/:groupID')
    .post(groups.postImage);
};
