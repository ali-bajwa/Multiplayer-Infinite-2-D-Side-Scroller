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
                    despawn(entity);
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
		this.point_value = 200;
		this.sight_range = 16; //distance at which entity detects heroes
		this.attack_range = 8; //distance at which entity leaps at the hero
		
		this.hit_taken = false; //whether a hit has been taken since the last tick
		this.damage_taken = 0; //the amount of damage inflicted by hits since the last tick
		
		this.direction = false;	//false=left, true=right;
		this.direction_previous = false;//store direction from end of previous tick
		this.x_previous = 0;		//store x value from end of previous tick
		this.y_previous = 0;		//store x value from end of previous tick
		
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
			/*
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
			*/
			var hero = EntityController.get_my_hero();
			if(hero != null){
				hero_x = hero.body.GetWorldCenter().x;
				output = (Math.abs(hero_x - this.body.GetWorldCenter().x) < range);
			}
			/*
			}
			*/
			return output;
		};
		
		//returns the direction of nearest enemy
		this.direction_nearest_enemy = function(){
			/*
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
			*/
			var nearest;
			var hero_x = EntityController.get_my_hero().body.GetWorldCenter().x;
			var distance = (hero_x - this.body.GetWorldCenter().x);
			return (distance > 0);//return true/right of distance is positive, return false/left if distance is negative
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
				WorldController.increase_score(this.point_value);
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
