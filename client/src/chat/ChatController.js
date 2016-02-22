"use strict";

angular.module('chatApp').controller('ChatController', 
function ChatController($scope, $rootScope, $routeParams, $location, ChatResource, UserService){

	$scope.online = UserService.getOnlineStatus();
	$scope.joinError = false;
	$scope.isCollapsed = true;
	ChatResource.getRoomList();
	
	// When we get an "roomlist" event, we update the roomlist
	ChatResource.on("roomlist", function (roomlist) {
		if(roomlist){
			var temp = [];

			for(var i in roomlist){
				var currRoom = {
					name: i,
					room: i,
					topic: roomlist[i].topic,
					users: roomlist[i].users,
					ops: roomlist[i].ops
				};

				temp.push(currRoom);
			}
			$scope.rooms = temp;
			$scope.selectedRoom	 = $scope.rooms[0];
		} else {
			console.log("ERROR: Error fetching rooms");
		}
	});

	ChatResource.on("updatechat", function(data,err) {
		// When we get an "update chat" event, we update the roomlist
		// update users inside the room etc
		ChatResource.getRoomList();
	});

	ChatResource.on("updateusers", function(data,err){
		if(!UserService.getOnlineStatus()) {
			return;
		} 
		var roomUserIsIn = UserService.getUserRoom();
		if(roomUserIsIn === null) {
			return;
		}

		if(roomUserIsIn.name === data){
			ChatResource.getRoomUsers(data.toString());
			ChatResource.on("roomUserlist", function (data,err){
				if(data){
					$rootScope.joinedRoom.users = data;
				}else {
					console.log("ERROR: " + err);
				}
			});
		}
	});

	$scope.createRoom = function() {
		var userName = UserService.getUsername();
		var currUser = {
			userName: userName
		};

		if($scope.newRoomName !== undefined){
			var newRoom = {
				room: $scope.newRoomName,
				name: $scope.newRoomName,
				topic: "No topic has been set for room..",
				ops: currUser
			};
			ChatResource.createRoom(newRoom).then(function(success, err){
				if(success){
					$scope.joinError = false;
					$rootScope.joinedRoom = newRoom;
					$location.path("/chatrooms/" + newRoom.name);
					ChatResource.getMessages(newRoom.name);
					UserService.addRoom(newRoom);
					UserService.addOpRoom(newRoom);
				} else {
					console.log("ERROR: " + err);
				}
			});
		}
	};

	$scope.join = function(chatroom) {
		$scope.selectedRoom = chatroom;
		var room = $scope.selectedRoom;
		var roomObj = {
			room: $scope.selectedRoom,
		};

		ChatResource.joinRoom(room).then(function(success){
			if(success){
				ChatResource.getRoomList();
				$scope.joinError = false;
				$rootScope.joinedRoom = room;
				$location.path("/chatrooms/" + room.room);
				UserService.addRoom(room);
				ChatResource.getRoomUsers(room.room);
				ChatResource.getMessages(room.room);


			} else {
				$scope.joinError = true;
				console.log("ERROR: Error while trying to join room.");
			}
		});

	};

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

});