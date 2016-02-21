"use strict";

angular.module('chatApp').controller('HomeController', 
function HomeController($scope, $location, ChatResource, UserService, $rootScope){

	$scope.online = UserService.getOnlineStatus();
	$scope.rooms = [];
	$scope.users = [];

	ChatResource.getRoomList();
	ChatResource.on("roomlist", function (roomlist) {
		if(roomlist){
			var rooms = [];
			var count = 0;
			for(var i in roomlist){
				count++;
				var allUsers = [];
				var availableRooms = {
					name: i,
					users: "",
				};
				//beginning of voodoo for getting a string out of this
				for(var j in roomlist[i].users) {
						allUsers.push(roomlist[i].users[j]);
				}
				//if the roomlist[i].users object is not empty, we stringify the array
				if(!angular.equals({}, roomlist[i].users)) 	{
					availableRooms.users = allUsers.toString();
				} else {
					availableRooms.users = "Nobody here!";
				}
				if(count > 6) {
					$rootScope.showDiv = true;
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

