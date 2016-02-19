"use strict";

angular.module('chatApp').controller('ChatRoomController', 
function ChatRoomController($scope, $rootScope, $routeParams, $location, ChatResource, UserService){
	
	$scope.online = UserService.getOnlineStatus();
	var room = UserService.getUserRoom();
	//ChatResource.getMessages(room.name);


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
			$scope.roomMessages = data;
		} else {
			console.log("ERROR: " + err);
		}
	});

	$scope.changeTopic = function () {
		var topicObj = {
			room: room.name,
			topic: $scope.changedTopic
		}
		ChatResource.setTopic(topicObj).then(function(data,err){
			if(data) {
				$scope.joinedRoom.topic = topicObj.topic;
				$scope.changedTopic="";
			} else {
				console.log("ERROR: Error while changing topic " + err);
			}
		});
	}

});