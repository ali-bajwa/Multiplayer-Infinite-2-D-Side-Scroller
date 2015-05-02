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
		entity.can_attack = true;
		entity.aliveflag = true;
		entity.unhurtflag = true;
		entity.start_walking = true;
		entity.pop = 40;
		entity.popup = 0;
		entity.animation = "walk";
		entity.decay_duration = 0;
		
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
		if (ant.hp <= 0){
			ant.die();
		}else{
			if(ant.hp == 1){
				ant.popup++;
				if(ant.popup == ant.pop){
					ant.jump(10, -20);
					ant.hp++;
					ant.popup = 0;
					ant.can_attack = true;
					ant.unhurtflag = true;
					ant.change_animation("walk");
				}
			}else{ // hp > 1
				//do maintenance
				ant.direction_previous = ant.direction;
				ant.x_previous = ant.body.GetWorldCenter().x
				//if blocked, turn around
				if((!ant.path_free() || ant.xprevious == ant.body.GetWorldCenter().x) && !ant.in_air()){
					ant.direction = !ant.direction;
				}
				//move forward
				ant.move(ant.speed);
				ant.change_animation("walk");
			}
			if (ant.damage_taken){
				ant.change_animation("upside_down");
				ant.take_damage();
			}
		}
	};

	// // //Set up Collision handler
	
	
	var begin_contact = function(contact, info){
		//handle collisions here
		
		if(info.Them.type == "hero"){
			if(info.Them.fixture_name != "bottom" && info.Me.entity.can_attack){
				info.Me.entity.me_hurt_hero = true;
			}else{
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
