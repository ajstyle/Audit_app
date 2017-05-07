(function(){

angular.module('starter')
	.controller('InspectionCtrl', ['localStorageService', 'MyServices','$scope','$ionicPlatform', '$ionicLoading','$ionicPopup','$state','$timeout','$ionicHistory', InspectionCtrl])
.controller('QuizCtrl', ['localStorageService', 'MyServices','$scope','$cordovaFile','$cordovaFileTransfer','$ionicPlatform','$ionicModal', '$ionicLoading','$ionicPopup','$ionicHistory','$state','$timeout','$http','$cordovaGeolocation','$location', QuizCtrl]);

	
	function InspectionCtrl(localStorageService, MyServices, $scope,$ionicPlatform, $ionicLoading,$ionicPopup, $state, $timeout,$ionicHistory){
        
        
        
        //	addanalytics("flexible login page");
	//$scope.logindata = {};
	//localStorageService.clearAll()



	//SIGN UP FORM

	// SIGN IN
	$scope.inslist = [];
	$scope.checklistList = [];
	$scope.insaddr = [];
         localStorageService.remove('InspectionId');
         localStorageService.remove('insid');
         localStorageService.remove('InspectionCenter'); 
		 localStorageService.remove('InspectionName');
		 localStorageService.remove('InspectionCenter');
         localStorageService.remove('IpaddId');
         localStorageService.remove('lati');
         localStorageService.remove('longi');
        
        $ionicHistory.clearHistory();
        
	var listsuc = function (data, status) {
		//$ionicLoading.hide();
        console.log(data);
		if (data != 'false' || data !='[]') {
			// window.localStorageService.set("user", data);
            localStorageService.set('insid', data['id']);
			// user = data;
 
			//$state.go('menu.search');
            angular.forEach(data, function(value, key) {
             
                $scope.inslist.push(
               {
                id: data[key]['insid'],
                title: value['type'],
                   center: value['centid']
                }
               );
               
            });
            
		} else {
			msgforall("No Inspection for today");
		}
	}
    /*
	var checklistsuc = function (data, status) {
		//$ionicLoading.hide();
        console.log(data);
		if (data != 'false' || data !='[]') {
			// window.localStorageService.set("user", data);
            localStorageService.set('checkid', data['id']);
			// user = data;
 
			//$state.go('menu.search');
            angular.forEach(data, function(value, key) {
             
                $scope.checklistList.push(
               {
                id: data[key]['checkid'],
                title: value['insname'],
                   center: value['centid']
                }
               );
               
            });
            
		} else {
			msgforall("No Checklist for today");
		}
	}
 
    */
    
    var addsuccess = function(data, status){
        console.log(data);
        if (data != 'false' || data !='') {
            
            var successPopup = $ionicPopup.confirm({
				title: data['center_name'],
				template: '<p>Address: ' + data['center_address_one'] + '<br/>City: ' + data['center_address_city'] +',State: ' + data['center_address_state'] +'<hr/>Center Phone: ' + data['center_phone'] +'</p>'
			});
            
            
        } else {
            msgforall("No Address found!");
        }
    }
    
    $scope.getadd = function(cid){
        MyServices.getAddress(cid, addsuccess, function (err) {
				msgforall("No Address found");
			});
    }
    $scope.startQ = function(id,cid,insname){
        
        
		localStorageService.set('InspectionId', id);
		localStorageService.set('InspectionName', insname);
		localStorageService.set('InspectionCenter', cid);
		$state.go('quiz');
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
    $ionicPlatform.ready(function(){
       // $ionicHistory.clearCache();
        //$window.location.reload(true);
       // localStorage.clear();
        if(localStorageService.get("uid") == null){
            $state.go('login');
        }
        MyServices.inspectionlist(listsuc, function (err) {
				msgforall("No Inspection for today");
			});
        /*
        
        MyServices.checklist(checklistsuc, function (err) {
				msgforall("No Checklist for today");
			});
        */
    });
   
    $scope.doRefresh = function(){
        if($scope.inslist == []){
        MyServices.inspectionlist(listsuc, function (err) {
				msgforall("No Inspection for today");
			});
        } else {
            msgforall("Refreshed");
        }
        
    };
        
        $scope.LiveVid = function(){
            $state.go('chat');
        };
        $scope.Logout = function(){
            localStorageService.clearAll();
            $ionicHistory.clearCache();
            $ionicHistory.clearHistory();
            $state.go('login', null, {reload: true, notify:true});
           // $state.go('login');
        };

	}
    
    ////////////////////
    
    function QuizCtrl(localStorageService, MyServices, $scope,$cordovaFile,$cordovaFileTransfer,$ionicPlatform,$ionicModal, $ionicLoading,$ionicPopup, $ionicHistory, $state, $timeout, $http,$cordovaGeolocation,$location){
        
        $ionicHistory.nextViewOptions({
          disableAnimate: true,
          disableBack: true
        });
        var insid = localStorageService.get('InspectionId');
        var lat, long;
        $scope.queses = [];
        $scope.limit = 1;
        $scope.queses_i = []; 
        $scope.index = 1;
        var vidnamesArr = []; 
        $scope.nos = 1;
        $scope.selected = {};
        $scope.videose = {};
        $scope.imagese = {};
       $scope.suggesstion = {};
       $scope.remark = {};
       $scope.modela = {};
       $scope.tag = {};
        $scope.rqua = {};
        $scope.aqua = {};
        
        $scope.qtitle = localStorageService.get('InspectionName');

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
 // watch.clearWatch();
        
        var quizsuccess = function(data, status){
        console.log(data);
        if (data != 'false') {
            angular.forEach(data, function(value, key) {
             $scope.queses.push(
               {
                qid: value['qid'],
                question: value['question'],
                qgroup: value['question_group'],
                aspects: value['aspects'],
                opt_A: value['option_A'],
                opt_A_score: value['option_A_score'],
                opt_B: value['option_B'],
                opt_B_score: value['option_B_score'],
                opt_C: value['option_C'],
                opt_C_score: value['option_C_score'],
                opt_D: value['option_D'],
                opt_D_score: value['option_D_score'],
                 questionCode: value['code'],  
                 rqty: value['r_quantity'],  
                });
             
            });
            
        } else {
            msgforall("No Question found!");
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
        $ionicPlatform.ready(function(){
            if($scope.qtitle == "Checklist" ){
               MyServices.getCheckQuestions(insid, quizsuccess, function (err) {
				msgforall("No Question found");
			  });
            } else if($scope.qtitle == "Inventory" ){
                MyServices.getInvQuestions(insid, quizsuccess, function (err) {
				  msgforall("No Question found");
			    });
            }  else if($scope.qtitle == "Assets" ){
                MyServices.getAssQuestions(insid, quizsuccess, function (err) {
				  msgforall("No Question found");
			    });
            } else {
                MyServices.getQuestions(insid, quizsuccess, function (err) {
				msgforall("No Question found");
			    });
            }
           
        });
        
        $scope.itemNext = function ($index) {
          $scope.index = $index;
         if($scope.limit < $index ){
           $scope.limit = $index;
         }
        
      };
        
        $scope.itemClicked = function ($index) {
           $scope.index = $index;
       };
       
 
$scope.imagesen = function (id) {


   var options = {
      limit: 1
   };

   navigator.device.capture.captureImage (onSuccess, onError, options);

   function onSuccess(mediaFiles) {
      var i, path, len;
		
      for (i = 0, len = mediaFiles.length; i < len; i += 1) {
         path = mediaFiles[i].fullPath;
          
          var fileURL = path;
          
           var lastIndex = fileURL.lastIndexOf("/");

          fileURL = fileURL.substring(0, lastIndex);
          
          console.log(fileURL);
		$cordovaFileTransfer.upload(adminurl + "Imageupload", path, {})
				.then(function (result) {
					var data = JSON.parse(result.response);
                  $scope.imagese[id] = data;
               $scope.imgdis(id) = true;
              $cordovaFile.removeFile(fileURL,mediaFiles[i].name)
               .then(function(result) {
                  
                    alert("success");
                    // Success!
                }, function(err) {
                    alert(JSON.stringify(err));
                    // Error
                   
                   });
					//$ionicLoading.hide();
				}, function (err) {navigator.notification.alert(error.code);  }, function (progress) {});
      }
   }

   function onError(error) {
      navigator.notification.alert('Error code: ' + error.code, null, 'Capture Error');
   }
	
};
        
$scope.videosen = function (id) {
    

   var options = {
      limit: 1,
      duration: 10
   };

   navigator.device.capture.captureVideo(onSuccess, onError, options);

   function onSuccess(mediaFiles) {
      var i, path, len;
		
      for (i = 0, len = mediaFiles.length; i < len; i += 1) {
         path = mediaFiles[i].fullPath;
           
          var fileURL = path;
          var lastIndex = fileURL.lastIndexOf("/");

          fileURL = fileURL.substring(0, lastIndex);
          console.log(fileURL);
          $scope.path= mediaFiles[i].name;
		$cordovaFileTransfer.upload(adminurl + "mediaupload", path, {})
				.then(function (result) {
					var data = JSON.parse(result.response);
               $scope.videose[id] = data;
               $scope.viddis(id) = true;
               $cordovaFile.removeFile(fileURL,mediaFiles[i].name)
               .then(function(result) {
                    alert("success");
                    // Success!
                }, function(err) {
                    alert(JSON.stringify(err));
                    // Error
                    
                   });
					//$ionicLoading.hide();
				}, function (err) {navigator.notification.alert(error.code);}, function (progress) {});
      }
   }

   function onError(error) {
      navigator.notification.alert('Error code: ' + error.code, null, 'Capture Error');
   }
	
};
  var comment;
        
var successResult = function(data, status){
    console.log(data);
    // An alert dialog
    
         $ionicHistory.clearHistory();
         localStorageService.remove('InspectionId');
         localStorageService.remove('insid');
         localStorageService.remove('InspectionCenter'); 
		 localStorageService.remove('InspectionName');
		 localStorageService.remove('InspectionCenter');
         localStorageService.remove('IpaddId');
  
     var alertPopup = $ionicPopup.alert({
       title: 'Result Uploaded',
       template: 'Thanks, for your time!<br/>You can upload documents for this Audit from our desktop site.'
     });
     alertPopup.then(function(res) {
         $ionicHistory.clearCache();
         /*
         $ionicHistory.clearHistory();
         localStorageService.remove('InspectionId');
         localStorageService.remove('insid');
         localStorageService.remove('InspectionCenter'); 
		 localStorageService.remove('InspectionName');
		 localStorageService.remove('InspectionCenter');
         localStorageService.remove('IpaddId');
         */
         // $location.url("/inspection");
        // $state.transitionTo('inspection', {}, {reload: true, notify:true});
        $state.go('inspection', {}, {reload: true});
         
        // localStorageService.clearAll();
         // localStorageService.flush();
        // ionic.Platform.exitApp();
     });
       
}

$scope.showPopup = function() {
   $scope.finalComm = {}

   // An elaborate, custom popup
   var subPopup = $ionicPopup.show({
     template: '<ion-textarea [(ngModel)]="finalComm.msg"></ion-textarea>',
     title: 'Final comment for this audit',
     subTitle: '',
     scope: $scope,
     buttons: [
       {
         text: '<b>Submit Audit</b>',
         type: 'button-positive',
         onTap: function(e) {
           if (!$scope.finalComm.msg) {
             e.preventDefault();
           } else {
             comment = $scope.finalComm.msg;
             $scope.formSubmit();  
           }
         }
       },
     ]
   });
   subPopup.then(function(res) {
     console.log('Tapped!', res);
   });
   $timeout(function() {
      subPopup.close(); //close the popup after 3 seconds for some reason
   }, 3000);
  };
      
  $scope.formSubmit = function() {
      $scope.index = -1;
      var questionArray = [];
      var answerArray= [];
      var vidArray= [];
      var imgArray= [];
      var sugArray= [];
      var repArray= [];
      var qus_Arr =[];
      var model_Arr =[];
      var tag_Arr =[];
      var rqua_Arr =[];
      var aqua_Arr =[];
   
          // var result = res;
           var count = 0;
           var opt_Json = JSON.stringify($scope.selected);
           var vide = JSON.stringify(vidnamesArr);
           var img = JSON.stringify($scope.imagese);
      
           var sugges = JSON.stringify($scope.suggesstion);
           var remar = JSON.stringify($scope.remark);
           var modA = JSON.stringify($scope.modela);
           var tagA = JSON.stringify($scope.tag);
      
           var reqnt = JSON.stringify($scope.rqua);
           var acqnt = JSON.stringify($scope.aqua);
     
      var option_Json = $.parseJSON(opt_Json);
      var video_Json = $.parseJSON(vide);
       var image_Json = $.parseJSON(img);
      var sug_Json = $.parseJSON(sugges);
      var remar_Json = $.parseJSON(remar);
      var mod_Json = $.parseJSON(modA);
      var tag_Json = $.parseJSON(tagA);
      
      var reqnt_Json = $.parseJSON(reqnt);
      var acqnt_Json = $.parseJSON(acqnt);
      
     // console.log($scope.selected);
     // console.log(option_Json);
      var data=$scope.queses; 
           angular.forEach(data, function(value, key) {
               qus_Arr.push(value['qid']);
           });
      angular.forEach(qus_Arr, function(value, key){
           answerArray.push("0.00");
           vidArray.push(" ");
           imgArray.push(" ");
           sugArray.push(" ");
           repArray.push(" ");
           model_Arr.push(" ");
           tag_Arr.push(" ");
           rqua_Arr.push(" ");
           aqua_Arr.push(" ");
          
      });
      
      angular.forEach(option_Json, function(v,k){
                 questionArray.push(k);
                  var index = qus_Arr.indexOf(k);
                 
                 if (index !== -1) {
                     if(v ==''){
                         v = '0.00';
                     }
                    answerArray[index] = v;
                  }
              });
      angular.forEach(video_Json, function(v,k){
                 
                  var index = qus_Arr.indexOf(k);
                
                 if (index !== -1) {
                    vidArray[index] = v;
                  }
              });
      angular.forEach(image_Json, function(v,k){
                 
                  var index = qus_Arr.indexOf(k);
                
                 if (index !== -1) {
                    imgArray[index] = v;
                  }
              });
      angular.forEach(sug_Json, function(v,k){
                 
                  var index = qus_Arr.indexOf(k);
                
                 if (index !== -1) {
                    sugArray[index] = v;
                  }
              });
      angular.forEach(remar_Json, function(v,k){
                 
                  var index = qus_Arr.indexOf(k);
                
                 if (index !== -1) {
                     
                    repArray[index] = v;
                  }
              });
      angular.forEach(mod_Json, function(v,k){
                 
                  var index = qus_Arr.indexOf(k);
                
                 if (index !== -1) {
                     
                    model_Arr[index] = v;
                  }
              });
      angular.forEach(tag_Json, function(v,k){
                 
                  var index = qus_Arr.indexOf(k);
                
                 if (index !== -1) {
                     
                    tag_Arr[index] = v;
                  }
              });
      
      angular.forEach(reqnt_Json, function(v,k){
                 
                  var index = qus_Arr.indexOf(k);
                
                 if (index !== -1) {
                     
                    rqua_Arr[index] = v;
                  }
              });
      angular.forEach(acqnt_Json, function(v,k){
                 
                  var index = qus_Arr.indexOf(k);
                
                 if (index !== -1) {
                     
                    aqua_Arr[index] = v;
                  }
              });
             var qidsto = qus_Arr.join(",");
             var opionsto = answerArray.join(",");
             var videosto = vidArray.join("~");
             var imagesto = imgArray.join("~");
             var suggto = sugArray.join("~");
             var repto = repArray.join("~");
             var madto = model_Arr.join("~");
             var tagto = tag_Arr.join("~");
             var rqto = rqua_Arr.join(",");
             var aqto = aqua_Arr.join(",");
             var ipadr = "127:0:0:1";
             lat;
             long;
             var locationto = "lat: "+lat+", lng: "+long;
             $scope.path = locationto;
      
         var json = 'http://ipv4.myexternalip.com/json';
          $http.get(json).then(function(result) {
              if(result.ip == '' || result.ip == null){
                  localStorageService.set('IpaddId', result.data.ip);
              } else {
              localStorageService.set('IpaddId', result.ip);
              }
          }, function(e) {
           ipadr = "0:0:0:0";
          });
           
        var ip_address = localStorageService.get('IpaddId');
        console.log(ip_address);
           var date = new Date();
             var insDateto = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);
            dar = {
                 'uid' : localStorageService.get("uid"),
                 'aid': localStorageService.get('InspectionId'),
                 'cid' : localStorageService.get('InspectionCenter'),
                 'qids' : qidsto,
                 'videos' : videosto,
                 'images' : imagesto,
                 'scores' : opionsto,
                 'ip_address': ip_address,
                 'date': insDateto,
                 'lati_longi' : locationto,
                 'suggestion' : suggto,
                 'remark' : repto,
                 'final_comment' : comment
               };
      
           darAss = {
               'uid' : localStorageService.get("uid"),
                 'aid': localStorageService.get('InspectionId'),
                 'cid' : localStorageService.get('InspectionCenter'),
                 'qids' : qidsto,
                 'images' : imagesto,
                 'model': madto,
                'tag': tagto,
                 'ip_address': ip_address,
                 'date': insDateto,
                 'lati_longi' : locationto,
                 'suggestion' : suggto,
                 'remark' : repto,
                 'final_comment' : comment
             };
      
           darInv = {
				'uid' : localStorageService.get("uid"),
				'aid': localStorageService.get('InspectionId'),
				'cid' : localStorageService.get('InspectionCenter'),
				'qids' : qidsto,
				'images' : imagesto,
				'score': rqto,
				'score2': aqto,
				'ip_address': ip_address,
				'date': insDateto,
				'lati_longi' : locationto,
				'suggestion' : suggto,
				'remark' : repto,
				'final_comment' : comment
			};
      
             if($scope.qtitle == "Checklist" ){
               $http.post(adminurl + 'checkResult', dar).success(successResult).error(function(err) {
				navigator.notification.alert('Error code: ' + err.code, null, 'Capture Error');
			});
            } else if($scope.qtitle == "Inventory" ){
                $http.post(adminurl + 'invResult', darInv).success(successResult).error(function(err) {
				navigator.notification.alert('Error code: ' + err.code, null, 'Capture Error');
			});
            }  else if($scope.qtitle == "Assets" ){
                $http.post(adminurl + 'AssResult', darAss).success(successResult).error(function(err) {
				navigator.notification.alert('Error code: ' + err.code, null, 'Capture Error');
			});
            } else {
                $http.post(adminurl + 'saveResult', dar).success(successResult).error(function(err) {
				navigator.notification.alert('Error code: ' + err.code, null, 'Capture Error');
			});
            }
             
    
  };
     
  
   $scope.LiveVid = function(){
     $state.go('chat');
   };
        
    } // Quizcontroll

})();
        
