TerrainSliceConfig = require ("../Config.js").TerrainSlice;

var TerrainSliceModel = function(){
	this.slice_id = TerrainSliceConfig.next_slice_id++; // automaticall assign id and increment 

	this.grid_columns = TerrainSliceConfig.grid_columns;
	this.grid_rows = TerrainSliceConfig.grid_rows;
	this.cell_w = TerrainSliceConfig.cell_w;
	
	// grid[i][j] is the element in the i's column and j's row
	// the grid is maid to match the screen coordinates and the current box2d coordinates
	// i.e. grid[0][0] is the one in the top left corner of the terrain slice
	// do we want to change it? would it be easier to generate terrain if we start at the bottom?
	// if yes, then what makes more sense, changing coordinate systems or just switching generation
	// loops around? discuss
	this.grid = [];
	
	this.origin = {x: null, y: null};
	

	
	
};

TerrainSliceModel.prototype.lvl_prob = [
	[7, 2, 1],
	[0, 7, 3],
	[0, 1, 9]
]

module.exports = TerrainSliceModel;
