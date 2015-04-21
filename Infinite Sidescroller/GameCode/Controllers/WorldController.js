	
var WorldController = (function(){
	/* all the physics control of the whole world
	*/
    var movement_edge;
    var spawn_enemy;
    var difficulty;
	var season;
	var movement_edge_buffer;
	var body_test;
	//var temp = 0;

	var init = function(){
		/* is ran from the InitController once when the game is loaded */

		include(); // satisfy requirements
		movement_edge_buffer = 20;
		movement_edge = 0;
		season = 0;
		//body_test = new platform();
		//var id = IdentificationController.assign_id(body_test);
		//var body_test = PhysicsController.get_rectangular({}, body_test);

	};

	var update = function(delta){
		/* is ran each tick from the GameController.update_all */
		PhysicsController.step(delta);
		update_movement_edge();
		get_spawn();
		//if(temp++ == 0){
			//TerrainController.NewTerrainSlice();
		//}

	};
	
	var update_movement_edge = function(){
		var hero_x = IdentificationController.get_hero().body.GetWorldCenter().x;
		if(movement_edge < hero_x - movement_edge_buffer){
			movement_edge = hero_x - movement_edge_buffer;
		}
	};
	
	var get_movement_edge = function(){
		return movement_edge;
	}

	var get_spawn = function () {
	    difficulty = Math.floor(get_movement_edge() / 100);

	    var spawn_num;
	    if (spawn_enemy) {
	        spawn_num = Math.floor(Math.random() * 1000);
	        for (i = 0; i < Math.floor(Math.random() * 4) ; i++) {
	            // demonstration purposes for hyena
	            if (spawn_num <= 5 * difficulty) {
	                var new_hyena = EntityController.spawn(60 + get_movement_edge(), 10, "Hyena");
	            }
	            /*    // demonstration purposes for griffin
	            else if (spawn_num <= 15 * EntityModel.difficulty && Count > 5) {
	                var new_griffin = spawn(60 + WorldController.get_movement_edge() + i, -20, "Griffin");
	                Count = 0;
	            }*/
	            else if (spawn_num <= 15 * difficulty) {
	                var new_griffin = EntityController.spawn(60 + get_movement_edge(), 10, "Griffin");
	            }
	                // demonstration purposes for ant
	            else {
	                var new_ant = EntityController.spawn(get_movement_edge() + 60, 10, "ant");
	            }
	        }
	        spawn_enemy = false;
	    }
	    return spawn_num;
	}

	var set_spawn = function () {
	    spawn_enemy = true;
	}
	
	var get_season = function(){
		return season;
	}
	
	var set_season = function(index){
		season = index;
	}
	
	var MarkAsNewTerrainSlice = function(slice){
		
	};

	return {
		// declare public
		init: init, 
		update: update,
		get_movement_edge: get_movement_edge,
		get_season: get_season,
		set_season: set_season,
		get_spawn: get_spawn,
		set_spawn: set_spawn,
	};
})();

module.exports = WorldController;

var Includes = require("../Includes.js"); var include_data = Includes.get_include_data({
	current_module: "WorldController", 
	include_options: Includes.choices.DEFAULT
}); eval(include_data.name_statements); var include = function(){eval(include_data.module_statements);}

