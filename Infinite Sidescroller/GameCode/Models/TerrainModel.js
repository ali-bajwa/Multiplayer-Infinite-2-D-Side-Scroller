var TerrainModel = function(){
	//This is physics, for graphics look into the GraphicsController/Model
	this.terrain_slices_queue = [];
	this.new_slices = [];
	this.seed;

};

module.exports = new TerrainModel;
