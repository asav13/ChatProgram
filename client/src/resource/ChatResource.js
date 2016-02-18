"use strict";

/**
* This one takes care of communicating with the server, establishing 
* a connection with io socket.
* Maybe we don't need a seperate function for each, maybe just "emit" and "on",
* and the commands ("adduser","rooms" etc) as paramters
*
*/

angular.module("chatApp").factory("ChatResource", 
function ChatResource($rootScope, $q) {
	// This should only be run once, according to DEB info it seems to work
	var socket = io.connect('http://localhost:8080');

	return {
		/* Called by LoginController */
		login: function (username, callback) {
			var deferred = $q.defer();
			// Not 100% sure what rootscope is ...is this bad practice??
			// needed it to save .username, coouldnt call apply in the controller
			$rootScope.username 	= username;
			$rootScope.login 		= true;
			socket.emit("adduser", username, function(available) {
				deferred.resolve(available);
				});
				return deferred.promise;
		},

		logout: function () {
			console.log("disc");
			socket.emit("logout");
		},

		/* Called for example by LoginController when user has loged on */
		getRoomList: function (callback) {
			socket.emit("rooms", function(roomlist) {
			// No need to do anything, will call on
			});
		},

		getRoomUsers: function (room, callback) {
			socket.emit("roomUsers", room, function(data,err) {
			// No need to do anything, will call on
			});
		},

		getUsers: function(callback) {
			socket.emit("users", function(data) {
			});
		},

		createRoom: function(newRoom, callback) {
			var deferred = $q.defer();
			socket.emit("joinroom", newRoom, function(data,err){
				deferred.resolve(data);
			});
			return deferred.promise;
		},

		joinRoom: function(room, callback) {
			var obj = {
				room: room.name,
			};

			var deferred = $q.defer();
			socket.emit("joinroom", obj, function(data,err){
				deferred.resolve(data);
			});
			return deferred.promise;
		},

		setTopic: function(data, callback){
			console.log("DEB in ChatResource.setTopic");
			socket.emit("setTopic", data, function(data,err){
				console.log("DEB: Inside ChatResource.setTopic data is");
				console.log(data);
			});
		}, 

		/* Called when waiting for response */
		on: function (event, callback) {
			console.log("event	 INSIDE ON");
			console.log(event);
			var deferred = $q.defer();
			socket.on(event, function (data) {
				$rootScope.$apply(function () {
					callback.apply(socket, [data]);
				});
			});
		}
	};
});