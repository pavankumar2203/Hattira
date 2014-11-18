'use strict';

var profile = require('../controllers/profile');

module.exports = function(Profile, app, auth) {

console.log('inside routes ');

  app.route('/profile')
    .get(profile.show)
    .post(profile.postImage);
    
    app.route('/profileinfo')
    .get(profile.getinformation)
    .post(profile.setinformation);


    app.route('/groupsinfo')
    .get(profile.getmygroups);

    app.route('/memberprofile')
    .post(profile.setmemberprofile);

    app.route('/rsvp')
    .post(profile.rsvpme);

    app.route('/membergroupsinfo')
    .get(profile.getmySubscribedgroups);
};
