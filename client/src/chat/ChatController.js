"use strict";

angular.module('chatApp').controller('ChatController', 
function ChatController($scope, $rootScope, $routeParams, $location, ChatResource, UserService){

	$scope.online = UserService.getOnlineStatus();
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
		var roomsUserIsIn = UserService.getUserRooms();

		if(roomsUserIsIn.find(x => x.name == data.toString()) !== undefined){
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
		var newRoom = {
			room: $scope.newRoomName
		};

		ChatResource.createRoom(newRoom).then(function(success, err){
			if(success){
			//	var leRoom = {room: $scope.newRoomName, topic: "updated topic..."};
			//	ChatResource.setTopic(leRoom, function(success, err){
			//		console.log("DEB: success in chat controller after set topic");
			//		console.log(success);
			//	});
			// TODO set topic
			} else {
				console.log("ERROR: " + err);
			}
		});
	};

	$scope.join = function() {
		var room = $scope.selectedRoom;
		var roomObj = {
			room: $scope.newRoomName,
		};

		ChatResource.joinRoom(room).then(function(success,err){
			if(success){
				$rootScope.joinedRoom = room;
				$location.path("/chatrooms/" + room.name);
				UserService.addRoom(room);

				ChatResource.getRoomUsers(room.name);
				ChatResource.on("roomUserlist", function (data,err){
				if(data){
					$scope.joinedRoom.users = data;
				}else {
					console.log("ERROR: " + err);
				}
			});
			} else {
				console.log("ERROR: Error while trying to join room.");s
			}
		});
	};

	$scope.leaveRoom = function () {
		var roomName = $routeParams.name;
		ChatResource.leaveRoom(roomName);
		$location.path("/chatrooms");
		UserService.leaveRoom();
	};
});