
var GraphicsController = (function(){
	/* all the graphics stuff. and what did you expect?
	*/

	var hero; // for quicker access

	var init = function(){
		/* is ran from the InitController once when the game is loaded */

		include(); // satisfy requirements


		GraphicsModel.stage = new createjs.Stage(Config.MAIN_CANVAS_NAME);
		GraphicsModel.stage.canvas.width = Config.SCREEN_W;
		GraphicsModel.stage.canvas.height = Config.SCREEN_H;

		GraphicsModel.hero = AssetController.request_bitmap("greek_warrior");
		GraphicsModel.ant = AssetController.request_bitmap("AntWalk");
		hero = GraphicsModel.hero;
		ant = GraphicsModel.ant;
		
		set_reg_position(hero, -20, +10);
		
		set_reg_position(ant, 0, 0);

		GraphicsModel.hero.x = 100;
		GraphicsModel.hero.y = 510;
		
		GraphicsModel.ant.x = 600;
		GraphicsModel.ant.y = 510;

		
		reg_for_render(GraphicsModel.hero, PlayerController.get_hero());
		reg_for_render(GraphicsModel.ant, AntController.get_ant());

	};

	var update = function(delta){
		/* is ran each tick from the GameController.update_all */

		check_for_new_terrain();

		synchronize_to_physical_bodies();

		GraphicsModel.stage.update();
	};

	var synchronize_to_physical_bodies = function(){

		var tiles = GraphicsModel.all_physical;

		for(var i = 0; i < tiles.length; i++){
			var tile = tiles[i];
			var body = tile.body;

			var tile_pos = trans_xy(body.GetWorldCenter());

			tile.x = tile_pos.x;
			tile.y = tile_pos.y;
		}

	};
	

	var check_for_new_terrain = function(){
		/* If new terrain has been generated, render it
		 */

		var new_slices = TerrainController.GetNewTerrainSlices();
		while(new_slices.length > 0){

			var slice = new_slices.pop();

			for(var i = 0; i < slice.grid_rows; i++){
				/* graphics pass. should be probably moved to the graphics controller
				 * didn't decide on it yet
				 */


				var lvl = slice.grid_rows - i; // level from the bottom

				for(var j = 0; j < slice.grid_columns; j++){
					var id = slice.grid[i][j].id;
					if(id != 0){
						// TODO: should make proper terrain collection thing to pull from 
						var tile_texture = ["grass", "middle_terrain", "bottom_terrain"][id-1];
						var tile = AssetController.request_bitmap(tile_texture);
						var body = slice.grid[i][j].body;
						var body_position = body.GetWorldCenter();
						var trans_pos = trans_xy(body_position);
						tile.x = trans_pos.x;
						tile.y = trans_pos.y;
						reg_for_render(tile, body);
					} // fi


				} // end for

			}//end for

		} // end while

	}; // end check_for_new_terrain
	

	var trans_xy = function(position_vector_unscaled){
		// takes position vector with values in meters, translates
		// it to pixel position taking the camera position into account
		var camera = GraphicsModel.camera;

		var x = (position_vector_unscaled.x * Config.B2D.SCALE) + camera.offset.x;
		var y = (position_vector_unscaled.y * Config.B2D.SCALE) + camera.offset.y;

		return {x: x, y: y};	
	};

	var set_reg_position = function(easeljs_obj, offset_x, offset_y){
		// sets registration position of the easeljs object
		// regisration position is the relative point of the object
		// that you move when you set object's x and y coordinats
		// i.e. if reg. position of the player is head, and you set their
		// position to (0, 0), their head will be at (0, 0)
		// currently the registration position is set to the middle of the body
		// to match what box2d does
		// last two arguments are optional and set PIXEL offset from the normal registration
		// position
		var w = easeljs_obj.image.width;	
		var h = easeljs_obj.image.height;	

		var offset_x = offset_x || 0;
		var offset_y = offset_y || 0;

		easeljs_obj.regX = w/2 + offset_x;
		easeljs_obj.regY = h/2 + offset_y;

	};

	var reg_for_render = function(easeljs_obj, physical_body){
		// registeres object for rendering within graphics controller
		// if (OPTIONAL!) physical_body is given, graphics controller will automatically
		// set the easeljs_obj's position to position of that body, each tick.
			
		if(physical_body){

			easeljs_obj.body = physical_body;
			GraphicsModel.all_physical.push(easeljs_obj);
		}


		AddToStage(easeljs_obj);
	};

	var AddToStage = function(element){
		// can be updated later to manage z-index or whatever
		GraphicsModel.stage.addChild(element);
	};

	var get_stage = function(){
		return GraphicsModel.stage;
	};

	return {
		// declare public
		init: init, 
		update: update,
		get_stage: get_stage,
	};
})();

module.exports = GraphicsController;

var Includes = require("../Includes.js"); var include_data = Includes.get_include_data({
	current_module: "GraphicsController", 
	include_options: Includes.choices.DEFAULT
}); eval(include_data.name_statements); var include = function(){eval(include_data.module_statements);}

