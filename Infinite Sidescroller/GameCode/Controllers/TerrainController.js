config = require ("../Config.js");

var TerrainController = (function(){
	/* this will be the physical representation of the terrain
	 * currently it contains graphical bits, but that will change
	 */

	var init = function(){
	    include();
	    TerrainModel.seed = Math.floor(Math.random()*2000) + 1000;//placeholder for seed

	};
	
	
	var update = function(){
		// check for any chunks to be unloaded/deleted will go here, for now
		// maybe it'll check for all players to be sufficiently far to the right
		// of it, maybe one chunk in advance, or smth like that
		//if (config.movement_edge.x > x)
		while(TerrainModel.terrain_slices_queue.length < 4){
			var slice = NewTerrainSlice();
			TerrainModel.terrain_slices_queue.push(slice);
		}

		var cmds = KeyboardController.debug_commands();

		if(cmds("new_slice")){
			
			var slice = NewTerrainSlice();
			TerrainModel.terrain_slices_queue.push(slice);
		}
		

		if(WorldController.get_movement_edge() > (TerrainModel.terrain_slices_queue.length-3)*(20)){
			var slice = NewTerrainSlice(TerrainModel.seed);
			TerrainModel.terrain_slices_queue.push(slice);
			TerrainModel.seed = (((TerrainModel.seed) * (TerrainModel.seed) - TerrainModel.seed / 2)) % 2000 + 1001;
			WorldController.set_spawn();
		};

		check_for_old_slices();
	};

	var get_seed = function(){
		return seed;
	};
	
	var set_seed = function(new_seed){
		seed = new_seed;
	};

	var NewTerrainSlice = function(seed){
		/* this takes care of appending new terrain slice to the generated terrain
		 * it calculates it's origin x and y positions and whatever other stuff,
		 * generates slice; sets up everything
		 */
		var x_offset = TerrainModel.slice_counter * Config.TerrainSlice.grid_columns;

		TerrainModel.slice_counter++; // TODO: change how it works when truly infinite

		if(TerrainModel.initial_generated < 3){
			TerrainModel.initial_generated++;
			var slice = new TerrainSliceController.generate_initial(x_offset);
		}else{
			var slice = new TerrainSliceController.generate_random(x_offset, seed);
		}

		IdentificationController.assign_id(slice);

		MarkAsNewTerrainSlice(slice); 

		return slice;

	};

	var check_for_old_slices = function(){
		/**
		* check for slices that are too far behind and should be removed
		*/

		var tqueue = TerrainModel.terrain_slices_queue;
		var cut_off_index = 0; // what amnt of slices should go off the queue

		// find the old slices and handle their deletion
		for(var i = 0; i < tqueue.length; i++){
			var slice = tqueue[i];
			var slice_end_x = slice.origin.x + slice.grid_columns * slice.cell_w;

			if(slice_end_x < WorldController.get_movement_edge){
				// if slice is unreachable, delete it 
				cut_off_index++;
				delete_slice(slice);
			}
		}

		// now remove all found old slices from the queue
		if(cut_off_index > 0){
			TerrainModel.terrain_slices_queue = tqueue.slice(cut_off_index);
		}
	};
	
	

	var delete_slice = function(slice){
		/**
		* assumes that slice will be popped from the terrain slice queue elsewhere
		* (or was already)
		* otherwise the slice won't be properly deleted
		*/
			
		console.log("deleting slice with origin", slice.origin);
		
		var grid = slice.grid;
		
		for(var i = 0; i < grid.length; i++){
			var row = grid[i];
			for(var j = 0; j < row.length; j++){
				var cell = row[j];
				if(cell.kind != 0){
					PhysicsController.remove_body(cell.body);
					IdentificationController.remove_id(cell.id);
				}
			}
		}

		
		// For graphics to pick up and delete unneeded graphics
		RegisterAsController.register_as("removed_slice", slice);

		// free the id (yes, terrain slice has id id
		IdentificationController.remove_id(slice.id);
	};
	
	

	
	var for_each_tile = function(f){
		// takes function >f< that takes three parameters: tile (easeljs object),
		// terrain_lvl (int), and tile_index (int)
		// calls this function for every tile of the terrain
		
		var queues = TerrainModel.terrain_queues;

		$.each(queues, function(terrain_lvl){
			$.each(queues[terrain_lvl], function(tile_index){
				f(queues[terrain_lvl][tile_index], terrain_lvl, tile_index);
			});
		});

	};

	
	var MarkAsNewTerrainSlice = function(slice){
		//TerrainModel.new_slices.push(slice);
		RegisterAsController.register_as("awaiting_graphics_initialization", slice);
	};

	//var NewSlicesAvailable = function(){
		//return (TerrainModel.new_slices.length > 0);
	//};

	//var GetNewTerrainSlices = function(){
		//return TerrainModel.new_slices;
	//};

	return {
		update: update,
		init: init,
		NewTerrainSlice: NewTerrainSlice,
		MarkAsNewTerrainSlice: MarkAsNewTerrainSlice,
		get_seed: get_seed,
		set_seed: set_seed,
		//NewSlicesAvailable: NewSlicesAvailable,
		//GetNewTerrainSlices: GetNewTerrainSlices,
	}
})();

module.exports = TerrainController;

var Includes = require("../Includes.js"); var include_data = Includes.get_include_data({
	current_module: "TerrainController", 
	include_options: Includes.choices.DEFAULT
}); eval(include_data.name_statements); var include = function(){eval(include_data.module_statements);}

