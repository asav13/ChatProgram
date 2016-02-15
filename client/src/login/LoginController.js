"use strict";

angular.module('chatApp').controller('LoginController', 
function LoginController($scope, $location, ChatResource){

	$scope.logininfo = "Please pick a username.";
	$scope.online = false;
	$scope.rooms = [];

	$scope.login = function() {
		ChatResource.login($scope.username).then(function (available){
			if(available) {
				$scope.logininfo = "Welcome " + $scope.username + "!";
				$scope.online = true;
				// And redirect to the chat area
				$location.path('/chat');
			} else{ 
				$scope.logininfo = "Username " + "'" + $scope.username + "' " + "not available.";
			}
		});
	};
});
