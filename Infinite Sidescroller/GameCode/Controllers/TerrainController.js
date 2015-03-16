
var TerrainController = (function(){
	/* this will be the physical representation of the terrain
	 * currently it contains graphical bits, but that will change
	 */

	var init = function(){
		include();
	};
	

	var update = function(){
		// check for any chunks to be unloaded/deleted will go here, for now
		// maybe it'll check for all players to be sufficiently far to the right
		// of it, maybe one chunk in advance, or smth like that
		while(TerrainModel.terrain_slices_queue.length < 4){
			var slice = NewTerrainSlice();
			TerrainModel.terrain_slices_queue.push(slice);
		};
	};


	var NewTerrainSlice = function(){
		/* this takes care of appending new terrain slice to the generated terrain
		 * it calculates it's origin x and y positions and whatever other stuff,
		 * generates slice; sets up everything
		 */

		var slice = TerrainSliceController.generate();
		MarkAsNewTerrainSlice(slice); // so that graphics and other stuff will notice

		return slice;

	};

	var retrieve_world_parameters = function(){};
	
	var for_each_tile = function(f){
		// takes function >f< that takes three parameters: tile (eseljs object),
		// terrain_lvl (int), and tile_index (int)
		// calls this function for every tile of the terrain
		
		var queues = TerrainModel.terrain_queues;

		$.each(queues, function(terrain_lvl){
			$.each(queues[terrain_lvl], function(tile_index){
				f(queues[terrain_lvl][tile_index], terrain_lvl, tile_index);
			});
		});

	};

	var move_left = function(pixels){
		// Should I scrap this function and just use >move<, or is this a helpful shortcut?
		
		move((-1)*pixels, 0);

	}; // end move_left
	
	var move = function(offset_x, offset_y){
		if(offset_x != 0){
			for_each_tile(function(tile, terrain_lvl, tile_index){
				tile.x += offset_x;
			});

		}// fi

		if(offset_y != 0){
			for_each_tile(function(tile, terrain_lvl, tile_index){
				tile.y += offset_y;
			});

		}

	};

	var MarkAsNewTerrainSlice = function(slice){
		TerrainModel.new_slices.push(slice);
	};

	var NewSlicesAvailable = function(){
		return (TerrainModel.new_slices.length > 0);
	};

	var GetNewTerrainSlices = function(){
		return TerrainModel.new_slices;
	};

	return {
		move_left: move_left,
		move: move,
		update: update,
		init: init,
		NewTerrainSlice: NewTerrainSlice,
		MarkAsNewTerrainSlice: MarkAsNewTerrainSlice,
		NewSlicesAvailable: NewSlicesAvailable,
		GetNewTerrainSlices: GetNewTerrainSlices,
	}
})();

module.exports = TerrainController;

var Includes = require("../Includes.js"); var include_data = Includes.get_include_data({
	current_module: "TerrainController", 
	include_options: Includes.choices.DEFAULT
}); eval(include_data.name_statements); var include = function(){eval(include_data.module_statements);}

