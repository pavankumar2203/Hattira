'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Profile = mongoose.model('Profile'),
    User = mongoose.model('User'),
    Group = mongoose.model('Group');

var uuid = require('node-uuid'),
    multiparty = require('multiparty'),
    fs = require('fs');
var util = require('util');
var mime = require('mime');

function base64Image(src) {
    var data = fs.readFileSync(src).toString('base64');
    return util.format('data:%s;base64,%s', mime.lookup(src), data);
}

/**
 * Find article by id
 */
exports.show = function(req, res) {
 Profile.find({ 'user': req.user }, function (err, profile) {
   
   //console.log(profile + '====>' + profile[0]);

   if(profile[0])
   {
     //   console.log('I got ' + profile[0].picture);
    //now get the buffered data and modify the JSON
    profile[0].picture = base64Image(profile[0].picture); 
       res.json(profile);
   }
   

});
};

/**
 * Create an article
 */
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
   // console.log('get information called here' + req.user);
    res.json(req.user);
};

exports.getmygroups = function(req,res) {
    //console.log('get groups information');
    Group.find({ 'created_by': req.user }, function (err, groups) {
    //console.log('I got ' + groups);
    //now get the buffered data and modify the JSON
   //profile[0].picture = base64Image(profile[0].picture);
   res.json(groups);
});
};


exports.getmySubscribedgroups = function(req,res) {
    //console.log('get my subscribed groups information');
    Profile.find({ 'user': req.user }, function (err, user) {

    //now get group info for each group
    if(user && user[0])
    {
      //  console.log('checking '+ user[0].membergroups);

        Group.find({ '_id': { $in: user[0].membergroups } }, function (err, groupsinfo) {

        //console.log('I got ' + groupsinfo);
        res.json(groupsinfo);

        });

    }
    else
    {
        res.send();
    }   
    


    });
};


exports.rsvpme = function(req,res) {

var eventid = req.body.data;
    //var data = JSON.parse(JSON.stringify(req.body.data));
    //console.log('set member profile called here' + eventid);
            //save the user info to schema
        Profile.find({ 'user': req.user }, function (err, profile) {
                    //console.log('subscribing  the  profile');
                    Profile.update({ 'user': req.user },{ $addToSet: {rsvpevents: eventid}},function(err){
                        if(err)
                        console.log('Error occured while subscribing' + err);
                    });
                
        });

    res.send(eventid);


};


exports.setinformation = function(req,res) {
    //var data = JSON.parse(JSON.stringify(req.body.data));
    //var keyvalues = data.split('{').split('}').split(',');
    var jso = JSON.parse(req.body.data);
    //var data = JSON.parse(JSON.stringify(req.body.data));
    //console.log('set information called here' + jso.name);
    User.findOne({
      _id: req.user
    })
    .exec(function(err, user) {
      //console.log('found user ' + user);
      User.update({ '_id': req.user },{ 'name': jso.name,'username' : jso.username,'email' : jso.email, 'Bio' : jso.Bio, 'Interests' : jso.Interests },function(err){
                        if(err)
                        console.log('Error occured while updating' + err);
                    });
    });
    res.send(jso);
};


exports.setmemberprofile = function(req,res) {
    //console.log(req.body);

    var groupid = req.body.data;
    //var data = JSON.parse(JSON.stringify(req.body.data));
    //console.log('set member profile called here' + groupid);
            //save the user info to schema
        Profile.find({ 'user': req.user }, function (err, profile) {
                    //console.log('subscribing  the  profile');
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
        // uuid is for generating unique filenames. 
        var fileName = uuid.v4() + extension;
        var destPath = __dirname +'/images/' + fileName;
        
        //destPath = 'C:/Users/Pavan/Documents/GitHub/Team105/Sprint1/Hattira/packages/profile/server/controllers/images/'+ fileName;
        //console.log('destination is '+ destPath + ' <=== '+tmpPath);
        // Server side file type checker.
        if (contentType !== 'image/png' && contentType !== 'image/jpeg') {
            fs.unlink(tmpPath);
            return res.status(400).send('Unsupported file type.');
        }
        //save the user info to schema
        Profile.find({ 'user': req.user }, function (err, profile) {
            
                if(!profile[0])
                {

                    console.log('creating new profile');
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
                    console.log('updating the  profile');
                    Profile.update({ 'user': req.user },{ 'picture': destPath },function(err){
                        if(err)
                        console.log('Error occured while updating' + err);
                    });
                }
        });
        //get the image and convert to base 64 and send it
        fs.rename(tmpPath, destPath, function(err) {
            if (err) {
                console.log('Image is not saved');
                return res.status(400).send('Image is not saved:');
            }
          //  console.log('destination path ' + destPath);
            var dataUri = base64Image(destPath);
            return res.send(dataUri);
        });
    });
};
