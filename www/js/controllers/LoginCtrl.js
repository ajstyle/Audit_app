(function(){
	angular.module('starter')
		   
  .controller('LoginCtrl', function ($scope, MyServices, $ionicPopup, $interval, $location, $window, window) {
	addanalytics("flexible login page");
	$scope.logindata = {};
	localStorageService.clearAll();

	$scope.forgotpass = function () {
		$location.url("/access/forgotpassword");
	}

	var loginstatus = false;

	function internetaccess(toState) {
		if (navigator) {
			if (navigator.onLine != true) {
				onoffline = false;
				$location.url("/logins");
			} else {
				onoffline = true;
			}
		}
	}
	$scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
		internetaccess(toState);
	});
	window.addEventListener("offline", function (e) {
		internetaccess();
	})
	window.addEventListener("online", function (e) {
		internetaccess();
	})

	// loader
	$scope.showloading = function () {
		$ionicLoading.show({
			template: '<ion-spinner class="spinner-positive"></ion-spinner>'
		});
		$timeout(function () {
			$ionicLoading.hide();
		}, 5000);
	};

	//logins

	var authenticatesuccess = function (data, status) {
		$ionicLoading.hide();
		if (data != "false") {
			window.localStorageService.set("user", data);
			user = data;
			reloadpage = true;
			$location.url("/app");
		}
	};

	//SIGN UP FORM

	// SIGN IN
	$scope.signin = {};
	var signinsuccess = function (data, status) {
		$ionicLoading.hide();
		if (data != 'false') {

			window.localStorageService.set("user", data);
			user = data;
			$location.url("/app");
			$scope.signin = {};
		} else {

			var alertPopup = $ionicPopup.alert({
				title: 'Login failed!',
				template: 'Wrong username or password!'
			});
		}
	}
	$scope.signinsubmit = function (signin) {
		$ionicLoading.show();
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
				$location.url("/logins");
			});
		} else {
			msgforall("Fill all data");
			$ionicLoading.hide();
		}

	}


});

})();
