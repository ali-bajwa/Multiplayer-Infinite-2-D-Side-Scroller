	
var WorldController = (function(){
	/* all the physics control of the whole world
	*/
	var movement_edge;
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
	};
})();

module.exports = WorldController;

var Includes = require("../Includes.js"); var include_data = Includes.get_include_data({
	current_module: "WorldController", 
	include_options: Includes.choices.DEFAULT
}); eval(include_data.name_statements); var include = function(){eval(include_data.module_statements);}

