(function(){
	angular.module('starter')
	.controller('OngoingCtrl', ['localStorageService', '$scope', '$ionicPlatform','$state', '$window',OngoingCtrl])
	.controller('OnCtrl', ['localStorageService', '$scope', '$ionicPlatform','$state', '$window',OnCtrl])
	.controller('ComplitedCtrl', ['localStorageService', '$scope', '$ionicPlatform','$state', '$window',ComplitedCtrl])
	.controller('CompleteCtrl', ['localStorageService', '$scope', '$ionicPlatform','$state', '$window',CompleteCtrl]);
	
	function OngoingCtrl(localStorageService, $scope, $state,$ionicPlatform,$window){
      $scope.inspections = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
	}function OnCtrl(localStorageService, $scope, $state,$ionicPlatform,$window){
      $scope.inspections = [
    { title: 'Yudi test', id: 1 },
    { title: 'Hello', id: 2 }
  ];
	}
    function ComplitedCtrl(localStorageService, $scope, $state,$ionicPlatform,$window){
      $scope.inspections = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
	}
    function CompleteCtrl(localStorageService, $scope, $state,$ionicPlatform,$window){
      $scope.inspections = [
    { title: 'Sumi test', id: 1 },
    { title: 'Hi', id: 2 }
  ];
	}

})();
