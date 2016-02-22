"use strict";

/**
* This service  takes care of communicating with the server, 
* establishing a connection with io socket, emitting, and receiving events.
*/

angular.module("chatApp").factory("ChatResource", 
function ChatResource($rootScope, $q) {
	
	var socket = io.connect('http://localhost:8080');

	return {
		/* Called by LoginController */
		login: function (username) {
			var deferred 			= $q.defer();
			$rootScope.username 	= username;
			$rootScope.login 		= true;
			socket.emit("adduser", username, function(available) {
				deferred.resolve(available);
			});
			return deferred.promise;
		},

		logout: function () {
			socket.emit("logout");
		},

		getRoomList: function (callback) {
			socket.emit("rooms");
		},

		getRoomUsers: function (room) {
			socket.emit("roomUsers", room);
		},

		getMessages: function (room) {
			socket.emit("roomMessages", room);
		},

		getPrivateMessages: function (message, callback) {
			socket.emit("roomPrivateMessages", message, function(data, err) {
			});
		},

		getUsers: function(callback) {
			socket.emit("users", function(data) {
			});
		},

		createRoom: function(newRoom) {
			var deferred = $q.defer();
			socket.emit("joinroom", newRoom, function(data,err){
				deferred.resolve(data);
			});
			return deferred.promise;
		},

		joinRoom: function(room) {
			var obj = {
				room: room.name,
			};
			var deferred = $q.defer();
			socket.emit("joinroom", obj, function(data,err){
				deferred.resolve(data);
			});
			return deferred.promise;
		},

		leaveRoom: function(room) {
			socket.emit("partroom", room);
		},

		setTopic: function(topicObj, callback){
			var deferred = $q.defer();
			socket.emit("settopic", topicObj, function(data,err){
				deferred.resolve(data);
			});
			return deferred.promise;
		}, 

		sendMsg: function(data) {
			socket.emit("sendmsg", data);
		},

		// What am I supposed to send to the server???
		sendPrivateMsg: function(data, callback) {						//VÉDÍS
			// This "privateMsg" is supposed to be						//VÉDÍS
			// the connection to the chat server, right?				//VÉDÍS
			// Is it ok to do the same callback as kick below?			//VÉDÍS
			socket.emit("privatemsg", data, function(data){				//VÉDÍS, msg not Msg
				$rootScope.$apply(function () {							//VÉDÍS, rootScope not rootscope, stupid case sensitive stuff
					callback.apply(socket, [data]);						//VÉDÍS
				});														//VÉDÍS
			});															//VÉDÍS
		},																//VÉDÍS

		kick: function(kickObj, callback) {
			socket.emit("kick", kickObj, function(data){
				$rootScope.$apply(function () {
					callback.apply(socket, [data]);
				});
			});
		},

		ban: function(banObj, callback) {
			socket.emit("ban", banObj, function(data){
				$rootScope.$apply(function () {
					callback.apply(socket, [data]);
				});
			});
		},

		unban: function(unbanObj, callback) {
			socket.emit("unban", unbanObj, function(data){
				$rootScope.$apply(function () {
					callback.apply(socket, [data]);
				});
			});
		},

		makeOp: function(opObj, callback) {
			socket.emit("op", opObj, function(data){
				$rootScope.$apply(function () {
					callback.apply(socket, [data]);
				});
			});
		},
		deOp: function(deopObj, callback) {
			socket.emit("deop", deopObj, function(data){
				$rootScope.$apply(function () {
					callback.apply(socket, [data]);
				});
			});
		},

		/* Called when waiting for response */
		on: function (event, callback) {
			console.log("Event received:" + event);
			var deferred = $q.defer();
			socket.on(event, function (data, data1, data2) {
				$rootScope.$apply(function () {
					callback.apply(socket, [data]);
				});
			});
		}
	};
});