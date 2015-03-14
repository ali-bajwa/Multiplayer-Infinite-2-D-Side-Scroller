	
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

var Includes = require("../Includes.js"); var include_data = Includes.get_include_data({
	current_module: "WorldController", 
	include_options: Includes.choices.DEFAULT
}); eval(include_data.name_statements); var include = function(){eval(include_data.module_statements);}

