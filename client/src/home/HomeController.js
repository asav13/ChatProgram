"use strict";

angular.module('chatApp').controller('HomeController', 
function HomeController($scope, ChatResource){

	$scope.users = [];

	ChatResource.getUsers();
	ChatResource.on("userlist", function (userlist) {
		console.log("DEB: Userlist: " + userlist);
		if(userlist){
			$scope.users = userlist;
		} else {
			console.log("ERROR: Error fetching users.");
		}
	});
});