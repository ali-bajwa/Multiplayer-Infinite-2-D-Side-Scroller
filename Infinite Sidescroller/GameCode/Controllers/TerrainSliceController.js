var include = function(){
	/* browserify require statements go here */

};

var TerrainSliceController = (function () {

	var init = function(){
		/* is ran from the InitController once when the game is loaded */

		include(); // satisfy requirements

	};

	var update = function(slice){

	};

	var generate = function(slice){
		for (var i = 0; i < slice.grid_columns; i++){
			slice.grid[i] = [];
		}

			
		
	};


	return {
		// declare public
		init: init, 
		update: update
	};
})();

module.exports = TerrainSliceController;

