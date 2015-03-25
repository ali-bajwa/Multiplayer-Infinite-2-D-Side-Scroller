var GraphicsModel = function(){
	this.stage; // main stage to where everything will be drawn
	// note that every graphics object must be augmented with
	// the reference to the corresponding physics object, if any
	this.hero;
	this.other_players = []; // array of players other then hero for multiplayer
	this.ant;
    //PIZZAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
	this.health;
	this.score;
	// all object registered for continious update to match their physical body
	// position 
	this.all_physical = []; 

	// all spritesheet definitions (added at the initialization stage
	// because they need assets to be loaded)
	this.spritesheets = {}; 

	this.camera = {
		// should be easeljs object or null
		following: null,

		// internal camera implementation thing to know how far to offset from the
		// initial position
		offset: {x: 0, y: 0},

		// the offset of the camera from the followed object
		// e.g. offset of {x: 100, y: 100} will center camera
		// 100 pixels to the right and 100 pixels below the followed object
		offset_from_followed: {x: 400, y: -100},
		//offset_from_followed: {x: 330, y: -205}, //FOR GAME PAGE
		// this is center of the screen in pixels. gets dynamically recalculated 
		// during the camera update so if it's ever changed, camera still works as expected
		center: {x: 0, y: 0}

	};
};

module.exports = new GraphicsModel;

