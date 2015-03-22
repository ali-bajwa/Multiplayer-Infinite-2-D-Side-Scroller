var GraphicsModel = function(){
	this.stage; // main stage to where everything will be drawn
	// note that every graphics object must be augmented with
	// the reference to the corresponding physics object, if any
	this.hero;
	this.other_players = []; // array of players other then hero for multiplayer
	this.ant;
	// all object registered for continious update to match their physical body
	// position 
	this.all_physical = []; 

	// all spritesheet definitions (added at the initialization stage
	// because they need assets to be loaded
	this.spritesheets = {}; 

	this.camera = {
		// should be easeljs object or null
		following: null,

		offset: {x: 0, y: 0},
		offset_from_followed: {x: 0, y: 0}
	};
};

module.exports = new GraphicsModel;

