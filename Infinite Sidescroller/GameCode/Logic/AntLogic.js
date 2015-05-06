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
