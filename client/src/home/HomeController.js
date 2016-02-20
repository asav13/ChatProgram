"use strict";

angular.module('chatApp').controller('HomeController', 
function HomeController($scope, $location, ChatResource, UserService, $parse){

	$scope.online = UserService.getOnlineStatus();
	$scope.rooms = [];
	$scope.users = [];

	ChatResource.getRoomList();
	ChatResource.on("roomlist", function (roomlist) {
		if(roomlist){
			var rooms = [];
			for(var i in roomlist){
				var allUsers = [];
				var availableRooms = {
					name: i,
					users: "",
				};
				for(var j in roomlist[i].users){
					allUsers.push(roomlist[i].users[j]);
					console.log(allUsers);
				}
				var usersToString = allUsers.toString();
				availableRooms.users = usersToString;
				rooms.push(availableRooms);
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

