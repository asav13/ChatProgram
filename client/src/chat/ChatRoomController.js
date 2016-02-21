"use strict";

angular.module('chatApp').controller('ChatRoomController', 
function ChatRoomController($scope, $rootScope, $routeParams, $location, ChatResource, UserService){
	
	$scope.online = UserService.getOnlineStatus();
	$scope.selectedUser = "";
	$scope.someOneSelected = false;
	$scope.isOp = false;
	$scope.roomPrivateMessages = [];
	var room = UserService.getUserRoom();

	$scope.leaveRoom = function () {
		var roomName = $routeParams.name;
		ChatResource.leaveRoom(roomName);
		$location.path("/chatrooms");
		UserService.leaveRoom();
		room = null;
	};

	if(room !== null){
		$rootScope.$on( "$routeChangeSuccess", function(event, next, current) {
			if($location.hash === "#/chatrooms"){
				return;
			}
			if(room === null){return;} // could have changed in meantime!!
			
			var roomName = room.name;
			ChatResource.leaveRoom(roomName);
			$location.path("/chatrooms");
			UserService.leaveRoom();
			room = null;
		});
	}

	$scope.sendMessage = function () {
		var msgInput = $scope.chatInput;
		if(msgInput.length > 0) {
			var roomName = $routeParams.name;
			var date = new Date();
			var message = {
				roomName: 	roomName,
				msg: 		msgInput
			};
			$scope.chatInput = "";
			ChatResource.sendMsg(message);
		}
	};

	// This shit is connected to an unordered list in chatrooms.html
	$scope.sendPrivateMessage = function () {
		//var username = $scope.getUsername;
		var username = $scope.selectedUser;
		var msgInput = prompt("Type a private message to " + username, "");

		if(msgInput !== null) {
			var date = new Date();
			var message = {
				nick: 		username,
				message: 	msgInput
			};
			console.log(message);
			ChatResource.sendPrivateMsg(message, function(success) {		//wants a callback
				console.log("in callback");
				console.log(success); //boolean variable 
			} );
		}
	};

	ChatResource.on("updatechat", function(data,err) {
		console.log("!!!! 1");
		ChatResource.getMessages(data);
	});

	ChatResource.on("recv_privatemsg", function(data, err) {
		if(data[1]) {
			alert(data[0] + " sent you a message:\n" + data[1]);
			ChatResource.getPrivateMessages(data);
			var time = new Date();
			time = time.toString();
			time = time.substring(16, 24);
			var message = {
				from: 	data[0],
				msg: 	data[1],
				time: 	time
			}
			$scope.roomPrivateMessages.push(message);
		}
	});

	ChatResource.on("roomMessages", function(data, err){

		if(data) { 
			for(var i = 0; i < data.length; i++){
				data[i].time = (data[i].timestamp).substring(11,19);
			}
			$scope.roomMessages = data;
		} else {
			console.log("ERROR: " + err);
		}
	});

	ChatResource.on("kicked", function(data,err){
		// second parameter is username
		if(data[1] === UserService.getUsername()){
			alert("You've been kicked out of the room by " + data[2] +". Behave!");
			$location.path("/chatrooms");
		}
	});

	ChatResource.on("banned", function(data){
		console.log("Banned");
		console.log(data);
		console.log(err);
		// second parameter is username
		if(data[1] === UserService.getUsername()){
			alert("You've been banned from the room by " + data[2] +". Behave!");
			$location.path("/chatrooms");
		}
	});


	$scope.changeTopic = function () {
		var topicObj = {
			room: room.name,
			topic: $scope.changedTopic
		};
		ChatResource.setTopic(topicObj).then(function(data,err){
			if(data) {
				$scope.joinedRoom.topic = topicObj.topic;
				$scope.changedTopic="";
			} else {
				console.log("ERROR: Error while changing topic " + err);
			}
		});
	};

	$scope.$watch("selectedUser", function () {
		var currUser = UserService.getUsername();

		$scope.someOneSelected = true;
		
		if(UserService.getOpRoom() !== null){
			$scope.isOp = true;
		}

		if($scope.selectedUser === currUser){
			$scope.someOneSelected = false;
			$scope.isOp = false;
			$scope.selectedUser = "";
		}
	});

	$scope.kick = function () {
		var kickObj = {
			user: $scope.selectedUser,
			room: $routeParams.name
		}
		ChatResource.kick(kickObj, function (data){
			if(!data){
				console.log("ERROR: Error while kicking user");
			}
		});
	};

	$scope.ban = function () {
		var banObj = {
			user: $scope.selectedUser,
			room: $routeParams.name
		}
		ChatResource.ban(banObj, function (data){
			if(!data){
				console.log("ERROR: Error while banning user");
			}
		});
	};



});