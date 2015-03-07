var TerrainModel = new function(){

	// This is graphics representation of the terrain; for actual physics terrain, look at the
	// WorldModel; maybe some renaming is needed?

	// TODO: dynamic initialization
	this.terrain_queues = [
		[],
		[],
		[]
	];

};

module.exports = TerrainModel;
