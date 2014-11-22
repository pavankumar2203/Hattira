'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Group = mongoose.model('Group');
/**
 * Globals
 */
var user;
var group;

/**
 * Test Suites
 */
describe('<Unit Test>', function() {
  describe('Model Group:', function() {
    beforeEach(function(done) {
      user = new User({
        name: 'Full name',
        email: 'test@test.com',
        username: 'user',
        password: 'password'
      });

      user.save(function() {
        group = new Group({
          name: 'Group Name',
          description: 'Group Description',
          created_by: user
        });

        done();
      });
    });

    describe('Method Save', function() {
      it('should be able to save without problems', function(done) {
        return group.save(function(err) {
          should.not.exist(err);
          group.name.should.equal('Group Name');
          group.description.should.equal('Group Description');
          group.created_by.should.not.have.length(0);
          group.created.should.not.have.length(0);
          done();
        });
      });

      it('should be able to show an error when try to save without name', function(done) {
        group.name = '';

        return group.save(function(err) {
          should.exist(err);
          done();
        });
      });

      it('should be able to show an error when try to save without description', function(done) {
        group.description = '';

        return group.save(function(err) {
          should.exist(err);
          done();
        });
      });

      it('should be able to show an error when try to save without user', function(done) {
        group.created_by = {};

        return group.save(function(err) {
          should.exist(err);
          done();
        });
      });

    });

    afterEach(function(done) {
      group.remove();
      user.remove();
      done();
    });
  });
});
