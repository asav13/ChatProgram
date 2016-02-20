"use strict";

angular.module('chatApp').controller('HomeController', 
function HomeController($scope, $location, ChatResource, UserService){

	$scope.online = UserService.getOnlineStatus();
	$scope.rooms = [];
	$scope.users = [];

	ChatResource.getRoomList();
	ChatResource.on("roomlist", function (roomlist) {
		if(roomlist){
			var rooms = [];
			for(var i in roomlist){
				/*var availableRooms = {
					name: i,
					users: roomlist[i].users,
				};*/

				var roomName = i;
				var roomUsers = roomlist[i].users;
				console.log(roomUsers);
				var availableRooms = {
					name: roomName,
					users: ""
				};
				for(var u in roomlist[i].users){
					availableRooms.users = availableRooms.user + " , " + roomlist[i].users[u];
				}
				rooms.push(availableRooms);
			}
			$scope.rooms = rooms;
			console.log("$scope.rooms");
			console.log($scope.rooms);
		} else {
			console.log("ERROR: Error fetching rooms.");
		}
	});

	ChatResource.getUsers();
	ChatResource.on("userlist", function (userlist) {
		if(userlist){
			$scope.users = userlist;
		} else {
			console.log("ERROR: Error fetching users.");
		}
	});
	
});

