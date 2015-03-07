// WARNING! in the process of refactoring, some parts must be merged into PhysicsModel and/or 
// InitController; Yeah, this needs to be heavily refactored. Unfortunatelly I do not have time for this now

// Notes:
// notice that you can reuse body definitions multiple times, it makes sense to have
// collection of body definitions that are commonly use and maybe allow some sort of 
// inheritance (i.e. you can make some definition on top of the another definition)
//
// bodies are allowed to have userData on them that is just reference to some object.
// may be useful in some situations

var B2d, PhysicsModel, Config, B2dConfig;
var Utility;

Utility = require("../Utility.js");

B2d = require("../B2d.js");
PhysicsModel = require("../Models/PhysicsModel.js");
Config = require("../Config.js");
B2dConfig = Config.B2D;

var PhysicsController = (function(){
	var step = function (delta_ms) {
		// !? should I set upper limit on delta to prevent world from
		// fast forwarding if the ticker was paused? or that is not a problem in our case?
		// investigation is needed
		

		var delta = delta_ms/1000;
		PhysicsModel.timeToCover += delta;

		while (PhysicsModel.timeToCover > PhysicsModel.stepAmount) {
			PhysicsModel.timeToCover -= PhysicsModel.stepAmount;
			PhysicsModel.world.Step(
				PhysicsModel.stepAmount,
				B2dConfig.POSITION_ITR, // velocity iterations
				B2dConfig.VELOCITY_ITR // position iterations
			);
		}
			if (B2dConfig.debug_draw) {
				PhysicsModel.world.DrawDebugData();
			}
	}; 

	var get_rectangular_body = function(width, height, x, y, dynamic){

		return get_body({
			shape: "block", 
			width: width,
			type: dynamic ? "dynamic" : "static",
			height: height,
			x: x,
			y: y,
			fixedRotation: true // temporary/test
		});
	};

	var get_body = function(details){

		var get_parameter = function(name, defaults){
			// gets certain parameter from the >details<. If not available,
			// gets one from the defaults dictionary/object
			return details[name] || defaults[name];
		};
		var details = details || {};
		 
		// Create the definition
		var definition = new B2d.b2BodyDef();
		 
		// Set up the definition
		for (var k in PhysicsModel.definition_defaults) {
			// questionable practice. I need to rewrite this for loop later
			definition[k] = details[k] || PhysicsModel.definition_defaults[k];
		}

		definition.position = new B2d.b2Vec2(details.x || 0, details.y || 0);
		definition.linearVelocity = new B2d.b2Vec2(details.vx || 0, details.vy || 0);
		//this.definition.userData = this;
		definition.type = (details.type == "static") ? B2d.b2Body.b2_staticBody : B2d.b2Body.b2_dynamicBody;
		 
		// Create the Body
		var body = PhysicsModel.world.CreateBody(definition);
		 
		// Create the fixture
		var fixtureDef = new B2d.b2FixtureDef();
		for (var l in PhysicsModel.fixture_defaults) {
			fixtureDef[l] = details[l] || PhysicsModel.fixture_defaults[l];
		}
		 
		details.shape = details.shape || PhysicsModel.defaults.shape;
		 
		switch (details.shape) {
			case "circle":
				details.radius = details.radius || PhysicsModel.defaults.radius;
				fixtureDef.shape = new B2d.b2CircleShape(details.radius);
				break;
			case "polygon":
				fixtureDef.shape = new B2d.b2PolygonShape();
				fixtureDef.shape.SetAsArray(details.points, details.points.length);
				break;
			case "block":
			default:
				details.width = details.width || PhysicsModel.defaults.width;
				details.height = details.height || PhysicsModel.defaults.height;
			 
				fixtureDef.shape = new B2d.b2PolygonShape();
				fixtureDef.shape.SetAsBox(details.width / 2,
				details.height / 2);
			break;
		}
	 
		body.CreateFixture(fixtureDef);

		return body;
	};
	 
	 
	return {
		get_body: get_body,
		get_rectangular_body: get_rectangular_body,
		step: step

	};
})();


module.exports = PhysicsController;
