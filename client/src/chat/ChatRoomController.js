"use strict";

angular.module('chatApp').controller('ChatRoomController', 
function ChatRoomController($scope, $rootScope, $routeParams, $location, ChatResource, UserService){
	
	$scope.online = UserService.getOnlineStatus();
	$scope.selectedUser = "";
	$scope.someOneSelected = false;
	$scope.isOp = false;
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
	$scope.sendPrivateMessage = function () {										//VÉDÍS
		//var username = $scope.getUsername;										//VÉDÍS
		var username = $scope.selectedUser;											// ASA
		var msgInput = prompt("Type a private message to " + username, "");			//VÉDÍS
																					//VÉDÍS
		if(msgInput !== null) {														//VÉDÍS
			var date = new Date();													//VÉDÍS
			var message = {															//VÉDÍS
				nick: 	username,												//changed
				msg: 		msgInput												//VÉDÍS
			};
			console.log(message);														//VÉDÍS
			ChatResource.sendPrivateMsg(message, function(success) {		//wants a callback
				console.log("in callback");
				console.log(success); //boolean variable 
			} );									//VÉDÍS
		}																			//VÉDÍS
	};																				//VÉDÍS

	ChatResource.on("updatechat", function(data,err) {
		ChatResource.getMessages(data);
	});

	// I'm not sure if this is the thing to do...
	ChatResource.on("recv_privatemsg", function(data, err) {						//VÉDÍS
		if(data[1]) {																//VÉDÍS
			alert("YOU GOT A MESSAGE!!");											//VÉDÍS
			console.log("DATA");													//VÉDÍS
			console.log(data);														//VÉDÍS
		}																			//VÉDÍS
		ChatResource.getPrivateMessages(data);										//VÉDÍS
	});																				//VÉDÍS

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
		var currNamePlusOp = "@"+currUser;
		if(!($scope.selectedUser === currUser || $scope.selectedUser === currNamePlusOp)){

			$scope.someOneSelected = true;
			var currRoom = UserService.getUserRoom();

			for(var i in currRoom.ops){
				if(i === currUser){
					$scope.isOp = true;
				}
			}
		} else {$scope.selectedUser = "";}
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