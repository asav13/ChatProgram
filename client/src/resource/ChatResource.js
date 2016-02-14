"use strict";

angular.module("chatApp").factory("ChatResource",
function ChatResource() {
	return {
		login: function login(user, password, callback) {
			Console.log("DEB: Inside chat resource login");
			//TODO
		},

		getRoomList: function getRoomList(callback) {
			Console.log("DEB: Inside chat resource getRoomList");
			// TODO
		}
	};
});