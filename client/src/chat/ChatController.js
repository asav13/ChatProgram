"use strict";

angular.module('chatApp').controller('ChatController', 
function ChatController($scope, $rootScope, $location, ChatResource, UserService){

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
		console.log("data"); console.log(data);
		console.log("err");  console.log(err);

		var roomsUserIsIn = UserService.getUserRooms();
		console.log("Rooms user is in");
		console.log(roomsUserIsIn);
		for(var i in roomsUserIsIn){
			console.log(i.name);
		}
		console.log("Data er " + data.toString());
		if(roomsUserIsIn.find(x => x.name == data.toString()) !== undefined){
			console.log("in if");
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
		console.log("new room name in create");
		console.log($scope.newRoomName);
		var newRoom = {
			room: $scope.newRoomName,
			topic: "lala",
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
		console.log("selected room in join");
		console.log(room);
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
});