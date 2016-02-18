"use strict";

angular.module('chatApp').controller('HomeController', 
function HomeController($scope, $location, ChatResource, UserService){

	$scope.online = UserService.getOnlineStatus();
	console.log("DEB: Some1 online: " + $scope.online);
	$scope.users = [];

	ChatResource.getUsers();
	ChatResource.on("userlist", function (userlist) {
		if(userlist){
			$scope.users = userlist;
		} else {
			console.log("ERROR: Error fetching users.");
		}
	});


});

