TerrainSliceConfig = require ("../Config.js").TerrainSlice;

var TerrainSliceModel = function(){

	this.Slice = function(){
		/**
		* slice "model" to be instantiated
		*/
		
		
		this.id = TerrainSliceConfig.next_slice_id++; // automaticall assign id and increment 

		this.grid_columns = TerrainSliceConfig.grid_columns;
		this.grid_rows = TerrainSliceConfig.grid_rows;
		this.cell_w = TerrainSliceConfig.cell_w;
		
		// grid[i][j] is the element in the i's column and j's row
		// the grid is maid to match the screen coordinates and the current box2d coordinates
		// i.e. grid[0][0] is the one in the top left corner of the terrain slice
		// do we want to change it? would it be easier to generate terrain if we start at the bottom?
		// if yes, then what makes more sense, changing coordinate systems or just switching generation
		// loops around? discuss
		//
		// notice that the grid is a terrain generation device only. once terrain slice is loaded,
		// box2d physics simulation may (and will) go nuts on it, changing whatever it wants,
		// and changes won't anyhow be reflected in the grid. to keep track of all the bodies
		// in the terrain slice, if that will be needed, other mechanisms should be used.
		// idea: have a collections of bodies by type, and setup sensor collision beams
		// at the terrain slices' boundaries to keep track of bodies flying over from one
		// terrain slice to another. Btw, Ali, I hate you for making me to type "terrain slice"
		// instead of the "chunk" 
		this.grid = [];
		
		this.origin = {x: null, y: null};

	};

	this.Cell = function(kind){
		this.kind = kind;
		this.body;
	}
	

	
	
};

TerrainSliceModel.prototype.lvl_prob = [
	[7, 2, 1],
	[0, 7, 3],
	[0, 1, 9]
]

module.exports = new TerrainSliceModel;
