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
		if($scope.newRoomName !== undefined){
			var newRoom = {
				room: $scope.newRoomName
			};
			ChatResource.createRoom(newRoom).then(function(success, err){
				if(success){
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

		ChatResource.joinRoom(room).then(function(success,err){
			if(success){
				$rootScope.joinedRoom = room;
				$location.path("/chatrooms/" + room.name);
				UserService.addRoom(room);

				ChatResource.getRoomUsers(room.name);
				ChatResource.on("roomUserlist", function (data,err){
					if(data){
						var theRoom = UserService.getUserRoom();

						for(var j in theRoom.users){
							for(var k in theRoom.ops){
								console.log(k);
								if(j === k){
									j = "@" + j;
									data[k] = j;
								}
							}
						}

						$scope.joinedRoom.users = data;
					}else {
						console.log("ERROR: " + err);
					}
				});
			} else {
				console.log("ERROR: Error while trying to join room.");
			}
		});

	};

});