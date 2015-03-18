// Notes:
// notice that you can reuse body definitions multiple times, it makes sense to have
// collection of body definitions that are commonly use and maybe allow some sort of 
// inheritance (i.e. you can make some definition on top of the another definition)
//
// bodies are allowed to have userData on them that is just reference to some object.
// may be useful in some situations

var B2dConfig;

var PhysicsController = (function(){

	var init = function(){
		include();

		B2dConfig = Config.B2D;

		PhysicsModel.scale = B2dConfig.SCALE;
		PhysicsModel.step_amount = 1/(B2dConfig.SPS);

		PhysicsModel.gravity = new B2d.b2Vec2(0,20); // earth gravity
		PhysicsModel.world = new B2d.b2World(PhysicsModel.gravity, true);

	};
	
	var step = function (delta_ms) {
		// !? should I set upper limit on delta to prevent world from
		// fast forwarding if the ticker was paused? or that is not a problem in our case?
		// investigation is needed

		var delta = delta_ms/1000;

		PhysicsModel.timeToCover += delta;

		while (PhysicsModel.timeToCover > PhysicsModel.step_amount) {
			PhysicsModel.timeToCover -= PhysicsModel.step_amount;
			PhysicsModel.world.Step(
				PhysicsModel.step_amount,
				B2dConfig.POSITION_ITR, // velocity iterations
				B2dConfig.VELOCITY_ITR // position iterations
			);
		}
			if (B2dConfig.debug_draw) {
				PhysicsModel.world.DrawDebugData();
			}
	};  // end step 

	var get_parent_chain = function(template, default_def){
		var next = template;
		var ancestors = [];

		while(next != null){
			ancestors.push(next);
			next = next["parent"];
		}

		if(default_def){
			ancestors.push(default_def);
		}

		return ancestors;
		
	};

	var apply_parents = function(template_name, type){
		// TODO: refactor the code so this thing is done only once
		// at the load tim
		// that could probably be done even for other things.
		// idea: store compiled body/fixture etc. together with the
		// template. this way you'll have easy access to the all defined
		// options for debugging;
		var template_collection;
		switch (type) {
			case "rectangular":
				template_collection = PhysicsModel.r_templates;

				break;
			case "circular":

				break;
			case "polygonal":

				break;
			
			default:
				throw "Error: type doesn't match anything";
		} // end switch
		
		// rename; it's default, not definition as it seems
		var def = template_collection["default"];

		var chain = get_parent_chain(template_collection[template_name], def);

		var final_definition = {};

		for(var i = chain.length - 1; i >= 0 ; i--){
			// may be needed to be made more efficient by moving the other way
			// and not considering options that were already encountered in children
			var current = chain[i];


			for(var prop in current){
				final_definition[prop] = current[prop];
			}
		}

		return final_definition;
	}; // end apply_parents
		

	var get_rectangular = function(def, template_name){
		var type = "rectangular";
		var compiled_template = apply_parents(template_name, type);
		var template_collection = PhysicsModel.r_templates;

		// target these properties (everything else will go onto the userData in the end
		// some of this stuff will be moved to set_common
		var target_body = ["type", "x", "y", "linearVelocity", "vx", "vy"];
		var target_fixture = ["width", "height"];


		// apply custom override
		var final_def = compiled_template;
		for(var prop in def){
			final_def[prop] = def[prop];
		}


		if(!final_def.width || !final_def.height){
			//required properties
			throw "Both width and height must be specified, either through defaults, " + 
				"or directly"
		}
		
		// BODY stuff
		var definition = new B2d.b2BodyDef();

		definition.position = new B2d.b2Vec2(final_def.x, final_def.y);
		definition.linearVelocity = new B2d.b2Vec2(final_def.vx, final_def.vy);
		definition.type = {
			"static": B2d.b2Body.b2_staticBody, 
			"dynamic": B2d.b2Body.b2_dynamicBody,
			"kinematic": B2d.b2Body.b2_kinematicBody
		}[final_def.type];

		var body = PhysicsModel.world.CreateBody(definition);
		 
		// FIXTURE stuff; note that you can add more fixtures later
		// or it can be allowed to specify several fixtures later
		// through these methods?
		var fixture_def = new B2d.b2FixtureDef();

		// box2d wants you to specify half width and half height
		final_def.width /= 2;
		final_def.height /= 2;

		// belongs in some form of loop and into set_common
		// or maybe even into some other function called from set_common,
		// that'll handle fixture definition, also allowing to add them to bodies at
		// runtime separately (set_fixture(body, parameters, template_name?)
		// can also tweak this function to allow to specify multiple fixtures (like give
		// fixtures array in the definition))
		fixture_def.density = final_def.density;
		fixture_def.friction = final_def.friction;
		fixture_def.restitution = final_def.restitution;

		fixture_def.shape = new B2d.b2PolygonShape();

		fixture_def.shape.SetAsBox(final_def.width, final_def.height);

		body.CreateFixture(fixture_def);

		return body;
	};

	var get_circular = function(def, template){
		var type = "circular";
		// dont' forget about refactoring some stuff into the
		// set_common function
		
		var definition = new B2d.b2BodyDef();
		
	};
		
	var get_polygonal = function(def, template){
		var type = "polygonal";
		
		var definition = new B2d.b2BodyDef();
		
	};

	var set_common = function(def){
		// type: static | dynamic | kinematic

		// array of setting this function will look for:
		var settings = ["position", "linearVelocity", "type"];
		
		var definition = new B2d.b2BodyDef();
		
	};
	
	

	// WILL BE DEPRECATED SOON
	
	var get_body = function(details){

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
 
	return {
		get_body: get_body,
		get_rectangular_body: get_rectangular_body,
		get_rectangular: get_rectangular,
		step: step,
		init: init,

	};
})();


module.exports = PhysicsController;

var Includes = require("../Includes.js"); var include_data = Includes.get_include_data({
	current_module: "PhysicsController", 
	include_options: Includes.choices.DEFAULT
}); eval(include_data.name_statements); var include = function(){eval(include_data.module_statements);}

