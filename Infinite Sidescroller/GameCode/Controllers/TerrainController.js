var GameModel, TerrainModel, TerrainSliceModel;
var AssetController, PhysicsController, TerrainSliceController;
var GameUtility, Config;

var include = function(){
	AssetController = require("./AssetController.js");
	PhysicsController = require("./PhysicsController.js");
	TerrainSliceController = require("./TerrainSliceController.js");
	

	GameModel = require("../Models/GameModel.js");
	TerrainModel = require("../Models/TerrainModel.js");
	TerrainSliceModel = require("../Models/TerrainSliceModel.js");

	

	GameUtility = require("../GameUtility.js");
	Config = require("../Config.js");

		
};


var TerrainController = (function(){
	/* this will be the physical representation of the terrain
	 * currently it contains graphical bits, but that will change
	 */

	var LVL_PROB = [
		[7, 2, 1],
		[0, 7, 3],
		[0, 1, 9]
	]; // probabilities for each level; temporary!

	var temp = 0;

	var init = function(){
		
		include();
	};
	

	var update = function(){
	};

	var NewTerrainSlice = function(){
		/* this takes care of appending new terrain slice to the generated terrain
		 * it calculates it's origin x and y positions and whatever other stuff,
		 * generates slice; sets up everything
		 */

		var slice = new TerrainSliceModel();
		TerrainSliceController.generate(slice);

	};

	
	
	var retrieve_world_parameters = function(){};

	var generate_terrain = function(){
		/*
		   Load appropriate amount of the terrain ahead
		   Only a demo!!! must be made more sophisticated!
		*/

		return // TODO: remove

		var terrain_choices = ["grass", "middle_terrain", "bottom_terrain"];

		// TODO: make more efficient by detecting whether terrain moved since the last time
		for(var i = 0; i < TerrainModel.terrain_queues.length; i++){
			//// for each level of terrain
			var slice_index = 0; //
			var terrain_queue =  TerrainModel.terrain_queues[i];

			for(var j = 0; j < terrain_queue.length; j++){
				// for each tile, if tile is ofscreen, delete it
				var tile = terrain_queue[j];
				// TODO break after encountering first tile with bigger index (I do not implement it now to simplify debugging)
				if(tile.x < -100){
					GameModel.stage.removeChild(tile);
					slice_index += 1;
				   }
			   }

			if(slice_index > 0){
				TerrainModel.terrain_queues[i] = terrain_queue.slice(slice_index);
				var terrain_queue =  TerrainModel.terrain_queues[i];
			}


			
			var last_tile = terrain_queue[terrain_queue.length - 1];

			while(terrain_queue.length < 70){
					// while level queue isn't full
					var next_x = last_tile ? last_tile.x + 30 : -100;

					var random_id = GameUtility.random_choice(LVL_PROB[i], terrain_choices);

					var rand_tile = AssetController.request_bitmap(random_id);

					//This must be it's own function and be greately generalized and standartized:
					rand_tile.regX = 0;
					rand_tile.regY = 30;
					rand_tile.y = 510 + 30*(i+1);
					rand_tile.x = next_x;

					rand_tile.b2b = PhysicsController.get_rectangular_body(1, 1, rand_tile.x/30 - 1/2, rand_tile.y/30 -1/2, false); //temporary/test

					// this must be done in its own function, to keep track of everything
					// e.g. "z-index" of every element, etc.
					GameModel.stage.addChild(rand_tile); 

					terrain_queue.push(rand_tile);

					last_tile = rand_tile;

			   }

		   
	   } // end for 



	}; //end generate_terrain

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

		// TODO: rework this suboptimal solution, so that terrain is regenerated only once per tick
		// instead of at each movement command; solution should be better than just placing the call
		// into the GameController.update_all function
		generate_terrain();
	};

	return {
		generate_terrain: generate_terrain,
		move_left: move_left,
		move: move,
		update: update,
		init: init,
	}
})();

module.exports = TerrainController;
