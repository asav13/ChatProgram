"use strict";

angular.module('chatApp').controller('ChatRoomController', 
function ChatRoomController($scope, $rootScope, $routeParams, $location, ChatResource, UserService){
	
	$scope.online = UserService.getOnlineStatus();
	$scope.selectedUser = "";
	$scope.someOneSelected = false;
	$scope.isOp = false;
	$scope.roomMessages = {};
	$scope.usersUserIsChattingTo = [];
	$scope.tabs = [];
	$scope.newMsg = false;
	$scope.privateMessages = [];
	var room = UserService.getUserRoom();
	$scope.unbanning = false;

	if(!$scope.online){
		$location.path("/login");
	}


	$scope.public = true;
	$scope.private = false;

	$scope.setSelectedUser = function (x) {
		if(x !== undefined){
			var user = {};
			user[x] = x;
			$scope.selectedUser = x;
			$scope.someOneSelected = true;
		}

		if($scope.selectedUser !== ""){
			$scope.private = true;
			$scope.public = false;
		} else {
			$scope.private = false;
			$scope.public = true;
		}
	};

	$scope.setSelectedUserNone = function () {
		$scope.public = true;
		$scope.private = false;

		$scope.selectedUser = "";
	};


	$scope.leaveRoom = function () {
		var roomName = $routeParams.name;
		ChatResource.leaveRoom(roomName);
		$location.path("/chatrooms");
		UserService.leaveRoom();
		room = null;
	};

	if(room !== null){
		$rootScope.$on( "$routeChangeSuccess", function(event, next, current) {
			if($location.hash === "/chatrooms"){
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
		var msgInput = $scope.pmInput;
		var time 	= new Date();
		time 		= time.toString();
		time 		= time.substring(16, 24);

		if(msgInput !== null) {
			var messageToUser = {
				nick: 		username,
				message: 	msgInput
			};
			// This is so the user also sees the private messages he sends
			var messageFromUser = {
				nick: 		UserService.getUsername(),
				message: 	msgInput
			};

			// To display only conversation between two in a tab
			var pm = {
				from: 		UserService.getUsername(),
				to: 		username,
				message: 	msgInput,
			};

			$scope.privateMessages.push(pm);

			var contMsg = {
				from: 		UserService.getUsername(),
				time: 		time,
				message: 	msgInput
			};

			// I have to create a new tab here with receiver's name and msg from current user
			// if it is the first message, else, I add it to the tab whose title is = receiving user
			// I must do this there instead of receive because the server only sends back the sender

			// If the user is not in the list of ppl chatting to me
			if($scope.usersUserIsChattingTo.indexOf(messageToUser.nick) < 0) {
				$scope.usersUserIsChattingTo.push(username);

				var tab = {
					title: 		username,
					content: 	[contMsg]
				};

				$scope.tabs.push(tab);
			} else {
				// Find the tab with title === username and add the message to contents there
				for(var i = 0; i < $scope.tabs.length; i++) {
					if($scope.tabs[i].title === username) {
						$scope.tabs[i].content.push(contMsg);
					}
				}
			}
		}

		$scope.pmInput = "";

		ChatResource.sendPrivateMsg(messageToUser, function(success) {
		});
		ChatResource.sendPrivateMsg(messageFromUser, function(success) {
		});
	};

	ChatResource.on("updatechat", function(data,err) {
		ChatResource.getMessages(data);
		ChatResource.getRoomUsers(data);
	});

	ChatResource.on("recv_privatemsg", function(data, err) {
		if(data[1]) {
			$scope.newMsgFrom = data[0];
			ChatResource.getPrivateMessages(data);

			var time 	= new Date();
			time 		= time.toString();
			time 		= time.substring(16, 24);

			var message = {
				from: 	data[0],
				msg: 	data[1],
				time: 	time
			};

			// If the message is from self, don't do anything since messages from self are logged at send
			if(message.from !== UserService.getUsername()) {
				var contMsg = {
					from: 		message.from,
					time: 		message.time,
					message: 	message.msg
				};

				// If it is the first message between users, create a new tab and add the user to list of chatters
				if($scope.usersUserIsChattingTo.indexOf(message.from) < 0) {
					$scope.usersUserIsChattingTo.push(message.from);
					$scope.newMsg = true;
					setTimeout(function(){ $scope.newMsg = false; }, 150);

					var tab = {
						title: 		message.from,
						content: 	[contMsg]
					};

					$scope.tabs.push(tab);
				} else {
					for(var i = 0; i < $scope.tabs.length; i++) {
						if($scope.tabs[i].title === message.from) {
							// push the new message to the right tab content
							$scope.tabs[i].content.push(contMsg);
						}
					}
				}
			}
			
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
			$location.path("/chatrooms");
		}
	});

	ChatResource.on("banned", function(data){
		// second parameter is username
		if(data[1] === UserService.getUsername()){
			$location.path("/chatrooms");
		}
	});


	ChatResource.on("opped", function(data){
		if(data[1] === UserService.getUsername()){
			$scope.isOp = true;
			var currRoom = $rootScope.joinedRoom;
			UserService.addOpRoom(currRoom);
		}
	});

	ChatResource.on("deopped", function(data){
		if(data[1] === UserService.getUsername()){
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

		//$scope.setSelectedUser();

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
		};
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
		};
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
		};
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
		};
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