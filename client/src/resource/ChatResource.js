"use strict";

/**
* This one takes care of communicating with the server, establishing 
* a connection with io socket.
* Maybe we don't need a seperate function for each, maybe just "emit" and "on",
* and the commands ("adduser","rooms" etc) as paramters
*
*/

angular.module("chatApp").factory("ChatResource", 
function ChatResource($rootScope) {
	var socket = io.connect('http://localhost:8080');

	return {
		/* Called by LoginController */
		login: function (username, callback) {
			$rootScope.username = username;
			console.log("DEB: Inside chat resource login " + username);
			socket.emit("adduser", username, function(data) {
				$rootScope.$apply(function () {
					callback.apply(socket, [data]);
				});
			});
		},

		/* Called for example by LoginController when user has loged on */
		getRoomList: function (callback) {
			socket.emit("rooms", function(data) {
				console.log('here' + data + something);
				$rootScope.$apply(function () {
					callback.apply(socket, [data]);
				});
			});
		},

		getUsers: function(callback) {
			socket.emit("users", function(data){
				console.log("users " + data);
				$rootScope.$apply(function (){
					callback.apply(socket, [data]);
				});
			});
		},

		/* Called when waiting for response */
		on: function (event, callback) {
			socket.on(event, function (data) {
				$rootScope.$apply(function (){
					callback.apply(socket, [data]);
				});
			});
		}
	};
});