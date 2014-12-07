'use strict';

module.exports = {
  db: 'mongodb://localhost/mean-dev1',
	debug: 'true',
  mongoose: {
    debug: false
  },
  app: {
    name: 'Hattira'
  },
  facebook: {
    clientID: 'DEFAULT_APP_ID',
    clientSecret: 'APP_SECRET',
    callbackURL: 'http://localhost:3000/auth/facebook/callback'
  },
  github: {
    clientID: 'DEFAULT_APP_ID',
    clientSecret: 'APP_SECRET',
    callbackURL: 'http://localhost:3000/auth/github/callback'
  },
  emailFrom: 'Hattira',
  mailer: {
    service: 'Gmail', // Gmail, SMTP
    auth: {
      user: 'edondemand7@gmail.com',
      pass: 'password goes here'
    }
  }
};
