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
	.otherwise({
		redirectTo: "src/home/home.html" 
	});
});
