
var GraphicsController = (function(){
	/* all the graphics stuff. and what did you expect?
	*/

	var init = function(){
		/* is ran from the InitController once when the game is loaded */

		include(); // satisfy requirements

		GraphicsModel.stage = new createjs.Stage(Config.MAIN_CANVAS_NAME);
		GraphicsModel.stage.canvas.width = Config.SCREEN_W;
		GraphicsModel.stage.canvas.height = Config.SCREEN_H;

		GraphicsModel.hero = AssetController.request_bitmap("greek_warrior");
		GraphicsModel.hero.regX = 0;
		GraphicsModel.hero.regY = GraphicsModel.hero.image.height;
		GraphicsModel.hero.x = 100;
		GraphicsModel.hero.y = 510;

		// temporary/testing, do not try to understand numbers involved. I repeat, do not try to understand numbers;
		GraphicsModel.hero.b2b = PhysicsController.get_rectangular_body(1.5, 2.5, 100/30 + (1.5/2), 510/30 - (2.5/2), true);

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


		GraphicsModel.stage.update();
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

