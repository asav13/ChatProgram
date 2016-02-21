angular.module("chatApp").factory("UserService", 
function UserService() {

	// This should only be run once per client session, according to DEB info it seems to work
	var userinfo = {
		name: 	null,
		room: 	null,
		opRoom: null
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
		getUserRoom: function () {
			return userinfo.room;
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
				userinfo.room 	= null;
				userinfo.opRoom = null
			}
		},

		addRoom: function (room_par) {
			if(!online) {
				console.log("ERROR: No user logged in but trying to join room");
			} else {
				userinfo.room = room_par;
			}
		},
		leaveRoom: function (room_par) {
			if(!online) {
				console.log("ERROR: No user logged in but trying to join room");
			} else {
				userinfo.room = null; // Should we have more than one room !?!T ODO
				userinfo.opRoom = null;
			}
		},
		addOpRoom: function (room_par) {
			userinfo.opRoom = room_par;
			console.log("DEB: HERE added op");
		},
		getOpRoom: function (room_par) {
			return userinfo.opRoom;
			
		}		
	};
});