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
					room: i, // lets just have both to be sure..
					topic: roomlist[i].topic,
					users: roomlist[i].users,
					ops: roomlist[i].ops
				};

				temp.push(currRoom);
			}
			$scope.rooms = temp;
			$scope.selectedRoom	 = $scope.rooms[0]; // Lobby selected by default
		} else {
			console.log("ERROR: Error fetching rooms");
		}
	});

	ChatResource.on("updatechat", function(data,err) {
		// A new room has been added, lets get the roomlist again
		ChatResource.getRoomList();
	});

	ChatResource.on("updateusers", function(data,err){
		var roomUserIsIn = UserService.getUserRoom();
		if(!UserService.getOnlineStatus() || roomUserIsIn === null) {
			return;
		} 

		else if(roomUserIsIn.name === data){
			ChatResource.getRoomUsers(data.toString());
			ChatResource.on("roomUserlist", function (data,err){
				if(data){
					console.log("in update users on chat controller..");
					$scope.joinedRoom.users = data;
				}else {
					console.log("ERROR: " + err);
				}
			});
		}
	});

	$scope.join = function() {
		var room = $scope.selectedRoom;
		if($scope.newRoomName !== undefined){
			var roomObj = {
				room: $scope.newRoomName,
				name: $scope.newRoomName
			};
		}
		else{
		var roomObj = {
			room: $scope.selectedRoom,
			name: $scope.selectedRoom
		};}

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