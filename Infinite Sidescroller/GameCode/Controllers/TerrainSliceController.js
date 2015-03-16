
var TerrainSliceController = (function () {

	var init = function(){
		/* is ran from the InitController once when the game is loaded */

		include(); // satisfy requirements

	};

	var update = function(slice){
		

	};

	var get_next_origin = function(){
	};

	var generate = function(){

		var slice = new TerrainSliceModel();
		slice.origin.x = slice.id * slice.grid_columns * slice.cell_w;
		slice.origin.y = 0;

		for(var i = 0; i < slice.grid_rows; i++){
			/* 	assigning id's
				that is the first pass. later it may be used to layout general form of the terrain
			   	assigning each cell in the grid some role, marked by its id.
			 	that role may include for it to be a piece of the bigger object >>>
			*/

			slice.grid[i] = [];
			var lvl = slice.grid_rows - i; // level from the bottom
			var prob = slice.lvl_prob[lvl];

			for(var j = 0; j < slice.grid_columns; j++){
				if(prob){
					var random_id = GameUtility.random_choice(prob, [1, 2, 3]); // chose random terrain tile id
					// the tile in the grid might be made to be separate object later
					// the tile_id will determine the type of object in that tile,
					// such as type of terrain etc. the tiles with different id's do not
					// necessarily differ in physics representation, they might just have
					// different appearance
					slice.grid[i][j] = {id: random_id};

				}else{
					// 0 will be the id for the "air" i.e. nothing
					slice.grid[i][j] = {id: 0};
				}
			} // for end
			// <<< assigning ids
			
		} // for end


		for(var i = 0; i < slice.grid_rows; i++){
			/*	creating physics representations
			 *	2nd pass; this will be used to create all the objects and such
			 *	physics-wise. It may examine id's of the adjacent tiles to find
			 *	larger pieces of terrain to unite under the common bounding box
			 *	if they have similar enough properties or belong together for some reason
			 */

			var lvl = slice.grid_rows - i; // level from the bottom

			for(var j = 0; j < slice.grid_columns; j++){
				var id = slice.grid[i][j].id;
				if(id != 0){ // if not air
					var x = slice.origin.x + j * slice.cell_w + slice.cell_w/2;
					var y = slice.origin.y + i * slice.cell_w + slice.cell_w/2;
					var body = PhysicsController.get_rectangular_body(1, 1, x, y, false);
					slice.grid[i][j].body = body;
				}

			} // end for

		}//end for
		// <<< creating physics representations
		
		
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
					GameController.AddToStage(tile);
				} // fi


			} // end for

		}//end for
		// <<< graphics pass
		
		return slice;
	};

	return {
		// declare public
		init: init, 
		update: update,
		generate: generate,
	};
})();

module.exports = TerrainSliceController;

var Includes = require("../Includes.js"); var include_data = Includes.get_include_data({
	current_module: "TerrainSliceController", 
	include_options: Includes.choices.DEFAULT
}); eval(include_data.name_statements); var include = function(){eval(include_data.module_statements);}

