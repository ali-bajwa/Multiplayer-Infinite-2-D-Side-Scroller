var GraphicsModel = function(){
	this.stage; // main stage to where everything will be drawn
	// note that every graphics object must be augmented with
	// the reference to the corresponding physics object, if any
	this.hero;
	this.other_players = []; // array of players other then hero for multiplayer
	this.unsorted = []; // all the stuff that needs to be rendered w/o special treetment
};

module.exports = new GraphicsModel;

