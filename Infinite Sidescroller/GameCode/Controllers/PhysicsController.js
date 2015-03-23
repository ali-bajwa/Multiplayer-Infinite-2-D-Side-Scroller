// Notes:
// notice that you can reuse body definitions multiple times, it makes sense to have
// collection of body definitions that are commonly use and maybe allow some sort of 
// inheritance (i.e. you can make some definition on top of the another definition)
//
// bodies are allowed to have userData on them that is just reference to some object.
// may be useful in some situations
//
// Question:
// does it make sense to allow users to pass any properties as part of object definition
// and just apply those properties automatically to the userData property of body?

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
	};  // end step 

	var draw_debug = function(){
		if (B2dConfig.debug_draw) {
			PhysicsModel.world.DrawDebugData();
		}
	};

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

	var apply_parents = function(template_name, template_collection){
		// TODO: refactor the code so this thing is done only once
		// at the load tim
		// that could probably be done even for other things.
		// idea: store compiled body/fixture etc. together with the
		// template. this way you'll have easy access to the all defined
		// options for debugging;
		
		var default_tmplate = template_collection["default"];

		var chain = get_parent_chain(template_collection[template_name], default_tmplate);

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
		
	var target_props = {
		body_def: [
			"active",
			"allowSleep",
			"angle",
			"angularDamping",
			"angularVelocity",
			"awake",
			"bullet",
			"fixedRotation",
			"inertiaScale",
			"linearDamping",
			"linearVelocity",
			"position",
			"type",
			"userData"
		],
		fixture_def: [
			"density",
			//"filter", implement later if needed
			"friction",
			"isSensor",
			"restitution",
			"shape",
			"userData"
		]
	};

	var apply_property_list = function(source, destination, list){
		/**
		 * takes two objects and the list of strings
		 * copies all properties with names found in the list
		 * from source to destination
		 * scips properties which are null/undefined
		 */

		for(var i = 0; i < list.length; i++){
			var prop = list[i];
			if(source[prop] != null){
				destination[prop] = source[prop];
			}
		}

		return destination;
	};

	var PropertyUndefined = function PropertyUndefined(property_name){
		this.name = "PropertyUndefined";
		this.message = "Error: " + property_name + " is not defined";
	};
	PropertyUndefined.prototype = Object.create(Error.prototype);
	PropertyUndefined.prototype.constructor = PropertyUndefined;

	var get_formal_body_def = function(non_formal_def){
		/**
		 * turn non formal definition into the formal one
		 * non-formal definition is an object that contains
		 * properties SOME of which are box2d properties or are 
		 * intended to be transformed into such. E.g. the non-formal
		 * definition may contain properties vx and vy which will be transformed
		 * into the linearVelocity vector in the formal definition
		 */

		var nfdef = non_formal_def;

		var definition = new B2d.b2BodyDef();

		if(nfdef.vx != null && nfdef.vy != null){
			// check for informal parameter specification first
			nfdef.linearVelocity = new B2d.b2Vec2(nfdef.vx, nfdef.vy);
		}else{
			// maybe the linearVelocity was specified directly as vector,
			// and not through informal parameters; checking that, and if not,
			// exception
			if(!(nfdef.linearVelocity)){
				throw new PropertyUndefined("linearVelocity");
			}
		}

		if(nfdef.x != null && nfdef.y != null){
			// same procedure as for the linear velocity
			// checking for informal specification here
			// and if present, turning into the formal
			nfdef.position = new B2d.b2Vec2(nfdef.x, nfdef.y);
		}else{
			// checking if formal was specified directly
			if(!(nfdef.position)){
				// if not, throw custom exception
				throw new PropertyUndefined("position");
			}
		}

		if(nfdef.type){
			nfdef.type = {
				"static": B2d.b2Body.b2_staticBody, 
				"dynamic": B2d.b2Body.b2_dynamicBody,
				"kinematic": B2d.b2Body.b2_kinematicBody
			}[nfdef.type]; // turn string-type into b2d type
		}else{
			throw new PropertyUndefined("type");
		}

		apply_property_list(nfdef, definition, target_props.body_def);

		return definition;

	};

	var get_formal_fixture_def = function(non_formal_def){
		/**
		 * turns non-formal definition into the formal one
		 * see get_fromal_body_def for explanation
		 */

		var nfdef = non_formal_def;
		var shape = nfdef.shape;
		var fixture_def = new B2d.b2FixtureDef();

		apply_property_list(non_formal_def, fixture_def, target_props.fixture_def);

		switch (shape) {
			case "rectangle":

				if(nfdef.width != null && nfdef.height != null){
					fixture_def.shape = new B2d.b2PolygonShape();
					fixture_def.shape.SetAsBox(nfdef.width/2, nfdef.height/2);
				}else{
					throw new PropertyUndefined("width or height");
				}
				break;
			case "polygon":

				if(nfdef.points != null){
					fixture_def.shape = new B2d.b2PolygonShape();
					fixture_def.shape.SetAsArray(nfdef.points, nfdef.points.length);
				}else{
					throw new PropertyUndefined("points");
				}
				break;
			case "circle":

				if(nfdef.radius != null){
					fixture_def.shape = new B2d.b2CircleShape(nfdef.radius);
				}else{
					throw new PropertyUndefined("radius");
				}
				break;
			default:
				throw "Error: shape must be one of the following: " + 
					'"polygon", "rectangle", "circle". You specified: ' +
					String(shape);
		}

		return fixture_def;

	};
	

	var get_body = function(non_formal_def){
		/**
		 * takes non-formal definition
		 * returns body based on this definition
		 *
		 */
		var definition = get_formal_body_def(non_formal_def);

		var body = PhysicsModel.world.CreateBody(definition);

		if(body.userData == null){
			body.userData = {};
		}

		// append passed definition to the user data of the body
		// for debugging purposes, and also to allow easy specification of 
		// custom parameters during definition. If this will cause confusion,
		// I'll remove that
		body.userData.def = non_formal_def;

		return body;
	
	};

	var attach_fixture = function(body, non_formal_def, fixture_description){
		/**
		 * given b2d body, (non-formal) fixture definition and (OPTIONAL) fixture_description
		 * this function attaches fixture to the body
		 */

		var fixture_def = get_formal_fixture_def(non_formal_def);

		if(fixture_def.userData == null){
			fixture_def.userData = {};
		}

		fixture_def.userData.def = non_formal_def;
		fixture_def.userData.description = fixture_description;
		
		body.CreateFixture(fixture_def);

		// TODO: implement; @Sean
		// offset if of the form {x: number, y: number}
		//
		// if(non_fromal_def.offset){
		// 	code to offset fixture
		// }
	};

	var attach_sensors = function(body){

		// TODO: implement; @Sean
		// get the width and height of the body's main fixture
		// using them create 4 sensor fixtures
		// calculate offset of sensors so that they match the main fixture
		var top_fixture, bottom_fixture; // those are non formal fixture definitions
		//attach_fixture(body, top_fixture, "top")
		//attach_fixture(body, bottom_fixture, "bottom")
		//sensors must be weightless to not change center of mass
	};
	
	
	

	var get_rectangular = function(def, template_name){
		// get appropriate template collection to draw from
		var template_collection = PhysicsModel.r_templates;
		var compiled_template = apply_parents(template_name, template_collection);

		// apply custom override
		var final_def = compiled_template;
		for(var prop in def){
			final_def[prop] = def[prop];
		}

		final_def.shape = "rectangle";

		// final_def contains all final data, about body we are about to create
		// it takes into account template given and all it's parents
		// and also manually specified parameters. However, this definition is raw,
		// i.e. some data in it may not be in its final form, e.g. linear velocity is specified
		// as two parameters, vx and vy, while it whould be converted into the vector
		// for box2d. so final_def is a final description, but not in final form


		var body = get_body(final_def);
		 
		attach_fixture(body, final_def, "main");
		
		// TODO: implement; @Sean
		// if final_def.border_sensors
		// 	attach_sensors(body);

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

	var set_debug_draw = function(debug_draw){
		PhysicsModel.world.SetDebugDraw(debug_draw);
	};
	
	
	return {
		get_body: get_body,
		get_rectangular: get_rectangular,
		step: step,
		init: init,
		set_debug_draw: set_debug_draw,
		draw_debug: draw_debug,
	};
})();


module.exports = PhysicsController;

var Includes = require("../Includes.js"); var include_data = Includes.get_include_data({
	current_module: "PhysicsController", 
	include_options: Includes.choices.DEFAULT
}); eval(include_data.name_statements); var include = function(){eval(include_data.module_statements);}

