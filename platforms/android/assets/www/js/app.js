// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'ngCordova','LocalStorageModule'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
      
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
    setTimeout(function() {
        navigator.splashscreen.hide();
    }, 300);
  });
  $ionicPlatform.registerBackButtonAction(function (event) {
    if($state.current.name=="login"){
      navigator.app.exitApp();
    }
    else {
      navigator.app.backHistory();
    }
  }, 100);
})

.config(function ($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('login', {
      url: '/login',
      templateUrl: 'templates/index.html'
    })
    .state('inspection', {
      cache:false,
      url: '/inspection',
      templateUrl: 'templates/inspection.html',
    })
  .state('quiz', {
      cache:false,
      url: '/quiz',
      templateUrl: 'templates/quiz.html',
    })
  .state('chat', {
      url: '/chat',
      templateUrl: 'templates/chat.html'
    })
  .state('chatcli', {
    url: "/chatcli",
    templateUrl: "templates/chatcli.html",
   // controller: 'MenuCtrl'
  })
  .state('app', {
    url: "/app",
    templateUrl: "templates/menu.html",
    controller: 'MenuCtrl'
  })
  .state('app.browse', {
      url: '/browse',
      views: {
        'menuContent': {
          templateUrl: 'templates/browse.html'
        }
      }
    })
    .state('app.ongoing', {
      url: '/ongoing',
      views: {
        'menuContent': {
          templateUrl: 'templates/ongoing.html',
          controller: 'OngoingCtrl'
        }
      }
    })
   .state('app.on', {
    url: '/ongoing/:insId',
    views: {
      'menuContent': {
        templateUrl: 'templates/on.html',
        controller: 'OnCtrl'
      }
    }
    })
    .state('app.complited', {
      url: '/complited',
      views: {
        'menuContent': {
          templateUrl: 'templates/complited.html',
          controller: 'ComplitedCtrl'
        }
      }
    })
    .state('app.complete', {
    url: '/complited/:insId',
    views: {
      'menuContent': {
        templateUrl: 'templates/complete.html',
        controller: 'CompleteCtrl'
      }
    }
  });

    $urlRouterProvider.otherwise('/login');
    //$urlRouterProvider.otherwise('/record');
})
.controller('MenuCtrl', ['MyServices','localStorageService', '$scope', '$state','$ionicHistory','$window','$timeout',function(MyServices, localStorageService, $scope, $state, $ionicHistory, $window, $timeout) {

 
         
var id = localStorageService.get('user_name');
var lmedia;
var conversation;
var conversationsClient;
var fid;
var firebase;
var disconnected = false;
var dataConnection;
var mode = 'environment';
var constraint = {audio: true, video: true};
var videosContainer = document.getElementById('videos-container');
    
    


    // Compatibility shim
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

    // PeerJS object
    var peer = new Peer(id,{ //key: 'hgwu6w0v1kksatt9',
                             host: 'mitingoapp.com',
        port: '3000',
        secure: true,
                          path: '/',
                           //key: '67f9e568-6389-45a2-99a7-718ea2ab5662',
                         config: {'iceServers': [
		                       {url:'stun:stun01.sipphone.com'},
                               {url:'stun:stun.ekiga.net'},
                               {url:'stun:stun.fwdnet.net'},
                               {url:'stun:stun.ideasip.com'},
                               {url:'stun:stun.iptel.org'},
                               {url:'stun:stun.rixtelecom.se'},
                               {url:'stun:stun.schlund.de'},
                               {url:'stun:stun.l.google.com:19302'},
                               {url:'stun:stun1.l.google.com:19302'},
                               {url:'stun:stun2.l.google.com:19302'},
                               {url:'stun:stun3.l.google.com:19302'},
                               {url:'stun:stun4.l.google.com:19302'},
                               {url:'stun:stunserver.org'},
                               {url:'stun:stun.softjoys.com'},
                               {url:'stun:stun.voiparound.com'},
                               {url:'stun:stun.voipbuster.com'},
                               {url:'stun:stun.voipstunt.com'},
                               {url:'stun:stun.voxgratia.org'},
                               {url:'stun:stun.xten.com'},
                               {
                                   url: 'turn:192.158.29.39:3478?transport=udp',
                                   credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
                                   username: '28224511:1379330808'
                               },
                               {
                                   url: 'turn:192.158.29.39:3478?transport=tcp',
                                   credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
                                   username: '28224511:1379330808'
                               },
		                       { url: 'turn:numb.viagenie.ca', credential: 'muazkh', username: 'webrtc@live.com' }
        		         ]}
                        });
    
    
    peer.on('open', function(){
        
        $('#my-id').text(peer.id);
        firebaseConnect();
    });

function firebaseConnect(){
    var fburl = 'https://first-video.firebaseio.com';
    firebase = new Firebase(fburl + '/users');
   // firebase.remove();
   // var uid = firebase.push(id);
    //var uid = firebase.push();
   // uid.set({ 'id': id, 'text': localStorageService.get('type') });
   // fid = uid.toString();
   // new Firebase(fid).onDisconnect().remove();
    
    firebase.on('child_added', function(child) {
       
      addParticipant(child);
        
    });
    firebase.on('child_removed', function(child) {
      $('.' + child.val()).remove();
    });
  }
    // Receiving a call
    peer.on('call', function(call){
      // Answer the call automatically (instead of prompting user) for demo purposes
      call.answer(window.localStream);
      step3(call);
    });
    peer.on('error', function(err){
      // alert(err.message);
        console.log(err.message);
      // Return to step 2 if error occurs
      step2();
    });
        
        
        
        function step1 () {
      // Get audio/video stream
            
      navigator.getUserMedia(constraint, function(stream){
        // Set your video displays
          console.log(constraint);
        $('#my-video').prop('src', URL.createObjectURL(stream));

        window.localStream = stream;
        step4();
      }, function(){ $('#step1-error').show(); });
    }

    function step2 () {
        
      $('#step1, #step3').hide();
      $('#step2').show();
        if (!disconnected) {
     // var uid = firebase.push(peer.id);
     // fid = uid.toString();
       
    //  new Firebase(fid).onDisconnect().remove();
    }
    $('.user-list').empty();
    if (firebase) {
      firebase.once('child_added', function(child) {
        addParticipant(child);
      });
    }
    }
        
        function step4 () {
        
      $('#step1, #step3').hide();
      $('#step2').show();
    }

    function step3 (call) {
      // Hang up on an existing call if present
      if (window.existingCall) {
        window.existingCall.close();
      }
     
      // Wait for stream on the call, then set peer video display
      call.on('stream', function(stream){
        $('#their-video').prop('src', URL.createObjectURL(stream));
      });

      // UI stuff
      window.existingCall = call;
      $('#their-id').text(call.peer);
      call.on('close', step2);
      $('#step1, #step2').hide();
      $('#step3').show();
    }
      
function addParticipant(child) {
 if (child.val() != id) {
    $('.user-list').append('<a class="user ' + child.val() + ' item item-text-wrap b-connect" id="' + child.val() + '">Live view ' + child.val() + '</a>');
  }
}
        $scope.back = function() {
            
            peer.destroy();
            peer.on('close', function(){
             console.log('Going back');
            });
           // new Firebase(fid).remove();
           // new Firebase(fid).onDisconnect().remove();
            $('.user-list').empty();
            if (firebase) {
              firebase.once('child_added', function(child) {
               addParticipant(child);
              });
            }
            localStorageService.clearAll();
            $ionicHistory.clearCache();
            $ionicHistory.clearHistory();
            $state.go('login');
            
        };
        $(function(){
        $(".user-list").on('click', '.b-connect', function () {
        // Initiate a call!
           // var user = $(this).attr('id');
        var call = peer.call($(this).attr('id'), window.localStream);
        step3(call);
      });

      $('#end-call').click(function(){
        window.existingCall.close();
          $('#their-video').prop('src', 'none');
         // new Firebase(fid).remove();
         step2();
      });

      // Retry if getUserMedia fails
      $('#step1-retry').click(function(){
        $('#step1-error').hide();
        step1();
      });

      // Get things started
      step1();
    });

}])
.directive('uiShowPassword', [
  function () {
  return {
    restrict: 'A',
    scope: true,
    link: function (scope, elem, attrs) {
      var btnShowPass = angular.element('<button class="button button-clear button-password"><i class="ion-eye"></i></button>'),
        elemType = elem.attr('type');
      btnShowPass.on('mousedown', function (evt) {
        (elem.attr('type') === elemType) ?
          elem.attr('type', 'text') : elem.attr('type', elemType);
        btnShowPass.toggleClass('button-positive');
        //prevent input field focus
        evt.stopPropagation();
      });

      btnShowPass.on('touchend', function (evt) {
        var syntheticClick = new Event('mousedown');
        evt.currentTarget.dispatchEvent(syntheticClick);

        //stop to block ionic default event
        evt.stopPropagation();
      });

      if (elem.attr('type') === 'password') {
        elem.after(btnShowPass);
      }
    }
  };
}]);


var formvalidation = function (allvalidation) {
	var isvalid2 = true;
	for (var i = 0; i < allvalidation.length; i++) {
		if (allvalidation[i].field == "" || !allvalidation[i].field) {
			allvalidation[i].validation = "ng-dirty";
			isvalid2 = false;
		} else {
			allvalidation[i].validation = "";
		}
	}
	return isvalid2;
}
