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
		var roomName = $routeParams.name;
		var msgInput = $scope.chatInput;
		var date = new Date();
		var message = {
			roomName: 	roomName,
			msg: 		msgInput
		};
		ChatResource.sendMsg(message);
	};

	ChatResource.on("updatechat", function(data,err) {
		ChatResource.getMessages(data);
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

	$scope.sendPrivateMessage = function () {
		var theUser = $scope.selectedUser;
	};

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

});