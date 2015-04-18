var TerrainModel = function(){
	//This is physics, for graphics look into the GraphicsController/Model
	this.terrain_slices_queue = [];
	this.new_slices = [];
	this.seed;

	// how many initial (non-random) terrain slices
	// were generated already?
	this.initial_generated = 0;


	// used to determine x offset of the next slice
	// TODO: update this when truly infinite terrain will be implemented
	this.slice_counter = 0;

};

module.exports = new TerrainModel;
