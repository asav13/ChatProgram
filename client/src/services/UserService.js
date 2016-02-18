angular.module("chatApp").factory("UserService", 
function UserService() {

	// This should only be run once per client session, according to DEB info it seems to work
	var userinfo = {
		name: 	null,
		rooms: 	null
	};

	var online 		= false;

	return {
		/* Called by LoginController */
		login: function (username) {
			if(username === undefined){
				console.log("ERROR: no username");
			} else {
				if(online){
					console.log("ERROR: A user is logging in when some1 is already online...");
				} else {
					userinfo.name 	= username;
					userinfo.rooms 	= [];
					online 			= true;
				}
			}
		},

		getUsername: function () {
			return userinfo.name;
		},
		getUserRooms: function () {
			return userinfo.rooms;
		},

		getOnlineStatus: function () {
			return online;
		},

		logout: function () {
			if(!online){
				console.log("ERROR: A user is logging off when no1 is logged in...");
			} else {
				online 			= false;
				userinfo.name 	= null;
				userinfo.rooms 	= null;
			}
		},

		addRoom: function (room_par) {
			if(!online) {
				console.log("ERROR: No user logged in but trying to join room");
			} else {
				var room = room_par;
				userinfo.rooms.push(room);
			}
		}
	};
});