
var EnemyController = (function(){
	/* Description
	*/

	var type_logic_table;
	
	var init = function(){
		/* is ran from the InitController once when the game is loaded */

		include(); // satisfy requirements

		type_logic_table = {
			"ant": AntLogic,
			"hero": HeroLogic,
		};

		var imports = {RegisterAsController: RegisterAsController,
			PhysicsController: PhysicsController,
			IdentificationController: IdentificationController,
			KeyboardController: KeyboardController,
			B2d: B2d
		};

		for(type in type_logic_table){
			var logic = type_logic_table[type];
			logic.init(imports);

			if(logic.begin_contact){
				PhysicsController.listen_for_contact_with(type, "BeginContact", logic.begin_contact);
				console.log(logic);
			}

			if(logic.end_contact){
				PhysicsController.listen_for_contact_with(type, "EndContact", logic.end_contact);
			}

			if(logic.pre_solve){
				PhysicsController.listen_for_contact_with(type, "PreSolve", logic.pre_solve);
			}

			if(logic.post_solve){
				PhysicsController.listen_for_contact_with(type, "PostSolve", logic.post_solve);
			}

		}

		spawn(10, 10, "hero");
	};

	var spawn = function(x, y, type){
		/**
		* spawn entity of the given type at the given coordinates
		* also registeres thing as awaiting graphics initialization
		*/
		var logic = type_logic_table[type];

		if(logic){
			var new_entity = logic.spawn(x, y);
			RegisterAsController.register_as("awaiting_graphics_initialization", new_entity)
			var logic_upd_list = EnemyModel.for_logic_update[type];
			if(logic_upd_list){
				logic_upd_list.push(new_entity);
			}else{
				EnemyModel.for_logic_update[type] = [new_entity]
			}
		}else{
			throw "Logic for the type " + type + " is not defined";
		}
		

	};
	

	var update = function(delta){
		/* is ran each tick from the GameController.update_all */
		var debug_commands = KeyboardController.debug_commands();

		// demonstration purposes
		if(debug_commands("spawn_ant")){
			var new_ant = spawn(Math.random()*50 + 10, 10, "ant");
		}

		for(var type in EnemyModel.for_logic_update){
			var list = EnemyModel.for_logic_update[type];

			var logic = type_logic_table[type];
			for(var i = 0; i < list.length; i++){
				logic.tick_AI(list[i]);
			}
		} // end for in 

	};

	return {
		// declare public
		init: init, 
		update: update,

	};
})();

module.exports = EnemyController;

var Includes = require("../Includes.js"); var include_data = Includes.get_include_data({
	current_module: "EnemyController", 
	include_options: Includes.choices.DEFAULT | Includes.choices.LOGIC
}); eval(include_data.name_statements); var include = function(){eval(include_data.module_statements);}

