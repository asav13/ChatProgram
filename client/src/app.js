angular.module("chatApp", ["ngRoute"]).config(function($routeProvider){
	$routeProvider
	.when("/", {
		templateUrl: "src/home/home.html",
		controller: "HomeController"
	})	
	.when("/login", {
		templateUrl: "src/login/login.html",
		controller: "LoginController"
	})
	.when("/chat", {
		templateUrl: "src/chat/chat.html",
		controller: "ChatController"
	})
	.otherwise({
		templateUrl: "src/home/home.html" 
	});
});
