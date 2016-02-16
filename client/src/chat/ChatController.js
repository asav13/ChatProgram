"use strict";

angular.module('chatApp').controller('ChatController', 
function ChatController($scope, $rootScope, $location, ChatResource){

	$scope.online = true; // WHY do we need to do this?! I though it should stay between pages..
	ChatResource.getRoomList();

	// When we get an "roomlist" event, we update the roomlist
	ChatResource.on("roomlist", function (roomlist) {
		console.log(roomlist);
		if(roomlist){
			var temp = [];
			for(var i in roomlist){
				var currRoom = {
					name: i,
					topic: roomlist[i].topic,
					users: roomlist[i].users,
					ops: roomlist[i].ops
				};
				temp.push(currRoom);
			}
			$scope.rooms = temp;
			$scope.selectedRoom	 = $scope.rooms[0];
		} else {
			console.log("ERROR: Error fetching rooms");
		}
	});

	ChatResource.on("updatechat", function(data,err) {
		// When we get an "update chat" event, we update the roomlist
		// update users inside the room etc
		ChatResource.getRoomList();
	});	

	$scope.createRoom = function() {
		var newRoom = {
			room: $scope.newRoomName,
			topic: "lala"
		};

		ChatResource.createRoom(newRoom).then(function(success, err){
			if(success){
				var leRoom = {room: $scope.newRoomName, topic: "updated topic..."};
				ChatResource.setTopic(leRoom, function(success, err){
					console.log("DEB: success in chat controller after set topic");
					console.log(success);
				});

			} else {
				console.log("ERROR: " + err);
			}
		});
	};

	$scope.join = function(r) {
		var room = $scope.selectedRoom;
		$rootScope.joinedRoom = room;
	
		$location.path("/chatrooms/" + room.name);
		
	};
});