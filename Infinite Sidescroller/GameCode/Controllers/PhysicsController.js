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

		init_collision_listener();

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
			//"userData" // doesn't seem to properly work, doing it differently
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
	

	var get_body = function(non_formal_def, entity_instance){
		/**
		 * takes non-formal definition
		 * returns body based on this definition
		 *
		 */
		if (entity_instance == null){
		throw new PropertyUndefined("entity_instance");
		}
		var definition = get_formal_body_def(non_formal_def);

		var body = PhysicsModel.world.CreateBody(definition);

		//if(body.userData == null){
			//body.userData = {};
		//}

		// append passed definition to the user data of the body
		// for debugging purposes, and also to allow easy specification of 
		// custom parameters during definition. If this will cause confusion,
		// I'll remove that
		//body.userData.def = non_formal_def;
		body.SetUserData({def: non_formal_def, entity_instance: entity_instance});
		
		return body;
	
	};

	var attach_fixture = function(body, non_formal_def, fixture_name){
		/**
		 * given b2d body, (non-formal) fixture definition and (OPTIONAL) fixture_name
		 * this function attaches fixture to the body
		 */

		var fixture_def = get_formal_fixture_def(non_formal_def);

		if(fixture_def.userData == null){
			fixture_def.userData = {};
		}

		fixture_def.userData.def = non_formal_def;
		fixture_def.userData.name = fixture_name;
		
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
		top_sensor.width = (w*2 - SENSOR_THICKNESS*2) - 0.3;
		top_sensor.offset = {x:0, y: (-1*h) + SENSOR_THICKNESS/2};
		attach_fixture(body,top_sensor,"top");
		
		//attach bottom fixture
		var bottom_sensor = top_sensor;
		bottom_sensor.offset = {x:0, y: h - SENSOR_THICKNESS/2};
		attach_fixture(body,bottom_sensor,"bottom");
		
		//attach left fixture
		var left_sensor = top_sensor;
		left_sensor.height = (h*2 - SENSOR_THICKNESS*2) - 0.3;
		left_sensor.width = SENSOR_THICKNESS;
		left_sensor.offset = {x:(-1*w) + SENSOR_THICKNESS/2,y:0};
		attach_fixture(body,left_sensor,"left");
		
		//attach right fixture
		var right_sensor = left_sensor;
		right_sensor.offset = {x:w - SENSOR_THICKNESS/2, y:0};
		attach_fixture(body,right_sensor,"right");
	};
	
	
	

	var get_rectangular = function(def, entity_instance){
		// get appropriate template collection to draw from
		var template_name = entity_instance.type;
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


		var body = get_body(final_def, entity_instance);
		 
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


	
	var listen_for_contact_with = function(what, collision_event_name, custom_function){
		/**
		 * setups custom_function to be called each time the collision event 
		 * occurs and involves >what<
		 * TAKES:
		 * 	>what<
		 * 		string 
		 * 		id of an object ("383") or it's type ("player")
		 * 	>collision_event_name<
		 * 		string. one of:
		 * 		BeginContact, EndContact, PreSolve, PostSolve
		 * 	>custom_function< 
		 * 		function
		 * 		function to be called on one of those events
		 * 		notice that function will be wrapped, so it should
		 * 		accept extra parameter >info< that will contain
		 * 		unpacked information about the collision
		 */


		if(what == null){
			throw new PropertyUndefined("what");
		}

		if(
			collision_event_name != "BeginContact" && collision_event_name != "EndContact" &&
			collision_event_name != "PreSolve" && collision_event_name != "PostSolve" 
		){
			throw "collision_event_name should be one of: PreSolve, PostSolve, EndContact, BeginContact";
		}

		if(custom_function == null || typeof(custom_function) != "function"){
			throw "Property custom_function is not defined or isn't a function"
		}

		var target_function_table = PhysicsModel.awaiting_contact[collision_event_name]; 

		if(target_function_table[what] == null){
			target_function_table[what] = [custom_function];
		}else{
			target_function_table[what].push(custom_function);
		}
		
		
	};
	
	
		
	var init_collision_listener = function(){
		
		/**
		 */
		
		var call_all = function(list, args){
			/**
			 * call all functions in list providing arguments
			 * from the array args
			 * if list give is null/undefined, do nothing
			 */

			if(list != null){
				for(var i = 0; i < list.length; i++){
					list[i].apply(this, args);
				}
			}
		};

		var get_id = function(obj){
			userData = obj.GetUserData();
			if(userData != null && userData.id != null){
				return userData.id;
			}else{
				return "[NO_ID]"
			}
			
		};

		var get_type = function(obj){
			var userData = obj.GetUserData();
			if(userData != null && userData.entity_instance.type != null){
				return userData.entity_instance.type;
			}else{
				return null;
			}
			
		};

		var unpack_contact_info = function(contact, my_type){
			/**
			 * unpacks info about the collision and 
			 * returns it
			 * >my_type< is an type of an object that will
			 * go under the >Me< parameeter inside of info
			 * (As opposed to Them, which is the other object)
			 */
			if(my_type == null){
				// >my_type< isn't supposed to be null/undefined
				throw new PropertyUndefined("my_type");
			}

			var A = {};
			var B = {};

			A.fixture = contact.m_fixtureA;
			B.fixture = contact.m_fixtureB;
			A.body = A.fixture.GetBody();
			B.body = B.fixture.GetBody();

			A.id = get_id(A.body);
			B.id = get_id(B.body);

			//A.entity = IdentificationController.get_by_id(A.id);
			//B.entity = IdentificationController.get_by_id(B.id);
			A.entity = A.body.GetUserData().entity_instance;
			B.entity = B.body.GetUserData().entity_instance;

			A.type = get_type(A.body);
			B.type = get_type(B.body);

			A.fixture_name = get_custom_property(A.fixture, "name");
			B.fixture_name = get_custom_property(B.fixture, "name");

			// TODO: unpack more info if necessary

			var info = {};

			if(A.type == my_type){
				info.Me = A;
				info.Them = B;
			}else{
				info.Me = B;
				info.Them = A;
			}

			return info;
			
		};
		
		var common_contact = function(contact, args, lists){
			// create info, call respective functions for each id. use provided arguments >args<
			// lookup ids in the provided table of lists >lists<
			
			/* next available index in the args array 
			 * it's used to determine at what index the info object should be inserted as*/
			var next_arg_index = args.length; 

			var type1 = get_type(contact.m_fixtureA.GetBody());
			var type2 = get_type(contact.m_fixtureB.GetBody());

			if(type1 != null){
				
				args[next_arg_index] = unpack_contact_info(contact, type1);
				call_all(lists[type1], args);
			}

			if(type2 != null){
				args[next_arg_index] = unpack_contact_info(contact, type2);
				call_all(lists[type2], args);
			}

		};
		
		var PreSolve = function(contact, impulse){
			
			var lists = PhysicsModel.awaiting_contact.PreSolve;

			var args = [contact, impulse];

			common_contact(contact, args, lists);
	
		};
		
		var PostSolve = function(contact, oldManifold){
			var lists = PhysicsModel.awaiting_contact.PostSolve;

			var args = [contact, oldManifold];

			common_contact(contact, args, lists);
		};

		var BeginContact = function(contact){
			var lists = PhysicsModel.awaiting_contact.BeginContact;

			var args = [contact];

			common_contact(contact, args, lists);
		};

		var EndContact = function(contact){
			var lists = PhysicsModel.awaiting_contact.EndContact;

			var args = [contact];

			common_contact(contact, args, lists);
		};
		
		
		
		var listener = new B2d.b2ContactListener;
		listener.PreSolve = PreSolve;
		listener.PostSolve = PostSolve;
		listener.BeginContact = BeginContact;
		listener.EndContact = EndContact;
		
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
	
	var remove_body = function(body){
		/**
		* destroy given body (remove it from world and remove all references Physics has to it)
		*/
		
		// TODO: IMPORTANT!!! update this function if you store extra references
		// to the body within PhysicsModel/Controller.
		// Even a single reference to the body may keep it from being deleted
		// from the memory 
		PhysicsModel.world.DestroyBody(body);
	};
	
	//a very important function that I need for the hyena
	//returns the number of shapes in contact with a given bounding box
	var query_aabb = function(aabb){
		var count = 0;
		PhysicsModel.world.QueryAABB(
		function(max){
			count++;
			return true;
		},
		aabb);
		return count;
	};
	
	
	return {
		get_body: get_body,
		get_rectangular: get_rectangular,
		step: step,
		init: init,
		set_debug_draw: set_debug_draw,
		draw_debug: draw_debug,
		listen_for_contact_with: listen_for_contact_with,
		remove_body: remove_body,
		query_aabb: query_aabb,
	};
})();


module.exports = PhysicsController;

var Includes = require("../Includes.js"); var include_data = Includes.get_include_data({
	current_module: "PhysicsController", 
	include_options: Includes.choices.DEFAULT
}); eval(include_data.name_statements); var include = function(){eval(include_data.module_statements);}

