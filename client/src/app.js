angular.modul("chatApp", ["ui-bootstrap"])
.config( function ($routerProvider) { // From chat session 5b
	// hashtag means the user is always on the same page, cuz this is a single pag app
	$routeProvider
	.when("/", {
		templateUrl: "src/login/login.html",
		controller: "LoginController"
	}); 
});
