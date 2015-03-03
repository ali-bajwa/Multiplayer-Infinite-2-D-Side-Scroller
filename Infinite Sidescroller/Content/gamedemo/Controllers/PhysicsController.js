// WARNING! in the process of refactoring, some parts must be merged into PhysicsModel and/or 
// InitController; Yeah, this needs to be heavily refactored. Unfortunatelly I do not have time for this now

// Notes:
// notice that you can reuse body definitions multiple times, it makes sense to have
// collection of body definitions that are commonly use and maybe allow some sort of 
// inheritance (i.e. you can make some definition on top of the another definition)
//
// bodies are allowed to have userData on them that is just reference to some object.
// may be useful in some situations

var B2d, PhysicsModel;

B2d = require("../B2d.js");
PhysicsModel = require("../Models/PhysicsModel.js");

var PhysicsController = (function(){
	var step = function (delta) {
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

	var debug = function() {
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

	

	var get_body = function(details){

		var get_parameter = function(name, defaults){
			// gets certain parameter from the >details<. If not available,
			// gets one from the defaults dictionary/object
			return details[name] || defaults[name];
		};
		this.details = details || {};
		 
		// Create the definition
		this.definition = new b2BodyDef();
		 
		// Set up the definition
		for (var k in PhysicsModel.definition_defaults) {
			// questionable practice. I need to rewrite this for loop later
			this.definition[k] = details[k] || PhysicsModel.definition_defaults[k];
		}

		this.definition.position = new b2Vec2(details.x || 0, details.y || 0);
		this.definition.linearVelocity = new b2Vec2(details.vx || 0, details.vy || 0);
		this.definition.userData = this;
		this.definition.type = (details.type == "static") ? b2Body.b2_staticBody : b2Body.b2_dynamicBody;
		 
		// Create the Body
		this.body = PhysicsModel.world.CreateBody(this.definition);
		 
		// Create the fixture
		this.fixtureDef = new b2FixtureDef();
		for (var l in PhysicsModel.fixture_defaults) {
			this.fixtureDef[l] = details[l] || PhysicsModel.fixture_defaults[l];
		}
		 
		details.shape = details.shape || PhysicsModel.defaults.shape;
		 
		switch (details.shape) {
			case "circle":
				details.radius = details.radius || PhysicsModel.defaults.radius;
				this.fixtureDef.shape = new b2CircleShape(details.radius);
				break;
			case "polygon":
				this.fixtureDef.shape = new b2PolygonShape();
				this.fixtureDef.shape.SetAsArray(details.points, details.points.length);
				break;
			case "block":
			default:
				details.width = details.width || PhysicsModel.defaults.width;
				details.height = details.height || PhysicsModel.defaults.height;
			 
			this.fixtureDef.shape = new b2PolygonShape();
			this.fixtureDef.shape.SetAsBox(details.width / 2,
				details.height / 2);
			break;
		}
	 
		this.body.CreateFixture(this.fixtureDef);
	};
	 
	 
	return {

	};
})();


module.exports = new PhysicsController;
