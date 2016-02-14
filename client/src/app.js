angular.module("chatApp", ["ngRoute"]).config(function($routeProvider){
	$routeProvider
	.when("/login", {
		templateUrl: "src/login/login.html",
		controller: "LoginController"
	})
	.otherwise({
		templateUrl: "index.html",
		controller: "HomeController"
	})
});

angular.module('chatApp').controller('HomeController',function($scope){
	$scope.username = '';

	$scope.login = function(){
		var socket = io.connect('http://localhost:8080');
		
		socket.emit("adduser", $scope.username, function(available){
			$scope.available = available;
			$scope.$apply();
		});
	};
});


