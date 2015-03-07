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


		PlayerController.update();
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
