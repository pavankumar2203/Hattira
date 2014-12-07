'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Group = mongoose.model('Group'),
  GroupEvent = mongoose.model('GroupEvent');

/**
 * Globals
 */
var user;
var group;
var groupevent;

/**
 * Test Suites
 */
describe('<Unit Test>', function() {
  describe('Model GroupEvent:', function() {
    beforeEach(function(done) {
      user = new User({
        name: 'Sheldon Cooper',
        email: 'sheldon@bbt.com',
        username: 'shelly',
        password: 'amy'
      });

        group = new Group({
          name: 'BB Theory',
          description: 'This is a description',
          created_by: user
        });

	user.save(function(){
	  group.save(function(){
	    groupevent = new GroupEvent({
	  	name: 'BBT event name',
	  	description: 'Come join us!',
	  	group: group,
	  	venue: 'Raashid Auditorium, Carnegie Mellon University',
	  	created_by: user
		});

        done();
      	});
       });
      });
      

    describe('Method Save', function() {
      it('should be able to save without problems', function(done) {
        return groupevent.save(function(err) {
          should.not.exist(err);
          groupevent.name.should.equal('BBT event name');
          groupevent.description.should.equal('Come join us!');
	  groupevent.venue.should.equal('Raashid Auditorium, Carnegie Mellon University');
          groupevent.created_by.should.not.have.length(0);
          groupevent.created.should.not.have.length(0);
          done();
        });
      });

      it('should be able to show an error when try to save without name', function(done) {
        groupevent.name = '';

        return groupevent.save(function(err) {
          should.exist(err);
          done();
        });
      });

      it('should be able to show an error when try to save without description', function(done) {
        groupevent.description = '';

        return groupevent.save(function(err) {
          should.exist(err);
          done();
        });
      });

      it('should be able to show an error when try to save without user', function(done) {
        groupevent.created_by = {};

        return groupevent.save(function(err) {
          should.exist(err);
          done();
        });
      });

    });

    afterEach(function(done) {
      groupevent.remove();
      user.remove();
      done();
    });
  });
});
