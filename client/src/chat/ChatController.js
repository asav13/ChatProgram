"use strict";

angular.module('chatApp').controller('ChatController', 
function ChatController($scope, $location, ChatResource){

	$scope.online = true; // WHY do we need to do this?! I though it should stay between pages..

	ChatResource.getRoomList();
				ChatResource.on("roomlist", function (roomList) {
					if(roomList){
						var aRoom = {
							name: "Iceland30+",
							topic: "A topic"
						}
						$scope.rooms = [roomList];
						$scope.rooms[0].name = "Lobby"; // this is a skitamix.....how do I get the name ?!
						console.log($scope.rooms)
						$scope.rooms[$scope.rooms.length] = aRoom;
						$scope.selectedRoom = "Lobby";
					} else {
						console.log("ERROR: Error fetching rooms");
					}
				});
});