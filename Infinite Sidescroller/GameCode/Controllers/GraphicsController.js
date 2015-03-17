
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
		hero = GraphicsModel.hero;

		set_reg_position(hero, -20, +10);

		GraphicsModel.hero.x = 100;
		GraphicsModel.hero.y = 510;

		
		GraphicsModel.stage.addChild(GraphicsModel.hero);

	};

	var update = function(delta){
		/* is ran each tick from the GameController.update_all */
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
						var body_position = slice.grid[i][j].body.GetWorldCenter();
						tile.x = body_position.x * 30;
						tile.y = body_position.y * 30;
						AddToStage(tile);
					} // fi


				} // end for

			}//end for

		} // end while

		// temporary, synchronization should be made automatic somehow:
		var hero_position = scale_xy(PlayerController.get_hero_position());
		var hero = GraphicsModel.hero;
		hero.x = hero_position.x;
		hero.y = hero_position.y;
		


		GraphicsModel.stage.update();
	};

	var scale_xy = function(position_vector_unscaled){
		// takes position vector with values in meters, scales it to pixels	
		return {
			x: position_vector_unscaled.x * Config.B2D.SCALE,
			y: position_vector_unscaled.y * Config.B2D.SCALE,
		};	
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

