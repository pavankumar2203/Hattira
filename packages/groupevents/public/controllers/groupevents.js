'use strict';

angular.module('mean.groupevents',['ngAutocomplete','angular-carousel','angularFileUpload','geolocation']).controller('EventsController', ['$scope', '$upload','$stateParams', '$location', 'Global', 'GroupEvents', '$http','$filter', 'geolocation', 'Rsvp',
  function($scope,$upload, $stateParams, $location, Global, GroupEvents, $http, $filter, geolocation, Rsvp) {
    $scope.global = Global;

    $scope.destination = {};
    $scope.places = {};
    $scope.places.venue = '';
    $scope.places.options = {};
    $scope.places.details = '';
    $scope.keywords = [];
    $scope.today = $filter('date')(Date.now(), 'MM-dd-yyyy');
    $scope.RSVP = function(groupevent) {
      Rsvp.rsvp({'data':groupevent._id},function(data) {
        console.log('RSVPed to event ' + groupevent._id);
        
      });
      $location.path('/');
   };

 $scope.oneventImageSelect = function(image) {

      var eventID = window.location.hash.split('/')[2];
            if (angular.isArray(image)) {
                image = image[0];
            }
            if (image.type !== 'image/png' && image.type !== 'image/jpeg') {
                alert('Only PNG and JPEG are accepted.');
                return;
            }

            $scope.uploadInProgress = true;
            $scope.uploadProgress = 0;

            $scope.upload = $upload.upload({
                url: '/eventimage/' +eventID,
                method: 'POST',
                 data: {eventID:eventID},
                file: image
            }).progress(function(event) {
                $scope.uploadProgress = Math.floor(event.loaded / event.total);
                $scope.$apply();
            }).success(function(data, status, headers, config) {
                $scope.uploadInProgress = false;    
                 $scope.uploadedImage = data;      
            }).error(function(err) {
                $scope.uploadInProgress = false;
                console.log('Error uploading file: ' + err.message || err);
            });
        };

    var uploadfile = function(file,eventId)
    {
        $scope.upload = $upload.upload({
          url: '/album/'+eventId,
          method: 'POST',
          data: {eventId:eventId},
          file: file,
        }).progress(function(evt) {
          console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
        }).success(function(data, status, headers, config) {
          // file is uploaded successfully
        });
    };


    $scope.onFileSelect = function($files) {
       var eventId = window.location.hash.split('/')[2];
       for (var i = 0; i < $files.length; i=i+1) {
        var file = $files[i];
        uploadfile(file,eventId);
     }
    };

    $scope.hasAuthorization = function(event) {
      if (!event || !event.user) return false;
      return $scope.global.isAdmin || event.user._id === $scope.global.user._id;
    };

    $scope.create = function(isValid) {
      var groupId = window.location.hash.split('/')[2];
      console.log('isValid' + isValid + ':' + groupId);
      if (isValid) {
        console.log('From google maps');
        console.log(this.places);
        var data = [];
        var lat = this.places.details.geometry.location.k;
        var lng = this.places.details.geometry.location.B;
        data.push(lat);
        data.push(lng);
        console.log(this.event_from.toString().split(' ')[4]);
        var events = new GroupEvents({
          name: this.name,
          description: this.description,
          event_time: this.event_time,
          event_from: this.event_from.toString().split(' ')[4],
          event_to: this.event_to.toString().split(' ')[4],
          group: groupId,
          point: data,
          venue:this.places.venue,
        });
        events.$save(function(response) {
          console.log(response._id);
          $location.path('groupevents/' + response._id);
        });

        this.name = '';
        this.description = '';
      } else {
        $scope.submitted = true;
      }
    };

    $scope.remove = function(event) {
      if (event) {
        event.$remove(function(response) {
          for (var i in $scope.events) {
            if ($scope.events[i] === event) {
              $scope.events.splice(i, 1);
            }
          }
          $location.path('groupevents');
        });
      } else {
        $scope.event.$remove(function(response) {
          $location.path('groupevents');
        });
      }
    };

    $scope.update = function(isValid) {
      if (isValid) {
        var event = $scope.event;
        if (!event.updated) {
          event.updated = [];
        }
        event.updated.push(new Date().getTime());

        event.$update(function() {
          $location.path('groupevents/' + event._id);
        });
      } else {
        $scope.submitted = true;
      }
    };

    $scope.find = function() {
      GroupEvents.query(function(events) {
        $scope.events = events;
      });
    };


    $scope.findOne = function() {

      getAlbum();

      geolocation.getLocation().then(function(data){
       var mylat = data.coords.latitude;
       var mylng = data.coords.longitude;
        //get uber estimates here
        GroupEvents.get({
          eventId: $stateParams.eventId
        }, function(event) {
          $scope.event = event;
          console.log(event.venue);
          $http.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + event.venue + '&key=AIzaSyD43XPuXyMA6cl9cC9sSKNjFNFFaAjK1hY').success(function(data) {
          if(data.status === 'OK'){
                $scope.destination.lat = data.results[0].geometry.location.lat;
                $scope.destination.lng = data.results[0].geometry.location.lng;
                $http.get('https://api.uber.com/v1/estimates/price?server_token=qJ2isRcnRAfIiOHOLW3U9R4Nh2S74mNuxH8sE3iB&start_latitude='+mylat+'&start_longitude='+mylng+'&end_latitude='+$scope.destination.lat+'&end_longitude='+$scope.destination.lng).success(function(data) {
                $scope.priceestimate = data.prices[0].estimate;
            }).error(function(err){
              console.log(err);
            });

              $http.get('https://api.uber.com/v1/estimates/time?server_token=qJ2isRcnRAfIiOHOLW3U9R4Nh2S74mNuxH8sE3iB&start_latitude='+mylat+'&start_longitude='+mylng+'&end_latitude='+$scope.destination.lat+'&end_longitude='+$scope.destination.lng).success(function(data) {
              $scope.timeestimate = data.times[0].estimate;
            }).error(function(err){
              console.log(err);
            });

          }
          });
});
});
};


$scope.carousels = [];
for (var i=0; i<1;i=i+1) {
  $scope.carousels.push({
      id:i
  });
}
$scope.colors = ['#fc0003', '#f70008', '#f2000d', '#ed0012', '#e80017', '#e3001c', '#de0021', '#d90026', '#d4002b', '#cf0030', '#c90036', '#c4003b', '#bf0040', '#ba0045', '#b5004a', '#b0004f', '#ab0054', '#a60059', '#a1005e', '#9c0063', '#960069', '#91006e', '#8c0073', '#870078', '#82007d', '#7d0082', '#780087', '#73008c', '#6e0091', '#690096', '#63009c', '#5e00a1', '#5900a6', '#5400ab', '#4f00b0', '#4a00b5', '#4500ba', '#4000bf', '#3b00c4', '#3600c9', '#3000cf', '#2b00d4', '#2600d9', '#2100de', '#1c00e3', '#1700e8', '#1200ed', '#0d00f2', '#0800f7', '#0300fc'];
function addSlide(target, style) {
  var i = target.length;
  target.push({
      id: (i + 1),
      label: 'slide #' + (i + 1),
      img: 'images/'+ $scope.event.album[i],
      height: '250px',
      width: '400px',
      color: $scope.colors[ (i*10) % $scope.colors.length],
      odd: (i % 2 === 0)
  });
}
$scope.carouselIndex = 3;

function addSlides(target, style, qty) {
  for (var i=0; i < qty; i=i+1) {
      addSlide(target, style);
  }
}
// 1st ngRepeat demo
$scope.slides = [];

var getAlbum = function()
{
   GroupEvents.get({
    eventId: $stateParams.eventId
  }, function(event) {

    $scope.event = event;

    console.log(event.album.length);

     addSlides($scope.slides, 'sports', event.album.length);

  });
};
   


  }
]);
