angular.module("chatApp", ["ngRoute"]).config(function($routeProvider){
	$routeProvider
	.when("/login", {
		templateUrl: "src/login/login.html",
		controller: "LoginController"
	})
});

