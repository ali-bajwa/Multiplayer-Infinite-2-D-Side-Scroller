
var EnemyController = (function(){
	/* Description
	*/

	var init = function(){
		/* is ran from the InitController once when the game is loaded */

		include(); // satisfy requirements
		AntAI.spawn(10, 10, IdentificationController, PhysicsController, EnemyModel);
	};

	var update = function(delta){
		/* is ran each tick from the GameController.update_all */
		var debug_commands = KeyboardController.debug_commands();

		if(debug_commands("spawn_ant")){
			AntAI.spawn(Math.random()*50 + 10, 10, IdentificationController, PhysicsController, EnemyModel);
		}

		for(var id in EnemyModel.ants){
			var ant = EnemyModel.ants[id];
			if(ant){
				AntAI.tick_AI(ant);
			}// fi
		} // end for in 

	};

	var get_new_ants = function() {
		// TODO: change this terrible thing to 
		// marking all new ants for update
		// through new shiny mark for whatever controller
		// (not implemented yet)
		var result = [];
		var ants = EnemyModel.new_ants;
		for(var prop in ants){
			if(ants[prop] != null){
				result.push(ants[prop].body);
				ants[prop] = null;
			}

		}
		return result;
	};

	return {
		// declare public
		init: init, 
		update: update,
		get_new_ants: get_new_ants,

	};
})();

module.exports = EnemyController;

var Includes = require("../Includes.js"); var include_data = Includes.get_include_data({
	current_module: "EnemyController", 
	include_options: Includes.choices.DEFAULT | Includes.choices.AI
}); eval(include_data.name_statements); var include = function(){eval(include_data.module_statements);}

