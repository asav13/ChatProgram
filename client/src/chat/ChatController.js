"use strict";

angular.module('chatApp').controller('ChatController', 
function ChatController($scope, $rootScope, $routeParams, $location, ChatResource, UserService){

	$scope.online = UserService.getOnlineStatus();
	$scope.joinError = false;
	ChatResource.getRoomList();
	
	// When we get an "roomlist" event, we update the roomlist
	ChatResource.on("roomlist", function (roomlist) {
		if(roomlist){
			var temp = [];

			for(var i in roomlist){
				var currRoom = {
					name: i,
					topic: roomlist[i].topic,
					users: roomlist[i].users,
					ops: roomlist[i].ops
				};

				console.log("BEFORE");
				console.log(currRoom);

				for(var u in currRoom.users){
					for(var o in currRoom.ops){
						if(o == u){
							delete currRoom.users[u];
						}
					}
				}
				console.log("after");
				console.log(currRoom);

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
					$scope.joinedRoom.users = data;
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
					UserService.addRoom(newRoom);
					UserService.addOpRoom(newRoom);
				} else {
					console.log("ERROR: " + err);
				}
			});
		}
	};

	$scope.join = function() {
		var room = $scope.selectedRoom;
		var roomObj = {
			room: $scope.selectedRoom,
		};

		ChatResource.joinRoom(room).then(function(success){
			if(success){
				$scope.joinError = false;
				$rootScope.joinedRoom = room;
				$location.path("/chatrooms/" + room.name);
				UserService.addRoom(room);
			} else {
				$scope.joinError = true;
				console.log("ERROR: Error while trying to join room.");
			}
		});

	};

});