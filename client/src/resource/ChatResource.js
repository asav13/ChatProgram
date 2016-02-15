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

		/* Called for example by LoginController when user has loged on */
		getRoomList: function (callback) {
			socket.emit("rooms", function(roomlist) {
			// No need to do anything, will call on
			});
		},

		getUsers: function(callback) {
			socket.emit("users", function(data) {
			});
		},

		/* Called when waiting for response */
		on: function (event, callback) {
			socket.on(event, function (data) {
				$rootScope.$apply(function () {
					callback.apply(socket, [data]);
				});
			});
		}
	};
});