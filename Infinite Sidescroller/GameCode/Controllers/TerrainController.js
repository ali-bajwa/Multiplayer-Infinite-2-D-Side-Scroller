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

		if(config.Player.movement_edge > (TerrainModel.terrain_slices_queue.length-3)*(20)){
			var slice = NewTerrainSlice(TerrainModel.seed);
			TerrainModel.terrain_slices_queue.push(slice);
			TerrainModel.seed = (((TerrainModel.seed%4) * (TerrainModel.seed+1) - TerrainModel.seed / 2)) % 3000;
		};
	};


	var NewTerrainSlice = function(seed){
		/* this takes care of appending new terrain slice to the generated terrain
		 * it calculates it's origin x and y positions and whatever other stuff,
		 * generates slice; sets up everything
		 */
		var x_offset = TerrainModel.terrain_slices_queue.length*20;
		if (TerrainModel.terrain_slices_queue.length < 3){
			var slice = new TerrainSliceController.generate_initial(x_offset);
		}else{
			var slice = new TerrainSliceController.generate_random(x_offset, seed);
		}
		MarkAsNewTerrainSlice(slice); 

		return slice;

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
		TerrainModel.new_slices.push(slice);
	};

	var NewSlicesAvailable = function(){
		return (TerrainModel.new_slices.length > 0);
	};

	var GetNewTerrainSlices = function(){
		return TerrainModel.new_slices;
	};

	return {
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

