var EntityController = (function () {
    /* Description
    */

    var type_logic_table;

    var Count = 0;

    var init = function () {
        /* is ran from the InitController once when the game is loaded */

        include(); // satisfy requirements

        type_logic_table = {
            "ant": AntLogic,
            "hero": HeroLogic,
            "Griffin": GriffinLogic,
            "Hyena": HyenaLogic,
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

        spawn(10, 10, "hero");
    };

    var spawn = function (x, y, type) {
        /**
        * spawn entity of the given type at the given coordinates
        * also registeres thing as awaiting graphics initialization
        */
        var logic = type_logic_table[type];

        if (logic) {
            var new_entity = logic.spawn(x, y);
            RegisterAsController.register_as("awaiting_graphics_initialization", new_entity)

            if (!EntityModel.for_logic_update[type]) {
                EntityModel.for_logic_update[type] = {};
            }
            var logic_upd_table = EntityModel.for_logic_update[type];
            logic_upd_table[new_entity.id] = new_entity;
        } else {
            throw "Logic for the type " + type + " is not defined";
        }


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
        var logic = type_logic_table[type];

        if (logic.despawn) {
            // if custom despawn function is provided, call it
            logic.despawn(entity);
            console.log("despawn called for the type", type);
        } else {
            // or delete directly
            delete_entity(entity);
        }

    };



    var delete_entity = function (entity) {
        /**
        * This function will remove this entity along with some other info about this entity
        * from the world, it'll also free the id of this entity. The physical body will be deleted
        * too; 
        * This function is supposed to be called by the individual logic modules, when the are finished
        * animating deat/destruction of something and want to get rid of it
        */

        // TODO: finish this function and then update it regularly;
        // This one is very sensitive, as even one reference left may prevent 
        // object from being deleted and cause memory leaks. Testing is required
        if (entity.body != null) {
            var body = entity.body;
        } else {
            // body is required. if place where body is stored changed, you should update this function
            throw "Body of the instance is undefined"
        }

        if (entity.id != null) {
            var id = entity.id;
        } else {
            // id is needed, if id system changed, and you are here, update this function
            throw "There is no id associated with this instance"
        }

        if (entity.type != null) {
            var type = entity.type;
        } else {
            // id is needed, if id system changed, and you are here, update this function
            throw "There is no type associated with this instance"
        }

        // remove graphics
        //GraphicsController.destroy_graphics_for(id);
        RegisterAsController.register_as("removed_entity", entity);
        // remove physics
        PhysicsController.remove_body(body);
        // remove stored references within EntityController/Model
        delete EntityModel.for_logic_update[type][id];
        // free the id
        IdentificationController.remove_id(id);
    };

    var update = function (delta) {
        /* is ran each tick from the GameController.update_all */
        var debug_commands = KeyboardController.debug_commands();

        // demonstration purposes for ant
        if (debug_commands("spawn_ant")) {
            var new_ant = spawn(WorldController.get_movement_edge() + Math.random() * 50, 10, "ant");
        }

        // demonstration purposes for griffin

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

        for (var type in EntityModel.for_logic_update) {
            var table = EntityModel.for_logic_update[type];

            var logic = type_logic_table[type];
            for (var id in table) {
                var entity = table[id];

                if (beyond_world_boundary(entity)) {
                    // if outside boundaries of the world, despawn
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
		
		
	var get_all_heroes = function(){
		return {0:EntityModel.hero};
	};
	
	var get_my_hero = function(){
		return EntityModel.hero;
	};
	
	var load_hero = function(id){
		EntityModel.hero = IdentificationController.get_by_id(id);
	}
	
	var handle_hero_sync = function(){};
	
	var handle_delete = function(){};
	
	var handle_spawn = function(){};
	
	var reg_for_logic_update = function(){};
	
	/**
	Documentation will be here, someday
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
		
		this.jump = function(entity){
			ApplyImpulse(new B2d.b2Vec2((2*entity.jump_force*entity.direction) - entity.jump_force, -1*entity.jump_force/2), body.GetWorldCenter());
		};
		
		this.move = function(entity){
			var dir = (entity.direction*2-1);
			var velocity = entity.body.GetLinearVelocity();
			velocity.x = entity.speed*dir; //move speed in current direction
			entity.body.SetLinearVelocity(velocity);
		};
			
		//check for enemies in range (vision or jump)
		this.enemy_in_range = function(entity,range){
			var output = false;
			/*
			//multiplayer implementation
			var hero_list = [];
			
			for (i=0;i<hero_list.length;i++){
				if(in range){
				output = true;
				break;
				}
			}
			return output;
			*/
			var hero_x = EntityController.get_my_hero().body.GetWorldCenter().x;
			output = (Math.abs(hero_x - entity.body.GetWorldCenter().x) < range);
			return output;
		};
		
			//returns the direction of nearest enemy
		this.direction_nearest_enemy = function(entity){
			/*//in multiplayer, first find nearest enemy
			var nearest = hero[0];
			for(i < 8){
				if(typeof hero[i] !== 'undefined'){
					if(distance_formula(hero[i],entity) < distance_formula(nearest,entity)){
						nearest = hero[i];
					}
				}
			}*/
			var nearest;
			var hero_x = EntityController.get_my_hero().body.GetWorldCenter().x;
			var distance = (hero_x - entity.body.GetWorldCenter().x);
			return (distance > 0);//return true/right of distance is positive, return false/left if distance is negative
		};
		
		//decrease health
		this.take_damage = function(entity){
			entity.hp -= entity.damage_taken;
			entity.damage_taken = 0;
			entity.hit_taken = false;
			entity.blinking = true;
			entity.blink_timer = entity.blink_duration;
			//knockback here
		};
		
			//die
		this.die = function(entity){
			if (entity.is_alive){//if alive, kill it
				entity.death_timer = entity.death_duration;
				entity.is_alive = false;
				WorldController.increase_score(entity.point_value);
				entity.hit_taken = false;
				entity.can_attack = false;
				entity.change_animation(entity,"death");
				return ;
			}else{//else decay
				entity.death_timer--;
				if (entity.death_timer <= entity.death_duration && entity.death_timer > entity.decay_duration){
					entity.change_animation(entity,"death");
				} else if (entity.death_timer <= entity.decay_duration && entity.death_timer > 0){
					entity.change_animation(entity,"decay");
				} else {
					EntityController.delete_entity(entity);//remove instance from memory
				}
				return;
			}
		}
		
		//checks if movement is voluntary or forced
		this.movement_voluntary = function(entity){
			//if direction being faced is different from the direction moving, return false
			var output = true;
			var velocity = entity.body.GetLinearVelocity().x;
			if(velocity != 0){
				output = (velocity/Math.abs(velocity) == (entity.direction)*2-1);
			}
			return output;
		};

		//checks if in the air
		this.in_air = function(entity){
			var body = entity.body;
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
		this.path_free = function(entity){
			var body = entity.body;
			var objects_before;
			var AABB;
			if (body.GetFixtureList() != null){//prevent bugs on destruction
				if (entity.direction){
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
		this.change_animation = function(entity,new_animation){
			if(entity.animation != new_animation){
				entity.animation = new_animation;
				entity.needs_graphics_update = true;
			}else{ 
				entity.needs_graphics_update = false;
			}
		};
	};

	return {
		// declare public
		init: init, 
		update: update,
		//get_operation: get_operation,
		reg_for_logic_update: reg_for_logic_update,
		spawn: spawn,
		delete_entity: delete_entity,
		//fulfill_delete_request: fulfill_delete_request,
		handle_spawn: handle_spawn,
		handle_delete: handle_delete,
		handle_hero_sync: handle_hero_sync,
		get_all_heroes: get_all_heroes,
		get_my_hero: get_my_hero,
		create_abstract_entity: create_abstract_entity,
		load_hero: load_hero,
    };
})();

module.exports = EntityController;

var Includes = require("../Includes.js"); var include_data = Includes.get_include_data({
    current_module: "EntityController",
    include_options: Includes.choices.DEFAULT | Includes.choices.LOGIC
}); eval(include_data.name_statements); var include = function () { eval(include_data.module_statements); }