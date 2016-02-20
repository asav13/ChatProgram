"use strict";

angular.module('chatApp').controller('HomeController', 
function HomeController($scope, $location, ChatResource, UserService){

	$scope.online = UserService.getOnlineStatus();
	$scope.rooms = [];
	$scope.users = [];

	ChatResource.getRoomList();
	ChatResource.on("roomlist", function (roomlist) {
		if(roomlist){

			/*------------------------
			var roomName = [];
			for(var i in roomlist){
				roomName.push(i);
			}
			console.log("NAME: " + roomName);
			$scope.rooms = roomName;
			------------------------*/
			var rooms = [];
			for(var i in roomlist){
				var createdRooms = {
					name: i,
					users: roomlist[i].users,
				};
				rooms.push(createdRooms);
				console.log("ROOM NAME: " + rooms.name);
				console.log("USERS: " + rooms.users);
				ChatResource.getRoomUsers(i);
				ChatResource.on("roomUserlist", function (data,err){
				if(data){
					console.log("DEB: roomUserList data: ")
					console.log(data);
					$scope.rooms.users = data;
				} else {
					console.log("ERROR: " + err);
				}
			});
			}
			$scope.rooms = rooms;
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

