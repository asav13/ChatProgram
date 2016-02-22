"use strict";

angular.module('chatApp').controller('LoginController', 
function LoginController($scope, $location, ChatResource, UserService){

	$scope.logininfo 	= "";
	$scope.online 		= UserService.getOnlineStatus();
	$scope.rooms 		= [];

	$scope.login = function () {
		ChatResource.login($scope.username).then(function (available){
			if(available) {
				UserService.login($scope.username);

				$scope.logininfo 	= "Welcome " + $scope.username + "!";
				$scope.online 		= true;
				$location.path('/chatrooms');
			} else{  
				$scope.logininfo = "Username " + "'" + $scope.username + "' " + "not available.";
			}
		});
	};

	$scope.logout = function() {
		UserService.logout();
		ChatResource.logout();

		$scope.online 	= false;
		$location.path('/'); // redirect
	};
});
