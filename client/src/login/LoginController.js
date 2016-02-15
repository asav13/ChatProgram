"use strict";

angular.module('chatApp').controller('LoginController', 
function LoginController($scope, ChatResource){

	$scope.logininfo = "Please pick a username.";
	$scope.online = false;
	$scope.rooms = [];

	$scope.login = function() {
		console.log("DEB: Inside login() function");
		ChatResource.login($scope.username, function (available) {
			if(available) {
				$scope.logininfo = "Welcome " + $scope.username + "!";
				$scope.online = true;

				ChatResource.getRoomList();
				ChatResource.on("roomlist", function (roomList) {
					if(roomList){
						$scope.rooms = roomList;
						$scope.rooms[$scope.rooms.length] = {topic: 'Or create a new room'};
					} else {
						console.log("ERROR: Error fetching rooms");
					}
				});

			} else{ 
				$scope.logininfo = "Username " + "'" + $scope.username + "' " + "not available.";
			}
		});
	};
});
