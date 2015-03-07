ChunkConfig = require ("../Config.js").Chunk;

var ChunkModel function(){

	var grid_columns = ChunkConfig.grid_columns;
	var grid_rows = ChunkConfig.grid_rows;
	var cell_w = ChunkConfig.cell_w;
	
	var grid = []

	// TODO: move to the initialization section
	for (var i = 0; i < grid_columns; i++){
			grid[i] = [];
		}
	};

module.export = ChunkModel;
