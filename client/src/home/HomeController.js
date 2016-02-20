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
				console.log(roomlist[i].users);
				for(var j in roomlist[i].users) {
						allUsers.push(roomlist[i].users[j]);
				}
				//if the roomlist[i].users object is not empty, we stringify the array
				if(!angular.equals({}, roomlist[i].users)) 	{
					availableRooms.users = allUsers.toString();
				} else {
					console.log("No Users!");
					availableRooms.users = "Nobody here!";
				}
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

