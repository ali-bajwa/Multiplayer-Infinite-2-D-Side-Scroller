	
var WorldController = (function(){
	/* all the physics control of the whole world
	*/

	var body_test;
	var temp = 0;

	var init = function(){
		/* is ran from the InitController once when the game is loaded */

		include(); // satisfy requirements

		body_test = PhysicsController.get_rectangular_body(1.3, 2.5, 10, 3.3, true);
	};

	var update = function(delta){
		/* is ran each tick from the GameController.update_all */
		PhysicsController.step(delta);

		if(temp++ == 0){
			TerrainController.NewTerrainSlice();
		}

	};

	var MarkAsNewTerrainSlice = function(slice){
		
	};

	return {
		// declare public
		init: init, 
		update: update,
	};
})();

module.exports = WorldController;

var Include = require("../Includes.js");
var this_module_name = "WorldController";
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

