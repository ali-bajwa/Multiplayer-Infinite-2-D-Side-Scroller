(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// This file contains shortcuts for the methods of the Box2D library that are used
// too often to type their long names

var B2d = function(){

};

B2d.prototype.init = function(){
	include();

	this.b2Vec2 = Box2D.Common.Math.b2Vec2;
	this.b2BodyDef = Box2D.Dynamics.b2BodyDef;
	this.b2Body = Box2D.Dynamics.b2Body;
	this.b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
	this.b2Fixture = Box2D.Dynamics.b2Fixture;
	this.b2World = Box2D.Dynamics.b2World;
	this.b2MassData = Box2D.Collision.Shapes.b2MassData;
	this.b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
	this.b2CircleShape = Box2D.Collision.Shapes.b2CircleShape;
	this.b2DebugDraw = Box2D.Dynamics.b2DebugDraw; 
	this.b2ContactListener = Box2D.Dynamics.b2ContactListener;

};

module.exports = new B2d;

var Includes = require("./Includes.js"); var include_data = Includes.get_include_data({
	current_module: "B2d", 
	include_options: Includes.choices.OTHER_STUFF
}); eval(include_data.name_statements); var include = function(){eval(include_data.module_statements);}


},{"./Includes.js":19}],2:[function(require,module,exports){
var Config = function(){
	this.SCREEN_W = 0; // set up when the page is loaded (to 95% of width of containing element) 
	this.SCREEN_H = 600;

	this.MAIN_CANVAS_NAME = "display_canvas";
	this.DEBUG_CANVAS_NAME = "debug_canvas";

	// Frames Per Second. Essentially, frequency of createjs.Ticker 
	// Warning! Frequency of the Box2D physics updates may be different
	// (Currently not implemented)
	this.FPS = 30; 
	
	//the movement edge, controls terrain generation
	this.movement_edge = 0;

	// Box2D stuff >>>
	this.B2D = {
		SCALE: 30,
		SPS: 60, 			// Steps Per Second
		VELOCITY_ITR: 8,	// velocity iterations
		POSITION_ITR: 3,	// position iterations
		debug_draw: false
	};

	this.TerrainSlice = {
		grid_rows: 20,
		grid_columns: 20,
		cell_w: 1, // in meters

		// is automatically incremented each time new TerrainSliceModel is instantiated:
		next_slice_id: 0 
	};

	this.World = {
		maxy: 22,

	};
	this.Remote = {
		master: false, // am I the one with whome other players sync? 
		connected: false, // am I in multiplayer mode
		connection_timeout: 1000, // ms
		notification_wait: 3000, // ms !!! SHOULD BE AT LEAST 1000 bigger THAN THE PREVIOUS ONE
	};
	
	this.Init = {
		session_id: null,
		player_id: null,
		mode: null,

		// for multiplayer game you have certain time limit
		// to join the game. In this time limit players shouldn't be able to go past
		// certain point of the map.
		movement_blocked: true,
		time_limit: 15, // seconds
		// we should begin automatically after everyone is joined

	}
};

module.exports = new Config;

},{}],3:[function(require,module,exports){

var AssetController = (function(){
	/*
	   AssetController is in charge of setting up all bitmaps/animations/other resources
	   for everyone else.
   */

	// use AssetModel.loader.getResult("id_of_the_asset");

	var init = function(asset_path){
		include();	

		/* TODO make model with the easily managed tables of resources which will be
		   added to the loader automatically
		*/

		//loader = new createjs.LoadQueue(false); // loading resourses using preload.js
		//loader.addEventListener("complete", handleComplete);
		var manifest = AssetModel.manifest;	
		AssetModel.loader.loadManifest(manifest, true, asset_path);
		
	};

	var post_init = function(){
		/* this function will be done differently at some point
		 * it'll have something to do with refactoring InitController
		 */

		//AssetModel.animations["ant"] = new createjs.SpriteSheet({
			//"framerate": 0.2,
			//"images": [get_asset("Ant1"), get_asset("Ant2"), get_asset("Ant3")],
			//"frames": { "regX": 3, "regY": 6, "height": 25, "width": 50, "count": 6},
			//"animations": {
				//"walk": [0, 1, "walk"],
				//"upside_down": [2, 3, "upside_down"],
				//"death": [4, 5, "death"]
			//}
		//})

	};
	

	var get_asset = function(id){

		var result = AssetModel.loader.getResult(id);

		if(!result){
			throw "Error: asset with id " + id + " could not be loaded." +
				" Check that id is valid and that assets were properly loaded";
		}
		
		return result;
	};
		


	
	return {
		init: init,
		get_asset: get_asset,
	};

})();

module.exports = AssetController;

var Includes = require("../Includes.js"); var include_data = Includes.get_include_data({
	current_module: "AssetController", 
	include_options: Includes.choices.DEFAULT
}); eval(include_data.name_statements); var include = function(){eval(include_data.module_statements);}


},{"../Includes.js":19}],4:[function(require,module,exports){
var EntityController = (function () {
    /* Description
    */

    var type_logic_table;

    var Count = 0;

    var init = function () {
        /* is ran from the InitController once when the game is loaded */

        include(); // satisfy requirements
		//type_logic_table = {
		//	"ant": AntLogic,
		//	"hero": HeroLogic,
		//	"companion": EsteemedCompanionLogic,
		//};

        type_logic_table = {
					"ant": AntLogic,
					"hero": HeroLogic,
					"Griffin": GriffinLogic,
					"Hyena": HyenaLogic,
					"Medusa": MedusaLogic,
					"pizza": PizzaLogic,
					"Centaur": CentaurLogic,
        };
        

        for (type in type_logic_table) {
            var logic = type_logic_table[type];
            logic.init();

            if (logic.begin_contact) {
                PhysicsController.listen_for_contact_with(type, "BeginContact", logic.begin_contact);
            }

            if (logic.end_contact) {
                PhysicsController.listen_for_contact_with(type, "EndContact", logic.end_contact);
            }

            if (logic.pre_solve) {
                PhysicsController.listen_for_contact_with(type, "PreSolve", logic.pre_solve);
            }

            if (logic.post_solve) {
                PhysicsController.listen_for_contact_with(type, "PostSolve", logic.post_solve);
            }

        }

    };


	var update = function(delta){
		/* is ran each tick from the GameController.update_all */
		var debug_commands = KeyboardController.debug_commands();

		// demonstration purposes
		if(debug_commands("spawn_ant")){
		    spawn((Math.random() * 50 + 10 + WorldController.get_movement_edge()), 10, "ant");
		}

		if (debug_commands("spawn_pizza")) {
		    spawn((Math.random() * 50 + 10 + WorldController.get_movement_edge()), 16, "pizza");
		}

		if(debug_commands("request_hero") && !EntityModel.hero_spawned){
			// if hero is requested, and not spawned yet,
			// spawn hero
			
			EntityModel.hero_spawned = true;
			spawn(WorldController.get_movement_edge() + 10,10, "hero");
		}

		if (debug_commands("spawn_griffin") && Count > 5) {
            var new_griffin = spawn(Math.random() * 50 + WorldController.get_movement_edge(), -20, "Griffin");
            Count = 0;
        }
        Count++;

        if (debug_commands("spawn_griffin")) {
            var new_griffin = spawn(Math.random() * 50 + WorldController.get_movement_edge(), 10, "Griffin");
        }


        // demonstration purposes for hyena
        if (debug_commands("spawn_hyena")) {
            var new_hyena = spawn(Math.random() * 50 + WorldController.get_movement_edge(), 10, "Hyena");
        }
		
		// demonstration purposes for Medusa
        if (debug_commands("spawn_medusa")) {
            var new_Medusa = spawn(Math.random() * 50 + WorldController.get_movement_edge(), 10, "Medusa");
        }

	    // demonstration purposes for Centaur
        if (debug_commands("spawn_centaur")) {
            var new_Centaur = spawn(Math.random() * 50 + WorldController.get_movement_edge(), 10, "Centaur");
        }
		

		/*
		//This should be handled in the update of MultiplayerSync
		if(Config.Remote.master){//if master, parse requests
			MultiplayerSyncController.receive_spawn_request();
		}else if(Config.Remote.connected){//if slave, parse notifications
			MultiplayerSyncController.receive_spawn_notification();
		}
		*/
		for (var type in EntityModel.for_logic_update) {
			var table = EntityModel.for_logic_update[type];

			var logic = type_logic_table[type];
			for (var id in table) {
				var entity = table[id];

				if (beyond_world_boundary(entity)) {
					// if outside boundaries of the world, despawn
					entity.point_value = 0;
					entity.die();
					if (entity.type == "hero") {
							entity.hp = 0;
					}
					console.log("entity of type", type, "deleted due to the world boundary");
				} else {
					// else tick its AI
					logic.tick_AI(entity);
				}
			}

		} // end for in 
				
		//Synchronize enemies
		if(Config.Remote.master){//This check should be moved to MultiplayerSyncController
			for (id in EntityModel.for_logic_update){
				for (var type in EntityModel.for_logic_update) {
					var table = EntityModel.for_logic_update[type];
					var logic = type_logic_table[type];
					for (var id in table) {
						sync_enemy(id);
					}
				}
			}
		}

		sync_hero();

	};

	var spawn = function(x, y, type){
		/**
		* spawn entity of type >type<
		* at position (x, y)
		* ! notice that it doesn't spawn entity directly, but instead sends the request
		* ! for the entity deletion, so undeterminate amount of time may pass from the
		* ! moment this function returned, until the entity is actually spawned
		* this time will usually be relatively small, probably 2-20 ticks or so for multiplayer
		*/

		MultiplayerSyncController.route_outcoming_packet({
			op: "spawn",
			type: type,
			x: x,
			y: y
		});
	};

	var handle_spawn = function(packet){
		/**
		* takes the packet with >op< "spawn"
		* containing properties >x<, >y<, >type<, and possibly more
		* handles creation of the entity, id assignment, etc.
		*/

		
		var x = packet.x,
			y = packet.y,
			type = packet.type;

		if(type_logic_table[type] == null){
			throw "No logic found for the type" + String(type);
		}

		var logic = type_logic_table[type];
		var entity = logic.spawn(x, y);

		if(type == "hero"){
			// TODO: move this whole thing into the HeroLogic.spawn?
			var player_id = packet.player_id;
			if(player_id == null){
				throw "player_id is undefined";
			}
			// identify the hero
			entity.player_id = player_id;
			// store it for EntityController purposes
			EntityModel.heroes[player_id] = entity;
		}

		IdentificationController.assign_id(entity);

		reg_for_logic_update(entity);

		RegisterAsController.register_as("awaiting_graphics_initialization", entity)
	};
	
	
	//registers a new instance
	//so that renderers and updaters know to update it on tick
	var reg_for_logic_update = function(new_entity){
		var type = new_entity.type;

		if(type == null){
			console.log(new_entity);
			throw "Type is undefined for this entity";
		}

		if(!EntityModel.for_logic_update[type]){
			EntityModel.for_logic_update[type] = {};
		}
		var logic_upd_table = EntityModel.for_logic_update[type];
		logic_upd_table[new_entity.id] =  new_entity;
		
	};
	
	//wrapper for universal spawn
	//maintains the old interface
	//var spawn = function(type,x,y){
		//MultiplayerSyncController.handle_spawn({type:type,x:x,y:y});
	//};
	
	var delete_entity = function(entity_instance){
		/**
		* This function is supposed to be called by the individual logic modules, when the are finished
		* animating deat/destruction of something and want to get rid of it, or in other circumstances,
		* when entity should be immediately deleted from the world
		* ! notice that it doesn't delete entity directly, but instead sends the request
		* ! for the entity deletion, so undeterminate amount of time may pass from the
		* ! moment this function returned, until the entity is actually deleted
		* this time will usually be relatively small, probably 2-20 ticks or so for multiplayer
		*/

		MultiplayerSyncController.route_outcoming_packet({
			op: "delete_entity",
			id: entity_instance.id,
			type: entity_instance.type,
		});

	};
	
	var handle_delete = function(packet){
		/**
		* This function will remove this entity along with some other info about this entity
		* from the world, it'll also free the id of this entity. The physical body will be deleted
		* too; 
		*/

		var entity_instance = EntityModel.for_logic_update[packet.type][packet.id];

		if(entity_instance == null){
			// if no such entity,
			// probably it was already deleted through other means,
			// thus abort
			return;
		}
	
		var type = entity_instance.type;
		if(type == null){
			console.log(entity_instance);
			throw "type is undefined for this entity";
		}

		var id = entity_instance.id;
		if(id == null){
			console.log(entity_instance);
			throw "id is undefined for this entity";
		}
		

		// TODO: finish this function and then update it regularly;
		// This one is very sensitive, as even one reference left may prevent 
		// object from being deleted and cause memory leaks. Testing is required
		if(entity_instance.body != null){
			var body = entity_instance.body;
		}else{
			// body is required. if place where body is stored changed, you should update this function
			throw "Body of the instance is undefined"
		}
		// remove graphics
			RegisterAsController.register_as("removed_entity", entity_instance);
		// remove physics
			PhysicsController.remove_body(body);
		// remove stored references within EntityController/Model
			delete EntityModel.for_logic_update[type][id];
			if(type == "hero"){
				delete EntityModel.heroes[entity_instance.player_id];
				EntityModel.hero_spawned = false;
			}
		// free the id
			IdentificationController.remove_id(id);
	};


    var despawn = function (entity) {
        /**
         * this function will despawn given entity
         * in one of two ways:
         * if entity has despawn function, it will be called
         * if not, entity will be deleted directly
        */

        var type = entity.type;
        var id = entity.id;


        if (entity.die) {
            // if custom despawn function is provided, call it
			entity.die();
            console.log("die called for the type", type);
        } else {
            // or delete directly
            delete_entity(entity);
			console.warn("die function not defined for the entity of type", type);
        }

    };


    var beyond_world_boundary = function (entity) {
        /**
        * checks if the entity is beyond one of the world boundaries,
        */
        var body = entity.body;
        return (body.GetWorldCenter().x < WorldController.get_movement_edge() ||
            body.GetWorldCenter().y > Config.World.maxy);

    };
		
		
	var create_abstract_entity = function(){
		return new AbstractEntity();
	};
		
		
	/**
	class AbstractEntity
	member functions:
		//numbers are given in meters rather than pixels except where noted (1 meter = 30 pixels)
		VOID jump(double x, double y)
					applies an impulse with x_component x and y_component y
		VOID jump_direction(double angle, double force)
					where angle is in degrees. calls jump internally
		VOID move(double speed)
					causes the entity to move horizontally at speed/tick. 
		BOOL enemy_in_range
					returns true if any hero is within range (x axis only)
		BOOL direction_nearest_enemy()
					returns true (right) if the nearest enemy is to the right, else returns false (left)
		VOID take_damage()
					checks if damage has been dealt this tick and resolves it 
		VOID die()
					should be called each tick that hp <= 0. handles death and decay
		b2dFixture get_fixture(string name)
					given a name, returns the first fixture in entity.body with matching name. default names are "top", "bottom", "left", "right", and "main".
		BOOL movement_voluntary()
					returns true if the object is moving in the same direction it is facing, else false
		BOOL in_air()
					returns true if there are no objects immediately below the entity, else false
		BOOL path_free()
					returns true if their is an object immediately adjacent to the entity in the currently faced direction
		VOID change_animation(string animation_id)
					sets the animation for the entity, and ensures that the animation will not be continuously reset.
	*/
	this.AbstractEntity = function(){
		this.hp = 2;
		this.speed = 7;
		this.jump_force = 125;
		this.damage = 5;
		this.point_value = 0;
		this.sight_range = 16; //distance at which entity detects heroes
		this.attack_range = 8; //distance at which entity leaps at the hero
		
		this.hit_taken = false; //whether a hit has been taken since the last tick
		this.damage_taken = 0; //the amount of damage inflicted by hits since the last tick
		
		this.direction = false;	//false=left, true=right;
		this.direction_previous = false;//store direction from end of previous tick
		this.x_previous = 0;		//store x value from end of previous tick
		this.y_previous = 0;		//store x value from end of previous tick
		this.velocity_previous = new B2d.b2Vec2(0,0);
		
		this.is_idle = true; //determines whether entity is aggressive or idle
		this.idle_duration = 40; // time buffer between changing idle states
		this.idle_timer = this.idle_duration;
		this.idle_counter = 0; //used to manage the number of times the entity has changed state while idle
		this.is_alive = true; //disables attacking and plays death animation while false
		this.death_duration = 30;//time between death and deletion
		this.decay_duration = 20;//time between decay animation and deletion
		this.death_timer = -1;
		this.running_away = false; //whether the entity is running away
		this.run_away_duration = 30; //set cowardice level
		this.run_away_timer = -1;
		this.can_attack = true;	//whether attacking is enabled
		this.attack_cooldown = 10; //attack cooldown
		this.attack_cooldown_timer = -1;
		this.can_leap = true;		//leaping enabled
		this.leap_cooldown = 40;//minimum time between leaps
		this.leap_cooldown_timer = -1; 
		this.charge_duration = 80;//maximum length of a charge
		this.charge_timer = this.charge_duration;
		this.charge_cooldown = 20;//minimum time between charges
		this.charge_cooldown_timer = -1;
		this.blinking = false;	//whether entity is blinking
		this.blink_duration = 20;//how long the entity blinks after taking damage
		this.blink_timer = -1;
		this.maintenance_frequency = 20;//ticks between routine maintenance checks
		this.maintenance_timer = this.maintenance_frequency;
		
		this.path_blocked = false;//is this deprecated? set during collision
		this.obstruction_tolerance = 4;//how many times the entity can be blocked before he takes action
		this.blocked_count = 0;//tracks number of times blocked between maintenance checks
		
		this.needs_graphics_update = false; //accessed by renderer for animation purposes
		this.animation = "stand"; //accessed by renderer for animation purposes
		this.player_id=-1
		//boost entity
		this.jump = function(x,y){
			var body = this.body;
			var direction = new B2d.b2Vec2(x, y);
			body.ApplyImpulse(direction, body.GetWorldCenter());
		};
		
		//converts angle and force into x and y, then calls jump
		this.jump_direction = function(angle,force){
			var x,y;
			angle = ((angle%360)*Math.PI)/180;
			x = force*Math.cos(angle);
			y = force*Math.sin(angle);
			this.jump(x,y);
		};
		
		
		//move speed in current direction
		this.move = function(speed){
			var dir = (this.direction*2-1);
			var velocity = this.body.GetLinearVelocity();
			velocity.x = speed*dir; 
			this.body.SetLinearVelocity(velocity);
			this.body.SetAwake(true);
		};
			
		//check for enemies in range (vision or jump)
		this.enemy_in_range = function(range){
			var hero_x;
			var output = false;
			//Multiplayer
			var hero_list = EntityController.get_all_heroes();
			if(hero_list.length != null){
				for (i=0; i<hero_list.length; i++){
					if(hero_list[i] != null){
						hero_x = hero_list[i].body.GetWorldCenter().x
						if(Math.abs(hero_x - this.body.GetWorldCenter().x) < range){
							output = true;
							break;
						}
					}
				}
			}else if(EntityController.get_my_hero() != null){
				var hero = EntityController.get_my_hero();
				if(hero != null){
					hero_x = hero.body.GetWorldCenter().x;
					output = (Math.abs(hero_x - this.body.GetWorldCenter().x) < range);
				}
			}
			return output;
		};
		
		//returns the direction of nearest enemy
		this.direction_nearest_enemy = function(){
			//in multiplayer, first find nearest enemy
			var nearest, hero_x; 
			var distance = 0;
			var x = this.body.GetWorldCenter().x;
			var hero_list = EntityController.get_all_heroes();
			if(hero_list.length != null){
				for(i=0;i<8;i++){
					if(hero_list.i != null){
						if(Math.abs(hero_list.i.body.GetWorldCenter().x - x) < Math.abs(nearest.body.GetWorldCenter().x - x) || nearest == null){
							nearest = hero_list.i;
						}
					}
				}
				hero_x = nearest.body.GetWorldCenter().x;
				distance = (hero_x - x);
			}else if(EntityController.get_my_hero() != null){
				distance = EntityController.get_my_hero().body.GetWorldCenter().x - x;
			}
			return (distance > 0);//return true/right of distance is positive, return false/left if distance is negative
			/*
			//single player implementation
			var nearest;
			var hero_x = EntityController.get_my_hero().body.GetWorldCenter().x;
			var distance = (hero_x - this.body.GetWorldCenter().x);
			return (distance > 0);//return true/right of distance is positive, return false/left if distance is negative
			*/
		};
		
		//decrease health
		this.take_damage = function(){
			this.hp -= this.damage_taken;
			this.damage_taken = 0;
			this.hit_taken = false;
			this.blinking = true;
			this.blink_timer = this.blink_duration;
			//knockback here
		};
		
		//die
		this.die = function(){
			if (this.is_alive){//if alive, kill it
				this.death_timer = this.death_duration;
				this.is_alive = false;
				WorldController.increase_score(this.point_value);//if died from damage, grant score
				this.hit_taken = false;
				this.can_attack = false;
				this.change_animation(this,"death");
				return ;
			}else{//else decay
				this.death_timer--;
				if (this.death_timer <= this.death_duration && this.death_timer > this.decay_duration && this.death_timer > 0){
					this.change_animation("death");
				} else if (this.death_timer <= this.decay_duration && this.death_timer > 0){
					this.change_animation("decay");
				} else {
					var dif = Math.floor(WorldController.get_movement_edge()/200)+1;
					var rand = Math.random()*100;
					if(rand < 50/dif && this.point_value != 0){
						spawn((this.body.GetWorldCenter().x), (this.body.GetWorldCenter().y), "pizza");
					}
					EntityController.delete_entity(this);//remove instance from memory
				}
				return;
			}
		}
		
		//takes a string as parameters. returns the fixture with fixture_name == name, or null if it does not exist
		this.get_fixture = function(entity,name){
			var current_fixture = entity.body.GetFixtureList();
			while (current_fixture != null){
				if (current_fixture.GetUserData() != null){
					if (current_fixture.GetUserData().name == name){
						break;
					}
				}
				current_fixture = current_fixture.GetNext();
			}
			if (current_fixture.GetUserData() == null){
				current_fixture = null;
			}else if (current_fixture.GetUserData().name != name){
				current_fixture = null;
			}
			return current_fixture;
		};
		
		//checks if movement is voluntary or forced
		this.movement_voluntary = function(){
			//if direction being faced is different from the direction moving, return false
			var output = true;
			var velocity = this.body.GetLinearVelocity().x;
			if(velocity != 0){
				output = (velocity/Math.abs(velocity) == (this.direction)*2-1);
			}
			return output;
		};

		//checks if in the air
		this.in_air = function(){
			var body = this.body;
			var objects_beneath;
			if (body.GetFixtureList() != null){//prevent bugs on destruction
				var AABB = body.GetFixtureList().GetNext().GetNext().GetAABB();
				objects_beneath = PhysicsController.query_aabb(AABB);
			}else{
				objects_beneath = 0;
			}
			return (objects_beneath < 5);//for some mysterious reason, it counts 4 collisions even in mid air
		};

		//checks if there is a collision in current direction
		this.path_free = function(){
			var body = this.body;
			var objects_before;
			var AABB;
			if (body.GetFixtureList() != null){//prevent bugs on destruction
				if (this.direction){
					AABB = body.GetFixtureList().GetAABB();
					objects_before = PhysicsController.query_aabb(AABB);
				}else{
					AABB = body.GetFixtureList().GetNext().GetAABB();
					objects_before = PhysicsController.query_aabb(AABB);
				}
			}else{
				objects_before = 0;
			}
			return (objects_before < 4);//assumes contact with bottom sensor, top sensor, and main shape 
		};

		//setter for animation variable, ensures the animation is only reset on actual change
		this.change_animation = function(new_animation){
			if(this.animation != new_animation){
				this.animation = new_animation;
				this.needs_graphics_update = true;
			}else{ 
				this.needs_graphics_update = false;
			}
			this.jump_tick = 1; //for hero jump tick
		};
	}; // end AbstractEntity
	
	var sync_hero = function(){
		/**
		* send synchronization information for the hero,
		* if needed (if something important changed)
		*/

		var my_hero = EntityModel.heroes[NetworkController.get_network_id()];

		if(my_hero){
			var velocity = my_hero.body.GetLinearVelocity();
			var old_velocity = EntityModel.hero_last_velocity;

			var difference = Math.sqrt(Math.pow(velocity.x - old_velocity.x, 2) + Math.pow(velocity.y - old_velocity.y, 2))

			if(difference != 0){
				// if different
				var position = my_hero.body.GetWorldCenter();
		
				MultiplayerSyncController.route_outcoming_packet({
					op: "hero_sync",
					velocity: {x: velocity.x, y: velocity.y},
					position: {x: position.x, y: position.y}
				});
			}

			EntityModel.hero_last_velocity = {x: velocity.x, y: velocity.y};
		}


		// check velocity change
		
		// send if needed
		
	};
	
	var sync_enemy = function(id){
		/**
		* send synchronization information for enemies,
		* if needed (if something important changed)
		*/

		var entity = IdentificationController.get_by_id(id);

		if(entity){
			var position = entity.body.GetWorldCenter();
			var velocity = entity.body.GetLinearVelocity();
			var old_velocity = entity.velocity_previous;
			var old_position = new B2d.b2Vec2(entity.x_previous, entity.y_previous);

			var vel_difference = Math.sqrt(Math.pow(velocity.x - old_velocity.x, 2) + Math.pow(velocity.y - old_velocity.y, 2));
			var pos_difference = Math.sqrt(Math.pow())

			if(vel_difference != 0){
				// if different, send update packet
				MultiplayerSyncController.route_outcoming_packet({
					op: "enemy_sync",
					entity_id: entity.id,
					//hp: entity.hp,
					direction: entity.direction,
					velocity: {x: velocity.x, y: velocity.y},
					position: {x: position.x, y: position.y}
				});
			}
			EntityModel.hero_last_velocity = {x: velocity.x, y: velocity.y};
		}
		// check velocity change
		// send if needed
	};
	
	var handle_hero_sync = function(packet){
		/**
		* handle the sync request for the hero
		* synchronize velocity and the position
		*/
		
		if(packet.player_id == NetworkController.get_network_id()){
			return;
		}
		
		var player_id = packet.player_id;

		var hero = EntityModel.heroes[player_id];

		if(hero == null){
			console.warn("hero is not defined for the player_id", String(player_id));
		}else{

			var vel = new B2d.b2Vec2(packet.velocity.x, packet.velocity.y);
			var pos = new B2d.b2Vec2(packet.position.x, packet.position.y);
			
			hero.body.SetLinearVelocity(vel);
			hero.body.SetPosition(pos);
		}
		
	};
	
	var handle_enemy_sync = function(packet){
		/**
		* handle the sync request for the hero
		* synchronize velocity and the position
		*/
		
		if(packet.player_id == NetworkController.get_network_id()){
			return;
		}
		
		var entity_id = packet.entity_id;
		
		
		var entity = IdentificationController.get_by_id(entity_id);
		//var type = entity.type;
		//console.log("entity id: ", entity.player_id, " Type: ", type);
		if(entity == null){
				console.warn("entity is not defined for the entity_id ", String(player_id));
		}
		else{
			if(entity.type != "hero"){
				var vel = new B2d.b2Vec2(packet.velocity.x, packet.velocity.y);
				var pos = new B2d.b2Vec2(packet.position.x, packet.position.y);
				
				entity.body.SetLinearVelocity(vel);
				entity.body.SetPosition(pos);
				entity.direction = packet.direction;
				//entity.hp = packet.hp;
			}
		}
	};

	var get_all_heroes = function(){
		/**
		* return table with network ids associated with corresponging hero instances
		*/
		
		return EntityModel.heroes;
	};

	var get_my_hero = function(){
		/**
		* get the hero for this player
		*/

		return get_all_heroes()[NetworkController.get_network_id()];
		
	};
	

	
	return {
		// declare public
		init: init, 
		update: update,
		//get_operation: get_operation,
		reg_for_logic_update: reg_for_logic_update,
		spawn: spawn,
		delete_entity: delete_entity,
		despawn: despawn,
		//fulfill_delete_request: fulfill_delete_request,
		handle_spawn: handle_spawn,
		handle_delete: handle_delete,
		handle_hero_sync: handle_hero_sync,
		handle_enemy_sync: handle_enemy_sync,

		get_all_heroes: get_all_heroes,
		get_my_hero: get_my_hero,
		create_abstract_entity: create_abstract_entity,
    };
})();

module.exports = EntityController;

var Includes = require("../Includes.js"); var include_data = Includes.get_include_data({
    current_module: "EntityController",
    include_options: Includes.choices.DEFAULT | Includes.choices.LOGIC
}); eval(include_data.name_statements); var include = function () { eval(include_data.module_statements); }

},{"../Includes.js":19}],5:[function(require,module,exports){


var GameController = (function(){

	var init = function(){
		include();
	};
		

	var update_all = function(event){
		/*
		 * main function pretty much
		 * everyghing else is called from here every tick
		 */
		KeyboardController.update(delta);

	    var cmds = KeyboardController.pause_commands();
	    if (cmds("pause") && GameModel.pauseCounter > 10 && GraphicsController.get_health() > 0) {
	        createjs.Ticker.paused = !createjs.Ticker.paused;
	        GameModel.pauseCounter = 0;
	        console.log("pause");
	    }
	    GameModel.pauseCounter += 1;
		
		if (!createjs.Ticker.paused){
			var delta = event.delta;

			// !!!! world simulation step goes somewhere right here
			// as per current design, will take delta as an argument
		
			//TerrainController.generate_terrain(); 
			//PlayerController.update();
		
			IdentificationController.update(delta);
			WorldController.update(delta);

			TerrainController.update(delta);
			EntityController.update(delta);

			// Should be called after all movement of objects is done:
			//HUDController.update();
			//BackgroundController.update();
			GraphicsController.update();
			GraphicsController.update(delta);

			MultiplayerSyncController.update(delta);
			NetworkController.update(delta);
		}
	};

	var stop_game = function(){
		/**
		* stop the game. 
		* this one prevents any controller updates except Game and Keyboard
		* different from the PAUSE for multiplayer purposes
		*/

		createjs.Ticker.paused = true;
		
	};

	var continue_game = function(){
		/**
		* continue game
		*/
		
		createjs.Ticker.paused = false;

	};

	return {
		init: init,
		update_all: update_all,
		stop_game: stop_game,
		continue_game: continue_game,
	};

})();

module.exports = GameController;

var Includes = require("../Includes.js"); var include_data = Includes.get_include_data({
	current_module: "GameController", 
	include_options: Includes.choices.DEFAULT
}); eval(include_data.name_statements); var include = function(){eval(include_data.module_statements);}


},{"../Includes.js":19}],6:[function(require,module,exports){
/*
GraphicsController
	Public Functions:
	-init()
		sets up the GraphicsController for the rest of the game, called once during initialization
	-update(int delta)
		common function, called each tick. performs routine graphics maintenance
		registers all instances that were marked for registration since the last tick
		renders all registered instances
	-get_stage()
		returns the stage object, an easeljs object that stores information about the game
	-get_camera()
		returns the camera object, which controls the view offset
	-get_asset(string id)
		retrieves the asset with id; an alias for the same function in AssetController
	-reg_for_render(Easeljs_obj sprite, Object entity_instance)
		links an entity with a sprite and registers it to be rendered each tick
	-set_reg_position(easeljs_obj,int offset_x,int offset_y)
		adjusts a sprites x and y offsets to conform to the box2d system
	-request_bitmap(string? id)
		retrieves a previously loaded asset as a sprite
	-request_animated(string id, string||int start_animation/start_frame)
		returns a new sprite object generated from the image id and the start frame
	-destroy_graphics_for(int id)
		destroys the graphics objects associated with the instance of the passed id
	-follow(int id)
		sets the camera to follow the object of the passed id
	-get_movement_edge()
		returns left camera bound, a.k.a, the movement edge. used for lots of things
		
*/
var GraphicsController = (function(){
	/* 
	Controls all graphics and provides an interface for common easel.js functions
	*/
	
	var get_asset; 
	var type_renderer_table;
	var PrivateGraphics; 
	var reRender = false;

	var init = function(){
		/* is ran from the InitController once when the game is loaded */
		include(); // satisfy requirements

		//All renderers must be registered here
		//Links each renderer with its object id
		type_renderer_table = {
		// type:	renderer:
			"ant": AntRenderer,
			"hero": HeroRenderer,
			"Griffin": GriffinRenderer,
			"Medusa": MedusaRenderer,
            "Centaur": CentaurRenderer,
			"Hyena": HyenaRenderer,
			"terrain_cell": TerrainCellRenderer,
			"terrain_slice": TerrainSliceRenderer,
			"companion": EsteemedCompanionRenderer,
            "pizza": PizzaRenderer,
		};

		get_asset = AssetController.get_asset; // for quicker access

		GraphicsModel.stage = new createjs.Stage(Config.MAIN_CANVAS_NAME);
		GraphicsModel.stage.canvas.width = Config.SCREEN_W;
		GraphicsModel.stage.canvas.height = Config.SCREEN_H;
		
		GraphicsModel.camera.offset_from_followed.x -= (1614 - GraphicsModel.stage.canvas.width) / 3;

		// init all renderers
		for(type in type_renderer_table){
			type_renderer_table[type].init();
		}

		// this object is passed to all renderers to give them access to functions
		// that no one else is supposed to be able to access
		PrivateGraphics = {
			stage: GraphicsModel.stage,
			request_bitmap: request_bitmap,
			request_animated: request_animated,
			get_asset: get_asset,
			trans_xy: trans_xy,
			reg_for_render: reg_for_render,
		};

		BackgroundRenderer.init();
		HUDRenderer.init();

	};

    
	var update = function(delta){
		/* is ran each tick from the GameController.update_all */
		
		update_camera(); // needs to be updated first

		destroy_unneeded(); // goes second, do not update any stuff before unneeded stuff is removed

		register_new_stuff();

		render_things();
		
		synchronize_to_physical_bodies();

		BackgroundRenderer.render();
		
		HUDRenderer.render();
		
		GraphicsModel.stage.update();
	};

	var destroy_unneeded = function(){
		/**
		* destroy graphics for everything that was marked
		* for destruction
		*/

		var slices = RegisterAsController.retrieve_registered_as("removed_slice");

		var entities = RegisterAsController.retrieve_registered_as("removed_entity");

		while(slices.length > 0){
			var slice = slices.pop();
			var grid = slice.grid;

			for(var i = 0; i < grid.length; i++){
				var row = grid[i]; // or is it a column?

				for(var j = 0; j < row.length; j++){
					var cell = row[j];
					if(cell.kind != 0){
						destroy_graphics_for(cell.id);
					}
				}
			}
			
		}
		
		while(entities.length > 0){
			var entity = entities.pop();
			destroy_graphics_for(entity.id);
		}
	};
	
	

	var follow = function(id){
		//order camera to follow the graphical representation
		//of an object with the given id, if it exists
		GraphicsModel.camera.following = GraphicsModel.all_physical[id];
	};
	
	
	var register_new_stuff = function(){
		//search through all instances in the queue 
		//and register them for graphics updates.

		// retrieve instances of physical things that do not have graphics yet
		var new_stuff = RegisterAsController.retrieve_registered_as("awaiting_graphics_initialization");

		var length = new_stuff.length
		for(var i = 0; i < length; i++){
			var new_obj = new_stuff.pop();
			if(type_renderer_table[new_obj.type]){
				// if renderer exists for this type, register through it
				type_renderer_table[new_obj.type].register(new_obj, PrivateGraphics);	
			}else{
				throw "No renderer found for the type " + String(new_obj.type) +
					" confirm that renderer exists and is added to the GraphicsController.type_renderer_table"
			}
		}
	};
	
	var render_things = function(){
		/**
		* call renderers for everything
		*/
		
		var to_render = GraphicsModel.special_render;

		for(var type in to_render){
			var table = to_render[type];
			var renderer = type_renderer_table[type];

			for(var id in table){
				sprite_animate(table[id], PrivateGraphics);
			}
		}
		
	};
	
	var sprite_animate = function(sprite){
		//set graphical representation based on the animation variable determined by the AI
		//set animation
		if(sprite.physical_instance.needs_graphics_update){
			var animation = sprite.physical_instance.animation;
			sprite.gotoAndPlay(animation)
			sprite.needs_graphics_update = false;
		}
		
		//set direction
		if (sprite.physical_instance.direction){ //if direction == right, flip right
			sprite.scaleX = -1;
		}else{ //else flip left
			sprite.scaleX = 1;
		}

		//set alpha if blinking
		if(sprite.physical_instance.blinking && sprite.physical_instance.blink_timer%2 == 1){
			sprite.alpha = 0;
		}else{
			sprite.alpha = 1;
		}
	};

	//called from update(), maintains camera position
	var update_camera = function(){
		var camera = GraphicsModel.camera;
		var center = camera.center;
		
		center.x = Config.SCREEN_W/2 - camera.offset_from_followed.x;
		//CAMERA SHOULD NOT MOVE VERTICALLY
		//center.y = Config.SCREEN_H/2 - camera.offset_from_followed.y;
		
		if(camera.following != null){
		    camera.offset.x = center.x - camera.following.physical_instance.body.GetWorldCenter().x * Config.B2D.SCALE;
			camera.offset.y = center.y - camera.following.physical_instance.body.GetWorldCenter().y * Config.B2D.SCALE;
			// now, we do not want the camera to display what is behind the movement edge. but the camera is a relative thing
			// so we can't just limit some sort of x position or such.
			// I'll use the following technique: 
			//   1. calculate were the physical movement edge would be if drawn right now to the canvas
			//   2. if it would be displayed on-screen, offset camera so that it wouldn't be anymore

			var mov_edge_graphics_x = (WorldController.get_movement_edge() * Config.B2D.SCALE) + camera.offset.x;

			// recall that left display edge is 0 for graphics, as (0, 0) is the top-left corner
			if(mov_edge_graphics_x > 0){
				// if movement edge would be displayed
				camera.offset.x -= mov_edge_graphics_x;
			}
		}
		if (camera.offset.y < 0) {
		    camera.offset.y = 0;
		}

		adjust_debug_draw(); // goes last
	};

	


	//*************************************
	var adjust_debug_draw = function(){
		var camera = GraphicsModel.camera;
		TestController.set_debug_offset(camera.offset.x, camera.offset.y);
	};

	var request_bitmap = function(id){
		// if id is invalid, throw meaningful exception?
		var bitmap = new createjs.Bitmap(get_asset(id));
		// more complicated setting for registration position may be needed, depending on the body attached
		if (!(bitmap.image)){
			throw "Error: image wasn't correctly loaded for this bitmap";
		}
		
		bitmap.regX = bitmap.image.width/2;
		bitmap.regY = bitmap.image.height/2;

		return bitmap;
		// TODO research DisplayObject's caching. and maybe incorporate
	};
	
	
	var request_animated = function(id, start_frame){
		// this implementation is temporary
		// until I setup efficient facility for defining spritesheets
		// within GraphicsController

		if(!id || !start_frame){
			if(!id){
				throw "wrong id";
			}else{
				throw "wrong start_frame";
			}
		};

		var sprite = new createjs.Sprite(id, start_frame);

		return sprite;
	};

	
	//converts easeljs origins to box2d origins
	var synchronize_to_physical_bodies = function(){

		var tiles = GraphicsModel.all_physical;

		for(var id in tiles){
			var tile = tiles[id];
			var body = tile.physical_instance.body;
			var tile_pos = trans_xy(body.GetWorldCenter());

			tile.x = tile_pos.x;
			tile.y = tile_pos.y;
		}
	};
	

	var trans_xy = function(position_vector_unscaled){
		// takes position vector with values in meters, translates
		// it to pixel position taking the camera position into account
		var camera = GraphicsModel.camera;

		var x = (position_vector_unscaled.x * Config.B2D.SCALE) + camera.offset.x;
		var y = (position_vector_unscaled.y * Config.B2D.SCALE) + camera.offset.y;

		return {x: x, y: y};	
	};

	var set_reg_position = function(easeljs_obj, offset_x, offset_y){
		// sets registration position of the easeljs object
		// regisration position is the relative point of the object
		// that you move when you set object's x and y coordinats
		// i.e. if reg. position of the player is head, and you set their
		// position to (0, 0), their head will be at (0, 0)
		// currently the registration position is set to the middle of the body
		// to match what box2d does
		// last two arguments are optional and set PIXEL offset from the normal registration
		// position
		
		// this if statement should be temporary
		if(easeljs_obj.image){
			var w = easeljs_obj.image.width;	
			var h = easeljs_obj.image.height;	
		}else{
			var w = easeljs_obj.spriteSheet._frameWidth;
			var h = easeljs_obj.spriteSheet._frameHeight;
		};

		var offset_x = offset_x || 0;
		var offset_y = offset_y || 0;

		easeljs_obj.regX = w/2 + offset_x;
		easeljs_obj.regY = h/2 + offset_y;

	};

	var reg_for_render = function(easeljs_obj, physical_instance){
		// registeres object for rendering within graphics controller
		// if (OPTIONAL!) physical_instance is given, graphics controller will automatically
		// set the easeljs_obj's position to position of that body, each tick.
		// if the type of the physical instance is associated with some renderer
			
		
		if(physical_instance){

			if(physical_instance.body == null){
				// are you trying to do something terrible? such as registering
				// some object that doesn't need graphical representation?
				throw "Physical instance is provided, but it has no body";
			}
			var id = physical_instance.id;
			var type = physical_instance.type;

			if(id == null || type == null){
				throw "Id or type is undefined for this physical instance";
			}

			easeljs_obj.physical_instance = physical_instance;
			GraphicsModel.all_physical[id] = easeljs_obj;

			if(!GraphicsModel.special_render[type]){
				GraphicsModel.special_render[type] = {};
			}

			GraphicsModel.special_render[type][id] = easeljs_obj;
		}


		AddToStage(easeljs_obj);
	};

	var AddToStage = function(element){
		// can be updated later to manage z-index or whatever
		GraphicsModel.stage.addChild(element);
	};
	

	var get_stage = function(){
		return GraphicsModel.stage;
	};
	
	var get_camera = function(){
		return GraphicsModel.camera;
	};
	
	var destroy_graphics_for = function(id){
		/**
		* remove from the stage and destroy graphics instances for the object with the given id
		* this includes removing all references to it.
		* TODO: IMPORTANT!!! if GraphicsController was updated to store more
		* references to some graphics instances, UPDATE this function to reflect changes
		* even a single reference to the object may cause it to stay in memory
		*/
		

		if(GraphicsModel.all_physical[id] != null){
			var graphics_instance = GraphicsModel.all_physical[id];
		}else{
			// if you encounter this exception, maybe implementation changed. 
			// If that's the case, some things need rewriting. This function in
			// prticular. Or maybe there is a bug.
			throw "The graphics object with id " + String(id) + " isn't registered as having physical body";
		}

		if(graphics_instance.physical_instance.type != null){
			var type = graphics_instance.physical_instance.type;

		}else{
			// if you encounter this exception it may mean a bug, or alternatively
			// it may mean that implementation changed and this function needs an update
			throw "Physical instance with id " + String(id) + " doesn't seem to have a type";
		}
		
		// remove from the stage 
		
			/* graphics_instance.removeAllEventListeners(); 
			   could be necessary to remove attached event listeners, but it seems, at least
			   so far, that this stuff is done automatically be easeljs */

			GraphicsModel.stage.removeChild(graphics_instance);

		// remove from all_physical (responsible tracking for body position)
			delete GraphicsModel.all_physical[id];
		// remove from special_render
			delete GraphicsModel.special_render[type][id];
		// TODO: remove camera reference if following this object
			
	};

	return {
		// declare public
		init: init, 
		update: update,
		get_stage: get_stage,
		get_camera: get_camera,
		get_asset: get_asset,
		reg_for_render: reg_for_render,
		set_reg_position: set_reg_position,
		request_bitmap: request_bitmap,
		request_animated: request_animated,
		destroy_graphics_for: destroy_graphics_for,
		follow: follow,
	};
})();

module.exports = GraphicsController;

var Includes = require("../Includes.js"); var include_data = Includes.get_include_data({
	current_module: "GraphicsController", 
	include_options: Includes.choices.DEFAULT | Includes.choices.RENDERERS
}); eval(include_data.name_statements); var include = function(){eval(include_data.module_statements);}


},{"../Includes.js":19}],7:[function(require,module,exports){

var IdentificationController = (function(){
	/* Is in charge of giving unique ID's to everything
	 * that wants them
	*/

	var init = function(){
		/* is ran from the InitController once when the game is loaded */

		include(); // satisfy requirements

		// create 100 id's
		for(var i = 0; i < 100; i++){
			var id = IdentificationModel.next_id ++;
			IdentificationModel.free_ids.push(id);
			IdentificationModel.id_matching[id] = null;
		}

	};

	var update = function(delta){
		/* is ran each tick from the GameController.update_all */
		// cleanup ids, if too many free ids (like if non-free id's < free id's/10
		
		//TODO: make function to actually be called from the GameController.update_all
		// TODO: loop through all non-free id's, and if any of them reference null,
		// remove (unregister) them;
		var cmds = KeyboardController.debug_commands();
		
		if(cmds("show_ids")){
			console.log(IdentificationModel.free_ids, IdentificationModel.next_id);
		}

	};

	var assign_id = function(obj, set_id){
		/**
		* assigns id to the object
		* sets property id on the object given. you can give OPTIONAL parameter
		* set_id which should be a function that takes object and id and assigns
		* id to the object. this can be useful if you want to store id in some unusual
		* place, or perform some extra operations before id is assigned
		*
		* return id assigned
		* IdentificationController will remember that this id has been assigned
		* this object
		*/
		var free = IdentificationModel.free_ids;
		var id;

		// get free id
		if(free.length > 0){
			id = free.pop();
		}else{
			id = IdentificationModel.next_id++;
		}

		// set id on the object. through function if provided
		if(set_id){
			set_id(obj, id);
		}else{
			obj.id = id;
		}

		// associate id with the object obj
		IdentificationModel.id_matching[id] = obj;

		return id
	};

	var reserve_id = function(){
		/**
		* returns free id and promises not to overite it
		* also allows someone to force this id
		*/
		var free = IdentificationModel.free_ids;
		// get free id
		if(free.length > 0){
			id = free.pop();
		}else{
			id = IdentificationModel.next_id++;
		}

		IdentificationModel.reserved.push(id);

		return id;

	};
	

	var force_id = function(obj, id, set_id){
		/**
		* Force object >obj< to have the given id >id<
		* If id isn't free, exception is thrown
		* This function is most likely used directly only for the multiplayer
		* purposes 
		* If OPTIONAL function >set_id< is given, it'll be called instead
		* of assigning ids directly (use this if special manipulations should be done)
		*
		*/

		var free = IdentificationModel.free_ids;
		var reserved = IdentificationModel.reserved;

		var idx = free.indexOf(id); 
		var idy = reserved.indexOf(id);

		if(idx >= 0){
			var id = free.splice(idx, 1); // extract the desired index 
		}else if (idy >= 0){
			var id = reserved.splice(idx, 1); // extract the desired index 
		}else{
			// if not found, then non-free id, then exception
			throw "The id " + String(id) + " is non-free";
		}
	
		// set id on the object. through function if provided
		if(set_id){
			set_id(obj, id);
		}else{
			obj.id = id;
		}

		// associate id with the object obj
		IdentificationModel.id_matching[id] = obj;

		return id;

	};

	var get_by_id = function(id){
		/**
		* get object associated with the given id
		*/
		return IdentificationModel.id_matching[id];
	};

	var remove_id = function(id){
		/**
		* mark id as free and no longer assiciate it with any object
		* notice that you yourself is responsible for making sure
		* that object that was associated with this id doesn't think
		* that he is still assigned this is
		*/

		// TODO: make sure that all known places that use ids (PhysicsControllers'
		// contact listener for example) are notified that id had been unregistered
		delete IdentificationModel.id_matching[id];
		IdentificationModel.free_ids.push(id);
	};
	
	var assign_type = function(obj, type){
		/**
		* assigns wanted type (string) to the given
		* model definition
		* if you try to assign same type twice, throws exception;
		* Id...Controller allows you to retrieve model
		*/

		var types = IdentificationModel.types;
		if(types[type]){
			throw "Error: type " + type + " is already registered. " +
				"You can't register the same type twice";
		}else{
			types[type] = obj;
			obj.prototype.type = type;
		}
		
	};
	
	var get_by_type = function(type){
		/**
		* gets object by it's type
		*/
		var types = IdentificationModel.types;
		if(types[type]){
			return types[type];
		}else{
			throw "Error: type " + type + " wasn't defined yet";
		}
	};
	
	
	
	
	return {
		// declare public
		init: init, 
		update: update,
		assign_id: assign_id,
		reserve_id: reserve_id,
		force_id: force_id,
		get_by_id: get_by_id,
		remove_id: remove_id,
		assign_type: assign_type,
		get_by_type: get_by_type,
	};
})();

module.exports = IdentificationController;

var Includes = require("../Includes.js"); var include_data = Includes.get_include_data({
	current_module: "IdentificationController", 
	include_options: Includes.choices.DEFAULT
}); eval(include_data.name_statements); var include = function(){eval(include_data.module_statements);}


},{"../Includes.js":19}],8:[function(require,module,exports){
var InitController = (function(){
	// why do you want to put initialization of everything into the InitController?
	// Because if initialization of smth depends on initialization of smth else,
	// it's easier to control here
	//
	// e.g. if you try to do var foo = $('#foo'); somewhere in other module,
	// you can get foo = null; as code of that module can execute before the html document
	// was fully loaded, but >InitController.init< is called after document was loaded, so
	// -1 potential problem. Btw, at this moment in time the the stuff is set to work that way
	// using html (<body onload=...); maybe using JS would be better? Idk;
		

	var init = function(mode, session_id, player_id, player_id_array){
		include();

		Config.Init.mode = mode;
		Config.Init.session_id = session_id;
		Config.Init.player_id = player_id;
		Config.Init.player_id_array = player_id_array;

		enable_arrowkey_scroll(false);
		setup_screen();
		setup_events();

		init_all_modules(mode); // call .init function of everyone. e.g. PlayerController.init(); etc.

		
		// Notice that asset dependent stuff doesn't (and mustn't) start until
		// all assets are completely loaded. That includes ticker, i.e. no ticks are processed
		// until everything is loaded. If you want something different, e.g. display some sort of loading
		// animation - let me know.
		// Look into the setup_asset_dependent function
			AssetModel.loader = new createjs.LoadQueue(false); // loading resourses using preload.js
			AssetModel.loader.addEventListener("complete", setup_asset_dependent);

		// if more stuff needs to be done for the test mode, 
		// or more types of it needs to be added
		// you can safely make the following a separate function
			var asset_path = (mode == "test") ? "./assets/art/" : "../GameCode/assets/art/";

		AssetController.init(asset_path);


	};

	var init_all_modules = function(mode){
		// TODO: better way to do stuff like that (call certain function
		// of every module in the order. 
		// Also, init and update functions of each module should probably
		// accept some argument. I think to make this argument an object,
		// this way we can add more things to be passed w/o any problem and
		// we won't need to change anything
		
		B2d.init(); // goes first
		IdentificationController.init();
		RegisterAsController.init();

		//AssetController.init(); // called from the InitController.init// stuff has to change
		GameController.init();
		KeyboardController.init();
		PhysicsController.init();

		TestController.init(mode);
		

		//PlayerController.init();
		TerrainController.init();
		TerrainSliceController.init();
		WorldController.init();
		



		// WARNING!!! GraphicsController.init is called from the
		// setup_asset_dependent function as it, well, depends on assets being loaded

	};


	var enable_arrowkey_scroll = function(enable_scroll){
		if(enable_scroll == false){                                                          
			document.addEventListener('keydown', function(e){ // .getElementById("display_canvas")
				arrows = [37, 38, 39, 40];                                          
				if(arrows.indexOf(e.keyCode) > -1){                                 
					e.preventDefault();                                             
					return false;                                                   
				}else{                                                              
					return true                                                     
				}                                                                   
			})                                                                      
		}		
	};
	
	var setup_screen = function(){

		// Setting up other stuff:
		// e.g setup canvas size
		
		// TODO: allow resizes?

		Config.SCREEN_W = $('#canvas_container').width(); // is dynamically set to pixel width of the containing element

		// possible resizing technique: 
		// http://www.fabiobiondi.com/blog/2012/08/createjs-and-html5-canvas-resize-fullscreen-and-liquid-layouts/

		
		//$('#debug_canvas').width(String(SCREEN_W) + "px");
		//$('#display_canvas').width(String(SCREEN_W) + "px");

		//$('#debug_canvas').height(String(SCREEN_H) + "px");
		//$('#display_canvas').height(String(SCREEN_H) + "px");
		
	};

	var setup_ticker = function(){

		createjs.Ticker.setFPS(Config.FPS);

		// ticker: on each tick call GameController.update_all();
		createjs.Ticker.addEventListener("tick", GameController.update_all);

	
	};

	var setup_events = function(){


		// keyboard input event: on each keyboard event call appropriate KeyboardController function
		document.onkeydown = KeyboardController.keydown;
		document.onkeyup = KeyboardController.keyup;

			// on interrupt event: stop/pause ticker ?

	};

	var setup_asset_dependent = function(){
		// this may need to move to either load_game or some sort of resizing function
		MultiplayerSyncController.init();
		
		
		NetworkController.init();
		EntityController.init();
		GraphicsController.init();
		//HUDController.init();
		//BackgroundController.init();

		
		setup_ticker();

		if(Config.Init.mode == "multiplayer" && Config.Init.player_id_array != null){
			// if multiplayer mode
			NetworkController.start_multiplayer_session(Config.Init.player_id_array);
		}else if(Config.Init.mode == "test" && GameUtility.read_query_string().player_id_array != null){
			var query_object = GameUtility.read_query_string();

			var player_id_array = JSON.parse(decodeURI(query_object.player_id_array));


			Config.Init.session_id = query_object.session_id;
			Config.Init.player_id = query_object.player_id;
			Config.Init.player_id_array = player_id_array;

			console.log("Detected id array passed in test mode. Switching to the multiplayer mode",
					"player_id_array is", player_id_array, "my id is", query_object.player_id);
			Config.Init.mode = "multiplayer";

			NetworkController.start_multiplayer_session(Config.Init.player_id_array);
		}

		//TerrainController.generate_terrain(); // Initial terrain generation // deprecated, generation will be called from update each tick
	};


	return {
		init: init,
	};
})();

module.exports = InitController;

var Includes = require("../Includes.js"); var include_data = Includes.get_include_data({
	current_module: "InitController", 
	include_options: Includes.choices.ALL
}); eval(include_data.name_statements); var include = function(){eval(include_data.module_statements);}


},{"../Includes.js":19}],9:[function(require,module,exports){
var KeyboardController = (function()
{

	var init = function(){
		
		include();
	};

	var update = function(delta){
		/**
		* update called from GameController.update_all
		*/
		
		if(KeyboardModel.state_changed){
			// if keyboard state changed since the last time,
			// send the keyboard state over.
			// TODO: optimize?
			// You could send only those specific keys that changed, not whole table
			// You could send only relevant keys that might be needed there
			// Is it worth the time spent? Keep in minds, those tables are usually small,
			// unless players decide to smash their faces into the keybord repeatedly
			// (our game isn't that bad, right?)
			MultiplayerSyncController.route_outcoming_packet({
				op: "keyboard_state",
				key_table: KeyboardModel.keys,
			});

			KeyboardModel.state_changed = false;
		}
		
	};

	var handle_keyboard_change = function(packet){
		/**
		* accepts the network packet. changes the respective
		* keybord state for the given packet.player_id
		* is called from the MultiplayerSyncController
		*/
		var player_id = packet.player_id;
		
		if(player_id == null){
			throw "Error: (network) player_id is not defined";
		}

		KeyboardModel.all_keyboard_states[player_id] = packet.key_table;
	};
	
	
	var copy_object = function(obj){
		/**
		* returns (shallow) copy of the object
		*
		* @Stack Overflow:
		* With jQuery, you can shallow copy with:
		* var copiedObject = jQuery.extend({}, originalObject)
		* subsequent changes to the copiedObject will not affect the originalObject, and vice versa.
		* Or to make a deep copy:
		* var copiedObject = jQuery.extend(true, {}, originalObject)
		*/
		
		return jQuery.extend({}, obj);
	};
	
	
	
	var get_active_commands_function = function(table, player_id){
		// >player_id< is optional, and part of a dirty-ish quick implementation
		// Things should be rewritten at some point
		//
		// get all commands associated with keys that are defined in the >table<,
		// and are currently pressed
		//
		// returns: array of commands
		//
		// TODO: REFACTOR this function to work better and so people do not
		// need to call it each tick. instead they should get reference to function one time
		// and stay updated on the active commands
		
		var commands = [];
		if(player_id != null){
			var key_table = KeyboardModel.all_keyboard_states[player_id];
		}else{
			var key_table = KeyboardModel.keys;
		}
		
		$.each(KeyboardModel.translation_tables.code_to_name, function(key, cmd){
			if(key_table[key] && table[cmd]){
				commands.push(table[cmd]);
			}
		});

		var get_key = function(key){
			if(commands.indexOf(key) > -1){
				return true;
			}else{
				return false
			};
		};

		return get_key;
	};

	// public:
	
	var keydown = function(event){
		KeyboardModel.keys[event.keyCode] = true;
		KeyboardModel.state_changed = true;
	};

	var keyup = function(event){
		delete KeyboardModel.keys[event.keyCode];
		KeyboardModel.state_changed = true;
	};


	var movement_commands = function(){
		return get_active_commands_function(KeyboardModel.translation_tables.movement);
	};

	var pause_commands = function () {
	    return get_active_commands_function(KeyboardModel.translation_tables.pause);
	};

	var debug_commands = function(){
		/**
		* commands active in debug mode
		*/
		return get_active_commands_function(KeyboardModel.translation_tables.debug);
	};
	
	var get_remote_movement = function(player_id){
		/**
		* this it TEMPORARY function 
		* I throw it together so I do not have to change how keyboard controller works for now
		* if we find that we should send more keyboard stuff over the network, we should rewrite
		* the KeyboardController appropriately
		*/

		if(player_id == null){
			throw "Error: player_id undefined";
		}

		var key_fun = get_active_commands_function(KeyboardModel.translation_tables.movement, player_id);
		return key_fun;
	};
	
	

	return {
		keydown: keydown,
		keyup: keyup,
        pause_commands: pause_commands,
		movement_commands: movement_commands,
		debug_commands: debug_commands,
		init: init,
		update: update,
		handle_keyboard_change: handle_keyboard_change,
		get_remote_movement: get_remote_movement,
	};

})();

module.exports = KeyboardController;

var Includes = require("../Includes.js"); var include_data = Includes.get_include_data({
	current_module: "KeyboardController", 
	include_options: Includes.choices.DEFAULT
}); eval(include_data.name_statements); var include = function(){eval(include_data.module_statements);}


},{"../Includes.js":19}],10:[function(require,module,exports){

var MultiplayerSyncController = (function(){
	/* Ensures that current player is synchronized with the server
	 * or with other players
	*/

	var op_table;

	var init = function(){
		/* is ran from the InitController once when the game is loaded */
		include(); // satisfy requirements

		// table that associates >op< (operation) with the specific handler
		// at some (likely external) module
		op_table = {
			spawn: EntityController.handle_spawn,
			delete_entity: EntityController.handle_delete,
			keyboard_state: KeyboardController.handle_keyboard_change,
			hero_sync: EntityController.handle_hero_sync,
			enemy_sync: EntityController.handle_enemy_sync,
			terrain_seed: sync_seed,
		}
	};


	var update = function(delta){
		/* is ran each tick from the GameController.update_all */

		var data = NetworkController.get_data(); // array of all packets

		var op_packet = MultiplayerSyncModel.op_packets_table; //op_packet is a list of objects

		if(data != null){
			for(var i = 0; i < data.length; i++){
				// for each packet in incoming packets,
				// rout it
				var packet = data[i];
				route_incoming_packet(packet);
			}
		}

		NetworkController.clean_data();	// remove data that was processed
	};

	var route_outcoming_packet = function(packet){
		/**
		* route packet appropriately
		*/
		if(packet.player_id == null){
				// if packet wasn't identified before
				// identify the packet as mine
				packet.player_id = NetworkController.get_network_id();
		}

		var op = packet.op;
		var handler = op_table[op];

		if(handler == null){
			// if no handler assigned
			console.warn("No handler for op", op);
			return -1;
		}

		if(Config.Remote.connected){
			// if multiplayer
			
			
			if(Config.Remote.master){
				// if master of the network
				// route back to specific handler
				// echo to all clients

				handler(packet);

				var response = packet; // do we want to allow overriding the response?

				NetworkController.add_to_next_update(response);
			}else{
				// if one of the clients
				// route to the master
				NetworkController.add_to_next_update(packet);
			}
		}else{
			// if singlplayer
			// route back to the specific handler
			handler(packet);
			//console.log(op,handler);
			
			
		}
	};

	var route_incoming_packet = function(packet){
		/**
		* handle packet that arrived over the network
		* ! this function is called only when packets arrive remotely
		* ! so you may safely assume that you are connected to the network
		* ! and the packet didn't originate on your side (this last one is
		* ! especially important)
		*/

		apply_transforms(packet); // apply any necessary transformations before beginning

		var op = packet.op;
		var handler = op_table[op];

		if(handler == null){
			// if no handler assigned
			console.warn("No handler for op", op);
			return -1;
		}

		if(packet.personal_communication != null){
			console.warn(packet.personal_communication);
		}

		if(Config.Remote.master && packet.personal_communication != true){
			// if master and packet isn't meant personally for me
			// route to specific handler
			// echo to the clients
			handler(packet);
			NetworkController.add_to_next_update(packet);
		}else{
			// if one of the clients
			// route to the handler
			handler(packet);
		}
		
	};

	var apply_transforms = function(packet){
		/**
		* if some specific transformation is supposed to be applied to the packet
		* (op should change somehow, new properties added etc.)
		* apply this transformation
		* ! notice that transforms are applied to incoming packets only
		* ! if you are confident you need something else, contact me (AK)
		*/

		switch(packet.op){
			case null:
				console.log(packet);
				throw "op for this packet is undefined";
				break;
			case "spawn":
				break;
			//default:
		}

		return packet;
	};
	

	var patch = function(object, func){
		/**
		* patch object with the function given
		* >object< - object whose prototype to patch 
		* >func< - NAMED function. it has to have the same name
		* as the function on the >object<'s prototype that it's meant to replace
		* this is function named bar: var hey = function bar(){};
		* this is unnamed function: var hey = function(){};
		*
		* the function that you pass will be called before the normal function body
		* when called, your function will be called on the same object (instance) that
		* old_function is called and will be passed the same arguments
		*/

		if(func.name === ""){
			throw "Function passed should be named function";
		}

		var old_func = object.prototype[func.name];
		var custom_function = func;

		var new_function = function overriden_by_multiplayer_controller(){

			custom_function.apply(this, arguments);
			return old_func.apply(this, arguments); // call old function and return what it returns
		}

		object.prototype[func.name] = new_function;
		
	};

	var get_initialization_data_master = function(){
		/**
		* get array packets that should be sent from master to all other people after the connection
		* with them is established
		*/

		var data = [];
		data.push({op: "terrain_seed", seed: TerrainController.get_seed(),});


		return data;
	};

	var get_initialization_data_common = function(){
		/**
		* get the array of packets that should be sent when to newly connected player
		* regardless whether this player is a master or not
		*/

		var data = [];

		var my_hero = EntityController.get_my_hero();

		if(my_hero != null){
			var pos = my_hero.body.GetWorldCenter();
			data.push({
				op: "spawn",
				personal_communication: true,
				type: "hero",
				x: pos.x,
				y: pos.y,
				// TODO: synchronize the state ??? or will it be handled automatically w/ herosync?
			});
		}
		
		return data;
	};

	var purge_all_data_for = function(network_id){
		/**
		* despawn hero and remove all traces of presence for the player
		* with this network id
		* called when player disconnects from the game
		*/
		
		var heroes = EntityController.get_all_heroes(); 
		var hero = heroes[network_id];
		

		if(hero != null){
			EntityController.delete_entity(hero);
		}
	};
	
	
	var sync_seed = function(packet){
		/**
		* description
		*/
		
		console.log("syncing my seed with master; the seed is", packet.seed);
		
		var seed = packet.seed;
		if(seed != null){
			TerrainController.set_seed(seed);
		}else{
			throw "seed is not defined";
		}
	};

	return {
		// declare public
		init: init, 
		update: update,
		route_outcoming_packet: route_outcoming_packet,
		route_incoming_packet: route_incoming_packet,
		get_initialization_data_master: get_initialization_data_master,
		get_initialization_data_common: get_initialization_data_common,
		purge_all_data_for: purge_all_data_for,
	};
})();

module.exports = MultiplayerSyncController;

var Includes = require("../Includes.js"); var include_data = Includes.get_include_data({
	current_module: "MultiplayerSyncController", 
	include_options: Includes.choices.DEFAULT
}); eval(include_data.name_statements); var include = function(){eval(include_data.module_statements);}


},{"../Includes.js":19}],11:[function(require,module,exports){

var NetworkController = (function(){
	/* manages p2p communication
	*/

	var peer, conn; // TEMPORARY. there will be multiple of those things
	var MEDIATOR_SERVER_KEY = 'lvgioxuj3ylm1jor'; //'l2f8f8vtbhcfecdi'; //'a7vojcpf70ysyvi';

	var init = function(){
		/* is ran from the InitController once when the game is loaded */
		include(); // satisfy requirements

		// TODO: make sure that sensitive host info (like spawn request that have not been
		// satisfied yet) are processed correctly before unloading
		// also it may make sense to handle even situations when the page was forced to unload
		// even before the function was called (power problem?)
		document.onbeforeunload = on_unload; // will be executed before user leaves page
		NetworkModel.hey = false;
	};


	var update = function(delta){
		/* is ran each tick from the GameController.update_all */

		var cmds = KeyboardController.debug_commands();

		if(!NetworkModel.block_connections && cmds("connect") && Config.Init.mode == "test"){ 
			NetworkModel.block_connections = true;
			var players = ["player1", "player2", "player3", "player4", "player5", "player6", "player7", "player8"];
			start_multiplayer_session(players);
			Config.Init.player_id_array = players;
		}

		if(cmds("show_connected")){
			console.log(get_all_connected());
		}

		if(Config.Remote.connected){
			if(Config.Remote.master){
				// if I am the master, distribute data
				send_out_data();
			}else{
				// if not the master, just send data to the master
				send_data_to_master();
			}
		}

	};

	var start_multiplayer_session = function(ids){
		/**
		* perform procedures to start playing with all
		* other connected people
		*/
		NetworkModel.peers_to_connect = ids;

		// to not interrupt connection process
		GameController.stop_game();

		if(Config.Init.mode != "test"){	
			// create peer, assign id
			var peer = NetworkModel.my_peer = new_peer(Config.Init.player_id); 
			peer.on('error', handle_standart_peer_error);
			peer.on('open', on_obtaining_id_successfully);
			NetworkModel.my_peer = peer;
			NetworkModel.my_id = Config.Init.player_id;

		}else{

			setup_network_variables_for_testing_mode();
			setup_my_peer_test(); // setup peer // also picks free idr// calls >on_obtaining_id_successfully
		}
				
	};

	var setup_network_variables_for_testing_mode = function(){
		/**
		* setup various parameters for the testing mode game
		*/
		var ids = NetworkModel.peers_to_connect;

		NetworkModel.connections = {};
		NetworkModel.free_ids = [];

		for(var i = 0; i < ids.length; i++){
			var id = ids[i];
			NetworkModel.connections[id] = null;
			NetworkModel.free_ids.push(id);
		}

		NetworkModel.non_free_ids = [];

	};
	
	
	var handle_standart_peer_error = function(error){
		/**
		* this function is for connection errors
		* in non-test mode
		*/

		//console.log(error);
		//throw "Peer error";
		
	};
	

	var on_obtaining_id_successfully = function(id){
		/**
		* when the player id for this client was successfully
		* found through the process in the setup_my_peer_test(); function,
		* this function is called, which should setup all necessary things for 
		* the multiplayer to work, and connect to the other player
		*/

		NetworkModel.my_id = id;
		if(Config.Init.player_id == null){
			Config.Init.player_id = id;
		}

		Config.Remote.connected = true;

		var peer = NetworkModel.my_peer;

		peer.on('error', on_peer_error);

		if(NetworkModel.my_id != NetworkModel.my_peer.id){
			// not a meaningful check, terrible practices are terrible
			throw "Id's do not match. Smth went wrong" 
		}

		console.log("Obtained id sucessfully, my id is", id);

		if(Config.Init.mode == "test"){
			console.log("Playing in testing multiplayer mode");
		}else{
			console.log("Playing in normal multiplayer mode");
		}

		/* note that if other peers connect in the future, 
		 * connection with them will be handled at that time
		 * through accept_connection function
		 */
		connect_to_others();

		// allow time for connections to be established, then pick the master
		NetworkModel.timeout_id = setTimeout(pick_the_master, Config.Remote.notification_wait);
	};


	var connect_to_others = function(){
		/**
		* connect to all other peers that are available at this time
		*/
		var ids = NetworkModel.peers_to_connect;
		for(var i = 0; i < ids.length; i++){

			var id = ids[i];

			if(id != NetworkModel.my_id){
				var connection = NetworkModel.my_peer.connect(id);

				setup_connection_listeners(connection);
			}
		}

	};

	
	var on_peer_error = function(error){
		/**
		* called on peer error;
		* notice that this function doesn't handle
		* peer errors that arise from inability to create peer because of id conflicts,
		* as this function is attached as listener only after the peer is sucessfully
		* created
		*/
		//console.warn("Peer error", error);
	};

	
	var setup_my_peer_test = function(error){
		/**
		* setups your personal peer picking free id, and returning it
		* looking up for the free id's is a huge pain now, once we run our
		* own peer matching server, it'll be a lot easier
		*
		* >error< parameter is null on the first call, but if first id that was
		* tried was already taken, and function is called again, it'll not be null 
		*/

		if(error == null || error.type == "unavailable-id"){
			if(NetworkModel.free_ids.length > 0){
				var id = NetworkModel.free_ids.pop();
				NetworkModel.non_free_ids.push(id);
				var peer = NetworkModel.my_peer = new_peer(id); 
				peer.on('error', setup_my_peer_test);
				peer.on('open', on_obtaining_id_successfully);
			}else{
				console.warn("Couldn't establish multiplayer session, all " + String(NetworkModel.peers_to_connect.length) + " available slots taken");
				Config.Remote.connected = false;
				NetworkModel.block_connections = false;

				setup_network_variables_for_testing_mode();
			}
		}else{
			//console.warn("Peer error", error);
		}
		
	};

	var on_connection_open = function(){
		/**
		* on opening the connection
		*/

		var id = this.peer;	
		
		console.log("Successfully initiated new connection with the peer", id);

		var connected_peers = NetworkModel.connected_peers;
		if(connected_peers.indexOf(id) < 0){
			// if this id isn't registered as connected yet,
			// add to list of the connected peers
			NetworkModel.connected_peers.push(id);
		}

		NetworkModel.connections[id] = this;
		
	};

	var on_connection_closed = function(){
		/**
		* called when some connection closes
		*/
		var id = this.peer;
		var nfree = NetworkModel.non_free_ids;
		var connected_peers = NetworkModel.connected_peers;

		// remove from not free ids [makes sense only in test mode]
		nfree.splice(nfree.indexOf(id), 1);
		// add back to free ids [makes sense only in test mode]
		NetworkModel.free_ids.push(id);

		// remove from the list of connected peers
		connected_peers.splice(connected_peers.indexOf(id), 1);
		

		delete NetworkModel.connections[id];


		if(NetworkModel.master_id === id){
			GameController.stop_game();
			console.log("Closing connection with the master");
			NetworkModel.master_id = null;
			pick_the_master();
		}

		MultiplayerSyncController.purge_all_data_for(id);

		console.log("Connection with peer", id, "was successfully closed");
	};

	var on_connection_error = function(error){
		/**
		* when error on trying to establish connection occurs;
		* most often it will be error for peer not existing. that's part of the normal process
		*/
		
		console.log("connection error (likely not a bug)");
	};
	
	var pick_the_master = function(){
		/**
		* pick the master (one with whome everyone synchronizes)
		* for the current group of peers.
		*/

		if(NetworkModel.master_id != null){
			// if master was chosen already
			console.log("master is already chosen");
		}else{

			var ids = NetworkModel.peers_to_connect;

			var conns = NetworkModel.connections;

			for(var i = 0; i < ids.length; i++){
				var id = ids[i];

				if(conns[id] != null && id != NetworkModel.my_id){
					set_master(id);
					console.log("The master is", id);
					break;
				}else if(id == NetworkModel.my_id){
					// i am the best candidate for master
					console.log("I am the law (was chosen as master)");
					set_master(id);
					break;
				}
			}
		}

		GameController.continue_game();

	}; // end pick_the_master
	
	var set_master = function(id){
		/**
		* set the master to the peer with given id
		* and perform all associated procedures
		*/

		NetworkModel.master_id = id;
		
		if(NetworkModel.master_id == NetworkModel.my_id){
			// if master

			// set the master flag
			Config.Remote.master = true;
			
			
		}// fi

		// send out initial sync data
		send_initialization_data();
	};

	var send_initialization_data = function(){
		/**
		* send the initialization data to the peer with the given id
		*
		*/

		var conns = NetworkModel.connections;
		for(var id in conns){
			if(id != NetworkModel.my_id && conns[id]){
				send_initialization_data_to(id);
			}
		}

	};


	var send_initialization_data_to = function(id){
		/**
		* description
		*/

		console.log("sending initialization data to", id);
		
		
		if(NetworkModel.master_id == NetworkModel.my_id){
			data = [];

			var arr = MultiplayerSyncController.get_initialization_data_master();

			for(var i = 0; i < arr.length; i++){
				data.push(arr[i]);
			}

			send_to(id, {op: "special_communication", special_communication: true, message: "I am the law!", master_id: NetworkModel.my_id});
			send_to(id, data);
		}

	};
	
	
	var new_peer = function(id){
		/**
		* pass the id you want the peer to have
		* returns created peer
		*/
		
		var peer = new Peer(id, {key: MEDIATOR_SERVER_KEY});

		peer.on('connection', accept_connection);


		return peer;
	};

	var accept_connection = function(conn){
		/**
		* takes connection
		* is called when someone attempts to establish connection
		* with this client
		*/

		var free_ids = NetworkModel.free_ids;
		var nfree_ids = NetworkModel.non_free_ids;

		var id = conn.peer;
		NetworkModel.connections[id] = conn;

		// remove the id from list of free ids. notice that 
		// array is relatively small, and operation happends seldomly
		free_ids.splice(free_ids.indexOf(id), 1); 

		console.log("accepting connection from peer", id);
		
		nfree_ids.push(id);

		setup_connection_listeners(conn);

		setTimeout(function(){
				send_initialization_data_to(id)
			}
			, Config.Remote.connection_timeout);

	};

	var setup_connection_listeners = function(connection){
		/**
		* description
		*/
		connection.on('data', on_data_arrival);
		connection.on('close', on_connection_closed);
		connection.on('open', on_connection_open);
		connection.on('error', on_connection_error);
	};
	
	

	var connection_unsuccessful = function(error){
		/**
		* for now, just add the peer to which was trying to connect to the
		* free peers list. Later some investigation or reconnection attempts
		* may be implemented
		*/

		console.log(error);
		
	};

	var send_to = function(peer_id, data){
		/**
		* send data to the peer with the peer_id
		* you can make decision to delay data sending, or change
		* procedure somehow right here
		* but do not try to compress the data in this function.
		* send_to will be fired multiple times per each piece of data
		* (it'll be sent to all other players) so any compression should
		* take place in the "distribute_data" function
		*/

		var conn = NetworkModel.connections[peer_id];

		if(conn != null){
			conn.send(data);
		}else{
			throw "No connection exists for the peer with id " + String(id);
		}
		
	};


	var distribute_data = function(data){
		/**
		* First, manipulate the data to properly compress it, or decide what should
		* and what shouldn't be sent (make sure to document stuff here, because people
		* will pull their hair out trying to understand why their stuff doesn't get sent)
		* Second, send the data to all the connected players in this game
		*/

		var conns = NetworkModel.connections;
		for(var id in conns){
			if(id != NetworkModel.my_id && conns[id]){
				conns[id].send(data);
			}
		}
		
	};


	var on_unload = function(arguments){
		/**
		* will be called when the user is about to leave the web page
		* will make sure connections are gracefully closed and peers are destroyed
		*/

		console.log("document is unloaded now. Destroying peer, disconnecting from others");
		NetworkModel.my_peer.destroy();	
	};
	
	
	var on_event = function(smth){
		/**
		* dummy function, delete when isn't called from anywhere
		*/
		
	};


	var on_data_arrival = function(data){
		/**
		* is called whenever new data arrives
		*/

		if(data.special_communication != null){
			// if this is network handling data,
			// not the regular multiplayer data transfer

			if(data.message == "I am the law!"){
				var m_id = data.master_id;

				set_master(m_id);
				console.log("The master is", m_id);
				//clearTimeout(NetworkModel.timeout_id); // will give an error if timeout passed?
			}

			// stop processing
			return;
		}

		if(NetworkModel.recieve_array == null){
			NetworkModel.recieve_array = data;
		}else{
			for(var i = 0; i < data.length; i++){
				NetworkModel.recieve_array.push(data[i]);
			}
		}
	};


	var on_error = function(error){
		/**
		* called when error occurs with the peer
		*/
	};


	var connect_to = function(id, peer){
		/**
		* connect peer >peer< to the peer with the given >id<
		* returns connection object
		*/
		
		var conn = peer.connect(id);

		return conn;
	};
	

	var retrieve_from_backlog = function(){
		/**
		* gets packet from the linked list
		* and removes it from the list
		*/
		
		var list = NetworkModel.package_backlog;

		if(list.HEAD == null){
			return null;
		}

		var packet = list.HEAD.packet;

		list.HEAD = list.HEAD.next;
		list.HEAD.previous = null;

		return packet;

	};


	var place_to_backlog = function(packet){
		/**
		* puts packet into the linked list
		*/
		var list = NetworkModel.package_backlog;
		var packet_container = {packet: packet}; 
		if(list.HEAD == null){
			list.HEAD = packet_container;
			list.TAIL = packet_container;
		}else{
			packet_container.previous = list.TAIL;
			list.TAIL.next = packet_container;
			list.TAIL = packet_container;
		}
	};
	

	var add_to_next_update = function(data){
		/**
		* call this function to schedule the data to be passed to the master/clients.
		* note that this module will decide itself when and how to send the data,
		* so you are not guaranteed that it'll be send immediately, or with the next update
		* You should account for that. This function is meant to be intelligent and prioritize more important
		* stuff
		*/

		NetworkModel.send_array = NetworkModel.send_array || [];

		NetworkModel.send_array.push(data);
	};

	var send_out_data = function(){
		/**
		* temp
		*/
		
		if(NetworkModel.send_array != null){
			
			distribute_data(NetworkModel.send_array);
			NetworkModel.send_array = null;
		}

	};

	var send_data_to_master = function(){
		/**
		* send the prepared data to the master
		*/
		var master_conn = NetworkModel.connections[NetworkModel.master_id];
		if(NetworkModel.send_array != null && master_conn != null){
			master_conn.send(NetworkModel.send_array);
			NetworkModel.send_array = null;
		}

	};
	

	var get_data = function(){
		/**
		* get the data array
		*/
		
		var data = NetworkModel.recieve_array;
		
		return data;
	};

	var clean_data = function(){
		/**
		* description
		*/
		delete NetworkModel.recieve_array;
	};
	
	var get_network_id = function(){
		// returns my network id if I am connected,
		// or "local" if not
		if(Config.Remote.connected){
			return NetworkModel.my_id;
		}else{
			return "local";
		}
	};

	
	var get_all_connected = function(){
		/**
		* gets array of ids for all connected peers
		* your own id isn't included, naturally
		*/
		
		return NetworkModel.connected_peers;
		
	};
	
	return {
		// declare public
		init: init, 
		update: update,
		add_to_next_update: add_to_next_update,
		get_data: get_data,
		clean_data: clean_data,
		get_network_id: get_network_id,
		send_to: send_to,
		start_multiplayer_session: start_multiplayer_session,
		get_all_connected: get_all_connected,
	};
})();

module.exports = NetworkController;

var Includes = require("../Includes.js"); var include_data = Includes.get_include_data({
	current_module: "NetworkController", 
	include_options: Includes.choices.DEFAULT
}); eval(include_data.name_statements); var include = function(){eval(include_data.module_statements);}

},{"../Includes.js":19}],12:[function(require,module,exports){
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

		PhysicsModel.gravity = new B2d.b2Vec2(0,30); // earth gravity
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
		//bottom_sensor.width += 0.4;
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


},{"../Includes.js":19}],13:[function(require,module,exports){

var RegisterAsController = (function(){
	/* Allows you to register object as something,
	 * for other modules to access
	 * One use could be registering newly generated terrain slice from the slice controller,
	 * for the GraphicsController to notice and generate graphics for it
	*/

	var init = function(){
		/* is ran from the InitController once when the game is loaded */

		include(); // satisfy requirements

	};

	var update = function(delta){
		/* is ran each tick from the GameController.update_all */

		// TODO: automatically delete stuff depending on timeout stuff
		// calculate timeout of 
	};

	var register_as = function(what, obj){
		/**
		* simple one time lookup registering of object
		* >what< - string. e.g. "new_terrain_slice"
		* >obj< - object to register
		*/
		
		var table = RegisterAsModel.simple_one_time_lookup;

		if(table[what]){
			table[what].push(obj);
		}else{
			table[what] = [obj];
		}
	};

	var retrieve_registered_as = function(what){
		/**
		* returns reference to the object contatining
		* things currently registered as >what<
		* you are responsible for popping (or not popping) them
		* from the array to no longer consieder (or continue to consider)
		* them as registered as >what<
		*/
		var list = RegisterAsModel.simple_one_time_lookup[what];
		if(list){
			return list;
		}else{
			return [];
		}
		
	};
	
	
	return {
		// declare public
		init: init, 
		update: update,
		register_as: register_as,
		retrieve_registered_as: retrieve_registered_as
	};
})();

module.exports = RegisterAsController;

var Includes = require("../Includes.js"); var include_data = Includes.get_include_data({
	current_module: "RegisterAsController", 
	include_options: Includes.choices.DEFAULT
}); eval(include_data.name_statements); var include = function(){eval(include_data.module_statements);}


},{"../Includes.js":19}],14:[function(require,module,exports){
config = require ("../Config.js");

var TerrainController = (function(){
	/* this will be the physical representation of the terrain
	 * currently it contains graphical bits, but that will change
	 */
	

	var init = function(){
	    include();
	    TerrainModel.seed = Math.floor(Math.random()*2000) + 1000;//placeholder for seed

	};
	
	
	var update = function(){
		// check for any chunks to be unloaded/deleted will go here, for now
		// maybe it'll check for all players to be sufficiently far to the right
		// of it, maybe one chunk in advance, or smth like that
		//if (config.movement_edge.x > x)
		while(TerrainModel.terrain_slices_queue.length < 4){
			var slice = NewTerrainSlice();
			TerrainModel.terrain_slices_queue.push(slice);
		}

		var cmds = KeyboardController.debug_commands();

		if(cmds("new_slice")){
			console.log(TerrainModel.seed);
			var slice = NewTerrainSlice();
			TerrainModel.terrain_slices_queue.push(slice);
		}
		

		if(WorldController.get_movement_edge() > (TerrainModel.terrain_slices_queue.length-3)*(20)){
			var slice = NewTerrainSlice(TerrainModel.seed);
			TerrainModel.terrain_slices_queue.push(slice);
			TerrainModel.seed = (((TerrainModel.seed) * (TerrainModel.seed) - TerrainModel.seed / 2)) % 2000 + 1001;
			WorldController.set_spawn();
		};

		check_for_old_slices();
	};

	var get_seed = function(){
		return TerrainModel.seed;
	};
	
	var set_seed = function(new_seed){
		TerrainModel.seed = new_seed;
	};

	var NewTerrainSlice = function(seed){
		/* this takes care of appending new terrain slice to the generated terrain
		 * it calculates it's origin x and y positions and whatever other stuff,
		 * generates slice; sets up everything
		 */
		var x_offset = TerrainModel.slice_counter * Config.TerrainSlice.grid_columns;

		TerrainModel.slice_counter++; // TODO: change how it works when truly infinite

		if(TerrainModel.initial_generated < 3){
			TerrainModel.initial_generated++;
			var slice = new TerrainSliceController.generate_initial(x_offset);
		}else{
			var slice = new TerrainSliceController.generate_random(x_offset, seed);
		}

		IdentificationController.assign_id(slice);

		MarkAsNewTerrainSlice(slice); 

		return slice;

	};

	var check_for_old_slices = function(){
		/**
		* check for slices that are too far behind and should be removed
		*/

		var tqueue = TerrainModel.terrain_slices_queue;
		var cut_off_index = 0; // what amnt of slices should go off the queue

		// find the old slices and handle their deletion
		for(var i = 0; i < tqueue.length; i++){
			var slice = tqueue[i];
			var slice_end_x = slice.origin.x + slice.grid_columns * slice.cell_w;

			if(slice_end_x < WorldController.get_movement_edge){
				// if slice is unreachable, delete it 
				cut_off_index++;
				delete_slice(slice);
			}
		}

		// now remove all found old slices from the queue
		if(cut_off_index > 0){
			TerrainModel.terrain_slices_queue = tqueue.slice(cut_off_index);
		}
	};
	
	

	var delete_slice = function(slice){
		/**
		* assumes that slice will be popped from the terrain slice queue elsewhere
		* (or was already)
		* otherwise the slice won't be properly deleted
		*/
			
		console.log("deleting slice with origin", slice.origin);
		
		var grid = slice.grid;
		
		for(var i = 0; i < grid.length; i++){
			var row = grid[i];
			for(var j = 0; j < row.length; j++){
				var cell = row[j];
				if(cell.kind != 0){
					PhysicsController.remove_body(cell.body);
					IdentificationController.remove_id(cell.id);
				}
			}
		}

		
		// For graphics to pick up and delete unneeded graphics
		RegisterAsController.register_as("removed_slice", slice);

		// free the id (yes, terrain slice has id id
		IdentificationController.remove_id(slice.id);
	};
	
	

	
	var for_each_tile = function(f){
		// takes function >f< that takes three parameters: tile (easeljs object),
		// terrain_lvl (int), and tile_index (int)
		// calls this function for every tile of the terrain
		
		var queues = TerrainModel.terrain_queues;

		$.each(queues, function(terrain_lvl){
			$.each(queues[terrain_lvl], function(tile_index){
				f(queues[terrain_lvl][tile_index], terrain_lvl, tile_index);
			});
		});

	};

	
	var MarkAsNewTerrainSlice = function(slice){
		//TerrainModel.new_slices.push(slice);
		RegisterAsController.register_as("awaiting_graphics_initialization", slice);
	};

	//var NewSlicesAvailable = function(){
		//return (TerrainModel.new_slices.length > 0);
	//};

	//var GetNewTerrainSlices = function(){
		//return TerrainModel.new_slices;
	//};

	return {
		update: update,
		init: init,
		NewTerrainSlice: NewTerrainSlice,
		MarkAsNewTerrainSlice: MarkAsNewTerrainSlice,
		get_seed: get_seed,
		set_seed: set_seed,
		//NewSlicesAvailable: NewSlicesAvailable,
		//GetNewTerrainSlices: GetNewTerrainSlices,
	}
})();

module.exports = TerrainController;

var Includes = require("../Includes.js"); var include_data = Includes.get_include_data({
	current_module: "TerrainController", 
	include_options: Includes.choices.DEFAULT
}); eval(include_data.name_statements); var include = function(){eval(include_data.module_statements);}


},{"../Config.js":2,"../Includes.js":19}],15:[function(require,module,exports){

var TerrainSliceController = (function () {

	var init = function(){
		/* is ran from the InitController once when the game is loaded */
		include(); // satisfy requirements
		IdentificationController.assign_type(TerrainSliceModel.Cell, "terrain_cell");
		IdentificationController.assign_type(TerrainSliceModel.Slice, "terrain_slice");

	};

	var update = function(slice){
		

	};

	var get_next_origin = function(){
	};
	

	
	var spawnBlock = function(x, y, kind){
		//spawn instance of this entity at the given coordinates
		var block = new TerrainSliceModel.Cell(kind%3); //kind is an int, 1 = block, 2 = platform
		IdentificationController.assign_id(block); //eventually we may want to remove this for the sake of efficiency
		block.body = PhysicsController.get_rectangular({x: x, y: y}, block);
		return block;
	};
	
	var spawnSpike = function(x, y){
		//spawn instance of this entity at the given coordinates
		var spike = new TerrainSliceModel.Cell(3); //kind = 3 means spikes
		spike.can_attack = true;
		spike.damage = 4;
		IdentificationController.assign_id(spike); //eventually we may want to remove this for the sake of efficiency
		spike.body = PhysicsController.get_rectangular({x: x, y: y}, spike);
		return spike;
	};
	
	var spawnGap = function(x,y){
		// 0 will be the id for the "air" i.e. nothing
		var gap;
		gap = new TerrainSliceModel.Cell(0);
		//IdentificationController.assign_id(gap); // DO NOT ASSIGN IDS TO EMPTY SPACES
		return gap;
	};
	
	var getRandomNumber = function (seed) {
		return (seed*seed)%2000 + 1000;
	};
	
	var buildTerrainSlice_00 = function(slice,seed){
	
	    //set variables
	    //console.log(seed);
	    var seed = seed;
		var rows = slice.grid_rows;
		var columns = slice.grid_columns;
		var i,j;
		var ground_lvl = rows - 3; //the row that is considered ground level.
		var vgap_min = 7;
		var vgap_len = 0;
		var hgap_min = 10;				//minimum size of gaps between platforms
		var hgap_len = 0; 		//current number of consecutive horizontal gaps
		var pit_max = 8;				//maximum len of pits in blocks
		var pit_len = 0; 		//current number of consecutive pits
		var has_pit = [];
		var pit_frequency = 6; 		//base percentage chance of a pit being dug
		var platform_len_max = 7;	//maximum len of a platform
		var platform_len_min = 3; //minimum len of a platform
		var platform_len = 0; 		//len of currently generated platform
		var platform_count_max = 2; //maximum number of platforms per column
		var platform_count = []; 		//keeps track of platforms per column
		var platform_frequency = 15;//base percentage chance of a platform to be generated
		var spike_frequency = 50;//base percentage chance of a platform to have spikes
		/*
		var spike frequency
		var column frequency
		etc.
		*/
		for(i=0; i<=columns;i++){
			platform_count[i] = 0;
			has_pit[i] = false;
		}

		//build the stage from the bottom up
		/*
		Build Stage from bottom up, left to right
		load blocks and gaps into slice.grid[i][j]
		
		*/
		for(i=rows-1;i>=0;i--){
			slice.grid[i] = [];
		}
		
		for(i=rows - 1;i>=0;i--){ //outer loop: generate rows bottom to top
			if (vgap_len < vgap_min){
				vgap_len++;
			}
			if (seed % 10 == 0) {
			    seed += i;
			}
			for(j=0;j<columns;j++){ //inner loop: generate from left to right within current row
				var x = slice.origin.x + j * slice.cell_w + slice.cell_w/2;
				var y = slice.origin.y + i * slice.cell_w + slice.cell_w/2;
				
				if (i >= ground_lvl){	//If on or below ground level, Generate Ground
				    if (pit_len < pit_max && (getRandomNumber(seed) % i < pit_frequency || pit_len != 0) || has_pit[j]) {
						slice.grid[i][j] = spawnGap(x,y); //create gap
						has_pit[j] = true;
						pit_len++; //the pit gets wider
						seed = getRandomNumber(seed) + 71;
					}
					else{
						slice.grid[i][j] = spawnBlock(x,y,1);//create a ground block (1 means ground)
						pit_len = 0; //any pits being spawned have been interrupted
						if (i == ground_lvl){
							slice.grid[i][j].position = "surface";
							if(getRandomNumber(seed)%100 < spike_frequency && j > 0){//check for random spike
								if(slice.grid[i-1][j-1] == null && slice.grid[i][j-1].kind != 0){
									slice.grid[i - 1][j] = spawnSpike(x, y - slice.cell_w); //create a spike above the current block
									seed = getRandomNumber(seed) + 21;
								}
							}
						}else{
						slice.grid[i][j].position = "underground";
						}
					}
				}else{ //ElSE Generate Platforms
					if((hgap_len >= hgap_min || platform_len > 0) //if there is a large gap or a platform being built
					&& (platform_len < platform_len_max) // and any platform being built is less than max len
					&& (platform_count[j] < platform_count_max) // and the current column's platform limit has not been met
					&& (vgap_len >= vgap_min) //if the vertical gap minimum has been met
					&& (platform_len > 0 || (j<columns-1 && platform_count[j+1] < platform_count_max))){ //and the platform is not going to be a singleton
						if (getRandomNumber(seed)%100 < platform_frequency || (platform_len > 0 && platform_len <= platform_len_min)){
						
							slice.grid[i][j] = spawnBlock(x,y,2);//create platform (2 means platform)
							
							//check aesthetic stuff, like platform edges
							if (platform_len == 0){
								slice.grid[i][j].position = "left";
							}
							else{
								slice.grid[i][j].position = "right";
							}
							if (j>0){if (slice.grid[i][j-1].kind != 0){
								if (slice.grid[i][j-1].position != "left"){
									slice.grid[i][j-1].position = "middle";
								}
							}}
							
							seed = getRandomNumber(seed);
							platform_len++;	//platform gets longer, and 
							platform_count[j]++;//the number of platforms in the current column increases
							hgap_len = 0; 		//reset the gap counter to 0
						}else{
							if (slice.grid[i][j] == null){
								slice.grid[i][j] = spawnGap(x,y); //create a gap
								platform_len = 0; //if there was a platform, it has been interrupted
								hgap_len++; //the gap gets wider
							}
						}
					}else{
						if (slice.grid[i][j] == null){
							slice.grid[i][j] = spawnGap(x,y); //create a gap
							platform_len = 0; //if there was a platform, it has been interrupted
							hgap_len++; //the gap gets wider
						}
					}
					seed = getRandomNumber(seed);
				}
			}
			vgap_len = vgap_len%vgap_min;
		}
		return slice;
	};
	
	//pregenerated slice
	var buildTerrainSlice_01 = function(slice,seed){
		//set variables
		var rows = slice.grid_rows;
		var columns = slice.grid_columns;
		var i,j;
		var ground_lvl = rows - 3; //the row that is considered ground level.
		var vgap_min = 7;
		var vgap_len = 0;
		var hgap_min = 10;				//minimum size of gaps between platforms
		var hgap_len = 0; 		//current number of consecutive horizontal gaps
		var pit_max = 20;				//maximum len of pits in blocks
		var pit_len = 0; 		//current number of consecutive pits
		var has_pit = [];
		var pit_frequency = 0; 		//base percentage chance of a pit being dug
		var platform_len_max = 7;	//maximum len of a platform
		var platform_len_min = 3; //minimum len of a platform
		var platform_len = 0; 		//len of currently generated platform
		var platform_count_max = 2; //maximum number of platforms per column
		var platform_count = []; 		//keeps track of platforms per column
		var platform_frequency = 5;//base percentage chance of a platform to be generated
		for(i=0; i<=columns;i++){
			platform_count[i] = 0;
			has_pit[i] = false;
		}
		for(i=rows - 1;i>=0;i--){ //outer loop: generate rows bottom to top
			slice.grid[i] = [];
			for(j=0;j<columns;j++){ //inner loop: generate from left to right within current row
				var x = slice.origin.x + j * slice.cell_w + slice.cell_w/2;
				var y = slice.origin.y + i * slice.cell_w + slice.cell_w/2;
				if (i >= ground_lvl){	//If on or below ground level, Generate Ground
					slice.grid[i][j] = spawnBlock(x,y,1);//create a ground block (1 means ground)
					if (i == ground_lvl)
						slice.grid[i][j].position = "surface";
					else{
					slice.grid[i][j].position = "underground";
					}
				}else{
					slice.grid[i][j] = spawnGap(x,y);
				}
			}
		}
		return slice;
	};
	
	var generate_initial = function(x_offset){
		var slice = new TerrainSliceModel.Slice();
		slice.origin.x = x_offset;
		slice.origin.y = 0;
		slice = buildTerrainSlice_01(slice);
		
		return slice;
	}
	
	var generate_random = function(x_offset, seed){
		var slice = new TerrainSliceModel.Slice();
		slice.origin.x = x_offset;
		slice.origin.y = 0;
		//get a random kind of slice
		if (getRandomNumber(seed)%100 < 95){
			slice = buildTerrainSlice_00(slice,seed);
		}else{
			slice = buildTerrainSlice_01(slice,seed);
		}
		
		return slice;
	};
	




	return {
		// declare public
		init: init, 
		update: update,
		generate_initial: generate_initial,
		generate_random: generate_random,
	};
})();

module.exports = TerrainSliceController;

var Includes = require("../Includes.js"); var include_data = Includes.get_include_data({
	current_module: "TerrainSliceController", 
	include_options: Includes.choices.DEFAULT
}); eval(include_data.name_statements); var include = function(){eval(include_data.module_statements);}


},{"../Includes.js":19}],16:[function(require,module,exports){
var TestController = (function(){
	// placeholder for implementing testing
	// may be changed/removed/upgraded depending on how we will handle our tests
	
	
	var preinit_tests = function(){
	//For tests requiring run before init is called
	
	
	};
	
	
	var test = function(){
		// if you need some sort of tests launched, this is one of the places to do it
		QUnit.test( "hello test", function( assert ) {
			assert.ok( 1 == "1", "Passed!" );
		});
		Includes.automated_tests();
	};

	var post_loading_tests = function(){
		// TODO: call when loading assets is completed if there are some tests that need
		// to be done at that moment. (Refer to InitController.init and 
		// InitController.setup_asset_dependent methods
	};

	var testMode;

	var init = function(mode){
		include();
		// Sets up the debug canvas during testing
		TestModel.d_canvas = document.getElementById(Config.DEBUG_CANVAS_NAME);
		testMode = mode;

		if(mode == "test"){
			TestModel.context = TestModel.d_canvas.getContext("2d");
			
			TestModel.debugDraw = new B2d.b2DebugDraw();
			TestModel.debugDraw.SetSprite(TestModel.context);
			TestModel.debugDraw.SetDrawScale(Config.B2D.SCALE);
			TestModel.debugDraw.SetFillAlpha(0.3);
			TestModel.debugDraw.SetLineThickness(1.0);
			TestModel.debugDraw.SetFlags(B2d.b2DebugDraw.e_shapeBit | B2d.b2DebugDraw.e_jointBit);

			PhysicsController.set_debug_draw(TestModel.debugDraw);

			Config.B2D.debug_draw = true;
			// Screen_W was setup only after this was called

			TestModel.d_canvas.width = Config.SCREEN_W;
			TestModel.d_canvas.height = Config.SCREEN_H;

			//$('#'+Config.DEBUG_CANVAS_NAME).show();

		}else{
			//d_canvas.hide();
		}
	};
	
	//this function sets the x and y offsets of the debug canvas
	var set_debug_offset = function(x_offset, y_offset){
	    if (testMode == "test"){
	        context = TestModel.context;
	        context.save();
	        context.clearRect(0, 0, Config.SCREEN_W, Config.SCREEN_H);
	        context.translate(x_offset, y_offset);
	        PhysicsController.draw_debug();
	        context.restore();
	    }
	};

	return {
		init: init, 
		test: test,
		post_loading_tests: post_loading_tests,
		preinit_tests: preinit_tests,
		set_debug_offset: set_debug_offset
	}
})();

module.exports = TestController;

var Includes = require("../Includes.js"); var include_data = Includes.get_include_data({
	current_module: "TestController", 
	include_options: Includes.choices.DEFAULT
}); eval(include_data.name_statements); var include = function(){eval(include_data.module_statements);}


},{"../Includes.js":19}],17:[function(require,module,exports){
	
var WorldController = (function(){
	/* all the physics control of the whole world
	*/
    var movement_edge;
    var spawn_enemy;
    var difficulty;
		var season;
		var movement_edge_buffer;
		var body_test;
		var score;
		var progress;
	//var temp = 0;

	var init = function(){
		/* is ran from the InitController once when the game is loaded */

		include(); // satisfy requirements
		movement_edge_buffer = 20;
		movement_edge = 0;
		season = 0;
		score = 0;
		progress = 20;
		//body_test = new platform();
		//var id = IdentificationController.assign_id(body_test);
		//var body_test = PhysicsController.get_rectangular({}, body_test);

	};

	var update = function(delta){
		/* is ran each tick from the GameController.update_all */
		PhysicsController.step(delta);

		update_movement_edge();
		update_progress();

		get_spawn();
		//if(temp++ == 0){
			//TerrainController.NewTerrainSlice();
		//}

	};

	var update_progress = function(arguments){
		/**
		* 
		*/

		progress = get_movement_edge();
		
	};
	
	
	
	var update_movement_edge = function(){
		var heroes = EntityController.get_all_heroes();
		var min_x = Infinity;

		for(var net_id in heroes){
			// iterate through all connected heroes
			// and choose minimum of their x positions
			var hero_x = heroes[net_id].body.GetWorldCenter().x;
			if(hero_x < min_x){
				min_x = hero_x;
			}
		}

		if((movement_edge < min_x - movement_edge_buffer) && min_x != Infinity){
			movement_edge = min_x - movement_edge_buffer;
		}
	};
	
	var get_movement_edge = function(){
		return movement_edge;
	}

	var get_spawn = function () {
	    difficulty = Math.floor(progress / 100);

	    var spawn_num;
	    if (spawn_enemy) {
	        for (i = 0; i < Math.floor(Math.random() * 4) ; i++) {
	            spawn_num = Math.floor(Math.random() * 1000);
	            // demonstration purposes for hyena
                if (spawn_num <= 3 * difficulty) {
	                var new_medusa = EntityController.spawn(40 + get_movement_edge() + 20 * Math.random(), 10, "Medusa");
	            }
                else if (spawn_num <= 7 * difficulty) {
	                var new_hyena = EntityController.spawn(40 + get_movement_edge() + 20 * Math.random(), 10, "Hyena");
	            }
	            /*    // demonstration purposes for griffin
	            else if (spawn_num <= 15 * EntityModel.difficulty && Count > 5) {
	                var new_griffin = spawn(60 + WorldController.get_movement_edge() + i, -20, "Griffin");
	                Count = 0;
	            }*/
	            else if (spawn_num <= 14 * difficulty) {
	                var new_centaur = EntityController.spawn(40 + get_movement_edge() + 20 * Math.random(), 10, "Centaur");
	            }
	            else if (spawn_num <= 25 * difficulty) {
	                var new_griffin = EntityController.spawn(40 + get_movement_edge() + 20 * Math.random(), 10, "Griffin");
	            }
	                // demonstration purposes for ant
	            else {
	                var new_ant = EntityController.spawn(get_movement_edge() + 40 + 20 * Math.random(), 10, "ant");
	            }
	        }
	        spawn_enemy = false;
	    }
	    return spawn_num;
	}

	var set_spawn = function () {
	    spawn_enemy = true;
	}
	
	var get_season = function(){
		return season;
	}
	
	var set_season = function(index){
		season = index;
	}
	
	var MarkAsNewTerrainSlice = function(slice){
		
	};
	
	var get_progress = function(){
		return progress;
	};
	
	var increase_progress = function(amount){
		progress += amount;
	};
	
	var get_score = function(){
		return score;
	};
	
	var increase_score = function(amount){
		if(amount != null){
			score += amount;
		}else{
			throw "Error: >amount< is not defined";
		}
	};

	return {
		// declare public
		init: init, 
		update: update,
		get_movement_edge: get_movement_edge,
		get_season: get_season,
		set_season: set_season,
		get_spawn: get_spawn,
		set_spawn: set_spawn,
		increase_score: increase_score,
		increase_progress: increase_progress,
		get_score: get_score,
		get_progress: get_progress,
	};
})();

module.exports = WorldController;

var Includes = require("../Includes.js"); var include_data = Includes.get_include_data({
	current_module: "WorldController", 
	include_options: Includes.choices.DEFAULT
}); eval(include_data.name_statements); var include = function(){eval(include_data.module_statements);}


},{"../Includes.js":19}],18:[function(require,module,exports){
var GameUtility = (function()
{
  function arrow_key_scrolling(flag) {
    // Configures arrow key scrolling for canvas
    if (flag == false) {
      document.addEventListener('keydown', function (e) { // .getElementById("display_canvas")
        arrows = [37, 38, 39, 40];
        if (arrows.indexOf(e.keyCode) > -1) {
          e.preventDefault();
          return false;
        } else {
          return true
        }
      })
    }
  }

	var lg = function()
	{
		/*
		 * shortcut to console.log()
		 * prints all arguments to console
		 * first argument is used as a label for the rest
		 *
		 * each labeled group is enclosed into the colored delimiters
		 * >>> and <<< so it's easily distinguished. I found it helpful,
		 * if you don't let me know, or use something else
		 */
		console.log("%s %c %s", arguments[0], "background: #DAF2B1", ">>>");
		
		for(var i = 1; i < arguments.length; i++)
		{
			console.log("\t", arguments[i]);
		}
		console.log("%c<<<", "background: #DAF2B1");

	};

	var random_choice = function(probabilities, choices){
		/*
		   takes 2 arrays with elements at corresponding indexes
		   being choice and it's probability. picks random one.
		   choices are anything, probability is integer a, such that
		   probability of a choice is a/10. with a < 10, of course
		   and probabilities adding up to 10. 
		   Yes, it's not very good implementation (read: terrible), 
		   and since you noticed, now it's your job to improve it.

		*/

		// array with choices duplicated a proper amount of times based on
		// their probability
		var blah = []; 

		for(var i = 0; i < choices.length; i++){
			for(var j = 0; j < probabilities[i]; j++){
				blah.push(choices[i]);
			}
		}

		var rand_index = Math.floor(Math.random() * blah.length);

		return blah[rand_index];
	};

	
	var read_query_string = function(){
		/**
		* read the query string and put it into the object
		*/
	  var queries = {};
	  $.each(document.location.search.substr(1).split('&'),function(c,q){
		if(!(c == 0 && q == "")){
			var i = q.split('=');
			queries[i[0].toString()] = i[1].toString();
		}
	  });	

	  return queries;
	};
	
	

	return {
		lg: lg,
		random_choice: random_choice,
		read_query_string: read_query_string,
		
	};

})();

module.exports = GameUtility;

},{}],19:[function(require,module,exports){
var Include = function(){

	var modules;

	// simple enumerator // option codes MUST be power of 2 or sum of other options (with 0 being the only exception), and unique
	var choices = (function(){
		// simple options: numberic value must be 0 or some power of 2, name should be all caps and unique
		var result = {NONE: 0, ALL_CONTROLLERS: 1, ALL_MODELS: 2, OWN_MODEL: 4, OTHER_STUFF: 8, RENDERERS: 16, LOGIC: 32};

		// complex options: should consist of simple options, bitwise(!) OR'ed or AND'ed together in any fashion
		result.DEFAULT = (result.ALL_CONTROLLERS | result.OWN_MODEL | result.OTHER_STUFF);
		result.ALL =  (result.ALL_CONTROLLERS | result.ALL_MODELS | result.OTHER_STUFF); 
		result.RENDERER_SPECIFIC = (result.ALL_CONTROLLERS | result.OTHER_STUFF);
		result.LOGIC_SPECIFIC = (result.ALL_CONTROLLERS | result.OTHER_STUFF);

		// object is immutable
		return Object.freeze(result);
	})();

	var module_names = {
		Controllers: [
			"AssetController",
			"EntityController",
			"GameController",
			"GraphicsController",
			"InitController",
			"KeyboardController",
			"PhysicsController",
			"TerrainController",
			"TerrainSliceController",
			"TestController",
			"WorldController",
			"IdentificationController",
			"RegisterAsController",
			"NetworkController",
			"MultiplayerSyncController",
		],

		Models: [
		
			"AssetModel",
			"GameModel",
			"GraphicsModel",
			"KeyboardModel",
			"PhysicsModel",
			"TerrainModel",
			"TerrainSliceModel",
			"TestModel",
			"WorldModel",
			"EntityModel",
			"RegisterAsModel",
			"NetworkModel",
			"MultiplayerSyncModel",
		],

		Other: [
		
			"B2d",
			"Box2D",
			"Config",
			"GameUtility",
		],

		Renderers: [
			"AntRenderer",
			"HeroRenderer",
            "MedusaRenderer",
			"TerrainCellRenderer",
			"GriffinRenderer",
            "CentaurRenderer",
			"HyenaRenderer",
			"TerrainSliceRenderer",
			"BackgroundRenderer",
			"HUDRenderer",
            "PizzaRenderer",
			"EsteemedCompanionRenderer",
		],

		Logic: [
			"AntLogic",
			"HeroLogic",
			"GriffinLogic",
            "CentaurLogic",
            "MedusaLogic",
			"HyenaLogic",
			"EsteemedCompanionLogic",
            "PizzaLogic",
		],

	};//end module_names


	var init = function(){

		modules = {
			AssetController: require("./Controllers/AssetController.js"),
			GraphicsController: require("./Controllers/GraphicsController.js"),
			KeyboardController: require("./Controllers/KeyboardController.js"),
			PhysicsController: require("./Controllers/PhysicsController.js"),
			TerrainController: require("./Controllers/TerrainController.js"),
			TerrainSliceController: require("./Controllers/TerrainSliceController.js"),
			WorldController: require("./Controllers/WorldController.js"),
			InitController: require("./Controllers/InitController.js"),
			TestController: require("./Controllers/TestController.js"),
			GameController: require("./Controllers/GameController.js"),
			EntityController: require("./Controllers/EntityController.js"),
			IdentificationController: require("./Controllers/IdentificationController.js"),
			RegisterAsController: require("./Controllers/RegisterAsController.js"),
			
			NetworkController: require("./Controllers/NetworkController.js"),
			MultiplayerSyncController: require("./Controllers/MultiplayerSyncController.js"),
			
			// Models

			GameModel: require("./Models/GameModel.js"),
			TerrainSliceModel: require("./Models/TerrainSliceModel.js"),
			AssetModel: require("./Models/AssetModel.js"),
			PhysicsModel: require("./Models/PhysicsModel.js"),
			GraphicsModel: require("./Models/GraphicsModel.js"),
			TerrainModel: require("./Models/TerrainModel.js"),
			WorldModel: require("./Models/WorldModel.js"),
			KeyboardModel: require("./Models/KeyboardModel.js"),
			TestModel: require("./Models/TestModel.js"),
			IdentificationModel: require("./Models/IdentificationModel.js"),
			EntityModel: require("./Models/EntityModel.js"),
			RegisterAsModel: require("./Models/RegisterAsModel.js"),
			NetworkModel: require("./Models/NetworkModel.js"),
			MultiplayerSyncModel: require("./Models/MultiplayerSyncModel.js"),
						
			// Other stuff
			
			Config: require("./Config.js"),
			GameUtility: require("./GameUtility.js"),
			B2d: require("./B2d.js"),
			Box2D: require("box2dweb"),
			
			// Renderers
			
			AntRenderer: require("./Renderers/AntRenderer.js"),
			GriffinRenderer: require("./Renderers/GriffinRenderer.js"),
            MedusaRenderer: require("./Renderers/MedusaRenderer.js"),
            CentaurRenderer: require("./Renderers/CentaurRenderer.js"),
            HyenaRenderer: require("./Renderers/HyenaRenderer.js"),
			HeroRenderer: require("./Renderers/HeroRenderer.js"),
			TerrainCellRenderer: require("./Renderers/TerrainCellRenderer.js"),
			TerrainSliceRenderer: require("./Renderers/TerrainSliceRenderer.js"),
			BackgroundRenderer: require("./Renderers/BackgroundRenderer.js"),
			HUDRenderer: require("./Renderers/HUDRenderer.js"),
			PizzaRenderer: require("./Renderers/PizzaRenderer.js"),
			
			
			
			EsteemedCompanionRenderer: require("./Renderers/EsteemedCompanionRenderer.js"),
			
			// Logic
			AntLogic: require("./Logic/AntLogic.js"),
			GriffinLogic: require("./Logic/GriffinLogic.js"),
			MedusaLogic: require("./Logic/MedusaLogic.js"),
            CentaurLogic: require("./Logic/CentaurLogic.js"),
			HyenaLogic: require("./Logic/HyenaLogic.js"),
			HeroLogic: require("./Logic/HeroLogic.js"),
			EsteemedCompanionLogic: require("./Logic/EsteemedCompanionLogic.js"),
			PizzaLogic: require("./Logic/PizzaLogic.js"),

		};

	}; // end init

	var option_is_set = function(what_mods_selected, options){
		if(what_mods_selected == 0 && options == 0){
			return true;
		}
		// be mindful of bitwise operator ahead
		return (what_mods_selected & options);
	};//end option_is_set

	var get_module = function(name){
		// can be modified to throw object error instead of simple one
		// in that case it may contain list of defined modules
		// may also be modified to check whether module is missing from 
		// module_names, modules, or both, and give more accurate description
		var message = "Module " + name + 
			" is undefined. Note that you must hardcode all new modules" + 
			" into the Includes.module_names AND Includes.modules."
		
		if(modules){
			if(modules[name]){
				return modules[name];
			}else if(console.warn){ // check if console.warn is available
				console.warn(message);
			}else{
				throw message;
			}
		}else{
			throw "Error: You must run the Includes.init() before you can use any modules";
		}
	};//end get_module
	

	var get_names = function(current_module_name, options_code){
		var result = {Models: [], Controllers: [], Other: [], Renderers: [], Logic: [],};

		if(option_is_set(choices.NONE, options_code)){
			return result;
		}

		if (option_is_set(choices.ALL_CONTROLLERS, options_code)){

			var controller_names = module_names.Controllers;

			for(var i = 0; i < controller_names.length; i++){

				var ctl_name = controller_names[i];

				if(ctl_name != current_module_name){
					result.Controllers.push(ctl_name);
				}
			}
			
		}

		if (option_is_set(choices.ALL_MODELS, options_code)){
			result.Models = module_names.Models;
		}else if(option_is_set(choices.OWN_MODEL, options_code)){
			var own_model = current_module_name.replace("Controller", "Model");
			result.Models.push(own_model);
		}

		if(option_is_set(choices.OTHER_STUFF, options_code)){
			result.Other = module_names.Other;
		}

		if(option_is_set(choices.RENDERERS, options_code)){
			result.Renderers = module_names.Renderers;
		}

		if(option_is_set(choices.LOGIC, options_code)){
			result.Logic = module_names.Logic;
		}

		return result;
	};//end get_names

	var sections = ["Models", "Controllers", "Other", "Renderers", "Logic"];
	var get_name_statements = function(names){
		var result = "";
		for(var section_index = 0; section_index < sections.length; section_index++){
			var section = sections[section_index];
			for(var i = 0; i < names[section].length; i++){
				result += ("var " + names[section][i] + "; ");
			}
		}

		return result;
		
	};//end get_name_statements

	var get_module_statements = function(names){
		var result = "";
		for(var section_index = 0; section_index < sections.length; section_index++){
			var section = sections[section_index];
			for(var i = 0; i < names[section].length; i++){
				result += (names[section][i] + " = Includes.get_module(\"" + names[section][i] + "\"); ");
			}
		}

		return result;
	};//end get_module_statements

	var get_include_data = function(params){
		var current_module = params.current_module;
		var include_options = params.include_options;
		var names = get_names(current_module, include_options);

		var name_statements = get_name_statements(names);
		var module_statements = get_module_statements(names);

		return {
			imported_modules: names,
			name_statements: name_statements,
			module_statements: module_statements,
		};

	};//end get_include_data

	var automated_tests = function(){
		
		QUnit.test("option matching function", function( assert) {

			//If both are none
			assert.equal(option_is_set(choices.NONE, choices.NONE), true);

			assert.throws(option_is_set(choices.NONE, -1));

			//If both match, it returns the value of choices
			//If they don't match, it returns 0
			
			//MATCH
			assert.equal(option_is_set(choices.ALL_CONTROLLERS, choices.ALL_CONTROLLERS), 1);
			assert.equal(option_is_set(choices.ALL_MODELS, choices.ALL_MODELS), 2);
			assert.equal(option_is_set(choices.OTHER_STUFF, choices.OTHER_STUFF), 8);

			//Mismatch
			assert.equal(option_is_set(choices.NONE, choices.ALL_CONTROLLERS), 0);
			assert.equal(option_is_set(choices.OTHER_STUFF, choices.NONE), 0);
			assert.equal(option_is_set(choices.ALL_MODELS, choices.ALL_CONTROLLERS), 0);
			assert.equal(option_is_set(choices.OWN_MODEL, choices.ALL_MODELS), 0);
		});//end option matching test
		
	};//end automated_tests


	return {
		init: init,
		module_names: module_names,
		get_module: get_module,
		get_include_data: get_include_data,
		choices: choices,
		automated_tests: automated_tests
	};

};

module.exports = new Include;


},{"./B2d.js":1,"./Config.js":2,"./Controllers/AssetController.js":3,"./Controllers/EntityController.js":4,"./Controllers/GameController.js":5,"./Controllers/GraphicsController.js":6,"./Controllers/IdentificationController.js":7,"./Controllers/InitController.js":8,"./Controllers/KeyboardController.js":9,"./Controllers/MultiplayerSyncController.js":10,"./Controllers/NetworkController.js":11,"./Controllers/PhysicsController.js":12,"./Controllers/RegisterAsController.js":13,"./Controllers/TerrainController.js":14,"./Controllers/TerrainSliceController.js":15,"./Controllers/TestController.js":16,"./Controllers/WorldController.js":17,"./GameUtility.js":18,"./Logic/AntLogic.js":20,"./Logic/CentaurLogic.js":21,"./Logic/EsteemedCompanionLogic.js":22,"./Logic/GriffinLogic.js":23,"./Logic/HeroLogic.js":24,"./Logic/HyenaLogic.js":25,"./Logic/MedusaLogic.js":26,"./Logic/PizzaLogic.js":27,"./Models/AssetModel.js":28,"./Models/EntityModel.js":29,"./Models/GameModel.js":30,"./Models/GraphicsModel.js":31,"./Models/IdentificationModel.js":32,"./Models/KeyboardModel.js":33,"./Models/MultiplayerSyncModel.js":34,"./Models/NetworkModel.js":35,"./Models/PhysicsModel.js":36,"./Models/RegisterAsModel.js":37,"./Models/TerrainModel.js":38,"./Models/TerrainSliceModel.js":39,"./Models/TestModel.js":40,"./Models/WorldModel.js":41,"./Renderers/AntRenderer.js":42,"./Renderers/BackgroundRenderer.js":43,"./Renderers/CentaurRenderer.js":44,"./Renderers/EsteemedCompanionRenderer.js":45,"./Renderers/GriffinRenderer.js":46,"./Renderers/HUDRenderer.js":47,"./Renderers/HeroRenderer.js":48,"./Renderers/HyenaRenderer.js":49,"./Renderers/MedusaRenderer.js":50,"./Renderers/PizzaRenderer.js":51,"./Renderers/TerrainCellRenderer.js":52,"./Renderers/TerrainSliceRenderer.js":53,"box2dweb":55}],20:[function(require,module,exports){
var AntLogic = (function(){

	var Ant = function(){
		/* Will be instantiated for every created entity to hold all the information 
			about the physical (not graphical) state of the entity in question. 
			declare the properties like this:
			this.some_state_variable_initial_value = 0;
			instantiate (most likely in the spawn function) like that:
			var new_entity_instance = new Ant();
		*/
		var entity = EntityController.create_abstract_entity();
		
		entity.hero_hurt_me = false;
		entity.me_hurt_hero = false;
		entity.death_tick = 0;

		entity.hp = 3;
		entity.speed = 3;
		entity.damage = 1;
		entity.point_value = 50;

		entity.AI_state = "walk";//use entity to keep track of the enemy's AI state
		
		entity.can_attack = true;
		entity.aliveflag = true;
		entity.unhurtflag = true;
		entity.needs_graphics_update = false;

		entity.direction = false;
		entity.pop = 40;
		entity.popup = 0;
		
		entity.can_leap = true;		//leaping enabled

		entity.maintenance_frequency = 20;//ticks between routine maintenance checks
		entity.maintenance_timer = entity.maintenance_frequency;
		entity.blinking = false;
		entity.barely_obstructed = false;
		entity.collision_buffer = 0.2	//the region of overlap accounted for during collision checking
		entity.path_blocked = false;	//is entity deprecated? set during collision
		entity.obstruction_tolerance = 2;//how many times the hyena can be blocked before he takes action
		entity.blocked_count = 0;			//tracks number of times blocked between maintenance checks


		return entity;
	};

	var init = function(){
		/* Is run from the EntityController.init once during game loading 
		 	you should assign type to your model here using the identification controller
		 */
		include(); // satisfy requirements, GOES FIRST
		IdentificationController.assign_type(Ant, "ant");
	};

	var spawn = function(x, y){
		/* spawn instance of this entity at the given coordinates
			you will have to create new entity instance, assign it id
			using the IdentificationController.assign_id(entity_instance),
			assign it a body which you can get through PhysicsController
			do any other stuff you want to do during spawning,
			and finally you HAVE TO(!!!) return the instance you just created from this function
		*/

		var new_ant = new Ant();
		new_ant.type = "ant";
		var id = IdentificationController.assign_id(new_ant);

		new_ant.body = PhysicsController.get_rectangular({x: x, y: y, border_sensors: true}, new_ant);	

		return new_ant;

	};

    //Begin Ant AI --------------------------------------------------------------------------------
	var tick_AI = function(ant){
	    /* Is ran each tick from the EntityController.update for every registered
			entity of this type. I given entity_instance
		*/

	    //if enemy is dead, die
	    //if (ant.body.GetWorldCenter().y > 22 || ant.body.GetWorldCenter().x < Config.Player.movement_edge - 1) {
	    //EntityController.delete_entity();
	    //console.log("drop of death");
	    //}
	    //
	    if (ant.hp <= 0) { //If Ant is Dead, Die
	        ant.die();
				if (ant.blinking) {
				    ant.blink_timer--;
				    if (ant.blink_timer == 0) {
				        ant.blinking = false;
				    }
				}
	    } else { // hp > 1

	        ant.change_animation("walk");

	        //Maintenance....
	        ant.direction_previous = ant.direction;				//remember direction at start of tick
	        ant.x_previous = ant.body.GetWorldCenter().x; //remember x at start of tick
			
	        //do maintenance
	        //ant.direction_previous = ant.direction;
	        //ant.x_previous = ant.body.GetWorldCenter().x
	        //if blocked, turn around
	        //if ((!ant.path_free() || ant.xprevious == ant.body.GetWorldCenter().x) && !ant.in_air()) {
	        //    ant.direction = !ant.direction;
	        //}
			
	        if (ant.animation == "walk") { //Move forward
	            ant.move(ant.speed);
	        }

	        //Run Main AI Script.....
	        if (!ant.in_air() || ant.body.GetLinearVelocity().y == 0) { //if on ground OR if we suspect he's stuck on a corner
	            if (ant.enemy_in_range(ant.sight_range)) { //if enemy nearby

	                if (ant.hit_taken) {
	                    ant.change_animation("upside_down");
	                    ant.take_damage();
						ant.blinking = true;
						
	                }
	                else if ((ant.path_blocked) && ant.can_leap && ant.leap_cooldown_timer <= 0) { //if  path is blocked, and leaping is enabled, leap
	                    ant.direction = ant.direction_nearest_enemy();
	                    leap(ant);
	                    ant.can_leap = false;
	                    ant.leap_cooldown_timer = ant.leap_cooldown;
	                } else {
	                    if (!ant.in_air()) { //if hyena isn't cowering or in the air, face the enemy
	                        ant.direction = ant.direction_nearest_enemy();
	                    }

	                }

	            }



	            //check periodically to ensure the ant is not stuck and other routine maintenance
                
	            ant.maintenance_timer--;
	            if (ant.maintenance_timer == 0) {
	                ant.jump(0, -2);
	                if (ant.path_free()) {
	                    ant.path_blocked = false;
	                }
	                if (ant.blocked_count > ant.obstruction_tolerance) {	//you know he's stuck now
	                    if (ant.can_leap) {
	                        ant.path_blocked = true;
	                        leap(ant);	//attempt to get out of jam or stuck
	                        ant.path_blocked = false;
	                    }
	                }
	                ant.blocked_count = 0;
	                ant.maintenance_timer = ant.maintenance_frequency; //reset check timer
	            }

	            //if (ant.hp == 1) {
	            //    ant.popup++;
	            //    if (ant.popup == ant.pop) {
	            //        ant.jump(10, -20);
	            //        ant.hp++;
	            //        ant.popup = 0;
	            //        ant.can_attack = true;
	            //        ant.unhurtflag = true;
	            //        ant.change_animation("walk");
	            //    }
	            //}
	        }
	    }
	};

    //End Ant AI ---------------------------------------------------------


    //Helper Functions -------------------------------------------------
	var leap = function (ant) {
	    if (ant.path_blocked) {//jump out of a hole or over a wall
	        ant.jump(-10 + (20 * ant.direction), -1 * ant.jump_force);
	    } else { //leap viciously at hero
	        ant.jump((2 * ant.jump_force * ant.direction) - ant.jump_force, -1 * ant.jump_force / 2);
	    }
	    ant.can_leap = false;
	};



	//Collision Handlers ----------------------------------------------
	var begin_contact = function (contact, info) {
	    //handle collisions here
	    if ((info.Me.fixture_name == "right" || info.Me.fixture_name == "left") && info.Them.type != "pizza") {
	        info.Me.entity.direction = !info.Me.entity.direction;
	        console.log('hit');
	        if (info.Them.entity.point_value > 0) {
	            info.Me.entity.direction = Math.round(Math.random());
	            info.Them.entity.direction = Math.round(Math.random());
	        }
	    }

	    if (info.Them.type == "hero") {
	        if (info.Them.fixture_name != "bottom" && info.Me.entity.can_attack) {
	            info.Me.entity.me_hurt_hero = true;
	        } else {
	            info.Me.entity.hit_taken = true;//take damage if enemy collides from above and distance < vulnerability radius
	            info.Me.entity.damage_taken = info.Them.entity.damage;
	        }
	    }
	};

	var end_contact = function(contact, info) {
	
	};

	
	return {
		// declare public
		init: init, 
		spawn: spawn,
		tick_AI: tick_AI,
		begin_contact: begin_contact,
		end_contact: end_contact,
	};
})();

module.exports = AntLogic;

var Includes = require("../Includes.js"); var include_data = Includes.get_include_data({
	current_module: "AntLogic", 
	include_options: Includes.choices.LOGIC_SPECIFIC
}); eval(include_data.name_statements); var include = function(){eval(include_data.module_statements);}

},{"../Includes.js":19}],21:[function(require,module,exports){
var CentaurLogic = (function(){
   
	var Centaur = function(){
		/* Will be instantiated for every created entity to hold all the information 
			about the physical (not graphical) state of the entity in question. 
			declare the properties like entity:
			entity.some_state_variable_initial_value = 0;
			instantiate (most likely in the spawn function) like that:
			var new_entity_instance = new Centaur();
		*/
		var entity = EntityController.create_abstract_entity();
		
		entity.hero_hurt_me = false;
		entity.me_hurt_hero = false;
		entity.death_tick = 0;

		//set your game logic parameters here
		//entity.object_id = 1; //hardcode a unique identifier for each new enemy class
		entity.hp = 4;
		entity.speed = 4;
		entity.damage = 12;
		entity.point_value = 100;
		//entity.attack_cooldown = 4; //use entity for enemies who need
		entity.can_attack = true;//use entity for enemies who alternate between 
		//entity.cooldown_timer=-1;
		entity.AI_state = "walk";//use entity to keep track of the enemy's AI state

		entity.can_attack = true;
		entity.aliveflag = true;
		entity.unhurtflag = true;
		entity.needs_graphics_update = false;

		entity.maintenance_frequency = 20;//ticks between routine maintenance checks
		entity.maintenance_timer = entity.maintenance_frequency;

		entity.direction = false;
		entity.jolt_force = 100;

		entity.blinking = false;
		entity.blink_timer = -1;
		entity.blink_duration = 20;//how long the entity blinks after taking damage
		
		return entity;
	};

	var init = function(){
		/* Is ran from the EntityController.init once during game loading 
		 	you should assign type to your model here using the identification controller
		 */
		include(); // satisfy requirements, GOES FIRST
		IdentificationController.assign_type(Centaur, "Centaur");
	};

	var spawn = function(x, y){
		/* spawn instance of this entity at the given coordinates
			you will have to create new entity instance, assign it id
			using the IdentificationController.assign_id(entity_instance),
			assign it a body which you can get through PhysicsController
			do any other stuff you want to do during spawning,
			and finally you HAVE TO(!!!) return the instance you just created from this function
		*/

		var new_Centaur = new Centaur();
		new_Centaur.type = "Centaur";
		var id = IdentificationController.assign_id(new_Centaur);

		new_Centaur.body = PhysicsController.get_rectangular({x: x, y: y, border_sensors: true}, new_Centaur);	

		return new_Centaur;

	};

	var tick_AI = function(Centaur){
		/* Is ran each tick from the EntityController.update for every registered
			entity of this type. I given entity_instance
		*/

		//if dead, die
		if (Centaur.hp <= 0) {
			Centaur.die();
		}else{ // Centaur.hp >= 1
				Centaur.change_animation("walk");
			
				if (Centaur.blinking) {
				    Centaur.blink_timer--;
				    if (Centaur.blink_timer == 0) {
				        Centaur.blinking = false;
				    }
				}

			if (Centaur.animation == "walk"){
				Centaur.move(Centaur.speed);
			}
			if (Centaur.animation == "jolt"){
			    Centaur.jump((2 * Centaur.jolt_force * Centaur.direction) - Centaur.jolt_force, Centaur.jolt_force/2);
			}
			if (Centaur.hit_taken){
				Centaur.take_damage();
			}

			Centaur.maintenance_timer--;
			if (Centaur.maintenance_timer == 0) {
			    Centaur.jump(0, -2);
			    Centaur.maintenance_timer = Centaur.maintenance_frequency; //reset check timer
			}
		}
	};

	// // //Set up Collision handler
	
	
	var begin_contact = function(contact, info){
	    //handle collisions here

	    if ((info.Me.fixture_name == "right" || info.Me.fixture_name == "left") && info.Them.type != "pizza") {
	        info.Me.entity.direction = !info.Me.entity.direction;
	        console.log('hit');
	        if (info.Them.entity.point_value > 0) {
	            info.Me.entity.direction = Math.round(Math.random());
	            info.Them.entity.direction = Math.round(Math.random());
	        }
	    }
		
		if(info.Them.type == "hero"){
			if(info.Them.fixture_name != "bottom" && info.Me.entity.can_attack){
				info.Me.entity.me_hurt_hero = true;
			}else{
				info.Me.entity.hit_taken = true;//take damage if enemy collides from above and distance < vulnerability radius
				info.Me.entity.damage_taken = info.Them.entity.damage;
			}
		}
	};

	var end_contact = function(contact, info){
	
	};

	
	return {
		// declare public
		init: init, 
		spawn: spawn,
		tick_AI: tick_AI,
		begin_contact: begin_contact,
		end_contact: end_contact,
	};
})();

module.exports = CentaurLogic;

var Includes = require("../Includes.js"); var include_data = Includes.get_include_data({
	current_module: "CentaurLogic", 
	include_options: Includes.choices.LOGIC_SPECIFIC
}); eval(include_data.name_statements); var include = function(){eval(include_data.module_statements);}
},{"../Includes.js":19}],22:[function(require,module,exports){
var EsteemedCompanionLogic = (function(){

		
	var Companion = function(){
		/* Will be instantiated for every created entity to hold all the information 
			about the physical (not graphical) state of the entity in question. 
			declare the properties like this:
			this.some_state_variable_initial_value = 0;
			instantiate (most likely in the spawn function) like that:
			var new_entity_instance = new EsteemedCompanion();
		*/
		this.hp = 100;
		this.wound = false;
		this.jumps = 0;
		this.score = 0;
	};

	var init = function(){
		/* Is ran from the EntityController.init once during game loading 
			you should assign type to your model here using the identification controller
		*/
		include(); // satisfy requirements, GOES FIRST
		IdentificationController.assign_type(Companion, "companion");
	};

	var spawn = function(x, y){
		/* spawn instance of this entity at the given coordinates
			you will have to create new entity instance, assign it id
			using the IdentificationController.assign_id(entity_instance),
			assign it a body which you can get through PhysicsController
			do any other stuff you want to do during spawning,
			and finally you HAVE TO(!!!) return the instance you just created from this function
		*/

		var companion = new Companion();

		companion.body = PhysicsController.get_rectangular({x: x, y: y, border_sensors: true}, companion);

		//var id = IdentificationController.assign_id(companion);

		companion.hp = 100;
		companion.wound = false;
		companion.jumps = 0;
		companion.score = 0;


		return companion;
	
	};

	var tick_AI = function(companion){
		/* Is ran each tick from the EntityController.update for every registered
			entity of this type. I given entity_instance
		*/

		
		console.warn("ticking companion");

		

		var cmds = KeyboardController.movement_commands();

		var MOVEMENT_EDGE = 500; // where terrain start scrolling


		// TEMPORARYYYYYYYYYYYYYYYY

		if(companion.wound)
		{
			companion.hp--;
			console.log("Taking damage");
			GraphicsController.update_health(companion.hp);
		}
		
		if(companion.hp <= 0)
		{
			createjs.Ticker.paused = true;
			console.log("Player Is Dead");
		}
		GraphicsController.update_score(companion.score);
	};

	var begin_contact = function(contact, info){
		//console.log(info.Me.id, ":", "My fixture", "'" + info.Me.fixture_name + "'", "came into contact with fixture", 
			//"'" + info.Them.fixture_name + "'", "of", info.Them.id);
		if (info.Me.fixture_name == "bottom"){
			info.Me.entity.jumps = 0;
		}
		if (info.Me.fixture_name == "top"){
			take_hit(info.Me.entity, 1);
		}
		
		if(info.Me.fixture_name != "bottom" && info.Them.entity.can_attack)
		{
		    info.Me.entity.wound = true;
		    add_score(info.Me.entity, 100);
		}
				
	};
	
	var add_score = function (companion, amount) {
	    companion.score += amount;
	}
	

	var take_hit = function(companion, amount){
	    companion.hp -= amount;
		//GraphicsController.update_health(companion.hp);
	}

	var end_contact = function(contact, info){
			
		info.Me.entity.wound = false;
	};

	var move_right = function(companion){
		var body = companion.body;
		var velocity = body.GetLinearVelocity();
		velocity.x = 5;
		body.SetLinearVelocity(velocity); // body.SetLinearVelocity(new b2Vec2(5, 0)); would work too
		body.SetAwake(true);
		//companion.x += 10; // old
		//companion.x = (body.GetPosition().x + 1.5/2) * 30 ; 
	};

	var jump = function(companion){
	    var body = companion.body;
		if (companion.jumps == 0){
		    body.ApplyImpulse(new B2d.b2Vec2(0, -100), body.GetWorldCenter());
		    companion.jumps += 1;
		}
		else if (companion.jumps == 1 && body.GetLinearVelocity().y > -1) {
		    body.ApplyImpulse(new B2d.b2Vec2(0, -100), body.GetWorldCenter());
		    companion.jumps += 1;
		}

		//companion.y = body.GetPosition().y * 30;
	
	};

	var set_coordinates = function(position_vector, companion){
		// TODO: remove;
		// temporary/testing
		companion.x = (position_vector.x - 1.5/2) * 30 ;
		companion.y = (position_vector.y + 2.5/2) * 30 ;

	};

	var b2b_get_coordinates = function(companion){
		return companion.body.GetWorldCenter();
	};

	var move_left = function(companion){
		var velocity = companion.body.GetLinearVelocity();
		velocity.x = -5;
		companion.body.SetLinearVelocity(velocity); // companion.SetLinearVelocity(new b2Vec2(5, 0)); would work too
		companion.body.SetAwake(true);
	};

	var move_right = function(companion){
		var velocity = companion.body.GetLinearVelocity();
		velocity.x = +5;
		companion.body.SetLinearVelocity(velocity); // companion.SetLinearVelocity(new b2Vec2(5, 0)); would work too
		companion.body.SetAwake(true);
	};

	var move = function(offset_x, offset_y, companion){
		// unimplemented
		// should it hard-set position (not safe!)
		// or just allow to set any velocity/impulse vector?
	};

	return {
		// declare public
		init: init, 
		spawn: spawn,
		tick_AI: tick_AI,
		begin_contact: begin_contact,
		end_contact: end_contact,
	};
})();

module.exports = EsteemedCompanionLogic;

var Includes = require("../Includes.js"); var include_data = Includes.get_include_data({
	current_module: "EsteemedCompanionLogic", 
	include_options: Includes.choices.LOGIC_SPECIFIC
}); eval(include_data.name_statements); var include = function(){eval(include_data.module_statements);}

},{"../Includes.js":19}],23:[function(require,module,exports){
var GriffinLogic = (function(){
   
	var Griffin = function(){
		/* Will be instantiated for every created entity to hold all the information 
			about the physical (not graphical) state of the entity in question. 
			declare the properties like entity:
			entity.some_state_variable_initial_value = 0;
			instantiate (most likely in the spawn function) like that:
			var new_entity_instance = new Griffin();
		*/
		var entity = EntityController.create_abstract_entity();
		
		entity.hero_hurt_me = false;
		entity.me_hurt_hero = false;
		entity.death_tick = 0;

		//set your game logic parameters here
		//entity.object_id = 1; //hardcode a unique identifier for each new enemy class
		entity.hp = 3;
		entity.speed = 6;
		entity.damage = 10;
		entity.point_value = 100;
		//entity.attack_cooldown = 4; //use entity for enemies who need
		entity.can_attack = true;//use entity for enemies who alternate between 
		//entity.cooldown_timer=-1;
		entity.AI_state = "fly";//use entity to keep track of the enemy's AI state
		entity.aliveflag = true;
		entity.unhurtflag = true;
		entity.needs_graphics_update = false;

		entity.maintenance_frequency = 20;//ticks between routine maintenance checks
		entity.maintenance_timer = entity.maintenance_frequency;

		entity.direction = false;
		entity.fly_force = 100;
		entity.blinking = false;
		entity.blink_timer = -1;
		entity.blink_duration = 20;//how long the entity blinks after taking damage
		return entity;
	};

	var init = function(){
		/* Is ran from the EntityController.init once during game loading 
		 	you should assign type to your model here using the identification controller
		 */
		include(); // satisfy requirements, GOES FIRST
		IdentificationController.assign_type(Griffin, "Griffin");
	};

	var spawn = function(x, y){
		/* spawn instance of this entity at the given coordinates
			you will have to create new entity instance, assign it id
			using the IdentificationController.assign_id(entity_instance),
			assign it a body which you can get through PhysicsController
			do any other stuff you want to do during spawning,
			and finally you HAVE TO(!!!) return the instance you just created from this function
		*/

		var new_Griffin = new Griffin();
		new_Griffin.type = "Griffin";
		var id = IdentificationController.assign_id(new_Griffin);

		new_Griffin.body = PhysicsController.get_rectangular({x: x, y: y, border_sensors: true}, new_Griffin);	

		return new_Griffin;

	};

	var tick_AI = function(Griffin){
		/* Is ran each tick from the EntityController.update for every registered
			entity of this type. I given entity_instance
		*/

		//if dead, die
		if (Griffin.hp <= 0) {
			Griffin.die();
		}else{ // Griffin.hp >= 1

		    if (Griffin.blinking) {
		        Griffin.blink_timer--;
		        if (Griffin.blink_timer == 0) {
		            Griffin.blinking = false;
		        }
		    }

		    if (Griffin.in_air()) {
				Griffin.change_animation("fly");
			}else{
				Griffin.change_animation("walk");
			}
			if (Griffin.animation == "walk"){
				Griffin.move(Griffin.speed);
			}
			if (Griffin.animation == "fly"){
			    Griffin.jump((2 * Griffin.fly_force * Griffin.direction) - Griffin.fly_force, Griffin.fly_force/2);
			}
			if (Griffin.hit_taken){
			        Griffin.take_damage(); //if hit, take damage
			}

			Griffin.maintenance_timer--;
			if (Griffin.maintenance_timer == 0) {
			    Griffin.jump(0, -2);
			    Griffin.maintenance_timer = Griffin.maintenance_frequency; //reset check timer
			}
		}
	};

	// // //Set up Collision handler
	
	
	var begin_contact = function(contact, info){
		//handle collisions here
		
	    if ((info.Me.fixture_name == "right" || info.Me.fixture_name == "left") && info.Them.type != "pizza") {
	        info.Me.entity.direction = !info.Me.entity.direction;
	        console.log('hit');
	        if (info.Them.entity.point_value > 0) {
	            info.Me.entity.direction = Math.round(Math.random());
	            info.Them.entity.direction = Math.round(Math.random());
	        }
	    }

		if(info.Them.type == "hero"){
			if(info.Them.fixture_name != "bottom" && info.Me.entity.can_attack){
				info.Me.entity.me_hurt_hero = true;
			}else{
				info.Me.entity.hit_taken = true;//take damage if enemy collides from above and distance < vulnerability radius
				info.Me.entity.damage_taken = info.Them.entity.damage;
			}
		}
	};

	var end_contact = function(contact, info){
	
	};

	
	return {
		// declare public
		init: init, 
		spawn: spawn,
		tick_AI: tick_AI,
		begin_contact: begin_contact,
		end_contact: end_contact,
	};
})();

module.exports = GriffinLogic;

var Includes = require("../Includes.js"); var include_data = Includes.get_include_data({
	current_module: "GriffinLogic", 
	include_options: Includes.choices.LOGIC_SPECIFIC
}); eval(include_data.name_statements); var include = function(){eval(include_data.module_statements);}

},{"../Includes.js":19}],24:[function(require,module,exports){
var HeroLogic = (function(){

	var Hero = function(){
		/* Will be instantiated for every created entity to hold all the information 
			about the physical (not graphical) state of the entity in question. 
			declare the properties like this:
			this.some_state_variable_initial_value = 0;
			instantiate (most likely in the spawn function) like that:
			var new_entity_instance = new Hero();
		*/
		entity = new EntityController.create_abstract_entity();
		
		entity.hp = 100;
		entity.speed = 8;
		entity.hit_taken = false;
		entity.damage_taken = 0;
		entity.damage = 1;
		entity.is_walking = false;
		entity.point_value = 0;
		
		entity.jumps = 0;
		entity.decay_duration = 35;//time between decay animation and deletion
		entity.death_duration = 60;//time between death and deletion
		entity.jump_tick=0;

		entity.direction = 1; //default direction = left
		
		entity.needs_graphics_update = false; //accessed by renderer for animation purposes
		entity.animation = "stand"; //accessed by renderer for animation purposes
		
		return entity;
	};

	var init = function(){
		/* Is ran from the EntityController.init once during game loading 
			you should assign type to your model here using the identification controller
		*/
		include(); // satisfy requirements, GOES FIRST
		IdentificationController.assign_type(Hero, "hero");
	};

	var spawn = function(x, y){
		/* spawn instance of this entity at the given coordinates
			you will have to create new entity instance, assign it id
			using the IdentificationController.assign_id(entity_instance),
			assign it a body which you can get through PhysicsController
			do any other stuff you want to do during spawning,
			and finally you HAVE TO(!!!) return the instance you just created from this function
		*/


		var hero = new Hero();
		hero.type = "hero";
		hero.body = PhysicsController.get_rectangular({x: x, y: y, border_sensors: true}, hero);
		
		hero.player_id = NetworkController.get_network_id();
		hero.hp = 100;
		hero.wound = false;
		hero.jumps = 0;
		hero.score = 0;
		hero.direction = false;
		return hero;
	
	};

	var tick_AI = function(hero){
		/* Is ran each tick from the EntityController.update for every registered
			entity of this type. I given entity_instance
		*/
		if(hero.player_id == NetworkController.get_network_id()){
			var cmds = KeyboardController.movement_commands();
		}else{
			var cmds = KeyboardController.get_remote_movement(hero.player_id);
		}

		hero.direction_previous = hero.direction;
		hero.x_previous = hero.body.GetWorldCenter().x;
		hero.y_previous = hero.body.GetWorldCenter().y;
       
		if(hero.hp <= 0){
			hero.die();
		}else{
			hero.is_walking = false;	
			
			if(cmds("right")){
				 if(hero.jumps==0){
					hero.change_animation("walk");
					hero.is_walking = true;
				}
				hero.direction = false;//direction = right
				hero.move(-hero.speed);
			}
			
			if(cmds("left")){
				if(hero.jumps==0){
					hero.change_animation("walk");
					hero.is_walking = true;
				}
				hero.direction = true;//direction = left
				hero.move(-hero.speed);
			}
			
			if(cmds("down")){
				slam(hero);
				stop_hero(hero);
			}
			
			if(cmds("up")){
				jump(hero);
			}
			
			if(!hero.is_walking && hero.animation != "jump" && hero.body.GetLinearVelocity().y == 0){
				hero.change_animation("stand");
				hero.jump_tick = 0;
			}
			
			if(hero.animation=="jump"){
				if(hero.jump_tick == 1){
					hero.change_animation("jump");
				}
				hero.jump_tick++;
				if(hero.jump_tick >= 20){
					if(hero.jump_tick >= 25){
						hero.change_animation("finish");
						if(hero.jumps == 0){
							hero.animation = "finish";
						}
					}
				}
			}
		
			if(hero.hit_taken){
			    hero.take_damage();
			    //console.log("hold on");
			}
		
			if (hero.body.GetWorldCenter().x < WorldController.get_movement_edge() + hero.body.GetUserData().def.width/2){
				stop_hero(hero);
			}
		}
	};


	var begin_contact = function(contact, info){
		var hero = info.Me.entity;
		var other = info.Them.entity;
		if (other.type == "pizza") {
		    if (hero.hp <= 100+other.regen) {
		        hero.damage_taken = other.regen;
		        hero.hit_taken = true;
		    }
		    else if (hero.hp != 100) {
		        hero.damage_taken = hero.hp - 100;
		        hero.hit_taken = true;
		    }
		}
		if (info.Me.fixture_name == "bottom"){
			if(info.Them.fixture_name == "top" || other.kind == 1 || other.kind == 2){
				hero.jumps = 0;//if colliding with surface, reset jumps
			}
			if(other.kind == 3){
				if (hero.hp > 0){
					hero.hit_taken = true;
					hero.damage_taken = other.damage;
				}
			}
		}
		if(info.Me.fixture_name != "bottom" && other.can_attack){
			if(other.kind == null){
				var my_extents = hero.get_fixture(hero,"main").GetAABB().GetExtents();
				var my_coordinates = hero.body.GetWorldCenter();
				var other_extents = hero.get_fixture(other,"main").GetAABB().GetExtents();
				var other_coordinates = other.body.GetWorldCenter();
				//prevents taking damage while on top of enemies
				if (!(my_coordinates.y <= other_coordinates.y - (my_extents.y + other_extents.y - 0.5))) {
					if (hero.hp > 0) {
						hero.hit_taken = true;
						hero.damage_taken = other.damage;
					}
				}
			}else{//if they're spikes, take damage no matter what
				hero.hit_taken = true;
				hero.damage_taken = other.damage;
			}
		}
	};

	var end_contact = function(contact, info){
			
		//info.Me.entity.hit_taken = false;
	};

	var stop_hero = function (hero) {
		//var body = hero.body;
		//var velocity = body.GetLinearVelocity();
		//velocity.x = 0;
		//body.SetLinearVelocity(velocity); // body.SetLinearVelocity(new b2Vec2(5, 0)); would work too
		//body.SetAwake(true);

		var body = hero.body;
		var w = hero.body.GetUserData().def.width/2;
		var pos = new B2d.b2Vec2(WorldController.get_movement_edge() + w, body.GetWorldCenter().y)
		var vel = body.GetLinearVelocity();
		if(vel.x < 0 || body.GetWorldCenter().x > pos.x){
			var vel = new B2d.b2Vec2(0, vel.y);
			body.SetLinearVelocity(vel);
		}

	    body.SetAwake(true);
	}

	var slam = function(hero){
	    var body = hero.body;
	    body.ApplyImpulse(new B2d.b2Vec2(0, 20), body.GetWorldCenter());
	};
	var move_left = function(hero){
		var body = hero.body;
		var velocity = body.GetLinearVelocity();
		velocity.x = -5;
		body.SetLinearVelocity(velocity); // body.SetLinearVelocity(new b2Vec2(5, 0)); would work too
		body.SetAwake(true);
		//hero.x += 10; // old
		//hero.x = (body.GetPosition().x + 1.5/2) * 30 ; 
	};

	var jump = function(hero){
	    var body = hero.body;
	    var w = hero.body.GetUserData().def.width / 2;
	    var pos = new B2d.b2Vec2(WorldController.get_movement_edge() + w, body.GetWorldCenter().y)
	    var vel = body.GetLinearVelocity();
		//console.log(hero.jumps);
		if (hero.jumps == 0){
			hero.change_animation("jump");
			var vel = new B2d.b2Vec2(vel.x, -18);
			body.SetLinearVelocity(vel);
			hero.body.SetAwake(true);
		    hero.jumps += 1;
		}
		else if (hero.jumps == 1 && body.GetLinearVelocity().y > -1){
			hero.change_animation("jump");
			var min_check = vel.y - 18;
			if (min_check > -9){
				min_check = -9;
			}
			var vel = new B2d.b2Vec2(vel.x, min_check);
			body.SetLinearVelocity(vel);
			hero.body.SetAwake(true);
			hero.jumps += 1;
		}
	};

	
	var b2b_get_coordinates = function(hero){
		return hero.body.GetWorldCenter();
	};

	//var move_left = function(hero){
		//var velocity = hero.body.GetLinearVelocity();
		//move(hero, velocity.x - 5, velocity.y)

	//};

	//var move_right = function(hero){
		//var velocity = hero.body.GetLinearVelocity();
		//move(hero, velocity.x + 5, velocity.y)
	//};

	//var move = function(hero, x, y){
		//var velocity = new B2d.b2Vec2(x, y);
		//hero.body.SetLinearVelocity(velocity); // hero.SetLinearVelocity(new b2Vec2(5, 0)); would work too
		//hero.body.SetAwake(true);
	//};

	return {
		// declare public
		init: init, 
		spawn: spawn,
		tick_AI: tick_AI,
		begin_contact: begin_contact,
		end_contact: end_contact,
	};
})();

module.exports = HeroLogic;

var Includes = require("../Includes.js"); var include_data = Includes.get_include_data({
	current_module: "HeroLogic", 
	include_options: Includes.choices.LOGIC_SPECIFIC
}); eval(include_data.name_statements); var include = function(){eval(include_data.module_statements);}

},{"../Includes.js":19}],25:[function(require,module,exports){
/* 
	Enemy: Hyena 
	class and functions for the Hyena type enemy
	public functions:
		-init()
			initializes default class data for all instances of class Hyena
		-spawn(int x, int y)
			returns a new instance of class Hyena with unique instance ID at global coordinates(x,y)
		-tick_AI()
			runs hyena AI script, to be called for each instance on game tick
		-begin_contact()
			handles collisions, called on collision with any object
		-end_contact()
			callback function for box2d
*/

var HyenaLogic = (function(){
	//Instantiated for each instance of hyena at creation
	//call constructor through wrapper function spawn()
	var Hyena = function(){

		var entity = EntityController.create_abstract_entity();

		//Declare initial variables for the Hyena
	
		entity.hp = 2;
		entity.speed = 7;
		entity.jump_force = 125;
		entity.damage = 5;
		entity.point_value = 200;
		entity.sight_range = 16; //distance at which hyena detects heroes
		entity.attack_range = 8; //distance at which hyena leaps at the hero
		
		entity.hit_taken = false; //whether a hit has been taken since the last tick
		entity.damage_taken = 0; //the amount of damage inflicted by hits since the last tick
		
		entity.direction = false;	//false=left, true=right;
		entity.direction_previous = false;//store direction from end of previous tick
		entity.x_previous = 0;		//store x value from end of previous tick
		
		entity.is_idle = true; //determines whether hyena is aggressive or idle
		entity.idle_duration = 40; // time buffer between changing idle states
		entity.idle_timer = entity.idle_duration;
		entity.idle_counter = 0; //used to manage the number of times the hyena has changed state while idle
		entity.is_alive = true; //disables attacking and plays death animation while false
		entity.death_duration = 30;//time between death and deletion
		entity.decay_duration = 20;//time between decay animation and deletion
		entity.death_timer = -1;
		entity.running_away = false; //whether the hyena is running away
		entity.run_away_duration = 30; //set cowardice level
		entity.run_away_timer = -1;
		entity.can_attack = true;	//whether attacking is enabled
		entity.attack_cooldown = 10; //attack cooldown
		entity.attack_cooldown_timer = -1;
		entity.can_leap = true;		//leaping enabled
		entity.leap_cooldown = 40;//minimum time between leaps
		entity.leap_cooldown_timer = -1; 
		entity.charge_duration = 80;//maximum length of a charge
		entity.charge_timer = entity.charge_duration;
		entity.charge_cooldown = 20;//minimum time between charges
		entity.charge_cooldown_timer = -1;
		entity.blinking = false;	//whether hyena is blinking
		entity.blink_duration = 20;//how long the hyena blinks after taking damage
		entity.blink_timer = -1;
		entity.maintenance_frequency = 20;//ticks between routine maintenance checks
		entity.maintenance_timer = entity.maintenance_frequency;
		
		entity.barely_obstructed = false;
		entity.collision_buffer = 0.2	//the region of overlap accounted for during collision checking
		entity.path_blocked = false;	//is entity deprecated? set during collision
		entity.obstruction_tolerance = 4;//how many times the hyena can be blocked before he takes action
		entity.blocked_count = 0;			//tracks number of times blocked between maintenance checks
		
		entity.needs_graphics_update = false; //accessed by renderer for animation purposes
		entity.animation = "stand"; //accessed by renderer for animation purposes
		
		return entity;
	};

	//Initialize class variables, called once in EntityController.init() during game load
	var init = function(){
		include(); // satisfy requirements, GOES FIRST
		IdentificationController.assign_type(Hyena, "Hyena"); //assign class id
	};

	//Instantiates class Hyena
	//Wrapper for constructor, assigns unique ID
	var spawn = function(x, y){
		var new_hyena = new Hyena();
		new_hyena.type = "Hyena";
		var id = IdentificationController.assign_id(new_hyena);

		new_hyena.body = PhysicsController.get_rectangular({x: x, y: y, border_sensors: true}, new_hyena);	
		new_hyena.PhysicsController = PhysicsController;
		
		return new_hyena;
	};
	
//........................COMMENCE.........................\\
//.......................ARTIFICIAL........................\\
//.........................HYENA...........................\\
//......................INTELLIGENCE.......................\\
	
	// Is run each tick from the EntityController.update for every registered instance
	var tick_AI = function(Hyena){
		//Check if Dead........
		//If Hyena is close to the movement edge, leap away
		if (Hyena.body.GetWorldCenter().x <= WorldController.get_movement_edge() + 1.125){
			Hyena.jump(Hyena.jump_force, 0);
		}
		if (Hyena.hp <= 0){//if mortally wounded
			Hyena.die(); //die
		}else{ // Do Live Hyena Stuff
			//Maintenance....
			Hyena.direction_previous = Hyena.direction;				//remember what hyena's direction was at start of tick
			Hyena.x_previous = Hyena.body.GetWorldCenter().x; //remember what hyena's x was at start of tick
			Hyena.leap_cooldown_timer--;			//ensure the hyena is not eternally jumping
			//maintain blinking
			if(Hyena.blinking){
				Hyena.blink_timer--;
				if(Hyena.blink_timer == 0){
					Hyena.blinking = false;
				}
			}
			//maintain attack cooldown
			if(Hyena.attack_cooldown_timer > 0){ 
				Hyena.attack_cooldown_timer--;
				Hyena.can_attack = (Hyena.attack_cooldown_timer == 0);
			}
			//maintain the hyena's alternating phases of running and stopping
			if(Hyena.charge_timer <= 0){
				Hyena.charge_cooldown_timer--;
				if (Hyena.charge_cooldown_timer <= 0){
					Hyena.charge_timer = Hyena.charge_duration;
				}
			}
			//maintain the hyena's cowardly tactics
			if (Hyena.running_away){	//if hyena is deliberately running away
				Hyena.run_away_timer--;	//tickdown run_away timer
				if (Hyena.run_away_timer == 0){ //maybe stop running away
					Hyena.run_away_timer = -1;
					Hyena.direction = Hyena.direction_nearest_enemy();
					Hyena.running_away = false;
				}
			}
			//check periodically to ensure the hyena is not stuck in a corner and other routine maintenance
			Hyena.maintenance_timer--;
			if (Hyena.maintenance_timer == 0){
				if (Hyena.path_free()){
					Hyena.path_blocked = false;
				}
				if (Hyena.blocked_count > Hyena.obstruction_tolerance){	//you know he's stuck now
					if (Hyena.can_leap){
						Hyena.path_blocked = true;
						leap(Hyena);	//time to jump for it
						Hyena.path_blocked = false;
					}
				}
				Hyena.blocked_count = 0;
				Hyena.maintenance_timer = Hyena.maintenance_frequency; //reset check timer
			}
			//Run Main AI Script.....
			if(!Hyena.in_air() || Hyena.body.GetLinearVelocity().y == 0){ //if on ground OR if we suspect he's stuck on a corner
				if (Hyena.enemy_in_range(Hyena.sight_range)){ //if enemy nearby
					Hyena.idle = false;
					if (Hyena.hit_taken){	//if hyena was attacked,
						Hyena.running_away = true;	//back off
						Hyena.run_away_timer = Hyena.run_away_duration;
						Hyena.direction = !(Hyena.direction);
					}else if ((Hyena.enemy_in_range(Hyena.attack_range) || Hyena.path_blocked) && Hyena.can_leap && Hyena.leap_cooldown_timer <= 0){ //if enemy in range or path is blocked, and leaping is enabled, leap
						Hyena.direction = Hyena.direction_nearest_enemy();
						leap(Hyena);
						Hyena.can_leap = false;
						Hyena.leap_cooldown_timer = Hyena.leap_cooldown;
						Hyena.change_animation("leap");
					}else{
						if(!Hyena.running_away && !Hyena.in_air()){ //if hyena isn't cowering or in the air, face the enemy
							Hyena.direction = Hyena.direction_nearest_enemy();
						}
						if (Hyena.charge_timer > 0){ //if charge duration > 0
							run(Hyena);
							Hyena.change_animation("run"); //charge the enemy
							Hyena.charge_timer--;
							if(Hyena.charge_timer == 0){
								Hyena.charge_cooldown_timer = Hyena.charge_cooldown;
							}
							if(Hyena.x_previous == Hyena.body.GetWorldCenter().x){ //check if hyena has moved successfully
								Hyena.blocked_count++;
							}
						}else{//else stand aggressively
							Hyena.change_animation("stand");
						}
					}
				}else{
					Hyena.idle = true; //idle mode
					Hyena.idle_timer--;
					if (Hyena.idle_timer == 0){
						Hyena.idle_timer = Hyena.idle_duration;
						Hyena.idle_counter = (Hyena.idle_counter+1)%27;
						if (Hyena.idle_counter%4 == 0 && Hyena.idle_counter%5 != 0){
							Hyena.direction = !(Hyena.direction);//use weird modulos to get random looking idle behavior
						}
					}
					if (Hyena.idle_counter%2 == 0 || Hyena.idle_counter%3 == 0){ //use weird modulos to get random looking idle behavior
						walk(Hyena);
						Hyena.change_animation("walk");//pace
						if(Hyena.x_previous == Hyena.body.GetWorldCenter().x){ //check if hyena has wandered successfully
							Hyena.blocked_count++; //else check for being stuck
						}
					}else{
						Hyena.change_animation("stand");//loiter
					}
				}
			}else{//if in the air
				if(Hyena.movement_voluntary()){
					Hyena.change_animation("leap");//if voluntary, leap
				}else{
					Hyena.change_animation("fall");//else, fall
				}
			}
			if (Hyena.hit_taken){
				Hyena.take_damage(); //if hit, take damage
			}
		}
	};
//...........................END............................\\
//........................ARTIFICIAL........................\\
//.......................INTELLIGENCE.......................\\


//.....................HELPER FUNCTIONS......................
	
	
	//run
	var run = function(hyena){
		hyena.move(hyena.speed);
	};
	
	//walk
	var walk = function(hyena){
		hyena.move(hyena.speed/3);
	};
	
	//leap
	var leap = function(hyena){
		if (hyena.path_blocked){//jump out of a hole or over a wall
			hyena.jump(-10+(20*hyena.direction), -1*hyena.jump_force);
		}else{ //leap viciously at hero
			hyena.jump((2*hyena.jump_force*hyena.direction) - hyena.jump_force, -1*hyena.jump_force/2);
		}
		hyena.can_leap = false;
	};
	

//......................COLLISION HANDLERS...........................
	//called at the beginning of the collision
	var begin_contact = function(contact, info){
		var type = info.Me.type;
		var hyena = info.Me.entity;
		var hyena_x = hyena.body.GetWorldCenter().x;
		var hyena_y = hyena.body.GetWorldCenter().x;
		var hyena_w = 1.125; //half width of hyena
		var hyena_h = 0.875; //half the height of hyena
		var other_x = info.Them.entity.body.GetWorldCenter().x;
		var other_y = info.Them.entity.body.GetWorldCenter().y;
		var other_w = hyena.get_fixture(info.Them.entity,"main").GetAABB().GetExtents().x;
		var other_h = hyena.get_fixture(info.Them.entity,"main").GetAABB().GetExtents().y;
		
		/**
		(hyena_w + other_w + buffer) = minimum horizontal distance for non-vertically stacked entities
		abs(them.x - me.x) = absolute horizontal distance
		(abs_hdistance < min_hdistance) implies vertical stacking
		
		(hyena_h + other_h + buffer) = minimum vertical distance for non-adjacent entities
		(abs_vdistance < min_vdistance) implies adjacency
		
		(hyena.x - other.x) < 0 if (hyena.x < other.x)
		(hyena.x - other.x) = 0 if (hyena.x = other.x)
		(hyena.x - other.x) > 0 if (hyena.x > other.x)
		smaller x is to the left of bigger x
		smaller y is above bigger y
		0 = left;
		1 = right;
		((hyena.x - other.x) > 0) returns true if hyena is to the right of the enemy, else false
		((hyena.x - other.x) < 0) returns true if other is to the right of hyena, else false
		
		((hyena.y - other.y) > 0) returns true if hyena is below the enemy (hyena_y > other_y), else false
		((hyena.y - other.y) < 0) returns true if other is above hyena(hyena_y < other_y), else false
		*/
		
		//ultimate collision detector
		if (info.Me.fixture_name == "main"){
			//if adjacent
			if (Math.abs(hyena_y - other_y) < (hyena_h + other_h - hyena.collision_buffer)){ //if adjacent
				if ((hyena_h+other_h) - (other_y-hyena_y) < hyena.collision_buffer){//if the hyena is close enough to the top that he could almost walk over it...
					hyena.barely_obstructed = true;//call for a tiny bump
				}else{
					hyena.blocked_count++; //else call for a real jump
					hyena.path_blocked = true;
				}
				if (info.Them.type == "hero"){//if other = hero, deal damage
					if(hyena.can_attack){
						hyena.attack_cooldown_timer = hyena.attack_cooldown;//set cooldown timer
					}
				}
			}else{
				//if other is below
				if(true){}
					//reset jump
					//if hero, deal damage
				
				//if other is above:
					//if hero, take damage
			}
		}
		
		var vulnerability_radius = (1.125 + 0.45 - 0.3);// hyena_width/2 + hero_width/2 - buffer, in meters
		//if bottom colliding with the ground or top of another object, enable leap
		if (info.Me.fixture_name == "bottom" && (info.Them.fixture_name == "top" || info.Them.entity.kind == 1 || info.Them.entity.kind == 2)){
			hyena.can_leap = true;
		}
		
		//if colliding with a wall, detect blocked path
		if ((info.Me.fixture_name == "left" && !hyena.direction)||(info.Me.fixture_name == "right" && hyena.direction)){
			hyena.path_blocked = true;
			hyena.blocked_count++;
		}
		
		//if colliding with a player, check for damage
		if(info.Them.type == "hero"){
			if(info.Them.fixture_name != "bottom"){ //if can_attack and colliding with a fixture other than "bottom"
				if(hyena.can_attack){
					hyena.attack_cooldown_timer = hyena.attack_cooldown;//set cooldown timer
				}
			}else if(Math.abs(info.Them.entity.body.GetWorldCenter().x - hyena.body.GetWorldCenter().x) < vulnerability_radius && !hyena.blinking){
				hyena.hit_taken = true;//take damage if enemy collides from above and distance < vulnerability radius
				hyena.damage_taken = info.Them.entity.damage;
			}
		}
	};

	//called upon end of collision
	var end_contact = function(contact, info){
		
	};


//.................DECLARE PUBLIC FUNCTIONS.....................
	return {
		init: init, 
		spawn: spawn,
		tick_AI: tick_AI,
		begin_contact: begin_contact,
		end_contact: end_contact,
	};
})();

module.exports = HyenaLogic;

var Includes = require("../Includes.js"); var include_data = Includes.get_include_data({
	current_module: "HyenaLogic", 
	include_options: Includes.choices.LOGIC_SPECIFIC
}); eval(include_data.name_statements); var include = function(){eval(include_data.module_statements);}

},{"../Includes.js":19}],26:[function(require,module,exports){
var MedusaLogic = (function(){
   
	var Medusa = function(){
		/* Will be instantiated for every created entity to hold all the information 
			about the physical (not graphical) state of the entity in question. 
			declare the properties like entity:
			entity.some_state_variable_initial_value = 0;
			instantiate (most likely in the spawn function) like that:
			var new_entity_instance = new Medusa();
		*/
		var entity = EntityController.create_abstract_entity();
		
		entity.hero_hurt_me = false;
		entity.me_hurt_hero = false;
		entity.death_tick = 0;

		//set your game logic parameters here
		//entity.object_id = 1; //hardcode a unique identifier for each new enemy class
		entity.hp = 4;
		entity.speed = 4;
		entity.damage = 12;
		entity.point_value = 100;
		//entity.attack_cooldown = 4; //use entity for enemies who need
		entity.can_attack = true;//use entity for enemies who alternate between 
		//entity.cooldown_timer=-1;
		entity.AI_state = "walk";//use entity to keep track of the enemy's AI state
		entity.aliveflag = true;
		entity.unhurtflag = true;
		entity.needs_graphics_update = false;

		entity.maintenance_frequency = 20;//ticks between routine maintenance checks
		entity.maintenance_timer = entity.maintenance_frequency;

		entity.direction = false;
		entity.jolt_force = 100;

		entity.blinking = false;
		entity.blink_timer = -1;
		entity.blink_duration = 20;//how long the entity blinks after taking damage
		
		return entity;
	};

	var init = function(){
		/* Is ran from the EntityController.init once during game loading 
		 	you should assign type to your model here using the identification controller
		 */
		include(); // satisfy requirements, GOES FIRST
		IdentificationController.assign_type(Medusa, "Medusa");
	};

	var spawn = function(x, y){
		/* spawn instance of this entity at the given coordinates
			you will have to create new entity instance, assign it id
			using the IdentificationController.assign_id(entity_instance),
			assign it a body which you can get through PhysicsController
			do any other stuff you want to do during spawning,
			and finally you HAVE TO(!!!) return the instance you just created from this function
		*/

		var new_Medusa = new Medusa();
		new_Medusa.type = "Medusa";
		var id = IdentificationController.assign_id(new_Medusa);

		new_Medusa.body = PhysicsController.get_rectangular({x: x, y: y, border_sensors: true}, new_Medusa);	

		return new_Medusa;

	};

	var tick_AI = function(Medusa){
		/* Is ran each tick from the EntityController.update for every registered
			entity of this type. I given entity_instance
		*/

		//if dead, die
		if (Medusa.hp <= 0) {
			Medusa.die();
		}else{ // Medusa.hp >= 1
				Medusa.change_animation("walk");
			
				if (Medusa.blinking) {
				    Medusa.blink_timer--;
				    if (Medusa.blink_timer == 0) {
				        Medusa.blinking = false;
				    }
				}

			if (Medusa.animation == "walk"){
				Medusa.move(Medusa.speed);
			}
			if (Medusa.animation == "jolt"){
			    Medusa.jump((2 * Medusa.jolt_force * Medusa.direction) - Medusa.jolt_force, Medusa.jolt_force/2);
			}
			if (Medusa.hit_taken){
				Medusa.take_damage();
			}

			Medusa.maintenance_timer--;
			if (Medusa.maintenance_timer == 0) {
			    Medusa.jump(0, -2);
			    Medusa.maintenance_timer = Medusa.maintenance_frequency; //reset check timer
			}
		}
	};

	// // //Set up Collision handler
	
	
	var begin_contact = function(contact, info){
	    //handle collisions here

	    if ((info.Me.fixture_name == "right" || info.Me.fixture_name == "left") && info.Them.type != "pizza") {
	        info.Me.entity.direction = !info.Me.entity.direction;
	        console.log('hit');
	        if (info.Them.entity.point_value > 0) {
	            info.Me.entity.direction = Math.round(Math.random());
	            info.Them.entity.direction = Math.round(Math.random());
	        }
	    }
		
		if(info.Them.type == "hero"){
			if(info.Them.fixture_name != "bottom" && info.Me.entity.can_attack){
				info.Me.entity.me_hurt_hero = true;
			}else{
				info.Me.entity.hit_taken = true;//take damage if enemy collides from above and distance < vulnerability radius
				info.Me.entity.damage_taken = info.Them.entity.damage;
			}
		}
	};

	var end_contact = function(contact, info){
	
	};

	
	return {
		// declare public
		init: init, 
		spawn: spawn,
		tick_AI: tick_AI,
		begin_contact: begin_contact,
		end_contact: end_contact,
	};
})();

module.exports = MedusaLogic;

var Includes = require("../Includes.js"); var include_data = Includes.get_include_data({
	current_module: "MedusaLogic", 
	include_options: Includes.choices.LOGIC_SPECIFIC
}); eval(include_data.name_statements); var include = function(){eval(include_data.module_statements);}

},{"../Includes.js":19}],27:[function(require,module,exports){
var PizzaLogic = (function () {

    var Pizza = function () {
        /* Will be instPizzaiated for every created entity to hold all the information 
			about the physical (not graphical) state of the entity in question. 
			declare the properties like this:
			this.some_state_variable_initial_value = 0;
			instPizzaiate (most likely in the spawn function) like that:
			var new_entity_instance = new Pizza();
		*/
        var entity = EntityController.create_abstract_entity();

        entity.animation = "normal";
        entity.can_attack = false;
        entity.used = false;
        entity.point_value = 0;
        entity.is_alive = false;
        entity.regen = -25;

        return entity;
    };

    var init = function () {
        /* Is run from the EntityController.init once during game loading 
		 	you should assign type to your model here using the identification controller
		 */
        include(); // satisfy requirements, GOES FIRST
        IdentificationController.assign_type(Pizza, "pizza");
    };

    var spawn = function (x, y) {
        /* spawn instance of this entity at the given coordinates
			you will have to create new entity instance, assign it id
			using the IdentificationController.assign_id(entity_instance),
			assign it a body which you can get through PhysicsController
			do any other stuff you wPizza to do during spawning,
			and finally you HAVE TO(!!!) return the instance you just created from this function
		*/

        var new_Pizza = new Pizza();
        new_Pizza.type = "pizza";
        var id = IdentificationController.assign_id(new_Pizza);

        new_Pizza.body = PhysicsController.get_rectangular({ x: x, y: y, border_sensors: false }, new_Pizza);

        return new_Pizza;

    };

    var tick_AI = function (Pizza) {
        /* Is ran each tick from the EntityController.update for every registered
			entity of this type. I given entity_instance
		*/

        //if enemy is dead, die
        //if (Pizza.body.GetWorldCenter().y > 22 || Pizza.body.GetWorldCenter().x < Config.Player.movement_edge - 1) {
        //EntityController.delete_entity();
        //console.log("drop of death");
        //}
        //
        if (Pizza.used) {
            Pizza.die();
        }
    };

    // // //Set up Collision handler


    var begin_contact = function (contact, info) {
        //handle collisions here
        if (info.Them.entity.type == "hero" && info.Them.entity.hp < 100) {
            info.Me.entity.used = true;
        }

    };

    var end_contact = function (contact, info) {

    };


    return {
        // declare public
        init: init,
        spawn: spawn,
        tick_AI: tick_AI,
        begin_contact: begin_contact,
        end_contact: end_contact,
    };
})();

module.exports = PizzaLogic;

var Includes = require("../Includes.js"); var include_data = Includes.get_include_data({
    current_module: "PizzaLogic",
    include_options: Includes.choices.LOGIC_SPECIFIC
}); eval(include_data.name_statements); var include = function () { eval(include_data.module_statements); }

},{"../Includes.js":19}],28:[function(require,module,exports){
var AssetModel = new function(){
	// As always, almost anything is initialized in the InitController
	
	this.loader;
//mackerel
	this.manifest = [ // defining resources to be loaded in bulk with preload.js
			{src: "greek_warrior.png", id: "greek_warrior"},
			//{src:, id:},
			{src: "middle_terrain.png", id:"middle_terrain"},
			{src: "bottom_terrain.png", id: "bottom_terrain"},
			{src: "grass_summer.png", id: "grass_summer" },
			{src: "grass_winter.png", id: "grass_winter" },
			{src: "grass_fall.png", id: "grass_fall" },
			{src: "grass_spring.png", id: "grass_spring" },
			{src: "AntChompers.png", id: "Ant1"},
			{src: "AntChompers2.png", id: "Ant2"},
			{src: "AntChompersDeath.png", id: "Ant3"},
			{src: "Greek Landscape fall.png", id: "Fall"},
			{src: "Greek Landscape spring.png", id: "Spring"},
			{src: "Greek Landscape winter.png", id: "Winter"},
			{src: "Greek Landscape summer.png", id: "Summer"},
			{src: "griffinPhase1Small.png", id: "Griffin1" },
			{src: "griffinPhase2Small.png", id: "Griffin2" },
			{src: "griffinPhase3Small.png", id: "Griffin3" },
			{ src: "griffinDeathSmall.png", id: "GriffinDeath" },
            { src: "griffinDeathSmall2.png", id: "GriffinDeath2" },
            { src: "griffinDeathSmall3.png", id: "GriffinDeath3" },
			{ src: "MedusaSheet.png", id: "Medusa1" },
            { src: "CentaurSheet.png", id: "Centaur1" },
			{src: "platform_left.png", id: "left_platform" },
			{src: "platform_middle.png", id: "middle_platform" },
			{src: "platform_right.png", id: "right_platform" },
			{src: "HyenaPhase3.png", id: "HyenaSprite" },
			{src: "platform_spikes.png", id: "platform_spikes" },
			{src: "Hero.png", id: "Hero"},
			{src: "HeroHitRed.png", id: "HeroR"},
			{src: "HeroHitWhite.png", id: "HeroW"},
			{src: "HeroRed.png", id: "HeroRed"},
			{src: "HeroPink.png", id: "HeroPink"},
			{src: "HeroBlue.png", id: "HeroBlue"},
			{src: "HeroLPurple.png", id: "HeroLPurple"},
			{src: "HeroOrange.png", id: "HeroOrange"},
			{src: "HeroLB.png", id: "HeroLightBlue"},
			{src: "HeroLG.png", id: "HeroLightGreen"},
			{src: "HeroGreen.png", id: "HeroGreen"},
            {src: "pizza.png", id: "pizza"},
			{src: "HeadGreen.png", id: "HeadGreen"},
			{src: "HeadBlue.png", id: "HeadBlue"},
			{src: "HeadLightBlue.png", id: "HeadLightBlue"},
			{src: "HeadOrange.png", id: "HeadOrange"},
			{src: "HeadLightGreen.png", id: "HeadLightGreen"},
			{src: "HeadPurple.png", id: "HeadPurple"},
			{src: "HeadPink.png", id: "HeadPink"},
			{src: "HeadRed.png", id: "HeadRed"},

			
		]; 
		// TODO make adding resources easier? Automatic loading 
		// of everything from assets, automatic names etc.?

	this.shapes = {}; // maybe this aren't needed

	this.bitmaps = {};

	this.animations = {};

};

module.exports = AssetModel;

},{}],29:[function(require,module,exports){
var EntityModel = function(){	
	// associates type with the AI
	this.type_to_AI = {};

	this.for_logic_update = {}; // key: type, value: table of objects with id for key, object for value
	
	
	this.hero_spawned = false;

	// assiciates player network id with the hero entity instance
	this.heroes = {};

	// last velocity for my hero
	// used to check how much velocity changed since the last tick
	this.hero_last_velocity = {x: 0, y: 0};
};

module.exports = new EntityModel;


},{}],30:[function(require,module,exports){
var GameModel = new function(){ // main model
    this.pauseCounter = 0;
};

module.exports = GameModel;

},{}],31:[function(require,module,exports){
var GraphicsModel = function(){
	this.stage; // main stage to where everything will be drawn
	// note that every graphics object must be augmented with
	// the reference to the corresponding physics object, if any
	this.other_players = []; // array of players other then hero for multiplayer

	// all object registered for continious update to match their physical body
	// position 
	this.all_physical = {}; 
	this.special_render = {}; // matches type with array of all objects of that type to be rendered

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
		offset_from_followed: { x: 400, y: -100 },
		//offset_from_followed: {x: 330, y: -205}, //FOR GAME PAGE
		// this is center of the screen in pixels. gets dynamically recalculated 
		// during the camera update so if it's ever changed, camera still works as expected
		center: {x: 0, y: 0}

	};

};

module.exports = new GraphicsModel;


},{}],32:[function(require,module,exports){

var IdentificationModel = function(){
	
	// next unique id to be given if not free id's remain
	this.next_id = 0;

	// array of free id's. push when freed, pop when free id is needed
	// if array is empty, get next id using >next_id<
	this.free_ids = [];

	// array matches ids to their corresponding objects
	this.id_matching = [];

	// registry of types to make sure that no type is registerd twice
	// and enable people to get the model by type name
	this.types = {}

	//list of heroes and companions spawned
	this.hero;
	this.companions = [];

	this.reserved = [];
};

module.exports = new IdentificationModel;



},{}],33:[function(require,module,exports){
var KeyboardModel = function(){

	// own keys that are currently active
	this.keys = {
	};

	this.state_changed = false;

	// table of all keys that have
	// changed since the last tick
	// key is keycode, value is boolean
	// indicating whether key was pressed or released
	// TODO: implement;
	// idea is that only commands for relevant tables will be sent
	// overseas
	this.changed_keys = {};

	// own keys that were active previous tick
	//this.old_keys = {
	//};

	// table of network player ids associated
	// with the last registered state of their keyborads
	this.all_keyboard_states = {
	}

	this.translation_tables = {
		code_to_name: {
			8:   "backspace", //  backspace
			9:   "tab", //  tab
			13:  "enter", //  enter
			16:  "shift", //  shift
			17:  "ctrl", //  ctrl
			18:  "alt", //  alt
			19:  "pause/break", //  pause/break
			20:  "caps lock", //  caps lock
			27:  "escape", //  escape
			33:  "page up", // page up, to avoid displaying alternate character and confusing people
			34:  "page down", // page down
			35:  "end", // end
			36:  "home", // home
			37:  "left arrow", // left arrow
			38:  "up arrow", // up arrow
			39:  "right arrow", // right arrow
			40:  "down arrow", // down arrow
			45:  "insert", // insert
			46:  "delete", // delete
			48:  "0",
			49:  "1",
			50:  "2",
			51:  "3",
			52:  "4",
			53:  "5",
			54:  "6",
			55:  "7",
			56:  "8",
			57:  "9",
			65:  "a",
			66:  "b",
			67:  "c",
			68:  "d",
			69:  "e",
			70:  "f",
			71:  "g",
			72:  "h",
			73:  "i",
			74:  "j",
			75:  "k",
			76:  "l",
			77:  "m",
			78:  "n",
			79:  "o",
			80:  "p",
			81:  "q",
			82:  "r",
			83:  "s",
			84:  "t",
			85:  "u",
			86:  "v",
			87:  "w",
			88:  "x",
			89:  "y",
			90:  "z",
			91:  "left window", // left window
			92:  "right window", // right window
			93:  "select key", // select key
			96:  "numpad 0", // numpad 0
			97:  "numpad 1", // numpad 1
			98:  "numpad 2", // numpad 2
			99:  "numpad 3", // numpad 3
			100: "numpad 4", // numpad 4
			101: "numpad 5", // numpad 5
			102: "numpad 6", // numpad 6
			103: "numpad 7", // numpad 7
			104: "numpad 8", // numpad 8
			105: "numpad 9", // numpad 9
			106: "multiply", // multiply
			107: "add", // add
			109: "subtract", // subtract
			110: "decimal point", // decimal point
			111: "divide", // divide
			112: "F1", // F1
			113: "F2", // F2
			114: "F3", // F3
			115: "F4", // F4
			116: "F5", // F5
			117: "F6", // F6
			118: "F7", // F7
			119: "F8", // F8
			120: "F9", // F9
			121: "F10", // F10
			122: "F11", // F11
			123: "F12", // F12
			144: "num lock", // num lock
			145: "scroll lock", // scroll lock
			186: ";", // semi-colon
			187: "=", // equal-sign
			188: ",", // comma
			189: "-", // dash
			190: ".", // period
			191: "/", // forward slash
			192: "`", // grave accent
			219: "[", // open bracket
			220: "\\", // back slash
			221: "]", // close bracket
			222: "'", // single quote
		},

		movement: {
			"left arrow": "left",
			"up arrow": "up",
			"down arrow": "down",
			"right arrow": "right",
		},

		pause: {
		    "p": "pause",
		},
		
		debug: {
			"a": "spawn_ant",
			"c": "connect",
			"g": "spawn_griffin",
			"h": "spawn_hyena",
			"i": "show_ids",
			"l": "show_connected",
			"m": "spawn_medusa",
			"s": "new_slice",
			"v": "request_hero",
			"z": "season",
            "k": "spawn_pizza",
            "t": "spawn_centaur",
		},

	}


};

module.exports = new KeyboardModel;


},{}],34:[function(require,module,exports){
var MultiplayerSyncModel = function(){
	this.hero = null;

	this.op_packets_table = {};
	
};

module.exports = new MultiplayerSyncModel;



},{}],35:[function(require,module,exports){
var NetworkModel = function(){
	this.connected = false; // flag to indicate if already connected to the network

	// flag to indicate whether to disallow connections, useful to prevent
	// more attempts to connect when connection is already being established
	this.block_connections; 

	this.my_peer = null;
	this.my_id = null;

	this.master_id = null; // id of the master with whome everyone synces

	// this is for standart (non-test) mode
	// I plan to make test mode use this too, eventually
	this.peers_to_connect = null;
	

	// player_id associated with the connection object
	this.connections = {};

	// array of all peers who are currently connected to you
	// id for your own peer is excluded, of course
	this.connected_peers = [];

	this.send_array = null;
	this.recieve_array = null;

	this.one_packet = null; // used to store one packet, for one packet communication

	this.input_cell = null;
	this.output_cell = null;
	this.counter = 0; // temp

	// linked list to store the backlog of packets for the communication that needs that
	this.package_backlog = {HEAD: null, TAIL: null} 

	this.waiting_for_initial_sync = []; // list of players waiting to sync with master

	// TIME 
		this.begin_time = null; // seconds
		this.timeout_id = null;
	// END TIME
	
	// TESTING MODE STUFF. SHOULD BE MERGED WITH GENERAL STUFF IF POSSIBLE
	
	this.non_free_ids = [
	];

	this.free_ids = [
	];

	// END TESTING MODE STUFF

};

module.exports = new NetworkModel;



},{}],36:[function(require,module,exports){

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

	this.awaiting_contact = {
		PreSolve: {},
		PostSolve: {},
		BeginContact: {},
		EndContact: {},
	};

}; 

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
	vx: 0,
	vy: 0,

	width: 5,
	height: 5,
	density: 2,
	friction: 1,
	restitution: 0.2,
	isSensor: false,


	active: true,
	allowSleep: true,
	angle: 0,
	angularVelocity: 0,
	awake: true,
	bullet: false,
	fixedRotation: false,
	type: "dynamic",

};

r_templates.living = {
	fixedRotation: true,
	awake: true,
	isSensor: false,
	//mobexp++
};

r_templates.terrain_cell = {
	type: "static",
	width: 1,
	height: 1,
	friction: 2,
	//mobexp++
};

r_templates.hero = {
	parent: r_templates.living,
	width: 0.9,
	height: 1.7,
	density: 4.5,
	type: "dynamic",
	//mobexp++
};

r_templates.companion = {
	parent: r_templates.living,
	width: 1.5,
	height: 2.5,
	type: "dynamic",
	//mobexp++
};

r_templates.ant = {
	parent: r_templates.living,
	width: 1,
	height: 0.5,
	type: "dynamic",
	x: 40,
	y: 10,
	//mobexp++
};

r_templates.Griffin = {
	parent: r_templates.living,
	width: 2.8,
	height: 2.5,
	type: "dynamic",
	x: 95,
	y: 50,
	//mobexp++
};

r_templates.Hyena = {
	parent: r_templates.living,
	width: 2.25,
	height: 1.75,
	type: "dynamic",
	x: 65,
	y: 10,
	//mobexp++
};

r_templates.Medusa = {
    parent: r_templates.living,
    width: 1.4,
    height: 2.8,
    type: "dynamic",
    x: 65,
    y: 10,
};

r_templates.Centaur = {
    parent: r_templates.living,
    width: 2.2,
    height: 3.4,
    type: "dynamic",
    x: 65,
    y: 10,
};

r_templates.test = {
	width: 1,
	height: 2,
	fixedRotation: false,
	//mobexp++
}

r_templates.platform = {
    x: 10,
    y: 11,
    width: 10,
    height: .5,
    type: "static",
}

r_templates.pizza = {
    isSensor: true,
    type: "static",
    height: .5,
    width: .5,
    x: 10,
    y: 11,
}

module.exports = new PhysicsModel;

},{}],37:[function(require,module,exports){
var RegisterAsModel = function(){
	
	// register stuff for one time lookup
	// the one requesting stuff is supposed to pop the each examined element
	// there is no timeouts or automatic cleanup
	this.simple_one_time_lookup = {};
};

module.exports = new RegisterAsModel;


},{}],38:[function(require,module,exports){
var TerrainModel = function(){
	//This is physics, for graphics look into the GraphicsController/Model
	this.terrain_slices_queue = [];
	//this.new_slices = [];
	this.seed;

	// how many initial (non-random) terrain slices
	// were generated already?
	this.initial_generated = 0;


	// used to determine x offset of the next slice
	// TODO: update this when truly infinite terrain will be implemented
	this.slice_counter = 0;

};

module.exports = new TerrainModel;

},{}],39:[function(require,module,exports){
TerrainSliceConfig = require ("../Config.js").TerrainSlice;

var TerrainSliceModel = function(){

	this.Slice = function(){
		/**
		* slice "model" to be instantiated
		*/
		
		
		this.num = TerrainSliceConfig.next_slice_id++; // automaticall assign id and increment 

		this.grid_columns = TerrainSliceConfig.grid_columns;
		this.grid_rows = TerrainSliceConfig.grid_rows;
		this.cell_w = TerrainSliceConfig.cell_w;
		this.cell_h = this.cell_w;;
		
		// grid[i][j] is the element in the i's column and j's row
		// the grid is maid to match the screen coordinates and the current box2d coordinates
		// i.e. grid[0][0] is the one in the top left corner of the terrain slice
		// do we want to change it? would it be easier to generate terrain if we start at the bottom?
		// if yes, then what makes more sense, changing coordinate systems or just switching generation
		// loops around? discuss
		//
		// notice that the grid is a terrain generation device only. once terrain slice is loaded,
		// box2d physics simulation may (and will) go nuts on it, changing whatever it wants,
		// and changes won't anyhow be reflected in the grid. to keep track of all the bodies
		// in the terrain slice, if that will be needed, other mechanisms should be used.
		// idea: have a collections of bodies by type, and setup sensor collision beams
		// at the terrain slices' boundaries to keep track of bodies flying over from one
		// terrain slice to another. Btw, Ali, I hate you for making me to type "terrain slice"
		// instead of the "chunk" 
		this.grid = [];
		
		this.origin = {x: null, y: null};

	};

	this.Cell = function(kind){
		this.kind = kind;
		this.body;
	}

	
};

TerrainSliceModel.prototype.lvl_prob = [
	[7, 2, 1],
	[0, 7, 3],
	[0, 1, 9]
]

module.exports = new TerrainSliceModel;

},{"../Config.js":2}],40:[function(require,module,exports){
var TestModel = function(){

};

module.exports = new TestModel;


},{}],41:[function(require,module,exports){
var WorldModel = function(){
	
};

module.exports = new WorldModel;


},{}],42:[function(require,module,exports){
var AntRenderer = (function(){

	var spritesheets = {};
	var ant_animation;

	var init = function(){
		/* is ran from GraphicsController.init once during game loading
		 	use this function to create spritesheets and such
			like spritesheets.first = new createjs.Spritesheet(...);
		*/

		include(); // satisfy requirements, GOES FIRST
		var get_asset = AssetController.get_asset;

		spritesheets["ant"] = new createjs.SpriteSheet({
			"framerate": 1,
			"images": [get_asset("Ant1"), get_asset("Ant2"), get_asset("Ant3")],
			"frames": { "regX": 3, "regY": 6, "height": 25, "width": 50, "count": 6},
			"animations": {
				"walk": [0, 1, "walk", 0.25],
				"upside_down": [2, 3, "upside_down"],
				"death": [4, 5, "death"],
			}
		})

	};

	var register = function(entity_ant){
		/* is ran for every entity of this type that was just created and should
		get graphics representation. You are given the entity instance and is supposed
		to crete graphics instance, and GraphicsController.reg_for_render(graphics_instance, entity_instance); it 
		*/

		ant_animation = GraphicsController.request_animated(spritesheets["ant"], "walk");
		GraphicsController.set_reg_position(ant_animation, 0, 0); // change that to adjust sprite position relative to the body
		GraphicsController.reg_for_render(ant_animation, entity_ant); // sets ant_animation's position to track the ant's position (updates each tick)

		
	};

	var render = function(ant){
		/* 	is ran each tick from GraphicsController, for every registered object of this type
			is given >graphics_instance< parameter, which is also supposed to contain
			physical_instance property containing entity_instance, if it was attched correctly
		*/

		ant_animate(ant); 
	};
	var ant_animate = function(ant){
		//set graphical representation based on the animation variable determined by the AI
		//set animation
		if(ant.physical_instance.needs_graphics_update){
			var animation = ant.physical_instance.animation;
			ant.gotoAndPlay(animation)
		}
		
		//set direction
		if (ant.physical_instance.direction){ //if direction == right, flip right
			ant.scaleX = -1;
		}else{ //else flip left
			ant.scaleX = 1;
		}

		//set alpha if blinking
		if(ant.physical_instance.blinking && ant.physical_instance.blink_timer%2 == 1){
			ant.alpha = 0;
		}else{
			ant.alpha = 1;
		}
	};
	/*
	var ant_special_render_temp = function(ant){
		

		
		if(ant.physical_instance.AI_state == "death"&& ant.physical_instance.aliveflag){
			ant.gotoAndPlay("death");
			ant.physical_instance.aliveflag = false;
			
			
		}

		if(ant.physical_instance.AI_state == "upside_down" && ant.physical_instance.unhurtflag)
		{
			ant.gotoAndPlay("upside_down");
			ant.physical_instance.unhurtflag = false;
			
			
		}
		if(ant.physical_instance.AI_state == "walk" && ant.physical_instance.start_walking)
		{
			ant.gotoAndPlay("walk");
			//ant.physical_instance.hp += 1;
			ant.physical_instance.start_walking = false;
			
			
		}

	};
	*/

	return {
		// declare public
		init: init, 
		register: register,
		render: render,
	};
})();

module.exports = AntRenderer;

var Includes = require("../Includes.js"); var include_data = Includes.get_include_data({
	current_module: "AntRenderer", 
	include_options: Includes.choices.RENDERER_SPECIFIC
}); eval(include_data.name_statements); var include = function(){eval(include_data.module_statements);}

},{"../Includes.js":19}],43:[function(require,module,exports){
var BackgroundRenderer = (function(){

	var season_array;
	var season_image;
	var season_threshold;
	
	var season_progress;
	var season_progress_to_level;
	var hero_current_level;
		
	var init = function(){
		include(); //sets up dependencies MUST GO FIRST
		
		season_array = [];//stores season sprites
		season_image = ["Winter", "Spring", "Summer", "Fall"];
		season_threshold = 2; //So seasons only update once
		
		season_progress = 0;
		season_progress_to_level = 199;//season_image[cycle].width*2 + Config.SCREEN_W/2;
		hero_current_level = season_progress_to_level;
		
		generate_season("Winter", GraphicsController.get_stage().canvas.width, 0);
	};
	
	var render = function(){

		if(Math.round(WorldController.get_progress()) > hero_current_level){
			season_progress++;
			hero_current_level += season_progress_to_level;
			WorldController.increase_score(season_progress*500);
		}
		
		//Potentially change seasons based on hero progress
		change_seasons(season_progress);
		
		//perform parallax effect with background
		background_loop(WorldController.get_progress(),season_progress);
	};
	
	//Generates tiled background for season
	var generate_season = function(season_image, canvas_width, start){
		for(i=0; i<3; i++){//create tiles 3 at a time
			var season = GraphicsController.request_bitmap(season_image);
			season.regY -= season.image.height/2;
			//create a new tile with offset
			season.x = start + i*season.image.width;
			GraphicsController.get_stage().addChildAt(season, 0);
			season_array.push(season);
		}
	};
	
	//checks for and handles potential season change
	var change_seasons = function(progress){
		var flag = false;
		if(progress == season_threshold){ //seasons will change every even progress number
			season_threshold += 2;
			flag = true;
		}
		if(flag){
			console.log("generating season");
			delete_all_season();
			WorldController.set_season((WorldController.get_season()+1)%4);
			generate_season(season_image[WorldController.get_season()], GraphicsController.get_stage().canvas.width, WorldController.get_movement_edge() / 30);
		}
	};
	
	//scrolls the background along with the player
	var background_loop = function(hero_x, progress){
		for(i=0; i<season_array.length; i++){
			//season_array[i].x = (i * 799) + GraphicsModel.camera.offset.x;
			//season_array[i].y = GraphicsModel.camera.offset.y;
			season_array[i].x = ((i + progress) * 799) - (hero_x * 4);
			season_array[i].y = GraphicsController.get_camera().offset.y;
		}
	};

	//deletes all background objects
	var delete_all_season = function(){
		for(var i = 0; i < season_array.length; i++){
			GraphicsController.get_stage().removeChild(season_array[i]);
		}
		season_array = [];
	};
	
	var register = function(background){
		/* is ran for every entity of this type that was just created and should
		get graphics representation. You are given the entity instance and is supposed
		to crete graphics instance, and GraphicsController.reg_for_render(graphics_instance, entity_instance); it 
		*/

		
	};

	return {
		// declare public
		init: init, 
		register: register,
		render: render,
	};
})();

module.exports = BackgroundRenderer;

var Includes = require("../Includes.js"); var include_data = Includes.get_include_data({
	current_module: "BackgroundRenderer", 
	include_options: Includes.choices.RENDERER_SPECIFIC
}); eval(include_data.name_statements); var include = function(){eval(include_data.module_statements);}



},{"../Includes.js":19}],44:[function(require,module,exports){
var CentaurRenderer = (function(){

	var spritesheets = {};
	var Centaur_animation;

	var init = function(){
		/* is ran from GraphicsController.init once during game loading
		 	use this function to create spritesheets and such
			like spritesheets.first = new createjs.Spritesheet(...);
		*/

		include(); // satisfy requirements, GOES FIRST
		var get_asset = AssetController.get_asset;

		spritesheets["Centaur"] = new createjs.SpriteSheet({
			"framerate": 1,
			"images": [get_asset("Centaur1"),], //CentaurSpriteSheet
			"frames": { "regX": 0, "regY": 0, "height": 105, "width": 70.7, "count": 4},
				"animations": {
				"walk": [0, 3, "walk", 0.1],
				"injury": {
				    frames: [3, 4, .25]
				},
				"death": [3, 4, "death", 0.6],
                
			}
		})

	};

	var register = function(entity_Centaur){
		/* is ran for every entity of this type that was just created and should
		get graphics representation. You are given the entity instance and is supposed
		to crete graphics instance, and GraphicsController.reg_for_render(graphics_instance, entity_instance); it 
		*/

		Centaur_animation = GraphicsController.request_animated(spritesheets["Centaur"], "walk");
		GraphicsController.set_reg_position(Centaur_animation, 0, 0); // change that to adjust sprite position relative to the body
		GraphicsController.reg_for_render(Centaur_animation, entity_Centaur); // sets Centaur_animation's position to track the Centaur's position (updates each tick)

		
	};

	var render = function(Centaur){
		/* 	is ran each tick from GraphicsController, for every registered object of this type
			is given >graphics_instance< parameter, which is also supposed to contain
			physical_instance property containing entity_instance, if it was attched correctly
		*/

		Centaur_special_render_temp(Centaur); 
	};

	var Centaur_special_render_temp = function(Centaur){
		/* how to handle special render? TEMPORARY */

		//set graphical representation based on the animation variable determined by the AI
		//set animation
		if(Centaur.physical_instance.needs_graphics_update){
			var animation = Centaur.physical_instance.animation;
			Centaur.gotoAndPlay(animation)
		}
		
		//set direction
		if (Centaur.physical_instance.direction){ //if direction == right, flip right
			Centaur.scaleX = -1;
		}else{ //else flip left
			Centaur.scaleX = 1;
		}

		//set alpha if blinking
		if(Centaur.physical_instance.blinking && Centaur.physical_instance.blink_timer%2 == 1){
			Centaur.alpha = 0;
		}else{
			Centaur.alpha = 1;
		}
	};

	return {
		// declare public
		init: init, 
		register: register,
		render: render,
	};
})();

module.exports = CentaurRenderer;

var Includes = require("../Includes.js"); var include_data = Includes.get_include_data({
	current_module: "CentaurRenderer", 
	include_options: Includes.choices.RENDERER_SPECIFIC
}); eval(include_data.name_statements); var include = function(){eval(include_data.module_statements);}
},{"../Includes.js":19}],45:[function(require,module,exports){
var EsteemedCompanionRenderer = (function(){

	var spritesheets = {}; // to store spritesheets used by this entity

	var init = function(){
		/* is ran from GraphicsController.init once during game loading
			use this function to create spritesheets and such
			like spritesheets.first = new createjs.Spritesheet(...);
		*/
		include(); // satisfy requirements, GOES FIRST
	};

	var register = function(entity_companion){
		/* is ran for every entity of this type that was just created and should
		get graphics representation. You are given the entity instance and is supposed
		to crete graphics instance, and GraphicsController.reg_for_render(graphics_instance, entity_instance); it 
		*/

		var companion = GraphicsController.request_bitmap("greek_warrior");

		GraphicsController.set_reg_position(companion, -20, +10);
		GraphicsController.reg_for_render(companion, entity_companion);

	};

	var render = function(companion){
		/* 	is ran each tick from GraphicsController, for every registered object of this type
			is given >graphics_instance< parameter, which is also supposed to contain
			physical_instance property containing entity_instance, if it was attched correctly
		*/
		GraphicsController.update_health(companion.physical_instance.hp);
	};

	return {
		// declare public
		init: init, 
		register: register,
		render: render,
	};
})();

module.exports = EsteemedCompanionRenderer;

var Includes = require("../Includes.js"); var include_data = Includes.get_include_data({
	current_module: "EsteemedCompanion", 
	include_options: Includes.choices.RENDERER_SPECIFIC
}); eval(include_data.name_statements); var include = function(){eval(include_data.module_statements);}

},{"../Includes.js":19}],46:[function(require,module,exports){
var GriffinRenderer = (function(){

	var spritesheets = {};
	var Griffin_animation;

	var init = function(){
		/* is ran from GraphicsController.init once during game loading
		 	use this function to create spritesheets and such
			like spritesheets.first = new createjs.Spritesheet(...);
		*/

		include(); // satisfy requirements, GOES FIRST
		var get_asset = AssetController.get_asset;

		spritesheets["Griffin"] = new createjs.SpriteSheet({
			"framerate": 1,
			"images": [get_asset("Griffin1"), get_asset("Griffin2"), get_asset("Griffin3"), get_asset("GriffinDeath")], //, get_asset("GriffinDeath2"), get_asset("GriffinDeath3")
				"frames": { "regX": 5, "regY": 14, "height": 207, "width": 210, "count": 6},
				"animations": {
				"walk": [0, 2, "walk", 0.1],
				"injury": {
				    frames: [2, 4, .25]
				},
				"death": [3, 4, "death", 0.6],
                "fly": [1, 2, "fly", .4],
			}
		})

	};

	var register = function(entity_Griffin){
		/* is ran for every entity of this type that was just created and should
		get graphics representation. You are given the entity instance and is supposed
		to crete graphics instance, and GraphicsController.reg_for_render(graphics_instance, entity_instance); it 
		*/

		Griffin_animation = GraphicsController.request_animated(spritesheets["Griffin"], "walk");
		GraphicsController.set_reg_position(Griffin_animation, 0, 0); // change that to adjust sprite position relative to the body
		GraphicsController.reg_for_render(Griffin_animation, entity_Griffin); // sets griffin_animation's position to track the griffin's position (updates each tick)

		
	};

	var render = function(Griffin){
		/* 	is ran each tick from GraphicsController, for every registered object of this type
			is given >graphics_instance< parameter, which is also supposed to contain
			physical_instance property containing entity_instance, if it was attched correctly
		*/

		Griffin_special_render_temp(Griffin); 
	};

	var Griffin_special_render_temp = function(Griffin){
		/* how to handle special render? TEMPORARY */

		//set graphical representation based on the animation variable determined by the AI
		//set animation
		if(Griffin.physical_instance.needs_graphics_update){
			var animation = Griffin.physical_instance.animation;
			Griffin.gotoAndPlay(animation)
		}
		
		//set direction
		if (Griffin.physical_instance.direction){ //if direction == right, flip right
			Griffin.scaleX = -1;
		}else{ //else flip left
			Griffin.scaleX = 1;
		}

		//set alpha if blinking
		if(Griffin.physical_instance.blinking && Griffin.physical_instance.blink_timer%2 == 1){
			Griffin.alpha = 0;
		}else{
			Griffin.alpha = 1;
		}
	};

	return {
		// declare public
		init: init, 
		register: register,
		render: render,
	};
})();

module.exports = GriffinRenderer;

var Includes = require("../Includes.js"); var include_data = Includes.get_include_data({
	current_module: "GriffinRenderer", 
	include_options: Includes.choices.RENDERER_SPECIFIC
}); eval(include_data.name_statements); var include = function(){eval(include_data.module_statements);}

},{"../Includes.js":19}],47:[function(require,module,exports){
var HUDRenderer = (function(){
	
	var score;
	var health_bar;
	var score_title;
	var health_outline;
	var healthX;
	var player_head;
	var connected_players;
	var connected_main;
	var connected_head;
	var connected_outline;
	var connected_bar;
	var next_x = 0;
	var Y = 10;
	var screen_W;
	var container;
	var con_con;
	var init = function(){
		include();
		healthX = 100;
		container = new createjs.Container();
		con_con = new createjs.Container();
		get_asset = AssetController.get_asset; // for quicker access
		score = new createjs.Text();
		container.addChild(score);
		//GraphicsController.reg_for_render(score);
		health_bar = new createjs.Shape();
		container.addChild(health_bar);
		//GraphicsController.reg_for_render(health_bar);
		score_title = new createjs.Text();
		container.addChild(score_title);
		//GraphicsController.reg_for_render(score_title);
		health_outline = new createjs.Shape();
		container.addChild(health_outline);
		//GraphicsController.reg_for_render(health_outline);
		player_head = new createjs.Bitmap(get_asset("HeadRed"));
		container.addChild(player_head);
		//GraphicsController.reg_for_render(player_head);
		connected_main= new createjs.Shape();
		con_con.addChild(connected_main);
		//GraphicsController.reg_for_render(connected_main);
		connected_outline_bar = new createjs.Shape();
		con_con.addChild(connected_outline_bar);
		//GraphicsController.reg_for_render(connected_outline_bar);
		connected_bar = new createjs.Shape();
		con_con.addChild(connected_bar);
		//GraphicsController.reg_for_render(connected_bar);
		connected_head = new createjs.Bitmap();
		//container.addChild(score);
		//GraphicsController.reg_for_render(connected_head);
		//container.addChild(con_con);
		GraphicsController.reg_for_render(container);
		health_outline.x = 30;
		health_outline.y = 25;
		health_outline.graphics.beginStroke("red").setStrokeStyle(1).drawRect(30,25,100,20);
		health_bar.x = 30;
		health_bar.y = 25;
		health_bar.graphics.beginFill("red");
		health_bar.graphics.drawRect(30,25,healthX, 20);
		
		player_head.x = 10;
		player_head.y = 35;
		score_title.text = "Score: ";
		score_title.x = 10;
		score_title.y = 10;
		score.text = "0";
		score.x = 80;
		score.y = 10;
		score.font = "20px Arial";
		score_title.font = "20px Arial";
	};
	
	var render = function(){
		var camera = GraphicsController.get_camera();
		var hero = EntityController.get_my_hero();
		var asset;
		//var player_id = Config.Init.player_id;
		var player_id = NetworkController.get_network_id();
		var connected_players = NetworkController.get_all_connected();
		var connected_len = connected_players.length;
		var player_id_array = Config.Init.player_id_array;
		var asset_ids = ["HeadOrange", "HeadPink", "HeadLPurple", "HeadGreen", "HeadLightBlue", "HeadLightGreen", "HeadBlue", "HeadRed"];
		var connected_player_id;
		var heros = EntityController.get_all_heroes();
		var index;
		screen_w = Config.SCREEN_W;
		console.log("screen width", Config.SCREEN_W);
		//player_id_array.toString();
		console.log("player_id_array: ", player_id_array);
		for(var i =0; i < connected_len; i++){
			connected_player_id = connected_players[i];
			index = player_id_array.indexOf(connected_player_id);
			container.removeChildAt(index);
		}
		
		
		for(var i =0; i < connected_len; i++){
			connected_player_id = connected_players[i];
			console.log("connected player: ", connected_player_id);
			if(player_id_array != null && player_id_array.length > 0){
				// if player id was populated properly, choose asset id corresponding to the index
				var connected_asset = get_asset(asset_ids[player_id_array.indexOf(connected_player_id)]);
			}else{
			var connected_asset = get_asset("HeadRed");
			}
			connected_head.image = connected_asset;
			
			index = player_id_array.indexOf(connected_player_id);
			//create box and postions of box next
			connected_main.graphics.beginStroke("white").setStrokeStyle(1).drawRect(0,0,40,55);
			connected_outline_bar.graphics.beginStroke("red").setStrokeStyle(1).drawRect(0,42,40,10);
			connected_head.x=1;  
			connected_head.y = 1;
			con_con.x = screen_w - 10 - next_x;
			con_con.y = Y;
			container.addChildAt(con_con,index);
			next_x +=50;
		}
		next_x =0;
		connected_players.toString();
		console.log("players connected: " , connected_players);
		//console.log("hud render player_id", player_id);
		//switch(player_id){
			//case "player1":
				//asset = get_asset("HeadOrange");
				//break;
			//case "player2":
				//asset = get_asset("HeadPink");
				//break;
			//case "player3":
				//asset = get_asset("HeadPurple");
				//break;
			//case "player4":
				//asset = get_asset("HeadGreen");
				//break;
			//case "player5":
				//asset = get_asset("HeadLightBlue");
				//break;
			//case "player6":
				//asset = get_asset("HeadLightGreen");
				//break;
			//case "player7":
				//asset = get_asset("HeadBlue");
				//break;
			//case "player8":
				//asset = get_asset("HeadRed");
				//break;
			//default:
				//asset = get_asset("HeadRed");
				
		//}



		// this stuff should be moved to initialization stage

		var asset_ids = ["HeadOrange", "HeadPink", "HeadLPurple", "HeadGreen", "HeadLightBlue", "HeadLightGreen", "HeadBlue", "HeadRed"];
		if(player_id_array != null && player_id_array.length > 0){
			// if player id was populated properly, choose asset id corresponding to the index
			var asset = get_asset(asset_ids[player_id_array.indexOf(player_id)]);
		}else{
			var asset = get_asset("HeadRed");
		}

		player_head.image = asset;
		update_score(WorldController.get_score());
		if(hero){
			update_health(hero.hp);
		}
		
		
	};
	
	var update_score = function(new_score){
		score.text = parseInt(new_score);
	};
	
	var update_health = function(new_health){
		healthX = parseInt(new_health);
		health_bar.graphics.clear();
		health_bar.graphics.beginFill("red");
		if(healthX >= 0){
			health_bar.graphics.drawRect(30,25,healthX, 20);
		}
		else{
			health_bar.graphics.drawRect(30,25,1, 20);
		} 
	};
	
	return {
		// declare public
		init: init, 
		render: render,
	};
})();

module.exports = HUDRenderer;

var Includes = require("../Includes.js"); var include_data = Includes.get_include_data({
	current_module: "HUDRenderer", 
	include_options: Includes.choices.RENDERER_SPECIFIC
}); eval(include_data.name_statements); var include = function(){eval(include_data.module_statements);}


},{"../Includes.js":19}],48:[function(require,module,exports){
var HeroRenderer = (function(){

	var spritesheets = {}; // to store spritesheets used by this entity

	var init = function(){
		/* is ran from GraphicsController.init once during game loading
			use this function to create spritesheets and such
			like spritesheets.first = new createjs.Spritesheet(...);
		*/
		include(); // satisfy requirements, GOES FIRST
		
		//SpriteSheetUtils.addFlippedFrames(spriteSheets["Hero"], true, false, false);
	};

	var register = function(entity_hero){
		/* is ran for every entity of this type that was just created and should
		get graphics representation. You are given the entity instance and is supposed
		to crete graphics instance, and GraphicsController.reg_for_render(graphics_instance, entity_instance); it 
		*/
		var hero_sprite;
		var hero_index;
		var en_id = entity_hero.player_id;
		var id = NetworkController.get_network_id();
		var player_id = Config.Init.player_id;
		var player_id_array = Config.Init.player_id_array;
		var get_asset = AssetController.get_asset;
		//console.log("Player id", id);
		//console.log("entity id", en_id);
		//switch(en_id){
			//case "player1":
				//hero_index = "HeroOrange";
				//hero_sprite = get_asset("HeroOrange");
				//break;
			//case "player2":
				//hero_index = "HeroPink";
				//hero_sprite = get_asset("HeroPink");
				//break;
			//case "player3":
				//hero_index = "HeroLPurple";
				//hero_sprite = get_asset("HeroLPurple");
				//break;
			//case "player4":
				//hero_index = "HeroGreen";
				//hero_sprite = get_asset("HeroGreen");
				//break;
			//case "player5":
				//hero_index = "HeroLightBlue";
				//hero_sprite = get_asset("HeroLightBlue");
				//break;
			//case "player6":
				//hero_index = "HeroLightGreen";
				//hero_sprite = get_asset("HeroLightGreen");
				//break;
			//case "player7":
				//hero_index = "HeroBlue";
				//hero_sprite = get_asset("HeroBlue");
				//break;
			//case "player8":
				//hero_index = "HeroRed";
				//hero_sprite = get_asset("HeroRed");
				//break;
			//default:
				//hero_index = "HeroRed";
				//hero_sprite = get_asset("HeroRed");
				

				
		//}
		var asset_ids = ["HeroOrange", "HeroPink", "HeroLPurple", "HeroGreen", "HeroLightBlue", "HeroLightGreen", "HeroBlue", "HeroRed", "HeroRed"];
			
		if(player_id_array != null && player_id_array.length > 0){
			// if player id was populated properly, choose asset id corresponding to the index
			var hero_index = asset_ids[player_id_array.indexOf(en_id)];
		}else{
			var hero_index = "HeroRed";
		}
		var hero_sprite = get_asset(hero_index);

		// spritesheet is recreated each time hero is spawned. that is completely unnecessary
		spritesheets[hero_index] = new createjs.SpriteSheet({
			"framerate": 1,
			"images": [hero_sprite], //get_asset("HeroR"), get_asset("HeroW")
			"frames": { "regX": 25, "regY": 25, "height": 50, "width": 50, "count": 16},
			"animations": {
				"stand": {
				frames: [0]
				},
				"finish": {
					frames: [8]
				},				
				"walk": {
					 frames: [0,1, 2],
					 speed: 0.2
				 },
				"jump": {
					frames: [3, 4, 5, 6, 7, 8],
					speed: 0.2
				},
				"death": {
					frames: [9, 10, 11, 12, 13, 14, 15],
					speed: 0.1,
					next: "death"
				},
				"decay": {
					frames: [15]
				},
			}
		})

		hero_animation = GraphicsController.request_animated(spritesheets[hero_index], "stand");
		hero_animation.graphics_id = hero_index;
		GraphicsController.set_reg_position(hero_animation, -25, -25);
		GraphicsController.reg_for_render(hero_animation, entity_hero);
		if(entity_hero.player_id == NetworkController.get_network_id()){
			GraphicsController.follow(entity_hero.id);
		}

	};
	/*
	var render = function(hero){

		if(hero.physical_instance.state=="walk"&&hero.physical_instance.is_walk == true){
			if(hero.physical_instance.walk_tick ==1){
				hero.gotoAndPlay("walk");
			}
			hero.physical_instance.walk_tick++;
			if(hero.physical_instance.walk_tick ==10){
				hero.physical_instance.state= "stand";
				hero.physical_instance.is_walk = false;
			}
		}
		
		if(hero.physical_instance.state=="jump"){
			if(hero.physical_instance.jump_tick ==1){
				hero.gotoAndPlay("jump");
			}
			hero.physical_instance.jump_tick++;
			if(hero.physical_instance.jump_tick >= 20){
				hero.gotoAndPlay("finish");
				if(hero.physical_instance.jumps==0){
					hero.physical_instance.state="finish";
				}
				
			}
		}
		
		if(hero.physical_instance.state=="finish"){
			hero.gotoAndPlay("finish");
		}
		if(hero.physical_instance.state=="deathFinal"){
			hero.gotoAndPlay("deathFinal");
		}
		if(hero.physical_instance.state=="stand"){
			hero.gotoAndPlay("stand");
		}
		//console.log(hero.physical_instance.state);
		if (hero.physical_instance.state == "death") {
			//console.log(hero.physical_instance.death_tick);
			if(hero.physical_instance.death_tick ==1){
			    hero.gotoAndPlay("death");
			}
			else if(hero.physical_instance.death_tick >=20){
				hero.physical_instance.state="deathFinal";
			}
		}
		
		//set direction
		if (hero.physical_instance.left){ //if direction == right, flip right
			hero.scaleX = -1;
		}else{ //else flip left
			hero.scaleX = 1;
		}
	};
	*/

	return {
		// declare public
		init: init, 
		register: register,
		//render: render,
	};
})();

module.exports = HeroRenderer;

var Includes = require("../Includes.js"); var include_data = Includes.get_include_data({
	current_module: "HeroRenderer", 
	include_options: Includes.choices.RENDERER_SPECIFIC
}); eval(include_data.name_statements); var include = function(){eval(include_data.module_statements);}

},{"../Includes.js":19}],49:[function(require,module,exports){
var HyenaRenderer = (function(){

	var spritesheets = {};
	var Hyena_animation;

	var init = function(){
		/* is ran from GraphicsController.init once during game loading
		 	use this function to create spritesheets and such
			like spritesheets.first = new createjs.Spritesheet(...);
		*/

		include(); // satisfy requirements, GOES FIRST
		var get_asset = AssetController.get_asset;

		spritesheets["Hyena"] = new createjs.SpriteSheet({
			"framerate": 1,
			"images": [get_asset("HyenaSprite")],
			"frames": { "regX": 0, "regY": 8, "height": 64, "width": 64, "count": 17},
			"animations": {
				"run": [0,3, "run", 0.5],
				"stand": [4,5, "stand", 0.25],
				"walk": [8,11, "walk", 0.2],
				"leap": [6],
				"fall": [7],
				"death": [12,14, "decay", 0.25],
				"decay": [15,16, "decay", 0.25],
			}
		})

	};

	var register = function(entity_hyena){
		/* is run for every entity of this type that was just created and should
		get graphics representation. You are given the entity instance and is supposed
		to create graphics instance, and GraphicsController.reg_for_render(graphics_instance, entity_instance); it 
		*/

		hyena_animation = GraphicsController.request_animated(spritesheets["Hyena"], "walk");
		GraphicsController.set_reg_position(hyena_animation, 0, 0); // change that to adjust sprite position relative to the body
		GraphicsController.reg_for_render(hyena_animation, entity_hyena); // sets hyena_animation's position to track the hyena's position (updates each tick)
		/*
		hyena_animation is the easeljs_obj passed through graphicsController
		entity_hyena is the physical object spawned in HyenaLogic
		request_animated returns an easeljs object of type Sprite
		this Sprite is the object passed to render
		*/
		
	};

	var render = function(hyena){
		/* 	is run each tick from GraphicsController, for every registered object of this type
			is given >graphics_instance< parameter, which is also supposed to contain
			physical_instance property containing entity_instance, if it was attached correctly
		*/

		hyena_animate(hyena); 
	};

	var hyena_animate = function(hyena){
		//set graphical representation based on the animation variable determined by the AI
		//set animation
		if(hyena.physical_instance.needs_graphics_update){
			var animation = hyena.physical_instance.animation;
			hyena.gotoAndPlay(animation)
		}
		
		//set direction
		if (hyena.physical_instance.direction){ //if direction == right, flip right
			hyena.scaleX = -1;
		}else{ //else flip left
			hyena.scaleX = 1;
		}

		//set alpha if blinking
		if(hyena.physical_instance.blinking && hyena.physical_instance.blink_timer%2 == 1){
			hyena.alpha = 0;
		}else{
			hyena.alpha = 1;
		}
	};
	
	return {
		// declare public
		init: init, 
		register: register,
		render: render,
	};
})();

module.exports = HyenaRenderer;

var Includes = require("../Includes.js"); var include_data = Includes.get_include_data({
	current_module: "HyenaRenderer", 
	include_options: Includes.choices.RENDERER_SPECIFIC
}); eval(include_data.name_statements); var include = function(){eval(include_data.module_statements);}

},{"../Includes.js":19}],50:[function(require,module,exports){
var MedusaRenderer = (function(){

	var spritesheets = {};
	var Medusa_animation;

	var init = function(){
		/* is ran from GraphicsController.init once during game loading
		 	use this function to create spritesheets and such
			like spritesheets.first = new createjs.Spritesheet(...);
		*/

		include(); // satisfy requirements, GOES FIRST
		var get_asset = AssetController.get_asset;

		spritesheets["Medusa"] = new createjs.SpriteSheet({
			"framerate": 1,
			"images": [get_asset("Medusa1"),], //MedusaSpriteSheet
			"frames": { "regX": 0, "regY": 0, "height": 85, "width": 47.5, "count": 3},
				"animations": {
				"walk": [0, 2, "walk", 0.2],
				"injury": {
				    frames: [2, 3, .25]
				},
				"death": [2, 3, "death", 0.6],
                
			}
		})

	};

	var register = function(entity_Medusa){
		/* is ran for every entity of this type that was just created and should
		get graphics representation. You are given the entity instance and is supposed
		to crete graphics instance, and GraphicsController.reg_for_render(graphics_instance, entity_instance); it 
		*/

		Medusa_animation = GraphicsController.request_animated(spritesheets["Medusa"], "walk");
		GraphicsController.set_reg_position(Medusa_animation, 0, 0); // change that to adjust sprite position relative to the body
		GraphicsController.reg_for_render(Medusa_animation, entity_Medusa); // sets medusa_animation's position to track the medusa's position (updates each tick)

		
	};

	var render = function(Medusa){
		/* 	is ran each tick from GraphicsController, for every registered object of this type
			is given >graphics_instance< parameter, which is also supposed to contain
			physical_instance property containing entity_instance, if it was attched correctly
		*/

		Medusa_special_render_temp(Medusa); 
	};

	var Medusa_special_render_temp = function(Medusa){
		/* how to handle special render? TEMPORARY */

		//set graphical representation based on the animation variable determined by the AI
		//set animation
		if(Medusa.physical_instance.needs_graphics_update){
			var animation = Medusa.physical_instance.animation;
			Medusa.gotoAndPlay(animation)
		}
		
		//set direction
		if (Medusa.physical_instance.direction){ //if direction == right, flip right
			Medusa.scaleX = -1;
		}else{ //else flip left
			Medusa.scaleX = 1;
		}

		//set alpha if blinking
		if(Medusa.physical_instance.blinking && Medusa.physical_instance.blink_timer%2 == 1){
			Medusa.alpha = 0;
		}else{
			Medusa.alpha = 1;
		}
	};

	return {
		// declare public
		init: init, 
		register: register,
		render: render,
	};
})();

module.exports = MedusaRenderer;

var Includes = require("../Includes.js"); var include_data = Includes.get_include_data({
	current_module: "MedusaRenderer", 
	include_options: Includes.choices.RENDERER_SPECIFIC
}); eval(include_data.name_statements); var include = function(){eval(include_data.module_statements);}

},{"../Includes.js":19}],51:[function(require,module,exports){
var PizzaRenderer = (function () {

    var spritesheets = {}; // to store spritesheets used by this entity

    var init = function () {
        include(); // satisfy requirements, GOES FIRST
        var get_asset = AssetController.get_asset;
        spritesheets["pizza"] = new createjs.SpriteSheet({
            "framerate": 1,
            "images": [get_asset("pizza")],
            "frames": { "regX": 0, "regY": 0, "height": 15, "width": 15, "count": 1 },
            "animations": {
                "normal": [1, "walk"]
            }
        })
    };

    var register = function (entity_pizza) {
        pizza_animation = GraphicsController.request_animated(spritesheets["pizza"], "normal");
        GraphicsController.set_reg_position(pizza_animation, 0, 0); // change that to adjust sprite position relative to the body
        GraphicsController.reg_for_render(pizza_animation, entity_pizza); // sets ant_animation's position to track the ant's position (updates each tick)
    };

    var render = function (cell) {

    };

    return {
        // declare public
        init: init,
        register: register,
        render: render,
    };
})();

module.exports = PizzaRenderer;

var Includes = require("../Includes.js"); var include_data = Includes.get_include_data({
    current_module: "TerrainCellRenderer",
    include_options: Includes.choices.RENDERER_SPECIFIC
}); eval(include_data.name_statements); var include = function () { eval(include_data.module_statements); }


},{"../Includes.js":19}],52:[function(require,module,exports){
var TerrainCellRenderer = (function(){

	var spritesheets = {}; // to store spritesheets used by this entity

	var init = function(){
		/* is ran from GraphicsController.init once during game loading
			use this function to create spritesheets and such
			like spritesheets.first = new createjs.Spritesheet(...);
		*/
		include(); // satisfy requirements, GOES FIRST

	};

	var register = function(entity_cell){
		/* is ran for every entity of this type that was just created and should
		get graphics representation. You are given the entity instance and is supposed
		to crete graphics instance, and GraphicsController.reg_for_render(graphics_instance, entity_instance); it 
		*/

		
	};

	var render = function(cell){
		/* 	is ran each tick from GraphicsController, for every registered object of this type
			is given >graphics_instance< parameter, which is also supposed to contain
			physical_instance property containing entity_instance, if it was attched correctly
		*/

	};

	return {
		// declare public
		init: init, 
		register: register,
		render: render,
	};
})();

module.exports = TerrainCellRenderer;

var Includes = require("../Includes.js"); var include_data = Includes.get_include_data({
	current_module: "TerrainCellRenderer", 
	include_options: Includes.choices.RENDERER_SPECIFIC
}); eval(include_data.name_statements); var include = function(){eval(include_data.module_statements);}


},{"../Includes.js":19}],53:[function(require,module,exports){
var TerrainSliceRenderer = (function(){

	var spritesheets = {}; // to store spritesheets used by this entity

	var init = function(){
		/* is ran from GraphicsController.init once during game loading
			use this function to create spritesheets and such
			like spritesheets.first = new createjs.Spritesheet(...);
		*/
		include(); // satisfy requirements, GOES FIRST

	};

	var register = function(slice, PrivateGraphics){
		/* is ran for every entity of this type that was just created and should
		get graphics representation. You are given the entity instance and is supposed
		to crete graphics instance, and GraphicsController.reg_for_render(graphics_instance, entity_instance); it 
		*/

		// TODO: change that private crap to smth more useful
		// like make graphics controller special case in includes,
		// so that only interested people can get it
		var request_animated = PrivateGraphics.request_animated;
		var request_bitmap = PrivateGraphics.request_bitmap;
		var trans_xy = PrivateGraphics.trans_xy;
		var reg_for_render = PrivateGraphics.reg_for_render;

		for(var i = 0; i < slice.grid_rows; i++){
				for(var j = 0; j < slice.grid_columns; j++){
					var kind = slice.grid[i][j].kind;
					if(kind != 0){
						// TODO: should make proper terrain collection thing to pull from
						/*
						var tile_texture = ["grass", "middle_terrain", "bottom_terrain"][kind-1];
						var tile = request_bitmap(tile_texture);
						*/
						var surface_textures = ["grass_winter","grass_spring","grass_summer","grass_fall"];
						var position = slice.grid[i][j].position;
						if (kind == 1){ //if tile is part of the ground
							switch (position){
									case "surface":
										//console.log(WorldController.get_season());
										var tile_texture = surface_textures[WorldController.get_season()];
									break;
								case "underground":
									var tile_texture = "bottom_terrain";
									break;
							}
						}
						if (kind == 2){ //if tile is part of a platform
							switch (position){
								case "left":
									var tile_texture = "left_platform";;
									break;
								case "middle":
									var tile_texture = "middle_platform";
									break;
								case "right":
									var tile_texture = "right_platform";
									break;
							}
						}
						if (kind == 3){//if tile is actually just spikes
							var tile_texture = "platform_spikes";
						}
						var tile = request_bitmap(tile_texture);
						var physical_instance = slice.grid[i][j];
						var body_position = physical_instance.body.GetWorldCenter();
						var trans_pos = trans_xy(body_position);
						tile.x = trans_pos.x;
						tile.y = trans_pos.y;
						reg_for_render(tile, physical_instance);
					} // end tile_texture assignment
				} // end for
			}//end for
		
	};

	var render = function(slice){
		/* 	is ran each tick from GraphicsController, for every registered object of this type
			is given >graphics_instance< parameter, which is also supposed to contain
			physical_instance property containing entity_instance, if it was attched correctly
		*/

	};

	return {
		// declare public
		init: init, 
		register: register,
		render: render,
	};
})();

module.exports = TerrainSliceRenderer;

var Includes = require("../Includes.js"); var include_data = Includes.get_include_data({
	current_module: "TerrainSliceRenderer", 
	include_options: Includes.choices.RENDERER_SPECIFIC
}); eval(include_data.name_statements); var include = function(){eval(include_data.module_statements);}


},{"../Includes.js":19}],54:[function(require,module,exports){

/*
 * Rules for working on the (client-side) game code:
 *
 * 1. If you think that one of these rules is stupid or useless, tell me, along with some better suggestions.
 *
 * 2. Model [name]Model can only be accessed through [name]Controller. If you need to do something to 
 * 		change [name]Model from [other_name]Controller, write function in the [name]Controller that does
 * 		what you need, and call it from the [other_name]Controller
 *
 * 3. Controllers are allowed to have private methods/fields. Models aren't. 
 *
 * 4. Controllers aren't allowed to have public data fields. 
 * 		Those data fields that are present must not reflect state of the game, they must be related to
 * 		some internal functionality of the controller
 *
 * 5. If you write some function that doesn't logically belong to one of the controllers,
 * 		put it in the Utility
 *
 * 6. Variables are named like that: variable_name
 * 		Except (singleton)class names, that are written like that: ClassName
 *
 * 7. And all the obvious stuff that everyone knows:
 * 		function must do one thing; don't make function public unless it needs to be that; 
 * 		comment ambigious code, for larger functions indicate their purpose (through commenting);
 */


// main namespace that is exposed to global scope (window object)
window.sidescroller_game = (function namespace(){

		var Includes = require("./Includes.js"); var include_data = Includes.get_include_data({
		current_module: "None", 
		include_options: Includes.choices.ALL_CONTROLLERS
	}); eval(include_data.name_statements); var include = function(){eval(include_data.module_statements);}

	// Game initiation section: >>>
		
	var load_game = function(mode, session_id, player_id, player_id_array)
	{
	
		Includes.init(); // first
		include(); // second

		InitController.init(mode, session_id, player_id, player_id_array); // init all the stuff

		if(mode == "test"){
			TestController.test();
		}
	};


	var run = function(mode, session_id, player_id, player_id_array)
	{
		// done this way to ensure that load_game's internals aren't accessible to the world:
		load_game(mode, session_id, player_id, player_id_array);
	}; 
	
	return {
		run: run
	}; // expose function run to the world

})(); 


},{"./Includes.js":19}],55:[function(require,module,exports){
/*
* Copyright (c) 2006-2007 Erin Catto http://www.gphysics.com
*
* This software is provided 'as-is', without any express or implied
* warranty.  In no event will the authors be held liable for any damages
* arising from the use of this software.
* Permission is granted to anyone to use this software for any purpose,
* including commercial applications, and to alter it and redistribute it
* freely, subject to the following restrictions:
* 1. The origin of this software must not be misrepresented; you must not
* claim that you wrote the original software. If you use this software
* in a product, an acknowledgment in the product documentation would be
* appreciated but is not required.
* 2. Altered source versions must be plainly marked as such, and must not be
* misrepresented as being the original software.
* 3. This notice may not be removed or altered from any source distribution.
*/
"use strict"

var Box2D = {};

(function (a2j, undefined) {
   
   function emptyFn() {};
   a2j.inherit = function(cls, base) {
      var tmpCtr = cls;
      emptyFn.prototype = base.prototype;
      cls.prototype = new emptyFn;
      cls.prototype.constructor = tmpCtr;
   };
   
   a2j.generateCallback = function generateCallback(context, cb) {
      return function () {
         cb.apply(context, arguments);
      };
   };
   
   a2j.NVector = function NVector(length) {
      if (length === undefined) length = 0;
      var tmp = new Array(length || 0);
      for (var i = 0; i < length; ++i)
      tmp[i] = 0;
      return tmp;
   };
   
   a2j.is = function is(o1, o2) {
      if (o1 === null) return false;
      if ((o2 instanceof Function) && (o1 instanceof o2)) return true;
      if ((o1.constructor.__implements != undefined) && (o1.constructor.__implements[o2])) return true;
      return false;
   };
   
   a2j.parseUInt = function(v) {
      return Math.abs(parseInt(v));
   }
   
})(Box2D);

//#TODO remove assignments from global namespace
var Vector = Array;
var Vector_a2j_Number = Box2D.NVector;
//package structure
if (typeof(Box2D) === "undefined") Box2D = {};
if (typeof(Box2D.Collision) === "undefined") Box2D.Collision = {};
if (typeof(Box2D.Collision.Shapes) === "undefined") Box2D.Collision.Shapes = {};
if (typeof(Box2D.Common) === "undefined") Box2D.Common = {};
if (typeof(Box2D.Common.Math) === "undefined") Box2D.Common.Math = {};
if (typeof(Box2D.Dynamics) === "undefined") Box2D.Dynamics = {};
if (typeof(Box2D.Dynamics.Contacts) === "undefined") Box2D.Dynamics.Contacts = {};
if (typeof(Box2D.Dynamics.Controllers) === "undefined") Box2D.Dynamics.Controllers = {};
if (typeof(Box2D.Dynamics.Joints) === "undefined") Box2D.Dynamics.Joints = {};
//pre-definitions
(function () {
   Box2D.Collision.IBroadPhase = 'Box2D.Collision.IBroadPhase';

   function b2AABB() {
      b2AABB.b2AABB.apply(this, arguments);
   };
   Box2D.Collision.b2AABB = b2AABB;

   function b2Bound() {
      b2Bound.b2Bound.apply(this, arguments);
   };
   Box2D.Collision.b2Bound = b2Bound;

   function b2BoundValues() {
      b2BoundValues.b2BoundValues.apply(this, arguments);
      if (this.constructor === b2BoundValues) this.b2BoundValues.apply(this, arguments);
   };
   Box2D.Collision.b2BoundValues = b2BoundValues;

   function b2Collision() {
      b2Collision.b2Collision.apply(this, arguments);
   };
   Box2D.Collision.b2Collision = b2Collision;

   function b2ContactID() {
      b2ContactID.b2ContactID.apply(this, arguments);
      if (this.constructor === b2ContactID) this.b2ContactID.apply(this, arguments);
   };
   Box2D.Collision.b2ContactID = b2ContactID;

   function b2ContactPoint() {
      b2ContactPoint.b2ContactPoint.apply(this, arguments);
   };
   Box2D.Collision.b2ContactPoint = b2ContactPoint;

   function b2Distance() {
      b2Distance.b2Distance.apply(this, arguments);
   };
   Box2D.Collision.b2Distance = b2Distance;

   function b2DistanceInput() {
      b2DistanceInput.b2DistanceInput.apply(this, arguments);
   };
   Box2D.Collision.b2DistanceInput = b2DistanceInput;

   function b2DistanceOutput() {
      b2DistanceOutput.b2DistanceOutput.apply(this, arguments);
   };
   Box2D.Collision.b2DistanceOutput = b2DistanceOutput;

   function b2DistanceProxy() {
      b2DistanceProxy.b2DistanceProxy.apply(this, arguments);
   };
   Box2D.Collision.b2DistanceProxy = b2DistanceProxy;

   function b2DynamicTree() {
      b2DynamicTree.b2DynamicTree.apply(this, arguments);
      if (this.constructor === b2DynamicTree) this.b2DynamicTree.apply(this, arguments);
   };
   Box2D.Collision.b2DynamicTree = b2DynamicTree;

   function b2DynamicTreeBroadPhase() {
      b2DynamicTreeBroadPhase.b2DynamicTreeBroadPhase.apply(this, arguments);
   };
   Box2D.Collision.b2DynamicTreeBroadPhase = b2DynamicTreeBroadPhase;

   function b2DynamicTreeNode() {
      b2DynamicTreeNode.b2DynamicTreeNode.apply(this, arguments);
   };
   Box2D.Collision.b2DynamicTreeNode = b2DynamicTreeNode;

   function b2DynamicTreePair() {
      b2DynamicTreePair.b2DynamicTreePair.apply(this, arguments);
   };
   Box2D.Collision.b2DynamicTreePair = b2DynamicTreePair;

   function b2Manifold() {
      b2Manifold.b2Manifold.apply(this, arguments);
      if (this.constructor === b2Manifold) this.b2Manifold.apply(this, arguments);
   };
   Box2D.Collision.b2Manifold = b2Manifold;

   function b2ManifoldPoint() {
      b2ManifoldPoint.b2ManifoldPoint.apply(this, arguments);
      if (this.constructor === b2ManifoldPoint) this.b2ManifoldPoint.apply(this, arguments);
   };
   Box2D.Collision.b2ManifoldPoint = b2ManifoldPoint;

   function b2Point() {
      b2Point.b2Point.apply(this, arguments);
   };
   Box2D.Collision.b2Point = b2Point;

   function b2RayCastInput() {
      b2RayCastInput.b2RayCastInput.apply(this, arguments);
      if (this.constructor === b2RayCastInput) this.b2RayCastInput.apply(this, arguments);
   };
   Box2D.Collision.b2RayCastInput = b2RayCastInput;

   function b2RayCastOutput() {
      b2RayCastOutput.b2RayCastOutput.apply(this, arguments);
   };
   Box2D.Collision.b2RayCastOutput = b2RayCastOutput;

   function b2Segment() {
      b2Segment.b2Segment.apply(this, arguments);
   };
   Box2D.Collision.b2Segment = b2Segment;

   function b2SeparationFunction() {
      b2SeparationFunction.b2SeparationFunction.apply(this, arguments);
   };
   Box2D.Collision.b2SeparationFunction = b2SeparationFunction;

   function b2Simplex() {
      b2Simplex.b2Simplex.apply(this, arguments);
      if (this.constructor === b2Simplex) this.b2Simplex.apply(this, arguments);
   };
   Box2D.Collision.b2Simplex = b2Simplex;

   function b2SimplexCache() {
      b2SimplexCache.b2SimplexCache.apply(this, arguments);
   };
   Box2D.Collision.b2SimplexCache = b2SimplexCache;

   function b2SimplexVertex() {
      b2SimplexVertex.b2SimplexVertex.apply(this, arguments);
   };
   Box2D.Collision.b2SimplexVertex = b2SimplexVertex;

   function b2TimeOfImpact() {
      b2TimeOfImpact.b2TimeOfImpact.apply(this, arguments);
   };
   Box2D.Collision.b2TimeOfImpact = b2TimeOfImpact;

   function b2TOIInput() {
      b2TOIInput.b2TOIInput.apply(this, arguments);
   };
   Box2D.Collision.b2TOIInput = b2TOIInput;

   function b2WorldManifold() {
      b2WorldManifold.b2WorldManifold.apply(this, arguments);
      if (this.constructor === b2WorldManifold) this.b2WorldManifold.apply(this, arguments);
   };
   Box2D.Collision.b2WorldManifold = b2WorldManifold;

   function ClipVertex() {
      ClipVertex.ClipVertex.apply(this, arguments);
   };
   Box2D.Collision.ClipVertex = ClipVertex;

   function Features() {
      Features.Features.apply(this, arguments);
   };
   Box2D.Collision.Features = Features;

   function b2CircleShape() {
      b2CircleShape.b2CircleShape.apply(this, arguments);
      if (this.constructor === b2CircleShape) this.b2CircleShape.apply(this, arguments);
   };
   Box2D.Collision.Shapes.b2CircleShape = b2CircleShape;

   function b2EdgeChainDef() {
      b2EdgeChainDef.b2EdgeChainDef.apply(this, arguments);
      if (this.constructor === b2EdgeChainDef) this.b2EdgeChainDef.apply(this, arguments);
   };
   Box2D.Collision.Shapes.b2EdgeChainDef = b2EdgeChainDef;

   function b2EdgeShape() {
      b2EdgeShape.b2EdgeShape.apply(this, arguments);
      if (this.constructor === b2EdgeShape) this.b2EdgeShape.apply(this, arguments);
   };
   Box2D.Collision.Shapes.b2EdgeShape = b2EdgeShape;

   function b2MassData() {
      b2MassData.b2MassData.apply(this, arguments);
   };
   Box2D.Collision.Shapes.b2MassData = b2MassData;

   function b2PolygonShape() {
      b2PolygonShape.b2PolygonShape.apply(this, arguments);
      if (this.constructor === b2PolygonShape) this.b2PolygonShape.apply(this, arguments);
   };
   Box2D.Collision.Shapes.b2PolygonShape = b2PolygonShape;

   function b2Shape() {
      b2Shape.b2Shape.apply(this, arguments);
      if (this.constructor === b2Shape) this.b2Shape.apply(this, arguments);
   };
   Box2D.Collision.Shapes.b2Shape = b2Shape;
   Box2D.Common.b2internal = 'Box2D.Common.b2internal';

   function b2Color() {
      b2Color.b2Color.apply(this, arguments);
      if (this.constructor === b2Color) this.b2Color.apply(this, arguments);
   };
   Box2D.Common.b2Color = b2Color;

   function b2Settings() {
      b2Settings.b2Settings.apply(this, arguments);
   };
   Box2D.Common.b2Settings = b2Settings;

   function b2Mat22() {
      b2Mat22.b2Mat22.apply(this, arguments);
      if (this.constructor === b2Mat22) this.b2Mat22.apply(this, arguments);
   };
   Box2D.Common.Math.b2Mat22 = b2Mat22;

   function b2Mat33() {
      b2Mat33.b2Mat33.apply(this, arguments);
      if (this.constructor === b2Mat33) this.b2Mat33.apply(this, arguments);
   };
   Box2D.Common.Math.b2Mat33 = b2Mat33;

   function b2Math() {
      b2Math.b2Math.apply(this, arguments);
   };
   Box2D.Common.Math.b2Math = b2Math;

   function b2Sweep() {
      b2Sweep.b2Sweep.apply(this, arguments);
   };
   Box2D.Common.Math.b2Sweep = b2Sweep;

   function b2Transform() {
      b2Transform.b2Transform.apply(this, arguments);
      if (this.constructor === b2Transform) this.b2Transform.apply(this, arguments);
   };
   Box2D.Common.Math.b2Transform = b2Transform;

   function b2Vec2() {
      b2Vec2.b2Vec2.apply(this, arguments);
      if (this.constructor === b2Vec2) this.b2Vec2.apply(this, arguments);
   };
   Box2D.Common.Math.b2Vec2 = b2Vec2;

   function b2Vec3() {
      b2Vec3.b2Vec3.apply(this, arguments);
      if (this.constructor === b2Vec3) this.b2Vec3.apply(this, arguments);
   };
   Box2D.Common.Math.b2Vec3 = b2Vec3;

   function b2Body() {
      b2Body.b2Body.apply(this, arguments);
      if (this.constructor === b2Body) this.b2Body.apply(this, arguments);
   };
   Box2D.Dynamics.b2Body = b2Body;

   function b2BodyDef() {
      b2BodyDef.b2BodyDef.apply(this, arguments);
      if (this.constructor === b2BodyDef) this.b2BodyDef.apply(this, arguments);
   };
   Box2D.Dynamics.b2BodyDef = b2BodyDef;

   function b2ContactFilter() {
      b2ContactFilter.b2ContactFilter.apply(this, arguments);
   };
   Box2D.Dynamics.b2ContactFilter = b2ContactFilter;

   function b2ContactImpulse() {
      b2ContactImpulse.b2ContactImpulse.apply(this, arguments);
   };
   Box2D.Dynamics.b2ContactImpulse = b2ContactImpulse;

   function b2ContactListener() {
      b2ContactListener.b2ContactListener.apply(this, arguments);
   };
   Box2D.Dynamics.b2ContactListener = b2ContactListener;

   function b2ContactManager() {
      b2ContactManager.b2ContactManager.apply(this, arguments);
      if (this.constructor === b2ContactManager) this.b2ContactManager.apply(this, arguments);
   };
   Box2D.Dynamics.b2ContactManager = b2ContactManager;

   function b2DebugDraw() {
      b2DebugDraw.b2DebugDraw.apply(this, arguments);
      if (this.constructor === b2DebugDraw) this.b2DebugDraw.apply(this, arguments);
   };
   Box2D.Dynamics.b2DebugDraw = b2DebugDraw;

   function b2DestructionListener() {
      b2DestructionListener.b2DestructionListener.apply(this, arguments);
   };
   Box2D.Dynamics.b2DestructionListener = b2DestructionListener;

   function b2FilterData() {
      b2FilterData.b2FilterData.apply(this, arguments);
   };
   Box2D.Dynamics.b2FilterData = b2FilterData;

   function b2Fixture() {
      b2Fixture.b2Fixture.apply(this, arguments);
      if (this.constructor === b2Fixture) this.b2Fixture.apply(this, arguments);
   };
   Box2D.Dynamics.b2Fixture = b2Fixture;

   function b2FixtureDef() {
      b2FixtureDef.b2FixtureDef.apply(this, arguments);
      if (this.constructor === b2FixtureDef) this.b2FixtureDef.apply(this, arguments);
   };
   Box2D.Dynamics.b2FixtureDef = b2FixtureDef;

   function b2Island() {
      b2Island.b2Island.apply(this, arguments);
      if (this.constructor === b2Island) this.b2Island.apply(this, arguments);
   };
   Box2D.Dynamics.b2Island = b2Island;

   function b2TimeStep() {
      b2TimeStep.b2TimeStep.apply(this, arguments);
   };
   Box2D.Dynamics.b2TimeStep = b2TimeStep;

   function b2World() {
      b2World.b2World.apply(this, arguments);
      if (this.constructor === b2World) this.b2World.apply(this, arguments);
   };
   Box2D.Dynamics.b2World = b2World;

   function b2CircleContact() {
      b2CircleContact.b2CircleContact.apply(this, arguments);
   };
   Box2D.Dynamics.Contacts.b2CircleContact = b2CircleContact;

   function b2Contact() {
      b2Contact.b2Contact.apply(this, arguments);
      if (this.constructor === b2Contact) this.b2Contact.apply(this, arguments);
   };
   Box2D.Dynamics.Contacts.b2Contact = b2Contact;

   function b2ContactConstraint() {
      b2ContactConstraint.b2ContactConstraint.apply(this, arguments);
      if (this.constructor === b2ContactConstraint) this.b2ContactConstraint.apply(this, arguments);
   };
   Box2D.Dynamics.Contacts.b2ContactConstraint = b2ContactConstraint;

   function b2ContactConstraintPoint() {
      b2ContactConstraintPoint.b2ContactConstraintPoint.apply(this, arguments);
   };
   Box2D.Dynamics.Contacts.b2ContactConstraintPoint = b2ContactConstraintPoint;

   function b2ContactEdge() {
      b2ContactEdge.b2ContactEdge.apply(this, arguments);
   };
   Box2D.Dynamics.Contacts.b2ContactEdge = b2ContactEdge;

   function b2ContactFactory() {
      b2ContactFactory.b2ContactFactory.apply(this, arguments);
      if (this.constructor === b2ContactFactory) this.b2ContactFactory.apply(this, arguments);
   };
   Box2D.Dynamics.Contacts.b2ContactFactory = b2ContactFactory;

   function b2ContactRegister() {
      b2ContactRegister.b2ContactRegister.apply(this, arguments);
   };
   Box2D.Dynamics.Contacts.b2ContactRegister = b2ContactRegister;

   function b2ContactResult() {
      b2ContactResult.b2ContactResult.apply(this, arguments);
   };
   Box2D.Dynamics.Contacts.b2ContactResult = b2ContactResult;

   function b2ContactSolver() {
      b2ContactSolver.b2ContactSolver.apply(this, arguments);
      if (this.constructor === b2ContactSolver) this.b2ContactSolver.apply(this, arguments);
   };
   Box2D.Dynamics.Contacts.b2ContactSolver = b2ContactSolver;

   function b2EdgeAndCircleContact() {
      b2EdgeAndCircleContact.b2EdgeAndCircleContact.apply(this, arguments);
   };
   Box2D.Dynamics.Contacts.b2EdgeAndCircleContact = b2EdgeAndCircleContact;

   function b2NullContact() {
      b2NullContact.b2NullContact.apply(this, arguments);
      if (this.constructor === b2NullContact) this.b2NullContact.apply(this, arguments);
   };
   Box2D.Dynamics.Contacts.b2NullContact = b2NullContact;

   function b2PolyAndCircleContact() {
      b2PolyAndCircleContact.b2PolyAndCircleContact.apply(this, arguments);
   };
   Box2D.Dynamics.Contacts.b2PolyAndCircleContact = b2PolyAndCircleContact;

   function b2PolyAndEdgeContact() {
      b2PolyAndEdgeContact.b2PolyAndEdgeContact.apply(this, arguments);
   };
   Box2D.Dynamics.Contacts.b2PolyAndEdgeContact = b2PolyAndEdgeContact;

   function b2PolygonContact() {
      b2PolygonContact.b2PolygonContact.apply(this, arguments);
   };
   Box2D.Dynamics.Contacts.b2PolygonContact = b2PolygonContact;

   function b2PositionSolverManifold() {
      b2PositionSolverManifold.b2PositionSolverManifold.apply(this, arguments);
      if (this.constructor === b2PositionSolverManifold) this.b2PositionSolverManifold.apply(this, arguments);
   };
   Box2D.Dynamics.Contacts.b2PositionSolverManifold = b2PositionSolverManifold;

   function b2BuoyancyController() {
      b2BuoyancyController.b2BuoyancyController.apply(this, arguments);
   };
   Box2D.Dynamics.Controllers.b2BuoyancyController = b2BuoyancyController;

   function b2ConstantAccelController() {
      b2ConstantAccelController.b2ConstantAccelController.apply(this, arguments);
   };
   Box2D.Dynamics.Controllers.b2ConstantAccelController = b2ConstantAccelController;

   function b2ConstantForceController() {
      b2ConstantForceController.b2ConstantForceController.apply(this, arguments);
   };
   Box2D.Dynamics.Controllers.b2ConstantForceController = b2ConstantForceController;

   function b2Controller() {
      b2Controller.b2Controller.apply(this, arguments);
   };
   Box2D.Dynamics.Controllers.b2Controller = b2Controller;

   function b2ControllerEdge() {
      b2ControllerEdge.b2ControllerEdge.apply(this, arguments);
   };
   Box2D.Dynamics.Controllers.b2ControllerEdge = b2ControllerEdge;

   function b2GravityController() {
      b2GravityController.b2GravityController.apply(this, arguments);
   };
   Box2D.Dynamics.Controllers.b2GravityController = b2GravityController;

   function b2TensorDampingController() {
      b2TensorDampingController.b2TensorDampingController.apply(this, arguments);
   };
   Box2D.Dynamics.Controllers.b2TensorDampingController = b2TensorDampingController;

   function b2DistanceJoint() {
      b2DistanceJoint.b2DistanceJoint.apply(this, arguments);
      if (this.constructor === b2DistanceJoint) this.b2DistanceJoint.apply(this, arguments);
   };
   Box2D.Dynamics.Joints.b2DistanceJoint = b2DistanceJoint;

   function b2DistanceJointDef() {
      b2DistanceJointDef.b2DistanceJointDef.apply(this, arguments);
      if (this.constructor === b2DistanceJointDef) this.b2DistanceJointDef.apply(this, arguments);
   };
   Box2D.Dynamics.Joints.b2DistanceJointDef = b2DistanceJointDef;

   function b2FrictionJoint() {
      b2FrictionJoint.b2FrictionJoint.apply(this, arguments);
      if (this.constructor === b2FrictionJoint) this.b2FrictionJoint.apply(this, arguments);
   };
   Box2D.Dynamics.Joints.b2FrictionJoint = b2FrictionJoint;

   function b2FrictionJointDef() {
      b2FrictionJointDef.b2FrictionJointDef.apply(this, arguments);
      if (this.constructor === b2FrictionJointDef) this.b2FrictionJointDef.apply(this, arguments);
   };
   Box2D.Dynamics.Joints.b2FrictionJointDef = b2FrictionJointDef;

   function b2GearJoint() {
      b2GearJoint.b2GearJoint.apply(this, arguments);
      if (this.constructor === b2GearJoint) this.b2GearJoint.apply(this, arguments);
   };
   Box2D.Dynamics.Joints.b2GearJoint = b2GearJoint;

   function b2GearJointDef() {
      b2GearJointDef.b2GearJointDef.apply(this, arguments);
      if (this.constructor === b2GearJointDef) this.b2GearJointDef.apply(this, arguments);
   };
   Box2D.Dynamics.Joints.b2GearJointDef = b2GearJointDef;

   function b2Jacobian() {
      b2Jacobian.b2Jacobian.apply(this, arguments);
   };
   Box2D.Dynamics.Joints.b2Jacobian = b2Jacobian;

   function b2Joint() {
      b2Joint.b2Joint.apply(this, arguments);
      if (this.constructor === b2Joint) this.b2Joint.apply(this, arguments);
   };
   Box2D.Dynamics.Joints.b2Joint = b2Joint;

   function b2JointDef() {
      b2JointDef.b2JointDef.apply(this, arguments);
      if (this.constructor === b2JointDef) this.b2JointDef.apply(this, arguments);
   };
   Box2D.Dynamics.Joints.b2JointDef = b2JointDef;

   function b2JointEdge() {
      b2JointEdge.b2JointEdge.apply(this, arguments);
   };
   Box2D.Dynamics.Joints.b2JointEdge = b2JointEdge;

   function b2LineJoint() {
      b2LineJoint.b2LineJoint.apply(this, arguments);
      if (this.constructor === b2LineJoint) this.b2LineJoint.apply(this, arguments);
   };
   Box2D.Dynamics.Joints.b2LineJoint = b2LineJoint;

   function b2LineJointDef() {
      b2LineJointDef.b2LineJointDef.apply(this, arguments);
      if (this.constructor === b2LineJointDef) this.b2LineJointDef.apply(this, arguments);
   };
   Box2D.Dynamics.Joints.b2LineJointDef = b2LineJointDef;

   function b2MouseJoint() {
      b2MouseJoint.b2MouseJoint.apply(this, arguments);
      if (this.constructor === b2MouseJoint) this.b2MouseJoint.apply(this, arguments);
   };
   Box2D.Dynamics.Joints.b2MouseJoint = b2MouseJoint;

   function b2MouseJointDef() {
      b2MouseJointDef.b2MouseJointDef.apply(this, arguments);
      if (this.constructor === b2MouseJointDef) this.b2MouseJointDef.apply(this, arguments);
   };
   Box2D.Dynamics.Joints.b2MouseJointDef = b2MouseJointDef;

   function b2PrismaticJoint() {
      b2PrismaticJoint.b2PrismaticJoint.apply(this, arguments);
      if (this.constructor === b2PrismaticJoint) this.b2PrismaticJoint.apply(this, arguments);
   };
   Box2D.Dynamics.Joints.b2PrismaticJoint = b2PrismaticJoint;

   function b2PrismaticJointDef() {
      b2PrismaticJointDef.b2PrismaticJointDef.apply(this, arguments);
      if (this.constructor === b2PrismaticJointDef) this.b2PrismaticJointDef.apply(this, arguments);
   };
   Box2D.Dynamics.Joints.b2PrismaticJointDef = b2PrismaticJointDef;

   function b2PulleyJoint() {
      b2PulleyJoint.b2PulleyJoint.apply(this, arguments);
      if (this.constructor === b2PulleyJoint) this.b2PulleyJoint.apply(this, arguments);
   };
   Box2D.Dynamics.Joints.b2PulleyJoint = b2PulleyJoint;

   function b2PulleyJointDef() {
      b2PulleyJointDef.b2PulleyJointDef.apply(this, arguments);
      if (this.constructor === b2PulleyJointDef) this.b2PulleyJointDef.apply(this, arguments);
   };
   Box2D.Dynamics.Joints.b2PulleyJointDef = b2PulleyJointDef;

   function b2RevoluteJoint() {
      b2RevoluteJoint.b2RevoluteJoint.apply(this, arguments);
      if (this.constructor === b2RevoluteJoint) this.b2RevoluteJoint.apply(this, arguments);
   };
   Box2D.Dynamics.Joints.b2RevoluteJoint = b2RevoluteJoint;

   function b2RevoluteJointDef() {
      b2RevoluteJointDef.b2RevoluteJointDef.apply(this, arguments);
      if (this.constructor === b2RevoluteJointDef) this.b2RevoluteJointDef.apply(this, arguments);
   };
   Box2D.Dynamics.Joints.b2RevoluteJointDef = b2RevoluteJointDef;

   function b2WeldJoint() {
      b2WeldJoint.b2WeldJoint.apply(this, arguments);
      if (this.constructor === b2WeldJoint) this.b2WeldJoint.apply(this, arguments);
   };
   Box2D.Dynamics.Joints.b2WeldJoint = b2WeldJoint;

   function b2WeldJointDef() {
      b2WeldJointDef.b2WeldJointDef.apply(this, arguments);
      if (this.constructor === b2WeldJointDef) this.b2WeldJointDef.apply(this, arguments);
   };
   Box2D.Dynamics.Joints.b2WeldJointDef = b2WeldJointDef;
})(); //definitions
Box2D.postDefs = [];
(function () {
   var b2CircleShape = Box2D.Collision.Shapes.b2CircleShape,
      b2EdgeChainDef = Box2D.Collision.Shapes.b2EdgeChainDef,
      b2EdgeShape = Box2D.Collision.Shapes.b2EdgeShape,
      b2MassData = Box2D.Collision.Shapes.b2MassData,
      b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape,
      b2Shape = Box2D.Collision.Shapes.b2Shape,
      b2Color = Box2D.Common.b2Color,
      b2internal = Box2D.Common.b2internal,
      b2Settings = Box2D.Common.b2Settings,
      b2Mat22 = Box2D.Common.Math.b2Mat22,
      b2Mat33 = Box2D.Common.Math.b2Mat33,
      b2Math = Box2D.Common.Math.b2Math,
      b2Sweep = Box2D.Common.Math.b2Sweep,
      b2Transform = Box2D.Common.Math.b2Transform,
      b2Vec2 = Box2D.Common.Math.b2Vec2,
      b2Vec3 = Box2D.Common.Math.b2Vec3,
      b2AABB = Box2D.Collision.b2AABB,
      b2Bound = Box2D.Collision.b2Bound,
      b2BoundValues = Box2D.Collision.b2BoundValues,
      b2Collision = Box2D.Collision.b2Collision,
      b2ContactID = Box2D.Collision.b2ContactID,
      b2ContactPoint = Box2D.Collision.b2ContactPoint,
      b2Distance = Box2D.Collision.b2Distance,
      b2DistanceInput = Box2D.Collision.b2DistanceInput,
      b2DistanceOutput = Box2D.Collision.b2DistanceOutput,
      b2DistanceProxy = Box2D.Collision.b2DistanceProxy,
      b2DynamicTree = Box2D.Collision.b2DynamicTree,
      b2DynamicTreeBroadPhase = Box2D.Collision.b2DynamicTreeBroadPhase,
      b2DynamicTreeNode = Box2D.Collision.b2DynamicTreeNode,
      b2DynamicTreePair = Box2D.Collision.b2DynamicTreePair,
      b2Manifold = Box2D.Collision.b2Manifold,
      b2ManifoldPoint = Box2D.Collision.b2ManifoldPoint,
      b2Point = Box2D.Collision.b2Point,
      b2RayCastInput = Box2D.Collision.b2RayCastInput,
      b2RayCastOutput = Box2D.Collision.b2RayCastOutput,
      b2Segment = Box2D.Collision.b2Segment,
      b2SeparationFunction = Box2D.Collision.b2SeparationFunction,
      b2Simplex = Box2D.Collision.b2Simplex,
      b2SimplexCache = Box2D.Collision.b2SimplexCache,
      b2SimplexVertex = Box2D.Collision.b2SimplexVertex,
      b2TimeOfImpact = Box2D.Collision.b2TimeOfImpact,
      b2TOIInput = Box2D.Collision.b2TOIInput,
      b2WorldManifold = Box2D.Collision.b2WorldManifold,
      ClipVertex = Box2D.Collision.ClipVertex,
      Features = Box2D.Collision.Features,
      IBroadPhase = Box2D.Collision.IBroadPhase;

   b2AABB.b2AABB = function () {
      this.lowerBound = new b2Vec2();
      this.upperBound = new b2Vec2();
   };
   b2AABB.prototype.IsValid = function () {
      var dX = this.upperBound.x - this.lowerBound.x;
      var dY = this.upperBound.y - this.lowerBound.y;
      var valid = dX >= 0.0 && dY >= 0.0;
      valid = valid && this.lowerBound.IsValid() && this.upperBound.IsValid();
      return valid;
   }
   b2AABB.prototype.GetCenter = function () {
      return new b2Vec2((this.lowerBound.x + this.upperBound.x) / 2, (this.lowerBound.y + this.upperBound.y) / 2);
   }
   b2AABB.prototype.GetExtents = function () {
      return new b2Vec2((this.upperBound.x - this.lowerBound.x) / 2, (this.upperBound.y - this.lowerBound.y) / 2);
   }
   b2AABB.prototype.Contains = function (aabb) {
      var result = true;
      result = result && this.lowerBound.x <= aabb.lowerBound.x;
      result = result && this.lowerBound.y <= aabb.lowerBound.y;
      result = result && aabb.upperBound.x <= this.upperBound.x;
      result = result && aabb.upperBound.y <= this.upperBound.y;
      return result;
   }
   b2AABB.prototype.RayCast = function (output, input) {
      var tmin = (-Number.MAX_VALUE);
      var tmax = Number.MAX_VALUE;
      var pX = input.p1.x;
      var pY = input.p1.y;
      var dX = input.p2.x - input.p1.x;
      var dY = input.p2.y - input.p1.y;
      var absDX = Math.abs(dX);
      var absDY = Math.abs(dY);
      var normal = output.normal;
      var inv_d = 0;
      var t1 = 0;
      var t2 = 0;
      var t3 = 0;
      var s = 0; {
         if (absDX < Number.MIN_VALUE) {
            if (pX < this.lowerBound.x || this.upperBound.x < pX) return false;
         }
         else {
            inv_d = 1.0 / dX;
            t1 = (this.lowerBound.x - pX) * inv_d;
            t2 = (this.upperBound.x - pX) * inv_d;
            s = (-1.0);
            if (t1 > t2) {
               t3 = t1;
               t1 = t2;
               t2 = t3;
               s = 1.0;
            }
            if (t1 > tmin) {
               normal.x = s;
               normal.y = 0;
               tmin = t1;
            }
            tmax = Math.min(tmax, t2);
            if (tmin > tmax) return false;
         }
      } {
         if (absDY < Number.MIN_VALUE) {
            if (pY < this.lowerBound.y || this.upperBound.y < pY) return false;
         }
         else {
            inv_d = 1.0 / dY;
            t1 = (this.lowerBound.y - pY) * inv_d;
            t2 = (this.upperBound.y - pY) * inv_d;
            s = (-1.0);
            if (t1 > t2) {
               t3 = t1;
               t1 = t2;
               t2 = t3;
               s = 1.0;
            }
            if (t1 > tmin) {
               normal.y = s;
               normal.x = 0;
               tmin = t1;
            }
            tmax = Math.min(tmax, t2);
            if (tmin > tmax) return false;
         }
      }
      output.fraction = tmin;
      return true;
   }
   b2AABB.prototype.TestOverlap = function (other) {
      var d1X = other.lowerBound.x - this.upperBound.x;
      var d1Y = other.lowerBound.y - this.upperBound.y;
      var d2X = this.lowerBound.x - other.upperBound.x;
      var d2Y = this.lowerBound.y - other.upperBound.y;
      if (d1X > 0.0 || d1Y > 0.0) return false;
      if (d2X > 0.0 || d2Y > 0.0) return false;
      return true;
   }
   b2AABB.Combine = function (aabb1, aabb2) {
      var aabb = new b2AABB();
      aabb.Combine(aabb1, aabb2);
      return aabb;
   }
   b2AABB.prototype.Combine = function (aabb1, aabb2) {
      this.lowerBound.x = Math.min(aabb1.lowerBound.x, aabb2.lowerBound.x);
      this.lowerBound.y = Math.min(aabb1.lowerBound.y, aabb2.lowerBound.y);
      this.upperBound.x = Math.max(aabb1.upperBound.x, aabb2.upperBound.x);
      this.upperBound.y = Math.max(aabb1.upperBound.y, aabb2.upperBound.y);
   }
   b2Bound.b2Bound = function () {};
   b2Bound.prototype.IsLower = function () {
      return (this.value & 1) == 0;
   }
   b2Bound.prototype.IsUpper = function () {
      return (this.value & 1) == 1;
   }
   b2Bound.prototype.Swap = function (b) {
      var tempValue = this.value;
      var tempProxy = this.proxy;
      var tempStabbingCount = this.stabbingCount;
      this.value = b.value;
      this.proxy = b.proxy;
      this.stabbingCount = b.stabbingCount;
      b.value = tempValue;
      b.proxy = tempProxy;
      b.stabbingCount = tempStabbingCount;
   }
   b2BoundValues.b2BoundValues = function () {};
   b2BoundValues.prototype.b2BoundValues = function () {
      this.lowerValues = new Vector_a2j_Number();
      this.lowerValues[0] = 0.0;
      this.lowerValues[1] = 0.0;
      this.upperValues = new Vector_a2j_Number();
      this.upperValues[0] = 0.0;
      this.upperValues[1] = 0.0;
   }
   b2Collision.b2Collision = function () {};
   b2Collision.ClipSegmentToLine = function (vOut, vIn, normal, offset) {
      if (offset === undefined) offset = 0;
      var cv;
      var numOut = 0;
      cv = vIn[0];
      var vIn0 = cv.v;
      cv = vIn[1];
      var vIn1 = cv.v;
      var distance0 = normal.x * vIn0.x + normal.y * vIn0.y - offset;
      var distance1 = normal.x * vIn1.x + normal.y * vIn1.y - offset;
      if (distance0 <= 0.0) vOut[numOut++].Set(vIn[0]);
      if (distance1 <= 0.0) vOut[numOut++].Set(vIn[1]);
      if (distance0 * distance1 < 0.0) {
         var interp = distance0 / (distance0 - distance1);
         cv = vOut[numOut];
         var tVec = cv.v;
         tVec.x = vIn0.x + interp * (vIn1.x - vIn0.x);
         tVec.y = vIn0.y + interp * (vIn1.y - vIn0.y);
         cv = vOut[numOut];
         var cv2;
         if (distance0 > 0.0) {
            cv2 = vIn[0];
            cv.id = cv2.id;
         }
         else {
            cv2 = vIn[1];
            cv.id = cv2.id;
         }++numOut;
      }
      return numOut;
   }
   b2Collision.EdgeSeparation = function (poly1, xf1, edge1, poly2, xf2) {
      if (edge1 === undefined) edge1 = 0;
      var count1 = parseInt(poly1.m_vertexCount);
      var vertices1 = poly1.m_vertices;
      var normals1 = poly1.m_normals;
      var count2 = parseInt(poly2.m_vertexCount);
      var vertices2 = poly2.m_vertices;
      var tMat;
      var tVec;
      tMat = xf1.R;
      tVec = normals1[edge1];
      var normal1WorldX = (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
      var normal1WorldY = (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
      tMat = xf2.R;
      var normal1X = (tMat.col1.x * normal1WorldX + tMat.col1.y * normal1WorldY);
      var normal1Y = (tMat.col2.x * normal1WorldX + tMat.col2.y * normal1WorldY);
      var index = 0;
      var minDot = Number.MAX_VALUE;
      for (var i = 0; i < count2; ++i) {
         tVec = vertices2[i];
         var dot = tVec.x * normal1X + tVec.y * normal1Y;
         if (dot < minDot) {
            minDot = dot;
            index = i;
         }
      }
      tVec = vertices1[edge1];
      tMat = xf1.R;
      var v1X = xf1.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
      var v1Y = xf1.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
      tVec = vertices2[index];
      tMat = xf2.R;
      var v2X = xf2.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
      var v2Y = xf2.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
      v2X -= v1X;
      v2Y -= v1Y;
      var separation = v2X * normal1WorldX + v2Y * normal1WorldY;
      return separation;
   }
   b2Collision.FindMaxSeparation = function (edgeIndex, poly1, xf1, poly2, xf2) {
      var count1 = parseInt(poly1.m_vertexCount);
      var normals1 = poly1.m_normals;
      var tVec;
      var tMat;
      tMat = xf2.R;
      tVec = poly2.m_centroid;
      var dX = xf2.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
      var dY = xf2.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
      tMat = xf1.R;
      tVec = poly1.m_centroid;
      dX -= xf1.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
      dY -= xf1.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
      var dLocal1X = (dX * xf1.R.col1.x + dY * xf1.R.col1.y);
      var dLocal1Y = (dX * xf1.R.col2.x + dY * xf1.R.col2.y);
      var edge = 0;
      var maxDot = (-Number.MAX_VALUE);
      for (var i = 0; i < count1; ++i) {
         tVec = normals1[i];
         var dot = (tVec.x * dLocal1X + tVec.y * dLocal1Y);
         if (dot > maxDot) {
            maxDot = dot;
            edge = i;
         }
      }
      var s = b2Collision.EdgeSeparation(poly1, xf1, edge, poly2, xf2);
      var prevEdge = parseInt(edge - 1 >= 0 ? edge - 1 : count1 - 1);
      var sPrev = b2Collision.EdgeSeparation(poly1, xf1, prevEdge, poly2, xf2);
      var nextEdge = parseInt(edge + 1 < count1 ? edge + 1 : 0);
      var sNext = b2Collision.EdgeSeparation(poly1, xf1, nextEdge, poly2, xf2);
      var bestEdge = 0;
      var bestSeparation = 0;
      var increment = 0;
      if (sPrev > s && sPrev > sNext) {
         increment = (-1);
         bestEdge = prevEdge;
         bestSeparation = sPrev;
      }
      else if (sNext > s) {
         increment = 1;
         bestEdge = nextEdge;
         bestSeparation = sNext;
      }
      else {
         edgeIndex[0] = edge;
         return s;
      }
      while (true) {
         if (increment == (-1)) edge = bestEdge - 1 >= 0 ? bestEdge - 1 : count1 - 1;
         else edge = bestEdge + 1 < count1 ? bestEdge + 1 : 0;s = b2Collision.EdgeSeparation(poly1, xf1, edge, poly2, xf2);
         if (s > bestSeparation) {
            bestEdge = edge;
            bestSeparation = s;
         }
         else {
            break;
         }
      }
      edgeIndex[0] = bestEdge;
      return bestSeparation;
   }
   b2Collision.FindIncidentEdge = function (c, poly1, xf1, edge1, poly2, xf2) {
      if (edge1 === undefined) edge1 = 0;
      var count1 = parseInt(poly1.m_vertexCount);
      var normals1 = poly1.m_normals;
      var count2 = parseInt(poly2.m_vertexCount);
      var vertices2 = poly2.m_vertices;
      var normals2 = poly2.m_normals;
      var tMat;
      var tVec;
      tMat = xf1.R;
      tVec = normals1[edge1];
      var normal1X = (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
      var normal1Y = (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
      tMat = xf2.R;
      var tX = (tMat.col1.x * normal1X + tMat.col1.y * normal1Y);
      normal1Y = (tMat.col2.x * normal1X + tMat.col2.y * normal1Y);
      normal1X = tX;
      var index = 0;
      var minDot = Number.MAX_VALUE;
      for (var i = 0; i < count2; ++i) {
         tVec = normals2[i];
         var dot = (normal1X * tVec.x + normal1Y * tVec.y);
         if (dot < minDot) {
            minDot = dot;
            index = i;
         }
      }
      var tClip;
      var i1 = parseInt(index);
      var i2 = parseInt(i1 + 1 < count2 ? i1 + 1 : 0);
      tClip = c[0];
      tVec = vertices2[i1];
      tMat = xf2.R;
      tClip.v.x = xf2.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
      tClip.v.y = xf2.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
      tClip.id.features.referenceEdge = edge1;
      tClip.id.features.incidentEdge = i1;
      tClip.id.features.incidentVertex = 0;
      tClip = c[1];
      tVec = vertices2[i2];
      tMat = xf2.R;
      tClip.v.x = xf2.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
      tClip.v.y = xf2.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
      tClip.id.features.referenceEdge = edge1;
      tClip.id.features.incidentEdge = i2;
      tClip.id.features.incidentVertex = 1;
   }
   b2Collision.MakeClipPointVector = function () {
      var r = new Vector(2);
      r[0] = new ClipVertex();
      r[1] = new ClipVertex();
      return r;
   }
   b2Collision.CollidePolygons = function (manifold, polyA, xfA, polyB, xfB) {
      var cv;
      manifold.m_pointCount = 0;
      var totalRadius = polyA.m_radius + polyB.m_radius;
      var edgeA = 0;
      b2Collision.s_edgeAO[0] = edgeA;
      var separationA = b2Collision.FindMaxSeparation(b2Collision.s_edgeAO, polyA, xfA, polyB, xfB);
      edgeA = b2Collision.s_edgeAO[0];
      if (separationA > totalRadius) return;
      var edgeB = 0;
      b2Collision.s_edgeBO[0] = edgeB;
      var separationB = b2Collision.FindMaxSeparation(b2Collision.s_edgeBO, polyB, xfB, polyA, xfA);
      edgeB = b2Collision.s_edgeBO[0];
      if (separationB > totalRadius) return;
      var poly1;
      var poly2;
      var xf1;
      var xf2;
      var edge1 = 0;
      var flip = 0;
      var k_relativeTol = 0.98;
      var k_absoluteTol = 0.001;
      var tMat;
      if (separationB > k_relativeTol * separationA + k_absoluteTol) {
         poly1 = polyB;
         poly2 = polyA;
         xf1 = xfB;
         xf2 = xfA;
         edge1 = edgeB;
         manifold.m_type = b2Manifold.e_faceB;
         flip = 1;
      }
      else {
         poly1 = polyA;
         poly2 = polyB;
         xf1 = xfA;
         xf2 = xfB;
         edge1 = edgeA;
         manifold.m_type = b2Manifold.e_faceA;
         flip = 0;
      }
      var incidentEdge = b2Collision.s_incidentEdge;
      b2Collision.FindIncidentEdge(incidentEdge, poly1, xf1, edge1, poly2, xf2);
      var count1 = parseInt(poly1.m_vertexCount);
      var vertices1 = poly1.m_vertices;
      var local_v11 = vertices1[edge1];
      var local_v12;
      if (edge1 + 1 < count1) {
         local_v12 = vertices1[parseInt(edge1 + 1)];
      }
      else {
         local_v12 = vertices1[0];
      }
      var localTangent = b2Collision.s_localTangent;
      localTangent.Set(local_v12.x - local_v11.x, local_v12.y - local_v11.y);
      localTangent.Normalize();
      var localNormal = b2Collision.s_localNormal;
      localNormal.x = localTangent.y;
      localNormal.y = (-localTangent.x);
      var planePoint = b2Collision.s_planePoint;
      planePoint.Set(0.5 * (local_v11.x + local_v12.x), 0.5 * (local_v11.y + local_v12.y));
      var tangent = b2Collision.s_tangent;
      tMat = xf1.R;
      tangent.x = (tMat.col1.x * localTangent.x + tMat.col2.x * localTangent.y);
      tangent.y = (tMat.col1.y * localTangent.x + tMat.col2.y * localTangent.y);
      var tangent2 = b2Collision.s_tangent2;
      tangent2.x = (-tangent.x);
      tangent2.y = (-tangent.y);
      var normal = b2Collision.s_normal;
      normal.x = tangent.y;
      normal.y = (-tangent.x);
      var v11 = b2Collision.s_v11;
      var v12 = b2Collision.s_v12;
      v11.x = xf1.position.x + (tMat.col1.x * local_v11.x + tMat.col2.x * local_v11.y);
      v11.y = xf1.position.y + (tMat.col1.y * local_v11.x + tMat.col2.y * local_v11.y);
      v12.x = xf1.position.x + (tMat.col1.x * local_v12.x + tMat.col2.x * local_v12.y);
      v12.y = xf1.position.y + (tMat.col1.y * local_v12.x + tMat.col2.y * local_v12.y);
      var frontOffset = normal.x * v11.x + normal.y * v11.y;
      var sideOffset1 = (-tangent.x * v11.x) - tangent.y * v11.y + totalRadius;
      var sideOffset2 = tangent.x * v12.x + tangent.y * v12.y + totalRadius;
      var clipPoints1 = b2Collision.s_clipPoints1;
      var clipPoints2 = b2Collision.s_clipPoints2;
      var np = 0;
      np = b2Collision.ClipSegmentToLine(clipPoints1, incidentEdge, tangent2, sideOffset1);
      if (np < 2) return;
      np = b2Collision.ClipSegmentToLine(clipPoints2, clipPoints1, tangent, sideOffset2);
      if (np < 2) return;
      manifold.m_localPlaneNormal.SetV(localNormal);
      manifold.m_localPoint.SetV(planePoint);
      var pointCount = 0;
      for (var i = 0; i < b2Settings.b2_maxManifoldPoints; ++i) {
         cv = clipPoints2[i];
         var separation = normal.x * cv.v.x + normal.y * cv.v.y - frontOffset;
         if (separation <= totalRadius) {
            var cp = manifold.m_points[pointCount];
            tMat = xf2.R;
            var tX = cv.v.x - xf2.position.x;
            var tY = cv.v.y - xf2.position.y;
            cp.m_localPoint.x = (tX * tMat.col1.x + tY * tMat.col1.y);
            cp.m_localPoint.y = (tX * tMat.col2.x + tY * tMat.col2.y);
            cp.m_id.Set(cv.id);
            cp.m_id.features.flip = flip;
            ++pointCount;
         }
      }
      manifold.m_pointCount = pointCount;
   }
   b2Collision.CollideCircles = function (manifold, circle1, xf1, circle2, xf2) {
      manifold.m_pointCount = 0;
      var tMat;
      var tVec;
      tMat = xf1.R;
      tVec = circle1.m_p;
      var p1X = xf1.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
      var p1Y = xf1.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
      tMat = xf2.R;
      tVec = circle2.m_p;
      var p2X = xf2.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
      var p2Y = xf2.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
      var dX = p2X - p1X;
      var dY = p2Y - p1Y;
      var distSqr = dX * dX + dY * dY;
      var radius = circle1.m_radius + circle2.m_radius;
      if (distSqr > radius * radius) {
         return;
      }
      manifold.m_type = b2Manifold.e_circles;
      manifold.m_localPoint.SetV(circle1.m_p);
      manifold.m_localPlaneNormal.SetZero();
      manifold.m_pointCount = 1;
      manifold.m_points[0].m_localPoint.SetV(circle2.m_p);
      manifold.m_points[0].m_id.key = 0;
   }
   b2Collision.CollidePolygonAndCircle = function (manifold, polygon, xf1, circle, xf2) {
      manifold.m_pointCount = 0;
      var tPoint;
      var dX = 0;
      var dY = 0;
      var positionX = 0;
      var positionY = 0;
      var tVec;
      var tMat;
      tMat = xf2.R;
      tVec = circle.m_p;
      var cX = xf2.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
      var cY = xf2.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
      dX = cX - xf1.position.x;
      dY = cY - xf1.position.y;
      tMat = xf1.R;
      var cLocalX = (dX * tMat.col1.x + dY * tMat.col1.y);
      var cLocalY = (dX * tMat.col2.x + dY * tMat.col2.y);
      var dist = 0;
      var normalIndex = 0;
      var separation = (-Number.MAX_VALUE);
      var radius = polygon.m_radius + circle.m_radius;
      var vertexCount = parseInt(polygon.m_vertexCount);
      var vertices = polygon.m_vertices;
      var normals = polygon.m_normals;
      for (var i = 0; i < vertexCount; ++i) {
         tVec = vertices[i];
         dX = cLocalX - tVec.x;
         dY = cLocalY - tVec.y;
         tVec = normals[i];
         var s = tVec.x * dX + tVec.y * dY;
         if (s > radius) {
            return;
         }
         if (s > separation) {
            separation = s;
            normalIndex = i;
         }
      }
      var vertIndex1 = parseInt(normalIndex);
      var vertIndex2 = parseInt(vertIndex1 + 1 < vertexCount ? vertIndex1 + 1 : 0);
      var v1 = vertices[vertIndex1];
      var v2 = vertices[vertIndex2];
      if (separation < Number.MIN_VALUE) {
         manifold.m_pointCount = 1;
         manifold.m_type = b2Manifold.e_faceA;
         manifold.m_localPlaneNormal.SetV(normals[normalIndex]);
         manifold.m_localPoint.x = 0.5 * (v1.x + v2.x);
         manifold.m_localPoint.y = 0.5 * (v1.y + v2.y);
         manifold.m_points[0].m_localPoint.SetV(circle.m_p);
         manifold.m_points[0].m_id.key = 0;
         return;
      }
      var u1 = (cLocalX - v1.x) * (v2.x - v1.x) + (cLocalY - v1.y) * (v2.y - v1.y);
      var u2 = (cLocalX - v2.x) * (v1.x - v2.x) + (cLocalY - v2.y) * (v1.y - v2.y);
      if (u1 <= 0.0) {
         if ((cLocalX - v1.x) * (cLocalX - v1.x) + (cLocalY - v1.y) * (cLocalY - v1.y) > radius * radius) return;
         manifold.m_pointCount = 1;
         manifold.m_type = b2Manifold.e_faceA;
         manifold.m_localPlaneNormal.x = cLocalX - v1.x;
         manifold.m_localPlaneNormal.y = cLocalY - v1.y;
         manifold.m_localPlaneNormal.Normalize();
         manifold.m_localPoint.SetV(v1);
         manifold.m_points[0].m_localPoint.SetV(circle.m_p);
         manifold.m_points[0].m_id.key = 0;
      }
      else if (u2 <= 0) {
         if ((cLocalX - v2.x) * (cLocalX - v2.x) + (cLocalY - v2.y) * (cLocalY - v2.y) > radius * radius) return;
         manifold.m_pointCount = 1;
         manifold.m_type = b2Manifold.e_faceA;
         manifold.m_localPlaneNormal.x = cLocalX - v2.x;
         manifold.m_localPlaneNormal.y = cLocalY - v2.y;
         manifold.m_localPlaneNormal.Normalize();
         manifold.m_localPoint.SetV(v2);
         manifold.m_points[0].m_localPoint.SetV(circle.m_p);
         manifold.m_points[0].m_id.key = 0;
      }
      else {
         var faceCenterX = 0.5 * (v1.x + v2.x);
         var faceCenterY = 0.5 * (v1.y + v2.y);
         separation = (cLocalX - faceCenterX) * normals[vertIndex1].x + (cLocalY - faceCenterY) * normals[vertIndex1].y;
         if (separation > radius) return;
         manifold.m_pointCount = 1;
         manifold.m_type = b2Manifold.e_faceA;
         manifold.m_localPlaneNormal.x = normals[vertIndex1].x;
         manifold.m_localPlaneNormal.y = normals[vertIndex1].y;
         manifold.m_localPlaneNormal.Normalize();
         manifold.m_localPoint.Set(faceCenterX, faceCenterY);
         manifold.m_points[0].m_localPoint.SetV(circle.m_p);
         manifold.m_points[0].m_id.key = 0;
      }
   }
   b2Collision.TestOverlap = function (a, b) {
      var t1 = b.lowerBound;
      var t2 = a.upperBound;
      var d1X = t1.x - t2.x;
      var d1Y = t1.y - t2.y;
      t1 = a.lowerBound;
      t2 = b.upperBound;
      var d2X = t1.x - t2.x;
      var d2Y = t1.y - t2.y;
      if (d1X > 0.0 || d1Y > 0.0) return false;
      if (d2X > 0.0 || d2Y > 0.0) return false;
      return true;
   }
   Box2D.postDefs.push(function () {
      Box2D.Collision.b2Collision.s_incidentEdge = b2Collision.MakeClipPointVector();
      Box2D.Collision.b2Collision.s_clipPoints1 = b2Collision.MakeClipPointVector();
      Box2D.Collision.b2Collision.s_clipPoints2 = b2Collision.MakeClipPointVector();
      Box2D.Collision.b2Collision.s_edgeAO = new Vector_a2j_Number(1);
      Box2D.Collision.b2Collision.s_edgeBO = new Vector_a2j_Number(1);
      Box2D.Collision.b2Collision.s_localTangent = new b2Vec2();
      Box2D.Collision.b2Collision.s_localNormal = new b2Vec2();
      Box2D.Collision.b2Collision.s_planePoint = new b2Vec2();
      Box2D.Collision.b2Collision.s_normal = new b2Vec2();
      Box2D.Collision.b2Collision.s_tangent = new b2Vec2();
      Box2D.Collision.b2Collision.s_tangent2 = new b2Vec2();
      Box2D.Collision.b2Collision.s_v11 = new b2Vec2();
      Box2D.Collision.b2Collision.s_v12 = new b2Vec2();
      Box2D.Collision.b2Collision.b2CollidePolyTempVec = new b2Vec2();
      Box2D.Collision.b2Collision.b2_nullFeature = 0x000000ff;
   });
   b2ContactID.b2ContactID = function () {
      this.features = new Features();
   };
   b2ContactID.prototype.b2ContactID = function () {
      this.features._m_id = this;
   }
   b2ContactID.prototype.Set = function (id) {
      this.key = id._key;
   }
   b2ContactID.prototype.Copy = function () {
      var id = new b2ContactID();
      id.key = this.key;
      return id;
   }
   Object.defineProperty(b2ContactID.prototype, 'key', {
      enumerable: false,
      configurable: true,
      get: function () {
         return this._key;
      }
   });
   Object.defineProperty(b2ContactID.prototype, 'key', {
      enumerable: false,
      configurable: true,
      set: function (value) {
         if (value === undefined) value = 0;
         this._key = value;
         this.features._referenceEdge = this._key & 0x000000ff;
         this.features._incidentEdge = ((this._key & 0x0000ff00) >> 8) & 0x000000ff;
         this.features._incidentVertex = ((this._key & 0x00ff0000) >> 16) & 0x000000ff;
         this.features._flip = ((this._key & 0xff000000) >> 24) & 0x000000ff;
      }
   });
   b2ContactPoint.b2ContactPoint = function () {
      this.position = new b2Vec2();
      this.velocity = new b2Vec2();
      this.normal = new b2Vec2();
      this.id = new b2ContactID();
   };
   b2Distance.b2Distance = function () {};
   b2Distance.Distance = function (output, cache, input) {
      ++b2Distance.b2_gjkCalls;
      var proxyA = input.proxyA;
      var proxyB = input.proxyB;
      var transformA = input.transformA;
      var transformB = input.transformB;
      var simplex = b2Distance.s_simplex;
      simplex.ReadCache(cache, proxyA, transformA, proxyB, transformB);
      var vertices = simplex.m_vertices;
      var k_maxIters = 20;
      var saveA = b2Distance.s_saveA;
      var saveB = b2Distance.s_saveB;
      var saveCount = 0;
      var closestPoint = simplex.GetClosestPoint();
      var distanceSqr1 = closestPoint.LengthSquared();
      var distanceSqr2 = distanceSqr1;
      var i = 0;
      var p;
      var iter = 0;
      while (iter < k_maxIters) {
         saveCount = simplex.m_count;
         for (i = 0;
         i < saveCount; i++) {
            saveA[i] = vertices[i].indexA;
            saveB[i] = vertices[i].indexB;
         }
         switch (simplex.m_count) {
         case 1:
            break;
         case 2:
            simplex.Solve2();
            break;
         case 3:
            simplex.Solve3();
            break;
         default:
            b2Settings.b2Assert(false);
         }
         if (simplex.m_count == 3) {
            break;
         }
         p = simplex.GetClosestPoint();
         distanceSqr2 = p.LengthSquared();
         if (distanceSqr2 > distanceSqr1) {}
         distanceSqr1 = distanceSqr2;
         var d = simplex.GetSearchDirection();
         if (d.LengthSquared() < Number.MIN_VALUE * Number.MIN_VALUE) {
            break;
         }
         var vertex = vertices[simplex.m_count];
         vertex.indexA = proxyA.GetSupport(b2Math.MulTMV(transformA.R, d.GetNegative()));
         vertex.wA = b2Math.MulX(transformA, proxyA.GetVertex(vertex.indexA));
         vertex.indexB = proxyB.GetSupport(b2Math.MulTMV(transformB.R, d));
         vertex.wB = b2Math.MulX(transformB, proxyB.GetVertex(vertex.indexB));
         vertex.w = b2Math.SubtractVV(vertex.wB, vertex.wA);
         ++iter;
         ++b2Distance.b2_gjkIters;
         var duplicate = false;
         for (i = 0;
         i < saveCount; i++) {
            if (vertex.indexA == saveA[i] && vertex.indexB == saveB[i]) {
               duplicate = true;
               break;
            }
         }
         if (duplicate) {
            break;
         }++simplex.m_count;
      }
      b2Distance.b2_gjkMaxIters = b2Math.Max(b2Distance.b2_gjkMaxIters, iter);
      simplex.GetWitnessPoints(output.pointA, output.pointB);
      output.distance = b2Math.SubtractVV(output.pointA, output.pointB).Length();
      output.iterations = iter;
      simplex.WriteCache(cache);
      if (input.useRadii) {
         var rA = proxyA.m_radius;
         var rB = proxyB.m_radius;
         if (output.distance > rA + rB && output.distance > Number.MIN_VALUE) {
            output.distance -= rA + rB;
            var normal = b2Math.SubtractVV(output.pointB, output.pointA);
            normal.Normalize();
            output.pointA.x += rA * normal.x;
            output.pointA.y += rA * normal.y;
            output.pointB.x -= rB * normal.x;
            output.pointB.y -= rB * normal.y;
         }
         else {
            p = new b2Vec2();
            p.x = .5 * (output.pointA.x + output.pointB.x);
            p.y = .5 * (output.pointA.y + output.pointB.y);
            output.pointA.x = output.pointB.x = p.x;
            output.pointA.y = output.pointB.y = p.y;
            output.distance = 0.0;
         }
      }
   }
   Box2D.postDefs.push(function () {
      Box2D.Collision.b2Distance.s_simplex = new b2Simplex();
      Box2D.Collision.b2Distance.s_saveA = new Vector_a2j_Number(3);
      Box2D.Collision.b2Distance.s_saveB = new Vector_a2j_Number(3);
   });
   b2DistanceInput.b2DistanceInput = function () {};
   b2DistanceOutput.b2DistanceOutput = function () {
      this.pointA = new b2Vec2();
      this.pointB = new b2Vec2();
   };
   b2DistanceProxy.b2DistanceProxy = function () {};
   b2DistanceProxy.prototype.Set = function (shape) {
      switch (shape.GetType()) {
      case b2Shape.e_circleShape:
         {
            var circle = (shape instanceof b2CircleShape ? shape : null);
            this.m_vertices = new Vector(1, true);
            this.m_vertices[0] = circle.m_p;
            this.m_count = 1;
            this.m_radius = circle.m_radius;
         }
         break;
      case b2Shape.e_polygonShape:
         {
            var polygon = (shape instanceof b2PolygonShape ? shape : null);
            this.m_vertices = polygon.m_vertices;
            this.m_count = polygon.m_vertexCount;
            this.m_radius = polygon.m_radius;
         }
         break;
      default:
         b2Settings.b2Assert(false);
      }
   }
   b2DistanceProxy.prototype.GetSupport = function (d) {
      var bestIndex = 0;
      var bestValue = this.m_vertices[0].x * d.x + this.m_vertices[0].y * d.y;
      for (var i = 1; i < this.m_count; ++i) {
         var value = this.m_vertices[i].x * d.x + this.m_vertices[i].y * d.y;
         if (value > bestValue) {
            bestIndex = i;
            bestValue = value;
         }
      }
      return bestIndex;
   }
   b2DistanceProxy.prototype.GetSupportVertex = function (d) {
      var bestIndex = 0;
      var bestValue = this.m_vertices[0].x * d.x + this.m_vertices[0].y * d.y;
      for (var i = 1; i < this.m_count; ++i) {
         var value = this.m_vertices[i].x * d.x + this.m_vertices[i].y * d.y;
         if (value > bestValue) {
            bestIndex = i;
            bestValue = value;
         }
      }
      return this.m_vertices[bestIndex];
   }
   b2DistanceProxy.prototype.GetVertexCount = function () {
      return this.m_count;
   }
   b2DistanceProxy.prototype.GetVertex = function (index) {
      if (index === undefined) index = 0;
      b2Settings.b2Assert(0 <= index && index < this.m_count);
      return this.m_vertices[index];
   }
   b2DynamicTree.b2DynamicTree = function () {};
   b2DynamicTree.prototype.b2DynamicTree = function () {
      this.m_root = null;
      this.m_freeList = null;
      this.m_path = 0;
      this.m_insertionCount = 0;
   }
   b2DynamicTree.prototype.CreateProxy = function (aabb, userData) {
      var node = this.AllocateNode();
      var extendX = b2Settings.b2_aabbExtension;
      var extendY = b2Settings.b2_aabbExtension;
      node.aabb.lowerBound.x = aabb.lowerBound.x - extendX;
      node.aabb.lowerBound.y = aabb.lowerBound.y - extendY;
      node.aabb.upperBound.x = aabb.upperBound.x + extendX;
      node.aabb.upperBound.y = aabb.upperBound.y + extendY;
      node.userData = userData;
      this.InsertLeaf(node);
      return node;
   }
   b2DynamicTree.prototype.DestroyProxy = function (proxy) {
      this.RemoveLeaf(proxy);
      this.FreeNode(proxy);
   }
   b2DynamicTree.prototype.MoveProxy = function (proxy, aabb, displacement) {
      b2Settings.b2Assert(proxy.IsLeaf());
      if (proxy.aabb.Contains(aabb)) {
         return false;
      }
      this.RemoveLeaf(proxy);
      var extendX = b2Settings.b2_aabbExtension + b2Settings.b2_aabbMultiplier * (displacement.x > 0 ? displacement.x : (-displacement.x));
      var extendY = b2Settings.b2_aabbExtension + b2Settings.b2_aabbMultiplier * (displacement.y > 0 ? displacement.y : (-displacement.y));
      proxy.aabb.lowerBound.x = aabb.lowerBound.x - extendX;
      proxy.aabb.lowerBound.y = aabb.lowerBound.y - extendY;
      proxy.aabb.upperBound.x = aabb.upperBound.x + extendX;
      proxy.aabb.upperBound.y = aabb.upperBound.y + extendY;
      this.InsertLeaf(proxy);
      return true;
   }
   b2DynamicTree.prototype.Rebalance = function (iterations) {
      if (iterations === undefined) iterations = 0;
      if (this.m_root == null) return;
      for (var i = 0; i < iterations; i++) {
         var node = this.m_root;
         var bit = 0;
         while (node.IsLeaf() == false) {
            node = (this.m_path >> bit) & 1 ? node.child2 : node.child1;
            bit = (bit + 1) & 31;
         }++this.m_path;
         this.RemoveLeaf(node);
         this.InsertLeaf(node);
      }
   }
   b2DynamicTree.prototype.GetFatAABB = function (proxy) {
      return proxy.aabb;
   }
   b2DynamicTree.prototype.GetUserData = function (proxy) {
      return proxy.userData;
   }
   b2DynamicTree.prototype.Query = function (callback, aabb) {
      if (this.m_root == null) return;
      var stack = new Vector();
      var count = 0;
      stack[count++] = this.m_root;
      while (count > 0) {
         var node = stack[--count];
         if (node.aabb.TestOverlap(aabb)) {
            if (node.IsLeaf()) {
               var proceed = callback(node);
               if (!proceed) return;
            }
            else {
               stack[count++] = node.child1;
               stack[count++] = node.child2;
            }
         }
      }
   }
   b2DynamicTree.prototype.RayCast = function (callback, input) {
      if (this.m_root == null) return;
      var p1 = input.p1;
      var p2 = input.p2;
      var r = b2Math.SubtractVV(p1, p2);
      r.Normalize();
      var v = b2Math.CrossFV(1.0, r);
      var abs_v = b2Math.AbsV(v);
      var maxFraction = input.maxFraction;
      var segmentAABB = new b2AABB();
      var tX = 0;
      var tY = 0; {
         tX = p1.x + maxFraction * (p2.x - p1.x);
         tY = p1.y + maxFraction * (p2.y - p1.y);
         segmentAABB.lowerBound.x = Math.min(p1.x, tX);
         segmentAABB.lowerBound.y = Math.min(p1.y, tY);
         segmentAABB.upperBound.x = Math.max(p1.x, tX);
         segmentAABB.upperBound.y = Math.max(p1.y, tY);
      }
      var stack = new Vector();
      var count = 0;
      stack[count++] = this.m_root;
      while (count > 0) {
         var node = stack[--count];
         if (node.aabb.TestOverlap(segmentAABB) == false) {
            continue;
         }
         var c = node.aabb.GetCenter();
         var h = node.aabb.GetExtents();
         var separation = Math.abs(v.x * (p1.x - c.x) + v.y * (p1.y - c.y)) - abs_v.x * h.x - abs_v.y * h.y;
         if (separation > 0.0) continue;
         if (node.IsLeaf()) {
            var subInput = new b2RayCastInput();
            subInput.p1 = input.p1;
            subInput.p2 = input.p2;
            subInput.maxFraction = input.maxFraction;
            maxFraction = callback(subInput, node);
            if (maxFraction == 0.0) return;
            if (maxFraction > 0.0) {
               tX = p1.x + maxFraction * (p2.x - p1.x);
               tY = p1.y + maxFraction * (p2.y - p1.y);
               segmentAABB.lowerBound.x = Math.min(p1.x, tX);
               segmentAABB.lowerBound.y = Math.min(p1.y, tY);
               segmentAABB.upperBound.x = Math.max(p1.x, tX);
               segmentAABB.upperBound.y = Math.max(p1.y, tY);
            }
         }
         else {
            stack[count++] = node.child1;
            stack[count++] = node.child2;
         }
      }
   }
   b2DynamicTree.prototype.AllocateNode = function () {
      if (this.m_freeList) {
         var node = this.m_freeList;
         this.m_freeList = node.parent;
         node.parent = null;
         node.child1 = null;
         node.child2 = null;
         return node;
      }
      return new b2DynamicTreeNode();
   }
   b2DynamicTree.prototype.FreeNode = function (node) {
      node.parent = this.m_freeList;
      this.m_freeList = node;
   }
   b2DynamicTree.prototype.InsertLeaf = function (leaf) {
      ++this.m_insertionCount;
      if (this.m_root == null) {
         this.m_root = leaf;
         this.m_root.parent = null;
         return;
      }
      var center = leaf.aabb.GetCenter();
      var sibling = this.m_root;
      if (sibling.IsLeaf() == false) {
         do {
            var child1 = sibling.child1;
            var child2 = sibling.child2;
            var norm1 = Math.abs((child1.aabb.lowerBound.x + child1.aabb.upperBound.x) / 2 - center.x) + Math.abs((child1.aabb.lowerBound.y + child1.aabb.upperBound.y) / 2 - center.y);
            var norm2 = Math.abs((child2.aabb.lowerBound.x + child2.aabb.upperBound.x) / 2 - center.x) + Math.abs((child2.aabb.lowerBound.y + child2.aabb.upperBound.y) / 2 - center.y);
            if (norm1 < norm2) {
               sibling = child1;
            }
            else {
               sibling = child2;
            }
         }
         while (sibling.IsLeaf() == false)
      }
      var node1 = sibling.parent;
      var node2 = this.AllocateNode();
      node2.parent = node1;
      node2.userData = null;
      node2.aabb.Combine(leaf.aabb, sibling.aabb);
      if (node1) {
         if (sibling.parent.child1 == sibling) {
            node1.child1 = node2;
         }
         else {
            node1.child2 = node2;
         }
         node2.child1 = sibling;
         node2.child2 = leaf;
         sibling.parent = node2;
         leaf.parent = node2;
         do {
            if (node1.aabb.Contains(node2.aabb)) break;
            node1.aabb.Combine(node1.child1.aabb, node1.child2.aabb);
            node2 = node1;
            node1 = node1.parent;
         }
         while (node1)
      }
      else {
         node2.child1 = sibling;
         node2.child2 = leaf;
         sibling.parent = node2;
         leaf.parent = node2;
         this.m_root = node2;
      }
   }
   b2DynamicTree.prototype.RemoveLeaf = function (leaf) {
      if (leaf == this.m_root) {
         this.m_root = null;
         return;
      }
      var node2 = leaf.parent;
      var node1 = node2.parent;
      var sibling;
      if (node2.child1 == leaf) {
         sibling = node2.child2;
      }
      else {
         sibling = node2.child1;
      }
      if (node1) {
         if (node1.child1 == node2) {
            node1.child1 = sibling;
         }
         else {
            node1.child2 = sibling;
         }
         sibling.parent = node1;
         this.FreeNode(node2);
         while (node1) {
            var oldAABB = node1.aabb;
            node1.aabb = b2AABB.Combine(node1.child1.aabb, node1.child2.aabb);
            if (oldAABB.Contains(node1.aabb)) break;
            node1 = node1.parent;
         }
      }
      else {
         this.m_root = sibling;
         sibling.parent = null;
         this.FreeNode(node2);
      }
   }
   b2DynamicTreeBroadPhase.b2DynamicTreeBroadPhase = function () {
      this.m_tree = new b2DynamicTree();
      this.m_moveBuffer = new Vector();
      this.m_pairBuffer = new Vector();
      this.m_pairCount = 0;
   };
   b2DynamicTreeBroadPhase.prototype.CreateProxy = function (aabb, userData) {
      var proxy = this.m_tree.CreateProxy(aabb, userData);
      ++this.m_proxyCount;
      this.BufferMove(proxy);
      return proxy;
   }
   b2DynamicTreeBroadPhase.prototype.DestroyProxy = function (proxy) {
      this.UnBufferMove(proxy);
      --this.m_proxyCount;
      this.m_tree.DestroyProxy(proxy);
   }
   b2DynamicTreeBroadPhase.prototype.MoveProxy = function (proxy, aabb, displacement) {
      var buffer = this.m_tree.MoveProxy(proxy, aabb, displacement);
      if (buffer) {
         this.BufferMove(proxy);
      }
   }
   b2DynamicTreeBroadPhase.prototype.TestOverlap = function (proxyA, proxyB) {
      var aabbA = this.m_tree.GetFatAABB(proxyA);
      var aabbB = this.m_tree.GetFatAABB(proxyB);
      return aabbA.TestOverlap(aabbB);
   }
   b2DynamicTreeBroadPhase.prototype.GetUserData = function (proxy) {
      return this.m_tree.GetUserData(proxy);
   }
   b2DynamicTreeBroadPhase.prototype.GetFatAABB = function (proxy) {
      return this.m_tree.GetFatAABB(proxy);
   }
   b2DynamicTreeBroadPhase.prototype.GetProxyCount = function () {
      return this.m_proxyCount;
   }
   b2DynamicTreeBroadPhase.prototype.UpdatePairs = function (callback) {
      var __this = this;
      __this.m_pairCount = 0;
      var i = 0,
         queryProxy;
       function QueryCallback(proxy) {
          if (proxy == queryProxy) return true;
          if (__this.m_pairCount == __this.m_pairBuffer.length) {
             __this.m_pairBuffer[__this.m_pairCount] = new b2DynamicTreePair();
          }
          var pair = __this.m_pairBuffer[__this.m_pairCount];
          pair.proxyA = proxy < queryProxy ? proxy : queryProxy;
          pair.proxyB = proxy >= queryProxy ? proxy : queryProxy;++__this.m_pairCount;
          return true;
       };
      for (i = 0;
      i < __this.m_moveBuffer.length; ++i) {
         queryProxy = __this.m_moveBuffer[i];
         var fatAABB = __this.m_tree.GetFatAABB(queryProxy);
         __this.m_tree.Query(QueryCallback, fatAABB);
      }
      __this.m_moveBuffer.length = 0;
      for (var i = 0; i < __this.m_pairCount;) {
         var primaryPair = __this.m_pairBuffer[i];
         var userDataA = __this.m_tree.GetUserData(primaryPair.proxyA);
         var userDataB = __this.m_tree.GetUserData(primaryPair.proxyB);
         callback(userDataA, userDataB);
         ++i;
         while (i < __this.m_pairCount) {
            var pair = __this.m_pairBuffer[i];
            if (pair.proxyA != primaryPair.proxyA || pair.proxyB != primaryPair.proxyB) {
               break;
            }++i;
         }
      }
   }
   b2DynamicTreeBroadPhase.prototype.Query = function (callback, aabb) {
      this.m_tree.Query(callback, aabb);
   }
   b2DynamicTreeBroadPhase.prototype.RayCast = function (callback, input) {
      this.m_tree.RayCast(callback, input);
   }
   b2DynamicTreeBroadPhase.prototype.Validate = function () {}
   b2DynamicTreeBroadPhase.prototype.Rebalance = function (iterations) {
      if (iterations === undefined) iterations = 0;
      this.m_tree.Rebalance(iterations);
   }
   b2DynamicTreeBroadPhase.prototype.BufferMove = function (proxy) {
      this.m_moveBuffer[this.m_moveBuffer.length] = proxy;
   }
   b2DynamicTreeBroadPhase.prototype.UnBufferMove = function (proxy) {
      var i = parseInt(this.m_moveBuffer.indexOf(proxy));
      this.m_moveBuffer.splice(i, 1);
   }
   b2DynamicTreeBroadPhase.prototype.ComparePairs = function (pair1, pair2) {
      return 0;
   }
   b2DynamicTreeBroadPhase.__implements = {};
   b2DynamicTreeBroadPhase.__implements[IBroadPhase] = true;
   b2DynamicTreeNode.b2DynamicTreeNode = function () {
      this.aabb = new b2AABB();
   };
   b2DynamicTreeNode.prototype.IsLeaf = function () {
      return this.child1 == null;
   }
   b2DynamicTreePair.b2DynamicTreePair = function () {};
   b2Manifold.b2Manifold = function () {
      this.m_pointCount = 0;
   };
   b2Manifold.prototype.b2Manifold = function () {
      this.m_points = new Vector(b2Settings.b2_maxManifoldPoints);
      for (var i = 0; i < b2Settings.b2_maxManifoldPoints; i++) {
         this.m_points[i] = new b2ManifoldPoint();
      }
      this.m_localPlaneNormal = new b2Vec2();
      this.m_localPoint = new b2Vec2();
   }
   b2Manifold.prototype.Reset = function () {
      for (var i = 0; i < b2Settings.b2_maxManifoldPoints; i++) {
         ((this.m_points[i] instanceof b2ManifoldPoint ? this.m_points[i] : null)).Reset();
      }
      this.m_localPlaneNormal.SetZero();
      this.m_localPoint.SetZero();
      this.m_type = 0;
      this.m_pointCount = 0;
   }
   b2Manifold.prototype.Set = function (m) {
      this.m_pointCount = m.m_pointCount;
      for (var i = 0; i < b2Settings.b2_maxManifoldPoints; i++) {
         ((this.m_points[i] instanceof b2ManifoldPoint ? this.m_points[i] : null)).Set(m.m_points[i]);
      }
      this.m_localPlaneNormal.SetV(m.m_localPlaneNormal);
      this.m_localPoint.SetV(m.m_localPoint);
      this.m_type = m.m_type;
   }
   b2Manifold.prototype.Copy = function () {
      var copy = new b2Manifold();
      copy.Set(this);
      return copy;
   }
   Box2D.postDefs.push(function () {
      Box2D.Collision.b2Manifold.e_circles = 0x0001;
      Box2D.Collision.b2Manifold.e_faceA = 0x0002;
      Box2D.Collision.b2Manifold.e_faceB = 0x0004;
   });
   b2ManifoldPoint.b2ManifoldPoint = function () {
      this.m_localPoint = new b2Vec2();
      this.m_id = new b2ContactID();
   };
   b2ManifoldPoint.prototype.b2ManifoldPoint = function () {
      this.Reset();
   }
   b2ManifoldPoint.prototype.Reset = function () {
      this.m_localPoint.SetZero();
      this.m_normalImpulse = 0.0;
      this.m_tangentImpulse = 0.0;
      this.m_id.key = 0;
   }
   b2ManifoldPoint.prototype.Set = function (m) {
      this.m_localPoint.SetV(m.m_localPoint);
      this.m_normalImpulse = m.m_normalImpulse;
      this.m_tangentImpulse = m.m_tangentImpulse;
      this.m_id.Set(m.m_id);
   }
   b2Point.b2Point = function () {
      this.p = new b2Vec2();
   };
   b2Point.prototype.Support = function (xf, vX, vY) {
      if (vX === undefined) vX = 0;
      if (vY === undefined) vY = 0;
      return this.p;
   }
   b2Point.prototype.GetFirstVertex = function (xf) {
      return this.p;
   }
   b2RayCastInput.b2RayCastInput = function () {
      this.p1 = new b2Vec2();
      this.p2 = new b2Vec2();
   };
   b2RayCastInput.prototype.b2RayCastInput = function (p1, p2, maxFraction) {
      if (p1 === undefined) p1 = null;
      if (p2 === undefined) p2 = null;
      if (maxFraction === undefined) maxFraction = 1;
      if (p1) this.p1.SetV(p1);
      if (p2) this.p2.SetV(p2);
      this.maxFraction = maxFraction;
   }
   b2RayCastOutput.b2RayCastOutput = function () {
      this.normal = new b2Vec2();
   };
   b2Segment.b2Segment = function () {
      this.p1 = new b2Vec2();
      this.p2 = new b2Vec2();
   };
   b2Segment.prototype.TestSegment = function (lambda, normal, segment, maxLambda) {
      if (maxLambda === undefined) maxLambda = 0;
      var s = segment.p1;
      var rX = segment.p2.x - s.x;
      var rY = segment.p2.y - s.y;
      var dX = this.p2.x - this.p1.x;
      var dY = this.p2.y - this.p1.y;
      var nX = dY;
      var nY = (-dX);
      var k_slop = 100.0 * Number.MIN_VALUE;
      var denom = (-(rX * nX + rY * nY));
      if (denom > k_slop) {
         var bX = s.x - this.p1.x;
         var bY = s.y - this.p1.y;
         var a = (bX * nX + bY * nY);
         if (0.0 <= a && a <= maxLambda * denom) {
            var mu2 = (-rX * bY) + rY * bX;
            if ((-k_slop * denom) <= mu2 && mu2 <= denom * (1.0 + k_slop)) {
               a /= denom;
               var nLen = Math.sqrt(nX * nX + nY * nY);
               nX /= nLen;
               nY /= nLen;
               lambda[0] = a;
               normal.Set(nX, nY);
               return true;
            }
         }
      }
      return false;
   }
   b2Segment.prototype.Extend = function (aabb) {
      this.ExtendForward(aabb);
      this.ExtendBackward(aabb);
   }
   b2Segment.prototype.ExtendForward = function (aabb) {
      var dX = this.p2.x - this.p1.x;
      var dY = this.p2.y - this.p1.y;
      var lambda = Math.min(dX > 0 ? (aabb.upperBound.x - this.p1.x) / dX : dX < 0 ? (aabb.lowerBound.x - this.p1.x) / dX : Number.POSITIVE_INFINITY,
      dY > 0 ? (aabb.upperBound.y - this.p1.y) / dY : dY < 0 ? (aabb.lowerBound.y - this.p1.y) / dY : Number.POSITIVE_INFINITY);
      this.p2.x = this.p1.x + dX * lambda;
      this.p2.y = this.p1.y + dY * lambda;
   }
   b2Segment.prototype.ExtendBackward = function (aabb) {
      var dX = (-this.p2.x) + this.p1.x;
      var dY = (-this.p2.y) + this.p1.y;
      var lambda = Math.min(dX > 0 ? (aabb.upperBound.x - this.p2.x) / dX : dX < 0 ? (aabb.lowerBound.x - this.p2.x) / dX : Number.POSITIVE_INFINITY,
      dY > 0 ? (aabb.upperBound.y - this.p2.y) / dY : dY < 0 ? (aabb.lowerBound.y - this.p2.y) / dY : Number.POSITIVE_INFINITY);
      this.p1.x = this.p2.x + dX * lambda;
      this.p1.y = this.p2.y + dY * lambda;
   }
   b2SeparationFunction.b2SeparationFunction = function () {
      this.m_localPoint = new b2Vec2();
      this.m_axis = new b2Vec2();
   };
   b2SeparationFunction.prototype.Initialize = function (cache, proxyA, transformA, proxyB, transformB) {
      this.m_proxyA = proxyA;
      this.m_proxyB = proxyB;
      var count = parseInt(cache.count);
      b2Settings.b2Assert(0 < count && count < 3);
      var localPointA;
      var localPointA1;
      var localPointA2;
      var localPointB;
      var localPointB1;
      var localPointB2;
      var pointAX = 0;
      var pointAY = 0;
      var pointBX = 0;
      var pointBY = 0;
      var normalX = 0;
      var normalY = 0;
      var tMat;
      var tVec;
      var s = 0;
      var sgn = 0;
      if (count == 1) {
         this.m_type = b2SeparationFunction.e_points;
         localPointA = this.m_proxyA.GetVertex(cache.indexA[0]);
         localPointB = this.m_proxyB.GetVertex(cache.indexB[0]);
         tVec = localPointA;
         tMat = transformA.R;
         pointAX = transformA.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
         pointAY = transformA.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
         tVec = localPointB;
         tMat = transformB.R;
         pointBX = transformB.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
         pointBY = transformB.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
         this.m_axis.x = pointBX - pointAX;
         this.m_axis.y = pointBY - pointAY;
         this.m_axis.Normalize();
      }
      else if (cache.indexB[0] == cache.indexB[1]) {
         this.m_type = b2SeparationFunction.e_faceA;
         localPointA1 = this.m_proxyA.GetVertex(cache.indexA[0]);
         localPointA2 = this.m_proxyA.GetVertex(cache.indexA[1]);
         localPointB = this.m_proxyB.GetVertex(cache.indexB[0]);
         this.m_localPoint.x = 0.5 * (localPointA1.x + localPointA2.x);
         this.m_localPoint.y = 0.5 * (localPointA1.y + localPointA2.y);
         this.m_axis = b2Math.CrossVF(b2Math.SubtractVV(localPointA2, localPointA1), 1.0);
         this.m_axis.Normalize();
         tVec = this.m_axis;
         tMat = transformA.R;
         normalX = tMat.col1.x * tVec.x + tMat.col2.x * tVec.y;
         normalY = tMat.col1.y * tVec.x + tMat.col2.y * tVec.y;
         tVec = this.m_localPoint;
         tMat = transformA.R;
         pointAX = transformA.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
         pointAY = transformA.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
         tVec = localPointB;
         tMat = transformB.R;
         pointBX = transformB.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
         pointBY = transformB.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
         s = (pointBX - pointAX) * normalX + (pointBY - pointAY) * normalY;
         if (s < 0.0) {
            this.m_axis.NegativeSelf();
         }
      }
      else if (cache.indexA[0] == cache.indexA[0]) {
         this.m_type = b2SeparationFunction.e_faceB;
         localPointB1 = this.m_proxyB.GetVertex(cache.indexB[0]);
         localPointB2 = this.m_proxyB.GetVertex(cache.indexB[1]);
         localPointA = this.m_proxyA.GetVertex(cache.indexA[0]);
         this.m_localPoint.x = 0.5 * (localPointB1.x + localPointB2.x);
         this.m_localPoint.y = 0.5 * (localPointB1.y + localPointB2.y);
         this.m_axis = b2Math.CrossVF(b2Math.SubtractVV(localPointB2, localPointB1), 1.0);
         this.m_axis.Normalize();
         tVec = this.m_axis;
         tMat = transformB.R;
         normalX = tMat.col1.x * tVec.x + tMat.col2.x * tVec.y;
         normalY = tMat.col1.y * tVec.x + tMat.col2.y * tVec.y;
         tVec = this.m_localPoint;
         tMat = transformB.R;
         pointBX = transformB.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
         pointBY = transformB.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
         tVec = localPointA;
         tMat = transformA.R;
         pointAX = transformA.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
         pointAY = transformA.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
         s = (pointAX - pointBX) * normalX + (pointAY - pointBY) * normalY;
         if (s < 0.0) {
            this.m_axis.NegativeSelf();
         }
      }
      else {
         localPointA1 = this.m_proxyA.GetVertex(cache.indexA[0]);
         localPointA2 = this.m_proxyA.GetVertex(cache.indexA[1]);
         localPointB1 = this.m_proxyB.GetVertex(cache.indexB[0]);
         localPointB2 = this.m_proxyB.GetVertex(cache.indexB[1]);
         var pA = b2Math.MulX(transformA, localPointA);
         var dA = b2Math.MulMV(transformA.R, b2Math.SubtractVV(localPointA2, localPointA1));
         var pB = b2Math.MulX(transformB, localPointB);
         var dB = b2Math.MulMV(transformB.R, b2Math.SubtractVV(localPointB2, localPointB1));
         var a = dA.x * dA.x + dA.y * dA.y;
         var e = dB.x * dB.x + dB.y * dB.y;
         var r = b2Math.SubtractVV(dB, dA);
         var c = dA.x * r.x + dA.y * r.y;
         var f = dB.x * r.x + dB.y * r.y;
         var b = dA.x * dB.x + dA.y * dB.y;
         var denom = a * e - b * b;
         s = 0.0;
         if (denom != 0.0) {
            s = b2Math.Clamp((b * f - c * e) / denom, 0.0, 1.0);
         }
         var t = (b * s + f) / e;
         if (t < 0.0) {
            t = 0.0;
            s = b2Math.Clamp((b - c) / a, 0.0, 1.0);
         }
         localPointA = new b2Vec2();
         localPointA.x = localPointA1.x + s * (localPointA2.x - localPointA1.x);
         localPointA.y = localPointA1.y + s * (localPointA2.y - localPointA1.y);
         localPointB = new b2Vec2();
         localPointB.x = localPointB1.x + s * (localPointB2.x - localPointB1.x);
         localPointB.y = localPointB1.y + s * (localPointB2.y - localPointB1.y);
         if (s == 0.0 || s == 1.0) {
            this.m_type = b2SeparationFunction.e_faceB;
            this.m_axis = b2Math.CrossVF(b2Math.SubtractVV(localPointB2, localPointB1), 1.0);
            this.m_axis.Normalize();
            this.m_localPoint = localPointB;
            tVec = this.m_axis;
            tMat = transformB.R;
            normalX = tMat.col1.x * tVec.x + tMat.col2.x * tVec.y;
            normalY = tMat.col1.y * tVec.x + tMat.col2.y * tVec.y;
            tVec = this.m_localPoint;
            tMat = transformB.R;
            pointBX = transformB.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
            pointBY = transformB.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
            tVec = localPointA;
            tMat = transformA.R;
            pointAX = transformA.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
            pointAY = transformA.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
            sgn = (pointAX - pointBX) * normalX + (pointAY - pointBY) * normalY;
            if (s < 0.0) {
               this.m_axis.NegativeSelf();
            }
         }
         else {
            this.m_type = b2SeparationFunction.e_faceA;
            this.m_axis = b2Math.CrossVF(b2Math.SubtractVV(localPointA2, localPointA1), 1.0);
            this.m_localPoint = localPointA;
            tVec = this.m_axis;
            tMat = transformA.R;
            normalX = tMat.col1.x * tVec.x + tMat.col2.x * tVec.y;
            normalY = tMat.col1.y * tVec.x + tMat.col2.y * tVec.y;
            tVec = this.m_localPoint;
            tMat = transformA.R;
            pointAX = transformA.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
            pointAY = transformA.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
            tVec = localPointB;
            tMat = transformB.R;
            pointBX = transformB.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
            pointBY = transformB.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
            sgn = (pointBX - pointAX) * normalX + (pointBY - pointAY) * normalY;
            if (s < 0.0) {
               this.m_axis.NegativeSelf();
            }
         }
      }
   }
   b2SeparationFunction.prototype.Evaluate = function (transformA, transformB) {
      var axisA;
      var axisB;
      var localPointA;
      var localPointB;
      var pointA;
      var pointB;
      var seperation = 0;
      var normal;
      switch (this.m_type) {
      case b2SeparationFunction.e_points:
         {
            axisA = b2Math.MulTMV(transformA.R, this.m_axis);
            axisB = b2Math.MulTMV(transformB.R, this.m_axis.GetNegative());
            localPointA = this.m_proxyA.GetSupportVertex(axisA);
            localPointB = this.m_proxyB.GetSupportVertex(axisB);
            pointA = b2Math.MulX(transformA, localPointA);
            pointB = b2Math.MulX(transformB, localPointB);
            seperation = (pointB.x - pointA.x) * this.m_axis.x + (pointB.y - pointA.y) * this.m_axis.y;
            return seperation;
         }
      case b2SeparationFunction.e_faceA:
         {
            normal = b2Math.MulMV(transformA.R, this.m_axis);
            pointA = b2Math.MulX(transformA, this.m_localPoint);
            axisB = b2Math.MulTMV(transformB.R, normal.GetNegative());
            localPointB = this.m_proxyB.GetSupportVertex(axisB);
            pointB = b2Math.MulX(transformB, localPointB);
            seperation = (pointB.x - pointA.x) * normal.x + (pointB.y - pointA.y) * normal.y;
            return seperation;
         }
      case b2SeparationFunction.e_faceB:
         {
            normal = b2Math.MulMV(transformB.R, this.m_axis);
            pointB = b2Math.MulX(transformB, this.m_localPoint);
            axisA = b2Math.MulTMV(transformA.R, normal.GetNegative());
            localPointA = this.m_proxyA.GetSupportVertex(axisA);
            pointA = b2Math.MulX(transformA, localPointA);
            seperation = (pointA.x - pointB.x) * normal.x + (pointA.y - pointB.y) * normal.y;
            return seperation;
         }
      default:
         b2Settings.b2Assert(false);
         return 0.0;
      }
   }
   Box2D.postDefs.push(function () {
      Box2D.Collision.b2SeparationFunction.e_points = 0x01;
      Box2D.Collision.b2SeparationFunction.e_faceA = 0x02;
      Box2D.Collision.b2SeparationFunction.e_faceB = 0x04;
   });
   b2Simplex.b2Simplex = function () {
      this.m_v1 = new b2SimplexVertex();
      this.m_v2 = new b2SimplexVertex();
      this.m_v3 = new b2SimplexVertex();
      this.m_vertices = new Vector(3);
   };
   b2Simplex.prototype.b2Simplex = function () {
      this.m_vertices[0] = this.m_v1;
      this.m_vertices[1] = this.m_v2;
      this.m_vertices[2] = this.m_v3;
   }
   b2Simplex.prototype.ReadCache = function (cache, proxyA, transformA, proxyB, transformB) {
      b2Settings.b2Assert(0 <= cache.count && cache.count <= 3);
      var wALocal;
      var wBLocal;
      this.m_count = cache.count;
      var vertices = this.m_vertices;
      for (var i = 0; i < this.m_count; i++) {
         var v = vertices[i];
         v.indexA = cache.indexA[i];
         v.indexB = cache.indexB[i];
         wALocal = proxyA.GetVertex(v.indexA);
         wBLocal = proxyB.GetVertex(v.indexB);
         v.wA = b2Math.MulX(transformA, wALocal);
         v.wB = b2Math.MulX(transformB, wBLocal);
         v.w = b2Math.SubtractVV(v.wB, v.wA);
         v.a = 0;
      }
      if (this.m_count > 1) {
         var metric1 = cache.metric;
         var metric2 = this.GetMetric();
         if (metric2 < .5 * metric1 || 2.0 * metric1 < metric2 || metric2 < Number.MIN_VALUE) {
            this.m_count = 0;
         }
      }
      if (this.m_count == 0) {
         v = vertices[0];
         v.indexA = 0;
         v.indexB = 0;
         wALocal = proxyA.GetVertex(0);
         wBLocal = proxyB.GetVertex(0);
         v.wA = b2Math.MulX(transformA, wALocal);
         v.wB = b2Math.MulX(transformB, wBLocal);
         v.w = b2Math.SubtractVV(v.wB, v.wA);
         this.m_count = 1;
      }
   }
   b2Simplex.prototype.WriteCache = function (cache) {
      cache.metric = this.GetMetric();
      cache.count = Box2D.parseUInt(this.m_count);
      var vertices = this.m_vertices;
      for (var i = 0; i < this.m_count; i++) {
         cache.indexA[i] = Box2D.parseUInt(vertices[i].indexA);
         cache.indexB[i] = Box2D.parseUInt(vertices[i].indexB);
      }
   }
   b2Simplex.prototype.GetSearchDirection = function () {
      switch (this.m_count) {
      case 1:
         return this.m_v1.w.GetNegative();
      case 2:
         {
            var e12 = b2Math.SubtractVV(this.m_v2.w, this.m_v1.w);
            var sgn = b2Math.CrossVV(e12, this.m_v1.w.GetNegative());
            if (sgn > 0.0) {
               return b2Math.CrossFV(1.0, e12);
            }
            else {
               return b2Math.CrossVF(e12, 1.0);
            }
         }
      default:
         b2Settings.b2Assert(false);
         return new b2Vec2();
      }
   }
   b2Simplex.prototype.GetClosestPoint = function () {
      switch (this.m_count) {
      case 0:
         b2Settings.b2Assert(false);
         return new b2Vec2();
      case 1:
         return this.m_v1.w;
      case 2:
         return new b2Vec2(this.m_v1.a * this.m_v1.w.x + this.m_v2.a * this.m_v2.w.x, this.m_v1.a * this.m_v1.w.y + this.m_v2.a * this.m_v2.w.y);
      default:
         b2Settings.b2Assert(false);
         return new b2Vec2();
      }
   }
   b2Simplex.prototype.GetWitnessPoints = function (pA, pB) {
      switch (this.m_count) {
      case 0:
         b2Settings.b2Assert(false);
         break;
      case 1:
         pA.SetV(this.m_v1.wA);
         pB.SetV(this.m_v1.wB);
         break;
      case 2:
         pA.x = this.m_v1.a * this.m_v1.wA.x + this.m_v2.a * this.m_v2.wA.x;
         pA.y = this.m_v1.a * this.m_v1.wA.y + this.m_v2.a * this.m_v2.wA.y;
         pB.x = this.m_v1.a * this.m_v1.wB.x + this.m_v2.a * this.m_v2.wB.x;
         pB.y = this.m_v1.a * this.m_v1.wB.y + this.m_v2.a * this.m_v2.wB.y;
         break;
      case 3:
         pB.x = pA.x = this.m_v1.a * this.m_v1.wA.x + this.m_v2.a * this.m_v2.wA.x + this.m_v3.a * this.m_v3.wA.x;
         pB.y = pA.y = this.m_v1.a * this.m_v1.wA.y + this.m_v2.a * this.m_v2.wA.y + this.m_v3.a * this.m_v3.wA.y;
         break;
      default:
         b2Settings.b2Assert(false);
         break;
      }
   }
   b2Simplex.prototype.GetMetric = function () {
      switch (this.m_count) {
      case 0:
         b2Settings.b2Assert(false);
         return 0.0;
      case 1:
         return 0.0;
      case 2:
         return b2Math.SubtractVV(this.m_v1.w, this.m_v2.w).Length();
      case 3:
         return b2Math.CrossVV(b2Math.SubtractVV(this.m_v2.w, this.m_v1.w), b2Math.SubtractVV(this.m_v3.w, this.m_v1.w));
      default:
         b2Settings.b2Assert(false);
         return 0.0;
      }
   }
   b2Simplex.prototype.Solve2 = function () {
      var w1 = this.m_v1.w;
      var w2 = this.m_v2.w;
      var e12 = b2Math.SubtractVV(w2, w1);
      var d12_2 = (-(w1.x * e12.x + w1.y * e12.y));
      if (d12_2 <= 0.0) {
         this.m_v1.a = 1.0;
         this.m_count = 1;
         return;
      }
      var d12_1 = (w2.x * e12.x + w2.y * e12.y);
      if (d12_1 <= 0.0) {
         this.m_v2.a = 1.0;
         this.m_count = 1;
         this.m_v1.Set(this.m_v2);
         return;
      }
      var inv_d12 = 1.0 / (d12_1 + d12_2);
      this.m_v1.a = d12_1 * inv_d12;
      this.m_v2.a = d12_2 * inv_d12;
      this.m_count = 2;
   }
   b2Simplex.prototype.Solve3 = function () {
      var w1 = this.m_v1.w;
      var w2 = this.m_v2.w;
      var w3 = this.m_v3.w;
      var e12 = b2Math.SubtractVV(w2, w1);
      var w1e12 = b2Math.Dot(w1, e12);
      var w2e12 = b2Math.Dot(w2, e12);
      var d12_1 = w2e12;
      var d12_2 = (-w1e12);
      var e13 = b2Math.SubtractVV(w3, w1);
      var w1e13 = b2Math.Dot(w1, e13);
      var w3e13 = b2Math.Dot(w3, e13);
      var d13_1 = w3e13;
      var d13_2 = (-w1e13);
      var e23 = b2Math.SubtractVV(w3, w2);
      var w2e23 = b2Math.Dot(w2, e23);
      var w3e23 = b2Math.Dot(w3, e23);
      var d23_1 = w3e23;
      var d23_2 = (-w2e23);
      var n123 = b2Math.CrossVV(e12, e13);
      var d123_1 = n123 * b2Math.CrossVV(w2, w3);
      var d123_2 = n123 * b2Math.CrossVV(w3, w1);
      var d123_3 = n123 * b2Math.CrossVV(w1, w2);
      if (d12_2 <= 0.0 && d13_2 <= 0.0) {
         this.m_v1.a = 1.0;
         this.m_count = 1;
         return;
      }
      if (d12_1 > 0.0 && d12_2 > 0.0 && d123_3 <= 0.0) {
         var inv_d12 = 1.0 / (d12_1 + d12_2);
         this.m_v1.a = d12_1 * inv_d12;
         this.m_v2.a = d12_2 * inv_d12;
         this.m_count = 2;
         return;
      }
      if (d13_1 > 0.0 && d13_2 > 0.0 && d123_2 <= 0.0) {
         var inv_d13 = 1.0 / (d13_1 + d13_2);
         this.m_v1.a = d13_1 * inv_d13;
         this.m_v3.a = d13_2 * inv_d13;
         this.m_count = 2;
         this.m_v2.Set(this.m_v3);
         return;
      }
      if (d12_1 <= 0.0 && d23_2 <= 0.0) {
         this.m_v2.a = 1.0;
         this.m_count = 1;
         this.m_v1.Set(this.m_v2);
         return;
      }
      if (d13_1 <= 0.0 && d23_1 <= 0.0) {
         this.m_v3.a = 1.0;
         this.m_count = 1;
         this.m_v1.Set(this.m_v3);
         return;
      }
      if (d23_1 > 0.0 && d23_2 > 0.0 && d123_1 <= 0.0) {
         var inv_d23 = 1.0 / (d23_1 + d23_2);
         this.m_v2.a = d23_1 * inv_d23;
         this.m_v3.a = d23_2 * inv_d23;
         this.m_count = 2;
         this.m_v1.Set(this.m_v3);
         return;
      }
      var inv_d123 = 1.0 / (d123_1 + d123_2 + d123_3);
      this.m_v1.a = d123_1 * inv_d123;
      this.m_v2.a = d123_2 * inv_d123;
      this.m_v3.a = d123_3 * inv_d123;
      this.m_count = 3;
   }
   b2SimplexCache.b2SimplexCache = function () {
      this.indexA = new Vector_a2j_Number(3);
      this.indexB = new Vector_a2j_Number(3);
   };
   b2SimplexVertex.b2SimplexVertex = function () {};
   b2SimplexVertex.prototype.Set = function (other) {
      this.wA.SetV(other.wA);
      this.wB.SetV(other.wB);
      this.w.SetV(other.w);
      this.a = other.a;
      this.indexA = other.indexA;
      this.indexB = other.indexB;
   }
   b2TimeOfImpact.b2TimeOfImpact = function () {};
   b2TimeOfImpact.TimeOfImpact = function (input) {
      ++b2TimeOfImpact.b2_toiCalls;
      var proxyA = input.proxyA;
      var proxyB = input.proxyB;
      var sweepA = input.sweepA;
      var sweepB = input.sweepB;
      b2Settings.b2Assert(sweepA.t0 == sweepB.t0);
      b2Settings.b2Assert(1.0 - sweepA.t0 > Number.MIN_VALUE);
      var radius = proxyA.m_radius + proxyB.m_radius;
      var tolerance = input.tolerance;
      var alpha = 0.0;
      var k_maxIterations = 1000;
      var iter = 0;
      var target = 0.0;
      b2TimeOfImpact.s_cache.count = 0;
      b2TimeOfImpact.s_distanceInput.useRadii = false;
      for (;;) {
         sweepA.GetTransform(b2TimeOfImpact.s_xfA, alpha);
         sweepB.GetTransform(b2TimeOfImpact.s_xfB, alpha);
         b2TimeOfImpact.s_distanceInput.proxyA = proxyA;
         b2TimeOfImpact.s_distanceInput.proxyB = proxyB;
         b2TimeOfImpact.s_distanceInput.transformA = b2TimeOfImpact.s_xfA;
         b2TimeOfImpact.s_distanceInput.transformB = b2TimeOfImpact.s_xfB;
         b2Distance.Distance(b2TimeOfImpact.s_distanceOutput, b2TimeOfImpact.s_cache, b2TimeOfImpact.s_distanceInput);
         if (b2TimeOfImpact.s_distanceOutput.distance <= 0.0) {
            alpha = 1.0;
            break;
         }
         b2TimeOfImpact.s_fcn.Initialize(b2TimeOfImpact.s_cache, proxyA, b2TimeOfImpact.s_xfA, proxyB, b2TimeOfImpact.s_xfB);
         var separation = b2TimeOfImpact.s_fcn.Evaluate(b2TimeOfImpact.s_xfA, b2TimeOfImpact.s_xfB);
         if (separation <= 0.0) {
            alpha = 1.0;
            break;
         }
         if (iter == 0) {
            if (separation > radius) {
               target = b2Math.Max(radius - tolerance, 0.75 * radius);
            }
            else {
               target = b2Math.Max(separation - tolerance, 0.02 * radius);
            }
         }
         if (separation - target < 0.5 * tolerance) {
            if (iter == 0) {
               alpha = 1.0;
               break;
            }
            break;
         }
         var newAlpha = alpha; {
            var x1 = alpha;
            var x2 = 1.0;
            var f1 = separation;
            sweepA.GetTransform(b2TimeOfImpact.s_xfA, x2);
            sweepB.GetTransform(b2TimeOfImpact.s_xfB, x2);
            var f2 = b2TimeOfImpact.s_fcn.Evaluate(b2TimeOfImpact.s_xfA, b2TimeOfImpact.s_xfB);
            if (f2 >= target) {
               alpha = 1.0;
               break;
            }
            var rootIterCount = 0;
            for (;;) {
               var x = 0;
               if (rootIterCount & 1) {
                  x = x1 + (target - f1) * (x2 - x1) / (f2 - f1);
               }
               else {
                  x = 0.5 * (x1 + x2);
               }
               sweepA.GetTransform(b2TimeOfImpact.s_xfA, x);
               sweepB.GetTransform(b2TimeOfImpact.s_xfB, x);
               var f = b2TimeOfImpact.s_fcn.Evaluate(b2TimeOfImpact.s_xfA, b2TimeOfImpact.s_xfB);
               if (b2Math.Abs(f - target) < 0.025 * tolerance) {
                  newAlpha = x;
                  break;
               }
               if (f > target) {
                  x1 = x;
                  f1 = f;
               }
               else {
                  x2 = x;
                  f2 = f;
               }++rootIterCount;
               ++b2TimeOfImpact.b2_toiRootIters;
               if (rootIterCount == 50) {
                  break;
               }
            }
            b2TimeOfImpact.b2_toiMaxRootIters = b2Math.Max(b2TimeOfImpact.b2_toiMaxRootIters, rootIterCount);
         }
         if (newAlpha < (1.0 + 100.0 * Number.MIN_VALUE) * alpha) {
            break;
         }
         alpha = newAlpha;
         iter++;
         ++b2TimeOfImpact.b2_toiIters;
         if (iter == k_maxIterations) {
            break;
         }
      }
      b2TimeOfImpact.b2_toiMaxIters = b2Math.Max(b2TimeOfImpact.b2_toiMaxIters, iter);
      return alpha;
   }
   Box2D.postDefs.push(function () {
      Box2D.Collision.b2TimeOfImpact.b2_toiCalls = 0;
      Box2D.Collision.b2TimeOfImpact.b2_toiIters = 0;
      Box2D.Collision.b2TimeOfImpact.b2_toiMaxIters = 0;
      Box2D.Collision.b2TimeOfImpact.b2_toiRootIters = 0;
      Box2D.Collision.b2TimeOfImpact.b2_toiMaxRootIters = 0;
      Box2D.Collision.b2TimeOfImpact.s_cache = new b2SimplexCache();
      Box2D.Collision.b2TimeOfImpact.s_distanceInput = new b2DistanceInput();
      Box2D.Collision.b2TimeOfImpact.s_xfA = new b2Transform();
      Box2D.Collision.b2TimeOfImpact.s_xfB = new b2Transform();
      Box2D.Collision.b2TimeOfImpact.s_fcn = new b2SeparationFunction();
      Box2D.Collision.b2TimeOfImpact.s_distanceOutput = new b2DistanceOutput();
   });
   b2TOIInput.b2TOIInput = function () {
      this.proxyA = new b2DistanceProxy();
      this.proxyB = new b2DistanceProxy();
      this.sweepA = new b2Sweep();
      this.sweepB = new b2Sweep();
   };
   b2WorldManifold.b2WorldManifold = function () {
      this.m_normal = new b2Vec2();
   };
   b2WorldManifold.prototype.b2WorldManifold = function () {
      this.m_points = new Vector(b2Settings.b2_maxManifoldPoints);
      for (var i = 0; i < b2Settings.b2_maxManifoldPoints; i++) {
         this.m_points[i] = new b2Vec2();
      }
   }
   b2WorldManifold.prototype.Initialize = function (manifold, xfA, radiusA, xfB, radiusB) {
      if (radiusA === undefined) radiusA = 0;
      if (radiusB === undefined) radiusB = 0;
      if (manifold.m_pointCount == 0) {
         return;
      }
      var i = 0;
      var tVec;
      var tMat;
      var normalX = 0;
      var normalY = 0;
      var planePointX = 0;
      var planePointY = 0;
      var clipPointX = 0;
      var clipPointY = 0;
      switch (manifold.m_type) {
      case b2Manifold.e_circles:
         {
            tMat = xfA.R;
            tVec = manifold.m_localPoint;
            var pointAX = xfA.position.x + tMat.col1.x * tVec.x + tMat.col2.x * tVec.y;
            var pointAY = xfA.position.y + tMat.col1.y * tVec.x + tMat.col2.y * tVec.y;
            tMat = xfB.R;
            tVec = manifold.m_points[0].m_localPoint;
            var pointBX = xfB.position.x + tMat.col1.x * tVec.x + tMat.col2.x * tVec.y;
            var pointBY = xfB.position.y + tMat.col1.y * tVec.x + tMat.col2.y * tVec.y;
            var dX = pointBX - pointAX;
            var dY = pointBY - pointAY;
            var d2 = dX * dX + dY * dY;
            if (d2 > Number.MIN_VALUE * Number.MIN_VALUE) {
               var d = Math.sqrt(d2);
               this.m_normal.x = dX / d;
               this.m_normal.y = dY / d;
            }
            else {
               this.m_normal.x = 1;
               this.m_normal.y = 0;
            }
            var cAX = pointAX + radiusA * this.m_normal.x;
            var cAY = pointAY + radiusA * this.m_normal.y;
            var cBX = pointBX - radiusB * this.m_normal.x;
            var cBY = pointBY - radiusB * this.m_normal.y;
            this.m_points[0].x = 0.5 * (cAX + cBX);
            this.m_points[0].y = 0.5 * (cAY + cBY);
         }
         break;
      case b2Manifold.e_faceA:
         {
            tMat = xfA.R;
            tVec = manifold.m_localPlaneNormal;
            normalX = tMat.col1.x * tVec.x + tMat.col2.x * tVec.y;
            normalY = tMat.col1.y * tVec.x + tMat.col2.y * tVec.y;
            tMat = xfA.R;
            tVec = manifold.m_localPoint;
            planePointX = xfA.position.x + tMat.col1.x * tVec.x + tMat.col2.x * tVec.y;
            planePointY = xfA.position.y + tMat.col1.y * tVec.x + tMat.col2.y * tVec.y;
            this.m_normal.x = normalX;
            this.m_normal.y = normalY;
            for (i = 0;
            i < manifold.m_pointCount; i++) {
               tMat = xfB.R;
               tVec = manifold.m_points[i].m_localPoint;
               clipPointX = xfB.position.x + tMat.col1.x * tVec.x + tMat.col2.x * tVec.y;
               clipPointY = xfB.position.y + tMat.col1.y * tVec.x + tMat.col2.y * tVec.y;
               this.m_points[i].x = clipPointX + 0.5 * (radiusA - (clipPointX - planePointX) * normalX - (clipPointY - planePointY) * normalY - radiusB) * normalX;
               this.m_points[i].y = clipPointY + 0.5 * (radiusA - (clipPointX - planePointX) * normalX - (clipPointY - planePointY) * normalY - radiusB) * normalY;
            }
         }
         break;
      case b2Manifold.e_faceB:
         {
            tMat = xfB.R;
            tVec = manifold.m_localPlaneNormal;
            normalX = tMat.col1.x * tVec.x + tMat.col2.x * tVec.y;
            normalY = tMat.col1.y * tVec.x + tMat.col2.y * tVec.y;
            tMat = xfB.R;
            tVec = manifold.m_localPoint;
            planePointX = xfB.position.x + tMat.col1.x * tVec.x + tMat.col2.x * tVec.y;
            planePointY = xfB.position.y + tMat.col1.y * tVec.x + tMat.col2.y * tVec.y;
            this.m_normal.x = (-normalX);
            this.m_normal.y = (-normalY);
            for (i = 0;
            i < manifold.m_pointCount; i++) {
               tMat = xfA.R;
               tVec = manifold.m_points[i].m_localPoint;
               clipPointX = xfA.position.x + tMat.col1.x * tVec.x + tMat.col2.x * tVec.y;
               clipPointY = xfA.position.y + tMat.col1.y * tVec.x + tMat.col2.y * tVec.y;
               this.m_points[i].x = clipPointX + 0.5 * (radiusB - (clipPointX - planePointX) * normalX - (clipPointY - planePointY) * normalY - radiusA) * normalX;
               this.m_points[i].y = clipPointY + 0.5 * (radiusB - (clipPointX - planePointX) * normalX - (clipPointY - planePointY) * normalY - radiusA) * normalY;
            }
         }
         break;
      }
   }
   ClipVertex.ClipVertex = function () {
      this.v = new b2Vec2();
      this.id = new b2ContactID();
   };
   ClipVertex.prototype.Set = function (other) {
      this.v.SetV(other.v);
      this.id.Set(other.id);
   }
   Features.Features = function () {};
   Object.defineProperty(Features.prototype, 'referenceEdge', {
      enumerable: false,
      configurable: true,
      get: function () {
         return this._referenceEdge;
      }
   });
   Object.defineProperty(Features.prototype, 'referenceEdge', {
      enumerable: false,
      configurable: true,
      set: function (value) {
         if (value === undefined) value = 0;
         this._referenceEdge = value;
         this._m_id._key = (this._m_id._key & 0xffffff00) | (this._referenceEdge & 0x000000ff);
      }
   });
   Object.defineProperty(Features.prototype, 'incidentEdge', {
      enumerable: false,
      configurable: true,
      get: function () {
         return this._incidentEdge;
      }
   });
   Object.defineProperty(Features.prototype, 'incidentEdge', {
      enumerable: false,
      configurable: true,
      set: function (value) {
         if (value === undefined) value = 0;
         this._incidentEdge = value;
         this._m_id._key = (this._m_id._key & 0xffff00ff) | ((this._incidentEdge << 8) & 0x0000ff00);
      }
   });
   Object.defineProperty(Features.prototype, 'incidentVertex', {
      enumerable: false,
      configurable: true,
      get: function () {
         return this._incidentVertex;
      }
   });
   Object.defineProperty(Features.prototype, 'incidentVertex', {
      enumerable: false,
      configurable: true,
      set: function (value) {
         if (value === undefined) value = 0;
         this._incidentVertex = value;
         this._m_id._key = (this._m_id._key & 0xff00ffff) | ((this._incidentVertex << 16) & 0x00ff0000);
      }
   });
   Object.defineProperty(Features.prototype, 'flip', {
      enumerable: false,
      configurable: true,
      get: function () {
         return this._flip;
      }
   });
   Object.defineProperty(Features.prototype, 'flip', {
      enumerable: false,
      configurable: true,
      set: function (value) {
         if (value === undefined) value = 0;
         this._flip = value;
         this._m_id._key = (this._m_id._key & 0x00ffffff) | ((this._flip << 24) & 0xff000000);
      }
   });
})();
(function () {
   var b2Color = Box2D.Common.b2Color,
      b2internal = Box2D.Common.b2internal,
      b2Settings = Box2D.Common.b2Settings,
      b2CircleShape = Box2D.Collision.Shapes.b2CircleShape,
      b2EdgeChainDef = Box2D.Collision.Shapes.b2EdgeChainDef,
      b2EdgeShape = Box2D.Collision.Shapes.b2EdgeShape,
      b2MassData = Box2D.Collision.Shapes.b2MassData,
      b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape,
      b2Shape = Box2D.Collision.Shapes.b2Shape,
      b2Mat22 = Box2D.Common.Math.b2Mat22,
      b2Mat33 = Box2D.Common.Math.b2Mat33,
      b2Math = Box2D.Common.Math.b2Math,
      b2Sweep = Box2D.Common.Math.b2Sweep,
      b2Transform = Box2D.Common.Math.b2Transform,
      b2Vec2 = Box2D.Common.Math.b2Vec2,
      b2Vec3 = Box2D.Common.Math.b2Vec3,
      b2Body = Box2D.Dynamics.b2Body,
      b2BodyDef = Box2D.Dynamics.b2BodyDef,
      b2ContactFilter = Box2D.Dynamics.b2ContactFilter,
      b2ContactImpulse = Box2D.Dynamics.b2ContactImpulse,
      b2ContactListener = Box2D.Dynamics.b2ContactListener,
      b2ContactManager = Box2D.Dynamics.b2ContactManager,
      b2DebugDraw = Box2D.Dynamics.b2DebugDraw,
      b2DestructionListener = Box2D.Dynamics.b2DestructionListener,
      b2FilterData = Box2D.Dynamics.b2FilterData,
      b2Fixture = Box2D.Dynamics.b2Fixture,
      b2FixtureDef = Box2D.Dynamics.b2FixtureDef,
      b2Island = Box2D.Dynamics.b2Island,
      b2TimeStep = Box2D.Dynamics.b2TimeStep,
      b2World = Box2D.Dynamics.b2World,
      b2AABB = Box2D.Collision.b2AABB,
      b2Bound = Box2D.Collision.b2Bound,
      b2BoundValues = Box2D.Collision.b2BoundValues,
      b2Collision = Box2D.Collision.b2Collision,
      b2ContactID = Box2D.Collision.b2ContactID,
      b2ContactPoint = Box2D.Collision.b2ContactPoint,
      b2Distance = Box2D.Collision.b2Distance,
      b2DistanceInput = Box2D.Collision.b2DistanceInput,
      b2DistanceOutput = Box2D.Collision.b2DistanceOutput,
      b2DistanceProxy = Box2D.Collision.b2DistanceProxy,
      b2DynamicTree = Box2D.Collision.b2DynamicTree,
      b2DynamicTreeBroadPhase = Box2D.Collision.b2DynamicTreeBroadPhase,
      b2DynamicTreeNode = Box2D.Collision.b2DynamicTreeNode,
      b2DynamicTreePair = Box2D.Collision.b2DynamicTreePair,
      b2Manifold = Box2D.Collision.b2Manifold,
      b2ManifoldPoint = Box2D.Collision.b2ManifoldPoint,
      b2Point = Box2D.Collision.b2Point,
      b2RayCastInput = Box2D.Collision.b2RayCastInput,
      b2RayCastOutput = Box2D.Collision.b2RayCastOutput,
      b2Segment = Box2D.Collision.b2Segment,
      b2SeparationFunction = Box2D.Collision.b2SeparationFunction,
      b2Simplex = Box2D.Collision.b2Simplex,
      b2SimplexCache = Box2D.Collision.b2SimplexCache,
      b2SimplexVertex = Box2D.Collision.b2SimplexVertex,
      b2TimeOfImpact = Box2D.Collision.b2TimeOfImpact,
      b2TOIInput = Box2D.Collision.b2TOIInput,
      b2WorldManifold = Box2D.Collision.b2WorldManifold,
      ClipVertex = Box2D.Collision.ClipVertex,
      Features = Box2D.Collision.Features,
      IBroadPhase = Box2D.Collision.IBroadPhase;

   Box2D.inherit(b2CircleShape, Box2D.Collision.Shapes.b2Shape);
   b2CircleShape.prototype.__super = Box2D.Collision.Shapes.b2Shape.prototype;
   b2CircleShape.b2CircleShape = function () {
      Box2D.Collision.Shapes.b2Shape.b2Shape.apply(this, arguments);
      this.m_p = new b2Vec2();
   };
   b2CircleShape.prototype.Copy = function () {
      var s = new b2CircleShape();
      s.Set(this);
      return s;
   }
   b2CircleShape.prototype.Set = function (other) {
      this.__super.Set.call(this, other);
      if (Box2D.is(other, b2CircleShape)) {
         var other2 = (other instanceof b2CircleShape ? other : null);
         this.m_p.SetV(other2.m_p);
      }
   }
   b2CircleShape.prototype.TestPoint = function (transform, p) {
      var tMat = transform.R;
      var dX = transform.position.x + (tMat.col1.x * this.m_p.x + tMat.col2.x * this.m_p.y);
      var dY = transform.position.y + (tMat.col1.y * this.m_p.x + tMat.col2.y * this.m_p.y);
      dX = p.x - dX;
      dY = p.y - dY;
      return (dX * dX + dY * dY) <= this.m_radius * this.m_radius;
   }
   b2CircleShape.prototype.RayCast = function (output, input, transform) {
      var tMat = transform.R;
      var positionX = transform.position.x + (tMat.col1.x * this.m_p.x + tMat.col2.x * this.m_p.y);
      var positionY = transform.position.y + (tMat.col1.y * this.m_p.x + tMat.col2.y * this.m_p.y);
      var sX = input.p1.x - positionX;
      var sY = input.p1.y - positionY;
      var b = (sX * sX + sY * sY) - this.m_radius * this.m_radius;
      var rX = input.p2.x - input.p1.x;
      var rY = input.p2.y - input.p1.y;
      var c = (sX * rX + sY * rY);
      var rr = (rX * rX + rY * rY);
      var sigma = c * c - rr * b;
      if (sigma < 0.0 || rr < Number.MIN_VALUE) {
         return false;
      }
      var a = (-(c + Math.sqrt(sigma)));
      if (0.0 <= a && a <= input.maxFraction * rr) {
         a /= rr;
         output.fraction = a;
         output.normal.x = sX + a * rX;
         output.normal.y = sY + a * rY;
         output.normal.Normalize();
         return true;
      }
      return false;
   }
   b2CircleShape.prototype.ComputeAABB = function (aabb, transform) {
      var tMat = transform.R;
      var pX = transform.position.x + (tMat.col1.x * this.m_p.x + tMat.col2.x * this.m_p.y);
      var pY = transform.position.y + (tMat.col1.y * this.m_p.x + tMat.col2.y * this.m_p.y);
      aabb.lowerBound.Set(pX - this.m_radius, pY - this.m_radius);
      aabb.upperBound.Set(pX + this.m_radius, pY + this.m_radius);
   }
   b2CircleShape.prototype.ComputeMass = function (massData, density) {
      if (density === undefined) density = 0;
      massData.mass = density * b2Settings.b2_pi * this.m_radius * this.m_radius;
      massData.center.SetV(this.m_p);
      massData.I = massData.mass * (0.5 * this.m_radius * this.m_radius + (this.m_p.x * this.m_p.x + this.m_p.y * this.m_p.y));
   }
   b2CircleShape.prototype.ComputeSubmergedArea = function (normal, offset, xf, c) {
      if (offset === undefined) offset = 0;
      var p = b2Math.MulX(xf, this.m_p);
      var l = (-(b2Math.Dot(normal, p) - offset));
      if (l < (-this.m_radius) + Number.MIN_VALUE) {
         return 0;
      }
      if (l > this.m_radius) {
         c.SetV(p);
         return Math.PI * this.m_radius * this.m_radius;
      }
      var r2 = this.m_radius * this.m_radius;
      var l2 = l * l;
      var area = r2 * (Math.asin(l / this.m_radius) + Math.PI / 2) + l * Math.sqrt(r2 - l2);
      var com = (-2 / 3 * Math.pow(r2 - l2, 1.5) / area);
      c.x = p.x + normal.x * com;
      c.y = p.y + normal.y * com;
      return area;
   }
   b2CircleShape.prototype.GetLocalPosition = function () {
      return this.m_p;
   }
   b2CircleShape.prototype.SetLocalPosition = function (position) {
      this.m_p.SetV(position);
   }
   b2CircleShape.prototype.GetRadius = function () {
      return this.m_radius;
   }
   b2CircleShape.prototype.SetRadius = function (radius) {
      if (radius === undefined) radius = 0;
      this.m_radius = radius;
   }
   b2CircleShape.prototype.b2CircleShape = function (radius) {
      if (radius === undefined) radius = 0;
      this.__super.b2Shape.call(this);
      this.m_type = b2Shape.e_circleShape;
      this.m_radius = radius;
   }
   b2EdgeChainDef.b2EdgeChainDef = function () {};
   b2EdgeChainDef.prototype.b2EdgeChainDef = function () {
      this.vertexCount = 0;
      this.isALoop = true;
      this.vertices = [];
   }
   Box2D.inherit(b2EdgeShape, Box2D.Collision.Shapes.b2Shape);
   b2EdgeShape.prototype.__super = Box2D.Collision.Shapes.b2Shape.prototype;
   b2EdgeShape.b2EdgeShape = function () {
      Box2D.Collision.Shapes.b2Shape.b2Shape.apply(this, arguments);
      this.s_supportVec = new b2Vec2();
      this.m_v1 = new b2Vec2();
      this.m_v2 = new b2Vec2();
      this.m_coreV1 = new b2Vec2();
      this.m_coreV2 = new b2Vec2();
      this.m_normal = new b2Vec2();
      this.m_direction = new b2Vec2();
      this.m_cornerDir1 = new b2Vec2();
      this.m_cornerDir2 = new b2Vec2();
   };
   b2EdgeShape.prototype.TestPoint = function (transform, p) {
      return false;
   }
   b2EdgeShape.prototype.RayCast = function (output, input, transform) {
      var tMat;
      var rX = input.p2.x - input.p1.x;
      var rY = input.p2.y - input.p1.y;
      tMat = transform.R;
      var v1X = transform.position.x + (tMat.col1.x * this.m_v1.x + tMat.col2.x * this.m_v1.y);
      var v1Y = transform.position.y + (tMat.col1.y * this.m_v1.x + tMat.col2.y * this.m_v1.y);
      var nX = transform.position.y + (tMat.col1.y * this.m_v2.x + tMat.col2.y * this.m_v2.y) - v1Y;
      var nY = (-(transform.position.x + (tMat.col1.x * this.m_v2.x + tMat.col2.x * this.m_v2.y) - v1X));
      var k_slop = 100.0 * Number.MIN_VALUE;
      var denom = (-(rX * nX + rY * nY));
      if (denom > k_slop) {
         var bX = input.p1.x - v1X;
         var bY = input.p1.y - v1Y;
         var a = (bX * nX + bY * nY);
         if (0.0 <= a && a <= input.maxFraction * denom) {
            var mu2 = (-rX * bY) + rY * bX;
            if ((-k_slop * denom) <= mu2 && mu2 <= denom * (1.0 + k_slop)) {
               a /= denom;
               output.fraction = a;
               var nLen = Math.sqrt(nX * nX + nY * nY);
               output.normal.x = nX / nLen;
               output.normal.y = nY / nLen;
               return true;
            }
         }
      }
      return false;
   }
   b2EdgeShape.prototype.ComputeAABB = function (aabb, transform) {
      var tMat = transform.R;
      var v1X = transform.position.x + (tMat.col1.x * this.m_v1.x + tMat.col2.x * this.m_v1.y);
      var v1Y = transform.position.y + (tMat.col1.y * this.m_v1.x + tMat.col2.y * this.m_v1.y);
      var v2X = transform.position.x + (tMat.col1.x * this.m_v2.x + tMat.col2.x * this.m_v2.y);
      var v2Y = transform.position.y + (tMat.col1.y * this.m_v2.x + tMat.col2.y * this.m_v2.y);
      if (v1X < v2X) {
         aabb.lowerBound.x = v1X;
         aabb.upperBound.x = v2X;
      }
      else {
         aabb.lowerBound.x = v2X;
         aabb.upperBound.x = v1X;
      }
      if (v1Y < v2Y) {
         aabb.lowerBound.y = v1Y;
         aabb.upperBound.y = v2Y;
      }
      else {
         aabb.lowerBound.y = v2Y;
         aabb.upperBound.y = v1Y;
      }
   }
   b2EdgeShape.prototype.ComputeMass = function (massData, density) {
      if (density === undefined) density = 0;
      massData.mass = 0;
      massData.center.SetV(this.m_v1);
      massData.I = 0;
   }
   b2EdgeShape.prototype.ComputeSubmergedArea = function (normal, offset, xf, c) {
      if (offset === undefined) offset = 0;
      var v0 = new b2Vec2(normal.x * offset, normal.y * offset);
      var v1 = b2Math.MulX(xf, this.m_v1);
      var v2 = b2Math.MulX(xf, this.m_v2);
      var d1 = b2Math.Dot(normal, v1) - offset;
      var d2 = b2Math.Dot(normal, v2) - offset;
      if (d1 > 0) {
         if (d2 > 0) {
            return 0;
         }
         else {
            v1.x = (-d2 / (d1 - d2) * v1.x) + d1 / (d1 - d2) * v2.x;
            v1.y = (-d2 / (d1 - d2) * v1.y) + d1 / (d1 - d2) * v2.y;
         }
      }
      else {
         if (d2 > 0) {
            v2.x = (-d2 / (d1 - d2) * v1.x) + d1 / (d1 - d2) * v2.x;
            v2.y = (-d2 / (d1 - d2) * v1.y) + d1 / (d1 - d2) * v2.y;
         }
         else {}
      }
      c.x = (v0.x + v1.x + v2.x) / 3;
      c.y = (v0.y + v1.y + v2.y) / 3;
      return 0.5 * ((v1.x - v0.x) * (v2.y - v0.y) - (v1.y - v0.y) * (v2.x - v0.x));
   }
   b2EdgeShape.prototype.GetLength = function () {
      return this.m_length;
   }
   b2EdgeShape.prototype.GetVertex1 = function () {
      return this.m_v1;
   }
   b2EdgeShape.prototype.GetVertex2 = function () {
      return this.m_v2;
   }
   b2EdgeShape.prototype.GetCoreVertex1 = function () {
      return this.m_coreV1;
   }
   b2EdgeShape.prototype.GetCoreVertex2 = function () {
      return this.m_coreV2;
   }
   b2EdgeShape.prototype.GetNormalVector = function () {
      return this.m_normal;
   }
   b2EdgeShape.prototype.GetDirectionVector = function () {
      return this.m_direction;
   }
   b2EdgeShape.prototype.GetCorner1Vector = function () {
      return this.m_cornerDir1;
   }
   b2EdgeShape.prototype.GetCorner2Vector = function () {
      return this.m_cornerDir2;
   }
   b2EdgeShape.prototype.Corner1IsConvex = function () {
      return this.m_cornerConvex1;
   }
   b2EdgeShape.prototype.Corner2IsConvex = function () {
      return this.m_cornerConvex2;
   }
   b2EdgeShape.prototype.GetFirstVertex = function (xf) {
      var tMat = xf.R;
      return new b2Vec2(xf.position.x + (tMat.col1.x * this.m_coreV1.x + tMat.col2.x * this.m_coreV1.y), xf.position.y + (tMat.col1.y * this.m_coreV1.x + tMat.col2.y * this.m_coreV1.y));
   }
   b2EdgeShape.prototype.GetNextEdge = function () {
      return this.m_nextEdge;
   }
   b2EdgeShape.prototype.GetPrevEdge = function () {
      return this.m_prevEdge;
   }
   b2EdgeShape.prototype.Support = function (xf, dX, dY) {
      if (dX === undefined) dX = 0;
      if (dY === undefined) dY = 0;
      var tMat = xf.R;
      var v1X = xf.position.x + (tMat.col1.x * this.m_coreV1.x + tMat.col2.x * this.m_coreV1.y);
      var v1Y = xf.position.y + (tMat.col1.y * this.m_coreV1.x + tMat.col2.y * this.m_coreV1.y);
      var v2X = xf.position.x + (tMat.col1.x * this.m_coreV2.x + tMat.col2.x * this.m_coreV2.y);
      var v2Y = xf.position.y + (tMat.col1.y * this.m_coreV2.x + tMat.col2.y * this.m_coreV2.y);
      if ((v1X * dX + v1Y * dY) > (v2X * dX + v2Y * dY)) {
         this.s_supportVec.x = v1X;
         this.s_supportVec.y = v1Y;
      }
      else {
         this.s_supportVec.x = v2X;
         this.s_supportVec.y = v2Y;
      }
      return this.s_supportVec;
   }
   b2EdgeShape.prototype.b2EdgeShape = function (v1, v2) {
      this.__super.b2Shape.call(this);
      this.m_type = b2Shape.e_edgeShape;
      this.m_prevEdge = null;
      this.m_nextEdge = null;
      this.m_v1 = v1;
      this.m_v2 = v2;
      this.m_direction.Set(this.m_v2.x - this.m_v1.x, this.m_v2.y - this.m_v1.y);
      this.m_length = this.m_direction.Normalize();
      this.m_normal.Set(this.m_direction.y, (-this.m_direction.x));
      this.m_coreV1.Set((-b2Settings.b2_toiSlop * (this.m_normal.x - this.m_direction.x)) + this.m_v1.x, (-b2Settings.b2_toiSlop * (this.m_normal.y - this.m_direction.y)) + this.m_v1.y);
      this.m_coreV2.Set((-b2Settings.b2_toiSlop * (this.m_normal.x + this.m_direction.x)) + this.m_v2.x, (-b2Settings.b2_toiSlop * (this.m_normal.y + this.m_direction.y)) + this.m_v2.y);
      this.m_cornerDir1 = this.m_normal;
      this.m_cornerDir2.Set((-this.m_normal.x), (-this.m_normal.y));
   }
   b2EdgeShape.prototype.SetPrevEdge = function (edge, core, cornerDir, convex) {
      this.m_prevEdge = edge;
      this.m_coreV1 = core;
      this.m_cornerDir1 = cornerDir;
      this.m_cornerConvex1 = convex;
   }
   b2EdgeShape.prototype.SetNextEdge = function (edge, core, cornerDir, convex) {
      this.m_nextEdge = edge;
      this.m_coreV2 = core;
      this.m_cornerDir2 = cornerDir;
      this.m_cornerConvex2 = convex;
   }
   b2MassData.b2MassData = function () {
      this.mass = 0.0;
      this.center = new b2Vec2(0, 0);
      this.I = 0.0;
   };
   Box2D.inherit(b2PolygonShape, Box2D.Collision.Shapes.b2Shape);
   b2PolygonShape.prototype.__super = Box2D.Collision.Shapes.b2Shape.prototype;
   b2PolygonShape.b2PolygonShape = function () {
      Box2D.Collision.Shapes.b2Shape.b2Shape.apply(this, arguments);
   };
   b2PolygonShape.prototype.Copy = function () {
      var s = new b2PolygonShape();
      s.Set(this);
      return s;
   }
   b2PolygonShape.prototype.Set = function (other) {
      this.__super.Set.call(this, other);
      if (Box2D.is(other, b2PolygonShape)) {
         var other2 = (other instanceof b2PolygonShape ? other : null);
         this.m_centroid.SetV(other2.m_centroid);
         this.m_vertexCount = other2.m_vertexCount;
         this.Reserve(this.m_vertexCount);
         for (var i = 0; i < this.m_vertexCount; i++) {
            this.m_vertices[i].SetV(other2.m_vertices[i]);
            this.m_normals[i].SetV(other2.m_normals[i]);
         }
      }
   }
   b2PolygonShape.prototype.SetAsArray = function (vertices, vertexCount) {
      if (vertexCount === undefined) vertexCount = 0;
      var v = new Vector();
      var i = 0,
         tVec;
      for (i = 0;
      i < vertices.length; ++i) {
         tVec = vertices[i];
         v.push(tVec);
      }
      this.SetAsVector(v, vertexCount);
   }
   b2PolygonShape.AsArray = function (vertices, vertexCount) {
      if (vertexCount === undefined) vertexCount = 0;
      var polygonShape = new b2PolygonShape();
      polygonShape.SetAsArray(vertices, vertexCount);
      return polygonShape;
   }
   b2PolygonShape.prototype.SetAsVector = function (vertices, vertexCount) {
      if (vertexCount === undefined) vertexCount = 0;
      if (vertexCount == 0) vertexCount = vertices.length;
      b2Settings.b2Assert(2 <= vertexCount);
      this.m_vertexCount = vertexCount;
      this.Reserve(vertexCount);
      var i = 0;
      for (i = 0;
      i < this.m_vertexCount; i++) {
         this.m_vertices[i].SetV(vertices[i]);
      }
      for (i = 0;
      i < this.m_vertexCount; ++i) {
         var i1 = parseInt(i);
         var i2 = parseInt(i + 1 < this.m_vertexCount ? i + 1 : 0);
         var edge = b2Math.SubtractVV(this.m_vertices[i2], this.m_vertices[i1]);
         b2Settings.b2Assert(edge.LengthSquared() > Number.MIN_VALUE);
         this.m_normals[i].SetV(b2Math.CrossVF(edge, 1.0));
         this.m_normals[i].Normalize();
      }
      this.m_centroid = b2PolygonShape.ComputeCentroid(this.m_vertices, this.m_vertexCount);
   }
   b2PolygonShape.AsVector = function (vertices, vertexCount) {
      if (vertexCount === undefined) vertexCount = 0;
      var polygonShape = new b2PolygonShape();
      polygonShape.SetAsVector(vertices, vertexCount);
      return polygonShape;
   }
   b2PolygonShape.prototype.SetAsBox = function (hx, hy) {
      if (hx === undefined) hx = 0;
      if (hy === undefined) hy = 0;
      this.m_vertexCount = 4;
      this.Reserve(4);
      this.m_vertices[0].Set((-hx), (-hy));
      this.m_vertices[1].Set(hx, (-hy));
      this.m_vertices[2].Set(hx, hy);
      this.m_vertices[3].Set((-hx), hy);
      this.m_normals[0].Set(0.0, (-1.0));
      this.m_normals[1].Set(1.0, 0.0);
      this.m_normals[2].Set(0.0, 1.0);
      this.m_normals[3].Set((-1.0), 0.0);
      this.m_centroid.SetZero();
   }
   b2PolygonShape.AsBox = function (hx, hy) {
      if (hx === undefined) hx = 0;
      if (hy === undefined) hy = 0;
      var polygonShape = new b2PolygonShape();
      polygonShape.SetAsBox(hx, hy);
      return polygonShape;
   }
   b2PolygonShape.prototype.SetAsOrientedBox = function (hx, hy, center, angle) {
      if (hx === undefined) hx = 0;
      if (hy === undefined) hy = 0;
      if (center === undefined) center = null;
      if (angle === undefined) angle = 0.0;
      this.m_vertexCount = 4;
      this.Reserve(4);
      this.m_vertices[0].Set((-hx), (-hy));
      this.m_vertices[1].Set(hx, (-hy));
      this.m_vertices[2].Set(hx, hy);
      this.m_vertices[3].Set((-hx), hy);
      this.m_normals[0].Set(0.0, (-1.0));
      this.m_normals[1].Set(1.0, 0.0);
      this.m_normals[2].Set(0.0, 1.0);
      this.m_normals[3].Set((-1.0), 0.0);
      this.m_centroid = center;
      var xf = new b2Transform();
      xf.position = center;
      xf.R.Set(angle);
      for (var i = 0; i < this.m_vertexCount; ++i) {
         this.m_vertices[i] = b2Math.MulX(xf, this.m_vertices[i]);
         this.m_normals[i] = b2Math.MulMV(xf.R, this.m_normals[i]);
      }
   }
   b2PolygonShape.AsOrientedBox = function (hx, hy, center, angle) {
      if (hx === undefined) hx = 0;
      if (hy === undefined) hy = 0;
      if (center === undefined) center = null;
      if (angle === undefined) angle = 0.0;
      var polygonShape = new b2PolygonShape();
      polygonShape.SetAsOrientedBox(hx, hy, center, angle);
      return polygonShape;
   }
   b2PolygonShape.prototype.SetAsEdge = function (v1, v2) {
      this.m_vertexCount = 2;
      this.Reserve(2);
      this.m_vertices[0].SetV(v1);
      this.m_vertices[1].SetV(v2);
      this.m_centroid.x = 0.5 * (v1.x + v2.x);
      this.m_centroid.y = 0.5 * (v1.y + v2.y);
      this.m_normals[0] = b2Math.CrossVF(b2Math.SubtractVV(v2, v1), 1.0);
      this.m_normals[0].Normalize();
      this.m_normals[1].x = (-this.m_normals[0].x);
      this.m_normals[1].y = (-this.m_normals[0].y);
   }
   b2PolygonShape.AsEdge = function (v1, v2) {
      var polygonShape = new b2PolygonShape();
      polygonShape.SetAsEdge(v1, v2);
      return polygonShape;
   }
   b2PolygonShape.prototype.TestPoint = function (xf, p) {
      var tVec;
      var tMat = xf.R;
      var tX = p.x - xf.position.x;
      var tY = p.y - xf.position.y;
      var pLocalX = (tX * tMat.col1.x + tY * tMat.col1.y);
      var pLocalY = (tX * tMat.col2.x + tY * tMat.col2.y);
      for (var i = 0; i < this.m_vertexCount; ++i) {
         tVec = this.m_vertices[i];
         tX = pLocalX - tVec.x;
         tY = pLocalY - tVec.y;
         tVec = this.m_normals[i];
         var dot = (tVec.x * tX + tVec.y * tY);
         if (dot > 0.0) {
            return false;
         }
      }
      return true;
   }
   b2PolygonShape.prototype.RayCast = function (output, input, transform) {
      var lower = 0.0;
      var upper = input.maxFraction;
      var tX = 0;
      var tY = 0;
      var tMat;
      var tVec;
      tX = input.p1.x - transform.position.x;
      tY = input.p1.y - transform.position.y;
      tMat = transform.R;
      var p1X = (tX * tMat.col1.x + tY * tMat.col1.y);
      var p1Y = (tX * tMat.col2.x + tY * tMat.col2.y);
      tX = input.p2.x - transform.position.x;
      tY = input.p2.y - transform.position.y;
      tMat = transform.R;
      var p2X = (tX * tMat.col1.x + tY * tMat.col1.y);
      var p2Y = (tX * tMat.col2.x + tY * tMat.col2.y);
      var dX = p2X - p1X;
      var dY = p2Y - p1Y;
      var index = parseInt((-1));
      for (var i = 0; i < this.m_vertexCount; ++i) {
         tVec = this.m_vertices[i];
         tX = tVec.x - p1X;
         tY = tVec.y - p1Y;
         tVec = this.m_normals[i];
         var numerator = (tVec.x * tX + tVec.y * tY);
         var denominator = (tVec.x * dX + tVec.y * dY);
         if (denominator == 0.0) {
            if (numerator < 0.0) {
               return false;
            }
         }
         else {
            if (denominator < 0.0 && numerator < lower * denominator) {
               lower = numerator / denominator;
               index = i;
            }
            else if (denominator > 0.0 && numerator < upper * denominator) {
               upper = numerator / denominator;
            }
         }
         if (upper < lower - Number.MIN_VALUE) {
            return false;
         }
      }
      if (index >= 0) {
         output.fraction = lower;
         tMat = transform.R;
         tVec = this.m_normals[index];
         output.normal.x = (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
         output.normal.y = (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
         return true;
      }
      return false;
   }
   b2PolygonShape.prototype.ComputeAABB = function (aabb, xf) {
      var tMat = xf.R;
      var tVec = this.m_vertices[0];
      var lowerX = xf.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
      var lowerY = xf.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
      var upperX = lowerX;
      var upperY = lowerY;
      for (var i = 1; i < this.m_vertexCount; ++i) {
         tVec = this.m_vertices[i];
         var vX = xf.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
         var vY = xf.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
         lowerX = lowerX < vX ? lowerX : vX;
         lowerY = lowerY < vY ? lowerY : vY;
         upperX = upperX > vX ? upperX : vX;
         upperY = upperY > vY ? upperY : vY;
      }
      aabb.lowerBound.x = lowerX - this.m_radius;
      aabb.lowerBound.y = lowerY - this.m_radius;
      aabb.upperBound.x = upperX + this.m_radius;
      aabb.upperBound.y = upperY + this.m_radius;
   }
   b2PolygonShape.prototype.ComputeMass = function (massData, density) {
      if (density === undefined) density = 0;
      if (this.m_vertexCount == 2) {
         massData.center.x = 0.5 * (this.m_vertices[0].x + this.m_vertices[1].x);
         massData.center.y = 0.5 * (this.m_vertices[0].y + this.m_vertices[1].y);
         massData.mass = 0.0;
         massData.I = 0.0;
         return;
      }
      var centerX = 0.0;
      var centerY = 0.0;
      var area = 0.0;
      var I = 0.0;
      var p1X = 0.0;
      var p1Y = 0.0;
      var k_inv3 = 1.0 / 3.0;
      for (var i = 0; i < this.m_vertexCount; ++i) {
         var p2 = this.m_vertices[i];
         var p3 = i + 1 < this.m_vertexCount ? this.m_vertices[parseInt(i + 1)] : this.m_vertices[0];
         var e1X = p2.x - p1X;
         var e1Y = p2.y - p1Y;
         var e2X = p3.x - p1X;
         var e2Y = p3.y - p1Y;
         var D = e1X * e2Y - e1Y * e2X;
         var triangleArea = 0.5 * D;area += triangleArea;
         centerX += triangleArea * k_inv3 * (p1X + p2.x + p3.x);
         centerY += triangleArea * k_inv3 * (p1Y + p2.y + p3.y);
         var px = p1X;
         var py = p1Y;
         var ex1 = e1X;
         var ey1 = e1Y;
         var ex2 = e2X;
         var ey2 = e2Y;
         var intx2 = k_inv3 * (0.25 * (ex1 * ex1 + ex2 * ex1 + ex2 * ex2) + (px * ex1 + px * ex2)) + 0.5 * px * px;
         var inty2 = k_inv3 * (0.25 * (ey1 * ey1 + ey2 * ey1 + ey2 * ey2) + (py * ey1 + py * ey2)) + 0.5 * py * py;I += D * (intx2 + inty2);
      }
      massData.mass = density * area;
      centerX *= 1.0 / area;
      centerY *= 1.0 / area;
      massData.center.Set(centerX, centerY);
      massData.I = density * I;
   }
   b2PolygonShape.prototype.ComputeSubmergedArea = function (normal, offset, xf, c) {
      if (offset === undefined) offset = 0;
      var normalL = b2Math.MulTMV(xf.R, normal);
      var offsetL = offset - b2Math.Dot(normal, xf.position);
      var depths = new Vector_a2j_Number();
      var diveCount = 0;
      var intoIndex = parseInt((-1));
      var outoIndex = parseInt((-1));
      var lastSubmerged = false;
      var i = 0;
      for (i = 0;
      i < this.m_vertexCount; ++i) {
         depths[i] = b2Math.Dot(normalL, this.m_vertices[i]) - offsetL;
         var isSubmerged = depths[i] < (-Number.MIN_VALUE);
         if (i > 0) {
            if (isSubmerged) {
               if (!lastSubmerged) {
                  intoIndex = i - 1;
                  diveCount++;
               }
            }
            else {
               if (lastSubmerged) {
                  outoIndex = i - 1;
                  diveCount++;
               }
            }
         }
         lastSubmerged = isSubmerged;
      }
      switch (diveCount) {
      case 0:
         if (lastSubmerged) {
            var md = new b2MassData();
            this.ComputeMass(md, 1);
            c.SetV(b2Math.MulX(xf, md.center));
            return md.mass;
         }
         else {
            return 0;
         }
         break;
      case 1:
         if (intoIndex == (-1)) {
            intoIndex = this.m_vertexCount - 1;
         }
         else {
            outoIndex = this.m_vertexCount - 1;
         }
         break;
      }
      var intoIndex2 = parseInt((intoIndex + 1) % this.m_vertexCount);
      var outoIndex2 = parseInt((outoIndex + 1) % this.m_vertexCount);
      var intoLamdda = (0 - depths[intoIndex]) / (depths[intoIndex2] - depths[intoIndex]);
      var outoLamdda = (0 - depths[outoIndex]) / (depths[outoIndex2] - depths[outoIndex]);
      var intoVec = new b2Vec2(this.m_vertices[intoIndex].x * (1 - intoLamdda) + this.m_vertices[intoIndex2].x * intoLamdda, this.m_vertices[intoIndex].y * (1 - intoLamdda) + this.m_vertices[intoIndex2].y * intoLamdda);
      var outoVec = new b2Vec2(this.m_vertices[outoIndex].x * (1 - outoLamdda) + this.m_vertices[outoIndex2].x * outoLamdda, this.m_vertices[outoIndex].y * (1 - outoLamdda) + this.m_vertices[outoIndex2].y * outoLamdda);
      var area = 0;
      var center = new b2Vec2();
      var p2 = this.m_vertices[intoIndex2];
      var p3;
      i = intoIndex2;
      while (i != outoIndex2) {
         i = (i + 1) % this.m_vertexCount;
         if (i == outoIndex2) p3 = outoVec;
         else p3 = this.m_vertices[i];
         var triangleArea = 0.5 * ((p2.x - intoVec.x) * (p3.y - intoVec.y) - (p2.y - intoVec.y) * (p3.x - intoVec.x));
         area += triangleArea;
         center.x += triangleArea * (intoVec.x + p2.x + p3.x) / 3;
         center.y += triangleArea * (intoVec.y + p2.y + p3.y) / 3;
         p2 = p3;
      }
      center.Multiply(1 / area);
      c.SetV(b2Math.MulX(xf, center));
      return area;
   }
   b2PolygonShape.prototype.GetVertexCount = function () {
      return this.m_vertexCount;
   }
   b2PolygonShape.prototype.GetVertices = function () {
      return this.m_vertices;
   }
   b2PolygonShape.prototype.GetNormals = function () {
      return this.m_normals;
   }
   b2PolygonShape.prototype.GetSupport = function (d) {
      var bestIndex = 0;
      var bestValue = this.m_vertices[0].x * d.x + this.m_vertices[0].y * d.y;
      for (var i = 1; i < this.m_vertexCount; ++i) {
         var value = this.m_vertices[i].x * d.x + this.m_vertices[i].y * d.y;
         if (value > bestValue) {
            bestIndex = i;
            bestValue = value;
         }
      }
      return bestIndex;
   }
   b2PolygonShape.prototype.GetSupportVertex = function (d) {
      var bestIndex = 0;
      var bestValue = this.m_vertices[0].x * d.x + this.m_vertices[0].y * d.y;
      for (var i = 1; i < this.m_vertexCount; ++i) {
         var value = this.m_vertices[i].x * d.x + this.m_vertices[i].y * d.y;
         if (value > bestValue) {
            bestIndex = i;
            bestValue = value;
         }
      }
      return this.m_vertices[bestIndex];
   }
   b2PolygonShape.prototype.Validate = function () {
      return false;
   }
   b2PolygonShape.prototype.b2PolygonShape = function () {
      this.__super.b2Shape.call(this);
      this.m_type = b2Shape.e_polygonShape;
      this.m_centroid = new b2Vec2();
      this.m_vertices = new Vector();
      this.m_normals = new Vector();
   }
   b2PolygonShape.prototype.Reserve = function (count) {
      if (count === undefined) count = 0;
      for (var i = parseInt(this.m_vertices.length); i < count; i++) {
         this.m_vertices[i] = new b2Vec2();
         this.m_normals[i] = new b2Vec2();
      }
   }
   b2PolygonShape.ComputeCentroid = function (vs, count) {
      if (count === undefined) count = 0;
      var c = new b2Vec2();
      var area = 0.0;
      var p1X = 0.0;
      var p1Y = 0.0;
      var inv3 = 1.0 / 3.0;
      for (var i = 0; i < count; ++i) {
         var p2 = vs[i];
         var p3 = i + 1 < count ? vs[parseInt(i + 1)] : vs[0];
         var e1X = p2.x - p1X;
         var e1Y = p2.y - p1Y;
         var e2X = p3.x - p1X;
         var e2Y = p3.y - p1Y;
         var D = (e1X * e2Y - e1Y * e2X);
         var triangleArea = 0.5 * D;area += triangleArea;
         c.x += triangleArea * inv3 * (p1X + p2.x + p3.x);
         c.y += triangleArea * inv3 * (p1Y + p2.y + p3.y);
      }
      c.x *= 1.0 / area;
      c.y *= 1.0 / area;
      return c;
   }
   b2PolygonShape.ComputeOBB = function (obb, vs, count) {
      if (count === undefined) count = 0;
      var i = 0;
      var p = new Vector(count + 1);
      for (i = 0;
      i < count; ++i) {
         p[i] = vs[i];
      }
      p[count] = p[0];
      var minArea = Number.MAX_VALUE;
      for (i = 1;
      i <= count; ++i) {
         var root = p[parseInt(i - 1)];
         var uxX = p[i].x - root.x;
         var uxY = p[i].y - root.y;
         var length = Math.sqrt(uxX * uxX + uxY * uxY);
         uxX /= length;
         uxY /= length;
         var uyX = (-uxY);
         var uyY = uxX;
         var lowerX = Number.MAX_VALUE;
         var lowerY = Number.MAX_VALUE;
         var upperX = (-Number.MAX_VALUE);
         var upperY = (-Number.MAX_VALUE);
         for (var j = 0; j < count; ++j) {
            var dX = p[j].x - root.x;
            var dY = p[j].y - root.y;
            var rX = (uxX * dX + uxY * dY);
            var rY = (uyX * dX + uyY * dY);
            if (rX < lowerX) lowerX = rX;
            if (rY < lowerY) lowerY = rY;
            if (rX > upperX) upperX = rX;
            if (rY > upperY) upperY = rY;
         }
         var area = (upperX - lowerX) * (upperY - lowerY);
         if (area < 0.95 * minArea) {
            minArea = area;
            obb.R.col1.x = uxX;
            obb.R.col1.y = uxY;
            obb.R.col2.x = uyX;
            obb.R.col2.y = uyY;
            var centerX = 0.5 * (lowerX + upperX);
            var centerY = 0.5 * (lowerY + upperY);
            var tMat = obb.R;
            obb.center.x = root.x + (tMat.col1.x * centerX + tMat.col2.x * centerY);
            obb.center.y = root.y + (tMat.col1.y * centerX + tMat.col2.y * centerY);
            obb.extents.x = 0.5 * (upperX - lowerX);
            obb.extents.y = 0.5 * (upperY - lowerY);
         }
      }
   }
   Box2D.postDefs.push(function () {
      Box2D.Collision.Shapes.b2PolygonShape.s_mat = new b2Mat22();
   });
   b2Shape.b2Shape = function () {};
   b2Shape.prototype.Copy = function () {
      return null;
   }
   b2Shape.prototype.Set = function (other) {
      this.m_radius = other.m_radius;
   }
   b2Shape.prototype.GetType = function () {
      return this.m_type;
   }
   b2Shape.prototype.TestPoint = function (xf, p) {
      return false;
   }
   b2Shape.prototype.RayCast = function (output, input, transform) {
      return false;
   }
   b2Shape.prototype.ComputeAABB = function (aabb, xf) {}
   b2Shape.prototype.ComputeMass = function (massData, density) {
      if (density === undefined) density = 0;
   }
   b2Shape.prototype.ComputeSubmergedArea = function (normal, offset, xf, c) {
      if (offset === undefined) offset = 0;
      return 0;
   }
   b2Shape.TestOverlap = function (shape1, transform1, shape2, transform2) {
      var input = new b2DistanceInput();
      input.proxyA = new b2DistanceProxy();
      input.proxyA.Set(shape1);
      input.proxyB = new b2DistanceProxy();
      input.proxyB.Set(shape2);
      input.transformA = transform1;
      input.transformB = transform2;
      input.useRadii = true;
      var simplexCache = new b2SimplexCache();
      simplexCache.count = 0;
      var output = new b2DistanceOutput();
      b2Distance.Distance(output, simplexCache, input);
      return output.distance < 10.0 * Number.MIN_VALUE;
   }
   b2Shape.prototype.b2Shape = function () {
      this.m_type = b2Shape.e_unknownShape;
      this.m_radius = b2Settings.b2_linearSlop;
   }
   Box2D.postDefs.push(function () {
      Box2D.Collision.Shapes.b2Shape.e_unknownShape = parseInt((-1));
      Box2D.Collision.Shapes.b2Shape.e_circleShape = 0;
      Box2D.Collision.Shapes.b2Shape.e_polygonShape = 1;
      Box2D.Collision.Shapes.b2Shape.e_edgeShape = 2;
      Box2D.Collision.Shapes.b2Shape.e_shapeTypeCount = 3;
      Box2D.Collision.Shapes.b2Shape.e_hitCollide = 1;
      Box2D.Collision.Shapes.b2Shape.e_missCollide = 0;
      Box2D.Collision.Shapes.b2Shape.e_startsInsideCollide = parseInt((-1));
   });
})();
(function () {
   var b2Color = Box2D.Common.b2Color,
      b2internal = Box2D.Common.b2internal,
      b2Settings = Box2D.Common.b2Settings,
      b2Mat22 = Box2D.Common.Math.b2Mat22,
      b2Mat33 = Box2D.Common.Math.b2Mat33,
      b2Math = Box2D.Common.Math.b2Math,
      b2Sweep = Box2D.Common.Math.b2Sweep,
      b2Transform = Box2D.Common.Math.b2Transform,
      b2Vec2 = Box2D.Common.Math.b2Vec2,
      b2Vec3 = Box2D.Common.Math.b2Vec3;

   b2Color.b2Color = function () {
      this._r = 0;
      this._g = 0;
      this._b = 0;
   };
   b2Color.prototype.b2Color = function (rr, gg, bb) {
      if (rr === undefined) rr = 0;
      if (gg === undefined) gg = 0;
      if (bb === undefined) bb = 0;
      this._r = Box2D.parseUInt(255 * b2Math.Clamp(rr, 0.0, 1.0));
      this._g = Box2D.parseUInt(255 * b2Math.Clamp(gg, 0.0, 1.0));
      this._b = Box2D.parseUInt(255 * b2Math.Clamp(bb, 0.0, 1.0));
   }
   b2Color.prototype.Set = function (rr, gg, bb) {
      if (rr === undefined) rr = 0;
      if (gg === undefined) gg = 0;
      if (bb === undefined) bb = 0;
      this._r = Box2D.parseUInt(255 * b2Math.Clamp(rr, 0.0, 1.0));
      this._g = Box2D.parseUInt(255 * b2Math.Clamp(gg, 0.0, 1.0));
      this._b = Box2D.parseUInt(255 * b2Math.Clamp(bb, 0.0, 1.0));
   }
   Object.defineProperty(b2Color.prototype, 'r', {
      enumerable: false,
      configurable: true,
      set: function (rr) {
         if (rr === undefined) rr = 0;
         this._r = Box2D.parseUInt(255 * b2Math.Clamp(rr, 0.0, 1.0));
      }
   });
   Object.defineProperty(b2Color.prototype, 'g', {
      enumerable: false,
      configurable: true,
      set: function (gg) {
         if (gg === undefined) gg = 0;
         this._g = Box2D.parseUInt(255 * b2Math.Clamp(gg, 0.0, 1.0));
      }
   });
   Object.defineProperty(b2Color.prototype, 'b', {
      enumerable: false,
      configurable: true,
      set: function (bb) {
         if (bb === undefined) bb = 0;
         this._b = Box2D.parseUInt(255 * b2Math.Clamp(bb, 0.0, 1.0));
      }
   });
   Object.defineProperty(b2Color.prototype, 'color', {
      enumerable: false,
      configurable: true,
      get: function () {
         return (this._r << 16) | (this._g << 8) | (this._b);
      }
   });
   b2Settings.b2Settings = function () {};
   b2Settings.b2MixFriction = function (friction1, friction2) {
      if (friction1 === undefined) friction1 = 0;
      if (friction2 === undefined) friction2 = 0;
      return Math.sqrt(friction1 * friction2);
   }
   b2Settings.b2MixRestitution = function (restitution1, restitution2) {
      if (restitution1 === undefined) restitution1 = 0;
      if (restitution2 === undefined) restitution2 = 0;
      return restitution1 > restitution2 ? restitution1 : restitution2;
   }
   b2Settings.b2Assert = function (a) {
      if (!a) {
         throw "Assertion Failed";
      }
   }
   Box2D.postDefs.push(function () {
      Box2D.Common.b2Settings.VERSION = "2.1alpha";
      Box2D.Common.b2Settings.USHRT_MAX = 0x0000ffff;
      Box2D.Common.b2Settings.b2_pi = Math.PI;
      Box2D.Common.b2Settings.b2_maxManifoldPoints = 2;
      Box2D.Common.b2Settings.b2_aabbExtension = 0.1;
      Box2D.Common.b2Settings.b2_aabbMultiplier = 2.0;
      Box2D.Common.b2Settings.b2_polygonRadius = 2.0 * b2Settings.b2_linearSlop;
      Box2D.Common.b2Settings.b2_linearSlop = 0.005;
      Box2D.Common.b2Settings.b2_angularSlop = 2.0 / 180.0 * b2Settings.b2_pi;
      Box2D.Common.b2Settings.b2_toiSlop = 8.0 * b2Settings.b2_linearSlop;
      Box2D.Common.b2Settings.b2_maxTOIContactsPerIsland = 32;
      Box2D.Common.b2Settings.b2_maxTOIJointsPerIsland = 32;
      Box2D.Common.b2Settings.b2_velocityThreshold = 1.0;
      Box2D.Common.b2Settings.b2_maxLinearCorrection = 0.2;
      Box2D.Common.b2Settings.b2_maxAngularCorrection = 8.0 / 180.0 * b2Settings.b2_pi;
      Box2D.Common.b2Settings.b2_maxTranslation = 2.0;
      Box2D.Common.b2Settings.b2_maxTranslationSquared = b2Settings.b2_maxTranslation * b2Settings.b2_maxTranslation;
      Box2D.Common.b2Settings.b2_maxRotation = 0.5 * b2Settings.b2_pi;
      Box2D.Common.b2Settings.b2_maxRotationSquared = b2Settings.b2_maxRotation * b2Settings.b2_maxRotation;
      Box2D.Common.b2Settings.b2_contactBaumgarte = 0.2;
      Box2D.Common.b2Settings.b2_timeToSleep = 0.5;
      Box2D.Common.b2Settings.b2_linearSleepTolerance = 0.01;
      Box2D.Common.b2Settings.b2_angularSleepTolerance = 2.0 / 180.0 * b2Settings.b2_pi;
   });
})();
(function () {
   var b2AABB = Box2D.Collision.b2AABB,
      b2Color = Box2D.Common.b2Color,
      b2internal = Box2D.Common.b2internal,
      b2Settings = Box2D.Common.b2Settings,
      b2Mat22 = Box2D.Common.Math.b2Mat22,
      b2Mat33 = Box2D.Common.Math.b2Mat33,
      b2Math = Box2D.Common.Math.b2Math,
      b2Sweep = Box2D.Common.Math.b2Sweep,
      b2Transform = Box2D.Common.Math.b2Transform,
      b2Vec2 = Box2D.Common.Math.b2Vec2,
      b2Vec3 = Box2D.Common.Math.b2Vec3;

   b2Mat22.b2Mat22 = function () {
      this.col1 = new b2Vec2();
      this.col2 = new b2Vec2();
   };
   b2Mat22.prototype.b2Mat22 = function () {
      this.SetIdentity();
   }
   b2Mat22.FromAngle = function (angle) {
      if (angle === undefined) angle = 0;
      var mat = new b2Mat22();
      mat.Set(angle);
      return mat;
   }
   b2Mat22.FromVV = function (c1, c2) {
      var mat = new b2Mat22();
      mat.SetVV(c1, c2);
      return mat;
   }
   b2Mat22.prototype.Set = function (angle) {
      if (angle === undefined) angle = 0;
      var c = Math.cos(angle);
      var s = Math.sin(angle);
      this.col1.x = c;
      this.col2.x = (-s);
      this.col1.y = s;
      this.col2.y = c;
   }
   b2Mat22.prototype.SetVV = function (c1, c2) {
      this.col1.SetV(c1);
      this.col2.SetV(c2);
   }
   b2Mat22.prototype.Copy = function () {
      var mat = new b2Mat22();
      mat.SetM(this);
      return mat;
   }
   b2Mat22.prototype.SetM = function (m) {
      this.col1.SetV(m.col1);
      this.col2.SetV(m.col2);
   }
   b2Mat22.prototype.AddM = function (m) {
      this.col1.x += m.col1.x;
      this.col1.y += m.col1.y;
      this.col2.x += m.col2.x;
      this.col2.y += m.col2.y;
   }
   b2Mat22.prototype.SetIdentity = function () {
      this.col1.x = 1.0;
      this.col2.x = 0.0;
      this.col1.y = 0.0;
      this.col2.y = 1.0;
   }
   b2Mat22.prototype.SetZero = function () {
      this.col1.x = 0.0;
      this.col2.x = 0.0;
      this.col1.y = 0.0;
      this.col2.y = 0.0;
   }
   b2Mat22.prototype.GetAngle = function () {
      return Math.atan2(this.col1.y, this.col1.x);
   }
   b2Mat22.prototype.GetInverse = function (out) {
      var a = this.col1.x;
      var b = this.col2.x;
      var c = this.col1.y;
      var d = this.col2.y;
      var det = a * d - b * c;
      if (det != 0.0) {
         det = 1.0 / det;
      }
      out.col1.x = det * d;
      out.col2.x = (-det * b);
      out.col1.y = (-det * c);
      out.col2.y = det * a;
      return out;
   }
   b2Mat22.prototype.Solve = function (out, bX, bY) {
      if (bX === undefined) bX = 0;
      if (bY === undefined) bY = 0;
      var a11 = this.col1.x;
      var a12 = this.col2.x;
      var a21 = this.col1.y;
      var a22 = this.col2.y;
      var det = a11 * a22 - a12 * a21;
      if (det != 0.0) {
         det = 1.0 / det;
      }
      out.x = det * (a22 * bX - a12 * bY);
      out.y = det * (a11 * bY - a21 * bX);
      return out;
   }
   b2Mat22.prototype.Abs = function () {
      this.col1.Abs();
      this.col2.Abs();
   }
   b2Mat33.b2Mat33 = function () {
      this.col1 = new b2Vec3();
      this.col2 = new b2Vec3();
      this.col3 = new b2Vec3();
   };
   b2Mat33.prototype.b2Mat33 = function (c1, c2, c3) {
      if (c1 === undefined) c1 = null;
      if (c2 === undefined) c2 = null;
      if (c3 === undefined) c3 = null;
      if (!c1 && !c2 && !c3) {
         this.col1.SetZero();
         this.col2.SetZero();
         this.col3.SetZero();
      }
      else {
         this.col1.SetV(c1);
         this.col2.SetV(c2);
         this.col3.SetV(c3);
      }
   }
   b2Mat33.prototype.SetVVV = function (c1, c2, c3) {
      this.col1.SetV(c1);
      this.col2.SetV(c2);
      this.col3.SetV(c3);
   }
   b2Mat33.prototype.Copy = function () {
      return new b2Mat33(this.col1, this.col2, this.col3);
   }
   b2Mat33.prototype.SetM = function (m) {
      this.col1.SetV(m.col1);
      this.col2.SetV(m.col2);
      this.col3.SetV(m.col3);
   }
   b2Mat33.prototype.AddM = function (m) {
      this.col1.x += m.col1.x;
      this.col1.y += m.col1.y;
      this.col1.z += m.col1.z;
      this.col2.x += m.col2.x;
      this.col2.y += m.col2.y;
      this.col2.z += m.col2.z;
      this.col3.x += m.col3.x;
      this.col3.y += m.col3.y;
      this.col3.z += m.col3.z;
   }
   b2Mat33.prototype.SetIdentity = function () {
      this.col1.x = 1.0;
      this.col2.x = 0.0;
      this.col3.x = 0.0;
      this.col1.y = 0.0;
      this.col2.y = 1.0;
      this.col3.y = 0.0;
      this.col1.z = 0.0;
      this.col2.z = 0.0;
      this.col3.z = 1.0;
   }
   b2Mat33.prototype.SetZero = function () {
      this.col1.x = 0.0;
      this.col2.x = 0.0;
      this.col3.x = 0.0;
      this.col1.y = 0.0;
      this.col2.y = 0.0;
      this.col3.y = 0.0;
      this.col1.z = 0.0;
      this.col2.z = 0.0;
      this.col3.z = 0.0;
   }
   b2Mat33.prototype.Solve22 = function (out, bX, bY) {
      if (bX === undefined) bX = 0;
      if (bY === undefined) bY = 0;
      var a11 = this.col1.x;
      var a12 = this.col2.x;
      var a21 = this.col1.y;
      var a22 = this.col2.y;
      var det = a11 * a22 - a12 * a21;
      if (det != 0.0) {
         det = 1.0 / det;
      }
      out.x = det * (a22 * bX - a12 * bY);
      out.y = det * (a11 * bY - a21 * bX);
      return out;
   }
   b2Mat33.prototype.Solve33 = function (out, bX, bY, bZ) {
      if (bX === undefined) bX = 0;
      if (bY === undefined) bY = 0;
      if (bZ === undefined) bZ = 0;
      var a11 = this.col1.x;
      var a21 = this.col1.y;
      var a31 = this.col1.z;
      var a12 = this.col2.x;
      var a22 = this.col2.y;
      var a32 = this.col2.z;
      var a13 = this.col3.x;
      var a23 = this.col3.y;
      var a33 = this.col3.z;
      var det = a11 * (a22 * a33 - a32 * a23) + a21 * (a32 * a13 - a12 * a33) + a31 * (a12 * a23 - a22 * a13);
      if (det != 0.0) {
         det = 1.0 / det;
      }
      out.x = det * (bX * (a22 * a33 - a32 * a23) + bY * (a32 * a13 - a12 * a33) + bZ * (a12 * a23 - a22 * a13));
      out.y = det * (a11 * (bY * a33 - bZ * a23) + a21 * (bZ * a13 - bX * a33) + a31 * (bX * a23 - bY * a13));
      out.z = det * (a11 * (a22 * bZ - a32 * bY) + a21 * (a32 * bX - a12 * bZ) + a31 * (a12 * bY - a22 * bX));
      return out;
   }
   b2Math.b2Math = function () {};
   b2Math.IsValid = function (x) {
      if (x === undefined) x = 0;
      return isFinite(x);
   }
   b2Math.Dot = function (a, b) {
      return a.x * b.x + a.y * b.y;
   }
   b2Math.CrossVV = function (a, b) {
      return a.x * b.y - a.y * b.x;
   }
   b2Math.CrossVF = function (a, s) {
      if (s === undefined) s = 0;
      var v = new b2Vec2(s * a.y, (-s * a.x));
      return v;
   }
   b2Math.CrossFV = function (s, a) {
      if (s === undefined) s = 0;
      var v = new b2Vec2((-s * a.y), s * a.x);
      return v;
   }
   b2Math.MulMV = function (A, v) {
      var u = new b2Vec2(A.col1.x * v.x + A.col2.x * v.y, A.col1.y * v.x + A.col2.y * v.y);
      return u;
   }
   b2Math.MulTMV = function (A, v) {
      var u = new b2Vec2(b2Math.Dot(v, A.col1), b2Math.Dot(v, A.col2));
      return u;
   }
   b2Math.MulX = function (T, v) {
      var a = b2Math.MulMV(T.R, v);
      a.x += T.position.x;
      a.y += T.position.y;
      return a;
   }
   b2Math.MulXT = function (T, v) {
      var a = b2Math.SubtractVV(v, T.position);
      var tX = (a.x * T.R.col1.x + a.y * T.R.col1.y);
      a.y = (a.x * T.R.col2.x + a.y * T.R.col2.y);
      a.x = tX;
      return a;
   }
   b2Math.AddVV = function (a, b) {
      var v = new b2Vec2(a.x + b.x, a.y + b.y);
      return v;
   }
   b2Math.SubtractVV = function (a, b) {
      var v = new b2Vec2(a.x - b.x, a.y - b.y);
      return v;
   }
   b2Math.Distance = function (a, b) {
      var cX = a.x - b.x;
      var cY = a.y - b.y;
      return Math.sqrt(cX * cX + cY * cY);
   }
   b2Math.DistanceSquared = function (a, b) {
      var cX = a.x - b.x;
      var cY = a.y - b.y;
      return (cX * cX + cY * cY);
   }
   b2Math.MulFV = function (s, a) {
      if (s === undefined) s = 0;
      var v = new b2Vec2(s * a.x, s * a.y);
      return v;
   }
   b2Math.AddMM = function (A, B) {
      var C = b2Mat22.FromVV(b2Math.AddVV(A.col1, B.col1), b2Math.AddVV(A.col2, B.col2));
      return C;
   }
   b2Math.MulMM = function (A, B) {
      var C = b2Mat22.FromVV(b2Math.MulMV(A, B.col1), b2Math.MulMV(A, B.col2));
      return C;
   }
   b2Math.MulTMM = function (A, B) {
      var c1 = new b2Vec2(b2Math.Dot(A.col1, B.col1), b2Math.Dot(A.col2, B.col1));
      var c2 = new b2Vec2(b2Math.Dot(A.col1, B.col2), b2Math.Dot(A.col2, B.col2));
      var C = b2Mat22.FromVV(c1, c2);
      return C;
   }
   b2Math.Abs = function (a) {
      if (a === undefined) a = 0;
      return a > 0.0 ? a : (-a);
   }
   b2Math.AbsV = function (a) {
      var b = new b2Vec2(b2Math.Abs(a.x), b2Math.Abs(a.y));
      return b;
   }
   b2Math.AbsM = function (A) {
      var B = b2Mat22.FromVV(b2Math.AbsV(A.col1), b2Math.AbsV(A.col2));
      return B;
   }
   b2Math.Min = function (a, b) {
      if (a === undefined) a = 0;
      if (b === undefined) b = 0;
      return a < b ? a : b;
   }
   b2Math.MinV = function (a, b) {
      var c = new b2Vec2(b2Math.Min(a.x, b.x), b2Math.Min(a.y, b.y));
      return c;
   }
   b2Math.Max = function (a, b) {
      if (a === undefined) a = 0;
      if (b === undefined) b = 0;
      return a > b ? a : b;
   }
   b2Math.MaxV = function (a, b) {
      var c = new b2Vec2(b2Math.Max(a.x, b.x), b2Math.Max(a.y, b.y));
      return c;
   }
   b2Math.Clamp = function (a, low, high) {
      if (a === undefined) a = 0;
      if (low === undefined) low = 0;
      if (high === undefined) high = 0;
      return a < low ? low : a > high ? high : a;
   }
   b2Math.ClampV = function (a, low, high) {
      return b2Math.MaxV(low, b2Math.MinV(a, high));
   }
   b2Math.Swap = function (a, b) {
      var tmp = a[0];
      a[0] = b[0];
      b[0] = tmp;
   }
   b2Math.Random = function () {
      return Math.random() * 2 - 1;
   }
   b2Math.RandomRange = function (lo, hi) {
      if (lo === undefined) lo = 0;
      if (hi === undefined) hi = 0;
      var r = Math.random();
      r = (hi - lo) * r + lo;
      return r;
   }
   b2Math.NextPowerOfTwo = function (x) {
      if (x === undefined) x = 0;
      x |= (x >> 1) & 0x7FFFFFFF;
      x |= (x >> 2) & 0x3FFFFFFF;
      x |= (x >> 4) & 0x0FFFFFFF;
      x |= (x >> 8) & 0x00FFFFFF;
      x |= (x >> 16) & 0x0000FFFF;
      return x + 1;
   }
   b2Math.IsPowerOfTwo = function (x) {
      if (x === undefined) x = 0;
      var result = x > 0 && (x & (x - 1)) == 0;
      return result;
   }
   Box2D.postDefs.push(function () {
      Box2D.Common.Math.b2Math.b2Vec2_zero = new b2Vec2(0.0, 0.0);
      Box2D.Common.Math.b2Math.b2Mat22_identity = b2Mat22.FromVV(new b2Vec2(1.0, 0.0), new b2Vec2(0.0, 1.0));
      Box2D.Common.Math.b2Math.b2Transform_identity = new b2Transform(b2Math.b2Vec2_zero, b2Math.b2Mat22_identity);
   });
   b2Sweep.b2Sweep = function () {
      this.localCenter = new b2Vec2();
      this.c0 = new b2Vec2;
      this.c = new b2Vec2();
   };
   b2Sweep.prototype.Set = function (other) {
      this.localCenter.SetV(other.localCenter);
      this.c0.SetV(other.c0);
      this.c.SetV(other.c);
      this.a0 = other.a0;
      this.a = other.a;
      this.t0 = other.t0;
   }
   b2Sweep.prototype.Copy = function () {
      var copy = new b2Sweep();
      copy.localCenter.SetV(this.localCenter);
      copy.c0.SetV(this.c0);
      copy.c.SetV(this.c);
      copy.a0 = this.a0;
      copy.a = this.a;
      copy.t0 = this.t0;
      return copy;
   }
   b2Sweep.prototype.GetTransform = function (xf, alpha) {
      if (alpha === undefined) alpha = 0;
      xf.position.x = (1.0 - alpha) * this.c0.x + alpha * this.c.x;
      xf.position.y = (1.0 - alpha) * this.c0.y + alpha * this.c.y;
      var angle = (1.0 - alpha) * this.a0 + alpha * this.a;
      xf.R.Set(angle);
      var tMat = xf.R;
      xf.position.x -= (tMat.col1.x * this.localCenter.x + tMat.col2.x * this.localCenter.y);
      xf.position.y -= (tMat.col1.y * this.localCenter.x + tMat.col2.y * this.localCenter.y);
   }
   b2Sweep.prototype.Advance = function (t) {
      if (t === undefined) t = 0;
      if (this.t0 < t && 1.0 - this.t0 > Number.MIN_VALUE) {
         var alpha = (t - this.t0) / (1.0 - this.t0);
         this.c0.x = (1.0 - alpha) * this.c0.x + alpha * this.c.x;
         this.c0.y = (1.0 - alpha) * this.c0.y + alpha * this.c.y;
         this.a0 = (1.0 - alpha) * this.a0 + alpha * this.a;
         this.t0 = t;
      }
   }
   b2Transform.b2Transform = function () {
      this.position = new b2Vec2;
      this.R = new b2Mat22();
   };
   b2Transform.prototype.b2Transform = function (pos, r) {
      if (pos === undefined) pos = null;
      if (r === undefined) r = null;
      if (pos) {
         this.position.SetV(pos);
         this.R.SetM(r);
      }
   }
   b2Transform.prototype.Initialize = function (pos, r) {
      this.position.SetV(pos);
      this.R.SetM(r);
   }
   b2Transform.prototype.SetIdentity = function () {
      this.position.SetZero();
      this.R.SetIdentity();
   }
   b2Transform.prototype.Set = function (x) {
      this.position.SetV(x.position);
      this.R.SetM(x.R);
   }
   b2Transform.prototype.GetAngle = function () {
      return Math.atan2(this.R.col1.y, this.R.col1.x);
   }
   b2Vec2.b2Vec2 = function () {};
   b2Vec2.prototype.b2Vec2 = function (x_, y_) {
      if (x_ === undefined) x_ = 0;
      if (y_ === undefined) y_ = 0;
      this.x = x_;
      this.y = y_;
   }
   b2Vec2.prototype.SetZero = function () {
      this.x = 0.0;
      this.y = 0.0;
   }
   b2Vec2.prototype.Set = function (x_, y_) {
      if (x_ === undefined) x_ = 0;
      if (y_ === undefined) y_ = 0;
      this.x = x_;
      this.y = y_;
   }
   b2Vec2.prototype.SetV = function (v) {
      this.x = v.x;
      this.y = v.y;
   }
   b2Vec2.prototype.GetNegative = function () {
      return new b2Vec2((-this.x), (-this.y));
   }
   b2Vec2.prototype.NegativeSelf = function () {
      this.x = (-this.x);
      this.y = (-this.y);
   }
   b2Vec2.Make = function (x_, y_) {
      if (x_ === undefined) x_ = 0;
      if (y_ === undefined) y_ = 0;
      return new b2Vec2(x_, y_);
   }
   b2Vec2.prototype.Copy = function () {
      return new b2Vec2(this.x, this.y);
   }
   b2Vec2.prototype.Add = function (v) {
      this.x += v.x;
      this.y += v.y;
   }
   b2Vec2.prototype.Subtract = function (v) {
      this.x -= v.x;
      this.y -= v.y;
   }
   b2Vec2.prototype.Multiply = function (a) {
      if (a === undefined) a = 0;
      this.x *= a;
      this.y *= a;
   }
   b2Vec2.prototype.MulM = function (A) {
      var tX = this.x;
      this.x = A.col1.x * tX + A.col2.x * this.y;
      this.y = A.col1.y * tX + A.col2.y * this.y;
   }
   b2Vec2.prototype.MulTM = function (A) {
      var tX = b2Math.Dot(this, A.col1);
      this.y = b2Math.Dot(this, A.col2);
      this.x = tX;
   }
   b2Vec2.prototype.CrossVF = function (s) {
      if (s === undefined) s = 0;
      var tX = this.x;
      this.x = s * this.y;
      this.y = (-s * tX);
   }
   b2Vec2.prototype.CrossFV = function (s) {
      if (s === undefined) s = 0;
      var tX = this.x;
      this.x = (-s * this.y);
      this.y = s * tX;
   }
   b2Vec2.prototype.MinV = function (b) {
      this.x = this.x < b.x ? this.x : b.x;
      this.y = this.y < b.y ? this.y : b.y;
   }
   b2Vec2.prototype.MaxV = function (b) {
      this.x = this.x > b.x ? this.x : b.x;
      this.y = this.y > b.y ? this.y : b.y;
   }
   b2Vec2.prototype.Abs = function () {
      if (this.x < 0) this.x = (-this.x);
      if (this.y < 0) this.y = (-this.y);
   }
   b2Vec2.prototype.Length = function () {
      return Math.sqrt(this.x * this.x + this.y * this.y);
   }
   b2Vec2.prototype.LengthSquared = function () {
      return (this.x * this.x + this.y * this.y);
   }
   b2Vec2.prototype.Normalize = function () {
      var length = Math.sqrt(this.x * this.x + this.y * this.y);
      if (length < Number.MIN_VALUE) {
         return 0.0;
      }
      var invLength = 1.0 / length;
      this.x *= invLength;
      this.y *= invLength;
      return length;
   }
   b2Vec2.prototype.IsValid = function () {
      return b2Math.IsValid(this.x) && b2Math.IsValid(this.y);
   }
   b2Vec3.b2Vec3 = function () {};
   b2Vec3.prototype.b2Vec3 = function (x, y, z) {
      if (x === undefined) x = 0;
      if (y === undefined) y = 0;
      if (z === undefined) z = 0;
      this.x = x;
      this.y = y;
      this.z = z;
   }
   b2Vec3.prototype.SetZero = function () {
      this.x = this.y = this.z = 0.0;
   }
   b2Vec3.prototype.Set = function (x, y, z) {
      if (x === undefined) x = 0;
      if (y === undefined) y = 0;
      if (z === undefined) z = 0;
      this.x = x;
      this.y = y;
      this.z = z;
   }
   b2Vec3.prototype.SetV = function (v) {
      this.x = v.x;
      this.y = v.y;
      this.z = v.z;
   }
   b2Vec3.prototype.GetNegative = function () {
      return new b2Vec3((-this.x), (-this.y), (-this.z));
   }
   b2Vec3.prototype.NegativeSelf = function () {
      this.x = (-this.x);
      this.y = (-this.y);
      this.z = (-this.z);
   }
   b2Vec3.prototype.Copy = function () {
      return new b2Vec3(this.x, this.y, this.z);
   }
   b2Vec3.prototype.Add = function (v) {
      this.x += v.x;
      this.y += v.y;
      this.z += v.z;
   }
   b2Vec3.prototype.Subtract = function (v) {
      this.x -= v.x;
      this.y -= v.y;
      this.z -= v.z;
   }
   b2Vec3.prototype.Multiply = function (a) {
      if (a === undefined) a = 0;
      this.x *= a;
      this.y *= a;
      this.z *= a;
   }
})();
(function () {
   var b2ControllerEdge = Box2D.Dynamics.Controllers.b2ControllerEdge,
      b2Mat22 = Box2D.Common.Math.b2Mat22,
      b2Mat33 = Box2D.Common.Math.b2Mat33,
      b2Math = Box2D.Common.Math.b2Math,
      b2Sweep = Box2D.Common.Math.b2Sweep,
      b2Transform = Box2D.Common.Math.b2Transform,
      b2Vec2 = Box2D.Common.Math.b2Vec2,
      b2Vec3 = Box2D.Common.Math.b2Vec3,
      b2Color = Box2D.Common.b2Color,
      b2internal = Box2D.Common.b2internal,
      b2Settings = Box2D.Common.b2Settings,
      b2AABB = Box2D.Collision.b2AABB,
      b2Bound = Box2D.Collision.b2Bound,
      b2BoundValues = Box2D.Collision.b2BoundValues,
      b2Collision = Box2D.Collision.b2Collision,
      b2ContactID = Box2D.Collision.b2ContactID,
      b2ContactPoint = Box2D.Collision.b2ContactPoint,
      b2Distance = Box2D.Collision.b2Distance,
      b2DistanceInput = Box2D.Collision.b2DistanceInput,
      b2DistanceOutput = Box2D.Collision.b2DistanceOutput,
      b2DistanceProxy = Box2D.Collision.b2DistanceProxy,
      b2DynamicTree = Box2D.Collision.b2DynamicTree,
      b2DynamicTreeBroadPhase = Box2D.Collision.b2DynamicTreeBroadPhase,
      b2DynamicTreeNode = Box2D.Collision.b2DynamicTreeNode,
      b2DynamicTreePair = Box2D.Collision.b2DynamicTreePair,
      b2Manifold = Box2D.Collision.b2Manifold,
      b2ManifoldPoint = Box2D.Collision.b2ManifoldPoint,
      b2Point = Box2D.Collision.b2Point,
      b2RayCastInput = Box2D.Collision.b2RayCastInput,
      b2RayCastOutput = Box2D.Collision.b2RayCastOutput,
      b2Segment = Box2D.Collision.b2Segment,
      b2SeparationFunction = Box2D.Collision.b2SeparationFunction,
      b2Simplex = Box2D.Collision.b2Simplex,
      b2SimplexCache = Box2D.Collision.b2SimplexCache,
      b2SimplexVertex = Box2D.Collision.b2SimplexVertex,
      b2TimeOfImpact = Box2D.Collision.b2TimeOfImpact,
      b2TOIInput = Box2D.Collision.b2TOIInput,
      b2WorldManifold = Box2D.Collision.b2WorldManifold,
      ClipVertex = Box2D.Collision.ClipVertex,
      Features = Box2D.Collision.Features,
      IBroadPhase = Box2D.Collision.IBroadPhase,
      b2CircleShape = Box2D.Collision.Shapes.b2CircleShape,
      b2EdgeChainDef = Box2D.Collision.Shapes.b2EdgeChainDef,
      b2EdgeShape = Box2D.Collision.Shapes.b2EdgeShape,
      b2MassData = Box2D.Collision.Shapes.b2MassData,
      b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape,
      b2Shape = Box2D.Collision.Shapes.b2Shape,
      b2Body = Box2D.Dynamics.b2Body,
      b2BodyDef = Box2D.Dynamics.b2BodyDef,
      b2ContactFilter = Box2D.Dynamics.b2ContactFilter,
      b2ContactImpulse = Box2D.Dynamics.b2ContactImpulse,
      b2ContactListener = Box2D.Dynamics.b2ContactListener,
      b2ContactManager = Box2D.Dynamics.b2ContactManager,
      b2DebugDraw = Box2D.Dynamics.b2DebugDraw,
      b2DestructionListener = Box2D.Dynamics.b2DestructionListener,
      b2FilterData = Box2D.Dynamics.b2FilterData,
      b2Fixture = Box2D.Dynamics.b2Fixture,
      b2FixtureDef = Box2D.Dynamics.b2FixtureDef,
      b2Island = Box2D.Dynamics.b2Island,
      b2TimeStep = Box2D.Dynamics.b2TimeStep,
      b2World = Box2D.Dynamics.b2World,
      b2CircleContact = Box2D.Dynamics.Contacts.b2CircleContact,
      b2Contact = Box2D.Dynamics.Contacts.b2Contact,
      b2ContactConstraint = Box2D.Dynamics.Contacts.b2ContactConstraint,
      b2ContactConstraintPoint = Box2D.Dynamics.Contacts.b2ContactConstraintPoint,
      b2ContactEdge = Box2D.Dynamics.Contacts.b2ContactEdge,
      b2ContactFactory = Box2D.Dynamics.Contacts.b2ContactFactory,
      b2ContactRegister = Box2D.Dynamics.Contacts.b2ContactRegister,
      b2ContactResult = Box2D.Dynamics.Contacts.b2ContactResult,
      b2ContactSolver = Box2D.Dynamics.Contacts.b2ContactSolver,
      b2EdgeAndCircleContact = Box2D.Dynamics.Contacts.b2EdgeAndCircleContact,
      b2NullContact = Box2D.Dynamics.Contacts.b2NullContact,
      b2PolyAndCircleContact = Box2D.Dynamics.Contacts.b2PolyAndCircleContact,
      b2PolyAndEdgeContact = Box2D.Dynamics.Contacts.b2PolyAndEdgeContact,
      b2PolygonContact = Box2D.Dynamics.Contacts.b2PolygonContact,
      b2PositionSolverManifold = Box2D.Dynamics.Contacts.b2PositionSolverManifold,
      b2Controller = Box2D.Dynamics.Controllers.b2Controller,
      b2DistanceJoint = Box2D.Dynamics.Joints.b2DistanceJoint,
      b2DistanceJointDef = Box2D.Dynamics.Joints.b2DistanceJointDef,
      b2FrictionJoint = Box2D.Dynamics.Joints.b2FrictionJoint,
      b2FrictionJointDef = Box2D.Dynamics.Joints.b2FrictionJointDef,
      b2GearJoint = Box2D.Dynamics.Joints.b2GearJoint,
      b2GearJointDef = Box2D.Dynamics.Joints.b2GearJointDef,
      b2Jacobian = Box2D.Dynamics.Joints.b2Jacobian,
      b2Joint = Box2D.Dynamics.Joints.b2Joint,
      b2JointDef = Box2D.Dynamics.Joints.b2JointDef,
      b2JointEdge = Box2D.Dynamics.Joints.b2JointEdge,
      b2LineJoint = Box2D.Dynamics.Joints.b2LineJoint,
      b2LineJointDef = Box2D.Dynamics.Joints.b2LineJointDef,
      b2MouseJoint = Box2D.Dynamics.Joints.b2MouseJoint,
      b2MouseJointDef = Box2D.Dynamics.Joints.b2MouseJointDef,
      b2PrismaticJoint = Box2D.Dynamics.Joints.b2PrismaticJoint,
      b2PrismaticJointDef = Box2D.Dynamics.Joints.b2PrismaticJointDef,
      b2PulleyJoint = Box2D.Dynamics.Joints.b2PulleyJoint,
      b2PulleyJointDef = Box2D.Dynamics.Joints.b2PulleyJointDef,
      b2RevoluteJoint = Box2D.Dynamics.Joints.b2RevoluteJoint,
      b2RevoluteJointDef = Box2D.Dynamics.Joints.b2RevoluteJointDef,
      b2WeldJoint = Box2D.Dynamics.Joints.b2WeldJoint,
      b2WeldJointDef = Box2D.Dynamics.Joints.b2WeldJointDef;

   b2Body.b2Body = function () {
      this.m_xf = new b2Transform();
      this.m_sweep = new b2Sweep();
      this.m_linearVelocity = new b2Vec2();
      this.m_force = new b2Vec2();
   };
   b2Body.prototype.connectEdges = function (s1, s2, angle1) {
      if (angle1 === undefined) angle1 = 0;
      var angle2 = Math.atan2(s2.GetDirectionVector().y, s2.GetDirectionVector().x);
      var coreOffset = Math.tan((angle2 - angle1) * 0.5);
      var core = b2Math.MulFV(coreOffset, s2.GetDirectionVector());
      core = b2Math.SubtractVV(core, s2.GetNormalVector());
      core = b2Math.MulFV(b2Settings.b2_toiSlop, core);
      core = b2Math.AddVV(core, s2.GetVertex1());
      var cornerDir = b2Math.AddVV(s1.GetDirectionVector(), s2.GetDirectionVector());
      cornerDir.Normalize();
      var convex = b2Math.Dot(s1.GetDirectionVector(), s2.GetNormalVector()) > 0.0;
      s1.SetNextEdge(s2, core, cornerDir, convex);
      s2.SetPrevEdge(s1, core, cornerDir, convex);
      return angle2;
   }
   b2Body.prototype.CreateFixture = function (def) {
      if (this.m_world.IsLocked() == true) {
         return null;
      }
      var fixture = new b2Fixture();
      fixture.Create(this, this.m_xf, def);
      if (this.m_flags & b2Body.e_activeFlag) {
         var broadPhase = this.m_world.m_contactManager.m_broadPhase;
         fixture.CreateProxy(broadPhase, this.m_xf);
      }
      fixture.m_next = this.m_fixtureList;
      this.m_fixtureList = fixture;
      ++this.m_fixtureCount;
      fixture.m_body = this;
      if (fixture.m_density > 0.0) {
         this.ResetMassData();
      }
      this.m_world.m_flags |= b2World.e_newFixture;
      return fixture;
   }
   b2Body.prototype.CreateFixture2 = function (shape, density) {
      if (density === undefined) density = 0.0;
      var def = new b2FixtureDef();
      def.shape = shape;
      def.density = density;
      return this.CreateFixture(def);
   }
   b2Body.prototype.DestroyFixture = function (fixture) {
      if (this.m_world.IsLocked() == true) {
         return;
      }
      var node = this.m_fixtureList;
      var ppF = null;
      var found = false;
      while (node != null) {
         if (node == fixture) {
            if (ppF) ppF.m_next = fixture.m_next;
            else this.m_fixtureList = fixture.m_next;
            found = true;
            break;
         }
         ppF = node;
         node = node.m_next;
      }
      var edge = this.m_contactList;
      while (edge) {
         var c = edge.contact;
         edge = edge.next;
         var fixtureA = c.GetFixtureA();
         var fixtureB = c.GetFixtureB();
         if (fixture == fixtureA || fixture == fixtureB) {
            this.m_world.m_contactManager.Destroy(c);
         }
      }
      if (this.m_flags & b2Body.e_activeFlag) {
         var broadPhase = this.m_world.m_contactManager.m_broadPhase;
         fixture.DestroyProxy(broadPhase);
      }
      else {}
      fixture.Destroy();
      fixture.m_body = null;
      fixture.m_next = null;
      --this.m_fixtureCount;
      this.ResetMassData();
   }
   b2Body.prototype.SetPositionAndAngle = function (position, angle) {
      if (angle === undefined) angle = 0;
      var f;
      if (this.m_world.IsLocked() == true) {
         return;
      }
      this.m_xf.R.Set(angle);
      this.m_xf.position.SetV(position);
      var tMat = this.m_xf.R;
      var tVec = this.m_sweep.localCenter;
      this.m_sweep.c.x = (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
      this.m_sweep.c.y = (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
      this.m_sweep.c.x += this.m_xf.position.x;
      this.m_sweep.c.y += this.m_xf.position.y;
      this.m_sweep.c0.SetV(this.m_sweep.c);
      this.m_sweep.a0 = this.m_sweep.a = angle;
      var broadPhase = this.m_world.m_contactManager.m_broadPhase;
      for (f = this.m_fixtureList;
      f; f = f.m_next) {
         f.Synchronize(broadPhase, this.m_xf, this.m_xf);
      }
      this.m_world.m_contactManager.FindNewContacts();
   }
   b2Body.prototype.SetTransform = function (xf) {
      this.SetPositionAndAngle(xf.position, xf.GetAngle());
   }
   b2Body.prototype.GetTransform = function () {
      return this.m_xf;
   }
   b2Body.prototype.GetPosition = function () {
      return this.m_xf.position;
   }
   b2Body.prototype.SetPosition = function (position) {
      this.SetPositionAndAngle(position, this.GetAngle());
   }
   b2Body.prototype.GetAngle = function () {
      return this.m_sweep.a;
   }
   b2Body.prototype.SetAngle = function (angle) {
      if (angle === undefined) angle = 0;
      this.SetPositionAndAngle(this.GetPosition(), angle);
   }
   b2Body.prototype.GetWorldCenter = function () {
      return this.m_sweep.c;
   }
   b2Body.prototype.GetLocalCenter = function () {
      return this.m_sweep.localCenter;
   }
   b2Body.prototype.SetLinearVelocity = function (v) {
      if (this.m_type == b2Body.b2_staticBody) {
         return;
      }
      this.m_linearVelocity.SetV(v);
   }
   b2Body.prototype.GetLinearVelocity = function () {
      return this.m_linearVelocity;
   }
   b2Body.prototype.SetAngularVelocity = function (omega) {
      if (omega === undefined) omega = 0;
      if (this.m_type == b2Body.b2_staticBody) {
         return;
      }
      this.m_angularVelocity = omega;
   }
   b2Body.prototype.GetAngularVelocity = function () {
      return this.m_angularVelocity;
   }
   b2Body.prototype.GetDefinition = function () {
      var bd = new b2BodyDef();
      bd.type = this.GetType();
      bd.allowSleep = (this.m_flags & b2Body.e_allowSleepFlag) == b2Body.e_allowSleepFlag;
      bd.angle = this.GetAngle();
      bd.angularDamping = this.m_angularDamping;
      bd.angularVelocity = this.m_angularVelocity;
      bd.fixedRotation = (this.m_flags & b2Body.e_fixedRotationFlag) == b2Body.e_fixedRotationFlag;
      bd.bullet = (this.m_flags & b2Body.e_bulletFlag) == b2Body.e_bulletFlag;
      bd.awake = (this.m_flags & b2Body.e_awakeFlag) == b2Body.e_awakeFlag;
      bd.linearDamping = this.m_linearDamping;
      bd.linearVelocity.SetV(this.GetLinearVelocity());
      bd.position = this.GetPosition();
      bd.userData = this.GetUserData();
      return bd;
   }
   b2Body.prototype.ApplyForce = function (force, point) {
      if (this.m_type != b2Body.b2_dynamicBody) {
         return;
      }
      if (this.IsAwake() == false) {
         this.SetAwake(true);
      }
      this.m_force.x += force.x;
      this.m_force.y += force.y;
      this.m_torque += ((point.x - this.m_sweep.c.x) * force.y - (point.y - this.m_sweep.c.y) * force.x);
   }
   b2Body.prototype.ApplyTorque = function (torque) {
      if (torque === undefined) torque = 0;
      if (this.m_type != b2Body.b2_dynamicBody) {
         return;
      }
      if (this.IsAwake() == false) {
         this.SetAwake(true);
      }
      this.m_torque += torque;
   }
   b2Body.prototype.ApplyImpulse = function (impulse, point) {
      if (this.m_type != b2Body.b2_dynamicBody) {
         return;
      }
      if (this.IsAwake() == false) {
         this.SetAwake(true);
      }
      this.m_linearVelocity.x += this.m_invMass * impulse.x;
      this.m_linearVelocity.y += this.m_invMass * impulse.y;
      this.m_angularVelocity += this.m_invI * ((point.x - this.m_sweep.c.x) * impulse.y - (point.y - this.m_sweep.c.y) * impulse.x);
   }
   b2Body.prototype.Split = function (callback) {
      var linearVelocity = this.GetLinearVelocity().Copy();
      var angularVelocity = this.GetAngularVelocity();
      var center = this.GetWorldCenter();
      var body1 = this;
      var body2 = this.m_world.CreateBody(this.GetDefinition());
      var prev;
      for (var f = body1.m_fixtureList; f;) {
         if (callback(f)) {
            var next = f.m_next;
            if (prev) {
               prev.m_next = next;
            }
            else {
               body1.m_fixtureList = next;
            }
            body1.m_fixtureCount--;
            f.m_next = body2.m_fixtureList;
            body2.m_fixtureList = f;
            body2.m_fixtureCount++;
            f.m_body = body2;
            f = next;
         }
         else {
            prev = f;
            f = f.m_next;
         }
      }
      body1.ResetMassData();
      body2.ResetMassData();
      var center1 = body1.GetWorldCenter();
      var center2 = body2.GetWorldCenter();
      var velocity1 = b2Math.AddVV(linearVelocity, b2Math.CrossFV(angularVelocity, b2Math.SubtractVV(center1, center)));
      var velocity2 = b2Math.AddVV(linearVelocity, b2Math.CrossFV(angularVelocity, b2Math.SubtractVV(center2, center)));
      body1.SetLinearVelocity(velocity1);
      body2.SetLinearVelocity(velocity2);
      body1.SetAngularVelocity(angularVelocity);
      body2.SetAngularVelocity(angularVelocity);
      body1.SynchronizeFixtures();
      body2.SynchronizeFixtures();
      return body2;
   }
   b2Body.prototype.Merge = function (other) {
      var f;
      for (f = other.m_fixtureList;
      f;) {
         var next = f.m_next;
         other.m_fixtureCount--;
         f.m_next = this.m_fixtureList;
         this.m_fixtureList = f;
         this.m_fixtureCount++;
         f.m_body = body2;
         f = next;
      }
      body1.m_fixtureCount = 0;
      var body1 = this;
      var body2 = other;
      var center1 = body1.GetWorldCenter();
      var center2 = body2.GetWorldCenter();
      var velocity1 = body1.GetLinearVelocity().Copy();
      var velocity2 = body2.GetLinearVelocity().Copy();
      var angular1 = body1.GetAngularVelocity();
      var angular = body2.GetAngularVelocity();
      body1.ResetMassData();
      this.SynchronizeFixtures();
   }
   b2Body.prototype.GetMass = function () {
      return this.m_mass;
   }
   b2Body.prototype.GetInertia = function () {
      return this.m_I;
   }
   b2Body.prototype.GetMassData = function (data) {
      data.mass = this.m_mass;
      data.I = this.m_I;
      data.center.SetV(this.m_sweep.localCenter);
   }
   b2Body.prototype.SetMassData = function (massData) {
      b2Settings.b2Assert(this.m_world.IsLocked() == false);
      if (this.m_world.IsLocked() == true) {
         return;
      }
      if (this.m_type != b2Body.b2_dynamicBody) {
         return;
      }
      this.m_invMass = 0.0;
      this.m_I = 0.0;
      this.m_invI = 0.0;
      this.m_mass = massData.mass;
      if (this.m_mass <= 0.0) {
         this.m_mass = 1.0;
      }
      this.m_invMass = 1.0 / this.m_mass;
      if (massData.I > 0.0 && (this.m_flags & b2Body.e_fixedRotationFlag) == 0) {
         this.m_I = massData.I - this.m_mass * (massData.center.x * massData.center.x + massData.center.y * massData.center.y);
         this.m_invI = 1.0 / this.m_I;
      }
      var oldCenter = this.m_sweep.c.Copy();
      this.m_sweep.localCenter.SetV(massData.center);
      this.m_sweep.c0.SetV(b2Math.MulX(this.m_xf, this.m_sweep.localCenter));
      this.m_sweep.c.SetV(this.m_sweep.c0);
      this.m_linearVelocity.x += this.m_angularVelocity * (-(this.m_sweep.c.y - oldCenter.y));
      this.m_linearVelocity.y += this.m_angularVelocity * (+(this.m_sweep.c.x - oldCenter.x));
   }
   b2Body.prototype.ResetMassData = function () {
      this.m_mass = 0.0;
      this.m_invMass = 0.0;
      this.m_I = 0.0;
      this.m_invI = 0.0;
      this.m_sweep.localCenter.SetZero();
      if (this.m_type == b2Body.b2_staticBody || this.m_type == b2Body.b2_kinematicBody) {
         return;
      }
      var center = b2Vec2.Make(0, 0);
      for (var f = this.m_fixtureList; f; f = f.m_next) {
         if (f.m_density == 0.0) {
            continue;
         }
         var massData = f.GetMassData();
         this.m_mass += massData.mass;
         center.x += massData.center.x * massData.mass;
         center.y += massData.center.y * massData.mass;
         this.m_I += massData.I;
      }
      if (this.m_mass > 0.0) {
         this.m_invMass = 1.0 / this.m_mass;
         center.x *= this.m_invMass;
         center.y *= this.m_invMass;
      }
      else {
         this.m_mass = 1.0;
         this.m_invMass = 1.0;
      }
      if (this.m_I > 0.0 && (this.m_flags & b2Body.e_fixedRotationFlag) == 0) {
         this.m_I -= this.m_mass * (center.x * center.x + center.y * center.y);
         this.m_I *= this.m_inertiaScale;
         b2Settings.b2Assert(this.m_I > 0);
         this.m_invI = 1.0 / this.m_I;
      }
      else {
         this.m_I = 0.0;
         this.m_invI = 0.0;
      }
      var oldCenter = this.m_sweep.c.Copy();
      this.m_sweep.localCenter.SetV(center);
      this.m_sweep.c0.SetV(b2Math.MulX(this.m_xf, this.m_sweep.localCenter));
      this.m_sweep.c.SetV(this.m_sweep.c0);
      this.m_linearVelocity.x += this.m_angularVelocity * (-(this.m_sweep.c.y - oldCenter.y));
      this.m_linearVelocity.y += this.m_angularVelocity * (+(this.m_sweep.c.x - oldCenter.x));
   }
   b2Body.prototype.GetWorldPoint = function (localPoint) {
      var A = this.m_xf.R;
      var u = new b2Vec2(A.col1.x * localPoint.x + A.col2.x * localPoint.y, A.col1.y * localPoint.x + A.col2.y * localPoint.y);
      u.x += this.m_xf.position.x;
      u.y += this.m_xf.position.y;
      return u;
   }
   b2Body.prototype.GetWorldVector = function (localVector) {
      return b2Math.MulMV(this.m_xf.R, localVector);
   }
   b2Body.prototype.GetLocalPoint = function (worldPoint) {
      return b2Math.MulXT(this.m_xf, worldPoint);
   }
   b2Body.prototype.GetLocalVector = function (worldVector) {
      return b2Math.MulTMV(this.m_xf.R, worldVector);
   }
   b2Body.prototype.GetLinearVelocityFromWorldPoint = function (worldPoint) {
      return new b2Vec2(this.m_linearVelocity.x - this.m_angularVelocity * (worldPoint.y - this.m_sweep.c.y), this.m_linearVelocity.y + this.m_angularVelocity * (worldPoint.x - this.m_sweep.c.x));
   }
   b2Body.prototype.GetLinearVelocityFromLocalPoint = function (localPoint) {
      var A = this.m_xf.R;
      var worldPoint = new b2Vec2(A.col1.x * localPoint.x + A.col2.x * localPoint.y, A.col1.y * localPoint.x + A.col2.y * localPoint.y);
      worldPoint.x += this.m_xf.position.x;
      worldPoint.y += this.m_xf.position.y;
      return new b2Vec2(this.m_linearVelocity.x - this.m_angularVelocity * (worldPoint.y - this.m_sweep.c.y), this.m_linearVelocity.y + this.m_angularVelocity * (worldPoint.x - this.m_sweep.c.x));
   }
   b2Body.prototype.GetLinearDamping = function () {
      return this.m_linearDamping;
   }
   b2Body.prototype.SetLinearDamping = function (linearDamping) {
      if (linearDamping === undefined) linearDamping = 0;
      this.m_linearDamping = linearDamping;
   }
   b2Body.prototype.GetAngularDamping = function () {
      return this.m_angularDamping;
   }
   b2Body.prototype.SetAngularDamping = function (angularDamping) {
      if (angularDamping === undefined) angularDamping = 0;
      this.m_angularDamping = angularDamping;
   }
   b2Body.prototype.SetType = function (type) {
      if (type === undefined) type = 0;
      if (this.m_type == type) {
         return;
      }
      this.m_type = type;
      this.ResetMassData();
      if (this.m_type == b2Body.b2_staticBody) {
         this.m_linearVelocity.SetZero();
         this.m_angularVelocity = 0.0;
      }
      this.SetAwake(true);
      this.m_force.SetZero();
      this.m_torque = 0.0;
      for (var ce = this.m_contactList; ce; ce = ce.next) {
         ce.contact.FlagForFiltering();
      }
   }
   b2Body.prototype.GetType = function () {
      return this.m_type;
   }
   b2Body.prototype.SetBullet = function (flag) {
      if (flag) {
         this.m_flags |= b2Body.e_bulletFlag;
      }
      else {
         this.m_flags &= ~b2Body.e_bulletFlag;
      }
   }
   b2Body.prototype.IsBullet = function () {
      return (this.m_flags & b2Body.e_bulletFlag) == b2Body.e_bulletFlag;
   }
   b2Body.prototype.SetSleepingAllowed = function (flag) {
      if (flag) {
         this.m_flags |= b2Body.e_allowSleepFlag;
      }
      else {
         this.m_flags &= ~b2Body.e_allowSleepFlag;
         this.SetAwake(true);
      }
   }
   b2Body.prototype.SetAwake = function (flag) {
      if (flag) {
         this.m_flags |= b2Body.e_awakeFlag;
         this.m_sleepTime = 0.0;
      }
      else {
         this.m_flags &= ~b2Body.e_awakeFlag;
         this.m_sleepTime = 0.0;
         this.m_linearVelocity.SetZero();
         this.m_angularVelocity = 0.0;
         this.m_force.SetZero();
         this.m_torque = 0.0;
      }
   }
   b2Body.prototype.IsAwake = function () {
      return (this.m_flags & b2Body.e_awakeFlag) == b2Body.e_awakeFlag;
   }
   b2Body.prototype.SetFixedRotation = function (fixed) {
      if (fixed) {
         this.m_flags |= b2Body.e_fixedRotationFlag;
      }
      else {
         this.m_flags &= ~b2Body.e_fixedRotationFlag;
      }
      this.ResetMassData();
   }
   b2Body.prototype.IsFixedRotation = function () {
      return (this.m_flags & b2Body.e_fixedRotationFlag) == b2Body.e_fixedRotationFlag;
   }
   b2Body.prototype.SetActive = function (flag) {
      if (flag == this.IsActive()) {
         return;
      }
      var broadPhase;
      var f;
      if (flag) {
         this.m_flags |= b2Body.e_activeFlag;
         broadPhase = this.m_world.m_contactManager.m_broadPhase;
         for (f = this.m_fixtureList;
         f; f = f.m_next) {
            f.CreateProxy(broadPhase, this.m_xf);
         }
      }
      else {
         this.m_flags &= ~b2Body.e_activeFlag;
         broadPhase = this.m_world.m_contactManager.m_broadPhase;
         for (f = this.m_fixtureList;
         f; f = f.m_next) {
            f.DestroyProxy(broadPhase);
         }
         var ce = this.m_contactList;
         while (ce) {
            var ce0 = ce;
            ce = ce.next;
            this.m_world.m_contactManager.Destroy(ce0.contact);
         }
         this.m_contactList = null;
      }
   }
   b2Body.prototype.IsActive = function () {
      return (this.m_flags & b2Body.e_activeFlag) == b2Body.e_activeFlag;
   }
   b2Body.prototype.IsSleepingAllowed = function () {
      return (this.m_flags & b2Body.e_allowSleepFlag) == b2Body.e_allowSleepFlag;
   }
   b2Body.prototype.GetFixtureList = function () {
      return this.m_fixtureList;
   }
   b2Body.prototype.GetJointList = function () {
      return this.m_jointList;
   }
   b2Body.prototype.GetControllerList = function () {
      return this.m_controllerList;
   }
   b2Body.prototype.GetContactList = function () {
      return this.m_contactList;
   }
   b2Body.prototype.GetNext = function () {
      return this.m_next;
   }
   b2Body.prototype.GetUserData = function () {
      return this.m_userData;
   }
   b2Body.prototype.SetUserData = function (data) {
      this.m_userData = data;
   }
   b2Body.prototype.GetWorld = function () {
      return this.m_world;
   }
   b2Body.prototype.b2Body = function (bd, world) {
      this.m_flags = 0;
      if (bd.bullet) {
         this.m_flags |= b2Body.e_bulletFlag;
      }
      if (bd.fixedRotation) {
         this.m_flags |= b2Body.e_fixedRotationFlag;
      }
      if (bd.allowSleep) {
         this.m_flags |= b2Body.e_allowSleepFlag;
      }
      if (bd.awake) {
         this.m_flags |= b2Body.e_awakeFlag;
      }
      if (bd.active) {
         this.m_flags |= b2Body.e_activeFlag;
      }
      this.m_world = world;
      this.m_xf.position.SetV(bd.position);
      this.m_xf.R.Set(bd.angle);
      this.m_sweep.localCenter.SetZero();
      this.m_sweep.t0 = 1.0;
      this.m_sweep.a0 = this.m_sweep.a = bd.angle;
      var tMat = this.m_xf.R;
      var tVec = this.m_sweep.localCenter;
      this.m_sweep.c.x = (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
      this.m_sweep.c.y = (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
      this.m_sweep.c.x += this.m_xf.position.x;
      this.m_sweep.c.y += this.m_xf.position.y;
      this.m_sweep.c0.SetV(this.m_sweep.c);
      this.m_jointList = null;
      this.m_controllerList = null;
      this.m_contactList = null;
      this.m_controllerCount = 0;
      this.m_prev = null;
      this.m_next = null;
      this.m_linearVelocity.SetV(bd.linearVelocity);
      this.m_angularVelocity = bd.angularVelocity;
      this.m_linearDamping = bd.linearDamping;
      this.m_angularDamping = bd.angularDamping;
      this.m_force.Set(0.0, 0.0);
      this.m_torque = 0.0;
      this.m_sleepTime = 0.0;
      this.m_type = bd.type;
      if (this.m_type == b2Body.b2_dynamicBody) {
         this.m_mass = 1.0;
         this.m_invMass = 1.0;
      }
      else {
         this.m_mass = 0.0;
         this.m_invMass = 0.0;
      }
      this.m_I = 0.0;
      this.m_invI = 0.0;
      this.m_inertiaScale = bd.inertiaScale;
      this.m_userData = bd.userData;
      this.m_fixtureList = null;
      this.m_fixtureCount = 0;
   }
   b2Body.prototype.SynchronizeFixtures = function () {
      var xf1 = b2Body.s_xf1;
      xf1.R.Set(this.m_sweep.a0);
      var tMat = xf1.R;
      var tVec = this.m_sweep.localCenter;
      xf1.position.x = this.m_sweep.c0.x - (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
      xf1.position.y = this.m_sweep.c0.y - (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
      var f;
      var broadPhase = this.m_world.m_contactManager.m_broadPhase;
      for (f = this.m_fixtureList;
      f; f = f.m_next) {
         f.Synchronize(broadPhase, xf1, this.m_xf);
      }
   }
   b2Body.prototype.SynchronizeTransform = function () {
      this.m_xf.R.Set(this.m_sweep.a);
      var tMat = this.m_xf.R;
      var tVec = this.m_sweep.localCenter;
      this.m_xf.position.x = this.m_sweep.c.x - (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
      this.m_xf.position.y = this.m_sweep.c.y - (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
   }
   b2Body.prototype.ShouldCollide = function (other) {
      if (this.m_type != b2Body.b2_dynamicBody && other.m_type != b2Body.b2_dynamicBody) {
         return false;
      }
      for (var jn = this.m_jointList; jn; jn = jn.next) {
         if (jn.other == other) if (jn.joint.m_collideConnected == false) {
            return false;
         }
      }
      return true;
   }
   b2Body.prototype.Advance = function (t) {
      if (t === undefined) t = 0;
      this.m_sweep.Advance(t);
      this.m_sweep.c.SetV(this.m_sweep.c0);
      this.m_sweep.a = this.m_sweep.a0;
      this.SynchronizeTransform();
   }
   Box2D.postDefs.push(function () {
      Box2D.Dynamics.b2Body.s_xf1 = new b2Transform();
      Box2D.Dynamics.b2Body.e_islandFlag = 0x0001;
      Box2D.Dynamics.b2Body.e_awakeFlag = 0x0002;
      Box2D.Dynamics.b2Body.e_allowSleepFlag = 0x0004;
      Box2D.Dynamics.b2Body.e_bulletFlag = 0x0008;
      Box2D.Dynamics.b2Body.e_fixedRotationFlag = 0x0010;
      Box2D.Dynamics.b2Body.e_activeFlag = 0x0020;
      Box2D.Dynamics.b2Body.b2_staticBody = 0;
      Box2D.Dynamics.b2Body.b2_kinematicBody = 1;
      Box2D.Dynamics.b2Body.b2_dynamicBody = 2;
   });
   b2BodyDef.b2BodyDef = function () {
      this.position = new b2Vec2();
      this.linearVelocity = new b2Vec2();
   };
   b2BodyDef.prototype.b2BodyDef = function () {
      this.userData = null;
      this.position.Set(0.0, 0.0);
      this.angle = 0.0;
      this.linearVelocity.Set(0, 0);
      this.angularVelocity = 0.0;
      this.linearDamping = 0.0;
      this.angularDamping = 0.0;
      this.allowSleep = true;
      this.awake = true;
      this.fixedRotation = false;
      this.bullet = false;
      this.type = b2Body.b2_staticBody;
      this.active = true;
      this.inertiaScale = 1.0;
   }
   b2ContactFilter.b2ContactFilter = function () {};
   b2ContactFilter.prototype.ShouldCollide = function (fixtureA, fixtureB) {
      var filter1 = fixtureA.GetFilterData();
      var filter2 = fixtureB.GetFilterData();
      if (filter1.groupIndex == filter2.groupIndex && filter1.groupIndex != 0) {
         return filter1.groupIndex > 0;
      }
      var collide = (filter1.maskBits & filter2.categoryBits) != 0 && (filter1.categoryBits & filter2.maskBits) != 0;
      return collide;
   }
   b2ContactFilter.prototype.RayCollide = function (userData, fixture) {
      if (!userData) return true;
      return this.ShouldCollide((userData instanceof b2Fixture ? userData : null), fixture);
   }
   Box2D.postDefs.push(function () {
      Box2D.Dynamics.b2ContactFilter.b2_defaultFilter = new b2ContactFilter();
   });
   b2ContactImpulse.b2ContactImpulse = function () {
      this.normalImpulses = new Vector_a2j_Number(b2Settings.b2_maxManifoldPoints);
      this.tangentImpulses = new Vector_a2j_Number(b2Settings.b2_maxManifoldPoints);
   };
   b2ContactListener.b2ContactListener = function () {};
   b2ContactListener.prototype.BeginContact = function (contact) {}
   b2ContactListener.prototype.EndContact = function (contact) {}
   b2ContactListener.prototype.PreSolve = function (contact, oldManifold) {}
   b2ContactListener.prototype.PostSolve = function (contact, impulse) {}
   Box2D.postDefs.push(function () {
      Box2D.Dynamics.b2ContactListener.b2_defaultListener = new b2ContactListener();
   });
   b2ContactManager.b2ContactManager = function () {};
   b2ContactManager.prototype.b2ContactManager = function () {
      this.m_world = null;
      this.m_contactCount = 0;
      this.m_contactFilter = b2ContactFilter.b2_defaultFilter;
      this.m_contactListener = b2ContactListener.b2_defaultListener;
      this.m_contactFactory = new b2ContactFactory(this.m_allocator);
      this.m_broadPhase = new b2DynamicTreeBroadPhase();
   }
   b2ContactManager.prototype.AddPair = function (proxyUserDataA, proxyUserDataB) {
      var fixtureA = (proxyUserDataA instanceof b2Fixture ? proxyUserDataA : null);
      var fixtureB = (proxyUserDataB instanceof b2Fixture ? proxyUserDataB : null);
      var bodyA = fixtureA.GetBody();
      var bodyB = fixtureB.GetBody();
      if (bodyA == bodyB) return;
      var edge = bodyB.GetContactList();
      while (edge) {
         if (edge.other == bodyA) {
            var fA = edge.contact.GetFixtureA();
            var fB = edge.contact.GetFixtureB();
            if (fA == fixtureA && fB == fixtureB) return;
            if (fA == fixtureB && fB == fixtureA) return;
         }
         edge = edge.next;
      }
      if (bodyB.ShouldCollide(bodyA) == false) {
         return;
      }
      if (this.m_contactFilter.ShouldCollide(fixtureA, fixtureB) == false) {
         return;
      }
      var c = this.m_contactFactory.Create(fixtureA, fixtureB);
      fixtureA = c.GetFixtureA();
      fixtureB = c.GetFixtureB();
      bodyA = fixtureA.m_body;
      bodyB = fixtureB.m_body;
      c.m_prev = null;
      c.m_next = this.m_world.m_contactList;
      if (this.m_world.m_contactList != null) {
         this.m_world.m_contactList.m_prev = c;
      }
      this.m_world.m_contactList = c;
      c.m_nodeA.contact = c;
      c.m_nodeA.other = bodyB;
      c.m_nodeA.prev = null;
      c.m_nodeA.next = bodyA.m_contactList;
      if (bodyA.m_contactList != null) {
         bodyA.m_contactList.prev = c.m_nodeA;
      }
      bodyA.m_contactList = c.m_nodeA;
      c.m_nodeB.contact = c;
      c.m_nodeB.other = bodyA;
      c.m_nodeB.prev = null;
      c.m_nodeB.next = bodyB.m_contactList;
      if (bodyB.m_contactList != null) {
         bodyB.m_contactList.prev = c.m_nodeB;
      }
      bodyB.m_contactList = c.m_nodeB;
      ++this.m_world.m_contactCount;
      return;
   }
   b2ContactManager.prototype.FindNewContacts = function () {
      this.m_broadPhase.UpdatePairs(Box2D.generateCallback(this, this.AddPair));
   }
   b2ContactManager.prototype.Destroy = function (c) {
      var fixtureA = c.GetFixtureA();
      var fixtureB = c.GetFixtureB();
      var bodyA = fixtureA.GetBody();
      var bodyB = fixtureB.GetBody();
      if (c.IsTouching()) {
         this.m_contactListener.EndContact(c);
      }
      if (c.m_prev) {
         c.m_prev.m_next = c.m_next;
      }
      if (c.m_next) {
         c.m_next.m_prev = c.m_prev;
      }
      if (c == this.m_world.m_contactList) {
         this.m_world.m_contactList = c.m_next;
      }
      if (c.m_nodeA.prev) {
         c.m_nodeA.prev.next = c.m_nodeA.next;
      }
      if (c.m_nodeA.next) {
         c.m_nodeA.next.prev = c.m_nodeA.prev;
      }
      if (c.m_nodeA == bodyA.m_contactList) {
         bodyA.m_contactList = c.m_nodeA.next;
      }
      if (c.m_nodeB.prev) {
         c.m_nodeB.prev.next = c.m_nodeB.next;
      }
      if (c.m_nodeB.next) {
         c.m_nodeB.next.prev = c.m_nodeB.prev;
      }
      if (c.m_nodeB == bodyB.m_contactList) {
         bodyB.m_contactList = c.m_nodeB.next;
      }
      this.m_contactFactory.Destroy(c);
      --this.m_contactCount;
   }
   b2ContactManager.prototype.Collide = function () {
      var c = this.m_world.m_contactList;
      while (c) {
         var fixtureA = c.GetFixtureA();
         var fixtureB = c.GetFixtureB();
         var bodyA = fixtureA.GetBody();
         var bodyB = fixtureB.GetBody();
         if (bodyA.IsAwake() == false && bodyB.IsAwake() == false) {
            c = c.GetNext();
            continue;
         }
         if (c.m_flags & b2Contact.e_filterFlag) {
            if (bodyB.ShouldCollide(bodyA) == false) {
               var cNuke = c;
               c = cNuke.GetNext();
               this.Destroy(cNuke);
               continue;
            }
            if (this.m_contactFilter.ShouldCollide(fixtureA, fixtureB) == false) {
               cNuke = c;
               c = cNuke.GetNext();
               this.Destroy(cNuke);
               continue;
            }
            c.m_flags &= ~b2Contact.e_filterFlag;
         }
         var proxyA = fixtureA.m_proxy;
         var proxyB = fixtureB.m_proxy;
         var overlap = this.m_broadPhase.TestOverlap(proxyA, proxyB);
         if (overlap == false) {
            cNuke = c;
            c = cNuke.GetNext();
            this.Destroy(cNuke);
            continue;
         }
         c.Update(this.m_contactListener);
         c = c.GetNext();
      }
   }
   Box2D.postDefs.push(function () {
      Box2D.Dynamics.b2ContactManager.s_evalCP = new b2ContactPoint();
   });
   b2DebugDraw.b2DebugDraw = function () {};
   b2DebugDraw.prototype.b2DebugDraw = function () {}
   b2DebugDraw.prototype.SetFlags = function (flags) {
      if (flags === undefined) flags = 0;
   }
   b2DebugDraw.prototype.GetFlags = function () {}
   b2DebugDraw.prototype.AppendFlags = function (flags) {
      if (flags === undefined) flags = 0;
   }
   b2DebugDraw.prototype.ClearFlags = function (flags) {
      if (flags === undefined) flags = 0;
   }
   b2DebugDraw.prototype.SetSprite = function (sprite) {}
   b2DebugDraw.prototype.GetSprite = function () {}
   b2DebugDraw.prototype.SetDrawScale = function (drawScale) {
      if (drawScale === undefined) drawScale = 0;
   }
   b2DebugDraw.prototype.GetDrawScale = function () {}
   b2DebugDraw.prototype.SetLineThickness = function (lineThickness) {
      if (lineThickness === undefined) lineThickness = 0;
   }
   b2DebugDraw.prototype.GetLineThickness = function () {}
   b2DebugDraw.prototype.SetAlpha = function (alpha) {
      if (alpha === undefined) alpha = 0;
   }
   b2DebugDraw.prototype.GetAlpha = function () {}
   b2DebugDraw.prototype.SetFillAlpha = function (alpha) {
      if (alpha === undefined) alpha = 0;
   }
   b2DebugDraw.prototype.GetFillAlpha = function () {}
   b2DebugDraw.prototype.SetXFormScale = function (xformScale) {
      if (xformScale === undefined) xformScale = 0;
   }
   b2DebugDraw.prototype.GetXFormScale = function () {}
   b2DebugDraw.prototype.DrawPolygon = function (vertices, vertexCount, color) {
      if (vertexCount === undefined) vertexCount = 0;
   }
   b2DebugDraw.prototype.DrawSolidPolygon = function (vertices, vertexCount, color) {
      if (vertexCount === undefined) vertexCount = 0;
   }
   b2DebugDraw.prototype.DrawCircle = function (center, radius, color) {
      if (radius === undefined) radius = 0;
   }
   b2DebugDraw.prototype.DrawSolidCircle = function (center, radius, axis, color) {
      if (radius === undefined) radius = 0;
   }
   b2DebugDraw.prototype.DrawSegment = function (p1, p2, color) {}
   b2DebugDraw.prototype.DrawTransform = function (xf) {}
   Box2D.postDefs.push(function () {
      Box2D.Dynamics.b2DebugDraw.e_shapeBit = 0x0001;
      Box2D.Dynamics.b2DebugDraw.e_jointBit = 0x0002;
      Box2D.Dynamics.b2DebugDraw.e_aabbBit = 0x0004;
      Box2D.Dynamics.b2DebugDraw.e_pairBit = 0x0008;
      Box2D.Dynamics.b2DebugDraw.e_centerOfMassBit = 0x0010;
      Box2D.Dynamics.b2DebugDraw.e_controllerBit = 0x0020;
   });
   b2DestructionListener.b2DestructionListener = function () {};
   b2DestructionListener.prototype.SayGoodbyeJoint = function (joint) {}
   b2DestructionListener.prototype.SayGoodbyeFixture = function (fixture) {}
   b2FilterData.b2FilterData = function () {
      this.categoryBits = 0x0001;
      this.maskBits = 0xFFFF;
      this.groupIndex = 0;
   };
   b2FilterData.prototype.Copy = function () {
      var copy = new b2FilterData();
      copy.categoryBits = this.categoryBits;
      copy.maskBits = this.maskBits;
      copy.groupIndex = this.groupIndex;
      return copy;
   }
   b2Fixture.b2Fixture = function () {
      this.m_filter = new b2FilterData();
   };
   b2Fixture.prototype.GetType = function () {
      return this.m_shape.GetType();
   }
   b2Fixture.prototype.GetShape = function () {
      return this.m_shape;
   }
   b2Fixture.prototype.SetSensor = function (sensor) {
      if (this.m_isSensor == sensor) return;
      this.m_isSensor = sensor;
      if (this.m_body == null) return;
      var edge = this.m_body.GetContactList();
      while (edge) {
         var contact = edge.contact;
         var fixtureA = contact.GetFixtureA();
         var fixtureB = contact.GetFixtureB();
         if (fixtureA == this || fixtureB == this) contact.SetSensor(fixtureA.IsSensor() || fixtureB.IsSensor());
         edge = edge.next;
      }
   }
   b2Fixture.prototype.IsSensor = function () {
      return this.m_isSensor;
   }
   b2Fixture.prototype.SetFilterData = function (filter) {
      this.m_filter = filter.Copy();
      if (this.m_body) return;
      var edge = this.m_body.GetContactList();
      while (edge) {
         var contact = edge.contact;
         var fixtureA = contact.GetFixtureA();
         var fixtureB = contact.GetFixtureB();
         if (fixtureA == this || fixtureB == this) contact.FlagForFiltering();
         edge = edge.next;
      }
   }
   b2Fixture.prototype.GetFilterData = function () {
      return this.m_filter.Copy();
   }
   b2Fixture.prototype.GetBody = function () {
      return this.m_body;
   }
   b2Fixture.prototype.GetNext = function () {
      return this.m_next;
   }
   b2Fixture.prototype.GetUserData = function () {
      return this.m_userData;
   }
   b2Fixture.prototype.SetUserData = function (data) {
      this.m_userData = data;
   }
   b2Fixture.prototype.TestPoint = function (p) {
      return this.m_shape.TestPoint(this.m_body.GetTransform(), p);
   }
   b2Fixture.prototype.RayCast = function (output, input) {
      return this.m_shape.RayCast(output, input, this.m_body.GetTransform());
   }
   b2Fixture.prototype.GetMassData = function (massData) {
      if (massData === undefined) massData = null;
      if (massData == null) {
         massData = new b2MassData();
      }
      this.m_shape.ComputeMass(massData, this.m_density);
      return massData;
   }
   b2Fixture.prototype.SetDensity = function (density) {
      if (density === undefined) density = 0;
      this.m_density = density;
   }
   b2Fixture.prototype.GetDensity = function () {
      return this.m_density;
   }
   b2Fixture.prototype.GetFriction = function () {
      return this.m_friction;
   }
   b2Fixture.prototype.SetFriction = function (friction) {
      if (friction === undefined) friction = 0;
      this.m_friction = friction;
   }
   b2Fixture.prototype.GetRestitution = function () {
      return this.m_restitution;
   }
   b2Fixture.prototype.SetRestitution = function (restitution) {
      if (restitution === undefined) restitution = 0;
      this.m_restitution = restitution;
   }
   b2Fixture.prototype.GetAABB = function () {
      return this.m_aabb;
   }
   b2Fixture.prototype.b2Fixture = function () {
      this.m_aabb = new b2AABB();
      this.m_userData = null;
      this.m_body = null;
      this.m_next = null;
      this.m_shape = null;
      this.m_density = 0.0;
      this.m_friction = 0.0;
      this.m_restitution = 0.0;
   }
   b2Fixture.prototype.Create = function (body, xf, def) {
      this.m_userData = def.userData;
      this.m_friction = def.friction;
      this.m_restitution = def.restitution;
      this.m_body = body;
      this.m_next = null;
      this.m_filter = def.filter.Copy();
      this.m_isSensor = def.isSensor;
      this.m_shape = def.shape.Copy();
      this.m_density = def.density;
   }
   b2Fixture.prototype.Destroy = function () {
      this.m_shape = null;
   }
   b2Fixture.prototype.CreateProxy = function (broadPhase, xf) {
      this.m_shape.ComputeAABB(this.m_aabb, xf);
      this.m_proxy = broadPhase.CreateProxy(this.m_aabb, this);
   }
   b2Fixture.prototype.DestroyProxy = function (broadPhase) {
      if (this.m_proxy == null) {
         return;
      }
      broadPhase.DestroyProxy(this.m_proxy);
      this.m_proxy = null;
   }
   b2Fixture.prototype.Synchronize = function (broadPhase, transform1, transform2) {
      if (!this.m_proxy) return;
      var aabb1 = new b2AABB();
      var aabb2 = new b2AABB();
      this.m_shape.ComputeAABB(aabb1, transform1);
      this.m_shape.ComputeAABB(aabb2, transform2);
      this.m_aabb.Combine(aabb1, aabb2);
      var displacement = b2Math.SubtractVV(transform2.position, transform1.position);
      broadPhase.MoveProxy(this.m_proxy, this.m_aabb, displacement);
   }
   b2FixtureDef.b2FixtureDef = function () {
      this.filter = new b2FilterData();
   };
   b2FixtureDef.prototype.b2FixtureDef = function () {
      this.shape = null;
      this.userData = null;
      this.friction = 0.2;
      this.restitution = 0.0;
      this.density = 0.0;
      this.filter.categoryBits = 0x0001;
      this.filter.maskBits = 0xFFFF;
      this.filter.groupIndex = 0;
      this.isSensor = false;
   }
   b2Island.b2Island = function () {};
   b2Island.prototype.b2Island = function () {
      this.m_bodies = new Vector();
      this.m_contacts = new Vector();
      this.m_joints = new Vector();
   }
   b2Island.prototype.Initialize = function (bodyCapacity, contactCapacity, jointCapacity, allocator, listener, contactSolver) {
      if (bodyCapacity === undefined) bodyCapacity = 0;
      if (contactCapacity === undefined) contactCapacity = 0;
      if (jointCapacity === undefined) jointCapacity = 0;
      var i = 0;
      this.m_bodyCapacity = bodyCapacity;
      this.m_contactCapacity = contactCapacity;
      this.m_jointCapacity = jointCapacity;
      this.m_bodyCount = 0;
      this.m_contactCount = 0;
      this.m_jointCount = 0;
      this.m_allocator = allocator;
      this.m_listener = listener;
      this.m_contactSolver = contactSolver;
      for (i = this.m_bodies.length;
      i < bodyCapacity; i++)
      this.m_bodies[i] = null;
      for (i = this.m_contacts.length;
      i < contactCapacity; i++)
      this.m_contacts[i] = null;
      for (i = this.m_joints.length;
      i < jointCapacity; i++)
      this.m_joints[i] = null;
   }
   b2Island.prototype.Clear = function () {
      this.m_bodyCount = 0;
      this.m_contactCount = 0;
      this.m_jointCount = 0;
   }
   b2Island.prototype.Solve = function (step, gravity, allowSleep) {
      var i = 0;
      var j = 0;
      var b;
      var joint;
      for (i = 0;
      i < this.m_bodyCount; ++i) {
         b = this.m_bodies[i];
         if (b.GetType() != b2Body.b2_dynamicBody) continue;
         b.m_linearVelocity.x += step.dt * (gravity.x + b.m_invMass * b.m_force.x);
         b.m_linearVelocity.y += step.dt * (gravity.y + b.m_invMass * b.m_force.y);
         b.m_angularVelocity += step.dt * b.m_invI * b.m_torque;
         b.m_linearVelocity.Multiply(b2Math.Clamp(1.0 - step.dt * b.m_linearDamping, 0.0, 1.0));
         b.m_angularVelocity *= b2Math.Clamp(1.0 - step.dt * b.m_angularDamping, 0.0, 1.0);
      }
      this.m_contactSolver.Initialize(step, this.m_contacts, this.m_contactCount, this.m_allocator);
      var contactSolver = this.m_contactSolver;
      contactSolver.InitVelocityConstraints(step);
      for (i = 0;
      i < this.m_jointCount; ++i) {
         joint = this.m_joints[i];
         joint.InitVelocityConstraints(step);
      }
      for (i = 0;
      i < step.velocityIterations; ++i) {
         for (j = 0;
         j < this.m_jointCount; ++j) {
            joint = this.m_joints[j];
            joint.SolveVelocityConstraints(step);
         }
         contactSolver.SolveVelocityConstraints();
      }
      for (i = 0;
      i < this.m_jointCount; ++i) {
         joint = this.m_joints[i];
         joint.FinalizeVelocityConstraints();
      }
      contactSolver.FinalizeVelocityConstraints();
      for (i = 0;
      i < this.m_bodyCount; ++i) {
         b = this.m_bodies[i];
         if (b.GetType() == b2Body.b2_staticBody) continue;
         var translationX = step.dt * b.m_linearVelocity.x;
         var translationY = step.dt * b.m_linearVelocity.y;
         if ((translationX * translationX + translationY * translationY) > b2Settings.b2_maxTranslationSquared) {
            b.m_linearVelocity.Normalize();
            b.m_linearVelocity.x *= b2Settings.b2_maxTranslation * step.inv_dt;
            b.m_linearVelocity.y *= b2Settings.b2_maxTranslation * step.inv_dt;
         }
         var rotation = step.dt * b.m_angularVelocity;
         if (rotation * rotation > b2Settings.b2_maxRotationSquared) {
            if (b.m_angularVelocity < 0.0) {
               b.m_angularVelocity = (-b2Settings.b2_maxRotation * step.inv_dt);
            }
            else {
               b.m_angularVelocity = b2Settings.b2_maxRotation * step.inv_dt;
            }
         }
         b.m_sweep.c0.SetV(b.m_sweep.c);
         b.m_sweep.a0 = b.m_sweep.a;
         b.m_sweep.c.x += step.dt * b.m_linearVelocity.x;
         b.m_sweep.c.y += step.dt * b.m_linearVelocity.y;
         b.m_sweep.a += step.dt * b.m_angularVelocity;
         b.SynchronizeTransform();
      }
      for (i = 0;
      i < step.positionIterations; ++i) {
         var contactsOkay = contactSolver.SolvePositionConstraints(b2Settings.b2_contactBaumgarte);
         var jointsOkay = true;
         for (j = 0;
         j < this.m_jointCount; ++j) {
            joint = this.m_joints[j];
            var jointOkay = joint.SolvePositionConstraints(b2Settings.b2_contactBaumgarte);
            jointsOkay = jointsOkay && jointOkay;
         }
         if (contactsOkay && jointsOkay) {
            break;
         }
      }
      this.Report(contactSolver.m_constraints);
      if (allowSleep) {
         var minSleepTime = Number.MAX_VALUE;
         var linTolSqr = b2Settings.b2_linearSleepTolerance * b2Settings.b2_linearSleepTolerance;
         var angTolSqr = b2Settings.b2_angularSleepTolerance * b2Settings.b2_angularSleepTolerance;
         for (i = 0;
         i < this.m_bodyCount; ++i) {
            b = this.m_bodies[i];
            if (b.GetType() == b2Body.b2_staticBody) {
               continue;
            }
            if ((b.m_flags & b2Body.e_allowSleepFlag) == 0) {
               b.m_sleepTime = 0.0;
               minSleepTime = 0.0;
            }
            if ((b.m_flags & b2Body.e_allowSleepFlag) == 0 || b.m_angularVelocity * b.m_angularVelocity > angTolSqr || b2Math.Dot(b.m_linearVelocity, b.m_linearVelocity) > linTolSqr) {
               b.m_sleepTime = 0.0;
               minSleepTime = 0.0;
            }
            else {
               b.m_sleepTime += step.dt;
               minSleepTime = b2Math.Min(minSleepTime, b.m_sleepTime);
            }
         }
         if (minSleepTime >= b2Settings.b2_timeToSleep) {
            for (i = 0;
            i < this.m_bodyCount; ++i) {
               b = this.m_bodies[i];
               b.SetAwake(false);
            }
         }
      }
   }
   b2Island.prototype.SolveTOI = function (subStep) {
      var i = 0;
      var j = 0;
      this.m_contactSolver.Initialize(subStep, this.m_contacts, this.m_contactCount, this.m_allocator);
      var contactSolver = this.m_contactSolver;
      for (i = 0;
      i < this.m_jointCount; ++i) {
         this.m_joints[i].InitVelocityConstraints(subStep);
      }
      for (i = 0;
      i < subStep.velocityIterations; ++i) {
         contactSolver.SolveVelocityConstraints();
         for (j = 0;
         j < this.m_jointCount; ++j) {
            this.m_joints[j].SolveVelocityConstraints(subStep);
         }
      }
      for (i = 0;
      i < this.m_bodyCount; ++i) {
         var b = this.m_bodies[i];
         if (b.GetType() == b2Body.b2_staticBody) continue;
         var translationX = subStep.dt * b.m_linearVelocity.x;
         var translationY = subStep.dt * b.m_linearVelocity.y;
         if ((translationX * translationX + translationY * translationY) > b2Settings.b2_maxTranslationSquared) {
            b.m_linearVelocity.Normalize();
            b.m_linearVelocity.x *= b2Settings.b2_maxTranslation * subStep.inv_dt;
            b.m_linearVelocity.y *= b2Settings.b2_maxTranslation * subStep.inv_dt;
         }
         var rotation = subStep.dt * b.m_angularVelocity;
         if (rotation * rotation > b2Settings.b2_maxRotationSquared) {
            if (b.m_angularVelocity < 0.0) {
               b.m_angularVelocity = (-b2Settings.b2_maxRotation * subStep.inv_dt);
            }
            else {
               b.m_angularVelocity = b2Settings.b2_maxRotation * subStep.inv_dt;
            }
         }
         b.m_sweep.c0.SetV(b.m_sweep.c);
         b.m_sweep.a0 = b.m_sweep.a;
         b.m_sweep.c.x += subStep.dt * b.m_linearVelocity.x;
         b.m_sweep.c.y += subStep.dt * b.m_linearVelocity.y;
         b.m_sweep.a += subStep.dt * b.m_angularVelocity;
         b.SynchronizeTransform();
      }
      var k_toiBaumgarte = 0.75;
      for (i = 0;
      i < subStep.positionIterations; ++i) {
         var contactsOkay = contactSolver.SolvePositionConstraints(k_toiBaumgarte);
         var jointsOkay = true;
         for (j = 0;
         j < this.m_jointCount; ++j) {
            var jointOkay = this.m_joints[j].SolvePositionConstraints(b2Settings.b2_contactBaumgarte);
            jointsOkay = jointsOkay && jointOkay;
         }
         if (contactsOkay && jointsOkay) {
            break;
         }
      }
      this.Report(contactSolver.m_constraints);
   }
   b2Island.prototype.Report = function (constraints) {
      if (this.m_listener == null) {
         return;
      }
      for (var i = 0; i < this.m_contactCount; ++i) {
         var c = this.m_contacts[i];
         var cc = constraints[i];
         for (var j = 0; j < cc.pointCount; ++j) {
            b2Island.s_impulse.normalImpulses[j] = cc.points[j].normalImpulse;
            b2Island.s_impulse.tangentImpulses[j] = cc.points[j].tangentImpulse;
         }
         this.m_listener.PostSolve(c, b2Island.s_impulse);
      }
   }
   b2Island.prototype.AddBody = function (body) {
      body.m_islandIndex = this.m_bodyCount;
      this.m_bodies[this.m_bodyCount++] = body;
   }
   b2Island.prototype.AddContact = function (contact) {
      this.m_contacts[this.m_contactCount++] = contact;
   }
   b2Island.prototype.AddJoint = function (joint) {
      this.m_joints[this.m_jointCount++] = joint;
   }
   Box2D.postDefs.push(function () {
      Box2D.Dynamics.b2Island.s_impulse = new b2ContactImpulse();
   });
   b2TimeStep.b2TimeStep = function () {};
   b2TimeStep.prototype.Set = function (step) {
      this.dt = step.dt;
      this.inv_dt = step.inv_dt;
      this.positionIterations = step.positionIterations;
      this.velocityIterations = step.velocityIterations;
      this.warmStarting = step.warmStarting;
   }
   b2World.b2World = function () {
      this.s_stack = new Vector();
      this.m_contactManager = new b2ContactManager();
      this.m_contactSolver = new b2ContactSolver();
      this.m_island = new b2Island();
   };
   b2World.prototype.b2World = function (gravity, doSleep) {
      this.m_destructionListener = null;
      this.m_debugDraw = null;
      this.m_bodyList = null;
      this.m_contactList = null;
      this.m_jointList = null;
      this.m_controllerList = null;
      this.m_bodyCount = 0;
      this.m_contactCount = 0;
      this.m_jointCount = 0;
      this.m_controllerCount = 0;
      b2World.m_warmStarting = true;
      b2World.m_continuousPhysics = true;
      this.m_allowSleep = doSleep;
      this.m_gravity = gravity;
      this.m_inv_dt0 = 0.0;
      this.m_contactManager.m_world = this;
      var bd = new b2BodyDef();
      this.m_groundBody = this.CreateBody(bd);
   }
   b2World.prototype.SetDestructionListener = function (listener) {
      this.m_destructionListener = listener;
   }
   b2World.prototype.SetContactFilter = function (filter) {
      this.m_contactManager.m_contactFilter = filter;
   }
   b2World.prototype.SetContactListener = function (listener) {
      this.m_contactManager.m_contactListener = listener;
   }
   b2World.prototype.SetDebugDraw = function (debugDraw) {
      this.m_debugDraw = debugDraw;
   }
   b2World.prototype.SetBroadPhase = function (broadPhase) {
      var oldBroadPhase = this.m_contactManager.m_broadPhase;
      this.m_contactManager.m_broadPhase = broadPhase;
      for (var b = this.m_bodyList; b; b = b.m_next) {
         for (var f = b.m_fixtureList; f; f = f.m_next) {
            f.m_proxy = broadPhase.CreateProxy(oldBroadPhase.GetFatAABB(f.m_proxy), f);
         }
      }
   }
   b2World.prototype.Validate = function () {
      this.m_contactManager.m_broadPhase.Validate();
   }
   b2World.prototype.GetProxyCount = function () {
      return this.m_contactManager.m_broadPhase.GetProxyCount();
   }
   b2World.prototype.CreateBody = function (def) {
      if (this.IsLocked() == true) {
         return null;
      }
      var b = new b2Body(def, this);
      b.m_prev = null;
      b.m_next = this.m_bodyList;
      if (this.m_bodyList) {
         this.m_bodyList.m_prev = b;
      }
      this.m_bodyList = b;
      ++this.m_bodyCount;
      return b;
   }
   b2World.prototype.DestroyBody = function (b) {
      if (this.IsLocked() == true) {
         return;
      }
      var jn = b.m_jointList;
      while (jn) {
         var jn0 = jn;
         jn = jn.next;
         if (this.m_destructionListener) {
            this.m_destructionListener.SayGoodbyeJoint(jn0.joint);
         }
         this.DestroyJoint(jn0.joint);
      }
      var coe = b.m_controllerList;
      while (coe) {
         var coe0 = coe;
         coe = coe.nextController;
         coe0.controller.RemoveBody(b);
      }
      var ce = b.m_contactList;
      while (ce) {
         var ce0 = ce;
         ce = ce.next;
         this.m_contactManager.Destroy(ce0.contact);
      }
      b.m_contactList = null;
      var f = b.m_fixtureList;
      while (f) {
         var f0 = f;
         f = f.m_next;
         if (this.m_destructionListener) {
            this.m_destructionListener.SayGoodbyeFixture(f0);
         }
         f0.DestroyProxy(this.m_contactManager.m_broadPhase);
         f0.Destroy();
      }
      b.m_fixtureList = null;
      b.m_fixtureCount = 0;
      if (b.m_prev) {
         b.m_prev.m_next = b.m_next;
      }
      if (b.m_next) {
         b.m_next.m_prev = b.m_prev;
      }
      if (b == this.m_bodyList) {
         this.m_bodyList = b.m_next;
      }--this.m_bodyCount;
   }
   b2World.prototype.CreateJoint = function (def) {
      var j = b2Joint.Create(def, null);
      j.m_prev = null;
      j.m_next = this.m_jointList;
      if (this.m_jointList) {
         this.m_jointList.m_prev = j;
      }
      this.m_jointList = j;
      ++this.m_jointCount;
      j.m_edgeA.joint = j;
      j.m_edgeA.other = j.m_bodyB;
      j.m_edgeA.prev = null;
      j.m_edgeA.next = j.m_bodyA.m_jointList;
      if (j.m_bodyA.m_jointList) j.m_bodyA.m_jointList.prev = j.m_edgeA;
      j.m_bodyA.m_jointList = j.m_edgeA;
      j.m_edgeB.joint = j;
      j.m_edgeB.other = j.m_bodyA;
      j.m_edgeB.prev = null;
      j.m_edgeB.next = j.m_bodyB.m_jointList;
      if (j.m_bodyB.m_jointList) j.m_bodyB.m_jointList.prev = j.m_edgeB;
      j.m_bodyB.m_jointList = j.m_edgeB;
      var bodyA = def.bodyA;
      var bodyB = def.bodyB;
      if (def.collideConnected == false) {
         var edge = bodyB.GetContactList();
         while (edge) {
            if (edge.other == bodyA) {
               edge.contact.FlagForFiltering();
            }
            edge = edge.next;
         }
      }
      return j;
   }
   b2World.prototype.DestroyJoint = function (j) {
      var collideConnected = j.m_collideConnected;
      if (j.m_prev) {
         j.m_prev.m_next = j.m_next;
      }
      if (j.m_next) {
         j.m_next.m_prev = j.m_prev;
      }
      if (j == this.m_jointList) {
         this.m_jointList = j.m_next;
      }
      var bodyA = j.m_bodyA;
      var bodyB = j.m_bodyB;
      bodyA.SetAwake(true);
      bodyB.SetAwake(true);
      if (j.m_edgeA.prev) {
         j.m_edgeA.prev.next = j.m_edgeA.next;
      }
      if (j.m_edgeA.next) {
         j.m_edgeA.next.prev = j.m_edgeA.prev;
      }
      if (j.m_edgeA == bodyA.m_jointList) {
         bodyA.m_jointList = j.m_edgeA.next;
      }
      j.m_edgeA.prev = null;
      j.m_edgeA.next = null;
      if (j.m_edgeB.prev) {
         j.m_edgeB.prev.next = j.m_edgeB.next;
      }
      if (j.m_edgeB.next) {
         j.m_edgeB.next.prev = j.m_edgeB.prev;
      }
      if (j.m_edgeB == bodyB.m_jointList) {
         bodyB.m_jointList = j.m_edgeB.next;
      }
      j.m_edgeB.prev = null;
      j.m_edgeB.next = null;
      b2Joint.Destroy(j, null);
      --this.m_jointCount;
      if (collideConnected == false) {
         var edge = bodyB.GetContactList();
         while (edge) {
            if (edge.other == bodyA) {
               edge.contact.FlagForFiltering();
            }
            edge = edge.next;
         }
      }
   }
   b2World.prototype.AddController = function (c) {
      c.m_next = this.m_controllerList;
      c.m_prev = null;
      this.m_controllerList = c;
      c.m_world = this;
      this.m_controllerCount++;
      return c;
   }
   b2World.prototype.RemoveController = function (c) {
      if (c.m_prev) c.m_prev.m_next = c.m_next;
      if (c.m_next) c.m_next.m_prev = c.m_prev;
      if (this.m_controllerList == c) this.m_controllerList = c.m_next;
      this.m_controllerCount--;
   }
   b2World.prototype.CreateController = function (controller) {
      if (controller.m_world != this) throw new Error("Controller can only be a member of one world");
      controller.m_next = this.m_controllerList;
      controller.m_prev = null;
      if (this.m_controllerList) this.m_controllerList.m_prev = controller;
      this.m_controllerList = controller;
      ++this.m_controllerCount;
      controller.m_world = this;
      return controller;
   }
   b2World.prototype.DestroyController = function (controller) {
      controller.Clear();
      if (controller.m_next) controller.m_next.m_prev = controller.m_prev;
      if (controller.m_prev) controller.m_prev.m_next = controller.m_next;
      if (controller == this.m_controllerList) this.m_controllerList = controller.m_next;
      --this.m_controllerCount;
   }
   b2World.prototype.SetWarmStarting = function (flag) {
      b2World.m_warmStarting = flag;
   }
   b2World.prototype.SetContinuousPhysics = function (flag) {
      b2World.m_continuousPhysics = flag;
   }
   b2World.prototype.GetBodyCount = function () {
      return this.m_bodyCount;
   }
   b2World.prototype.GetJointCount = function () {
      return this.m_jointCount;
   }
   b2World.prototype.GetContactCount = function () {
      return this.m_contactCount;
   }
   b2World.prototype.SetGravity = function (gravity) {
      this.m_gravity = gravity;
   }
   b2World.prototype.GetGravity = function () {
      return this.m_gravity;
   }
   b2World.prototype.GetGroundBody = function () {
      return this.m_groundBody;
   }
   b2World.prototype.Step = function (dt, velocityIterations, positionIterations) {
      if (dt === undefined) dt = 0;
      if (velocityIterations === undefined) velocityIterations = 0;
      if (positionIterations === undefined) positionIterations = 0;
      if (this.m_flags & b2World.e_newFixture) {
         this.m_contactManager.FindNewContacts();
         this.m_flags &= ~b2World.e_newFixture;
      }
      this.m_flags |= b2World.e_locked;
      var step = b2World.s_timestep2;
      step.dt = dt;
      step.velocityIterations = velocityIterations;
      step.positionIterations = positionIterations;
      if (dt > 0.0) {
         step.inv_dt = 1.0 / dt;
      }
      else {
         step.inv_dt = 0.0;
      }
      step.dtRatio = this.m_inv_dt0 * dt;
      step.warmStarting = b2World.m_warmStarting;
      this.m_contactManager.Collide();
      if (step.dt > 0.0) {
         this.Solve(step);
      }
      if (b2World.m_continuousPhysics && step.dt > 0.0) {
         this.SolveTOI(step);
      }
      if (step.dt > 0.0) {
         this.m_inv_dt0 = step.inv_dt;
      }
      this.m_flags &= ~b2World.e_locked;
   }
   b2World.prototype.ClearForces = function () {
      for (var body = this.m_bodyList; body; body = body.m_next) {
         body.m_force.SetZero();
         body.m_torque = 0.0;
      }
   }
   b2World.prototype.DrawDebugData = function () {
      if (this.m_debugDraw == null) {
         return;
      }
      this.m_debugDraw.m_sprite.graphics.clear();
      var flags = this.m_debugDraw.GetFlags();
      var i = 0;
      var b;
      var f;
      var s;
      var j;
      var bp;
      var invQ = new b2Vec2;
      var x1 = new b2Vec2;
      var x2 = new b2Vec2;
      var xf;
      var b1 = new b2AABB();
      var b2 = new b2AABB();
      var vs = [new b2Vec2(), new b2Vec2(), new b2Vec2(), new b2Vec2()];
      var color = new b2Color(0, 0, 0);
      if (flags & b2DebugDraw.e_shapeBit) {
         for (b = this.m_bodyList;
         b; b = b.m_next) {
            xf = b.m_xf;
            for (f = b.GetFixtureList();
            f; f = f.m_next) {
               s = f.GetShape();
               if (b.IsActive() == false) {
                  color.Set(0.5, 0.5, 0.3);
                  this.DrawShape(s, xf, color);
               }
               else if (b.GetType() == b2Body.b2_staticBody) {
                  color.Set(0.5, 0.9, 0.5);
                  this.DrawShape(s, xf, color);
               }
               else if (b.GetType() == b2Body.b2_kinematicBody) {
                  color.Set(0.5, 0.5, 0.9);
                  this.DrawShape(s, xf, color);
               }
               else if (b.IsAwake() == false) {
                  color.Set(0.6, 0.6, 0.6);
                  this.DrawShape(s, xf, color);
               }
               else {
                  color.Set(0.9, 0.7, 0.7);
                  this.DrawShape(s, xf, color);
               }
            }
         }
      }
      if (flags & b2DebugDraw.e_jointBit) {
         for (j = this.m_jointList;
         j; j = j.m_next) {
            this.DrawJoint(j);
         }
      }
      if (flags & b2DebugDraw.e_controllerBit) {
         for (var c = this.m_controllerList; c; c = c.m_next) {
            c.Draw(this.m_debugDraw);
         }
      }
      if (flags & b2DebugDraw.e_pairBit) {
         color.Set(0.3, 0.9, 0.9);
         for (var contact = this.m_contactManager.m_contactList; contact; contact = contact.GetNext()) {
            var fixtureA = contact.GetFixtureA();
            var fixtureB = contact.GetFixtureB();
            var cA = fixtureA.GetAABB().GetCenter();
            var cB = fixtureB.GetAABB().GetCenter();
            this.m_debugDraw.DrawSegment(cA, cB, color);
         }
      }
      if (flags & b2DebugDraw.e_aabbBit) {
         bp = this.m_contactManager.m_broadPhase;
         vs = [new b2Vec2(), new b2Vec2(), new b2Vec2(), new b2Vec2()];
         for (b = this.m_bodyList;
         b; b = b.GetNext()) {
            if (b.IsActive() == false) {
               continue;
            }
            for (f = b.GetFixtureList();
            f; f = f.GetNext()) {
               var aabb = bp.GetFatAABB(f.m_proxy);
               vs[0].Set(aabb.lowerBound.x, aabb.lowerBound.y);
               vs[1].Set(aabb.upperBound.x, aabb.lowerBound.y);
               vs[2].Set(aabb.upperBound.x, aabb.upperBound.y);
               vs[3].Set(aabb.lowerBound.x, aabb.upperBound.y);
               this.m_debugDraw.DrawPolygon(vs, 4, color);
            }
         }
      }
      if (flags & b2DebugDraw.e_centerOfMassBit) {
         for (b = this.m_bodyList;
         b; b = b.m_next) {
            xf = b2World.s_xf;
            xf.R = b.m_xf.R;
            xf.position = b.GetWorldCenter();
            this.m_debugDraw.DrawTransform(xf);
         }
      }
   }
   b2World.prototype.QueryAABB = function (callback, aabb) {
      var __this = this;
      var broadPhase = __this.m_contactManager.m_broadPhase;

      function WorldQueryWrapper(proxy) {
         return callback(broadPhase.GetUserData(proxy));
      };
      broadPhase.Query(WorldQueryWrapper, aabb);
   }
   b2World.prototype.QueryShape = function (callback, shape, transform) {
      var __this = this;
      if (transform === undefined) transform = null;
      if (transform == null) {
         transform = new b2Transform();
         transform.SetIdentity();
      }
      var broadPhase = __this.m_contactManager.m_broadPhase;

      function WorldQueryWrapper(proxy) {
         var fixture = (broadPhase.GetUserData(proxy) instanceof b2Fixture ? broadPhase.GetUserData(proxy) : null);
         if (b2Shape.TestOverlap(shape, transform, fixture.GetShape(), fixture.GetBody().GetTransform())) return callback(fixture);
         return true;
      };
      var aabb = new b2AABB();
      shape.ComputeAABB(aabb, transform);
      broadPhase.Query(WorldQueryWrapper, aabb);
   }
   b2World.prototype.QueryPoint = function (callback, p) {
      var __this = this;
      var broadPhase = __this.m_contactManager.m_broadPhase;

      function WorldQueryWrapper(proxy) {
         var fixture = (broadPhase.GetUserData(proxy) instanceof b2Fixture ? broadPhase.GetUserData(proxy) : null);
         if (fixture.TestPoint(p)) return callback(fixture);
         return true;
      };
      var aabb = new b2AABB();
      aabb.lowerBound.Set(p.x - b2Settings.b2_linearSlop, p.y - b2Settings.b2_linearSlop);
      aabb.upperBound.Set(p.x + b2Settings.b2_linearSlop, p.y + b2Settings.b2_linearSlop);
      broadPhase.Query(WorldQueryWrapper, aabb);
   }
   b2World.prototype.RayCast = function (callback, point1, point2) {
      var __this = this;
      var broadPhase = __this.m_contactManager.m_broadPhase;
      var output = new b2RayCastOutput;

      function RayCastWrapper(input, proxy) {
         var userData = broadPhase.GetUserData(proxy);
         var fixture = (userData instanceof b2Fixture ? userData : null);
         var hit = fixture.RayCast(output, input);
         if (hit) {
            var fraction = output.fraction;
            var point = new b2Vec2((1.0 - fraction) * point1.x + fraction * point2.x, (1.0 - fraction) * point1.y + fraction * point2.y);
            return callback(fixture, point, output.normal, fraction);
         }
         return input.maxFraction;
      };
      var input = new b2RayCastInput(point1, point2);
      broadPhase.RayCast(RayCastWrapper, input);
   }
   b2World.prototype.RayCastOne = function (point1, point2) {
      var __this = this;
      var result;

      function RayCastOneWrapper(fixture, point, normal, fraction) {
         if (fraction === undefined) fraction = 0;
         result = fixture;
         return fraction;
      };
      __this.RayCast(RayCastOneWrapper, point1, point2);
      return result;
   }
   b2World.prototype.RayCastAll = function (point1, point2) {
      var __this = this;
      var result = new Vector();

      function RayCastAllWrapper(fixture, point, normal, fraction) {
         if (fraction === undefined) fraction = 0;
         result[result.length] = fixture;
         return 1;
      };
      __this.RayCast(RayCastAllWrapper, point1, point2);
      return result;
   }
   b2World.prototype.GetBodyList = function () {
      return this.m_bodyList;
   }
   b2World.prototype.GetJointList = function () {
      return this.m_jointList;
   }
   b2World.prototype.GetContactList = function () {
      return this.m_contactList;
   }
   b2World.prototype.IsLocked = function () {
      return (this.m_flags & b2World.e_locked) > 0;
   }
   b2World.prototype.Solve = function (step) {
      var b;
      for (var controller = this.m_controllerList; controller; controller = controller.m_next) {
         controller.Step(step);
      }
      var island = this.m_island;
      island.Initialize(this.m_bodyCount, this.m_contactCount, this.m_jointCount, null, this.m_contactManager.m_contactListener, this.m_contactSolver);
      for (b = this.m_bodyList;
      b; b = b.m_next) {
         b.m_flags &= ~b2Body.e_islandFlag;
      }
      for (var c = this.m_contactList; c; c = c.m_next) {
         c.m_flags &= ~b2Contact.e_islandFlag;
      }
      for (var j = this.m_jointList; j; j = j.m_next) {
         j.m_islandFlag = false;
      }
      var stackSize = parseInt(this.m_bodyCount);
      var stack = this.s_stack;
      for (var seed = this.m_bodyList; seed; seed = seed.m_next) {
         if (seed.m_flags & b2Body.e_islandFlag) {
            continue;
         }
         if (seed.IsAwake() == false || seed.IsActive() == false) {
            continue;
         }
         if (seed.GetType() == b2Body.b2_staticBody) {
            continue;
         }
         island.Clear();
         var stackCount = 0;
         stack[stackCount++] = seed;
         seed.m_flags |= b2Body.e_islandFlag;
         while (stackCount > 0) {
            b = stack[--stackCount];
            island.AddBody(b);
            if (b.IsAwake() == false) {
               b.SetAwake(true);
            }
            if (b.GetType() == b2Body.b2_staticBody) {
               continue;
            }
            var other;
            for (var ce = b.m_contactList; ce; ce = ce.next) {
               if (ce.contact.m_flags & b2Contact.e_islandFlag) {
                  continue;
               }
               if (ce.contact.IsSensor() == true || ce.contact.IsEnabled() == false || ce.contact.IsTouching() == false) {
                  continue;
               }
               island.AddContact(ce.contact);
               ce.contact.m_flags |= b2Contact.e_islandFlag;
               other = ce.other;
               if (other.m_flags & b2Body.e_islandFlag) {
                  continue;
               }
               stack[stackCount++] = other;
               other.m_flags |= b2Body.e_islandFlag;
            }
            for (var jn = b.m_jointList; jn; jn = jn.next) {
               if (jn.joint.m_islandFlag == true) {
                  continue;
               }
               other = jn.other;
               if (other.IsActive() == false) {
                  continue;
               }
               island.AddJoint(jn.joint);
               jn.joint.m_islandFlag = true;
               if (other.m_flags & b2Body.e_islandFlag) {
                  continue;
               }
               stack[stackCount++] = other;
               other.m_flags |= b2Body.e_islandFlag;
            }
         }
         island.Solve(step, this.m_gravity, this.m_allowSleep);
         for (var i = 0; i < island.m_bodyCount; ++i) {
            b = island.m_bodies[i];
            if (b.GetType() == b2Body.b2_staticBody) {
               b.m_flags &= ~b2Body.e_islandFlag;
            }
         }
      }
      for (i = 0;
      i < stack.length; ++i) {
         if (!stack[i]) break;
         stack[i] = null;
      }
      for (b = this.m_bodyList;
      b; b = b.m_next) {
         if (b.IsAwake() == false || b.IsActive() == false) {
            continue;
         }
         if (b.GetType() == b2Body.b2_staticBody) {
            continue;
         }
         b.SynchronizeFixtures();
      }
      this.m_contactManager.FindNewContacts();
   }
   b2World.prototype.SolveTOI = function (step) {
      var b;
      var fA;
      var fB;
      var bA;
      var bB;
      var cEdge;
      var j;
      var island = this.m_island;
      island.Initialize(this.m_bodyCount, b2Settings.b2_maxTOIContactsPerIsland, b2Settings.b2_maxTOIJointsPerIsland, null, this.m_contactManager.m_contactListener, this.m_contactSolver);
      var queue = b2World.s_queue;
      for (b = this.m_bodyList;
      b; b = b.m_next) {
         b.m_flags &= ~b2Body.e_islandFlag;
         b.m_sweep.t0 = 0.0;
      }
      var c;
      for (c = this.m_contactList;
      c; c = c.m_next) {
         c.m_flags &= ~ (b2Contact.e_toiFlag | b2Contact.e_islandFlag);
      }
      for (j = this.m_jointList;
      j; j = j.m_next) {
         j.m_islandFlag = false;
      }
      for (;;) {
         var minContact = null;
         var minTOI = 1.0;
         for (c = this.m_contactList;
         c; c = c.m_next) {
            if (c.IsSensor() == true || c.IsEnabled() == false || c.IsContinuous() == false) {
               continue;
            }
            var toi = 1.0;
            if (c.m_flags & b2Contact.e_toiFlag) {
               toi = c.m_toi;
            }
            else {
               fA = c.m_fixtureA;
               fB = c.m_fixtureB;
               bA = fA.m_body;
               bB = fB.m_body;
               if ((bA.GetType() != b2Body.b2_dynamicBody || bA.IsAwake() == false) && (bB.GetType() != b2Body.b2_dynamicBody || bB.IsAwake() == false)) {
                  continue;
               }
               var t0 = bA.m_sweep.t0;
               if (bA.m_sweep.t0 < bB.m_sweep.t0) {
                  t0 = bB.m_sweep.t0;
                  bA.m_sweep.Advance(t0);
               }
               else if (bB.m_sweep.t0 < bA.m_sweep.t0) {
                  t0 = bA.m_sweep.t0;
                  bB.m_sweep.Advance(t0);
               }
               toi = c.ComputeTOI(bA.m_sweep, bB.m_sweep);
               b2Settings.b2Assert(0.0 <= toi && toi <= 1.0);
               if (toi > 0.0 && toi < 1.0) {
                  toi = (1.0 - toi) * t0 + toi;
                  if (toi > 1) toi = 1;
               }
               c.m_toi = toi;
               c.m_flags |= b2Contact.e_toiFlag;
            }
            if (Number.MIN_VALUE < toi && toi < minTOI) {
               minContact = c;
               minTOI = toi;
            }
         }
         if (minContact == null || 1.0 - 100.0 * Number.MIN_VALUE < minTOI) {
            break;
         }
         fA = minContact.m_fixtureA;
         fB = minContact.m_fixtureB;
         bA = fA.m_body;
         bB = fB.m_body;
         b2World.s_backupA.Set(bA.m_sweep);
         b2World.s_backupB.Set(bB.m_sweep);
         bA.Advance(minTOI);
         bB.Advance(minTOI);
         minContact.Update(this.m_contactManager.m_contactListener);
         minContact.m_flags &= ~b2Contact.e_toiFlag;
         if (minContact.IsSensor() == true || minContact.IsEnabled() == false) {
            bA.m_sweep.Set(b2World.s_backupA);
            bB.m_sweep.Set(b2World.s_backupB);
            bA.SynchronizeTransform();
            bB.SynchronizeTransform();
            continue;
         }
         if (minContact.IsTouching() == false) {
            continue;
         }
         var seed = bA;
         if (seed.GetType() != b2Body.b2_dynamicBody) {
            seed = bB;
         }
         island.Clear();
         var queueStart = 0;
         var queueSize = 0;
         queue[queueStart + queueSize++] = seed;
         seed.m_flags |= b2Body.e_islandFlag;
         while (queueSize > 0) {
            b = queue[queueStart++];
            --queueSize;
            island.AddBody(b);
            if (b.IsAwake() == false) {
               b.SetAwake(true);
            }
            if (b.GetType() != b2Body.b2_dynamicBody) {
               continue;
            }
            for (cEdge = b.m_contactList;
            cEdge; cEdge = cEdge.next) {
               if (island.m_contactCount == island.m_contactCapacity) {
                  break;
               }
               if (cEdge.contact.m_flags & b2Contact.e_islandFlag) {
                  continue;
               }
               if (cEdge.contact.IsSensor() == true || cEdge.contact.IsEnabled() == false || cEdge.contact.IsTouching() == false) {
                  continue;
               }
               island.AddContact(cEdge.contact);
               cEdge.contact.m_flags |= b2Contact.e_islandFlag;
               var other = cEdge.other;
               if (other.m_flags & b2Body.e_islandFlag) {
                  continue;
               }
               if (other.GetType() != b2Body.b2_staticBody) {
                  other.Advance(minTOI);
                  other.SetAwake(true);
               }
               queue[queueStart + queueSize] = other;
               ++queueSize;
               other.m_flags |= b2Body.e_islandFlag;
            }
            for (var jEdge = b.m_jointList; jEdge; jEdge = jEdge.next) {
               if (island.m_jointCount == island.m_jointCapacity) continue;
               if (jEdge.joint.m_islandFlag == true) continue;
               other = jEdge.other;
               if (other.IsActive() == false) {
                  continue;
               }
               island.AddJoint(jEdge.joint);
               jEdge.joint.m_islandFlag = true;
               if (other.m_flags & b2Body.e_islandFlag) continue;
               if (other.GetType() != b2Body.b2_staticBody) {
                  other.Advance(minTOI);
                  other.SetAwake(true);
               }
               queue[queueStart + queueSize] = other;
               ++queueSize;
               other.m_flags |= b2Body.e_islandFlag;
            }
         }
         var subStep = b2World.s_timestep;
         subStep.warmStarting = false;
         subStep.dt = (1.0 - minTOI) * step.dt;
         subStep.inv_dt = 1.0 / subStep.dt;
         subStep.dtRatio = 0.0;
         subStep.velocityIterations = step.velocityIterations;
         subStep.positionIterations = step.positionIterations;
         island.SolveTOI(subStep);
         var i = 0;
         for (i = 0;
         i < island.m_bodyCount; ++i) {
            b = island.m_bodies[i];
            b.m_flags &= ~b2Body.e_islandFlag;
            if (b.IsAwake() == false) {
               continue;
            }
            if (b.GetType() != b2Body.b2_dynamicBody) {
               continue;
            }
            b.SynchronizeFixtures();
            for (cEdge = b.m_contactList;
            cEdge; cEdge = cEdge.next) {
               cEdge.contact.m_flags &= ~b2Contact.e_toiFlag;
            }
         }
         for (i = 0;
         i < island.m_contactCount; ++i) {
            c = island.m_contacts[i];
            c.m_flags &= ~ (b2Contact.e_toiFlag | b2Contact.e_islandFlag);
         }
         for (i = 0;
         i < island.m_jointCount; ++i) {
            j = island.m_joints[i];
            j.m_islandFlag = false;
         }
         this.m_contactManager.FindNewContacts();
      }
   }
   b2World.prototype.DrawJoint = function (joint) {
      var b1 = joint.GetBodyA();
      var b2 = joint.GetBodyB();
      var xf1 = b1.m_xf;
      var xf2 = b2.m_xf;
      var x1 = xf1.position;
      var x2 = xf2.position;
      var p1 = joint.GetAnchorA();
      var p2 = joint.GetAnchorB();
      var color = b2World.s_jointColor;
      switch (joint.m_type) {
      case b2Joint.e_distanceJoint:
         this.m_debugDraw.DrawSegment(p1, p2, color);
         break;
      case b2Joint.e_pulleyJoint:
         {
            var pulley = ((joint instanceof b2PulleyJoint ? joint : null));
            var s1 = pulley.GetGroundAnchorA();
            var s2 = pulley.GetGroundAnchorB();
            this.m_debugDraw.DrawSegment(s1, p1, color);
            this.m_debugDraw.DrawSegment(s2, p2, color);
            this.m_debugDraw.DrawSegment(s1, s2, color);
         }
         break;
      case b2Joint.e_mouseJoint:
         this.m_debugDraw.DrawSegment(p1, p2, color);
         break;
      default:
         if (b1 != this.m_groundBody) this.m_debugDraw.DrawSegment(x1, p1, color);
         this.m_debugDraw.DrawSegment(p1, p2, color);
         if (b2 != this.m_groundBody) this.m_debugDraw.DrawSegment(x2, p2, color);
      }
   }
   b2World.prototype.DrawShape = function (shape, xf, color) {
      switch (shape.m_type) {
      case b2Shape.e_circleShape:
         {
            var circle = ((shape instanceof b2CircleShape ? shape : null));
            var center = b2Math.MulX(xf, circle.m_p);
            var radius = circle.m_radius;
            var axis = xf.R.col1;
            this.m_debugDraw.DrawSolidCircle(center, radius, axis, color);
         }
         break;
      case b2Shape.e_polygonShape:
         {
            var i = 0;
            var poly = ((shape instanceof b2PolygonShape ? shape : null));
            var vertexCount = parseInt(poly.GetVertexCount());
            var localVertices = poly.GetVertices();
            var vertices = new Vector(vertexCount);
            for (i = 0;
            i < vertexCount; ++i) {
               vertices[i] = b2Math.MulX(xf, localVertices[i]);
            }
            this.m_debugDraw.DrawSolidPolygon(vertices, vertexCount, color);
         }
         break;
      case b2Shape.e_edgeShape:
         {
            var edge = (shape instanceof b2EdgeShape ? shape : null);
            this.m_debugDraw.DrawSegment(b2Math.MulX(xf, edge.GetVertex1()), b2Math.MulX(xf, edge.GetVertex2()), color);
         }
         break;
      }
   }
   Box2D.postDefs.push(function () {
      Box2D.Dynamics.b2World.s_timestep2 = new b2TimeStep();
      Box2D.Dynamics.b2World.s_xf = new b2Transform();
      Box2D.Dynamics.b2World.s_backupA = new b2Sweep();
      Box2D.Dynamics.b2World.s_backupB = new b2Sweep();
      Box2D.Dynamics.b2World.s_timestep = new b2TimeStep();
      Box2D.Dynamics.b2World.s_queue = new Vector();
      Box2D.Dynamics.b2World.s_jointColor = new b2Color(0.5, 0.8, 0.8);
      Box2D.Dynamics.b2World.e_newFixture = 0x0001;
      Box2D.Dynamics.b2World.e_locked = 0x0002;
   });
})();
(function () {
   var b2CircleShape = Box2D.Collision.Shapes.b2CircleShape,
      b2EdgeChainDef = Box2D.Collision.Shapes.b2EdgeChainDef,
      b2EdgeShape = Box2D.Collision.Shapes.b2EdgeShape,
      b2MassData = Box2D.Collision.Shapes.b2MassData,
      b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape,
      b2Shape = Box2D.Collision.Shapes.b2Shape,
      b2CircleContact = Box2D.Dynamics.Contacts.b2CircleContact,
      b2Contact = Box2D.Dynamics.Contacts.b2Contact,
      b2ContactConstraint = Box2D.Dynamics.Contacts.b2ContactConstraint,
      b2ContactConstraintPoint = Box2D.Dynamics.Contacts.b2ContactConstraintPoint,
      b2ContactEdge = Box2D.Dynamics.Contacts.b2ContactEdge,
      b2ContactFactory = Box2D.Dynamics.Contacts.b2ContactFactory,
      b2ContactRegister = Box2D.Dynamics.Contacts.b2ContactRegister,
      b2ContactResult = Box2D.Dynamics.Contacts.b2ContactResult,
      b2ContactSolver = Box2D.Dynamics.Contacts.b2ContactSolver,
      b2EdgeAndCircleContact = Box2D.Dynamics.Contacts.b2EdgeAndCircleContact,
      b2NullContact = Box2D.Dynamics.Contacts.b2NullContact,
      b2PolyAndCircleContact = Box2D.Dynamics.Contacts.b2PolyAndCircleContact,
      b2PolyAndEdgeContact = Box2D.Dynamics.Contacts.b2PolyAndEdgeContact,
      b2PolygonContact = Box2D.Dynamics.Contacts.b2PolygonContact,
      b2PositionSolverManifold = Box2D.Dynamics.Contacts.b2PositionSolverManifold,
      b2Body = Box2D.Dynamics.b2Body,
      b2BodyDef = Box2D.Dynamics.b2BodyDef,
      b2ContactFilter = Box2D.Dynamics.b2ContactFilter,
      b2ContactImpulse = Box2D.Dynamics.b2ContactImpulse,
      b2ContactListener = Box2D.Dynamics.b2ContactListener,
      b2ContactManager = Box2D.Dynamics.b2ContactManager,
      b2DebugDraw = Box2D.Dynamics.b2DebugDraw,
      b2DestructionListener = Box2D.Dynamics.b2DestructionListener,
      b2FilterData = Box2D.Dynamics.b2FilterData,
      b2Fixture = Box2D.Dynamics.b2Fixture,
      b2FixtureDef = Box2D.Dynamics.b2FixtureDef,
      b2Island = Box2D.Dynamics.b2Island,
      b2TimeStep = Box2D.Dynamics.b2TimeStep,
      b2World = Box2D.Dynamics.b2World,
      b2Color = Box2D.Common.b2Color,
      b2internal = Box2D.Common.b2internal,
      b2Settings = Box2D.Common.b2Settings,
      b2Mat22 = Box2D.Common.Math.b2Mat22,
      b2Mat33 = Box2D.Common.Math.b2Mat33,
      b2Math = Box2D.Common.Math.b2Math,
      b2Sweep = Box2D.Common.Math.b2Sweep,
      b2Transform = Box2D.Common.Math.b2Transform,
      b2Vec2 = Box2D.Common.Math.b2Vec2,
      b2Vec3 = Box2D.Common.Math.b2Vec3,
      b2AABB = Box2D.Collision.b2AABB,
      b2Bound = Box2D.Collision.b2Bound,
      b2BoundValues = Box2D.Collision.b2BoundValues,
      b2Collision = Box2D.Collision.b2Collision,
      b2ContactID = Box2D.Collision.b2ContactID,
      b2ContactPoint = Box2D.Collision.b2ContactPoint,
      b2Distance = Box2D.Collision.b2Distance,
      b2DistanceInput = Box2D.Collision.b2DistanceInput,
      b2DistanceOutput = Box2D.Collision.b2DistanceOutput,
      b2DistanceProxy = Box2D.Collision.b2DistanceProxy,
      b2DynamicTree = Box2D.Collision.b2DynamicTree,
      b2DynamicTreeBroadPhase = Box2D.Collision.b2DynamicTreeBroadPhase,
      b2DynamicTreeNode = Box2D.Collision.b2DynamicTreeNode,
      b2DynamicTreePair = Box2D.Collision.b2DynamicTreePair,
      b2Manifold = Box2D.Collision.b2Manifold,
      b2ManifoldPoint = Box2D.Collision.b2ManifoldPoint,
      b2Point = Box2D.Collision.b2Point,
      b2RayCastInput = Box2D.Collision.b2RayCastInput,
      b2RayCastOutput = Box2D.Collision.b2RayCastOutput,
      b2Segment = Box2D.Collision.b2Segment,
      b2SeparationFunction = Box2D.Collision.b2SeparationFunction,
      b2Simplex = Box2D.Collision.b2Simplex,
      b2SimplexCache = Box2D.Collision.b2SimplexCache,
      b2SimplexVertex = Box2D.Collision.b2SimplexVertex,
      b2TimeOfImpact = Box2D.Collision.b2TimeOfImpact,
      b2TOIInput = Box2D.Collision.b2TOIInput,
      b2WorldManifold = Box2D.Collision.b2WorldManifold,
      ClipVertex = Box2D.Collision.ClipVertex,
      Features = Box2D.Collision.Features,
      IBroadPhase = Box2D.Collision.IBroadPhase;

   Box2D.inherit(b2CircleContact, Box2D.Dynamics.Contacts.b2Contact);
   b2CircleContact.prototype.__super = Box2D.Dynamics.Contacts.b2Contact.prototype;
   b2CircleContact.b2CircleContact = function () {
      Box2D.Dynamics.Contacts.b2Contact.b2Contact.apply(this, arguments);
   };
   b2CircleContact.Create = function (allocator) {
      return new b2CircleContact();
   }
   b2CircleContact.Destroy = function (contact, allocator) {}
   b2CircleContact.prototype.Reset = function (fixtureA, fixtureB) {
      this.__super.Reset.call(this, fixtureA, fixtureB);
   }
   b2CircleContact.prototype.Evaluate = function () {
      var bA = this.m_fixtureA.GetBody();
      var bB = this.m_fixtureB.GetBody();
      b2Collision.CollideCircles(this.m_manifold, (this.m_fixtureA.GetShape() instanceof b2CircleShape ? this.m_fixtureA.GetShape() : null), bA.m_xf, (this.m_fixtureB.GetShape() instanceof b2CircleShape ? this.m_fixtureB.GetShape() : null), bB.m_xf);
   }
   b2Contact.b2Contact = function () {
      this.m_nodeA = new b2ContactEdge();
      this.m_nodeB = new b2ContactEdge();
      this.m_manifold = new b2Manifold();
      this.m_oldManifold = new b2Manifold();
   };
   b2Contact.prototype.GetManifold = function () {
      return this.m_manifold;
   }
   b2Contact.prototype.GetWorldManifold = function (worldManifold) {
      var bodyA = this.m_fixtureA.GetBody();
      var bodyB = this.m_fixtureB.GetBody();
      var shapeA = this.m_fixtureA.GetShape();
      var shapeB = this.m_fixtureB.GetShape();
      worldManifold.Initialize(this.m_manifold, bodyA.GetTransform(), shapeA.m_radius, bodyB.GetTransform(), shapeB.m_radius);
   }
   b2Contact.prototype.IsTouching = function () {
      return (this.m_flags & b2Contact.e_touchingFlag) == b2Contact.e_touchingFlag;
   }
   b2Contact.prototype.IsContinuous = function () {
      return (this.m_flags & b2Contact.e_continuousFlag) == b2Contact.e_continuousFlag;
   }
   b2Contact.prototype.SetSensor = function (sensor) {
      if (sensor) {
         this.m_flags |= b2Contact.e_sensorFlag;
      }
      else {
         this.m_flags &= ~b2Contact.e_sensorFlag;
      }
   }
   b2Contact.prototype.IsSensor = function () {
      return (this.m_flags & b2Contact.e_sensorFlag) == b2Contact.e_sensorFlag;
   }
   b2Contact.prototype.SetEnabled = function (flag) {
      if (flag) {
         this.m_flags |= b2Contact.e_enabledFlag;
      }
      else {
         this.m_flags &= ~b2Contact.e_enabledFlag;
      }
   }
   b2Contact.prototype.IsEnabled = function () {
      return (this.m_flags & b2Contact.e_enabledFlag) == b2Contact.e_enabledFlag;
   }
   b2Contact.prototype.GetNext = function () {
      return this.m_next;
   }
   b2Contact.prototype.GetFixtureA = function () {
      return this.m_fixtureA;
   }
   b2Contact.prototype.GetFixtureB = function () {
      return this.m_fixtureB;
   }
   b2Contact.prototype.FlagForFiltering = function () {
      this.m_flags |= b2Contact.e_filterFlag;
   }
   b2Contact.prototype.b2Contact = function () {}
   b2Contact.prototype.Reset = function (fixtureA, fixtureB) {
      if (fixtureA === undefined) fixtureA = null;
      if (fixtureB === undefined) fixtureB = null;
      this.m_flags = b2Contact.e_enabledFlag;
      if (!fixtureA || !fixtureB) {
         this.m_fixtureA = null;
         this.m_fixtureB = null;
         return;
      }
      if (fixtureA.IsSensor() || fixtureB.IsSensor()) {
         this.m_flags |= b2Contact.e_sensorFlag;
      }
      var bodyA = fixtureA.GetBody();
      var bodyB = fixtureB.GetBody();
      if (bodyA.GetType() != b2Body.b2_dynamicBody || bodyA.IsBullet() || bodyB.GetType() != b2Body.b2_dynamicBody || bodyB.IsBullet()) {
         this.m_flags |= b2Contact.e_continuousFlag;
      }
      this.m_fixtureA = fixtureA;
      this.m_fixtureB = fixtureB;
      this.m_manifold.m_pointCount = 0;
      this.m_prev = null;
      this.m_next = null;
      this.m_nodeA.contact = null;
      this.m_nodeA.prev = null;
      this.m_nodeA.next = null;
      this.m_nodeA.other = null;
      this.m_nodeB.contact = null;
      this.m_nodeB.prev = null;
      this.m_nodeB.next = null;
      this.m_nodeB.other = null;
   }
   b2Contact.prototype.Update = function (listener) {
      var tManifold = this.m_oldManifold;
      this.m_oldManifold = this.m_manifold;
      this.m_manifold = tManifold;
      this.m_flags |= b2Contact.e_enabledFlag;
      var touching = false;
      var wasTouching = (this.m_flags & b2Contact.e_touchingFlag) == b2Contact.e_touchingFlag;
      var bodyA = this.m_fixtureA.m_body;
      var bodyB = this.m_fixtureB.m_body;
      var aabbOverlap = this.m_fixtureA.m_aabb.TestOverlap(this.m_fixtureB.m_aabb);
      if (this.m_flags & b2Contact.e_sensorFlag) {
         if (aabbOverlap) {
            var shapeA = this.m_fixtureA.GetShape();
            var shapeB = this.m_fixtureB.GetShape();
            var xfA = bodyA.GetTransform();
            var xfB = bodyB.GetTransform();
            touching = b2Shape.TestOverlap(shapeA, xfA, shapeB, xfB);
         }
         this.m_manifold.m_pointCount = 0;
      }
      else {
         if (bodyA.GetType() != b2Body.b2_dynamicBody || bodyA.IsBullet() || bodyB.GetType() != b2Body.b2_dynamicBody || bodyB.IsBullet()) {
            this.m_flags |= b2Contact.e_continuousFlag;
         }
         else {
            this.m_flags &= ~b2Contact.e_continuousFlag;
         }
         if (aabbOverlap) {
            this.Evaluate();
            touching = this.m_manifold.m_pointCount > 0;
            for (var i = 0; i < this.m_manifold.m_pointCount; ++i) {
               var mp2 = this.m_manifold.m_points[i];
               mp2.m_normalImpulse = 0.0;
               mp2.m_tangentImpulse = 0.0;
               var id2 = mp2.m_id;
               for (var j = 0; j < this.m_oldManifold.m_pointCount; ++j) {
                  var mp1 = this.m_oldManifold.m_points[j];
                  if (mp1.m_id.key == id2.key) {
                     mp2.m_normalImpulse = mp1.m_normalImpulse;
                     mp2.m_tangentImpulse = mp1.m_tangentImpulse;
                     break;
                  }
               }
            }
         }
         else {
            this.m_manifold.m_pointCount = 0;
         }
         if (touching != wasTouching) {
            bodyA.SetAwake(true);
            bodyB.SetAwake(true);
         }
      }
      if (touching) {
         this.m_flags |= b2Contact.e_touchingFlag;
      }
      else {
         this.m_flags &= ~b2Contact.e_touchingFlag;
      }
      if (wasTouching == false && touching == true) {
         listener.BeginContact(this);
      }
      if (wasTouching == true && touching == false) {
         listener.EndContact(this);
      }
      if ((this.m_flags & b2Contact.e_sensorFlag) == 0) {
         listener.PreSolve(this, this.m_oldManifold);
      }
   }
   b2Contact.prototype.Evaluate = function () {}
   b2Contact.prototype.ComputeTOI = function (sweepA, sweepB) {
      b2Contact.s_input.proxyA.Set(this.m_fixtureA.GetShape());
      b2Contact.s_input.proxyB.Set(this.m_fixtureB.GetShape());
      b2Contact.s_input.sweepA = sweepA;
      b2Contact.s_input.sweepB = sweepB;
      b2Contact.s_input.tolerance = b2Settings.b2_linearSlop;
      return b2TimeOfImpact.TimeOfImpact(b2Contact.s_input);
   }
   Box2D.postDefs.push(function () {
      Box2D.Dynamics.Contacts.b2Contact.e_sensorFlag = 0x0001;
      Box2D.Dynamics.Contacts.b2Contact.e_continuousFlag = 0x0002;
      Box2D.Dynamics.Contacts.b2Contact.e_islandFlag = 0x0004;
      Box2D.Dynamics.Contacts.b2Contact.e_toiFlag = 0x0008;
      Box2D.Dynamics.Contacts.b2Contact.e_touchingFlag = 0x0010;
      Box2D.Dynamics.Contacts.b2Contact.e_enabledFlag = 0x0020;
      Box2D.Dynamics.Contacts.b2Contact.e_filterFlag = 0x0040;
      Box2D.Dynamics.Contacts.b2Contact.s_input = new b2TOIInput();
   });
   b2ContactConstraint.b2ContactConstraint = function () {
      this.localPlaneNormal = new b2Vec2();
      this.localPoint = new b2Vec2();
      this.normal = new b2Vec2();
      this.normalMass = new b2Mat22();
      this.K = new b2Mat22();
   };
   b2ContactConstraint.prototype.b2ContactConstraint = function () {
      this.points = new Vector(b2Settings.b2_maxManifoldPoints);
      for (var i = 0; i < b2Settings.b2_maxManifoldPoints; i++) {
         this.points[i] = new b2ContactConstraintPoint();
      }
   }
   b2ContactConstraintPoint.b2ContactConstraintPoint = function () {
      this.localPoint = new b2Vec2();
      this.rA = new b2Vec2();
      this.rB = new b2Vec2();
   };
   b2ContactEdge.b2ContactEdge = function () {};
   b2ContactFactory.b2ContactFactory = function () {};
   b2ContactFactory.prototype.b2ContactFactory = function (allocator) {
      this.m_allocator = allocator;
      this.InitializeRegisters();
   }
   b2ContactFactory.prototype.AddType = function (createFcn, destroyFcn, type1, type2) {
      if (type1 === undefined) type1 = 0;
      if (type2 === undefined) type2 = 0;
      this.m_registers[type1][type2].createFcn = createFcn;
      this.m_registers[type1][type2].destroyFcn = destroyFcn;
      this.m_registers[type1][type2].primary = true;
      if (type1 != type2) {
         this.m_registers[type2][type1].createFcn = createFcn;
         this.m_registers[type2][type1].destroyFcn = destroyFcn;
         this.m_registers[type2][type1].primary = false;
      }
   }
   b2ContactFactory.prototype.InitializeRegisters = function () {
      this.m_registers = new Vector(b2Shape.e_shapeTypeCount);
      for (var i = 0; i < b2Shape.e_shapeTypeCount; i++) {
         this.m_registers[i] = new Vector(b2Shape.e_shapeTypeCount);
         for (var j = 0; j < b2Shape.e_shapeTypeCount; j++) {
            this.m_registers[i][j] = new b2ContactRegister();
         }
      }
      this.AddType(b2CircleContact.Create, b2CircleContact.Destroy, b2Shape.e_circleShape, b2Shape.e_circleShape);
      this.AddType(b2PolyAndCircleContact.Create, b2PolyAndCircleContact.Destroy, b2Shape.e_polygonShape, b2Shape.e_circleShape);
      this.AddType(b2PolygonContact.Create, b2PolygonContact.Destroy, b2Shape.e_polygonShape, b2Shape.e_polygonShape);
      this.AddType(b2EdgeAndCircleContact.Create, b2EdgeAndCircleContact.Destroy, b2Shape.e_edgeShape, b2Shape.e_circleShape);
      this.AddType(b2PolyAndEdgeContact.Create, b2PolyAndEdgeContact.Destroy, b2Shape.e_polygonShape, b2Shape.e_edgeShape);
   }
   b2ContactFactory.prototype.Create = function (fixtureA, fixtureB) {
      var type1 = parseInt(fixtureA.GetType());
      var type2 = parseInt(fixtureB.GetType());
      var reg = this.m_registers[type1][type2];
      var c;
      if (reg.pool) {
         c = reg.pool;
         reg.pool = c.m_next;
         reg.poolCount--;
         c.Reset(fixtureA, fixtureB);
         return c;
      }
      var createFcn = reg.createFcn;
      if (createFcn != null) {
         if (reg.primary) {
            c = createFcn(this.m_allocator);
            c.Reset(fixtureA, fixtureB);
            return c;
         }
         else {
            c = createFcn(this.m_allocator);
            c.Reset(fixtureB, fixtureA);
            return c;
         }
      }
      else {
         return null;
      }
   }
   b2ContactFactory.prototype.Destroy = function (contact) {
      if (contact.m_manifold.m_pointCount > 0) {
         contact.m_fixtureA.m_body.SetAwake(true);
         contact.m_fixtureB.m_body.SetAwake(true);
      }
      var type1 = parseInt(contact.m_fixtureA.GetType());
      var type2 = parseInt(contact.m_fixtureB.GetType());
      var reg = this.m_registers[type1][type2];
      if (true) {
         reg.poolCount++;
         contact.m_next = reg.pool;
         reg.pool = contact;
      }
      var destroyFcn = reg.destroyFcn;
      destroyFcn(contact, this.m_allocator);
   }
   b2ContactRegister.b2ContactRegister = function () {};
   b2ContactResult.b2ContactResult = function () {
      this.position = new b2Vec2();
      this.normal = new b2Vec2();
      this.id = new b2ContactID();
   };
   b2ContactSolver.b2ContactSolver = function () {
      this.m_step = new b2TimeStep();
      this.m_constraints = new Vector();
   };
   b2ContactSolver.prototype.b2ContactSolver = function () {}
   b2ContactSolver.prototype.Initialize = function (step, contacts, contactCount, allocator) {
      if (contactCount === undefined) contactCount = 0;
      var contact;
      this.m_step.Set(step);
      this.m_allocator = allocator;
      var i = 0;
      var tVec;
      var tMat;
      this.m_constraintCount = contactCount;
      while (this.m_constraints.length < this.m_constraintCount) {
         this.m_constraints[this.m_constraints.length] = new b2ContactConstraint();
      }
      for (i = 0;
      i < contactCount; ++i) {
         contact = contacts[i];
         var fixtureA = contact.m_fixtureA;
         var fixtureB = contact.m_fixtureB;
         var shapeA = fixtureA.m_shape;
         var shapeB = fixtureB.m_shape;
         var radiusA = shapeA.m_radius;
         var radiusB = shapeB.m_radius;
         var bodyA = fixtureA.m_body;
         var bodyB = fixtureB.m_body;
         var manifold = contact.GetManifold();
         var friction = b2Settings.b2MixFriction(fixtureA.GetFriction(), fixtureB.GetFriction());
         var restitution = b2Settings.b2MixRestitution(fixtureA.GetRestitution(), fixtureB.GetRestitution());
         var vAX = bodyA.m_linearVelocity.x;
         var vAY = bodyA.m_linearVelocity.y;
         var vBX = bodyB.m_linearVelocity.x;
         var vBY = bodyB.m_linearVelocity.y;
         var wA = bodyA.m_angularVelocity;
         var wB = bodyB.m_angularVelocity;
         b2Settings.b2Assert(manifold.m_pointCount > 0);
         b2ContactSolver.s_worldManifold.Initialize(manifold, bodyA.m_xf, radiusA, bodyB.m_xf, radiusB);
         var normalX = b2ContactSolver.s_worldManifold.m_normal.x;
         var normalY = b2ContactSolver.s_worldManifold.m_normal.y;
         var cc = this.m_constraints[i];
         cc.bodyA = bodyA;
         cc.bodyB = bodyB;
         cc.manifold = manifold;
         cc.normal.x = normalX;
         cc.normal.y = normalY;
         cc.pointCount = manifold.m_pointCount;
         cc.friction = friction;
         cc.restitution = restitution;
         cc.localPlaneNormal.x = manifold.m_localPlaneNormal.x;
         cc.localPlaneNormal.y = manifold.m_localPlaneNormal.y;
         cc.localPoint.x = manifold.m_localPoint.x;
         cc.localPoint.y = manifold.m_localPoint.y;
         cc.radius = radiusA + radiusB;
         cc.type = manifold.m_type;
         for (var k = 0; k < cc.pointCount; ++k) {
            var cp = manifold.m_points[k];
            var ccp = cc.points[k];
            ccp.normalImpulse = cp.m_normalImpulse;
            ccp.tangentImpulse = cp.m_tangentImpulse;
            ccp.localPoint.SetV(cp.m_localPoint);
            var rAX = ccp.rA.x = b2ContactSolver.s_worldManifold.m_points[k].x - bodyA.m_sweep.c.x;
            var rAY = ccp.rA.y = b2ContactSolver.s_worldManifold.m_points[k].y - bodyA.m_sweep.c.y;
            var rBX = ccp.rB.x = b2ContactSolver.s_worldManifold.m_points[k].x - bodyB.m_sweep.c.x;
            var rBY = ccp.rB.y = b2ContactSolver.s_worldManifold.m_points[k].y - bodyB.m_sweep.c.y;
            var rnA = rAX * normalY - rAY * normalX;
            var rnB = rBX * normalY - rBY * normalX;
            rnA *= rnA;
            rnB *= rnB;
            var kNormal = bodyA.m_invMass + bodyB.m_invMass + bodyA.m_invI * rnA + bodyB.m_invI * rnB;
            ccp.normalMass = 1.0 / kNormal;
            var kEqualized = bodyA.m_mass * bodyA.m_invMass + bodyB.m_mass * bodyB.m_invMass;
            kEqualized += bodyA.m_mass * bodyA.m_invI * rnA + bodyB.m_mass * bodyB.m_invI * rnB;
            ccp.equalizedMass = 1.0 / kEqualized;
            var tangentX = normalY;
            var tangentY = (-normalX);
            var rtA = rAX * tangentY - rAY * tangentX;
            var rtB = rBX * tangentY - rBY * tangentX;
            rtA *= rtA;
            rtB *= rtB;
            var kTangent = bodyA.m_invMass + bodyB.m_invMass + bodyA.m_invI * rtA + bodyB.m_invI * rtB;
            ccp.tangentMass = 1.0 / kTangent;
            ccp.velocityBias = 0.0;
            var tX = vBX + ((-wB * rBY)) - vAX - ((-wA * rAY));
            var tY = vBY + (wB * rBX) - vAY - (wA * rAX);
            var vRel = cc.normal.x * tX + cc.normal.y * tY;
            if (vRel < (-b2Settings.b2_velocityThreshold)) {
               ccp.velocityBias += (-cc.restitution * vRel);
            }
         }
         if (cc.pointCount == 2) {
            var ccp1 = cc.points[0];
            var ccp2 = cc.points[1];
            var invMassA = bodyA.m_invMass;
            var invIA = bodyA.m_invI;
            var invMassB = bodyB.m_invMass;
            var invIB = bodyB.m_invI;
            var rn1A = ccp1.rA.x * normalY - ccp1.rA.y * normalX;
            var rn1B = ccp1.rB.x * normalY - ccp1.rB.y * normalX;
            var rn2A = ccp2.rA.x * normalY - ccp2.rA.y * normalX;
            var rn2B = ccp2.rB.x * normalY - ccp2.rB.y * normalX;
            var k11 = invMassA + invMassB + invIA * rn1A * rn1A + invIB * rn1B * rn1B;
            var k22 = invMassA + invMassB + invIA * rn2A * rn2A + invIB * rn2B * rn2B;
            var k12 = invMassA + invMassB + invIA * rn1A * rn2A + invIB * rn1B * rn2B;
            var k_maxConditionNumber = 100.0;
            if (k11 * k11 < k_maxConditionNumber * (k11 * k22 - k12 * k12)) {
               cc.K.col1.Set(k11, k12);
               cc.K.col2.Set(k12, k22);
               cc.K.GetInverse(cc.normalMass);
            }
            else {
               cc.pointCount = 1;
            }
         }
      }
   }
   b2ContactSolver.prototype.InitVelocityConstraints = function (step) {
      var tVec;
      var tVec2;
      var tMat;
      for (var i = 0; i < this.m_constraintCount; ++i) {
         var c = this.m_constraints[i];
         var bodyA = c.bodyA;
         var bodyB = c.bodyB;
         var invMassA = bodyA.m_invMass;
         var invIA = bodyA.m_invI;
         var invMassB = bodyB.m_invMass;
         var invIB = bodyB.m_invI;
         var normalX = c.normal.x;
         var normalY = c.normal.y;
         var tangentX = normalY;
         var tangentY = (-normalX);
         var tX = 0;
         var j = 0;
         var tCount = 0;
         if (step.warmStarting) {
            tCount = c.pointCount;
            for (j = 0;
            j < tCount; ++j) {
               var ccp = c.points[j];
               ccp.normalImpulse *= step.dtRatio;
               ccp.tangentImpulse *= step.dtRatio;
               var PX = ccp.normalImpulse * normalX + ccp.tangentImpulse * tangentX;
               var PY = ccp.normalImpulse * normalY + ccp.tangentImpulse * tangentY;
               bodyA.m_angularVelocity -= invIA * (ccp.rA.x * PY - ccp.rA.y * PX);
               bodyA.m_linearVelocity.x -= invMassA * PX;
               bodyA.m_linearVelocity.y -= invMassA * PY;
               bodyB.m_angularVelocity += invIB * (ccp.rB.x * PY - ccp.rB.y * PX);
               bodyB.m_linearVelocity.x += invMassB * PX;
               bodyB.m_linearVelocity.y += invMassB * PY;
            }
         }
         else {
            tCount = c.pointCount;
            for (j = 0;
            j < tCount; ++j) {
               var ccp2 = c.points[j];
               ccp2.normalImpulse = 0.0;
               ccp2.tangentImpulse = 0.0;
            }
         }
      }
   }
   b2ContactSolver.prototype.SolveVelocityConstraints = function () {
      var j = 0;
      var ccp;
      var rAX = 0;
      var rAY = 0;
      var rBX = 0;
      var rBY = 0;
      var dvX = 0;
      var dvY = 0;
      var vn = 0;
      var vt = 0;
      var lambda = 0;
      var maxFriction = 0;
      var newImpulse = 0;
      var PX = 0;
      var PY = 0;
      var dX = 0;
      var dY = 0;
      var P1X = 0;
      var P1Y = 0;
      var P2X = 0;
      var P2Y = 0;
      var tMat;
      var tVec;
      for (var i = 0; i < this.m_constraintCount; ++i) {
         var c = this.m_constraints[i];
         var bodyA = c.bodyA;
         var bodyB = c.bodyB;
         var wA = bodyA.m_angularVelocity;
         var wB = bodyB.m_angularVelocity;
         var vA = bodyA.m_linearVelocity;
         var vB = bodyB.m_linearVelocity;
         var invMassA = bodyA.m_invMass;
         var invIA = bodyA.m_invI;
         var invMassB = bodyB.m_invMass;
         var invIB = bodyB.m_invI;
         var normalX = c.normal.x;
         var normalY = c.normal.y;
         var tangentX = normalY;
         var tangentY = (-normalX);
         var friction = c.friction;
         var tX = 0;
         for (j = 0;
         j < c.pointCount; j++) {
            ccp = c.points[j];
            dvX = vB.x - wB * ccp.rB.y - vA.x + wA * ccp.rA.y;
            dvY = vB.y + wB * ccp.rB.x - vA.y - wA * ccp.rA.x;
            vt = dvX * tangentX + dvY * tangentY;
            lambda = ccp.tangentMass * (-vt);
            maxFriction = friction * ccp.normalImpulse;
            newImpulse = b2Math.Clamp(ccp.tangentImpulse + lambda, (-maxFriction), maxFriction);
            lambda = newImpulse - ccp.tangentImpulse;
            PX = lambda * tangentX;
            PY = lambda * tangentY;
            vA.x -= invMassA * PX;
            vA.y -= invMassA * PY;
            wA -= invIA * (ccp.rA.x * PY - ccp.rA.y * PX);
            vB.x += invMassB * PX;
            vB.y += invMassB * PY;
            wB += invIB * (ccp.rB.x * PY - ccp.rB.y * PX);
            ccp.tangentImpulse = newImpulse;
         }
         var tCount = parseInt(c.pointCount);
         if (c.pointCount == 1) {
            ccp = c.points[0];
            dvX = vB.x + ((-wB * ccp.rB.y)) - vA.x - ((-wA * ccp.rA.y));
            dvY = vB.y + (wB * ccp.rB.x) - vA.y - (wA * ccp.rA.x);
            vn = dvX * normalX + dvY * normalY;
            lambda = (-ccp.normalMass * (vn - ccp.velocityBias));
            newImpulse = ccp.normalImpulse + lambda;
            newImpulse = newImpulse > 0 ? newImpulse : 0.0;
            lambda = newImpulse - ccp.normalImpulse;
            PX = lambda * normalX;
            PY = lambda * normalY;
            vA.x -= invMassA * PX;
            vA.y -= invMassA * PY;
            wA -= invIA * (ccp.rA.x * PY - ccp.rA.y * PX);
            vB.x += invMassB * PX;
            vB.y += invMassB * PY;
            wB += invIB * (ccp.rB.x * PY - ccp.rB.y * PX);
            ccp.normalImpulse = newImpulse;
         }
         else {
            var cp1 = c.points[0];
            var cp2 = c.points[1];
            var aX = cp1.normalImpulse;
            var aY = cp2.normalImpulse;
            var dv1X = vB.x - wB * cp1.rB.y - vA.x + wA * cp1.rA.y;
            var dv1Y = vB.y + wB * cp1.rB.x - vA.y - wA * cp1.rA.x;
            var dv2X = vB.x - wB * cp2.rB.y - vA.x + wA * cp2.rA.y;
            var dv2Y = vB.y + wB * cp2.rB.x - vA.y - wA * cp2.rA.x;
            var vn1 = dv1X * normalX + dv1Y * normalY;
            var vn2 = dv2X * normalX + dv2Y * normalY;
            var bX = vn1 - cp1.velocityBias;
            var bY = vn2 - cp2.velocityBias;
            tMat = c.K;
            bX -= tMat.col1.x * aX + tMat.col2.x * aY;
            bY -= tMat.col1.y * aX + tMat.col2.y * aY;
            var k_errorTol = 0.001;
            for (;;) {
               tMat = c.normalMass;
               var xX = (-(tMat.col1.x * bX + tMat.col2.x * bY));
               var xY = (-(tMat.col1.y * bX + tMat.col2.y * bY));
               if (xX >= 0.0 && xY >= 0.0) {
                  dX = xX - aX;
                  dY = xY - aY;
                  P1X = dX * normalX;
                  P1Y = dX * normalY;
                  P2X = dY * normalX;
                  P2Y = dY * normalY;
                  vA.x -= invMassA * (P1X + P2X);
                  vA.y -= invMassA * (P1Y + P2Y);
                  wA -= invIA * (cp1.rA.x * P1Y - cp1.rA.y * P1X + cp2.rA.x * P2Y - cp2.rA.y * P2X);
                  vB.x += invMassB * (P1X + P2X);
                  vB.y += invMassB * (P1Y + P2Y);
                  wB += invIB * (cp1.rB.x * P1Y - cp1.rB.y * P1X + cp2.rB.x * P2Y - cp2.rB.y * P2X);
                  cp1.normalImpulse = xX;
                  cp2.normalImpulse = xY;
                  break;
               }
               xX = (-cp1.normalMass * bX);
               xY = 0.0;
               vn1 = 0.0;
               vn2 = c.K.col1.y * xX + bY;
               if (xX >= 0.0 && vn2 >= 0.0) {
                  dX = xX - aX;
                  dY = xY - aY;
                  P1X = dX * normalX;
                  P1Y = dX * normalY;
                  P2X = dY * normalX;
                  P2Y = dY * normalY;
                  vA.x -= invMassA * (P1X + P2X);
                  vA.y -= invMassA * (P1Y + P2Y);
                  wA -= invIA * (cp1.rA.x * P1Y - cp1.rA.y * P1X + cp2.rA.x * P2Y - cp2.rA.y * P2X);
                  vB.x += invMassB * (P1X + P2X);
                  vB.y += invMassB * (P1Y + P2Y);
                  wB += invIB * (cp1.rB.x * P1Y - cp1.rB.y * P1X + cp2.rB.x * P2Y - cp2.rB.y * P2X);
                  cp1.normalImpulse = xX;
                  cp2.normalImpulse = xY;
                  break;
               }
               xX = 0.0;
               xY = (-cp2.normalMass * bY);
               vn1 = c.K.col2.x * xY + bX;
               vn2 = 0.0;
               if (xY >= 0.0 && vn1 >= 0.0) {
                  dX = xX - aX;
                  dY = xY - aY;
                  P1X = dX * normalX;
                  P1Y = dX * normalY;
                  P2X = dY * normalX;
                  P2Y = dY * normalY;
                  vA.x -= invMassA * (P1X + P2X);
                  vA.y -= invMassA * (P1Y + P2Y);
                  wA -= invIA * (cp1.rA.x * P1Y - cp1.rA.y * P1X + cp2.rA.x * P2Y - cp2.rA.y * P2X);
                  vB.x += invMassB * (P1X + P2X);
                  vB.y += invMassB * (P1Y + P2Y);
                  wB += invIB * (cp1.rB.x * P1Y - cp1.rB.y * P1X + cp2.rB.x * P2Y - cp2.rB.y * P2X);
                  cp1.normalImpulse = xX;
                  cp2.normalImpulse = xY;
                  break;
               }
               xX = 0.0;
               xY = 0.0;
               vn1 = bX;
               vn2 = bY;
               if (vn1 >= 0.0 && vn2 >= 0.0) {
                  dX = xX - aX;
                  dY = xY - aY;
                  P1X = dX * normalX;
                  P1Y = dX * normalY;
                  P2X = dY * normalX;
                  P2Y = dY * normalY;
                  vA.x -= invMassA * (P1X + P2X);
                  vA.y -= invMassA * (P1Y + P2Y);
                  wA -= invIA * (cp1.rA.x * P1Y - cp1.rA.y * P1X + cp2.rA.x * P2Y - cp2.rA.y * P2X);
                  vB.x += invMassB * (P1X + P2X);
                  vB.y += invMassB * (P1Y + P2Y);
                  wB += invIB * (cp1.rB.x * P1Y - cp1.rB.y * P1X + cp2.rB.x * P2Y - cp2.rB.y * P2X);
                  cp1.normalImpulse = xX;
                  cp2.normalImpulse = xY;
                  break;
               }
               break;
            }
         }
         bodyA.m_angularVelocity = wA;
         bodyB.m_angularVelocity = wB;
      }
   }
   b2ContactSolver.prototype.FinalizeVelocityConstraints = function () {
      for (var i = 0; i < this.m_constraintCount; ++i) {
         var c = this.m_constraints[i];
         var m = c.manifold;
         for (var j = 0; j < c.pointCount; ++j) {
            var point1 = m.m_points[j];
            var point2 = c.points[j];
            point1.m_normalImpulse = point2.normalImpulse;
            point1.m_tangentImpulse = point2.tangentImpulse;
         }
      }
   }
   b2ContactSolver.prototype.SolvePositionConstraints = function (baumgarte) {
      if (baumgarte === undefined) baumgarte = 0;
      var minSeparation = 0.0;
      for (var i = 0; i < this.m_constraintCount; i++) {
         var c = this.m_constraints[i];
         var bodyA = c.bodyA;
         var bodyB = c.bodyB;
         var invMassA = bodyA.m_mass * bodyA.m_invMass;
         var invIA = bodyA.m_mass * bodyA.m_invI;
         var invMassB = bodyB.m_mass * bodyB.m_invMass;
         var invIB = bodyB.m_mass * bodyB.m_invI;
         b2ContactSolver.s_psm.Initialize(c);
         var normal = b2ContactSolver.s_psm.m_normal;
         for (var j = 0; j < c.pointCount; j++) {
            var ccp = c.points[j];
            var point = b2ContactSolver.s_psm.m_points[j];
            var separation = b2ContactSolver.s_psm.m_separations[j];
            var rAX = point.x - bodyA.m_sweep.c.x;
            var rAY = point.y - bodyA.m_sweep.c.y;
            var rBX = point.x - bodyB.m_sweep.c.x;
            var rBY = point.y - bodyB.m_sweep.c.y;
            minSeparation = minSeparation < separation ? minSeparation : separation;
            var C = b2Math.Clamp(baumgarte * (separation + b2Settings.b2_linearSlop), (-b2Settings.b2_maxLinearCorrection), 0.0);
            var impulse = (-ccp.equalizedMass * C);
            var PX = impulse * normal.x;
            var PY = impulse * normal.y;bodyA.m_sweep.c.x -= invMassA * PX;
            bodyA.m_sweep.c.y -= invMassA * PY;
            bodyA.m_sweep.a -= invIA * (rAX * PY - rAY * PX);
            bodyA.SynchronizeTransform();
            bodyB.m_sweep.c.x += invMassB * PX;
            bodyB.m_sweep.c.y += invMassB * PY;
            bodyB.m_sweep.a += invIB * (rBX * PY - rBY * PX);
            bodyB.SynchronizeTransform();
         }
      }
      return minSeparation > (-1.5 * b2Settings.b2_linearSlop);
   }
   Box2D.postDefs.push(function () {
      Box2D.Dynamics.Contacts.b2ContactSolver.s_worldManifold = new b2WorldManifold();
      Box2D.Dynamics.Contacts.b2ContactSolver.s_psm = new b2PositionSolverManifold();
   });
   Box2D.inherit(b2EdgeAndCircleContact, Box2D.Dynamics.Contacts.b2Contact);
   b2EdgeAndCircleContact.prototype.__super = Box2D.Dynamics.Contacts.b2Contact.prototype;
   b2EdgeAndCircleContact.b2EdgeAndCircleContact = function () {
      Box2D.Dynamics.Contacts.b2Contact.b2Contact.apply(this, arguments);
   };
   b2EdgeAndCircleContact.Create = function (allocator) {
      return new b2EdgeAndCircleContact();
   }
   b2EdgeAndCircleContact.Destroy = function (contact, allocator) {}
   b2EdgeAndCircleContact.prototype.Reset = function (fixtureA, fixtureB) {
      this.__super.Reset.call(this, fixtureA, fixtureB);
   }
   b2EdgeAndCircleContact.prototype.Evaluate = function () {
      var bA = this.m_fixtureA.GetBody();
      var bB = this.m_fixtureB.GetBody();
      this.b2CollideEdgeAndCircle(this.m_manifold, (this.m_fixtureA.GetShape() instanceof b2EdgeShape ? this.m_fixtureA.GetShape() : null), bA.m_xf, (this.m_fixtureB.GetShape() instanceof b2CircleShape ? this.m_fixtureB.GetShape() : null), bB.m_xf);
   }
   b2EdgeAndCircleContact.prototype.b2CollideEdgeAndCircle = function (manifold, edge, xf1, circle, xf2) {}
   Box2D.inherit(b2NullContact, Box2D.Dynamics.Contacts.b2Contact);
   b2NullContact.prototype.__super = Box2D.Dynamics.Contacts.b2Contact.prototype;
   b2NullContact.b2NullContact = function () {
      Box2D.Dynamics.Contacts.b2Contact.b2Contact.apply(this, arguments);
   };
   b2NullContact.prototype.b2NullContact = function () {
      this.__super.b2Contact.call(this);
   }
   b2NullContact.prototype.Evaluate = function () {}
   Box2D.inherit(b2PolyAndCircleContact, Box2D.Dynamics.Contacts.b2Contact);
   b2PolyAndCircleContact.prototype.__super = Box2D.Dynamics.Contacts.b2Contact.prototype;
   b2PolyAndCircleContact.b2PolyAndCircleContact = function () {
      Box2D.Dynamics.Contacts.b2Contact.b2Contact.apply(this, arguments);
   };
   b2PolyAndCircleContact.Create = function (allocator) {
      return new b2PolyAndCircleContact();
   }
   b2PolyAndCircleContact.Destroy = function (contact, allocator) {}
   b2PolyAndCircleContact.prototype.Reset = function (fixtureA, fixtureB) {
      this.__super.Reset.call(this, fixtureA, fixtureB);
      b2Settings.b2Assert(fixtureA.GetType() == b2Shape.e_polygonShape);
      b2Settings.b2Assert(fixtureB.GetType() == b2Shape.e_circleShape);
   }
   b2PolyAndCircleContact.prototype.Evaluate = function () {
      var bA = this.m_fixtureA.m_body;
      var bB = this.m_fixtureB.m_body;
      b2Collision.CollidePolygonAndCircle(this.m_manifold, (this.m_fixtureA.GetShape() instanceof b2PolygonShape ? this.m_fixtureA.GetShape() : null), bA.m_xf, (this.m_fixtureB.GetShape() instanceof b2CircleShape ? this.m_fixtureB.GetShape() : null), bB.m_xf);
   }
   Box2D.inherit(b2PolyAndEdgeContact, Box2D.Dynamics.Contacts.b2Contact);
   b2PolyAndEdgeContact.prototype.__super = Box2D.Dynamics.Contacts.b2Contact.prototype;
   b2PolyAndEdgeContact.b2PolyAndEdgeContact = function () {
      Box2D.Dynamics.Contacts.b2Contact.b2Contact.apply(this, arguments);
   };
   b2PolyAndEdgeContact.Create = function (allocator) {
      return new b2PolyAndEdgeContact();
   }
   b2PolyAndEdgeContact.Destroy = function (contact, allocator) {}
   b2PolyAndEdgeContact.prototype.Reset = function (fixtureA, fixtureB) {
      this.__super.Reset.call(this, fixtureA, fixtureB);
      b2Settings.b2Assert(fixtureA.GetType() == b2Shape.e_polygonShape);
      b2Settings.b2Assert(fixtureB.GetType() == b2Shape.e_edgeShape);
   }
   b2PolyAndEdgeContact.prototype.Evaluate = function () {
      var bA = this.m_fixtureA.GetBody();
      var bB = this.m_fixtureB.GetBody();
      this.b2CollidePolyAndEdge(this.m_manifold, (this.m_fixtureA.GetShape() instanceof b2PolygonShape ? this.m_fixtureA.GetShape() : null), bA.m_xf, (this.m_fixtureB.GetShape() instanceof b2EdgeShape ? this.m_fixtureB.GetShape() : null), bB.m_xf);
   }
   b2PolyAndEdgeContact.prototype.b2CollidePolyAndEdge = function (manifold, polygon, xf1, edge, xf2) {}
   Box2D.inherit(b2PolygonContact, Box2D.Dynamics.Contacts.b2Contact);
   b2PolygonContact.prototype.__super = Box2D.Dynamics.Contacts.b2Contact.prototype;
   b2PolygonContact.b2PolygonContact = function () {
      Box2D.Dynamics.Contacts.b2Contact.b2Contact.apply(this, arguments);
   };
   b2PolygonContact.Create = function (allocator) {
      return new b2PolygonContact();
   }
   b2PolygonContact.Destroy = function (contact, allocator) {}
   b2PolygonContact.prototype.Reset = function (fixtureA, fixtureB) {
      this.__super.Reset.call(this, fixtureA, fixtureB);
   }
   b2PolygonContact.prototype.Evaluate = function () {
      var bA = this.m_fixtureA.GetBody();
      var bB = this.m_fixtureB.GetBody();
      b2Collision.CollidePolygons(this.m_manifold, (this.m_fixtureA.GetShape() instanceof b2PolygonShape ? this.m_fixtureA.GetShape() : null), bA.m_xf, (this.m_fixtureB.GetShape() instanceof b2PolygonShape ? this.m_fixtureB.GetShape() : null), bB.m_xf);
   }
   b2PositionSolverManifold.b2PositionSolverManifold = function () {};
   b2PositionSolverManifold.prototype.b2PositionSolverManifold = function () {
      this.m_normal = new b2Vec2();
      this.m_separations = new Vector_a2j_Number(b2Settings.b2_maxManifoldPoints);
      this.m_points = new Vector(b2Settings.b2_maxManifoldPoints);
      for (var i = 0; i < b2Settings.b2_maxManifoldPoints; i++) {
         this.m_points[i] = new b2Vec2();
      }
   }
   b2PositionSolverManifold.prototype.Initialize = function (cc) {
      b2Settings.b2Assert(cc.pointCount > 0);
      var i = 0;
      var clipPointX = 0;
      var clipPointY = 0;
      var tMat;
      var tVec;
      var planePointX = 0;
      var planePointY = 0;
      switch (cc.type) {
      case b2Manifold.e_circles:
         {
            tMat = cc.bodyA.m_xf.R;
            tVec = cc.localPoint;
            var pointAX = cc.bodyA.m_xf.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
            var pointAY = cc.bodyA.m_xf.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
            tMat = cc.bodyB.m_xf.R;
            tVec = cc.points[0].localPoint;
            var pointBX = cc.bodyB.m_xf.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
            var pointBY = cc.bodyB.m_xf.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
            var dX = pointBX - pointAX;
            var dY = pointBY - pointAY;
            var d2 = dX * dX + dY * dY;
            if (d2 > Number.MIN_VALUE * Number.MIN_VALUE) {
               var d = Math.sqrt(d2);
               this.m_normal.x = dX / d;
               this.m_normal.y = dY / d;
            }
            else {
               this.m_normal.x = 1.0;
               this.m_normal.y = 0.0;
            }
            this.m_points[0].x = 0.5 * (pointAX + pointBX);
            this.m_points[0].y = 0.5 * (pointAY + pointBY);
            this.m_separations[0] = dX * this.m_normal.x + dY * this.m_normal.y - cc.radius;
         }
         break;
      case b2Manifold.e_faceA:
         {
            tMat = cc.bodyA.m_xf.R;
            tVec = cc.localPlaneNormal;
            this.m_normal.x = tMat.col1.x * tVec.x + tMat.col2.x * tVec.y;
            this.m_normal.y = tMat.col1.y * tVec.x + tMat.col2.y * tVec.y;
            tMat = cc.bodyA.m_xf.R;
            tVec = cc.localPoint;
            planePointX = cc.bodyA.m_xf.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
            planePointY = cc.bodyA.m_xf.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
            tMat = cc.bodyB.m_xf.R;
            for (i = 0;
            i < cc.pointCount; ++i) {
               tVec = cc.points[i].localPoint;
               clipPointX = cc.bodyB.m_xf.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
               clipPointY = cc.bodyB.m_xf.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
               this.m_separations[i] = (clipPointX - planePointX) * this.m_normal.x + (clipPointY - planePointY) * this.m_normal.y - cc.radius;
               this.m_points[i].x = clipPointX;
               this.m_points[i].y = clipPointY;
            }
         }
         break;
      case b2Manifold.e_faceB:
         {
            tMat = cc.bodyB.m_xf.R;
            tVec = cc.localPlaneNormal;
            this.m_normal.x = tMat.col1.x * tVec.x + tMat.col2.x * tVec.y;
            this.m_normal.y = tMat.col1.y * tVec.x + tMat.col2.y * tVec.y;
            tMat = cc.bodyB.m_xf.R;
            tVec = cc.localPoint;
            planePointX = cc.bodyB.m_xf.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
            planePointY = cc.bodyB.m_xf.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
            tMat = cc.bodyA.m_xf.R;
            for (i = 0;
            i < cc.pointCount; ++i) {
               tVec = cc.points[i].localPoint;
               clipPointX = cc.bodyA.m_xf.position.x + (tMat.col1.x * tVec.x + tMat.col2.x * tVec.y);
               clipPointY = cc.bodyA.m_xf.position.y + (tMat.col1.y * tVec.x + tMat.col2.y * tVec.y);
               this.m_separations[i] = (clipPointX - planePointX) * this.m_normal.x + (clipPointY - planePointY) * this.m_normal.y - cc.radius;
               this.m_points[i].Set(clipPointX, clipPointY);
            }
            this.m_normal.x *= (-1);
            this.m_normal.y *= (-1);
         }
         break;
      }
   }
   Box2D.postDefs.push(function () {
      Box2D.Dynamics.Contacts.b2PositionSolverManifold.circlePointA = new b2Vec2();
      Box2D.Dynamics.Contacts.b2PositionSolverManifold.circlePointB = new b2Vec2();
   });
})();
(function () {
   var b2Body = Box2D.Dynamics.b2Body,
      b2BodyDef = Box2D.Dynamics.b2BodyDef,
      b2ContactFilter = Box2D.Dynamics.b2ContactFilter,
      b2ContactImpulse = Box2D.Dynamics.b2ContactImpulse,
      b2ContactListener = Box2D.Dynamics.b2ContactListener,
      b2ContactManager = Box2D.Dynamics.b2ContactManager,
      b2DebugDraw = Box2D.Dynamics.b2DebugDraw,
      b2DestructionListener = Box2D.Dynamics.b2DestructionListener,
      b2FilterData = Box2D.Dynamics.b2FilterData,
      b2Fixture = Box2D.Dynamics.b2Fixture,
      b2FixtureDef = Box2D.Dynamics.b2FixtureDef,
      b2Island = Box2D.Dynamics.b2Island,
      b2TimeStep = Box2D.Dynamics.b2TimeStep,
      b2World = Box2D.Dynamics.b2World,
      b2Mat22 = Box2D.Common.Math.b2Mat22,
      b2Mat33 = Box2D.Common.Math.b2Mat33,
      b2Math = Box2D.Common.Math.b2Math,
      b2Sweep = Box2D.Common.Math.b2Sweep,
      b2Transform = Box2D.Common.Math.b2Transform,
      b2Vec2 = Box2D.Common.Math.b2Vec2,
      b2Vec3 = Box2D.Common.Math.b2Vec3,
      b2Color = Box2D.Common.b2Color,
      b2internal = Box2D.Common.b2internal,
      b2Settings = Box2D.Common.b2Settings,
      b2CircleShape = Box2D.Collision.Shapes.b2CircleShape,
      b2EdgeChainDef = Box2D.Collision.Shapes.b2EdgeChainDef,
      b2EdgeShape = Box2D.Collision.Shapes.b2EdgeShape,
      b2MassData = Box2D.Collision.Shapes.b2MassData,
      b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape,
      b2Shape = Box2D.Collision.Shapes.b2Shape,
      b2BuoyancyController = Box2D.Dynamics.Controllers.b2BuoyancyController,
      b2ConstantAccelController = Box2D.Dynamics.Controllers.b2ConstantAccelController,
      b2ConstantForceController = Box2D.Dynamics.Controllers.b2ConstantForceController,
      b2Controller = Box2D.Dynamics.Controllers.b2Controller,
      b2ControllerEdge = Box2D.Dynamics.Controllers.b2ControllerEdge,
      b2GravityController = Box2D.Dynamics.Controllers.b2GravityController,
      b2TensorDampingController = Box2D.Dynamics.Controllers.b2TensorDampingController;

   Box2D.inherit(b2BuoyancyController, Box2D.Dynamics.Controllers.b2Controller);
   b2BuoyancyController.prototype.__super = Box2D.Dynamics.Controllers.b2Controller.prototype;
   b2BuoyancyController.b2BuoyancyController = function () {
      Box2D.Dynamics.Controllers.b2Controller.b2Controller.apply(this, arguments);
      this.normal = new b2Vec2(0, (-1));
      this.offset = 0;
      this.density = 0;
      this.velocity = new b2Vec2(0, 0);
      this.linearDrag = 2;
      this.angularDrag = 1;
      this.useDensity = false;
      this.useWorldGravity = true;
      this.gravity = null;
   };
   b2BuoyancyController.prototype.Step = function (step) {
      if (!this.m_bodyList) return;
      if (this.useWorldGravity) {
         this.gravity = this.GetWorld().GetGravity().Copy();
      }
      for (var i = this.m_bodyList; i; i = i.nextBody) {
         var body = i.body;
         if (body.IsAwake() == false) {
            continue;
         }
         var areac = new b2Vec2();
         var massc = new b2Vec2();
         var area = 0.0;
         var mass = 0.0;
         for (var fixture = body.GetFixtureList(); fixture; fixture = fixture.GetNext()) {
            var sc = new b2Vec2();
            var sarea = fixture.GetShape().ComputeSubmergedArea(this.normal, this.offset, body.GetTransform(), sc);
            area += sarea;
            areac.x += sarea * sc.x;
            areac.y += sarea * sc.y;
            var shapeDensity = 0;
            if (this.useDensity) {
               shapeDensity = 1;
            }
            else {
               shapeDensity = 1;
            }
            mass += sarea * shapeDensity;
            massc.x += sarea * sc.x * shapeDensity;
            massc.y += sarea * sc.y * shapeDensity;
         }
         areac.x /= area;
         areac.y /= area;
         massc.x /= mass;
         massc.y /= mass;
         if (area < Number.MIN_VALUE) continue;
         var buoyancyForce = this.gravity.GetNegative();
         buoyancyForce.Multiply(this.density * area);
         body.ApplyForce(buoyancyForce, massc);
         var dragForce = body.GetLinearVelocityFromWorldPoint(areac);
         dragForce.Subtract(this.velocity);
         dragForce.Multiply((-this.linearDrag * area));
         body.ApplyForce(dragForce, areac);
         body.ApplyTorque((-body.GetInertia() / body.GetMass() * area * body.GetAngularVelocity() * this.angularDrag));
      }
   }
   b2BuoyancyController.prototype.Draw = function (debugDraw) {
      var r = 1000;
      var p1 = new b2Vec2();
      var p2 = new b2Vec2();
      p1.x = this.normal.x * this.offset + this.normal.y * r;
      p1.y = this.normal.y * this.offset - this.normal.x * r;
      p2.x = this.normal.x * this.offset - this.normal.y * r;
      p2.y = this.normal.y * this.offset + this.normal.x * r;
      var color = new b2Color(0, 0, 1);
      debugDraw.DrawSegment(p1, p2, color);
   }
   Box2D.inherit(b2ConstantAccelController, Box2D.Dynamics.Controllers.b2Controller);
   b2ConstantAccelController.prototype.__super = Box2D.Dynamics.Controllers.b2Controller.prototype;
   b2ConstantAccelController.b2ConstantAccelController = function () {
      Box2D.Dynamics.Controllers.b2Controller.b2Controller.apply(this, arguments);
      this.A = new b2Vec2(0, 0);
   };
   b2ConstantAccelController.prototype.Step = function (step) {
      var smallA = new b2Vec2(this.A.x * step.dt, this.A.y * step.dt);
      for (var i = this.m_bodyList; i; i = i.nextBody) {
         var body = i.body;
         if (!body.IsAwake()) continue;
         body.SetLinearVelocity(new b2Vec2(body.GetLinearVelocity().x + smallA.x, body.GetLinearVelocity().y + smallA.y));
      }
   }
   Box2D.inherit(b2ConstantForceController, Box2D.Dynamics.Controllers.b2Controller);
   b2ConstantForceController.prototype.__super = Box2D.Dynamics.Controllers.b2Controller.prototype;
   b2ConstantForceController.b2ConstantForceController = function () {
      Box2D.Dynamics.Controllers.b2Controller.b2Controller.apply(this, arguments);
      this.F = new b2Vec2(0, 0);
   };
   b2ConstantForceController.prototype.Step = function (step) {
      for (var i = this.m_bodyList; i; i = i.nextBody) {
         var body = i.body;
         if (!body.IsAwake()) continue;
         body.ApplyForce(this.F, body.GetWorldCenter());
      }
   }
   b2Controller.b2Controller = function () {};
   b2Controller.prototype.Step = function (step) {}
   b2Controller.prototype.Draw = function (debugDraw) {}
   b2Controller.prototype.AddBody = function (body) {
      var edge = new b2ControllerEdge();
      edge.controller = this;
      edge.body = body;
      edge.nextBody = this.m_bodyList;
      edge.prevBody = null;
      this.m_bodyList = edge;
      if (edge.nextBody) edge.nextBody.prevBody = edge;
      this.m_bodyCount++;
      edge.nextController = body.m_controllerList;
      edge.prevController = null;
      body.m_controllerList = edge;
      if (edge.nextController) edge.nextController.prevController = edge;
      body.m_controllerCount++;
   }
   b2Controller.prototype.RemoveBody = function (body) {
      var edge = body.m_controllerList;
      while (edge && edge.controller != this)
      edge = edge.nextController;
      if (edge.prevBody) edge.prevBody.nextBody = edge.nextBody;
      if (edge.nextBody) edge.nextBody.prevBody = edge.prevBody;
      if (edge.nextController) edge.nextController.prevController = edge.prevController;
      if (edge.prevController) edge.prevController.nextController = edge.nextController;
      if (this.m_bodyList == edge) this.m_bodyList = edge.nextBody;
      if (body.m_controllerList == edge) body.m_controllerList = edge.nextController;
      body.m_controllerCount--;
      this.m_bodyCount--;
   }
   b2Controller.prototype.Clear = function () {
      while (this.m_bodyList)
      this.RemoveBody(this.m_bodyList.body);
   }
   b2Controller.prototype.GetNext = function () {
      return this.m_next;
   }
   b2Controller.prototype.GetWorld = function () {
      return this.m_world;
   }
   b2Controller.prototype.GetBodyList = function () {
      return this.m_bodyList;
   }
   b2ControllerEdge.b2ControllerEdge = function () {};
   Box2D.inherit(b2GravityController, Box2D.Dynamics.Controllers.b2Controller);
   b2GravityController.prototype.__super = Box2D.Dynamics.Controllers.b2Controller.prototype;
   b2GravityController.b2GravityController = function () {
      Box2D.Dynamics.Controllers.b2Controller.b2Controller.apply(this, arguments);
      this.G = 1;
      this.invSqr = true;
   };
   b2GravityController.prototype.Step = function (step) {
      var i = null;
      var body1 = null;
      var p1 = null;
      var mass1 = 0;
      var j = null;
      var body2 = null;
      var p2 = null;
      var dx = 0;
      var dy = 0;
      var r2 = 0;
      var f = null;
      if (this.invSqr) {
         for (i = this.m_bodyList;
         i; i = i.nextBody) {
            body1 = i.body;
            p1 = body1.GetWorldCenter();
            mass1 = body1.GetMass();
            for (j = this.m_bodyList;
            j != i; j = j.nextBody) {
               body2 = j.body;
               p2 = body2.GetWorldCenter();
               dx = p2.x - p1.x;
               dy = p2.y - p1.y;
               r2 = dx * dx + dy * dy;
               if (r2 < Number.MIN_VALUE) continue;
               f = new b2Vec2(dx, dy);
               f.Multiply(this.G / r2 / Math.sqrt(r2) * mass1 * body2.GetMass());
               if (body1.IsAwake()) body1.ApplyForce(f, p1);
               f.Multiply((-1));
               if (body2.IsAwake()) body2.ApplyForce(f, p2);
            }
         }
      }
      else {
         for (i = this.m_bodyList;
         i; i = i.nextBody) {
            body1 = i.body;
            p1 = body1.GetWorldCenter();
            mass1 = body1.GetMass();
            for (j = this.m_bodyList;
            j != i; j = j.nextBody) {
               body2 = j.body;
               p2 = body2.GetWorldCenter();
               dx = p2.x - p1.x;
               dy = p2.y - p1.y;
               r2 = dx * dx + dy * dy;
               if (r2 < Number.MIN_VALUE) continue;
               f = new b2Vec2(dx, dy);
               f.Multiply(this.G / r2 * mass1 * body2.GetMass());
               if (body1.IsAwake()) body1.ApplyForce(f, p1);
               f.Multiply((-1));
               if (body2.IsAwake()) body2.ApplyForce(f, p2);
            }
         }
      }
   }
   Box2D.inherit(b2TensorDampingController, Box2D.Dynamics.Controllers.b2Controller);
   b2TensorDampingController.prototype.__super = Box2D.Dynamics.Controllers.b2Controller.prototype;
   b2TensorDampingController.b2TensorDampingController = function () {
      Box2D.Dynamics.Controllers.b2Controller.b2Controller.apply(this, arguments);
      this.T = new b2Mat22();
      this.maxTimestep = 0;
   };
   b2TensorDampingController.prototype.SetAxisAligned = function (xDamping, yDamping) {
      if (xDamping === undefined) xDamping = 0;
      if (yDamping === undefined) yDamping = 0;
      this.T.col1.x = (-xDamping);
      this.T.col1.y = 0;
      this.T.col2.x = 0;
      this.T.col2.y = (-yDamping);
      if (xDamping > 0 || yDamping > 0) {
         this.maxTimestep = 1 / Math.max(xDamping, yDamping);
      }
      else {
         this.maxTimestep = 0;
      }
   }
   b2TensorDampingController.prototype.Step = function (step) {
      var timestep = step.dt;
      if (timestep <= Number.MIN_VALUE) return;
      if (timestep > this.maxTimestep && this.maxTimestep > 0) timestep = this.maxTimestep;
      for (var i = this.m_bodyList; i; i = i.nextBody) {
         var body = i.body;
         if (!body.IsAwake()) {
            continue;
         }
         var damping = body.GetWorldVector(b2Math.MulMV(this.T, body.GetLocalVector(body.GetLinearVelocity())));
         body.SetLinearVelocity(new b2Vec2(body.GetLinearVelocity().x + damping.x * timestep, body.GetLinearVelocity().y + damping.y * timestep));
      }
   }
})();
(function () {
   var b2Color = Box2D.Common.b2Color,
      b2internal = Box2D.Common.b2internal,
      b2Settings = Box2D.Common.b2Settings,
      b2Mat22 = Box2D.Common.Math.b2Mat22,
      b2Mat33 = Box2D.Common.Math.b2Mat33,
      b2Math = Box2D.Common.Math.b2Math,
      b2Sweep = Box2D.Common.Math.b2Sweep,
      b2Transform = Box2D.Common.Math.b2Transform,
      b2Vec2 = Box2D.Common.Math.b2Vec2,
      b2Vec3 = Box2D.Common.Math.b2Vec3,
      b2DistanceJoint = Box2D.Dynamics.Joints.b2DistanceJoint,
      b2DistanceJointDef = Box2D.Dynamics.Joints.b2DistanceJointDef,
      b2FrictionJoint = Box2D.Dynamics.Joints.b2FrictionJoint,
      b2FrictionJointDef = Box2D.Dynamics.Joints.b2FrictionJointDef,
      b2GearJoint = Box2D.Dynamics.Joints.b2GearJoint,
      b2GearJointDef = Box2D.Dynamics.Joints.b2GearJointDef,
      b2Jacobian = Box2D.Dynamics.Joints.b2Jacobian,
      b2Joint = Box2D.Dynamics.Joints.b2Joint,
      b2JointDef = Box2D.Dynamics.Joints.b2JointDef,
      b2JointEdge = Box2D.Dynamics.Joints.b2JointEdge,
      b2LineJoint = Box2D.Dynamics.Joints.b2LineJoint,
      b2LineJointDef = Box2D.Dynamics.Joints.b2LineJointDef,
      b2MouseJoint = Box2D.Dynamics.Joints.b2MouseJoint,
      b2MouseJointDef = Box2D.Dynamics.Joints.b2MouseJointDef,
      b2PrismaticJoint = Box2D.Dynamics.Joints.b2PrismaticJoint,
      b2PrismaticJointDef = Box2D.Dynamics.Joints.b2PrismaticJointDef,
      b2PulleyJoint = Box2D.Dynamics.Joints.b2PulleyJoint,
      b2PulleyJointDef = Box2D.Dynamics.Joints.b2PulleyJointDef,
      b2RevoluteJoint = Box2D.Dynamics.Joints.b2RevoluteJoint,
      b2RevoluteJointDef = Box2D.Dynamics.Joints.b2RevoluteJointDef,
      b2WeldJoint = Box2D.Dynamics.Joints.b2WeldJoint,
      b2WeldJointDef = Box2D.Dynamics.Joints.b2WeldJointDef,
      b2Body = Box2D.Dynamics.b2Body,
      b2BodyDef = Box2D.Dynamics.b2BodyDef,
      b2ContactFilter = Box2D.Dynamics.b2ContactFilter,
      b2ContactImpulse = Box2D.Dynamics.b2ContactImpulse,
      b2ContactListener = Box2D.Dynamics.b2ContactListener,
      b2ContactManager = Box2D.Dynamics.b2ContactManager,
      b2DebugDraw = Box2D.Dynamics.b2DebugDraw,
      b2DestructionListener = Box2D.Dynamics.b2DestructionListener,
      b2FilterData = Box2D.Dynamics.b2FilterData,
      b2Fixture = Box2D.Dynamics.b2Fixture,
      b2FixtureDef = Box2D.Dynamics.b2FixtureDef,
      b2Island = Box2D.Dynamics.b2Island,
      b2TimeStep = Box2D.Dynamics.b2TimeStep,
      b2World = Box2D.Dynamics.b2World;

   Box2D.inherit(b2DistanceJoint, Box2D.Dynamics.Joints.b2Joint);
   b2DistanceJoint.prototype.__super = Box2D.Dynamics.Joints.b2Joint.prototype;
   b2DistanceJoint.b2DistanceJoint = function () {
      Box2D.Dynamics.Joints.b2Joint.b2Joint.apply(this, arguments);
      this.m_localAnchor1 = new b2Vec2();
      this.m_localAnchor2 = new b2Vec2();
      this.m_u = new b2Vec2();
   };
   b2DistanceJoint.prototype.GetAnchorA = function () {
      return this.m_bodyA.GetWorldPoint(this.m_localAnchor1);
   }
   b2DistanceJoint.prototype.GetAnchorB = function () {
      return this.m_bodyB.GetWorldPoint(this.m_localAnchor2);
   }
   b2DistanceJoint.prototype.GetReactionForce = function (inv_dt) {
      if (inv_dt === undefined) inv_dt = 0;
      return new b2Vec2(inv_dt * this.m_impulse * this.m_u.x, inv_dt * this.m_impulse * this.m_u.y);
   }
   b2DistanceJoint.prototype.GetReactionTorque = function (inv_dt) {
      if (inv_dt === undefined) inv_dt = 0;
      return 0.0;
   }
   b2DistanceJoint.prototype.GetLength = function () {
      return this.m_length;
   }
   b2DistanceJoint.prototype.SetLength = function (length) {
      if (length === undefined) length = 0;
      this.m_length = length;
   }
   b2DistanceJoint.prototype.GetFrequency = function () {
      return this.m_frequencyHz;
   }
   b2DistanceJoint.prototype.SetFrequency = function (hz) {
      if (hz === undefined) hz = 0;
      this.m_frequencyHz = hz;
   }
   b2DistanceJoint.prototype.GetDampingRatio = function () {
      return this.m_dampingRatio;
   }
   b2DistanceJoint.prototype.SetDampingRatio = function (ratio) {
      if (ratio === undefined) ratio = 0;
      this.m_dampingRatio = ratio;
   }
   b2DistanceJoint.prototype.b2DistanceJoint = function (def) {
      this.__super.b2Joint.call(this, def);
      var tMat;
      var tX = 0;
      var tY = 0;
      this.m_localAnchor1.SetV(def.localAnchorA);
      this.m_localAnchor2.SetV(def.localAnchorB);
      this.m_length = def.length;
      this.m_frequencyHz = def.frequencyHz;
      this.m_dampingRatio = def.dampingRatio;
      this.m_impulse = 0.0;
      this.m_gamma = 0.0;
      this.m_bias = 0.0;
   }
   b2DistanceJoint.prototype.InitVelocityConstraints = function (step) {
      var tMat;
      var tX = 0;
      var bA = this.m_bodyA;
      var bB = this.m_bodyB;
      tMat = bA.m_xf.R;
      var r1X = this.m_localAnchor1.x - bA.m_sweep.localCenter.x;
      var r1Y = this.m_localAnchor1.y - bA.m_sweep.localCenter.y;
      tX = (tMat.col1.x * r1X + tMat.col2.x * r1Y);
      r1Y = (tMat.col1.y * r1X + tMat.col2.y * r1Y);
      r1X = tX;
      tMat = bB.m_xf.R;
      var r2X = this.m_localAnchor2.x - bB.m_sweep.localCenter.x;
      var r2Y = this.m_localAnchor2.y - bB.m_sweep.localCenter.y;
      tX = (tMat.col1.x * r2X + tMat.col2.x * r2Y);
      r2Y = (tMat.col1.y * r2X + tMat.col2.y * r2Y);
      r2X = tX;
      this.m_u.x = bB.m_sweep.c.x + r2X - bA.m_sweep.c.x - r1X;
      this.m_u.y = bB.m_sweep.c.y + r2Y - bA.m_sweep.c.y - r1Y;
      var length = Math.sqrt(this.m_u.x * this.m_u.x + this.m_u.y * this.m_u.y);
      if (length > b2Settings.b2_linearSlop) {
         this.m_u.Multiply(1.0 / length);
      }
      else {
         this.m_u.SetZero();
      }
      var cr1u = (r1X * this.m_u.y - r1Y * this.m_u.x);
      var cr2u = (r2X * this.m_u.y - r2Y * this.m_u.x);
      var invMass = bA.m_invMass + bA.m_invI * cr1u * cr1u + bB.m_invMass + bB.m_invI * cr2u * cr2u;
      this.m_mass = invMass != 0.0 ? 1.0 / invMass : 0.0;
      if (this.m_frequencyHz > 0.0) {
         var C = length - this.m_length;
         var omega = 2.0 * Math.PI * this.m_frequencyHz;
         var d = 2.0 * this.m_mass * this.m_dampingRatio * omega;
         var k = this.m_mass * omega * omega;
         this.m_gamma = step.dt * (d + step.dt * k);
         this.m_gamma = this.m_gamma != 0.0 ? 1 / this.m_gamma : 0.0;
         this.m_bias = C * step.dt * k * this.m_gamma;
         this.m_mass = invMass + this.m_gamma;
         this.m_mass = this.m_mass != 0.0 ? 1.0 / this.m_mass : 0.0;
      }
      if (step.warmStarting) {
         this.m_impulse *= step.dtRatio;
         var PX = this.m_impulse * this.m_u.x;
         var PY = this.m_impulse * this.m_u.y;
         bA.m_linearVelocity.x -= bA.m_invMass * PX;
         bA.m_linearVelocity.y -= bA.m_invMass * PY;
         bA.m_angularVelocity -= bA.m_invI * (r1X * PY - r1Y * PX);
         bB.m_linearVelocity.x += bB.m_invMass * PX;
         bB.m_linearVelocity.y += bB.m_invMass * PY;
         bB.m_angularVelocity += bB.m_invI * (r2X * PY - r2Y * PX);
      }
      else {
         this.m_impulse = 0.0;
      }
   }
   b2DistanceJoint.prototype.SolveVelocityConstraints = function (step) {
      var tMat;
      var bA = this.m_bodyA;
      var bB = this.m_bodyB;
      tMat = bA.m_xf.R;
      var r1X = this.m_localAnchor1.x - bA.m_sweep.localCenter.x;
      var r1Y = this.m_localAnchor1.y - bA.m_sweep.localCenter.y;
      var tX = (tMat.col1.x * r1X + tMat.col2.x * r1Y);
      r1Y = (tMat.col1.y * r1X + tMat.col2.y * r1Y);
      r1X = tX;
      tMat = bB.m_xf.R;
      var r2X = this.m_localAnchor2.x - bB.m_sweep.localCenter.x;
      var r2Y = this.m_localAnchor2.y - bB.m_sweep.localCenter.y;
      tX = (tMat.col1.x * r2X + tMat.col2.x * r2Y);
      r2Y = (tMat.col1.y * r2X + tMat.col2.y * r2Y);
      r2X = tX;
      var v1X = bA.m_linearVelocity.x + ((-bA.m_angularVelocity * r1Y));
      var v1Y = bA.m_linearVelocity.y + (bA.m_angularVelocity * r1X);
      var v2X = bB.m_linearVelocity.x + ((-bB.m_angularVelocity * r2Y));
      var v2Y = bB.m_linearVelocity.y + (bB.m_angularVelocity * r2X);
      var Cdot = (this.m_u.x * (v2X - v1X) + this.m_u.y * (v2Y - v1Y));
      var impulse = (-this.m_mass * (Cdot + this.m_bias + this.m_gamma * this.m_impulse));
      this.m_impulse += impulse;
      var PX = impulse * this.m_u.x;
      var PY = impulse * this.m_u.y;
      bA.m_linearVelocity.x -= bA.m_invMass * PX;
      bA.m_linearVelocity.y -= bA.m_invMass * PY;
      bA.m_angularVelocity -= bA.m_invI * (r1X * PY - r1Y * PX);
      bB.m_linearVelocity.x += bB.m_invMass * PX;
      bB.m_linearVelocity.y += bB.m_invMass * PY;
      bB.m_angularVelocity += bB.m_invI * (r2X * PY - r2Y * PX);
   }
   b2DistanceJoint.prototype.SolvePositionConstraints = function (baumgarte) {
      if (baumgarte === undefined) baumgarte = 0;
      var tMat;
      if (this.m_frequencyHz > 0.0) {
         return true;
      }
      var bA = this.m_bodyA;
      var bB = this.m_bodyB;
      tMat = bA.m_xf.R;
      var r1X = this.m_localAnchor1.x - bA.m_sweep.localCenter.x;
      var r1Y = this.m_localAnchor1.y - bA.m_sweep.localCenter.y;
      var tX = (tMat.col1.x * r1X + tMat.col2.x * r1Y);
      r1Y = (tMat.col1.y * r1X + tMat.col2.y * r1Y);
      r1X = tX;
      tMat = bB.m_xf.R;
      var r2X = this.m_localAnchor2.x - bB.m_sweep.localCenter.x;
      var r2Y = this.m_localAnchor2.y - bB.m_sweep.localCenter.y;
      tX = (tMat.col1.x * r2X + tMat.col2.x * r2Y);
      r2Y = (tMat.col1.y * r2X + tMat.col2.y * r2Y);
      r2X = tX;
      var dX = bB.m_sweep.c.x + r2X - bA.m_sweep.c.x - r1X;
      var dY = bB.m_sweep.c.y + r2Y - bA.m_sweep.c.y - r1Y;
      var length = Math.sqrt(dX * dX + dY * dY);
      dX /= length;
      dY /= length;
      var C = length - this.m_length;
      C = b2Math.Clamp(C, (-b2Settings.b2_maxLinearCorrection), b2Settings.b2_maxLinearCorrection);
      var impulse = (-this.m_mass * C);
      this.m_u.Set(dX, dY);
      var PX = impulse * this.m_u.x;
      var PY = impulse * this.m_u.y;
      bA.m_sweep.c.x -= bA.m_invMass * PX;
      bA.m_sweep.c.y -= bA.m_invMass * PY;
      bA.m_sweep.a -= bA.m_invI * (r1X * PY - r1Y * PX);
      bB.m_sweep.c.x += bB.m_invMass * PX;
      bB.m_sweep.c.y += bB.m_invMass * PY;
      bB.m_sweep.a += bB.m_invI * (r2X * PY - r2Y * PX);
      bA.SynchronizeTransform();
      bB.SynchronizeTransform();
      return b2Math.Abs(C) < b2Settings.b2_linearSlop;
   }
   Box2D.inherit(b2DistanceJointDef, Box2D.Dynamics.Joints.b2JointDef);
   b2DistanceJointDef.prototype.__super = Box2D.Dynamics.Joints.b2JointDef.prototype;
   b2DistanceJointDef.b2DistanceJointDef = function () {
      Box2D.Dynamics.Joints.b2JointDef.b2JointDef.apply(this, arguments);
      this.localAnchorA = new b2Vec2();
      this.localAnchorB = new b2Vec2();
   };
   b2DistanceJointDef.prototype.b2DistanceJointDef = function () {
      this.__super.b2JointDef.call(this);
      this.type = b2Joint.e_distanceJoint;
      this.length = 1.0;
      this.frequencyHz = 0.0;
      this.dampingRatio = 0.0;
   }
   b2DistanceJointDef.prototype.Initialize = function (bA, bB, anchorA, anchorB) {
      this.bodyA = bA;
      this.bodyB = bB;
      this.localAnchorA.SetV(this.bodyA.GetLocalPoint(anchorA));
      this.localAnchorB.SetV(this.bodyB.GetLocalPoint(anchorB));
      var dX = anchorB.x - anchorA.x;
      var dY = anchorB.y - anchorA.y;
      this.length = Math.sqrt(dX * dX + dY * dY);
      this.frequencyHz = 0.0;
      this.dampingRatio = 0.0;
   }
   Box2D.inherit(b2FrictionJoint, Box2D.Dynamics.Joints.b2Joint);
   b2FrictionJoint.prototype.__super = Box2D.Dynamics.Joints.b2Joint.prototype;
   b2FrictionJoint.b2FrictionJoint = function () {
      Box2D.Dynamics.Joints.b2Joint.b2Joint.apply(this, arguments);
      this.m_localAnchorA = new b2Vec2();
      this.m_localAnchorB = new b2Vec2();
      this.m_linearMass = new b2Mat22();
      this.m_linearImpulse = new b2Vec2();
   };
   b2FrictionJoint.prototype.GetAnchorA = function () {
      return this.m_bodyA.GetWorldPoint(this.m_localAnchorA);
   }
   b2FrictionJoint.prototype.GetAnchorB = function () {
      return this.m_bodyB.GetWorldPoint(this.m_localAnchorB);
   }
   b2FrictionJoint.prototype.GetReactionForce = function (inv_dt) {
      if (inv_dt === undefined) inv_dt = 0;
      return new b2Vec2(inv_dt * this.m_linearImpulse.x, inv_dt * this.m_linearImpulse.y);
   }
   b2FrictionJoint.prototype.GetReactionTorque = function (inv_dt) {
      if (inv_dt === undefined) inv_dt = 0;
      return inv_dt * this.m_angularImpulse;
   }
   b2FrictionJoint.prototype.SetMaxForce = function (force) {
      if (force === undefined) force = 0;
      this.m_maxForce = force;
   }
   b2FrictionJoint.prototype.GetMaxForce = function () {
      return this.m_maxForce;
   }
   b2FrictionJoint.prototype.SetMaxTorque = function (torque) {
      if (torque === undefined) torque = 0;
      this.m_maxTorque = torque;
   }
   b2FrictionJoint.prototype.GetMaxTorque = function () {
      return this.m_maxTorque;
   }
   b2FrictionJoint.prototype.b2FrictionJoint = function (def) {
      this.__super.b2Joint.call(this, def);
      this.m_localAnchorA.SetV(def.localAnchorA);
      this.m_localAnchorB.SetV(def.localAnchorB);
      this.m_linearMass.SetZero();
      this.m_angularMass = 0.0;
      this.m_linearImpulse.SetZero();
      this.m_angularImpulse = 0.0;
      this.m_maxForce = def.maxForce;
      this.m_maxTorque = def.maxTorque;
   }
   b2FrictionJoint.prototype.InitVelocityConstraints = function (step) {
      var tMat;
      var tX = 0;
      var bA = this.m_bodyA;
      var bB = this.m_bodyB;
      tMat = bA.m_xf.R;
      var rAX = this.m_localAnchorA.x - bA.m_sweep.localCenter.x;
      var rAY = this.m_localAnchorA.y - bA.m_sweep.localCenter.y;
      tX = (tMat.col1.x * rAX + tMat.col2.x * rAY);
      rAY = (tMat.col1.y * rAX + tMat.col2.y * rAY);
      rAX = tX;
      tMat = bB.m_xf.R;
      var rBX = this.m_localAnchorB.x - bB.m_sweep.localCenter.x;
      var rBY = this.m_localAnchorB.y - bB.m_sweep.localCenter.y;
      tX = (tMat.col1.x * rBX + tMat.col2.x * rBY);
      rBY = (tMat.col1.y * rBX + tMat.col2.y * rBY);
      rBX = tX;
      var mA = bA.m_invMass;
      var mB = bB.m_invMass;
      var iA = bA.m_invI;
      var iB = bB.m_invI;
      var K = new b2Mat22();
      K.col1.x = mA + mB;
      K.col2.x = 0.0;
      K.col1.y = 0.0;
      K.col2.y = mA + mB;
      K.col1.x += iA * rAY * rAY;
      K.col2.x += (-iA * rAX * rAY);
      K.col1.y += (-iA * rAX * rAY);
      K.col2.y += iA * rAX * rAX;
      K.col1.x += iB * rBY * rBY;
      K.col2.x += (-iB * rBX * rBY);
      K.col1.y += (-iB * rBX * rBY);
      K.col2.y += iB * rBX * rBX;
      K.GetInverse(this.m_linearMass);
      this.m_angularMass = iA + iB;
      if (this.m_angularMass > 0.0) {
         this.m_angularMass = 1.0 / this.m_angularMass;
      }
      if (step.warmStarting) {
         this.m_linearImpulse.x *= step.dtRatio;
         this.m_linearImpulse.y *= step.dtRatio;
         this.m_angularImpulse *= step.dtRatio;
         var P = this.m_linearImpulse;
         bA.m_linearVelocity.x -= mA * P.x;
         bA.m_linearVelocity.y -= mA * P.y;
         bA.m_angularVelocity -= iA * (rAX * P.y - rAY * P.x + this.m_angularImpulse);
         bB.m_linearVelocity.x += mB * P.x;
         bB.m_linearVelocity.y += mB * P.y;
         bB.m_angularVelocity += iB * (rBX * P.y - rBY * P.x + this.m_angularImpulse);
      }
      else {
         this.m_linearImpulse.SetZero();
         this.m_angularImpulse = 0.0;
      }
   }
   b2FrictionJoint.prototype.SolveVelocityConstraints = function (step) {
      var tMat;
      var tX = 0;
      var bA = this.m_bodyA;
      var bB = this.m_bodyB;
      var vA = bA.m_linearVelocity;
      var wA = bA.m_angularVelocity;
      var vB = bB.m_linearVelocity;
      var wB = bB.m_angularVelocity;
      var mA = bA.m_invMass;
      var mB = bB.m_invMass;
      var iA = bA.m_invI;
      var iB = bB.m_invI;
      tMat = bA.m_xf.R;
      var rAX = this.m_localAnchorA.x - bA.m_sweep.localCenter.x;
      var rAY = this.m_localAnchorA.y - bA.m_sweep.localCenter.y;
      tX = (tMat.col1.x * rAX + tMat.col2.x * rAY);
      rAY = (tMat.col1.y * rAX + tMat.col2.y * rAY);
      rAX = tX;
      tMat = bB.m_xf.R;
      var rBX = this.m_localAnchorB.x - bB.m_sweep.localCenter.x;
      var rBY = this.m_localAnchorB.y - bB.m_sweep.localCenter.y;
      tX = (tMat.col1.x * rBX + tMat.col2.x * rBY);
      rBY = (tMat.col1.y * rBX + tMat.col2.y * rBY);
      rBX = tX;
      var maxImpulse = 0; {
         var Cdot = wB - wA;
         var impulse = (-this.m_angularMass * Cdot);
         var oldImpulse = this.m_angularImpulse;
         maxImpulse = step.dt * this.m_maxTorque;
         this.m_angularImpulse = b2Math.Clamp(this.m_angularImpulse + impulse, (-maxImpulse), maxImpulse);
         impulse = this.m_angularImpulse - oldImpulse;
         wA -= iA * impulse;
         wB += iB * impulse;
      } {
         var CdotX = vB.x - wB * rBY - vA.x + wA * rAY;
         var CdotY = vB.y + wB * rBX - vA.y - wA * rAX;
         var impulseV = b2Math.MulMV(this.m_linearMass, new b2Vec2((-CdotX), (-CdotY)));
         var oldImpulseV = this.m_linearImpulse.Copy();
         this.m_linearImpulse.Add(impulseV);
         maxImpulse = step.dt * this.m_maxForce;
         if (this.m_linearImpulse.LengthSquared() > maxImpulse * maxImpulse) {
            this.m_linearImpulse.Normalize();
            this.m_linearImpulse.Multiply(maxImpulse);
         }
         impulseV = b2Math.SubtractVV(this.m_linearImpulse, oldImpulseV);
         vA.x -= mA * impulseV.x;
         vA.y -= mA * impulseV.y;
         wA -= iA * (rAX * impulseV.y - rAY * impulseV.x);
         vB.x += mB * impulseV.x;
         vB.y += mB * impulseV.y;
         wB += iB * (rBX * impulseV.y - rBY * impulseV.x);
      }
      bA.m_angularVelocity = wA;
      bB.m_angularVelocity = wB;
   }
   b2FrictionJoint.prototype.SolvePositionConstraints = function (baumgarte) {
      if (baumgarte === undefined) baumgarte = 0;
      return true;
   }
   Box2D.inherit(b2FrictionJointDef, Box2D.Dynamics.Joints.b2JointDef);
   b2FrictionJointDef.prototype.__super = Box2D.Dynamics.Joints.b2JointDef.prototype;
   b2FrictionJointDef.b2FrictionJointDef = function () {
      Box2D.Dynamics.Joints.b2JointDef.b2JointDef.apply(this, arguments);
      this.localAnchorA = new b2Vec2();
      this.localAnchorB = new b2Vec2();
   };
   b2FrictionJointDef.prototype.b2FrictionJointDef = function () {
      this.__super.b2JointDef.call(this);
      this.type = b2Joint.e_frictionJoint;
      this.maxForce = 0.0;
      this.maxTorque = 0.0;
   }
   b2FrictionJointDef.prototype.Initialize = function (bA, bB, anchor) {
      this.bodyA = bA;
      this.bodyB = bB;
      this.localAnchorA.SetV(this.bodyA.GetLocalPoint(anchor));
      this.localAnchorB.SetV(this.bodyB.GetLocalPoint(anchor));
   }
   Box2D.inherit(b2GearJoint, Box2D.Dynamics.Joints.b2Joint);
   b2GearJoint.prototype.__super = Box2D.Dynamics.Joints.b2Joint.prototype;
   b2GearJoint.b2GearJoint = function () {
      Box2D.Dynamics.Joints.b2Joint.b2Joint.apply(this, arguments);
      this.m_groundAnchor1 = new b2Vec2();
      this.m_groundAnchor2 = new b2Vec2();
      this.m_localAnchor1 = new b2Vec2();
      this.m_localAnchor2 = new b2Vec2();
      this.m_J = new b2Jacobian();
   };
   b2GearJoint.prototype.GetAnchorA = function () {
      return this.m_bodyA.GetWorldPoint(this.m_localAnchor1);
   }
   b2GearJoint.prototype.GetAnchorB = function () {
      return this.m_bodyB.GetWorldPoint(this.m_localAnchor2);
   }
   b2GearJoint.prototype.GetReactionForce = function (inv_dt) {
      if (inv_dt === undefined) inv_dt = 0;
      return new b2Vec2(inv_dt * this.m_impulse * this.m_J.linearB.x, inv_dt * this.m_impulse * this.m_J.linearB.y);
   }
   b2GearJoint.prototype.GetReactionTorque = function (inv_dt) {
      if (inv_dt === undefined) inv_dt = 0;
      var tMat = this.m_bodyB.m_xf.R;
      var rX = this.m_localAnchor1.x - this.m_bodyB.m_sweep.localCenter.x;
      var rY = this.m_localAnchor1.y - this.m_bodyB.m_sweep.localCenter.y;
      var tX = tMat.col1.x * rX + tMat.col2.x * rY;
      rY = tMat.col1.y * rX + tMat.col2.y * rY;
      rX = tX;
      var PX = this.m_impulse * this.m_J.linearB.x;
      var PY = this.m_impulse * this.m_J.linearB.y;
      return inv_dt * (this.m_impulse * this.m_J.angularB - rX * PY + rY * PX);
   }
   b2GearJoint.prototype.GetRatio = function () {
      return this.m_ratio;
   }
   b2GearJoint.prototype.SetRatio = function (ratio) {
      if (ratio === undefined) ratio = 0;
      this.m_ratio = ratio;
   }
   b2GearJoint.prototype.b2GearJoint = function (def) {
      this.__super.b2Joint.call(this, def);
      var type1 = parseInt(def.joint1.m_type);
      var type2 = parseInt(def.joint2.m_type);
      this.m_revolute1 = null;
      this.m_prismatic1 = null;
      this.m_revolute2 = null;
      this.m_prismatic2 = null;
      var coordinate1 = 0;
      var coordinate2 = 0;
      this.m_ground1 = def.joint1.GetBodyA();
      this.m_bodyA = def.joint1.GetBodyB();
      if (type1 == b2Joint.e_revoluteJoint) {
         this.m_revolute1 = (def.joint1 instanceof b2RevoluteJoint ? def.joint1 : null);
         this.m_groundAnchor1.SetV(this.m_revolute1.m_localAnchor1);
         this.m_localAnchor1.SetV(this.m_revolute1.m_localAnchor2);
         coordinate1 = this.m_revolute1.GetJointAngle();
      }
      else {
         this.m_prismatic1 = (def.joint1 instanceof b2PrismaticJoint ? def.joint1 : null);
         this.m_groundAnchor1.SetV(this.m_prismatic1.m_localAnchor1);
         this.m_localAnchor1.SetV(this.m_prismatic1.m_localAnchor2);
         coordinate1 = this.m_prismatic1.GetJointTranslation();
      }
      this.m_ground2 = def.joint2.GetBodyA();
      this.m_bodyB = def.joint2.GetBodyB();
      if (type2 == b2Joint.e_revoluteJoint) {
         this.m_revolute2 = (def.joint2 instanceof b2RevoluteJoint ? def.joint2 : null);
         this.m_groundAnchor2.SetV(this.m_revolute2.m_localAnchor1);
         this.m_localAnchor2.SetV(this.m_revolute2.m_localAnchor2);
         coordinate2 = this.m_revolute2.GetJointAngle();
      }
      else {
         this.m_prismatic2 = (def.joint2 instanceof b2PrismaticJoint ? def.joint2 : null);
         this.m_groundAnchor2.SetV(this.m_prismatic2.m_localAnchor1);
         this.m_localAnchor2.SetV(this.m_prismatic2.m_localAnchor2);
         coordinate2 = this.m_prismatic2.GetJointTranslation();
      }
      this.m_ratio = def.ratio;
      this.m_constant = coordinate1 + this.m_ratio * coordinate2;
      this.m_impulse = 0.0;
   }
   b2GearJoint.prototype.InitVelocityConstraints = function (step) {
      var g1 = this.m_ground1;
      var g2 = this.m_ground2;
      var bA = this.m_bodyA;
      var bB = this.m_bodyB;
      var ugX = 0;
      var ugY = 0;
      var rX = 0;
      var rY = 0;
      var tMat;
      var tVec;
      var crug = 0;
      var tX = 0;
      var K = 0.0;
      this.m_J.SetZero();
      if (this.m_revolute1) {
         this.m_J.angularA = (-1.0);
         K += bA.m_invI;
      }
      else {
         tMat = g1.m_xf.R;
         tVec = this.m_prismatic1.m_localXAxis1;
         ugX = tMat.col1.x * tVec.x + tMat.col2.x * tVec.y;
         ugY = tMat.col1.y * tVec.x + tMat.col2.y * tVec.y;
         tMat = bA.m_xf.R;
         rX = this.m_localAnchor1.x - bA.m_sweep.localCenter.x;
         rY = this.m_localAnchor1.y - bA.m_sweep.localCenter.y;
         tX = tMat.col1.x * rX + tMat.col2.x * rY;
         rY = tMat.col1.y * rX + tMat.col2.y * rY;
         rX = tX;
         crug = rX * ugY - rY * ugX;
         this.m_J.linearA.Set((-ugX), (-ugY));
         this.m_J.angularA = (-crug);
         K += bA.m_invMass + bA.m_invI * crug * crug;
      }
      if (this.m_revolute2) {
         this.m_J.angularB = (-this.m_ratio);
         K += this.m_ratio * this.m_ratio * bB.m_invI;
      }
      else {
         tMat = g2.m_xf.R;
         tVec = this.m_prismatic2.m_localXAxis1;
         ugX = tMat.col1.x * tVec.x + tMat.col2.x * tVec.y;
         ugY = tMat.col1.y * tVec.x + tMat.col2.y * tVec.y;
         tMat = bB.m_xf.R;
         rX = this.m_localAnchor2.x - bB.m_sweep.localCenter.x;
         rY = this.m_localAnchor2.y - bB.m_sweep.localCenter.y;
         tX = tMat.col1.x * rX + tMat.col2.x * rY;
         rY = tMat.col1.y * rX + tMat.col2.y * rY;
         rX = tX;
         crug = rX * ugY - rY * ugX;
         this.m_J.linearB.Set((-this.m_ratio * ugX), (-this.m_ratio * ugY));
         this.m_J.angularB = (-this.m_ratio * crug);
         K += this.m_ratio * this.m_ratio * (bB.m_invMass + bB.m_invI * crug * crug);
      }
      this.m_mass = K > 0.0 ? 1.0 / K : 0.0;
      if (step.warmStarting) {
         bA.m_linearVelocity.x += bA.m_invMass * this.m_impulse * this.m_J.linearA.x;
         bA.m_linearVelocity.y += bA.m_invMass * this.m_impulse * this.m_J.linearA.y;
         bA.m_angularVelocity += bA.m_invI * this.m_impulse * this.m_J.angularA;
         bB.m_linearVelocity.x += bB.m_invMass * this.m_impulse * this.m_J.linearB.x;
         bB.m_linearVelocity.y += bB.m_invMass * this.m_impulse * this.m_J.linearB.y;
         bB.m_angularVelocity += bB.m_invI * this.m_impulse * this.m_J.angularB;
      }
      else {
         this.m_impulse = 0.0;
      }
   }
   b2GearJoint.prototype.SolveVelocityConstraints = function (step) {
      var bA = this.m_bodyA;
      var bB = this.m_bodyB;
      var Cdot = this.m_J.Compute(bA.m_linearVelocity, bA.m_angularVelocity, bB.m_linearVelocity, bB.m_angularVelocity);
      var impulse = (-this.m_mass * Cdot);
      this.m_impulse += impulse;
      bA.m_linearVelocity.x += bA.m_invMass * impulse * this.m_J.linearA.x;
      bA.m_linearVelocity.y += bA.m_invMass * impulse * this.m_J.linearA.y;
      bA.m_angularVelocity += bA.m_invI * impulse * this.m_J.angularA;
      bB.m_linearVelocity.x += bB.m_invMass * impulse * this.m_J.linearB.x;
      bB.m_linearVelocity.y += bB.m_invMass * impulse * this.m_J.linearB.y;
      bB.m_angularVelocity += bB.m_invI * impulse * this.m_J.angularB;
   }
   b2GearJoint.prototype.SolvePositionConstraints = function (baumgarte) {
      if (baumgarte === undefined) baumgarte = 0;
      var linearError = 0.0;
      var bA = this.m_bodyA;
      var bB = this.m_bodyB;
      var coordinate1 = 0;
      var coordinate2 = 0;
      if (this.m_revolute1) {
         coordinate1 = this.m_revolute1.GetJointAngle();
      }
      else {
         coordinate1 = this.m_prismatic1.GetJointTranslation();
      }
      if (this.m_revolute2) {
         coordinate2 = this.m_revolute2.GetJointAngle();
      }
      else {
         coordinate2 = this.m_prismatic2.GetJointTranslation();
      }
      var C = this.m_constant - (coordinate1 + this.m_ratio * coordinate2);
      var impulse = (-this.m_mass * C);
      bA.m_sweep.c.x += bA.m_invMass * impulse * this.m_J.linearA.x;
      bA.m_sweep.c.y += bA.m_invMass * impulse * this.m_J.linearA.y;
      bA.m_sweep.a += bA.m_invI * impulse * this.m_J.angularA;
      bB.m_sweep.c.x += bB.m_invMass * impulse * this.m_J.linearB.x;
      bB.m_sweep.c.y += bB.m_invMass * impulse * this.m_J.linearB.y;
      bB.m_sweep.a += bB.m_invI * impulse * this.m_J.angularB;
      bA.SynchronizeTransform();
      bB.SynchronizeTransform();
      return linearError < b2Settings.b2_linearSlop;
   }
   Box2D.inherit(b2GearJointDef, Box2D.Dynamics.Joints.b2JointDef);
   b2GearJointDef.prototype.__super = Box2D.Dynamics.Joints.b2JointDef.prototype;
   b2GearJointDef.b2GearJointDef = function () {
      Box2D.Dynamics.Joints.b2JointDef.b2JointDef.apply(this, arguments);
   };
   b2GearJointDef.prototype.b2GearJointDef = function () {
      this.__super.b2JointDef.call(this);
      this.type = b2Joint.e_gearJoint;
      this.joint1 = null;
      this.joint2 = null;
      this.ratio = 1.0;
   }
   b2Jacobian.b2Jacobian = function () {
      this.linearA = new b2Vec2();
      this.linearB = new b2Vec2();
   };
   b2Jacobian.prototype.SetZero = function () {
      this.linearA.SetZero();
      this.angularA = 0.0;
      this.linearB.SetZero();
      this.angularB = 0.0;
   }
   b2Jacobian.prototype.Set = function (x1, a1, x2, a2) {
      if (a1 === undefined) a1 = 0;
      if (a2 === undefined) a2 = 0;
      this.linearA.SetV(x1);
      this.angularA = a1;
      this.linearB.SetV(x2);
      this.angularB = a2;
   }
   b2Jacobian.prototype.Compute = function (x1, a1, x2, a2) {
      if (a1 === undefined) a1 = 0;
      if (a2 === undefined) a2 = 0;
      return (this.linearA.x * x1.x + this.linearA.y * x1.y) + this.angularA * a1 + (this.linearB.x * x2.x + this.linearB.y * x2.y) + this.angularB * a2;
   }
   b2Joint.b2Joint = function () {
      this.m_edgeA = new b2JointEdge();
      this.m_edgeB = new b2JointEdge();
      this.m_localCenterA = new b2Vec2();
      this.m_localCenterB = new b2Vec2();
   };
   b2Joint.prototype.GetType = function () {
      return this.m_type;
   }
   b2Joint.prototype.GetAnchorA = function () {
      return null;
   }
   b2Joint.prototype.GetAnchorB = function () {
      return null;
   }
   b2Joint.prototype.GetReactionForce = function (inv_dt) {
      if (inv_dt === undefined) inv_dt = 0;
      return null;
   }
   b2Joint.prototype.GetReactionTorque = function (inv_dt) {
      if (inv_dt === undefined) inv_dt = 0;
      return 0.0;
   }
   b2Joint.prototype.GetBodyA = function () {
      return this.m_bodyA;
   }
   b2Joint.prototype.GetBodyB = function () {
      return this.m_bodyB;
   }
   b2Joint.prototype.GetNext = function () {
      return this.m_next;
   }
   b2Joint.prototype.GetUserData = function () {
      return this.m_userData;
   }
   b2Joint.prototype.SetUserData = function (data) {
      this.m_userData = data;
   }
   b2Joint.prototype.IsActive = function () {
      return this.m_bodyA.IsActive() && this.m_bodyB.IsActive();
   }
   b2Joint.Create = function (def, allocator) {
      var joint = null;
      switch (def.type) {
      case b2Joint.e_distanceJoint:
         {
            joint = new b2DistanceJoint((def instanceof b2DistanceJointDef ? def : null));
         }
         break;
      case b2Joint.e_mouseJoint:
         {
            joint = new b2MouseJoint((def instanceof b2MouseJointDef ? def : null));
         }
         break;
      case b2Joint.e_prismaticJoint:
         {
            joint = new b2PrismaticJoint((def instanceof b2PrismaticJointDef ? def : null));
         }
         break;
      case b2Joint.e_revoluteJoint:
         {
            joint = new b2RevoluteJoint((def instanceof b2RevoluteJointDef ? def : null));
         }
         break;
      case b2Joint.e_pulleyJoint:
         {
            joint = new b2PulleyJoint((def instanceof b2PulleyJointDef ? def : null));
         }
         break;
      case b2Joint.e_gearJoint:
         {
            joint = new b2GearJoint((def instanceof b2GearJointDef ? def : null));
         }
         break;
      case b2Joint.e_lineJoint:
         {
            joint = new b2LineJoint((def instanceof b2LineJointDef ? def : null));
         }
         break;
      case b2Joint.e_weldJoint:
         {
            joint = new b2WeldJoint((def instanceof b2WeldJointDef ? def : null));
         }
         break;
      case b2Joint.e_frictionJoint:
         {
            joint = new b2FrictionJoint((def instanceof b2FrictionJointDef ? def : null));
         }
         break;
      default:
         break;
      }
      return joint;
   }
   b2Joint.Destroy = function (joint, allocator) {}
   b2Joint.prototype.b2Joint = function (def) {
      b2Settings.b2Assert(def.bodyA != def.bodyB);
      this.m_type = def.type;
      this.m_prev = null;
      this.m_next = null;
      this.m_bodyA = def.bodyA;
      this.m_bodyB = def.bodyB;
      this.m_collideConnected = def.collideConnected;
      this.m_islandFlag = false;
      this.m_userData = def.userData;
   }
   b2Joint.prototype.InitVelocityConstraints = function (step) {}
   b2Joint.prototype.SolveVelocityConstraints = function (step) {}
   b2Joint.prototype.FinalizeVelocityConstraints = function () {}
   b2Joint.prototype.SolvePositionConstraints = function (baumgarte) {
      if (baumgarte === undefined) baumgarte = 0;
      return false;
   }
   Box2D.postDefs.push(function () {
      Box2D.Dynamics.Joints.b2Joint.e_unknownJoint = 0;
      Box2D.Dynamics.Joints.b2Joint.e_revoluteJoint = 1;
      Box2D.Dynamics.Joints.b2Joint.e_prismaticJoint = 2;
      Box2D.Dynamics.Joints.b2Joint.e_distanceJoint = 3;
      Box2D.Dynamics.Joints.b2Joint.e_pulleyJoint = 4;
      Box2D.Dynamics.Joints.b2Joint.e_mouseJoint = 5;
      Box2D.Dynamics.Joints.b2Joint.e_gearJoint = 6;
      Box2D.Dynamics.Joints.b2Joint.e_lineJoint = 7;
      Box2D.Dynamics.Joints.b2Joint.e_weldJoint = 8;
      Box2D.Dynamics.Joints.b2Joint.e_frictionJoint = 9;
      Box2D.Dynamics.Joints.b2Joint.e_inactiveLimit = 0;
      Box2D.Dynamics.Joints.b2Joint.e_atLowerLimit = 1;
      Box2D.Dynamics.Joints.b2Joint.e_atUpperLimit = 2;
      Box2D.Dynamics.Joints.b2Joint.e_equalLimits = 3;
   });
   b2JointDef.b2JointDef = function () {};
   b2JointDef.prototype.b2JointDef = function () {
      this.type = b2Joint.e_unknownJoint;
      this.userData = null;
      this.bodyA = null;
      this.bodyB = null;
      this.collideConnected = false;
   }
   b2JointEdge.b2JointEdge = function () {};
   Box2D.inherit(b2LineJoint, Box2D.Dynamics.Joints.b2Joint);
   b2LineJoint.prototype.__super = Box2D.Dynamics.Joints.b2Joint.prototype;
   b2LineJoint.b2LineJoint = function () {
      Box2D.Dynamics.Joints.b2Joint.b2Joint.apply(this, arguments);
      this.m_localAnchor1 = new b2Vec2();
      this.m_localAnchor2 = new b2Vec2();
      this.m_localXAxis1 = new b2Vec2();
      this.m_localYAxis1 = new b2Vec2();
      this.m_axis = new b2Vec2();
      this.m_perp = new b2Vec2();
      this.m_K = new b2Mat22();
      this.m_impulse = new b2Vec2();
   };
   b2LineJoint.prototype.GetAnchorA = function () {
      return this.m_bodyA.GetWorldPoint(this.m_localAnchor1);
   }
   b2LineJoint.prototype.GetAnchorB = function () {
      return this.m_bodyB.GetWorldPoint(this.m_localAnchor2);
   }
   b2LineJoint.prototype.GetReactionForce = function (inv_dt) {
      if (inv_dt === undefined) inv_dt = 0;
      return new b2Vec2(inv_dt * (this.m_impulse.x * this.m_perp.x + (this.m_motorImpulse + this.m_impulse.y) * this.m_axis.x), inv_dt * (this.m_impulse.x * this.m_perp.y + (this.m_motorImpulse + this.m_impulse.y) * this.m_axis.y));
   }
   b2LineJoint.prototype.GetReactionTorque = function (inv_dt) {
      if (inv_dt === undefined) inv_dt = 0;
      return inv_dt * this.m_impulse.y;
   }
   b2LineJoint.prototype.GetJointTranslation = function () {
      var bA = this.m_bodyA;
      var bB = this.m_bodyB;
      var tMat;
      var p1 = bA.GetWorldPoint(this.m_localAnchor1);
      var p2 = bB.GetWorldPoint(this.m_localAnchor2);
      var dX = p2.x - p1.x;
      var dY = p2.y - p1.y;
      var axis = bA.GetWorldVector(this.m_localXAxis1);
      var translation = axis.x * dX + axis.y * dY;
      return translation;
   }
   b2LineJoint.prototype.GetJointSpeed = function () {
      var bA = this.m_bodyA;
      var bB = this.m_bodyB;
      var tMat;
      tMat = bA.m_xf.R;
      var r1X = this.m_localAnchor1.x - bA.m_sweep.localCenter.x;
      var r1Y = this.m_localAnchor1.y - bA.m_sweep.localCenter.y;
      var tX = (tMat.col1.x * r1X + tMat.col2.x * r1Y);
      r1Y = (tMat.col1.y * r1X + tMat.col2.y * r1Y);
      r1X = tX;
      tMat = bB.m_xf.R;
      var r2X = this.m_localAnchor2.x - bB.m_sweep.localCenter.x;
      var r2Y = this.m_localAnchor2.y - bB.m_sweep.localCenter.y;
      tX = (tMat.col1.x * r2X + tMat.col2.x * r2Y);
      r2Y = (tMat.col1.y * r2X + tMat.col2.y * r2Y);
      r2X = tX;
      var p1X = bA.m_sweep.c.x + r1X;
      var p1Y = bA.m_sweep.c.y + r1Y;
      var p2X = bB.m_sweep.c.x + r2X;
      var p2Y = bB.m_sweep.c.y + r2Y;
      var dX = p2X - p1X;
      var dY = p2Y - p1Y;
      var axis = bA.GetWorldVector(this.m_localXAxis1);
      var v1 = bA.m_linearVelocity;
      var v2 = bB.m_linearVelocity;
      var w1 = bA.m_angularVelocity;
      var w2 = bB.m_angularVelocity;
      var speed = (dX * ((-w1 * axis.y)) + dY * (w1 * axis.x)) + (axis.x * (((v2.x + ((-w2 * r2Y))) - v1.x) - ((-w1 * r1Y))) + axis.y * (((v2.y + (w2 * r2X)) - v1.y) - (w1 * r1X)));
      return speed;
   }
   b2LineJoint.prototype.IsLimitEnabled = function () {
      return this.m_enableLimit;
   }
   b2LineJoint.prototype.EnableLimit = function (flag) {
      this.m_bodyA.SetAwake(true);
      this.m_bodyB.SetAwake(true);
      this.m_enableLimit = flag;
   }
   b2LineJoint.prototype.GetLowerLimit = function () {
      return this.m_lowerTranslation;
   }
   b2LineJoint.prototype.GetUpperLimit = function () {
      return this.m_upperTranslation;
   }
   b2LineJoint.prototype.SetLimits = function (lower, upper) {
      if (lower === undefined) lower = 0;
      if (upper === undefined) upper = 0;
      this.m_bodyA.SetAwake(true);
      this.m_bodyB.SetAwake(true);
      this.m_lowerTranslation = lower;
      this.m_upperTranslation = upper;
   }
   b2LineJoint.prototype.IsMotorEnabled = function () {
      return this.m_enableMotor;
   }
   b2LineJoint.prototype.EnableMotor = function (flag) {
      this.m_bodyA.SetAwake(true);
      this.m_bodyB.SetAwake(true);
      this.m_enableMotor = flag;
   }
   b2LineJoint.prototype.SetMotorSpeed = function (speed) {
      if (speed === undefined) speed = 0;
      this.m_bodyA.SetAwake(true);
      this.m_bodyB.SetAwake(true);
      this.m_motorSpeed = speed;
   }
   b2LineJoint.prototype.GetMotorSpeed = function () {
      return this.m_motorSpeed;
   }
   b2LineJoint.prototype.SetMaxMotorForce = function (force) {
      if (force === undefined) force = 0;
      this.m_bodyA.SetAwake(true);
      this.m_bodyB.SetAwake(true);
      this.m_maxMotorForce = force;
   }
   b2LineJoint.prototype.GetMaxMotorForce = function () {
      return this.m_maxMotorForce;
   }
   b2LineJoint.prototype.GetMotorForce = function () {
      return this.m_motorImpulse;
   }
   b2LineJoint.prototype.b2LineJoint = function (def) {
      this.__super.b2Joint.call(this, def);
      var tMat;
      var tX = 0;
      var tY = 0;
      this.m_localAnchor1.SetV(def.localAnchorA);
      this.m_localAnchor2.SetV(def.localAnchorB);
      this.m_localXAxis1.SetV(def.localAxisA);
      this.m_localYAxis1.x = (-this.m_localXAxis1.y);
      this.m_localYAxis1.y = this.m_localXAxis1.x;
      this.m_impulse.SetZero();
      this.m_motorMass = 0.0;
      this.m_motorImpulse = 0.0;
      this.m_lowerTranslation = def.lowerTranslation;
      this.m_upperTranslation = def.upperTranslation;
      this.m_maxMotorForce = def.maxMotorForce;
      this.m_motorSpeed = def.motorSpeed;
      this.m_enableLimit = def.enableLimit;
      this.m_enableMotor = def.enableMotor;
      this.m_limitState = b2Joint.e_inactiveLimit;
      this.m_axis.SetZero();
      this.m_perp.SetZero();
   }
   b2LineJoint.prototype.InitVelocityConstraints = function (step) {
      var bA = this.m_bodyA;
      var bB = this.m_bodyB;
      var tMat;
      var tX = 0;
      this.m_localCenterA.SetV(bA.GetLocalCenter());
      this.m_localCenterB.SetV(bB.GetLocalCenter());
      var xf1 = bA.GetTransform();
      var xf2 = bB.GetTransform();
      tMat = bA.m_xf.R;
      var r1X = this.m_localAnchor1.x - this.m_localCenterA.x;
      var r1Y = this.m_localAnchor1.y - this.m_localCenterA.y;
      tX = (tMat.col1.x * r1X + tMat.col2.x * r1Y);
      r1Y = (tMat.col1.y * r1X + tMat.col2.y * r1Y);
      r1X = tX;
      tMat = bB.m_xf.R;
      var r2X = this.m_localAnchor2.x - this.m_localCenterB.x;
      var r2Y = this.m_localAnchor2.y - this.m_localCenterB.y;
      tX = (tMat.col1.x * r2X + tMat.col2.x * r2Y);
      r2Y = (tMat.col1.y * r2X + tMat.col2.y * r2Y);
      r2X = tX;
      var dX = bB.m_sweep.c.x + r2X - bA.m_sweep.c.x - r1X;
      var dY = bB.m_sweep.c.y + r2Y - bA.m_sweep.c.y - r1Y;
      this.m_invMassA = bA.m_invMass;
      this.m_invMassB = bB.m_invMass;
      this.m_invIA = bA.m_invI;
      this.m_invIB = bB.m_invI; {
         this.m_axis.SetV(b2Math.MulMV(xf1.R, this.m_localXAxis1));
         this.m_a1 = (dX + r1X) * this.m_axis.y - (dY + r1Y) * this.m_axis.x;
         this.m_a2 = r2X * this.m_axis.y - r2Y * this.m_axis.x;
         this.m_motorMass = this.m_invMassA + this.m_invMassB + this.m_invIA * this.m_a1 * this.m_a1 + this.m_invIB * this.m_a2 * this.m_a2;
         this.m_motorMass = this.m_motorMass > Number.MIN_VALUE ? 1.0 / this.m_motorMass : 0.0;
      } {
         this.m_perp.SetV(b2Math.MulMV(xf1.R, this.m_localYAxis1));
         this.m_s1 = (dX + r1X) * this.m_perp.y - (dY + r1Y) * this.m_perp.x;
         this.m_s2 = r2X * this.m_perp.y - r2Y * this.m_perp.x;
         var m1 = this.m_invMassA;
         var m2 = this.m_invMassB;
         var i1 = this.m_invIA;
         var i2 = this.m_invIB;
         this.m_K.col1.x = m1 + m2 + i1 * this.m_s1 * this.m_s1 + i2 * this.m_s2 * this.m_s2;
         this.m_K.col1.y = i1 * this.m_s1 * this.m_a1 + i2 * this.m_s2 * this.m_a2;
         this.m_K.col2.x = this.m_K.col1.y;
         this.m_K.col2.y = m1 + m2 + i1 * this.m_a1 * this.m_a1 + i2 * this.m_a2 * this.m_a2;
      }
      if (this.m_enableLimit) {
         var jointTransition = this.m_axis.x * dX + this.m_axis.y * dY;
         if (b2Math.Abs(this.m_upperTranslation - this.m_lowerTranslation) < 2.0 * b2Settings.b2_linearSlop) {
            this.m_limitState = b2Joint.e_equalLimits;
         }
         else if (jointTransition <= this.m_lowerTranslation) {
            if (this.m_limitState != b2Joint.e_atLowerLimit) {
               this.m_limitState = b2Joint.e_atLowerLimit;
               this.m_impulse.y = 0.0;
            }
         }
         else if (jointTransition >= this.m_upperTranslation) {
            if (this.m_limitState != b2Joint.e_atUpperLimit) {
               this.m_limitState = b2Joint.e_atUpperLimit;
               this.m_impulse.y = 0.0;
            }
         }
         else {
            this.m_limitState = b2Joint.e_inactiveLimit;
            this.m_impulse.y = 0.0;
         }
      }
      else {
         this.m_limitState = b2Joint.e_inactiveLimit;
      }
      if (this.m_enableMotor == false) {
         this.m_motorImpulse = 0.0;
      }
      if (step.warmStarting) {
         this.m_impulse.x *= step.dtRatio;
         this.m_impulse.y *= step.dtRatio;
         this.m_motorImpulse *= step.dtRatio;
         var PX = this.m_impulse.x * this.m_perp.x + (this.m_motorImpulse + this.m_impulse.y) * this.m_axis.x;
         var PY = this.m_impulse.x * this.m_perp.y + (this.m_motorImpulse + this.m_impulse.y) * this.m_axis.y;
         var L1 = this.m_impulse.x * this.m_s1 + (this.m_motorImpulse + this.m_impulse.y) * this.m_a1;
         var L2 = this.m_impulse.x * this.m_s2 + (this.m_motorImpulse + this.m_impulse.y) * this.m_a2;
         bA.m_linearVelocity.x -= this.m_invMassA * PX;
         bA.m_linearVelocity.y -= this.m_invMassA * PY;
         bA.m_angularVelocity -= this.m_invIA * L1;
         bB.m_linearVelocity.x += this.m_invMassB * PX;
         bB.m_linearVelocity.y += this.m_invMassB * PY;
         bB.m_angularVelocity += this.m_invIB * L2;
      }
      else {
         this.m_impulse.SetZero();
         this.m_motorImpulse = 0.0;
      }
   }
   b2LineJoint.prototype.SolveVelocityConstraints = function (step) {
      var bA = this.m_bodyA;
      var bB = this.m_bodyB;
      var v1 = bA.m_linearVelocity;
      var w1 = bA.m_angularVelocity;
      var v2 = bB.m_linearVelocity;
      var w2 = bB.m_angularVelocity;
      var PX = 0;
      var PY = 0;
      var L1 = 0;
      var L2 = 0;
      if (this.m_enableMotor && this.m_limitState != b2Joint.e_equalLimits) {
         var Cdot = this.m_axis.x * (v2.x - v1.x) + this.m_axis.y * (v2.y - v1.y) + this.m_a2 * w2 - this.m_a1 * w1;
         var impulse = this.m_motorMass * (this.m_motorSpeed - Cdot);
         var oldImpulse = this.m_motorImpulse;
         var maxImpulse = step.dt * this.m_maxMotorForce;
         this.m_motorImpulse = b2Math.Clamp(this.m_motorImpulse + impulse, (-maxImpulse), maxImpulse);
         impulse = this.m_motorImpulse - oldImpulse;
         PX = impulse * this.m_axis.x;
         PY = impulse * this.m_axis.y;
         L1 = impulse * this.m_a1;
         L2 = impulse * this.m_a2;
         v1.x -= this.m_invMassA * PX;
         v1.y -= this.m_invMassA * PY;
         w1 -= this.m_invIA * L1;
         v2.x += this.m_invMassB * PX;
         v2.y += this.m_invMassB * PY;
         w2 += this.m_invIB * L2;
      }
      var Cdot1 = this.m_perp.x * (v2.x - v1.x) + this.m_perp.y * (v2.y - v1.y) + this.m_s2 * w2 - this.m_s1 * w1;
      if (this.m_enableLimit && this.m_limitState != b2Joint.e_inactiveLimit) {
         var Cdot2 = this.m_axis.x * (v2.x - v1.x) + this.m_axis.y * (v2.y - v1.y) + this.m_a2 * w2 - this.m_a1 * w1;
         var f1 = this.m_impulse.Copy();
         var df = this.m_K.Solve(new b2Vec2(), (-Cdot1), (-Cdot2));
         this.m_impulse.Add(df);
         if (this.m_limitState == b2Joint.e_atLowerLimit) {
            this.m_impulse.y = b2Math.Max(this.m_impulse.y, 0.0);
         }
         else if (this.m_limitState == b2Joint.e_atUpperLimit) {
            this.m_impulse.y = b2Math.Min(this.m_impulse.y, 0.0);
         }
         var b = (-Cdot1) - (this.m_impulse.y - f1.y) * this.m_K.col2.x;
         var f2r = 0;
         if (this.m_K.col1.x != 0.0) {
            f2r = b / this.m_K.col1.x + f1.x;
         }
         else {
            f2r = f1.x;
         }
         this.m_impulse.x = f2r;
         df.x = this.m_impulse.x - f1.x;
         df.y = this.m_impulse.y - f1.y;
         PX = df.x * this.m_perp.x + df.y * this.m_axis.x;
         PY = df.x * this.m_perp.y + df.y * this.m_axis.y;
         L1 = df.x * this.m_s1 + df.y * this.m_a1;
         L2 = df.x * this.m_s2 + df.y * this.m_a2;
         v1.x -= this.m_invMassA * PX;
         v1.y -= this.m_invMassA * PY;
         w1 -= this.m_invIA * L1;
         v2.x += this.m_invMassB * PX;
         v2.y += this.m_invMassB * PY;
         w2 += this.m_invIB * L2;
      }
      else {
         var df2 = 0;
         if (this.m_K.col1.x != 0.0) {
            df2 = ((-Cdot1)) / this.m_K.col1.x;
         }
         else {
            df2 = 0.0;
         }
         this.m_impulse.x += df2;
         PX = df2 * this.m_perp.x;
         PY = df2 * this.m_perp.y;
         L1 = df2 * this.m_s1;
         L2 = df2 * this.m_s2;
         v1.x -= this.m_invMassA * PX;
         v1.y -= this.m_invMassA * PY;
         w1 -= this.m_invIA * L1;
         v2.x += this.m_invMassB * PX;
         v2.y += this.m_invMassB * PY;
         w2 += this.m_invIB * L2;
      }
      bA.m_linearVelocity.SetV(v1);
      bA.m_angularVelocity = w1;
      bB.m_linearVelocity.SetV(v2);
      bB.m_angularVelocity = w2;
   }
   b2LineJoint.prototype.SolvePositionConstraints = function (baumgarte) {
      if (baumgarte === undefined) baumgarte = 0;
      var limitC = 0;
      var oldLimitImpulse = 0;
      var bA = this.m_bodyA;
      var bB = this.m_bodyB;
      var c1 = bA.m_sweep.c;
      var a1 = bA.m_sweep.a;
      var c2 = bB.m_sweep.c;
      var a2 = bB.m_sweep.a;
      var tMat;
      var tX = 0;
      var m1 = 0;
      var m2 = 0;
      var i1 = 0;
      var i2 = 0;
      var linearError = 0.0;
      var angularError = 0.0;
      var active = false;
      var C2 = 0.0;
      var R1 = b2Mat22.FromAngle(a1);
      var R2 = b2Mat22.FromAngle(a2);
      tMat = R1;
      var r1X = this.m_localAnchor1.x - this.m_localCenterA.x;
      var r1Y = this.m_localAnchor1.y - this.m_localCenterA.y;
      tX = (tMat.col1.x * r1X + tMat.col2.x * r1Y);
      r1Y = (tMat.col1.y * r1X + tMat.col2.y * r1Y);
      r1X = tX;
      tMat = R2;
      var r2X = this.m_localAnchor2.x - this.m_localCenterB.x;
      var r2Y = this.m_localAnchor2.y - this.m_localCenterB.y;
      tX = (tMat.col1.x * r2X + tMat.col2.x * r2Y);
      r2Y = (tMat.col1.y * r2X + tMat.col2.y * r2Y);
      r2X = tX;
      var dX = c2.x + r2X - c1.x - r1X;
      var dY = c2.y + r2Y - c1.y - r1Y;
      if (this.m_enableLimit) {
         this.m_axis = b2Math.MulMV(R1, this.m_localXAxis1);
         this.m_a1 = (dX + r1X) * this.m_axis.y - (dY + r1Y) * this.m_axis.x;
         this.m_a2 = r2X * this.m_axis.y - r2Y * this.m_axis.x;
         var translation = this.m_axis.x * dX + this.m_axis.y * dY;
         if (b2Math.Abs(this.m_upperTranslation - this.m_lowerTranslation) < 2.0 * b2Settings.b2_linearSlop) {
            C2 = b2Math.Clamp(translation, (-b2Settings.b2_maxLinearCorrection), b2Settings.b2_maxLinearCorrection);
            linearError = b2Math.Abs(translation);
            active = true;
         }
         else if (translation <= this.m_lowerTranslation) {
            C2 = b2Math.Clamp(translation - this.m_lowerTranslation + b2Settings.b2_linearSlop, (-b2Settings.b2_maxLinearCorrection), 0.0);
            linearError = this.m_lowerTranslation - translation;
            active = true;
         }
         else if (translation >= this.m_upperTranslation) {
            C2 = b2Math.Clamp(translation - this.m_upperTranslation + b2Settings.b2_linearSlop, 0.0, b2Settings.b2_maxLinearCorrection);
            linearError = translation - this.m_upperTranslation;
            active = true;
         }
      }
      this.m_perp = b2Math.MulMV(R1, this.m_localYAxis1);
      this.m_s1 = (dX + r1X) * this.m_perp.y - (dY + r1Y) * this.m_perp.x;
      this.m_s2 = r2X * this.m_perp.y - r2Y * this.m_perp.x;
      var impulse = new b2Vec2();
      var C1 = this.m_perp.x * dX + this.m_perp.y * dY;
      linearError = b2Math.Max(linearError, b2Math.Abs(C1));
      angularError = 0.0;
      if (active) {
         m1 = this.m_invMassA;
         m2 = this.m_invMassB;
         i1 = this.m_invIA;
         i2 = this.m_invIB;
         this.m_K.col1.x = m1 + m2 + i1 * this.m_s1 * this.m_s1 + i2 * this.m_s2 * this.m_s2;
         this.m_K.col1.y = i1 * this.m_s1 * this.m_a1 + i2 * this.m_s2 * this.m_a2;
         this.m_K.col2.x = this.m_K.col1.y;
         this.m_K.col2.y = m1 + m2 + i1 * this.m_a1 * this.m_a1 + i2 * this.m_a2 * this.m_a2;
         this.m_K.Solve(impulse, (-C1), (-C2));
      }
      else {
         m1 = this.m_invMassA;
         m2 = this.m_invMassB;
         i1 = this.m_invIA;
         i2 = this.m_invIB;
         var k11 = m1 + m2 + i1 * this.m_s1 * this.m_s1 + i2 * this.m_s2 * this.m_s2;
         var impulse1 = 0;
         if (k11 != 0.0) {
            impulse1 = ((-C1)) / k11;
         }
         else {
            impulse1 = 0.0;
         }
         impulse.x = impulse1;
         impulse.y = 0.0;
      }
      var PX = impulse.x * this.m_perp.x + impulse.y * this.m_axis.x;
      var PY = impulse.x * this.m_perp.y + impulse.y * this.m_axis.y;
      var L1 = impulse.x * this.m_s1 + impulse.y * this.m_a1;
      var L2 = impulse.x * this.m_s2 + impulse.y * this.m_a2;
      c1.x -= this.m_invMassA * PX;
      c1.y -= this.m_invMassA * PY;
      a1 -= this.m_invIA * L1;
      c2.x += this.m_invMassB * PX;
      c2.y += this.m_invMassB * PY;
      a2 += this.m_invIB * L2;
      bA.m_sweep.a = a1;
      bB.m_sweep.a = a2;
      bA.SynchronizeTransform();
      bB.SynchronizeTransform();
      return linearError <= b2Settings.b2_linearSlop && angularError <= b2Settings.b2_angularSlop;
   }
   Box2D.inherit(b2LineJointDef, Box2D.Dynamics.Joints.b2JointDef);
   b2LineJointDef.prototype.__super = Box2D.Dynamics.Joints.b2JointDef.prototype;
   b2LineJointDef.b2LineJointDef = function () {
      Box2D.Dynamics.Joints.b2JointDef.b2JointDef.apply(this, arguments);
      this.localAnchorA = new b2Vec2();
      this.localAnchorB = new b2Vec2();
      this.localAxisA = new b2Vec2();
   };
   b2LineJointDef.prototype.b2LineJointDef = function () {
      this.__super.b2JointDef.call(this);
      this.type = b2Joint.e_lineJoint;
      this.localAxisA.Set(1.0, 0.0);
      this.enableLimit = false;
      this.lowerTranslation = 0.0;
      this.upperTranslation = 0.0;
      this.enableMotor = false;
      this.maxMotorForce = 0.0;
      this.motorSpeed = 0.0;
   }
   b2LineJointDef.prototype.Initialize = function (bA, bB, anchor, axis) {
      this.bodyA = bA;
      this.bodyB = bB;
      this.localAnchorA = this.bodyA.GetLocalPoint(anchor);
      this.localAnchorB = this.bodyB.GetLocalPoint(anchor);
      this.localAxisA = this.bodyA.GetLocalVector(axis);
   }
   Box2D.inherit(b2MouseJoint, Box2D.Dynamics.Joints.b2Joint);
   b2MouseJoint.prototype.__super = Box2D.Dynamics.Joints.b2Joint.prototype;
   b2MouseJoint.b2MouseJoint = function () {
      Box2D.Dynamics.Joints.b2Joint.b2Joint.apply(this, arguments);
      this.K = new b2Mat22();
      this.K1 = new b2Mat22();
      this.K2 = new b2Mat22();
      this.m_localAnchor = new b2Vec2();
      this.m_target = new b2Vec2();
      this.m_impulse = new b2Vec2();
      this.m_mass = new b2Mat22();
      this.m_C = new b2Vec2();
   };
   b2MouseJoint.prototype.GetAnchorA = function () {
      return this.m_target;
   }
   b2MouseJoint.prototype.GetAnchorB = function () {
      return this.m_bodyB.GetWorldPoint(this.m_localAnchor);
   }
   b2MouseJoint.prototype.GetReactionForce = function (inv_dt) {
      if (inv_dt === undefined) inv_dt = 0;
      return new b2Vec2(inv_dt * this.m_impulse.x, inv_dt * this.m_impulse.y);
   }
   b2MouseJoint.prototype.GetReactionTorque = function (inv_dt) {
      if (inv_dt === undefined) inv_dt = 0;
      return 0.0;
   }
   b2MouseJoint.prototype.GetTarget = function () {
      return this.m_target;
   }
   b2MouseJoint.prototype.SetTarget = function (target) {
      if (this.m_bodyB.IsAwake() == false) {
         this.m_bodyB.SetAwake(true);
      }
      this.m_target = target;
   }
   b2MouseJoint.prototype.GetMaxForce = function () {
      return this.m_maxForce;
   }
   b2MouseJoint.prototype.SetMaxForce = function (maxForce) {
      if (maxForce === undefined) maxForce = 0;
      this.m_maxForce = maxForce;
   }
   b2MouseJoint.prototype.GetFrequency = function () {
      return this.m_frequencyHz;
   }
   b2MouseJoint.prototype.SetFrequency = function (hz) {
      if (hz === undefined) hz = 0;
      this.m_frequencyHz = hz;
   }
   b2MouseJoint.prototype.GetDampingRatio = function () {
      return this.m_dampingRatio;
   }
   b2MouseJoint.prototype.SetDampingRatio = function (ratio) {
      if (ratio === undefined) ratio = 0;
      this.m_dampingRatio = ratio;
   }
   b2MouseJoint.prototype.b2MouseJoint = function (def) {
      this.__super.b2Joint.call(this, def);
      this.m_target.SetV(def.target);
      var tX = this.m_target.x - this.m_bodyB.m_xf.position.x;
      var tY = this.m_target.y - this.m_bodyB.m_xf.position.y;
      var tMat = this.m_bodyB.m_xf.R;
      this.m_localAnchor.x = (tX * tMat.col1.x + tY * tMat.col1.y);
      this.m_localAnchor.y = (tX * tMat.col2.x + tY * tMat.col2.y);
      this.m_maxForce = def.maxForce;
      this.m_impulse.SetZero();
      this.m_frequencyHz = def.frequencyHz;
      this.m_dampingRatio = def.dampingRatio;
      this.m_beta = 0.0;
      this.m_gamma = 0.0;
   }
   b2MouseJoint.prototype.InitVelocityConstraints = function (step) {
      var b = this.m_bodyB;
      var mass = b.GetMass();
      var omega = 2.0 * Math.PI * this.m_frequencyHz;
      var d = 2.0 * mass * this.m_dampingRatio * omega;
      var k = mass * omega * omega;
      this.m_gamma = step.dt * (d + step.dt * k);
      this.m_gamma = this.m_gamma != 0 ? 1 / this.m_gamma : 0.0;
      this.m_beta = step.dt * k * this.m_gamma;
      var tMat;tMat = b.m_xf.R;
      var rX = this.m_localAnchor.x - b.m_sweep.localCenter.x;
      var rY = this.m_localAnchor.y - b.m_sweep.localCenter.y;
      var tX = (tMat.col1.x * rX + tMat.col2.x * rY);rY = (tMat.col1.y * rX + tMat.col2.y * rY);
      rX = tX;
      var invMass = b.m_invMass;
      var invI = b.m_invI;this.K1.col1.x = invMass;
      this.K1.col2.x = 0.0;
      this.K1.col1.y = 0.0;
      this.K1.col2.y = invMass;
      this.K2.col1.x = invI * rY * rY;
      this.K2.col2.x = (-invI * rX * rY);
      this.K2.col1.y = (-invI * rX * rY);
      this.K2.col2.y = invI * rX * rX;
      this.K.SetM(this.K1);
      this.K.AddM(this.K2);
      this.K.col1.x += this.m_gamma;
      this.K.col2.y += this.m_gamma;
      this.K.GetInverse(this.m_mass);
      this.m_C.x = b.m_sweep.c.x + rX - this.m_target.x;
      this.m_C.y = b.m_sweep.c.y + rY - this.m_target.y;
      b.m_angularVelocity *= 0.98;
      this.m_impulse.x *= step.dtRatio;
      this.m_impulse.y *= step.dtRatio;
      b.m_linearVelocity.x += invMass * this.m_impulse.x;
      b.m_linearVelocity.y += invMass * this.m_impulse.y;
      b.m_angularVelocity += invI * (rX * this.m_impulse.y - rY * this.m_impulse.x);
   }
   b2MouseJoint.prototype.SolveVelocityConstraints = function (step) {
      var b = this.m_bodyB;
      var tMat;
      var tX = 0;
      var tY = 0;
      tMat = b.m_xf.R;
      var rX = this.m_localAnchor.x - b.m_sweep.localCenter.x;
      var rY = this.m_localAnchor.y - b.m_sweep.localCenter.y;
      tX = (tMat.col1.x * rX + tMat.col2.x * rY);
      rY = (tMat.col1.y * rX + tMat.col2.y * rY);
      rX = tX;
      var CdotX = b.m_linearVelocity.x + ((-b.m_angularVelocity * rY));
      var CdotY = b.m_linearVelocity.y + (b.m_angularVelocity * rX);
      tMat = this.m_mass;
      tX = CdotX + this.m_beta * this.m_C.x + this.m_gamma * this.m_impulse.x;
      tY = CdotY + this.m_beta * this.m_C.y + this.m_gamma * this.m_impulse.y;
      var impulseX = (-(tMat.col1.x * tX + tMat.col2.x * tY));
      var impulseY = (-(tMat.col1.y * tX + tMat.col2.y * tY));
      var oldImpulseX = this.m_impulse.x;
      var oldImpulseY = this.m_impulse.y;
      this.m_impulse.x += impulseX;
      this.m_impulse.y += impulseY;
      var maxImpulse = step.dt * this.m_maxForce;
      if (this.m_impulse.LengthSquared() > maxImpulse * maxImpulse) {
         this.m_impulse.Multiply(maxImpulse / this.m_impulse.Length());
      }
      impulseX = this.m_impulse.x - oldImpulseX;
      impulseY = this.m_impulse.y - oldImpulseY;
      b.m_linearVelocity.x += b.m_invMass * impulseX;
      b.m_linearVelocity.y += b.m_invMass * impulseY;
      b.m_angularVelocity += b.m_invI * (rX * impulseY - rY * impulseX);
   }
   b2MouseJoint.prototype.SolvePositionConstraints = function (baumgarte) {
      if (baumgarte === undefined) baumgarte = 0;
      return true;
   }
   Box2D.inherit(b2MouseJointDef, Box2D.Dynamics.Joints.b2JointDef);
   b2MouseJointDef.prototype.__super = Box2D.Dynamics.Joints.b2JointDef.prototype;
   b2MouseJointDef.b2MouseJointDef = function () {
      Box2D.Dynamics.Joints.b2JointDef.b2JointDef.apply(this, arguments);
      this.target = new b2Vec2();
   };
   b2MouseJointDef.prototype.b2MouseJointDef = function () {
      this.__super.b2JointDef.call(this);
      this.type = b2Joint.e_mouseJoint;
      this.maxForce = 0.0;
      this.frequencyHz = 5.0;
      this.dampingRatio = 0.7;
   }
   Box2D.inherit(b2PrismaticJoint, Box2D.Dynamics.Joints.b2Joint);
   b2PrismaticJoint.prototype.__super = Box2D.Dynamics.Joints.b2Joint.prototype;
   b2PrismaticJoint.b2PrismaticJoint = function () {
      Box2D.Dynamics.Joints.b2Joint.b2Joint.apply(this, arguments);
      this.m_localAnchor1 = new b2Vec2();
      this.m_localAnchor2 = new b2Vec2();
      this.m_localXAxis1 = new b2Vec2();
      this.m_localYAxis1 = new b2Vec2();
      this.m_axis = new b2Vec2();
      this.m_perp = new b2Vec2();
      this.m_K = new b2Mat33();
      this.m_impulse = new b2Vec3();
   };
   b2PrismaticJoint.prototype.GetAnchorA = function () {
      return this.m_bodyA.GetWorldPoint(this.m_localAnchor1);
   }
   b2PrismaticJoint.prototype.GetAnchorB = function () {
      return this.m_bodyB.GetWorldPoint(this.m_localAnchor2);
   }
   b2PrismaticJoint.prototype.GetReactionForce = function (inv_dt) {
      if (inv_dt === undefined) inv_dt = 0;
      return new b2Vec2(inv_dt * (this.m_impulse.x * this.m_perp.x + (this.m_motorImpulse + this.m_impulse.z) * this.m_axis.x), inv_dt * (this.m_impulse.x * this.m_perp.y + (this.m_motorImpulse + this.m_impulse.z) * this.m_axis.y));
   }
   b2PrismaticJoint.prototype.GetReactionTorque = function (inv_dt) {
      if (inv_dt === undefined) inv_dt = 0;
      return inv_dt * this.m_impulse.y;
   }
   b2PrismaticJoint.prototype.GetJointTranslation = function () {
      var bA = this.m_bodyA;
      var bB = this.m_bodyB;
      var tMat;
      var p1 = bA.GetWorldPoint(this.m_localAnchor1);
      var p2 = bB.GetWorldPoint(this.m_localAnchor2);
      var dX = p2.x - p1.x;
      var dY = p2.y - p1.y;
      var axis = bA.GetWorldVector(this.m_localXAxis1);
      var translation = axis.x * dX + axis.y * dY;
      return translation;
   }
   b2PrismaticJoint.prototype.GetJointSpeed = function () {
      var bA = this.m_bodyA;
      var bB = this.m_bodyB;
      var tMat;
      tMat = bA.m_xf.R;
      var r1X = this.m_localAnchor1.x - bA.m_sweep.localCenter.x;
      var r1Y = this.m_localAnchor1.y - bA.m_sweep.localCenter.y;
      var tX = (tMat.col1.x * r1X + tMat.col2.x * r1Y);
      r1Y = (tMat.col1.y * r1X + tMat.col2.y * r1Y);
      r1X = tX;
      tMat = bB.m_xf.R;
      var r2X = this.m_localAnchor2.x - bB.m_sweep.localCenter.x;
      var r2Y = this.m_localAnchor2.y - bB.m_sweep.localCenter.y;
      tX = (tMat.col1.x * r2X + tMat.col2.x * r2Y);
      r2Y = (tMat.col1.y * r2X + tMat.col2.y * r2Y);
      r2X = tX;
      var p1X = bA.m_sweep.c.x + r1X;
      var p1Y = bA.m_sweep.c.y + r1Y;
      var p2X = bB.m_sweep.c.x + r2X;
      var p2Y = bB.m_sweep.c.y + r2Y;
      var dX = p2X - p1X;
      var dY = p2Y - p1Y;
      var axis = bA.GetWorldVector(this.m_localXAxis1);
      var v1 = bA.m_linearVelocity;
      var v2 = bB.m_linearVelocity;
      var w1 = bA.m_angularVelocity;
      var w2 = bB.m_angularVelocity;
      var speed = (dX * ((-w1 * axis.y)) + dY * (w1 * axis.x)) + (axis.x * (((v2.x + ((-w2 * r2Y))) - v1.x) - ((-w1 * r1Y))) + axis.y * (((v2.y + (w2 * r2X)) - v1.y) - (w1 * r1X)));
      return speed;
   }
   b2PrismaticJoint.prototype.IsLimitEnabled = function () {
      return this.m_enableLimit;
   }
   b2PrismaticJoint.prototype.EnableLimit = function (flag) {
      this.m_bodyA.SetAwake(true);
      this.m_bodyB.SetAwake(true);
      this.m_enableLimit = flag;
   }
   b2PrismaticJoint.prototype.GetLowerLimit = function () {
      return this.m_lowerTranslation;
   }
   b2PrismaticJoint.prototype.GetUpperLimit = function () {
      return this.m_upperTranslation;
   }
   b2PrismaticJoint.prototype.SetLimits = function (lower, upper) {
      if (lower === undefined) lower = 0;
      if (upper === undefined) upper = 0;
      this.m_bodyA.SetAwake(true);
      this.m_bodyB.SetAwake(true);
      this.m_lowerTranslation = lower;
      this.m_upperTranslation = upper;
   }
   b2PrismaticJoint.prototype.IsMotorEnabled = function () {
      return this.m_enableMotor;
   }
   b2PrismaticJoint.prototype.EnableMotor = function (flag) {
      this.m_bodyA.SetAwake(true);
      this.m_bodyB.SetAwake(true);
      this.m_enableMotor = flag;
   }
   b2PrismaticJoint.prototype.SetMotorSpeed = function (speed) {
      if (speed === undefined) speed = 0;
      this.m_bodyA.SetAwake(true);
      this.m_bodyB.SetAwake(true);
      this.m_motorSpeed = speed;
   }
   b2PrismaticJoint.prototype.GetMotorSpeed = function () {
      return this.m_motorSpeed;
   }
   b2PrismaticJoint.prototype.SetMaxMotorForce = function (force) {
      if (force === undefined) force = 0;
      this.m_bodyA.SetAwake(true);
      this.m_bodyB.SetAwake(true);
      this.m_maxMotorForce = force;
   }
   b2PrismaticJoint.prototype.GetMotorForce = function () {
      return this.m_motorImpulse;
   }
   b2PrismaticJoint.prototype.b2PrismaticJoint = function (def) {
      this.__super.b2Joint.call(this, def);
      var tMat;
      var tX = 0;
      var tY = 0;
      this.m_localAnchor1.SetV(def.localAnchorA);
      this.m_localAnchor2.SetV(def.localAnchorB);
      this.m_localXAxis1.SetV(def.localAxisA);
      this.m_localYAxis1.x = (-this.m_localXAxis1.y);
      this.m_localYAxis1.y = this.m_localXAxis1.x;
      this.m_refAngle = def.referenceAngle;
      this.m_impulse.SetZero();
      this.m_motorMass = 0.0;
      this.m_motorImpulse = 0.0;
      this.m_lowerTranslation = def.lowerTranslation;
      this.m_upperTranslation = def.upperTranslation;
      this.m_maxMotorForce = def.maxMotorForce;
      this.m_motorSpeed = def.motorSpeed;
      this.m_enableLimit = def.enableLimit;
      this.m_enableMotor = def.enableMotor;
      this.m_limitState = b2Joint.e_inactiveLimit;
      this.m_axis.SetZero();
      this.m_perp.SetZero();
   }
   b2PrismaticJoint.prototype.InitVelocityConstraints = function (step) {
      var bA = this.m_bodyA;
      var bB = this.m_bodyB;
      var tMat;
      var tX = 0;
      this.m_localCenterA.SetV(bA.GetLocalCenter());
      this.m_localCenterB.SetV(bB.GetLocalCenter());
      var xf1 = bA.GetTransform();
      var xf2 = bB.GetTransform();
      tMat = bA.m_xf.R;
      var r1X = this.m_localAnchor1.x - this.m_localCenterA.x;
      var r1Y = this.m_localAnchor1.y - this.m_localCenterA.y;
      tX = (tMat.col1.x * r1X + tMat.col2.x * r1Y);
      r1Y = (tMat.col1.y * r1X + tMat.col2.y * r1Y);
      r1X = tX;
      tMat = bB.m_xf.R;
      var r2X = this.m_localAnchor2.x - this.m_localCenterB.x;
      var r2Y = this.m_localAnchor2.y - this.m_localCenterB.y;
      tX = (tMat.col1.x * r2X + tMat.col2.x * r2Y);
      r2Y = (tMat.col1.y * r2X + tMat.col2.y * r2Y);
      r2X = tX;
      var dX = bB.m_sweep.c.x + r2X - bA.m_sweep.c.x - r1X;
      var dY = bB.m_sweep.c.y + r2Y - bA.m_sweep.c.y - r1Y;
      this.m_invMassA = bA.m_invMass;
      this.m_invMassB = bB.m_invMass;
      this.m_invIA = bA.m_invI;
      this.m_invIB = bB.m_invI; {
         this.m_axis.SetV(b2Math.MulMV(xf1.R, this.m_localXAxis1));
         this.m_a1 = (dX + r1X) * this.m_axis.y - (dY + r1Y) * this.m_axis.x;
         this.m_a2 = r2X * this.m_axis.y - r2Y * this.m_axis.x;
         this.m_motorMass = this.m_invMassA + this.m_invMassB + this.m_invIA * this.m_a1 * this.m_a1 + this.m_invIB * this.m_a2 * this.m_a2;
         if (this.m_motorMass > Number.MIN_VALUE) this.m_motorMass = 1.0 / this.m_motorMass;
      } {
         this.m_perp.SetV(b2Math.MulMV(xf1.R, this.m_localYAxis1));
         this.m_s1 = (dX + r1X) * this.m_perp.y - (dY + r1Y) * this.m_perp.x;
         this.m_s2 = r2X * this.m_perp.y - r2Y * this.m_perp.x;
         var m1 = this.m_invMassA;
         var m2 = this.m_invMassB;
         var i1 = this.m_invIA;
         var i2 = this.m_invIB;
         this.m_K.col1.x = m1 + m2 + i1 * this.m_s1 * this.m_s1 + i2 * this.m_s2 * this.m_s2;
         this.m_K.col1.y = i1 * this.m_s1 + i2 * this.m_s2;
         this.m_K.col1.z = i1 * this.m_s1 * this.m_a1 + i2 * this.m_s2 * this.m_a2;
         this.m_K.col2.x = this.m_K.col1.y;
         this.m_K.col2.y = i1 + i2;
         this.m_K.col2.z = i1 * this.m_a1 + i2 * this.m_a2;
         this.m_K.col3.x = this.m_K.col1.z;
         this.m_K.col3.y = this.m_K.col2.z;
         this.m_K.col3.z = m1 + m2 + i1 * this.m_a1 * this.m_a1 + i2 * this.m_a2 * this.m_a2;
      }
      if (this.m_enableLimit) {
         var jointTransition = this.m_axis.x * dX + this.m_axis.y * dY;
         if (b2Math.Abs(this.m_upperTranslation - this.m_lowerTranslation) < 2.0 * b2Settings.b2_linearSlop) {
            this.m_limitState = b2Joint.e_equalLimits;
         }
         else if (jointTransition <= this.m_lowerTranslation) {
            if (this.m_limitState != b2Joint.e_atLowerLimit) {
               this.m_limitState = b2Joint.e_atLowerLimit;
               this.m_impulse.z = 0.0;
            }
         }
         else if (jointTransition >= this.m_upperTranslation) {
            if (this.m_limitState != b2Joint.e_atUpperLimit) {
               this.m_limitState = b2Joint.e_atUpperLimit;
               this.m_impulse.z = 0.0;
            }
         }
         else {
            this.m_limitState = b2Joint.e_inactiveLimit;
            this.m_impulse.z = 0.0;
         }
      }
      else {
         this.m_limitState = b2Joint.e_inactiveLimit;
      }
      if (this.m_enableMotor == false) {
         this.m_motorImpulse = 0.0;
      }
      if (step.warmStarting) {
         this.m_impulse.x *= step.dtRatio;
         this.m_impulse.y *= step.dtRatio;
         this.m_motorImpulse *= step.dtRatio;
         var PX = this.m_impulse.x * this.m_perp.x + (this.m_motorImpulse + this.m_impulse.z) * this.m_axis.x;
         var PY = this.m_impulse.x * this.m_perp.y + (this.m_motorImpulse + this.m_impulse.z) * this.m_axis.y;
         var L1 = this.m_impulse.x * this.m_s1 + this.m_impulse.y + (this.m_motorImpulse + this.m_impulse.z) * this.m_a1;
         var L2 = this.m_impulse.x * this.m_s2 + this.m_impulse.y + (this.m_motorImpulse + this.m_impulse.z) * this.m_a2;
         bA.m_linearVelocity.x -= this.m_invMassA * PX;
         bA.m_linearVelocity.y -= this.m_invMassA * PY;
         bA.m_angularVelocity -= this.m_invIA * L1;
         bB.m_linearVelocity.x += this.m_invMassB * PX;
         bB.m_linearVelocity.y += this.m_invMassB * PY;
         bB.m_angularVelocity += this.m_invIB * L2;
      }
      else {
         this.m_impulse.SetZero();
         this.m_motorImpulse = 0.0;
      }
   }
   b2PrismaticJoint.prototype.SolveVelocityConstraints = function (step) {
      var bA = this.m_bodyA;
      var bB = this.m_bodyB;
      var v1 = bA.m_linearVelocity;
      var w1 = bA.m_angularVelocity;
      var v2 = bB.m_linearVelocity;
      var w2 = bB.m_angularVelocity;
      var PX = 0;
      var PY = 0;
      var L1 = 0;
      var L2 = 0;
      if (this.m_enableMotor && this.m_limitState != b2Joint.e_equalLimits) {
         var Cdot = this.m_axis.x * (v2.x - v1.x) + this.m_axis.y * (v2.y - v1.y) + this.m_a2 * w2 - this.m_a1 * w1;
         var impulse = this.m_motorMass * (this.m_motorSpeed - Cdot);
         var oldImpulse = this.m_motorImpulse;
         var maxImpulse = step.dt * this.m_maxMotorForce;
         this.m_motorImpulse = b2Math.Clamp(this.m_motorImpulse + impulse, (-maxImpulse), maxImpulse);
         impulse = this.m_motorImpulse - oldImpulse;
         PX = impulse * this.m_axis.x;
         PY = impulse * this.m_axis.y;
         L1 = impulse * this.m_a1;
         L2 = impulse * this.m_a2;
         v1.x -= this.m_invMassA * PX;
         v1.y -= this.m_invMassA * PY;
         w1 -= this.m_invIA * L1;
         v2.x += this.m_invMassB * PX;
         v2.y += this.m_invMassB * PY;
         w2 += this.m_invIB * L2;
      }
      var Cdot1X = this.m_perp.x * (v2.x - v1.x) + this.m_perp.y * (v2.y - v1.y) + this.m_s2 * w2 - this.m_s1 * w1;
      var Cdot1Y = w2 - w1;
      if (this.m_enableLimit && this.m_limitState != b2Joint.e_inactiveLimit) {
         var Cdot2 = this.m_axis.x * (v2.x - v1.x) + this.m_axis.y * (v2.y - v1.y) + this.m_a2 * w2 - this.m_a1 * w1;
         var f1 = this.m_impulse.Copy();
         var df = this.m_K.Solve33(new b2Vec3(), (-Cdot1X), (-Cdot1Y), (-Cdot2));
         this.m_impulse.Add(df);
         if (this.m_limitState == b2Joint.e_atLowerLimit) {
            this.m_impulse.z = b2Math.Max(this.m_impulse.z, 0.0);
         }
         else if (this.m_limitState == b2Joint.e_atUpperLimit) {
            this.m_impulse.z = b2Math.Min(this.m_impulse.z, 0.0);
         }
         var bX = (-Cdot1X) - (this.m_impulse.z - f1.z) * this.m_K.col3.x;
         var bY = (-Cdot1Y) - (this.m_impulse.z - f1.z) * this.m_K.col3.y;
         var f2r = this.m_K.Solve22(new b2Vec2(), bX, bY);
         f2r.x += f1.x;
         f2r.y += f1.y;
         this.m_impulse.x = f2r.x;
         this.m_impulse.y = f2r.y;
         df.x = this.m_impulse.x - f1.x;
         df.y = this.m_impulse.y - f1.y;
         df.z = this.m_impulse.z - f1.z;
         PX = df.x * this.m_perp.x + df.z * this.m_axis.x;
         PY = df.x * this.m_perp.y + df.z * this.m_axis.y;
         L1 = df.x * this.m_s1 + df.y + df.z * this.m_a1;
         L2 = df.x * this.m_s2 + df.y + df.z * this.m_a2;
         v1.x -= this.m_invMassA * PX;
         v1.y -= this.m_invMassA * PY;
         w1 -= this.m_invIA * L1;
         v2.x += this.m_invMassB * PX;
         v2.y += this.m_invMassB * PY;
         w2 += this.m_invIB * L2;
      }
      else {
         var df2 = this.m_K.Solve22(new b2Vec2(), (-Cdot1X), (-Cdot1Y));
         this.m_impulse.x += df2.x;
         this.m_impulse.y += df2.y;
         PX = df2.x * this.m_perp.x;
         PY = df2.x * this.m_perp.y;
         L1 = df2.x * this.m_s1 + df2.y;
         L2 = df2.x * this.m_s2 + df2.y;
         v1.x -= this.m_invMassA * PX;
         v1.y -= this.m_invMassA * PY;
         w1 -= this.m_invIA * L1;
         v2.x += this.m_invMassB * PX;
         v2.y += this.m_invMassB * PY;
         w2 += this.m_invIB * L2;
      }
      bA.m_linearVelocity.SetV(v1);
      bA.m_angularVelocity = w1;
      bB.m_linearVelocity.SetV(v2);
      bB.m_angularVelocity = w2;
   }
   b2PrismaticJoint.prototype.SolvePositionConstraints = function (baumgarte) {
      if (baumgarte === undefined) baumgarte = 0;
      var limitC = 0;
      var oldLimitImpulse = 0;
      var bA = this.m_bodyA;
      var bB = this.m_bodyB;
      var c1 = bA.m_sweep.c;
      var a1 = bA.m_sweep.a;
      var c2 = bB.m_sweep.c;
      var a2 = bB.m_sweep.a;
      var tMat;
      var tX = 0;
      var m1 = 0;
      var m2 = 0;
      var i1 = 0;
      var i2 = 0;
      var linearError = 0.0;
      var angularError = 0.0;
      var active = false;
      var C2 = 0.0;
      var R1 = b2Mat22.FromAngle(a1);
      var R2 = b2Mat22.FromAngle(a2);
      tMat = R1;
      var r1X = this.m_localAnchor1.x - this.m_localCenterA.x;
      var r1Y = this.m_localAnchor1.y - this.m_localCenterA.y;
      tX = (tMat.col1.x * r1X + tMat.col2.x * r1Y);
      r1Y = (tMat.col1.y * r1X + tMat.col2.y * r1Y);
      r1X = tX;
      tMat = R2;
      var r2X = this.m_localAnchor2.x - this.m_localCenterB.x;
      var r2Y = this.m_localAnchor2.y - this.m_localCenterB.y;
      tX = (tMat.col1.x * r2X + tMat.col2.x * r2Y);
      r2Y = (tMat.col1.y * r2X + tMat.col2.y * r2Y);
      r2X = tX;
      var dX = c2.x + r2X - c1.x - r1X;
      var dY = c2.y + r2Y - c1.y - r1Y;
      if (this.m_enableLimit) {
         this.m_axis = b2Math.MulMV(R1, this.m_localXAxis1);
         this.m_a1 = (dX + r1X) * this.m_axis.y - (dY + r1Y) * this.m_axis.x;
         this.m_a2 = r2X * this.m_axis.y - r2Y * this.m_axis.x;
         var translation = this.m_axis.x * dX + this.m_axis.y * dY;
         if (b2Math.Abs(this.m_upperTranslation - this.m_lowerTranslation) < 2.0 * b2Settings.b2_linearSlop) {
            C2 = b2Math.Clamp(translation, (-b2Settings.b2_maxLinearCorrection), b2Settings.b2_maxLinearCorrection);
            linearError = b2Math.Abs(translation);
            active = true;
         }
         else if (translation <= this.m_lowerTranslation) {
            C2 = b2Math.Clamp(translation - this.m_lowerTranslation + b2Settings.b2_linearSlop, (-b2Settings.b2_maxLinearCorrection), 0.0);
            linearError = this.m_lowerTranslation - translation;
            active = true;
         }
         else if (translation >= this.m_upperTranslation) {
            C2 = b2Math.Clamp(translation - this.m_upperTranslation + b2Settings.b2_linearSlop, 0.0, b2Settings.b2_maxLinearCorrection);
            linearError = translation - this.m_upperTranslation;
            active = true;
         }
      }
      this.m_perp = b2Math.MulMV(R1, this.m_localYAxis1);
      this.m_s1 = (dX + r1X) * this.m_perp.y - (dY + r1Y) * this.m_perp.x;
      this.m_s2 = r2X * this.m_perp.y - r2Y * this.m_perp.x;
      var impulse = new b2Vec3();
      var C1X = this.m_perp.x * dX + this.m_perp.y * dY;
      var C1Y = a2 - a1 - this.m_refAngle;
      linearError = b2Math.Max(linearError, b2Math.Abs(C1X));
      angularError = b2Math.Abs(C1Y);
      if (active) {
         m1 = this.m_invMassA;
         m2 = this.m_invMassB;
         i1 = this.m_invIA;
         i2 = this.m_invIB;
         this.m_K.col1.x = m1 + m2 + i1 * this.m_s1 * this.m_s1 + i2 * this.m_s2 * this.m_s2;
         this.m_K.col1.y = i1 * this.m_s1 + i2 * this.m_s2;
         this.m_K.col1.z = i1 * this.m_s1 * this.m_a1 + i2 * this.m_s2 * this.m_a2;
         this.m_K.col2.x = this.m_K.col1.y;
         this.m_K.col2.y = i1 + i2;
         this.m_K.col2.z = i1 * this.m_a1 + i2 * this.m_a2;
         this.m_K.col3.x = this.m_K.col1.z;
         this.m_K.col3.y = this.m_K.col2.z;
         this.m_K.col3.z = m1 + m2 + i1 * this.m_a1 * this.m_a1 + i2 * this.m_a2 * this.m_a2;
         this.m_K.Solve33(impulse, (-C1X), (-C1Y), (-C2));
      }
      else {
         m1 = this.m_invMassA;
         m2 = this.m_invMassB;
         i1 = this.m_invIA;
         i2 = this.m_invIB;
         var k11 = m1 + m2 + i1 * this.m_s1 * this.m_s1 + i2 * this.m_s2 * this.m_s2;
         var k12 = i1 * this.m_s1 + i2 * this.m_s2;
         var k22 = i1 + i2;
         this.m_K.col1.Set(k11, k12, 0.0);
         this.m_K.col2.Set(k12, k22, 0.0);
         var impulse1 = this.m_K.Solve22(new b2Vec2(), (-C1X), (-C1Y));
         impulse.x = impulse1.x;
         impulse.y = impulse1.y;
         impulse.z = 0.0;
      }
      var PX = impulse.x * this.m_perp.x + impulse.z * this.m_axis.x;
      var PY = impulse.x * this.m_perp.y + impulse.z * this.m_axis.y;
      var L1 = impulse.x * this.m_s1 + impulse.y + impulse.z * this.m_a1;
      var L2 = impulse.x * this.m_s2 + impulse.y + impulse.z * this.m_a2;
      c1.x -= this.m_invMassA * PX;
      c1.y -= this.m_invMassA * PY;
      a1 -= this.m_invIA * L1;
      c2.x += this.m_invMassB * PX;
      c2.y += this.m_invMassB * PY;
      a2 += this.m_invIB * L2;
      bA.m_sweep.a = a1;
      bB.m_sweep.a = a2;
      bA.SynchronizeTransform();
      bB.SynchronizeTransform();
      return linearError <= b2Settings.b2_linearSlop && angularError <= b2Settings.b2_angularSlop;
   }
   Box2D.inherit(b2PrismaticJointDef, Box2D.Dynamics.Joints.b2JointDef);
   b2PrismaticJointDef.prototype.__super = Box2D.Dynamics.Joints.b2JointDef.prototype;
   b2PrismaticJointDef.b2PrismaticJointDef = function () {
      Box2D.Dynamics.Joints.b2JointDef.b2JointDef.apply(this, arguments);
      this.localAnchorA = new b2Vec2();
      this.localAnchorB = new b2Vec2();
      this.localAxisA = new b2Vec2();
   };
   b2PrismaticJointDef.prototype.b2PrismaticJointDef = function () {
      this.__super.b2JointDef.call(this);
      this.type = b2Joint.e_prismaticJoint;
      this.localAxisA.Set(1.0, 0.0);
      this.referenceAngle = 0.0;
      this.enableLimit = false;
      this.lowerTranslation = 0.0;
      this.upperTranslation = 0.0;
      this.enableMotor = false;
      this.maxMotorForce = 0.0;
      this.motorSpeed = 0.0;
   }
   b2PrismaticJointDef.prototype.Initialize = function (bA, bB, anchor, axis) {
      this.bodyA = bA;
      this.bodyB = bB;
      this.localAnchorA = this.bodyA.GetLocalPoint(anchor);
      this.localAnchorB = this.bodyB.GetLocalPoint(anchor);
      this.localAxisA = this.bodyA.GetLocalVector(axis);
      this.referenceAngle = this.bodyB.GetAngle() - this.bodyA.GetAngle();
   }
   Box2D.inherit(b2PulleyJoint, Box2D.Dynamics.Joints.b2Joint);
   b2PulleyJoint.prototype.__super = Box2D.Dynamics.Joints.b2Joint.prototype;
   b2PulleyJoint.b2PulleyJoint = function () {
      Box2D.Dynamics.Joints.b2Joint.b2Joint.apply(this, arguments);
      this.m_groundAnchor1 = new b2Vec2();
      this.m_groundAnchor2 = new b2Vec2();
      this.m_localAnchor1 = new b2Vec2();
      this.m_localAnchor2 = new b2Vec2();
      this.m_u1 = new b2Vec2();
      this.m_u2 = new b2Vec2();
   };
   b2PulleyJoint.prototype.GetAnchorA = function () {
      return this.m_bodyA.GetWorldPoint(this.m_localAnchor1);
   }
   b2PulleyJoint.prototype.GetAnchorB = function () {
      return this.m_bodyB.GetWorldPoint(this.m_localAnchor2);
   }
   b2PulleyJoint.prototype.GetReactionForce = function (inv_dt) {
      if (inv_dt === undefined) inv_dt = 0;
      return new b2Vec2(inv_dt * this.m_impulse * this.m_u2.x, inv_dt * this.m_impulse * this.m_u2.y);
   }
   b2PulleyJoint.prototype.GetReactionTorque = function (inv_dt) {
      if (inv_dt === undefined) inv_dt = 0;
      return 0.0;
   }
   b2PulleyJoint.prototype.GetGroundAnchorA = function () {
      var a = this.m_ground.m_xf.position.Copy();
      a.Add(this.m_groundAnchor1);
      return a;
   }
   b2PulleyJoint.prototype.GetGroundAnchorB = function () {
      var a = this.m_ground.m_xf.position.Copy();
      a.Add(this.m_groundAnchor2);
      return a;
   }
   b2PulleyJoint.prototype.GetLength1 = function () {
      var p = this.m_bodyA.GetWorldPoint(this.m_localAnchor1);
      var sX = this.m_ground.m_xf.position.x + this.m_groundAnchor1.x;
      var sY = this.m_ground.m_xf.position.y + this.m_groundAnchor1.y;
      var dX = p.x - sX;
      var dY = p.y - sY;
      return Math.sqrt(dX * dX + dY * dY);
   }
   b2PulleyJoint.prototype.GetLength2 = function () {
      var p = this.m_bodyB.GetWorldPoint(this.m_localAnchor2);
      var sX = this.m_ground.m_xf.position.x + this.m_groundAnchor2.x;
      var sY = this.m_ground.m_xf.position.y + this.m_groundAnchor2.y;
      var dX = p.x - sX;
      var dY = p.y - sY;
      return Math.sqrt(dX * dX + dY * dY);
   }
   b2PulleyJoint.prototype.GetRatio = function () {
      return this.m_ratio;
   }
   b2PulleyJoint.prototype.b2PulleyJoint = function (def) {
      this.__super.b2Joint.call(this, def);
      var tMat;
      var tX = 0;
      var tY = 0;
      this.m_ground = this.m_bodyA.m_world.m_groundBody;
      this.m_groundAnchor1.x = def.groundAnchorA.x - this.m_ground.m_xf.position.x;
      this.m_groundAnchor1.y = def.groundAnchorA.y - this.m_ground.m_xf.position.y;
      this.m_groundAnchor2.x = def.groundAnchorB.x - this.m_ground.m_xf.position.x;
      this.m_groundAnchor2.y = def.groundAnchorB.y - this.m_ground.m_xf.position.y;
      this.m_localAnchor1.SetV(def.localAnchorA);
      this.m_localAnchor2.SetV(def.localAnchorB);
      this.m_ratio = def.ratio;
      this.m_constant = def.lengthA + this.m_ratio * def.lengthB;
      this.m_maxLength1 = b2Math.Min(def.maxLengthA, this.m_constant - this.m_ratio * b2PulleyJoint.b2_minPulleyLength);
      this.m_maxLength2 = b2Math.Min(def.maxLengthB, (this.m_constant - b2PulleyJoint.b2_minPulleyLength) / this.m_ratio);
      this.m_impulse = 0.0;
      this.m_limitImpulse1 = 0.0;
      this.m_limitImpulse2 = 0.0;
   }
   b2PulleyJoint.prototype.InitVelocityConstraints = function (step) {
      var bA = this.m_bodyA;
      var bB = this.m_bodyB;
      var tMat;
      tMat = bA.m_xf.R;
      var r1X = this.m_localAnchor1.x - bA.m_sweep.localCenter.x;
      var r1Y = this.m_localAnchor1.y - bA.m_sweep.localCenter.y;
      var tX = (tMat.col1.x * r1X + tMat.col2.x * r1Y);
      r1Y = (tMat.col1.y * r1X + tMat.col2.y * r1Y);
      r1X = tX;
      tMat = bB.m_xf.R;
      var r2X = this.m_localAnchor2.x - bB.m_sweep.localCenter.x;
      var r2Y = this.m_localAnchor2.y - bB.m_sweep.localCenter.y;
      tX = (tMat.col1.x * r2X + tMat.col2.x * r2Y);
      r2Y = (tMat.col1.y * r2X + tMat.col2.y * r2Y);
      r2X = tX;
      var p1X = bA.m_sweep.c.x + r1X;
      var p1Y = bA.m_sweep.c.y + r1Y;
      var p2X = bB.m_sweep.c.x + r2X;
      var p2Y = bB.m_sweep.c.y + r2Y;
      var s1X = this.m_ground.m_xf.position.x + this.m_groundAnchor1.x;
      var s1Y = this.m_ground.m_xf.position.y + this.m_groundAnchor1.y;
      var s2X = this.m_ground.m_xf.position.x + this.m_groundAnchor2.x;
      var s2Y = this.m_ground.m_xf.position.y + this.m_groundAnchor2.y;
      this.m_u1.Set(p1X - s1X, p1Y - s1Y);
      this.m_u2.Set(p2X - s2X, p2Y - s2Y);
      var length1 = this.m_u1.Length();
      var length2 = this.m_u2.Length();
      if (length1 > b2Settings.b2_linearSlop) {
         this.m_u1.Multiply(1.0 / length1);
      }
      else {
         this.m_u1.SetZero();
      }
      if (length2 > b2Settings.b2_linearSlop) {
         this.m_u2.Multiply(1.0 / length2);
      }
      else {
         this.m_u2.SetZero();
      }
      var C = this.m_constant - length1 - this.m_ratio * length2;
      if (C > 0.0) {
         this.m_state = b2Joint.e_inactiveLimit;
         this.m_impulse = 0.0;
      }
      else {
         this.m_state = b2Joint.e_atUpperLimit;
      }
      if (length1 < this.m_maxLength1) {
         this.m_limitState1 = b2Joint.e_inactiveLimit;
         this.m_limitImpulse1 = 0.0;
      }
      else {
         this.m_limitState1 = b2Joint.e_atUpperLimit;
      }
      if (length2 < this.m_maxLength2) {
         this.m_limitState2 = b2Joint.e_inactiveLimit;
         this.m_limitImpulse2 = 0.0;
      }
      else {
         this.m_limitState2 = b2Joint.e_atUpperLimit;
      }
      var cr1u1 = r1X * this.m_u1.y - r1Y * this.m_u1.x;
      var cr2u2 = r2X * this.m_u2.y - r2Y * this.m_u2.x;
      this.m_limitMass1 = bA.m_invMass + bA.m_invI * cr1u1 * cr1u1;
      this.m_limitMass2 = bB.m_invMass + bB.m_invI * cr2u2 * cr2u2;
      this.m_pulleyMass = this.m_limitMass1 + this.m_ratio * this.m_ratio * this.m_limitMass2;
      this.m_limitMass1 = 1.0 / this.m_limitMass1;
      this.m_limitMass2 = 1.0 / this.m_limitMass2;
      this.m_pulleyMass = 1.0 / this.m_pulleyMass;
      if (step.warmStarting) {
         this.m_impulse *= step.dtRatio;
         this.m_limitImpulse1 *= step.dtRatio;
         this.m_limitImpulse2 *= step.dtRatio;
         var P1X = ((-this.m_impulse) - this.m_limitImpulse1) * this.m_u1.x;
         var P1Y = ((-this.m_impulse) - this.m_limitImpulse1) * this.m_u1.y;
         var P2X = ((-this.m_ratio * this.m_impulse) - this.m_limitImpulse2) * this.m_u2.x;
         var P2Y = ((-this.m_ratio * this.m_impulse) - this.m_limitImpulse2) * this.m_u2.y;
         bA.m_linearVelocity.x += bA.m_invMass * P1X;
         bA.m_linearVelocity.y += bA.m_invMass * P1Y;
         bA.m_angularVelocity += bA.m_invI * (r1X * P1Y - r1Y * P1X);
         bB.m_linearVelocity.x += bB.m_invMass * P2X;
         bB.m_linearVelocity.y += bB.m_invMass * P2Y;
         bB.m_angularVelocity += bB.m_invI * (r2X * P2Y - r2Y * P2X);
      }
      else {
         this.m_impulse = 0.0;
         this.m_limitImpulse1 = 0.0;
         this.m_limitImpulse2 = 0.0;
      }
   }
   b2PulleyJoint.prototype.SolveVelocityConstraints = function (step) {
      var bA = this.m_bodyA;
      var bB = this.m_bodyB;
      var tMat;
      tMat = bA.m_xf.R;
      var r1X = this.m_localAnchor1.x - bA.m_sweep.localCenter.x;
      var r1Y = this.m_localAnchor1.y - bA.m_sweep.localCenter.y;
      var tX = (tMat.col1.x * r1X + tMat.col2.x * r1Y);
      r1Y = (tMat.col1.y * r1X + tMat.col2.y * r1Y);
      r1X = tX;
      tMat = bB.m_xf.R;
      var r2X = this.m_localAnchor2.x - bB.m_sweep.localCenter.x;
      var r2Y = this.m_localAnchor2.y - bB.m_sweep.localCenter.y;
      tX = (tMat.col1.x * r2X + tMat.col2.x * r2Y);
      r2Y = (tMat.col1.y * r2X + tMat.col2.y * r2Y);
      r2X = tX;
      var v1X = 0;
      var v1Y = 0;
      var v2X = 0;
      var v2Y = 0;
      var P1X = 0;
      var P1Y = 0;
      var P2X = 0;
      var P2Y = 0;
      var Cdot = 0;
      var impulse = 0;
      var oldImpulse = 0;
      if (this.m_state == b2Joint.e_atUpperLimit) {
         v1X = bA.m_linearVelocity.x + ((-bA.m_angularVelocity * r1Y));
         v1Y = bA.m_linearVelocity.y + (bA.m_angularVelocity * r1X);
         v2X = bB.m_linearVelocity.x + ((-bB.m_angularVelocity * r2Y));
         v2Y = bB.m_linearVelocity.y + (bB.m_angularVelocity * r2X);
         Cdot = (-(this.m_u1.x * v1X + this.m_u1.y * v1Y)) - this.m_ratio * (this.m_u2.x * v2X + this.m_u2.y * v2Y);
         impulse = this.m_pulleyMass * ((-Cdot));
         oldImpulse = this.m_impulse;
         this.m_impulse = b2Math.Max(0.0, this.m_impulse + impulse);
         impulse = this.m_impulse - oldImpulse;
         P1X = (-impulse * this.m_u1.x);
         P1Y = (-impulse * this.m_u1.y);
         P2X = (-this.m_ratio * impulse * this.m_u2.x);
         P2Y = (-this.m_ratio * impulse * this.m_u2.y);
         bA.m_linearVelocity.x += bA.m_invMass * P1X;
         bA.m_linearVelocity.y += bA.m_invMass * P1Y;
         bA.m_angularVelocity += bA.m_invI * (r1X * P1Y - r1Y * P1X);
         bB.m_linearVelocity.x += bB.m_invMass * P2X;
         bB.m_linearVelocity.y += bB.m_invMass * P2Y;
         bB.m_angularVelocity += bB.m_invI * (r2X * P2Y - r2Y * P2X);
      }
      if (this.m_limitState1 == b2Joint.e_atUpperLimit) {
         v1X = bA.m_linearVelocity.x + ((-bA.m_angularVelocity * r1Y));
         v1Y = bA.m_linearVelocity.y + (bA.m_angularVelocity * r1X);
         Cdot = (-(this.m_u1.x * v1X + this.m_u1.y * v1Y));
         impulse = (-this.m_limitMass1 * Cdot);
         oldImpulse = this.m_limitImpulse1;
         this.m_limitImpulse1 = b2Math.Max(0.0, this.m_limitImpulse1 + impulse);
         impulse = this.m_limitImpulse1 - oldImpulse;
         P1X = (-impulse * this.m_u1.x);
         P1Y = (-impulse * this.m_u1.y);
         bA.m_linearVelocity.x += bA.m_invMass * P1X;
         bA.m_linearVelocity.y += bA.m_invMass * P1Y;
         bA.m_angularVelocity += bA.m_invI * (r1X * P1Y - r1Y * P1X);
      }
      if (this.m_limitState2 == b2Joint.e_atUpperLimit) {
         v2X = bB.m_linearVelocity.x + ((-bB.m_angularVelocity * r2Y));
         v2Y = bB.m_linearVelocity.y + (bB.m_angularVelocity * r2X);
         Cdot = (-(this.m_u2.x * v2X + this.m_u2.y * v2Y));
         impulse = (-this.m_limitMass2 * Cdot);
         oldImpulse = this.m_limitImpulse2;
         this.m_limitImpulse2 = b2Math.Max(0.0, this.m_limitImpulse2 + impulse);
         impulse = this.m_limitImpulse2 - oldImpulse;
         P2X = (-impulse * this.m_u2.x);
         P2Y = (-impulse * this.m_u2.y);
         bB.m_linearVelocity.x += bB.m_invMass * P2X;
         bB.m_linearVelocity.y += bB.m_invMass * P2Y;
         bB.m_angularVelocity += bB.m_invI * (r2X * P2Y - r2Y * P2X);
      }
   }
   b2PulleyJoint.prototype.SolvePositionConstraints = function (baumgarte) {
      if (baumgarte === undefined) baumgarte = 0;
      var bA = this.m_bodyA;
      var bB = this.m_bodyB;
      var tMat;
      var s1X = this.m_ground.m_xf.position.x + this.m_groundAnchor1.x;
      var s1Y = this.m_ground.m_xf.position.y + this.m_groundAnchor1.y;
      var s2X = this.m_ground.m_xf.position.x + this.m_groundAnchor2.x;
      var s2Y = this.m_ground.m_xf.position.y + this.m_groundAnchor2.y;
      var r1X = 0;
      var r1Y = 0;
      var r2X = 0;
      var r2Y = 0;
      var p1X = 0;
      var p1Y = 0;
      var p2X = 0;
      var p2Y = 0;
      var length1 = 0;
      var length2 = 0;
      var C = 0;
      var impulse = 0;
      var oldImpulse = 0;
      var oldLimitPositionImpulse = 0;
      var tX = 0;
      var linearError = 0.0;
      if (this.m_state == b2Joint.e_atUpperLimit) {
         tMat = bA.m_xf.R;
         r1X = this.m_localAnchor1.x - bA.m_sweep.localCenter.x;
         r1Y = this.m_localAnchor1.y - bA.m_sweep.localCenter.y;
         tX = (tMat.col1.x * r1X + tMat.col2.x * r1Y);
         r1Y = (tMat.col1.y * r1X + tMat.col2.y * r1Y);
         r1X = tX;
         tMat = bB.m_xf.R;
         r2X = this.m_localAnchor2.x - bB.m_sweep.localCenter.x;
         r2Y = this.m_localAnchor2.y - bB.m_sweep.localCenter.y;
         tX = (tMat.col1.x * r2X + tMat.col2.x * r2Y);
         r2Y = (tMat.col1.y * r2X + tMat.col2.y * r2Y);
         r2X = tX;
         p1X = bA.m_sweep.c.x + r1X;
         p1Y = bA.m_sweep.c.y + r1Y;
         p2X = bB.m_sweep.c.x + r2X;
         p2Y = bB.m_sweep.c.y + r2Y;
         this.m_u1.Set(p1X - s1X, p1Y - s1Y);
         this.m_u2.Set(p2X - s2X, p2Y - s2Y);
         length1 = this.m_u1.Length();
         length2 = this.m_u2.Length();
         if (length1 > b2Settings.b2_linearSlop) {
            this.m_u1.Multiply(1.0 / length1);
         }
         else {
            this.m_u1.SetZero();
         }
         if (length2 > b2Settings.b2_linearSlop) {
            this.m_u2.Multiply(1.0 / length2);
         }
         else {
            this.m_u2.SetZero();
         }
         C = this.m_constant - length1 - this.m_ratio * length2;
         linearError = b2Math.Max(linearError, (-C));
         C = b2Math.Clamp(C + b2Settings.b2_linearSlop, (-b2Settings.b2_maxLinearCorrection), 0.0);
         impulse = (-this.m_pulleyMass * C);
         p1X = (-impulse * this.m_u1.x);
         p1Y = (-impulse * this.m_u1.y);
         p2X = (-this.m_ratio * impulse * this.m_u2.x);
         p2Y = (-this.m_ratio * impulse * this.m_u2.y);
         bA.m_sweep.c.x += bA.m_invMass * p1X;
         bA.m_sweep.c.y += bA.m_invMass * p1Y;
         bA.m_sweep.a += bA.m_invI * (r1X * p1Y - r1Y * p1X);
         bB.m_sweep.c.x += bB.m_invMass * p2X;
         bB.m_sweep.c.y += bB.m_invMass * p2Y;
         bB.m_sweep.a += bB.m_invI * (r2X * p2Y - r2Y * p2X);
         bA.SynchronizeTransform();
         bB.SynchronizeTransform();
      }
      if (this.m_limitState1 == b2Joint.e_atUpperLimit) {
         tMat = bA.m_xf.R;
         r1X = this.m_localAnchor1.x - bA.m_sweep.localCenter.x;
         r1Y = this.m_localAnchor1.y - bA.m_sweep.localCenter.y;
         tX = (tMat.col1.x * r1X + tMat.col2.x * r1Y);
         r1Y = (tMat.col1.y * r1X + tMat.col2.y * r1Y);
         r1X = tX;
         p1X = bA.m_sweep.c.x + r1X;
         p1Y = bA.m_sweep.c.y + r1Y;
         this.m_u1.Set(p1X - s1X, p1Y - s1Y);
         length1 = this.m_u1.Length();
         if (length1 > b2Settings.b2_linearSlop) {
            this.m_u1.x *= 1.0 / length1;
            this.m_u1.y *= 1.0 / length1;
         }
         else {
            this.m_u1.SetZero();
         }
         C = this.m_maxLength1 - length1;
         linearError = b2Math.Max(linearError, (-C));
         C = b2Math.Clamp(C + b2Settings.b2_linearSlop, (-b2Settings.b2_maxLinearCorrection), 0.0);
         impulse = (-this.m_limitMass1 * C);
         p1X = (-impulse * this.m_u1.x);
         p1Y = (-impulse * this.m_u1.y);
         bA.m_sweep.c.x += bA.m_invMass * p1X;
         bA.m_sweep.c.y += bA.m_invMass * p1Y;
         bA.m_sweep.a += bA.m_invI * (r1X * p1Y - r1Y * p1X);
         bA.SynchronizeTransform();
      }
      if (this.m_limitState2 == b2Joint.e_atUpperLimit) {
         tMat = bB.m_xf.R;
         r2X = this.m_localAnchor2.x - bB.m_sweep.localCenter.x;
         r2Y = this.m_localAnchor2.y - bB.m_sweep.localCenter.y;
         tX = (tMat.col1.x * r2X + tMat.col2.x * r2Y);
         r2Y = (tMat.col1.y * r2X + tMat.col2.y * r2Y);
         r2X = tX;
         p2X = bB.m_sweep.c.x + r2X;
         p2Y = bB.m_sweep.c.y + r2Y;
         this.m_u2.Set(p2X - s2X, p2Y - s2Y);
         length2 = this.m_u2.Length();
         if (length2 > b2Settings.b2_linearSlop) {
            this.m_u2.x *= 1.0 / length2;
            this.m_u2.y *= 1.0 / length2;
         }
         else {
            this.m_u2.SetZero();
         }
         C = this.m_maxLength2 - length2;
         linearError = b2Math.Max(linearError, (-C));
         C = b2Math.Clamp(C + b2Settings.b2_linearSlop, (-b2Settings.b2_maxLinearCorrection), 0.0);
         impulse = (-this.m_limitMass2 * C);
         p2X = (-impulse * this.m_u2.x);
         p2Y = (-impulse * this.m_u2.y);
         bB.m_sweep.c.x += bB.m_invMass * p2X;
         bB.m_sweep.c.y += bB.m_invMass * p2Y;
         bB.m_sweep.a += bB.m_invI * (r2X * p2Y - r2Y * p2X);
         bB.SynchronizeTransform();
      }
      return linearError < b2Settings.b2_linearSlop;
   }
   Box2D.postDefs.push(function () {
      Box2D.Dynamics.Joints.b2PulleyJoint.b2_minPulleyLength = 2.0;
   });
   Box2D.inherit(b2PulleyJointDef, Box2D.Dynamics.Joints.b2JointDef);
   b2PulleyJointDef.prototype.__super = Box2D.Dynamics.Joints.b2JointDef.prototype;
   b2PulleyJointDef.b2PulleyJointDef = function () {
      Box2D.Dynamics.Joints.b2JointDef.b2JointDef.apply(this, arguments);
      this.groundAnchorA = new b2Vec2();
      this.groundAnchorB = new b2Vec2();
      this.localAnchorA = new b2Vec2();
      this.localAnchorB = new b2Vec2();
   };
   b2PulleyJointDef.prototype.b2PulleyJointDef = function () {
      this.__super.b2JointDef.call(this);
      this.type = b2Joint.e_pulleyJoint;
      this.groundAnchorA.Set((-1.0), 1.0);
      this.groundAnchorB.Set(1.0, 1.0);
      this.localAnchorA.Set((-1.0), 0.0);
      this.localAnchorB.Set(1.0, 0.0);
      this.lengthA = 0.0;
      this.maxLengthA = 0.0;
      this.lengthB = 0.0;
      this.maxLengthB = 0.0;
      this.ratio = 1.0;
      this.collideConnected = true;
   }
   b2PulleyJointDef.prototype.Initialize = function (bA, bB, gaA, gaB, anchorA, anchorB, r) {
      if (r === undefined) r = 0;
      this.bodyA = bA;
      this.bodyB = bB;
      this.groundAnchorA.SetV(gaA);
      this.groundAnchorB.SetV(gaB);
      this.localAnchorA = this.bodyA.GetLocalPoint(anchorA);
      this.localAnchorB = this.bodyB.GetLocalPoint(anchorB);
      var d1X = anchorA.x - gaA.x;
      var d1Y = anchorA.y - gaA.y;
      this.lengthA = Math.sqrt(d1X * d1X + d1Y * d1Y);
      var d2X = anchorB.x - gaB.x;
      var d2Y = anchorB.y - gaB.y;
      this.lengthB = Math.sqrt(d2X * d2X + d2Y * d2Y);
      this.ratio = r;
      var C = this.lengthA + this.ratio * this.lengthB;
      this.maxLengthA = C - this.ratio * b2PulleyJoint.b2_minPulleyLength;
      this.maxLengthB = (C - b2PulleyJoint.b2_minPulleyLength) / this.ratio;
   }
   Box2D.inherit(b2RevoluteJoint, Box2D.Dynamics.Joints.b2Joint);
   b2RevoluteJoint.prototype.__super = Box2D.Dynamics.Joints.b2Joint.prototype;
   b2RevoluteJoint.b2RevoluteJoint = function () {
      Box2D.Dynamics.Joints.b2Joint.b2Joint.apply(this, arguments);
      this.K = new b2Mat22();
      this.K1 = new b2Mat22();
      this.K2 = new b2Mat22();
      this.K3 = new b2Mat22();
      this.impulse3 = new b2Vec3();
      this.impulse2 = new b2Vec2();
      this.reduced = new b2Vec2();
      this.m_localAnchor1 = new b2Vec2();
      this.m_localAnchor2 = new b2Vec2();
      this.m_impulse = new b2Vec3();
      this.m_mass = new b2Mat33();
   };
   b2RevoluteJoint.prototype.GetAnchorA = function () {
      return this.m_bodyA.GetWorldPoint(this.m_localAnchor1);
   }
   b2RevoluteJoint.prototype.GetAnchorB = function () {
      return this.m_bodyB.GetWorldPoint(this.m_localAnchor2);
   }
   b2RevoluteJoint.prototype.GetReactionForce = function (inv_dt) {
      if (inv_dt === undefined) inv_dt = 0;
      return new b2Vec2(inv_dt * this.m_impulse.x, inv_dt * this.m_impulse.y);
   }
   b2RevoluteJoint.prototype.GetReactionTorque = function (inv_dt) {
      if (inv_dt === undefined) inv_dt = 0;
      return inv_dt * this.m_impulse.z;
   }
   b2RevoluteJoint.prototype.GetJointAngle = function () {
      return this.m_bodyB.m_sweep.a - this.m_bodyA.m_sweep.a - this.m_referenceAngle;
   }
   b2RevoluteJoint.prototype.GetJointSpeed = function () {
      return this.m_bodyB.m_angularVelocity - this.m_bodyA.m_angularVelocity;
   }
   b2RevoluteJoint.prototype.IsLimitEnabled = function () {
      return this.m_enableLimit;
   }
   b2RevoluteJoint.prototype.EnableLimit = function (flag) {
      this.m_enableLimit = flag;
   }
   b2RevoluteJoint.prototype.GetLowerLimit = function () {
      return this.m_lowerAngle;
   }
   b2RevoluteJoint.prototype.GetUpperLimit = function () {
      return this.m_upperAngle;
   }
   b2RevoluteJoint.prototype.SetLimits = function (lower, upper) {
      if (lower === undefined) lower = 0;
      if (upper === undefined) upper = 0;
      this.m_lowerAngle = lower;
      this.m_upperAngle = upper;
   }
   b2RevoluteJoint.prototype.IsMotorEnabled = function () {
      this.m_bodyA.SetAwake(true);
      this.m_bodyB.SetAwake(true);
      return this.m_enableMotor;
   }
   b2RevoluteJoint.prototype.EnableMotor = function (flag) {
      this.m_enableMotor = flag;
   }
   b2RevoluteJoint.prototype.SetMotorSpeed = function (speed) {
      if (speed === undefined) speed = 0;
      this.m_bodyA.SetAwake(true);
      this.m_bodyB.SetAwake(true);
      this.m_motorSpeed = speed;
   }
   b2RevoluteJoint.prototype.GetMotorSpeed = function () {
      return this.m_motorSpeed;
   }
   b2RevoluteJoint.prototype.SetMaxMotorTorque = function (torque) {
      if (torque === undefined) torque = 0;
      this.m_maxMotorTorque = torque;
   }
   b2RevoluteJoint.prototype.GetMotorTorque = function () {
      return this.m_maxMotorTorque;
   }
   b2RevoluteJoint.prototype.b2RevoluteJoint = function (def) {
      this.__super.b2Joint.call(this, def);
      this.m_localAnchor1.SetV(def.localAnchorA);
      this.m_localAnchor2.SetV(def.localAnchorB);
      this.m_referenceAngle = def.referenceAngle;
      this.m_impulse.SetZero();
      this.m_motorImpulse = 0.0;
      this.m_lowerAngle = def.lowerAngle;
      this.m_upperAngle = def.upperAngle;
      this.m_maxMotorTorque = def.maxMotorTorque;
      this.m_motorSpeed = def.motorSpeed;
      this.m_enableLimit = def.enableLimit;
      this.m_enableMotor = def.enableMotor;
      this.m_limitState = b2Joint.e_inactiveLimit;
   }
   b2RevoluteJoint.prototype.InitVelocityConstraints = function (step) {
      var bA = this.m_bodyA;
      var bB = this.m_bodyB;
      var tMat;
      var tX = 0;
      if (this.m_enableMotor || this.m_enableLimit) {}
      tMat = bA.m_xf.R;
      var r1X = this.m_localAnchor1.x - bA.m_sweep.localCenter.x;
      var r1Y = this.m_localAnchor1.y - bA.m_sweep.localCenter.y;
      tX = (tMat.col1.x * r1X + tMat.col2.x * r1Y);
      r1Y = (tMat.col1.y * r1X + tMat.col2.y * r1Y);
      r1X = tX;
      tMat = bB.m_xf.R;
      var r2X = this.m_localAnchor2.x - bB.m_sweep.localCenter.x;
      var r2Y = this.m_localAnchor2.y - bB.m_sweep.localCenter.y;
      tX = (tMat.col1.x * r2X + tMat.col2.x * r2Y);
      r2Y = (tMat.col1.y * r2X + tMat.col2.y * r2Y);
      r2X = tX;
      var m1 = bA.m_invMass;
      var m2 = bB.m_invMass;
      var i1 = bA.m_invI;
      var i2 = bB.m_invI;
      this.m_mass.col1.x = m1 + m2 + r1Y * r1Y * i1 + r2Y * r2Y * i2;
      this.m_mass.col2.x = (-r1Y * r1X * i1) - r2Y * r2X * i2;
      this.m_mass.col3.x = (-r1Y * i1) - r2Y * i2;
      this.m_mass.col1.y = this.m_mass.col2.x;
      this.m_mass.col2.y = m1 + m2 + r1X * r1X * i1 + r2X * r2X * i2;
      this.m_mass.col3.y = r1X * i1 + r2X * i2;
      this.m_mass.col1.z = this.m_mass.col3.x;
      this.m_mass.col2.z = this.m_mass.col3.y;
      this.m_mass.col3.z = i1 + i2;
      this.m_motorMass = 1.0 / (i1 + i2);
      if (this.m_enableMotor == false) {
         this.m_motorImpulse = 0.0;
      }
      if (this.m_enableLimit) {
         var jointAngle = bB.m_sweep.a - bA.m_sweep.a - this.m_referenceAngle;
         if (b2Math.Abs(this.m_upperAngle - this.m_lowerAngle) < 2.0 * b2Settings.b2_angularSlop) {
            this.m_limitState = b2Joint.e_equalLimits;
         }
         else if (jointAngle <= this.m_lowerAngle) {
            if (this.m_limitState != b2Joint.e_atLowerLimit) {
               this.m_impulse.z = 0.0;
            }
            this.m_limitState = b2Joint.e_atLowerLimit;
         }
         else if (jointAngle >= this.m_upperAngle) {
            if (this.m_limitState != b2Joint.e_atUpperLimit) {
               this.m_impulse.z = 0.0;
            }
            this.m_limitState = b2Joint.e_atUpperLimit;
         }
         else {
            this.m_limitState = b2Joint.e_inactiveLimit;
            this.m_impulse.z = 0.0;
         }
      }
      else {
         this.m_limitState = b2Joint.e_inactiveLimit;
      }
      if (step.warmStarting) {
         this.m_impulse.x *= step.dtRatio;
         this.m_impulse.y *= step.dtRatio;
         this.m_motorImpulse *= step.dtRatio;
         var PX = this.m_impulse.x;
         var PY = this.m_impulse.y;
         bA.m_linearVelocity.x -= m1 * PX;
         bA.m_linearVelocity.y -= m1 * PY;
         bA.m_angularVelocity -= i1 * ((r1X * PY - r1Y * PX) + this.m_motorImpulse + this.m_impulse.z);
         bB.m_linearVelocity.x += m2 * PX;
         bB.m_linearVelocity.y += m2 * PY;
         bB.m_angularVelocity += i2 * ((r2X * PY - r2Y * PX) + this.m_motorImpulse + this.m_impulse.z);
      }
      else {
         this.m_impulse.SetZero();
         this.m_motorImpulse = 0.0;
      }
   }
   b2RevoluteJoint.prototype.SolveVelocityConstraints = function (step) {
      var bA = this.m_bodyA;
      var bB = this.m_bodyB;
      var tMat;
      var tX = 0;
      var newImpulse = 0;
      var r1X = 0;
      var r1Y = 0;
      var r2X = 0;
      var r2Y = 0;
      var v1 = bA.m_linearVelocity;
      var w1 = bA.m_angularVelocity;
      var v2 = bB.m_linearVelocity;
      var w2 = bB.m_angularVelocity;
      var m1 = bA.m_invMass;
      var m2 = bB.m_invMass;
      var i1 = bA.m_invI;
      var i2 = bB.m_invI;
      if (this.m_enableMotor && this.m_limitState != b2Joint.e_equalLimits) {
         var Cdot = w2 - w1 - this.m_motorSpeed;
         var impulse = this.m_motorMass * ((-Cdot));
         var oldImpulse = this.m_motorImpulse;
         var maxImpulse = step.dt * this.m_maxMotorTorque;
         this.m_motorImpulse = b2Math.Clamp(this.m_motorImpulse + impulse, (-maxImpulse), maxImpulse);
         impulse = this.m_motorImpulse - oldImpulse;
         w1 -= i1 * impulse;
         w2 += i2 * impulse;
      }
      if (this.m_enableLimit && this.m_limitState != b2Joint.e_inactiveLimit) {
         tMat = bA.m_xf.R;
         r1X = this.m_localAnchor1.x - bA.m_sweep.localCenter.x;
         r1Y = this.m_localAnchor1.y - bA.m_sweep.localCenter.y;
         tX = (tMat.col1.x * r1X + tMat.col2.x * r1Y);
         r1Y = (tMat.col1.y * r1X + tMat.col2.y * r1Y);
         r1X = tX;
         tMat = bB.m_xf.R;
         r2X = this.m_localAnchor2.x - bB.m_sweep.localCenter.x;
         r2Y = this.m_localAnchor2.y - bB.m_sweep.localCenter.y;
         tX = (tMat.col1.x * r2X + tMat.col2.x * r2Y);
         r2Y = (tMat.col1.y * r2X + tMat.col2.y * r2Y);
         r2X = tX;
         var Cdot1X = v2.x + ((-w2 * r2Y)) - v1.x - ((-w1 * r1Y));
         var Cdot1Y = v2.y + (w2 * r2X) - v1.y - (w1 * r1X);
         var Cdot2 = w2 - w1;
         this.m_mass.Solve33(this.impulse3, (-Cdot1X), (-Cdot1Y), (-Cdot2));
         if (this.m_limitState == b2Joint.e_equalLimits) {
            this.m_impulse.Add(this.impulse3);
         }
         else if (this.m_limitState == b2Joint.e_atLowerLimit) {
            newImpulse = this.m_impulse.z + this.impulse3.z;
            if (newImpulse < 0.0) {
               this.m_mass.Solve22(this.reduced, (-Cdot1X), (-Cdot1Y));
               this.impulse3.x = this.reduced.x;
               this.impulse3.y = this.reduced.y;
               this.impulse3.z = (-this.m_impulse.z);
               this.m_impulse.x += this.reduced.x;
               this.m_impulse.y += this.reduced.y;
               this.m_impulse.z = 0.0;
            }
         }
         else if (this.m_limitState == b2Joint.e_atUpperLimit) {
            newImpulse = this.m_impulse.z + this.impulse3.z;
            if (newImpulse > 0.0) {
               this.m_mass.Solve22(this.reduced, (-Cdot1X), (-Cdot1Y));
               this.impulse3.x = this.reduced.x;
               this.impulse3.y = this.reduced.y;
               this.impulse3.z = (-this.m_impulse.z);
               this.m_impulse.x += this.reduced.x;
               this.m_impulse.y += this.reduced.y;
               this.m_impulse.z = 0.0;
            }
         }
         v1.x -= m1 * this.impulse3.x;
         v1.y -= m1 * this.impulse3.y;
         w1 -= i1 * (r1X * this.impulse3.y - r1Y * this.impulse3.x + this.impulse3.z);
         v2.x += m2 * this.impulse3.x;
         v2.y += m2 * this.impulse3.y;
         w2 += i2 * (r2X * this.impulse3.y - r2Y * this.impulse3.x + this.impulse3.z);
      }
      else {
         tMat = bA.m_xf.R;
         r1X = this.m_localAnchor1.x - bA.m_sweep.localCenter.x;
         r1Y = this.m_localAnchor1.y - bA.m_sweep.localCenter.y;
         tX = (tMat.col1.x * r1X + tMat.col2.x * r1Y);
         r1Y = (tMat.col1.y * r1X + tMat.col2.y * r1Y);
         r1X = tX;
         tMat = bB.m_xf.R;
         r2X = this.m_localAnchor2.x - bB.m_sweep.localCenter.x;
         r2Y = this.m_localAnchor2.y - bB.m_sweep.localCenter.y;
         tX = (tMat.col1.x * r2X + tMat.col2.x * r2Y);
         r2Y = (tMat.col1.y * r2X + tMat.col2.y * r2Y);
         r2X = tX;
         var CdotX = v2.x + ((-w2 * r2Y)) - v1.x - ((-w1 * r1Y));
         var CdotY = v2.y + (w2 * r2X) - v1.y - (w1 * r1X);
         this.m_mass.Solve22(this.impulse2, (-CdotX), (-CdotY));
         this.m_impulse.x += this.impulse2.x;
         this.m_impulse.y += this.impulse2.y;
         v1.x -= m1 * this.impulse2.x;
         v1.y -= m1 * this.impulse2.y;
         w1 -= i1 * (r1X * this.impulse2.y - r1Y * this.impulse2.x);
         v2.x += m2 * this.impulse2.x;
         v2.y += m2 * this.impulse2.y;
         w2 += i2 * (r2X * this.impulse2.y - r2Y * this.impulse2.x);
      }
      bA.m_linearVelocity.SetV(v1);
      bA.m_angularVelocity = w1;
      bB.m_linearVelocity.SetV(v2);
      bB.m_angularVelocity = w2;
   }
   b2RevoluteJoint.prototype.SolvePositionConstraints = function (baumgarte) {
      if (baumgarte === undefined) baumgarte = 0;
      var oldLimitImpulse = 0;
      var C = 0;
      var tMat;
      var bA = this.m_bodyA;
      var bB = this.m_bodyB;
      var angularError = 0.0;
      var positionError = 0.0;
      var tX = 0;
      var impulseX = 0;
      var impulseY = 0;
      if (this.m_enableLimit && this.m_limitState != b2Joint.e_inactiveLimit) {
         var angle = bB.m_sweep.a - bA.m_sweep.a - this.m_referenceAngle;
         var limitImpulse = 0.0;
         if (this.m_limitState == b2Joint.e_equalLimits) {
            C = b2Math.Clamp(angle - this.m_lowerAngle, (-b2Settings.b2_maxAngularCorrection), b2Settings.b2_maxAngularCorrection);
            limitImpulse = (-this.m_motorMass * C);
            angularError = b2Math.Abs(C);
         }
         else if (this.m_limitState == b2Joint.e_atLowerLimit) {
            C = angle - this.m_lowerAngle;
            angularError = (-C);
            C = b2Math.Clamp(C + b2Settings.b2_angularSlop, (-b2Settings.b2_maxAngularCorrection), 0.0);
            limitImpulse = (-this.m_motorMass * C);
         }
         else if (this.m_limitState == b2Joint.e_atUpperLimit) {
            C = angle - this.m_upperAngle;
            angularError = C;
            C = b2Math.Clamp(C - b2Settings.b2_angularSlop, 0.0, b2Settings.b2_maxAngularCorrection);
            limitImpulse = (-this.m_motorMass * C);
         }
         bA.m_sweep.a -= bA.m_invI * limitImpulse;
         bB.m_sweep.a += bB.m_invI * limitImpulse;
         bA.SynchronizeTransform();
         bB.SynchronizeTransform();
      } {
         tMat = bA.m_xf.R;
         var r1X = this.m_localAnchor1.x - bA.m_sweep.localCenter.x;
         var r1Y = this.m_localAnchor1.y - bA.m_sweep.localCenter.y;
         tX = (tMat.col1.x * r1X + tMat.col2.x * r1Y);
         r1Y = (tMat.col1.y * r1X + tMat.col2.y * r1Y);
         r1X = tX;
         tMat = bB.m_xf.R;
         var r2X = this.m_localAnchor2.x - bB.m_sweep.localCenter.x;
         var r2Y = this.m_localAnchor2.y - bB.m_sweep.localCenter.y;
         tX = (tMat.col1.x * r2X + tMat.col2.x * r2Y);
         r2Y = (tMat.col1.y * r2X + tMat.col2.y * r2Y);
         r2X = tX;
         var CX = bB.m_sweep.c.x + r2X - bA.m_sweep.c.x - r1X;
         var CY = bB.m_sweep.c.y + r2Y - bA.m_sweep.c.y - r1Y;
         var CLengthSquared = CX * CX + CY * CY;
         var CLength = Math.sqrt(CLengthSquared);
         positionError = CLength;
         var invMass1 = bA.m_invMass;
         var invMass2 = bB.m_invMass;
         var invI1 = bA.m_invI;
         var invI2 = bB.m_invI;
         var k_allowedStretch = 10.0 * b2Settings.b2_linearSlop;
         if (CLengthSquared > k_allowedStretch * k_allowedStretch) {
            var uX = CX / CLength;
            var uY = CY / CLength;
            var k = invMass1 + invMass2;
            var m = 1.0 / k;
            impulseX = m * ((-CX));
            impulseY = m * ((-CY));
            var k_beta = 0.5;
            bA.m_sweep.c.x -= k_beta * invMass1 * impulseX;
            bA.m_sweep.c.y -= k_beta * invMass1 * impulseY;
            bB.m_sweep.c.x += k_beta * invMass2 * impulseX;
            bB.m_sweep.c.y += k_beta * invMass2 * impulseY;
            CX = bB.m_sweep.c.x + r2X - bA.m_sweep.c.x - r1X;
            CY = bB.m_sweep.c.y + r2Y - bA.m_sweep.c.y - r1Y;
         }
         this.K1.col1.x = invMass1 + invMass2;
         this.K1.col2.x = 0.0;
         this.K1.col1.y = 0.0;
         this.K1.col2.y = invMass1 + invMass2;
         this.K2.col1.x = invI1 * r1Y * r1Y;
         this.K2.col2.x = (-invI1 * r1X * r1Y);
         this.K2.col1.y = (-invI1 * r1X * r1Y);
         this.K2.col2.y = invI1 * r1X * r1X;
         this.K3.col1.x = invI2 * r2Y * r2Y;
         this.K3.col2.x = (-invI2 * r2X * r2Y);
         this.K3.col1.y = (-invI2 * r2X * r2Y);
         this.K3.col2.y = invI2 * r2X * r2X;
         this.K.SetM(this.K1);
         this.K.AddM(this.K2);
         this.K.AddM(this.K3);
         this.K.Solve(b2RevoluteJoint.tImpulse, (-CX), (-CY));
         impulseX = b2RevoluteJoint.tImpulse.x;
         impulseY = b2RevoluteJoint.tImpulse.y;
         bA.m_sweep.c.x -= bA.m_invMass * impulseX;
         bA.m_sweep.c.y -= bA.m_invMass * impulseY;
         bA.m_sweep.a -= bA.m_invI * (r1X * impulseY - r1Y * impulseX);
         bB.m_sweep.c.x += bB.m_invMass * impulseX;
         bB.m_sweep.c.y += bB.m_invMass * impulseY;
         bB.m_sweep.a += bB.m_invI * (r2X * impulseY - r2Y * impulseX);
         bA.SynchronizeTransform();
         bB.SynchronizeTransform();
      }
      return positionError <= b2Settings.b2_linearSlop && angularError <= b2Settings.b2_angularSlop;
   }
   Box2D.postDefs.push(function () {
      Box2D.Dynamics.Joints.b2RevoluteJoint.tImpulse = new b2Vec2();
   });
   Box2D.inherit(b2RevoluteJointDef, Box2D.Dynamics.Joints.b2JointDef);
   b2RevoluteJointDef.prototype.__super = Box2D.Dynamics.Joints.b2JointDef.prototype;
   b2RevoluteJointDef.b2RevoluteJointDef = function () {
      Box2D.Dynamics.Joints.b2JointDef.b2JointDef.apply(this, arguments);
      this.localAnchorA = new b2Vec2();
      this.localAnchorB = new b2Vec2();
   };
   b2RevoluteJointDef.prototype.b2RevoluteJointDef = function () {
      this.__super.b2JointDef.call(this);
      this.type = b2Joint.e_revoluteJoint;
      this.localAnchorA.Set(0.0, 0.0);
      this.localAnchorB.Set(0.0, 0.0);
      this.referenceAngle = 0.0;
      this.lowerAngle = 0.0;
      this.upperAngle = 0.0;
      this.maxMotorTorque = 0.0;
      this.motorSpeed = 0.0;
      this.enableLimit = false;
      this.enableMotor = false;
   }
   b2RevoluteJointDef.prototype.Initialize = function (bA, bB, anchor) {
      this.bodyA = bA;
      this.bodyB = bB;
      this.localAnchorA = this.bodyA.GetLocalPoint(anchor);
      this.localAnchorB = this.bodyB.GetLocalPoint(anchor);
      this.referenceAngle = this.bodyB.GetAngle() - this.bodyA.GetAngle();
   }
   Box2D.inherit(b2WeldJoint, Box2D.Dynamics.Joints.b2Joint);
   b2WeldJoint.prototype.__super = Box2D.Dynamics.Joints.b2Joint.prototype;
   b2WeldJoint.b2WeldJoint = function () {
      Box2D.Dynamics.Joints.b2Joint.b2Joint.apply(this, arguments);
      this.m_localAnchorA = new b2Vec2();
      this.m_localAnchorB = new b2Vec2();
      this.m_impulse = new b2Vec3();
      this.m_mass = new b2Mat33();
   };
   b2WeldJoint.prototype.GetAnchorA = function () {
      return this.m_bodyA.GetWorldPoint(this.m_localAnchorA);
   }
   b2WeldJoint.prototype.GetAnchorB = function () {
      return this.m_bodyB.GetWorldPoint(this.m_localAnchorB);
   }
   b2WeldJoint.prototype.GetReactionForce = function (inv_dt) {
      if (inv_dt === undefined) inv_dt = 0;
      return new b2Vec2(inv_dt * this.m_impulse.x, inv_dt * this.m_impulse.y);
   }
   b2WeldJoint.prototype.GetReactionTorque = function (inv_dt) {
      if (inv_dt === undefined) inv_dt = 0;
      return inv_dt * this.m_impulse.z;
   }
   b2WeldJoint.prototype.b2WeldJoint = function (def) {
      this.__super.b2Joint.call(this, def);
      this.m_localAnchorA.SetV(def.localAnchorA);
      this.m_localAnchorB.SetV(def.localAnchorB);
      this.m_referenceAngle = def.referenceAngle;
      this.m_impulse.SetZero();
      this.m_mass = new b2Mat33();
   }
   b2WeldJoint.prototype.InitVelocityConstraints = function (step) {
      var tMat;
      var tX = 0;
      var bA = this.m_bodyA;
      var bB = this.m_bodyB;
      tMat = bA.m_xf.R;
      var rAX = this.m_localAnchorA.x - bA.m_sweep.localCenter.x;
      var rAY = this.m_localAnchorA.y - bA.m_sweep.localCenter.y;
      tX = (tMat.col1.x * rAX + tMat.col2.x * rAY);
      rAY = (tMat.col1.y * rAX + tMat.col2.y * rAY);
      rAX = tX;
      tMat = bB.m_xf.R;
      var rBX = this.m_localAnchorB.x - bB.m_sweep.localCenter.x;
      var rBY = this.m_localAnchorB.y - bB.m_sweep.localCenter.y;
      tX = (tMat.col1.x * rBX + tMat.col2.x * rBY);
      rBY = (tMat.col1.y * rBX + tMat.col2.y * rBY);
      rBX = tX;
      var mA = bA.m_invMass;
      var mB = bB.m_invMass;
      var iA = bA.m_invI;
      var iB = bB.m_invI;
      this.m_mass.col1.x = mA + mB + rAY * rAY * iA + rBY * rBY * iB;
      this.m_mass.col2.x = (-rAY * rAX * iA) - rBY * rBX * iB;
      this.m_mass.col3.x = (-rAY * iA) - rBY * iB;
      this.m_mass.col1.y = this.m_mass.col2.x;
      this.m_mass.col2.y = mA + mB + rAX * rAX * iA + rBX * rBX * iB;
      this.m_mass.col3.y = rAX * iA + rBX * iB;
      this.m_mass.col1.z = this.m_mass.col3.x;
      this.m_mass.col2.z = this.m_mass.col3.y;
      this.m_mass.col3.z = iA + iB;
      if (step.warmStarting) {
         this.m_impulse.x *= step.dtRatio;
         this.m_impulse.y *= step.dtRatio;
         this.m_impulse.z *= step.dtRatio;
         bA.m_linearVelocity.x -= mA * this.m_impulse.x;
         bA.m_linearVelocity.y -= mA * this.m_impulse.y;
         bA.m_angularVelocity -= iA * (rAX * this.m_impulse.y - rAY * this.m_impulse.x + this.m_impulse.z);
         bB.m_linearVelocity.x += mB * this.m_impulse.x;
         bB.m_linearVelocity.y += mB * this.m_impulse.y;
         bB.m_angularVelocity += iB * (rBX * this.m_impulse.y - rBY * this.m_impulse.x + this.m_impulse.z);
      }
      else {
         this.m_impulse.SetZero();
      }
   }
   b2WeldJoint.prototype.SolveVelocityConstraints = function (step) {
      var tMat;
      var tX = 0;
      var bA = this.m_bodyA;
      var bB = this.m_bodyB;
      var vA = bA.m_linearVelocity;
      var wA = bA.m_angularVelocity;
      var vB = bB.m_linearVelocity;
      var wB = bB.m_angularVelocity;
      var mA = bA.m_invMass;
      var mB = bB.m_invMass;
      var iA = bA.m_invI;
      var iB = bB.m_invI;
      tMat = bA.m_xf.R;
      var rAX = this.m_localAnchorA.x - bA.m_sweep.localCenter.x;
      var rAY = this.m_localAnchorA.y - bA.m_sweep.localCenter.y;
      tX = (tMat.col1.x * rAX + tMat.col2.x * rAY);
      rAY = (tMat.col1.y * rAX + tMat.col2.y * rAY);
      rAX = tX;
      tMat = bB.m_xf.R;
      var rBX = this.m_localAnchorB.x - bB.m_sweep.localCenter.x;
      var rBY = this.m_localAnchorB.y - bB.m_sweep.localCenter.y;
      tX = (tMat.col1.x * rBX + tMat.col2.x * rBY);
      rBY = (tMat.col1.y * rBX + tMat.col2.y * rBY);
      rBX = tX;
      var Cdot1X = vB.x - wB * rBY - vA.x + wA * rAY;
      var Cdot1Y = vB.y + wB * rBX - vA.y - wA * rAX;
      var Cdot2 = wB - wA;
      var impulse = new b2Vec3();
      this.m_mass.Solve33(impulse, (-Cdot1X), (-Cdot1Y), (-Cdot2));
      this.m_impulse.Add(impulse);
      vA.x -= mA * impulse.x;
      vA.y -= mA * impulse.y;
      wA -= iA * (rAX * impulse.y - rAY * impulse.x + impulse.z);
      vB.x += mB * impulse.x;
      vB.y += mB * impulse.y;
      wB += iB * (rBX * impulse.y - rBY * impulse.x + impulse.z);
      bA.m_angularVelocity = wA;
      bB.m_angularVelocity = wB;
   }
   b2WeldJoint.prototype.SolvePositionConstraints = function (baumgarte) {
      if (baumgarte === undefined) baumgarte = 0;
      var tMat;
      var tX = 0;
      var bA = this.m_bodyA;
      var bB = this.m_bodyB;
      tMat = bA.m_xf.R;
      var rAX = this.m_localAnchorA.x - bA.m_sweep.localCenter.x;
      var rAY = this.m_localAnchorA.y - bA.m_sweep.localCenter.y;
      tX = (tMat.col1.x * rAX + tMat.col2.x * rAY);
      rAY = (tMat.col1.y * rAX + tMat.col2.y * rAY);
      rAX = tX;
      tMat = bB.m_xf.R;
      var rBX = this.m_localAnchorB.x - bB.m_sweep.localCenter.x;
      var rBY = this.m_localAnchorB.y - bB.m_sweep.localCenter.y;
      tX = (tMat.col1.x * rBX + tMat.col2.x * rBY);
      rBY = (tMat.col1.y * rBX + tMat.col2.y * rBY);
      rBX = tX;
      var mA = bA.m_invMass;
      var mB = bB.m_invMass;
      var iA = bA.m_invI;
      var iB = bB.m_invI;
      var C1X = bB.m_sweep.c.x + rBX - bA.m_sweep.c.x - rAX;
      var C1Y = bB.m_sweep.c.y + rBY - bA.m_sweep.c.y - rAY;
      var C2 = bB.m_sweep.a - bA.m_sweep.a - this.m_referenceAngle;
      var k_allowedStretch = 10.0 * b2Settings.b2_linearSlop;
      var positionError = Math.sqrt(C1X * C1X + C1Y * C1Y);
      var angularError = b2Math.Abs(C2);
      if (positionError > k_allowedStretch) {
         iA *= 1.0;
         iB *= 1.0;
      }
      this.m_mass.col1.x = mA + mB + rAY * rAY * iA + rBY * rBY * iB;
      this.m_mass.col2.x = (-rAY * rAX * iA) - rBY * rBX * iB;
      this.m_mass.col3.x = (-rAY * iA) - rBY * iB;
      this.m_mass.col1.y = this.m_mass.col2.x;
      this.m_mass.col2.y = mA + mB + rAX * rAX * iA + rBX * rBX * iB;
      this.m_mass.col3.y = rAX * iA + rBX * iB;
      this.m_mass.col1.z = this.m_mass.col3.x;
      this.m_mass.col2.z = this.m_mass.col3.y;
      this.m_mass.col3.z = iA + iB;
      var impulse = new b2Vec3();
      this.m_mass.Solve33(impulse, (-C1X), (-C1Y), (-C2));
      bA.m_sweep.c.x -= mA * impulse.x;
      bA.m_sweep.c.y -= mA * impulse.y;
      bA.m_sweep.a -= iA * (rAX * impulse.y - rAY * impulse.x + impulse.z);
      bB.m_sweep.c.x += mB * impulse.x;
      bB.m_sweep.c.y += mB * impulse.y;
      bB.m_sweep.a += iB * (rBX * impulse.y - rBY * impulse.x + impulse.z);
      bA.SynchronizeTransform();
      bB.SynchronizeTransform();
      return positionError <= b2Settings.b2_linearSlop && angularError <= b2Settings.b2_angularSlop;
   }
   Box2D.inherit(b2WeldJointDef, Box2D.Dynamics.Joints.b2JointDef);
   b2WeldJointDef.prototype.__super = Box2D.Dynamics.Joints.b2JointDef.prototype;
   b2WeldJointDef.b2WeldJointDef = function () {
      Box2D.Dynamics.Joints.b2JointDef.b2JointDef.apply(this, arguments);
      this.localAnchorA = new b2Vec2();
      this.localAnchorB = new b2Vec2();
   };
   b2WeldJointDef.prototype.b2WeldJointDef = function () {
      this.__super.b2JointDef.call(this);
      this.type = b2Joint.e_weldJoint;
      this.referenceAngle = 0.0;
   }
   b2WeldJointDef.prototype.Initialize = function (bA, bB, anchor) {
      this.bodyA = bA;
      this.bodyB = bB;
      this.localAnchorA.SetV(this.bodyA.GetLocalPoint(anchor));
      this.localAnchorB.SetV(this.bodyB.GetLocalPoint(anchor));
      this.referenceAngle = this.bodyB.GetAngle() - this.bodyA.GetAngle();
   }
})();
(function () {
   var b2DebugDraw = Box2D.Dynamics.b2DebugDraw;
   b2DebugDraw.b2DebugDraw = function () {
      this.m_drawScale = 1.0;
      this.m_lineThickness = 1.0;
      this.m_alpha = 1.0;
      this.m_fillAlpha = 1.0;
      this.m_xformScale = 1.0;
      var __this = this;
      //#WORKAROUND
      this.m_sprite = {
         graphics: {
            clear: function () {
               __this.m_ctx.clearRect(0, 0, __this.m_ctx.canvas.width, __this.m_ctx.canvas.height)
            }
         }
      };
   };
   b2DebugDraw.prototype._color = function (color, alpha) {
      return "rgba(" + ((color & 0xFF0000) >> 16) + "," + ((color & 0xFF00) >> 8) + "," + (color & 0xFF) + "," + alpha + ")";
   };
   b2DebugDraw.prototype.b2DebugDraw = function () {
      this.m_drawFlags = 0;
   };
   b2DebugDraw.prototype.SetFlags = function (flags) {
      if (flags === undefined) flags = 0;
      this.m_drawFlags = flags;
   };
   b2DebugDraw.prototype.GetFlags = function () {
      return this.m_drawFlags;
   };
   b2DebugDraw.prototype.AppendFlags = function (flags) {
      if (flags === undefined) flags = 0;
      this.m_drawFlags |= flags;
   };
   b2DebugDraw.prototype.ClearFlags = function (flags) {
      if (flags === undefined) flags = 0;
      this.m_drawFlags &= ~flags;
   };
   b2DebugDraw.prototype.SetSprite = function (sprite) {
      this.m_ctx = sprite;
   };
   b2DebugDraw.prototype.GetSprite = function () {
      return this.m_ctx;
   };
   b2DebugDraw.prototype.SetDrawScale = function (drawScale) {
      if (drawScale === undefined) drawScale = 0;
      this.m_drawScale = drawScale;
   };
   b2DebugDraw.prototype.GetDrawScale = function () {
      return this.m_drawScale;
   };
   b2DebugDraw.prototype.SetLineThickness = function (lineThickness) {
      if (lineThickness === undefined) lineThickness = 0;
      this.m_lineThickness = lineThickness;
      this.m_ctx.strokeWidth = lineThickness;
   };
   b2DebugDraw.prototype.GetLineThickness = function () {
      return this.m_lineThickness;
   };
   b2DebugDraw.prototype.SetAlpha = function (alpha) {
      if (alpha === undefined) alpha = 0;
      this.m_alpha = alpha;
   };
   b2DebugDraw.prototype.GetAlpha = function () {
      return this.m_alpha;
   };
   b2DebugDraw.prototype.SetFillAlpha = function (alpha) {
      if (alpha === undefined) alpha = 0;
      this.m_fillAlpha = alpha;
   };
   b2DebugDraw.prototype.GetFillAlpha = function () {
      return this.m_fillAlpha;
   };
   b2DebugDraw.prototype.SetXFormScale = function (xformScale) {
      if (xformScale === undefined) xformScale = 0;
      this.m_xformScale = xformScale;
   };
   b2DebugDraw.prototype.GetXFormScale = function () {
      return this.m_xformScale;
   };
   b2DebugDraw.prototype.DrawPolygon = function (vertices, vertexCount, color) {
      if (!vertexCount) return;
      var s = this.m_ctx;
      var drawScale = this.m_drawScale;
      s.beginPath();
      s.strokeStyle = this._color(color.color, this.m_alpha);
      s.moveTo(vertices[0].x * drawScale, vertices[0].y * drawScale);
      for (var i = 1; i < vertexCount; i++) {
         s.lineTo(vertices[i].x * drawScale, vertices[i].y * drawScale);
      }
      s.lineTo(vertices[0].x * drawScale, vertices[0].y * drawScale);
      s.closePath();
      s.stroke();
   };
   b2DebugDraw.prototype.DrawSolidPolygon = function (vertices, vertexCount, color) {
      if (!vertexCount) return;
      var s = this.m_ctx;
      var drawScale = this.m_drawScale;
      s.beginPath();
      s.strokeStyle = this._color(color.color, this.m_alpha);
      s.fillStyle = this._color(color.color, this.m_fillAlpha);
      s.moveTo(vertices[0].x * drawScale, vertices[0].y * drawScale);
      for (var i = 1; i < vertexCount; i++) {
         s.lineTo(vertices[i].x * drawScale, vertices[i].y * drawScale);
      }
      s.lineTo(vertices[0].x * drawScale, vertices[0].y * drawScale);
      s.closePath();
      s.fill();
      s.stroke();
   };
   b2DebugDraw.prototype.DrawCircle = function (center, radius, color) {
      if (!radius) return;
      var s = this.m_ctx;
      var drawScale = this.m_drawScale;
      s.beginPath();
      s.strokeStyle = this._color(color.color, this.m_alpha);
      s.arc(center.x * drawScale, center.y * drawScale, radius * drawScale, 0, Math.PI * 2, true);
      s.closePath();
      s.stroke();
   };
   b2DebugDraw.prototype.DrawSolidCircle = function (center, radius, axis, color) {
      if (!radius) return;
      var s = this.m_ctx,
         drawScale = this.m_drawScale,
         cx = center.x * drawScale,
         cy = center.y * drawScale;
      s.moveTo(0, 0);
      s.beginPath();
      s.strokeStyle = this._color(color.color, this.m_alpha);
      s.fillStyle = this._color(color.color, this.m_fillAlpha);
      s.arc(cx, cy, radius * drawScale, 0, Math.PI * 2, true);
      s.moveTo(cx, cy);
      s.lineTo((center.x + axis.x * radius) * drawScale, (center.y + axis.y * radius) * drawScale);
      s.closePath();
      s.fill();
      s.stroke();
   };
   b2DebugDraw.prototype.DrawSegment = function (p1, p2, color) {
      var s = this.m_ctx,
         drawScale = this.m_drawScale;
      s.strokeStyle = this._color(color.color, this.m_alpha);
      s.beginPath();
      s.moveTo(p1.x * drawScale, p1.y * drawScale);
      s.lineTo(p2.x * drawScale, p2.y * drawScale);
      s.closePath();
      s.stroke();
   };
   b2DebugDraw.prototype.DrawTransform = function (xf) {
      var s = this.m_ctx,
         drawScale = this.m_drawScale;
      s.beginPath();
      s.strokeStyle = this._color(0xff0000, this.m_alpha);
      s.moveTo(xf.position.x * drawScale, xf.position.y * drawScale);
      s.lineTo((xf.position.x + this.m_xformScale * xf.R.col1.x) * drawScale, (xf.position.y + this.m_xformScale * xf.R.col1.y) * drawScale);

      s.strokeStyle = this._color(0xff00, this.m_alpha);
      s.moveTo(xf.position.x * drawScale, xf.position.y * drawScale);
      s.lineTo((xf.position.x + this.m_xformScale * xf.R.col2.x) * drawScale, (xf.position.y + this.m_xformScale * xf.R.col2.y) * drawScale);
      s.closePath();
      s.stroke();
   };
})();
var i;
for (i = 0; i < Box2D.postDefs.length; ++i) Box2D.postDefs[i]();

module.exports = Box2D
},{}]},{},[54]);
