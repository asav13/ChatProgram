"use strict";

angular.module('chatApp').controller('ChatRoomController', 
function ChatRoomController($scope, $rootScope, $routeParams, $location, ChatResource, UserService){
	
	$scope.online = UserService.getOnlineStatus();
	$scope.selectedUser = "";
	$scope.someOneSelected = false;
	$scope.isOp = false;
	$scope.roomMessages = {};
	$scope.roomPrivateMessages = [];
	$scope.usersUserIsChattingTo = [];
	var room = UserService.getUserRoom();
	$scope.unbanning = false;

												$scope.usersUserIsChattingTo.push("amma");
												$scope.tabs = [
													{ title:'Dynamic Title 1', content:'Hallo hallo' },
													{ title:'Dynamic Title 2', content:'hey hey'}
													];

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
		ChatResource.getMessages(data);
		ChatResource.getRoomUsers(data);
	});

	ChatResource.on("recv_privatemsg", function(data, err) {
		if(data[1]) {
			ChatResource.getPrivateMessages(data);
			var time 	= new Date();
			time 		= time.toString();
			time 		= time.substring(16, 24);
			var message = {
				from: 	data[0],
				msg: 	data[1],
				time: 	time
			}
			var listOfChatters = $scope.usersUserIsChattingTo;
			if(listOfChatters.indexOf(message.from) < 0) {
				alert(message.from + " started a conversation with you!");
				listOfChatters.push(message.from);
			}
			$scope.roomPrivateMessages.push(message);
		}
	});

	ChatResource.on("roommessageslist", function(data){
		if(data && (UserService.getUserRoom !== null)){
			var m = data[1];
			if(data[0] === UserService.getUserRoom().room){
				if(m) { 
					for(var i = 0; i < m.length; i++){
						m[i].time = (m[i].timestamp).substring(11,19);
					}
					var room = UserService.getUserRoom();
					$rootScope.joinedRoom = room;
					$scope.roomMessages[room] = m;
				} else {
					console.log("ERROR: Error while loading messages.");
				}	
			}
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
		// second parameter is username
		if(data[1] === UserService.getUsername()){
			alert("You've been banned from the room by " + data[2] +". Behave!");
			$location.path("/chatrooms");
		}
	});


	ChatResource.on("opped", function(data){
		if(data[1] === UserService.getUsername()){
			alert("You've been opped by " + data[2] +"!");
			$scope.isOp = true;
			var currRoom = $rootScope.joinedRoom;
			UserService.addOpRoom(currRoom);
		}
	});

	ChatResource.on("deopped", function(data){
		if(data[1] === UserService.getUsername()){
			alert("You've been deopped by " + data[2] +". Sorry!");
			$scope.isOp = false;
			var currRoom = $rootScope.joinedRoom;
			UserService.addOpRoom(currRoom);
		}
	});	

	ChatResource.on("roomUserlist", function(data){
		if($rootScope.joinedRoom.users === undefined){
			$rootScope.joinedRoom.users = {};
		}
		for(var u in data){
			$rootScope.joinedRoom.users[u]=u;
		}
	});

	ChatResource.on("roomoplist", function(data){
		if($rootScope.joinedRoom.users === undefined){
			$rootScope.joinedRoom.users = {};
		}
		if($rootScope.joinedRoom.ops === undefined){
			$rootScope.joinedRoom.ops = {};
		}				
		$rootScope.joinedRoom.ops = data;
		//also on user list
		for(var u in data){
			$rootScope.joinedRoom.users[u]=u;
		}
	});


	$scope.changeTopic = function () {
		var topicObj = {
			room: room.name,
			topic: $scope.changedTopic
		};
		ChatResource.setTopic(topicObj).then(function(data,err){
			if(data) {
				$rootScope.joinedRoom.topic = topicObj.topic;
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

	$scope.makeOp = function () {
		var opObj = {
			user: $scope.selectedUser,
			room: $routeParams.name
		}
		ChatResource.makeOp(opObj, function (data){
			ChatResource.getRoomUsers(opObj.room);
			if(!data){
				console.log("ERROR: Error while opping user");
			}
		});
	};
	$scope.deOp = function () {
		var deopObj = {
			user: $scope.selectedUser,
			room: $routeParams.name
		}
		ChatResource.deOp(deopObj, function (data){
			ChatResource.getRoomUsers(deopObj.room);
			if(!data){
				console.log("ERROR: Error while deopping user");
			}
		});
	};

	$scope.unban = function () {
		$scope.unbanning = true;
		$scope.confirmUnban = function () {
			var username = $scope.unbanusername;
			var unbanObj = {
				user: username,
				room: $routeParams.name
			};
			ChatResource.unban(unbanObj, function (data){
				if(!data){
					console.log("ERROR: Error while unbanning user");
				}
			});
			$scope.unbanning = false;
		};
	};

});