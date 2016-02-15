"use strict";

angular.module("chatApp").factory("ChatResource", 
function ChatResource($rootScope) {
	var socket = io.connect('http://localhost:8080');

	return {
		login: function (username, callback) {
			console.log("DEB: Inside chat resource login " + username);
			socket.emit("adduser", username, function(data) {
				$rootScope.$apply(function () {
					callback.apply(socket, [data]);
				});
			});
		},

		getRoomList: function (callback) {
			socket.emit("rooms", function(data) {
				console.log('here' + data + something);
				$rootScope.$apply(function () {
					callback.apply(socket, [data]);
				});
			});
		},

		on: function (event, callback) {
			socket.on(event, function (data) {
				$rootScope.$apply(function (){
					callback.apply(socket, [data]);
				});
			});
		}
	};
});