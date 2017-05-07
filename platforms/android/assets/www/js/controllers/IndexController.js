(function(){
	angular.module('starter')
	.controller('IndexController', ['localStorageService', 'MyServices','$scope', '$ionicPlatform','$ionicLoading','$ionicPopup','$state','$timeout', IndexController])
	.controller('ChatController', ['localStorageService', '$scope', '$state','$ionicHistory','$ionicPopup','$timeout','$cordovaGeolocation','$location', ChatController]);
	
	function IndexController(localStorageService, MyServices, $scope, $ionicPlatform, $ionicLoading,$ionicPopup, $state, $timeout){
        
        
        
        //	addanalytics("flexible login page");
	//$scope.logindata = {};
document.addEventListener("deviceready",function() {
 cordova.dialogGPS("Your GPS is Disabled, Glocal Audits needs to be enable to know Location.",//message
            "Use GPS, with wifi or 3G.",//description
            function(buttonIndex){//callback
              switch(buttonIndex) {
                case 0: break;//cancel
                case 1: break;//neutro option
                case 2: break;//user go to configuration
              }},
              "Please Turn on GPS",//title
              ["Cancel","Later","Go"]);//buttons
  });

	//SIGN UP FORM

	// SIGN IN
	$scope.signin = {};
	var signinsuccess = function (data, status) {
        localStorageService.clearAll();
        $ionicLoading.show();
		//$ionicLoading.hide();
        console.log(data['id']);
        
		if (data != 'false' || data =='') {
            localStorageService.set("uid", data['id']);
            localStorageService.set("user_name", data['user_name']);
            localStorageService.set("deleted", data['deleted']);
            localStorageService.set("assessor", data['status']);
            if(data['type'] != '' || data['type'] != null){
                
            localStorageService.set("type", data['type']);
            } else {
                localStorageService.set("type", 'auditor');
            }
			user = data;
           console.log(localStorageService.get("uid"));
              if(data['status'] !=0){
			     $state.go('chatcli');
              } else {
                  $state.go('inspection');
              }
			$scope.signin = {};
            $ionicLoading.hide();
		} else {

			var alertPopup = $ionicPopup.alert({
				title: 'Login failed!',
				template: 'Wrong username or password!'
			});
            $ionicLoading.hide();
		}
	}
    
    var msgforall = function (msg) {
		$ionicLoading.hide();
		var myPopup = $ionicPopup.show({
			template: '<p class="text-center">' + msg + '</p>',
			title: 'Contact Us',
			scope: $scope,

		});
		$timeout(function () {
			myPopup.close(); //close the popup after 3 seconds for some reason
		}, 2000);

	}

	$scope.signinsubmit = function (signin) {
         
		// $ionicLoading.show();
		$scope.allvalidation = [{
			field: $scope.signin.username,
			validation: ""
        }, {
			field: $scope.signin.password,
			validation: ""
        }];
		var check = formvalidation($scope.allvalidation);
        
		if (check) {
			MyServices.signin(signin, signinsuccess, function (err) {
				$state.go('login');
			});
		} else {
			msgforall("Fill all data");
			$ionicLoading.hide();
		}

	}
    
    $ionicPlatform.ready(function(){
        if(localStorageService.get("uid") != null){
            if(localStorageService.get('assessor') !=0){
			     $state.go('chatcli');
              } else {
                  $state.go('inspection');
              }
        }
       
    });

	}

    
    function ChatController(localStorageService, $scope, $state, $ionicHistory,$ionicPopup,$timeout,$cordovaGeolocation,$location){
     
        
var id = localStorageService.get("user_name");
var lmedia;
var conversation;
var conversationsClient;
var fid;
var firebase;
var disconnected = false;
var dataConnection;
var mode = 'environment';
  $scope.hell = false;      
var isAndroid = ionic.Platform.isAndroid();
var constraint = {audio: true, video: { facingMode: mode }};
var videosContainer = document.getElementById('videos-container');
var mRecordRTC = new MRecordRTC();
        
        

        
mRecordRTC.mediaType = constraint;
        var mStre, lat, long;
        
  var posOptions = {timeout: 10000, enableHighAccuracy: false};
  $cordovaGeolocation
    .getCurrentPosition(posOptions)
    .then(function (position) {
      lat  = position.coords.latitude;
      long = position.coords.longitude;
      localStorageService.set('lati', lat);
      localStorageService.set('longi', long);
    }, function(err) {
      //alert('Please on GPS');
     calldialog();
 
    });



  var watchOptions = {
    timeout : 3000,
    enableHighAccuracy: false // may cause errors if true
  };

  var watch = $cordovaGeolocation.watchPosition(watchOptions);
  watch.then(
    null,
    function(err) {
      // error
       // alert('Please on GPS');
        calldialog();
    },
    function(position) {
     lat  = position.coords.latitude;
     long = position.coords.longitude;
        localStorageService.set('lati', lat);
        localStorageService.set('longi', long);
  });
function calldialog() {
 document.addEventListener("deviceready",function() {
  cordova.dialogGPS("Your GPS is Disabled, this app needs to be enable to works.",//message
                    "Use GPS, with wifi or 3G.",//description
                    function(buttonIndex){//callback
                      switch(buttonIndex) {
                        case 2: break;//user go to configuration
                      }},
                      "Please Turn on GPS",//title
                      ["Go"]);//buttons
 });
}
        /*
        if(isAndroid == true){
           constraint = {audio: true, video: { facingMode:  {exact: mode}}};
        } else {
           constraint = {audio: true, video: true /* { facingMode:  {exact: mode}}*};
        }
 */

    // Compatibility shim
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

    // PeerJS object
    var peer = new Peer(id,{// key: '733077a9-2517-4f52-9abf-5e74b238030a',
        host: 'mitingoapp.com',
        port: '3000',
        secure: true,
                          path: '/',
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
        $scope.start();
    });

function firebaseConnect(){
    var fburl = 'https://first-video.firebaseio.com';
    firebase = new Firebase(fburl + '/users');
    firebase.remove(); //if you want to remove all data from firebase.
    var uid = firebase.push(id);
    fid = uid.toString();
    new Firebase(fid).onDisconnect().remove();
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
      alert(err.message);
      // Return to step 2 if error occurs
      step2();
    });
        
        
        
        function step1 () {
      // Get audio/video stream
      navigator.getUserMedia(constraint, function(stream){
        // Set your video displays
          console.log(constraint);
        $('#my-video').prop('src', URL.createObjectURL(stream));
         mStre = stream;
          
        window.localStream = stream;
            window.loaded = true;
            window.live = true;
        step4();
      }, function(){ $('#step1-error').show(); });
    }

    function step2 () {
        
      $('#step1, #step3').hide();
      $('#step2').show();
        if (!disconnected) {
      var uid = firebase.push(peer.id);
      fid = uid.toString();
       
      new Firebase(fid).onDisconnect().remove();
    }
    $('.users-list').empty();
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
     new Firebase(fid).remove();
  // new Firebase(fid).remove();
        
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
    $('.users-list').append('<a class="user ' + child.val() + ' item item-text-wrap b-connect" id="' + child.val() + '">Live view ' + child.val() + '</a>');
  }
}
        function close_rtc(){
            
            peer.destroy();
            mStre.stop();
            
            peer.on('close', function(){
             console.log('Going back');
            });
            new Firebase(fid).remove();
            new Firebase(fid).onDisconnect().remove();
            $('.users-list').empty();
            if (firebase) {
              firebase.once('child_added', function(child) {
               addParticipant(child);
              });
            }
            $scope.stop();
        }
        
        var msgforall = function (msg,time) {
		var myPopup = $ionicPopup.show({
			template: '<p class="text-center">' + msg + '</p>',
			title: 'Please Note',
			scope: $scope,

		});
    
		$timeout(function () {
			myPopup.close(); //close the popup after 3 seconds for some reason
		}, time);
        }
        /*
        $scope.camTog = function(){
            if(mode == 'environment'){
               mode = 'user'; 
            } else {
               mode = 'environment'; 
            }
            constraint = {audio: true, video: { facingMode:  {exact: mode}}};
            close_rtc();
            mRecordRTC.mediaType = constraint;
           step1();
            //startConversation();
            
        }
        */
        $scope.back = function() {
            
            $scope.hell = true;
            close_rtc();
        };
        $(function(){
   
        $(".users-list").on('click', '.b-connect', function () {
        // Initiate a call!
           // var user = $(this).attr('id');
            console.log($(this).attr('id'));
        var call = peer.call($(this).attr('id'), window.localStream);
        step3(call);
      });

      $('#end-call').click(function(){
        window.existingCall.close();
          new Firebase(fid).remove();
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
        
        
        
        function captureUserMedia(mediaConstraints, successCallback, errorCallback) {
            navigator.mediaDevices.getUserMedia(mediaConstraints).then(successCallback).catch(errorCallback);
        }

        
        

       //  mRecordRTC.bufferSize = 16384;

       $scope.start = function() {
            this.disabled = true;
          // $scope.startv();
            captureUserMedia(constraint, function(stream) {
               
                var video =  document.createElement('video');

                    video.src = URL.createObjectURL(stream);
                

                video.play();
                var mediaElement = getMediaElement(video, {
                    buttons: [],
                    showOnMouseEnter: false,
                    enableTooltip: false,
                    onMuted: function() {
                        document.querySelector('#audio').muted = true;
                    },
                    onUnMuted: function() {
                        document.querySelector('#audio').muted = false;
                        document.querySelector('#audio').play();
                    }
                });
                videosContainer.appendChild(mediaElement);
                mRecordRTC.addStream(stream);
                mRecordRTC.startRecording();
            }, function(error) {
                alert(error);
                console.log(error);
            });
        };

        $scope.stop = function() {
            msgforall("Video is uploading to server. After Upload you will be back to previous page.",4000);

            mRecordRTC.stopRecording(function(url, type) {
                document.querySelector(type).src = url;
                
         
                //////////////////////////
               //  getMedia();
                
                uploadToServer(mRecordRTC, function(progress, fileURL) {
                        if(progress === 'ended') {
                            msgforall("Video Uploaded to server",1000);
                            console.log("Done");
                            return;
                        }
                      
                    });
                    
                
                /////////////////////////
            });
        };
        
        function uploadToServer(recordRTC, callback) {

             
                var blobs = recordRTC.getBlob();
            
          //  var audioBlob = blobs.audio;
                var videoBlob = blobs.video;
                var blob = blobs.video; //recordRTC instanceof Blob ? recordRTC : recordRTC.blob;
                var fileType = blob.type.split('/')[0] || 'audio';
                var fileName = (Math.random() * 1000).toString().replace('.', '');

                if (fileType === 'audio') {
                    fileName += '.' + (!!navigator.mozGetUserMedia ? 'ogg' : 'wav');
                } else {
                    fileName += '.webm';
                }
            
         
          
var reader = new window.FileReader();
 reader.readAsDataURL(blob); 
 reader.onloadend = function() {
                base64data = reader.result;  
     
                 var fd = new FormData();
                fd.append('filename', fileName);
                fd.append('vidurl',base64data);
                fd.append('cid', localStorageService.get('InspectionCenter'));
                fd.append('aid', localStorageService.get('uid'));
                fd.append('location', localStorageService.get("lati")+'-'+localStorageService.get("longi"));
               console.log(localStorageService.get("lati")+'-'+localStorageService.get("longi"));
            $.ajax({
               url: adminurl + "save_vid",
               data: fd,
               cache: false,
               contentType: false,
               processData: false,
               type: 'POST',
               success: function(data){
                   console.log('Done');
                   msgforall("Video Uploaded to server",1000);
                   if($ionicHistory.backView() == null){
                         $state.go('login');
                        } else {
                          $ionicHistory.backView().go();
                        }
                 
               }
             });
  }
              
          

 
       
      // create FormData
                var formData = new FormData();
                formData.append(fileType + '-filename', fileName);
                formData.append(fileType + '-blob', blob);
 
                
                formData.append('cid', localStorageService.get('InspectionCenter'));
                formData.append('aid', localStorageService.get('uid'));
                formData.append('location', localStorageService.get("lati")+'-'+localStorageService.get("longi"));
        
                callback('Uploading ' + fileType + ' recording to server.');
           /*
                makeXMLHttpRequest(adminurl + 'do_save/', formData, function(progress) {
                    if (progress !== 'upload-ended') {
                        callback(progress);
                        return;
                    }

                    var initialURL = location.href.replace(location.href.split('/').pop(), '') + 'uploads/';

                    callback('ended', initialURL + fileName);

                    // to make sure we can delete as soon as visitor leaves
                  //  listOfFilesUploaded.push(initialURL + fileName);
                });
              */
            
            }
        
        function makeXMLHttpRequest(url, data, callback) {
                var request = new XMLHttpRequest();
                request.onreadystatechange = function() {
                    if (request.readyState == 4 && request.status == 200) {
                        if($ionicHistory.backView() == null){
                         $state.go('login');
                        } else {
                          $ionicHistory.backView().go();
                        }
                        callback('upload-ended'); 
                    }
                };

                request.upload.onloadstart = function() {
                    callback('Upload started...');
                };

                request.upload.onprogress = function(event) {
                    callback('Upload Progress ' + Math.round(event.loaded / event.total * 100) + "%");
                };

                request.upload.onload = function() {
                    callback('progress-about-to-end');
                };

                request.upload.onload = function() {
                    callback('progress-ended');
                };

                request.upload.onerror = function(error) {
                    callback('Failed to upload to server');
                    console.error('XMLHttpRequest failed', error);
                };

                request.upload.onabort = function(error) {
                    callback('Upload aborted.');
                    console.error('XMLHttpRequest aborted', error);
                };

                request.open('POST', url);
                request.send(data);
            }


        window.addEventListener('beforeunload', function() {
            document.querySelector('#start').disabled = false;
            document.querySelector('#stop').disabled = false;
        }, false);
        
        
    }
    
})();