
var PhysicsModel = function() {
	
	this.gravity;
	this.world;
 
	// getting context of the debug canvas, for box2d to draw debuggin boxes

	// timeToCover is the time that simulation must cover to catch up to the real world time;
	// since createjs ticker is what we use for timing, and box2d ticks
	// must be of constant length and independent from the graphics framerate,
	// we keep track of time that passed since last box2d step by adding time deltas
	// to the timeToCover. Then, when timeToCover exceeds desired box2d step length,
	// we perform the step and subtract the corresponding time from the timeToCover;
	// If anything is still unclear, ask me (AK);
		this.timeToCover = 0; 

	this.step_amount;

}; 

var templates;
/*
 * Parameters for b2d body definition
	active: true
	allowSleep: true
	angle: 0
	angularDamping: 0
	angularVelocity: 0
	awake: true
	bullet: false
	fixedRotation: false
	inertiaScale: 1
	linearDamping: 0
	linearVelocity: b2Vec2
	position: b2Vec2
	type: 0
	userData: null
*/

/*
 * Fixture definition parameters:
	density: 0
	filter: b2FilterData
	friction: 0.2
	isSensor: false
	restitution: 0
	shape: null
	userData: null
 */

// rectangular
PhysicsModel.prototype.r_templates = r_templates = {};
// circular
PhysicsModel.prototype.c_templates = c_templates = {};
// polygonal
PhysicsModel.prototype.p_templates = p_templates = {};


r_templates["default"] = {

	//shape: "rectangle", // implied from the template type
	x: 3,
	y: 3,
	width: 5,
	height: 5,

	density: 2,
	friction: 1,
	restitution: 0.2,

	active: true,
	allowSleep: true,
	angle: 0,
	angularVelocity: 0,
	awake: true,
	bullet: false,
	fixedRotation: false

};

r_templates.player = {
	width: 1.5,
	height: 2.5,
	type: "dynamic",
	//mobexp++
};


// Will be DEPRECATED soon:

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
