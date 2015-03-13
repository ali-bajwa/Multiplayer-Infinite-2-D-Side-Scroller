

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


	return {
		init: init,
		update_all: update_all,
	};

})();

module.exports = GameController;

var Include = require("../Includes.js");
var this_module_name = "GameController";
var model_name = this_module_name.replace("Controller", "Model");

eval("var " + model_name + ";");
for(var i = 0; i < Include.names.length; i++){
	eval("var " + Include.names[i] + ";");
};

var include = function(){
	for(var module in Include.modules){
		if(module != this_module_name){
			eval(module + " = " + "Include.modules[module]");
		}
	}
	eval(model_name + " = Include.modules[model_name]");
};

