var CameraController, PlayerController, KeyboardController;
var GameModel;

CameraController = require("./CameraController.js");
PlayerController = require("./PlayerController.js");
KeyboardController = require("./KeyboardController.js");

GameModel = require("../Models/GameModel.js");

var GameController = (function(){

	var MOVEMENT_EDGE = 500; // where terrain start scrolling

	var update_all = function(event){
		/*
		 * main function pretty much
		 * everyghing else is called from here every tick
		 */
		
		var delta = event.delta;

		var cmds = KeyboardController.movement_commands();

		// Separate function >>>
		if(cmds.indexOf("right") > -1){
			// temporary

			if(GameModel.hero.x > MOVEMENT_EDGE){
				PlayerController.move_right(GameModel.hero);
				CameraController.move(10, 0);
				//TerrainController.move_left(10);
				//CameraController.follow(GameModel.hero);
			}else{
				//CameraController.unfollow();
				PlayerController.move_right(GameModel.hero);
			}
		}


		if(cmds.indexOf("left") > -1){
			if(GameModel.hero.x > 10){
				PlayerController.move_left(GameModel.hero);
			}
		}

		// <<<

		//TerrainController.generate_terrain(); 
		
		// Should be called after all movement of objects is done:
		CameraController.update(); 

		GameModel.stage.update();
	};



	

	return {
		update_all: update_all,
	};

})();

module.exports = GameController;
