var GraphicsModel = function(){
	this.stage; // main stage to where everything will be drawn
	// note that every graphics object must be augmented with
	// the reference to the corresponding physics object, if any
	this.hero;
	this.other_players = []; // array of players other then hero for multiplayer

	// all object registered for rendering (includes objects in special categories too,
	// like hero, other players etc.
	this.all = []; 

	this.camera = {
		following: null,
		offset: {x: 0, y: 0},
	};
};

module.exports = new GraphicsModel;

