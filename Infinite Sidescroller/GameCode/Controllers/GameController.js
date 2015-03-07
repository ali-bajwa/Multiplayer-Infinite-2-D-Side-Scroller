var CameraController, PlayerController, KeyboardController, WorldController, GraphicsController;
var GameModel;

CameraController = require("./CameraController.js");
PlayerController = require("./PlayerController.js");
KeyboardController = require("./KeyboardController.js");
WorldController = require("./WorldController.js");
GraphicsController = require("./GraphicsController.js");

GameModel = require("../Models/GameModel.js");

var GameController = (function(){

	var MOVEMENT_EDGE = 500; // where terrain start scrolling

	var update_all = function(event){
		/*
		 * main function pretty much
		 * everyghing else is called from here every tick
		 */
		
		var delta = event.delta;

		// !!!! world simulation step goes somewhere right here
		// as per current design, will take delta as an argument

		var cmds = KeyboardController.movement_commands();

		// Separate function >>>
		if(cmds("right")){
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

		if(cmds("up")){
			PlayerController.jump();
		}


		if(cmds("left")){
			if(GameModel.hero.x > 10){
				PlayerController.move_left(GameModel.hero);
			}
		}

		// <<<

		//TerrainController.generate_terrain(); 
		
		WorldController.update(delta);

		GraphicsController.update();
		
		// Should be called after all movement of objects is done:
		CameraController.update(); // should be moved to Graphics Model/Controller

		GameModel.stage.update(); // should be moved to Graphics Model/Controller
	};



	

	return {
		update_all: update_all,
	};

})();

module.exports = GameController;
