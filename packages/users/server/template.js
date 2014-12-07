'use strict';

module.exports = {
  forgot_password_email: function(user, req, token, mailOptions) {
    mailOptions.html = [
      'Hello ' + user.name + ',<br>',
      'We have received a request to reset the password for your account.',
      'If you made this request, please click on the link below or paste this into your browser to complete the process:<br>',
      'http://' + req.headers.host + '/#!/reset/' + token,
      'This link will work for 1 hour or until your password is reset.<br>',
      'If you did not ask to change your password, please ignore this email and your account will remain unchanged.',
      '<br> Best, <br> Team Hattira'
    ].join('\n\n');
    mailOptions.subject = 'Hattira -  Reset Password';
    return mailOptions;
  },

    registration_email: function(user, req, token, mailOptions) {
    mailOptions.html = [
      'Hello ' + user.name + ',<br>',
      'Welcome to Hattira! You have just joined the best site in the universe to create groups and organize meet ups.',
      'We are glad you are  here!<br>',
      'We just need you to confirm that you are friendly human and not an evil robot.',
      'Please click here<br>',
      'http://' + req.headers.host + '/#!/clickregistration/' + token,
      '<br>Thanks again for joining. See you on the site!<br> Best,<br> Team Hattira'
    ].join('\n\n');
    mailOptions.subject = 'Confirm Hattira!';
    return mailOptions;
  }


};
