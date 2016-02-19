angular.module("chatApp", ["ngRoute", "ui.bootstrap"]).config(function($routeProvider){
	$routeProvider
	.when("/", {
		templateUrl: "src/home/home.html",
		controller: "HomeController"
	})	
	.when("/login", {
		templateUrl: "src/login/login.html",
		controller: "LoginController"
	})
	.when("/chatrooms", {
		templateUrl: "src/chat/chatstartup.html",
		controller: "ChatController"
	})
	.when("/chatrooms/:name", {
		templateUrl: "src/chat/chatrooms.html",
		controller: "ChatRoomController"
	})
	.otherwise({
		templateUrl: "src/home/home.html" 
	});
});
