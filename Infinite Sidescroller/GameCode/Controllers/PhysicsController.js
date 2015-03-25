// Notes:
// notice that you can reuse body definitions multiple times, it makes sense to have
// collection of body definitions that are commonly use and maybe allow some sort of 
// inheritance (i.e. you can make some definition on top of the another definition)
// // bodies are allowed to have userData on them that is just reference to some object.
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
					if (nfdef.offset != null){
						var offset = new B2d.b2Vec2(nfdef.offset.x ,nfdef.offset.y);
						fixture_def.shape.SetAsOrientedBox(nfdef.width/2, nfdef.height/2, offset, 0);
					}else{
						fixture_def.shape.SetAsBox(nfdef.width/2, nfdef.height/2);
					}
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
		
	};

	var attach_sensors = function(body){
		var SENSOR_THICKNESS = 0.1;
		
		// get the width and height of the body's main fixture
		// and create 4 sensor fixtures based on those parameters
		// calculate offset of sensors so that they match the main fixture
		var x = body.GetPosition().x;
		var y = body.GetPosition().y;

		// TODO: change to getting dimentions of main fixture
		var h = body.GetFixtureList().GetAABB().GetExtents().y;
		var w = body.GetFixtureList().GetAABB().GetExtents().x;
		
		//attach top fixture
		var top_sensor = {};
		top_sensor.shape = "rectangle";
		top_sensor.density = 0;
		top_sensor.isSensor = true;
		top_sensor.height = SENSOR_THICKNESS;
		top_sensor.width = w*2;
		top_sensor.offset = {x:0, y:(-1*h)};
		attach_fixture(body,top_sensor,"top sensor");
		
		//attach bottom fixture
		var bottom_sensor = top_sensor;
		bottom_sensor.offset = {x:0, y:h};
		attach_fixture(body,bottom_sensor,"bottom sensor");
		
		//attach left fixture
		var left_sensor = top_sensor;
		left_sensor.height = h*2;
		left_sensor.width = SENSOR_THICKNESS;
		left_sensor.offset = {x:(-1*w),y:0};
		attach_fixture(body,left_sensor,"left sensor");
		
		//attach right fixture
		var right_sensor = left_sensor;
		right_sensor.offset = {x:w, y:0};
		attach_fixture(body,right_sensor,"right sensor");
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
		
		//If the object has directional sensors, attach sensors here
		if(final_def.border_sensors){
			attach_sensors(body);
		}

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

	var setup_collision_listener = function(functions, optional){
		
		/**
		 * takes two objects, >functions< and >optional<
		 * first object should contain any of the following properties:
		 * BeginContact, PreSolve, PostSolve, EndContact
		 * with there values being functions to be called on each event
		 * the optional object is for some named parameters that might be used later
		 * Notice that this function wraps calls of the given functions, to give more
		 * helpful info about the collision in particular, it will provide info about the
		 * sides on which objects collided, granted that sided sensors are present
		 *
		 * supported properties of >optional<:
		 * 	must_be_involved: b2d_body
		 * 		report only contacts in which this body is involved
		 * 		e.g. if you pass it body of the player, only collisions with the
		 * 		player will cause passed functions to be called
		 */

		var listener = new B2d.b2ContactListener;

		var names = ["BeginContact", "EndContact", "PreSolve", "PostSolve"];
		for(var i = 0; i < 4; i++){
			var name = names[i];
			var custom_function = functions[name];

			if(custom_function){
				// if given function was specified
				
				// wrap it properly and attach to the listener
				listener[name] = (function(custom_function, must_be_involved){
					// self calling function to deal with scope issues
					 
					return function wrapper(contact, second_arg){
						// >second_arg< will be impulse of collision in case of PreSolve,
						// oldManifold in case of PostSolve, and null otherwise
						
						var fixture_A = contact.m_fixtureA;
						var fixture_B = contact.m_fixtureB;
						var body_A = fixture_A.GetBody();
						var body_B = fixture_B.GetBody();
						
						if(!must_be_involved || // if no checking for bodies involved OR
							body_A === must_be_involved || // first body matches OR
							body_B === must_be_involved // second body matches
						){
							// whatever info you want to unpack for the custom function to easily use:
							var info = {}; 

							// TODO:THIS SHOULD BE CHANGED together with
							// how id's are attached to the fixtures
							// not changing now, to avoid merge conflicts with
							// @Sean's work >>>
							info.A = {};
							info.B = {};

							info.A.fixture = fixture_A;
							info.B.fixture = fixture_B;

							info.A.body = body_A;
							info.B.body = body_B;

							info.A.body_id = get_custom_property(body_A, "id");
							info.B.body_id = get_custom_property(body_B, "id");

							info.A.fixture_id = get_custom_property(fixture_A, "description");
							info.B.fixture_id = get_custom_property(fixture_B, "description");
							// <<< end of terribleness

							// call the custom function
							if(second_arg){
								// specifying the implulse/oldManifold if present
								custom_function(contact, second_arg, info);
							}else{
								// or not specifying if it is not
								custom_function(contact, info);
							}
						}
					};
				})(custom_function, optional.must_be_involved);
			}
		}

		PhysicsModel.world.SetContactListener(listener);
	
	};

	var get_custom_property = function(b2d_obj, property_name){
		
		/**
		 * given any box2d object that has GetUserData method
		 * this function will return custom property with given
		 * property_name if this property is set on userData of the object
		 * if not, the function returns null
		 */
		var user_data = b2d_obj.GetUserData();
		if(user_data && user_data[property_name]){
			return user_data[property_name];
		}else{
			return null;
		}
	};
	
	
	
	
	return {
		get_body: get_body,
		get_rectangular: get_rectangular,
		setup_collision_listener: setup_collision_listener,
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

