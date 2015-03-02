// WARNING!  this file doesn't adhere to the MVC yet, 
// parts of it shuld be merged into the PhysicsController and/or InitController

var B2dConfig = require("../Config.js").B2D;

var PhysicsModel = function() {
	
	var gravity = new b2Vec2(0,9.8); // earth gravity
	this.world = new b2World(gravity, true);

	this.context = .getContext("2d");

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

Physics.prototype.step = function (delta) {
	// !? should I set upper limit on delta to prevent world from
	// fast forwarding if the ticker was paused? or that is not a problem in our case?
	// investigation is needed
	
	this.timeToCover += delta;

	while (this.timeToCover > this.stepAmount) {
		this.timeToCover -= this.stepAmount;
		this.world.Step(
			this.stepAmount,
			B2dConfig.POSITION_ITR, // velocity iterations
			B2dConfig.VELOCITY_ITR // position iterations
		);
	}
	if (B2dConfig.debugDraw) {
		this.world.DrawDebugData();
	}
} 

Physics.prototype.debug = function() {
	// this is probably for the InitController.init 
	// specifically for the setup_debug_canvas
	//
	this.debugDraw = new b2DebugDraw();
	this.debugDraw.SetSprite(this.context);
	this.debugDraw.SetDrawScale(this.scale);
	this.debugDraw.SetFillAlpha(0.3);
	this.debugDraw.SetLineThickness(1.0);
	this.debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
	this.world.SetDebugDraw(this.debugDraw);
}; 




module.exports = new Physics;
