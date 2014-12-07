'use strict';

var mongoose = require('mongoose'),
    Profile = mongoose.model('Profile'),
    User = mongoose.model('User'),
    Group = mongoose.model('Group');

var uuid = require('node-uuid'),
    multiparty = require('multiparty'),
    nodemailer = require('nodemailer'),
    config = require('meanio').loadConfig(), 
    fs = require('fs'),
    util = require('util'),
    mime = require('mime');

function base64Image(src) {
    var data = fs.readFileSync(src).toString('base64');
    return util.format('data:%s;base64,%s', mime.lookup(src), data);
}

exports.show = function(req, res) {
 Profile.find({ 'user': req.user }, function (err, profile) {
   if(profile[0] && profile[0].picture)
   {
    profile[0].picture = base64Image(profile[0].picture); 
       res.json(profile);
   }
});
};

exports.create = function(req, res) {
    var profile = new Profile(req.body);
    profile.user = req.user;
    profile.save(function(err) {
    if (err) {
      return res.json(500, {
        error: 'Cannot save the profile'
      });
    }
    res.json(profile);
  });
};

exports.getinformation = function(req,res) {
    res.json(req.user);
};

exports.getmygroups = function(req,res) {
    Group.find({ 'created_by': req.user }, function (err, groups) {
   res.json(groups);
});
};


exports.getmySubscribedgroups = function(req,res) {
    Profile.find({ 'user': req.user }, function (err, user) {
    if(user && user[0])
    {
        Group.find({ '_id': { $in: user[0].membergroups } }, function (err, groupsinfo) {
        res.json(groupsinfo);

        });
    }
    else
    {
        res.send();
    }   

    });
};


function sendMail(mailOptions) {
  var transport = nodemailer.createTransport(config.mailer);
  transport.sendMail(mailOptions, function(err, response) {
    if (err) return err;
    return response;
  });
}

exports.rsvpme = function(req,res) {

var eventid = req.body.data;
 
        Profile.find({ 'user': req.user }, function (err, profile) {

            var emailID = req.user.email;

            var mailOptions = 
                        {
                        to: emailID,
                        from: config.emailFrom
                        };

        mailOptions.html = [
      'Hello ' + req.user.name + ',<br>',
      'We have received a request to RSVP to an event.',
      'If you made this request, please click on the link below or paste this into your browser to check out the event details:',
      'http://' + req.headers.host + '/#!/groupevents/' + eventid,
      'If you did not RSVP, please ignore this email.<br> Best, <br> Team Hattira'
    ].join('\n\n');
    mailOptions.subject = 'Hattira - RSVP successful';
        sendMail(mailOptions);
        Profile.update({ 'user': req.user },{ $addToSet: {rsvpevents: eventid}},function(err){
        if(err)
            console.log('Error occured while subscribing' + err);
         });
                
    });
    res.send(eventid);
};

exports.setinformation = function(req,res) {
    var jso = JSON.parse(req.body.data);
    User.findOne({
      _id: req.user
    })
    .exec(function(err, user) {
      User.update({ '_id': req.user },{ 'name': jso.name,'username' : jso.username,'email' : jso.email, 'Bio' : jso.Bio, 'Interests' : jso.Interests },function(err){
        if(err)
            console.log('Error occured while updating' + err);
        });
    });
    res.send(jso);
};


exports.setmemberprofile = function(req,res) {
    var groupid = req.body.data;
        Profile.find({ 'user': req.user }, function (err, profile) {
            Profile.update({ 'user': req.user },{ $addToSet: {membergroups: groupid}},function(err){
                if(err)
                    console.log('Error occured while subscribing' + err);
                });               
        });
    res.send(groupid);
};


exports.postImage = function(req, res) {
    var form = new multiparty.Form();
    form.parse(req, function(err, fields, files) {
        console.log('file name '+ files);
        var file = files.file[0];
        var contentType = file.headers['content-type'];
        var tmpPath = file.path;
        var extIndex = tmpPath.lastIndexOf('.');
        var extension = (extIndex < 0) ? '' : tmpPath.substr(extIndex);
        var fileName = uuid.v4() + extension;

        console.log('full dir name '+ __dirname);
        // this will work only on linux machine. change it to \\ if it is windows
        var directory = __dirname.split('/');
        var newdirectory = '';
        for (var i = 0; i <= directory.length - 4; i=i+1) {
          if(i === 0)
            newdirectory = directory[i];
          else
            newdirectory = newdirectory + '/'+ directory[i];
        }
        var destPath = newdirectory + '/system/public/assets/static/images/' + fileName;

        console.log('destPath is '+ destPath);

        if (contentType !== 'image/png' && contentType !== 'image/jpeg') {
            fs.unlink(tmpPath);
            return res.status(400).send('Unsupported file type.');
        }

        Profile.find({ 'user': req.user }, function (err, profile) {
            
        if(!profile[0])
        {
            var newprofile = new Profile(req.body);
            newprofile.user = req.user;
            newprofile.picture = destPath;

            newprofile.save(function(err) {
            if (err) {
                return res.json(500, {
                error: 'Cannot save the profile'
                });
              }
            });

        }
         else
        {
            Profile.update({ 'user': req.user },{ 'picture': destPath },function(err){
            if(err)
                console.log('Error occured while updating' + err);
            });
        }
    });

        fs.rename(tmpPath, destPath, function(err) {
            if (err) {
                console.log('Image is not saved');
                return res.status(400).send('Image is not saved:');
            }
            var dataUri = base64Image(destPath);
            return res.send(dataUri);
        });
    });
};
