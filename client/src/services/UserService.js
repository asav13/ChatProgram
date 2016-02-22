"use strict";

angular.module("chatApp").factory("UserService", 
function UserService() {

	var userinfo = {
		name: 	null,
		room: 	null,
		opRoom: null
	};
	var online 	= false;

	return {
		/* Called by LoginController */
		login: function (username) {
			if(username === undefined){
				console.log("ERROR: no username");
			} else {
				if(online) {
					console.log("ERROR: A user is logging in when some1 is already online.");
					console.log("This should not be able to happen.");
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
				console.log("ERROR: A user is logging off when noone is logged in.");
				console.log("This should not be able to happen.");
			} else {
				online 			= false;
				userinfo.name 	= null;
				userinfo.room 	= null;
				userinfo.opRoom = null;
			}
		},

		addRoom: function (room_par) {
			if(!online) {
				console.log("ERROR: No user logged in but trying to join room.");
				console.log("This should not be able to happen.");
			} else {
				userinfo.room = room_par;
			}
		},

		leaveRoom: function (room_par) {
			if(!online) {
				console.log("ERROR: No user logged in but trying to leave room.");
				console.log("This should not be able to happen.");
			} else {
				userinfo.room 	= null;
				userinfo.opRoom = null;
			}
		},

		addOpRoom: function (room_par) {
			userinfo.opRoom = room_par;
		},
		getOpRoom: function (room_par) {
			return userinfo.opRoom;
			
		},
		removeOpRoom: function () {
			userinfo.opRoom = null;
		}
	};
});