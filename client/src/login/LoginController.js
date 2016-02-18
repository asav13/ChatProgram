"use strict";

angular.module('chatApp').controller('LoginController', 
function LoginController($scope, $location, ChatResource, UserService){

	$scope.logininfo = "";
	$scope.online = UserService.getOnlineStatus();
	console.log("DEB: scope online in login controller is " + $scope.online);
	$scope.rooms = [];

	$scope.login = function() {
		UserService.login($scope.username);

		ChatResource.login($scope.username).then(function (available){
			if(available) {
				$scope.logininfo = "Welcome " + $scope.username + "!";
				$scope.online = true;
				// And redirect to the chat area
				$location.path('/chatrooms');
			} else{ 
				$scope.logininfo = "Username " + "'" + $scope.username + "' " + "not available.";
			}
		});
	};

	$scope.logout = function() {
		UserService.logout();
		$scope.online = false;
		$location.path('/#'); // redirect
		ChatResource.logout();
		/*{
			console.log("DEB: After logout in login controller");
			console.log(data);
		});*/
		//TODO logout server side
	};
});
