// WARNING!  this file doesn't adhere to the MVC yet, 
// parts of it shuld be merged into the PhysicsController and/or InitController

var B2dConfig, B2d, Config;

Config = require("../Config.js");
B2dConfig = Config.B2D;
B2d = require("../B2d.js");

var PhysicsModel = function() {
	
	this.gravity;
	this.world;
 
	// getting context of the debug canvas, for box2d to draw debuggin boxes
	this.context = undefined;

	this.scale = B2dConfig.SCALE;

	// timeToCover is the time that simulation must cover to catch up to the real world time;
	// since createjs ticker is what we use for timing, and box2d ticks
	// must be of constant length and independent from the graphics framerate,
	// we keep track of time that passed since last box2d step by adding time deltas
	// to the timeToCover. Then, when timeToCover exceeds desired box2d step length,
	// we perform the step and subtract the corresponding time from the timeToCover;
	// If anything is still unclear, ask me (AK);
		this.timeToCover = 0; 

	this.stepAmount = 1/(B2dConfig.SPS);

}; 

var templates;
PhysicsModel.prototype.templates = templates = {};



PhysicsModel.prototype.defaults = {
		shape: "block",
		width: 5,
		height: 5,
		radius: 2.5
	};
	 
PhysicsModel.prototype.fixture_defaults = {
	density: 2,
	friction: 1,
	restitution: 0.2
};
 
PhysicsModel.prototype.definition_defaults = {
	active: true,
	allowSleep: true,
	angle: 0,
	angularVelocity: 0,
	awake: true,
	bullet: false,
	fixedRotation: false
}; 




module.exports = new PhysicsModel;
