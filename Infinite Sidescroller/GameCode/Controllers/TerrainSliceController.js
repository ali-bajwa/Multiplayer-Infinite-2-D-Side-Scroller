var TerrainSliceModel;

var GameUtility;

var include = function(){
	/* browserify require statements go here */
	TerrainSliceModel = require("../Models/TerrainSliceModel.js");
	GameUtility = require("../GameUtility.js");
	

};

var TerrainSliceController = (function () {

	var init = function(){
		/* is ran from the InitController once when the game is loaded */

		include(); // satisfy requirements

	};

	var update = function(slice){
		

	};

	var generate = function(slice){
		for(var i = 0; i < slice.grid_rows; i++){
			slice.grid[i] = [];
			var lvl = slice.grid_rows - i; // level from the bottom
			var prob = slice.lvl_prob[lvl];

			for(var j = 0; j < slice.grid_columns; j++){
				if(prob){
					var random_id = GameUtility.random_choice(prob, [0, 1, 2]); // chose random terrain id
					slice.grid[i][j] = {tile_id: random_id};
				} // fi
			} // for end
		} // for end
		
	};


	return {
		// declare public
		init: init, 
		update: update,
		generate: generate,
	};
})();

module.exports = TerrainSliceController;

