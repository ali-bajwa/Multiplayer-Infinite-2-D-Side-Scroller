

var GameController = (function(){

	var init = function(){
		include();
	};
		

	var update_all = function(event){
		/*
		 * main function pretty much
		 * everyghing else is called from here every tick
		 */
		
		CameraController = require("./CameraController.js");

		var delta = event.delta;

		// !!!! world simulation step goes somewhere right here
		// as per current design, will take delta as an argument
		
		//TerrainController.generate_terrain(); 
		PlayerController.update();
		
		WorldController.update(delta);

		TerrainController.update();

		GraphicsController.update();
		
		// Should be called after all movement of objects is done:
		CameraController.update(); // should be moved to Graphics Model/Controller

		GameModel.stage.update(); // should be moved to Graphics Model/Controller
	};

	var AddToStage = function(element){
		// improve to allow specifying order (z-index) etc.?	
		GameModel.stage.addChild(element);		
	};
	


	return {
		init: init,
		update_all: update_all,
		AddToStage: AddToStage,
	};

})();

module.exports = GameController;

var Includes = require("../Includes.js"); var include_data = Includes.get_include_data({
	current_module: "GameController", 
	include_options: Includes.choices.DEFAULT
}); eval(include_data.name_statements); var include = function(){eval(include_data.module_statements);}

