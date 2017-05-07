var adminbase = "https://www.glocalthinkers.in/";
var adminurl = "https://www.glocalthinkers.in/index.php/json/";


//var adminbase = "http://192.168.0.112/";

//var adminurl = "http://192.168.0.112/glocalthinkers/index.php/json/";
//var adminbase = "http://glocalthinkers.in/";

//var adminurl = "http://localhost/glocalthinkers/index.php/json/";


angular.module('starter')
	.factory('MyServices', function ($http, $filter, localStorageService) {
		return {

			all: function () {
				return chats;
			},
			remove: function (chat) {
				chats.splice(chats.indexOf(chat), 1);
			},
			get: function (chatId) {
				for (var i = 0; i < chats.length; i++) {
					if (chats[i].id === parseInt(chatId)) {
						return chats[i];
					}
				}
				return null;
			},

			signin: function (signin, callback, err) {
                da = {
                 'username' : signin.username,
                 'password' : signin.password
               };
              return $http.post(adminurl + 'signIn', da).success(callback).error(err);
			},
            inspectionlist: function (callback, err) {
                da = {
                 'inspector' : localStorageService.get("uid")
               };

              return $http.post(adminurl + 'insList', da).success(callback).error(err);
			},
            checklist: function (callback, err) {
                da = {
                 'inspector' : localStorageService.get("uid")
               };

              return $http.post(adminurl + 'checkList', da).success(callback).error(err);
			},
            getResults: function (callback, err) {
                dat = {
                 'state' : localStorageService.get('assessor'),
                 'type': localStorageService.get('type')
               };
              return $http.post(adminurl + 'result_show', dat).success(callback).error(err);
			},
            getAddress: function (getAddress,callback, err) {
                da = {
                 'cid' : getAddress
               };

              return $http.post(adminurl + 'getAdd', da).success(callback).error(err);
			},
            getQuestions: function (insid,callback, err) {
                da = {
                 'insid' : insid
               };

              return $http.post(adminurl + 'getQues', da).success(callback).error(err);
			},
            getCheckQuestions: function (insid,callback, err) {
                da = {
                 'insid' : insid
               };

              return $http.post(adminurl + 'getQuesCheck', da).success(callback).error(err);
			},
            getInvQuestions: function (insid,callback, err) {
                da = {
                 'insid' : insid
               };

              return $http.post(adminurl + 'getQuesInv', da).success(callback).error(err);
			},
            getAssQuestions: function (insid,callback, err) {
                da = {
                 'insid' : insid
               };

              return $http.post(adminurl + 'getQuesAssets', da).success(callback).error(err);
			},



/////////////////// DON'T EDIT ANYTHING BELOW THIS LINE //////////////////////////////////////////
/////////////////// THIS IS FUTURE OF APP ////////////////////////////////////////////////////////
            /////////////////////////////////
			profilesubmit: function (profile, callback, err) {
				return $http({
					url: adminurl + 'profileSubmit',
					method: "POST",
					data: {
						'id': $.jStorage.get("user").id,
						'name': profile.name,
						'email': profile.email,
						'password': profile.password,
						'dob': profile.dob,
						'contact': profile.contact,
					}
				}).success(callback).error(err);
			},
			forgotpassword: function (email, callback, err) {
				return $http.get(adminurl + 'forgotPassword?email=' + email, {
					withCredentials: false
				}).success(callback).error(err);
			},
			getallvideogalleryvideo: function (id, pageno, callback, err) {
				return $http.get(adminurl + 'getAllVideoGalleryVideo?id=' + id + '&pageno=' + pageno + '&maxrow=' + 15, {
					withCredentials: false
				}).success(callback).error(err);
			},
			getallgalleryimage: function (id, pageno, callback, err) {
				return $http.get(adminurl + 'getAllGalleryImage?id=' + id + '&pageno=' + pageno + '&maxrow=' + 15, {
					withCredentials: false
				}).success(callback).error(err);
			},
			getsingleblog: function (id, callback, err) {
				return $http({
					url: adminurl + 'getSingleBlog',
					method: "POST",
					data: {
						'id': id
					}
				}).success(callback).error(err);
			},
			changepassword: function (password, callback, err) {
				return $http({
					url: adminurl + 'changePassword',
					method: "POST",
					data: password
				}).success(callback).error(err);
			},
			authenticate: function () {
				return $http({
					url: adminurl + 'authenticate',
					method: "POST"
				});
			},
			logout: function (callback, err) {
				localStorageService.clear();
				return $http.get(adminurl + 'logout', {
					withCredentials: false
				}).success(callback).error(err);
			},
			getuser: function () {
				return $.jStorage.get("user");
			},
			getallsliders: function (callback, err) {
				return $http.get(adminurl + 'getAllSliders', {
					withCredentials: false
				}).success(callback).error(err);
			},
			getallevents: function (pageno, callback, err) {

				return $http.get(adminurl + 'getAllEvents?pageno=' + pageno + '&maxrow=' + 15, {
					withCredentials: false
				}).success(callback).error(err);
			},
			getappconfig: function (callback, err) {
				return $http.get(adminurl + 'getAppConfig', {
					withCredentials: false
				}).success(callback).error(err);
			},
			getallgallery: function (pageno, callback, err) {
				return $http.get(adminurl + 'getAllGallery?pageno=' + pageno + '&maxrow=' + 15, {
					withCredentials: false
				}).success(callback).error(err);
			},
			getallvideogallery: function (pageno, callback, err) {
				return $http.get(adminurl + 'getAllVideoGallery?pageno=' + pageno + '&maxrow=' + 15, {
					withCredentials: false
				}).success(callback).error(err);
			},
			changesetting: function (setting, callback, err) {
				return $http({
					url: adminurl + 'changeSetting',
					method: "POST",
					data: {
						id: setting.id,
						videonotification: JSON.stringify(setting.videonotification),
						eventnotification: JSON.stringify(setting.eventnotification),
						blognotification: JSON.stringify(setting.blognotification),
						photonotification: JSON.stringify(setting.photonotification)
					}
				}).success(callback).error(err);
			},
			editprofile: function (profile, callback, err) {
				var user = _.cloneDeep(profile);
				user.dob = $filter("date")(user.dob, "yyyy-MM-dd");

				return $http({
					url: adminurl + 'editProfile',
					method: "POST",
					data: user
				}).success(callback).error(err);
			},
			getNotification: function (pageno, callback, err) {
				if ($.jStorage.get("user")) {
					var notificationres = function (data) {
						return $http.get(adminurl + 'getAllNotification?event=' + data.eventnotification + '&blog=' + data.blognotification + '&video=' + data.videonotification + '&photo=' + data.photonotification + '&pageno=' + pageno, {
							withCredentials: false
						}).success(callback).error(err);
					}

					$http.get(adminurl + 'getSingleUserDetail?id=' + $.jStorage.get("user").id, {
						withCredentials: false
					}).success(notificationres);

				} else {
					console.log("else user");
					return $http.get(adminurl + 'getAllNotification?event=true&blog=true&video=true&photo=true&pageno='+pageno, {
						withCredentials: false
					}).success(callback).error(err);
				}

			},
			getsingleuserdetail: function (callback, err) {
				$http.get(adminurl + 'getSingleUserDetail?id=' + $.jStorage.get("user").id, {
					withCredentials: false
				}).success(callback).error(err);
			},
			setNotificationToken: function (callback) {
				$http.get(adminurl + 'setNotificationToken?os=' + $.jStorage.get("os")+"&token="+$.jStorage.get("token"), {
					withCredentials: false
				}).success(callback);
			},

		};
	});
