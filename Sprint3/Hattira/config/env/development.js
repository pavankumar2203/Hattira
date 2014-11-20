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
  twitter: {
    clientID: '2Z2P5MzmcAbDWFTFyr6VTq1GK',
    clientSecret: 'CONSUMER_SECRET',
    callbackURL: 'http://localhost:3000/auth/twitter/callback'
  },
  github: {
    clientID: 'DEFAULT_APP_ID',
    clientSecret: 'APP_SECRET',
    callbackURL: 'http://localhost:3000/auth/github/callback'
  },
  google: {
    clientID: 'DEFAULT_APP_ID',
    clientSecret: 'APP_SECRET',
    callbackURL: 'http://localhost:3000/auth/google/callback'
  },
  linkedin: {
    clientID: 'DEFAULT_API_KEY',
    clientSecret: 'SECRET_KEY',
    callbackURL: 'http://localhost:3000/auth/linkedin/callback'
  },
  emailFrom: 'edondemand7@gmail.com', // sender address like ABC <abc@example.com>
  mailer: {
    service: 'Gmail', // Gmail, SMTP
    auth: {
      user: 'edondemand7@gmail.com',
      pass: 'password will go here'
    }
  }
};
