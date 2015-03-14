
var GraphicsController = (function(){
	/* all the graphics stuff. and what did you expect?
	*/

	var init = function(){
		/* is ran from the InitController once when the game is loaded */

		include(); // satisfy requirements

	};

	var update = function(delta){
		/* is ran each tick from the GameController.update_all */

	};

	

	return {
		// declare public
		init: init, 
		update: update
	};
})();

module.exports = GraphicsController;

var Include = require("../Includes.js");
var this_module_name = "GraphicsController";
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

