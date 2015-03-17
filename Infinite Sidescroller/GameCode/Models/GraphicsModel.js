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

	this.camera = {
		following: null,
		offset: {x: 0, y: 0},
	};
};

module.exports = new GraphicsModel;

