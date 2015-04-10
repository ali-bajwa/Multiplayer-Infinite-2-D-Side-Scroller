var GriffinLogic = (function(){

	var Griffin = function(){
		/* Will be instantiated for every created entity to hold all the information 
			about the physical (not graphical) state of the entity in question. 
			declare the properties like this:
			this.some_state_variable_initial_value = 0;
			instantiate (most likely in the spawn function) like that:
			var new_entity_instance = new Griffin();
		*/
		this.hero_hurt_me = false;
		this.me_hurt_hero = false;
		this.death_tick = 0;

		//set your game logic parameters here
		//this.object_id = 1; //hardcode a unique identifier for each new enemy class
		this.hp = 2;
		this.speed = 3;
		this.damage = 1;
		//this.attack_cooldown = 4; //use this for enemies who need
		this.can_attack = true;//use this for enemies who alternate between 
		//this.cooldown_timer=-1;
		this.AI_state = "walk";//use this to keep track of the enemy's AI state
		this.aliveflag = true;
		this.unhurtflag = true;
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
		var id = IdentificationController.assign_id(new_Griffin);

		new_Griffin.body = PhysicsController.get_rectangular({x: x, y: y, border_sensors: true}, new_Griffin);	

		return new_Griffin;

	};

	var tick_AI = function(Griffin){
		/* Is ran each tick from the EntityController.update for every registered
			entity of this type. I given entity_instance
		*/

		//if enemy is dead, die
		if (Griffin.hp == 1) {
			
			if (Griffin.hero_hurt_me){
				wound_Griffin(Griffin, 1);
				Griffin.hero_hurt_me = false;
				Griffin.can_attack = false;
			}

		}else if (Griffin.hp <= 0) {
			change_state(Griffin, "death");
			Griffin.can_attack = false;
			Griffin.death_tick++;
			
			if(Griffin.death_tick == 30){
				EntityController.delete_entity(Griffin);
				return 
			}else if(Griffin.death_tick > 30){
			}

		}else { // Griffin.hp >= 1

			if (Griffin.AI_state == "walk") {
				var Griffinbody = Griffin.body;
				var velocity = Griffinbody.GetLinearVelocity();
				velocity.x = -Griffin.speed;
				Griffinbody.SetLinearVelocity(velocity); // body.SetLinearVelocity(new b2Vec2(5, 0)); would work too
				Griffinbody.SetAwake(true);
			}
			if (Griffin.can_attack && Griffin.me_hurt_hero && Griffin.AI_state == "walk"){
				// pass
			}
			if (Griffin.hero_hurt_me)
			{
				wound_Griffin(Griffin, 1);
				Griffin.hero_hurt_me = false;
				Griffin.can_attack = false;
				change_state(Griffin, "upside_down");
				
			}
		}

	};

	var wound_Griffin = function(Griffin, wound){
		Griffin.hp -= wound;
		Griffin.hero_hurt_me = false;
	};

	var change_state = function(Griffin, progress_state) {
		Griffin.AI_state = progress_state;

	};

	// // //Set up Collision handler
	
	
	var begin_contact = function(contact, info){
		//handle collisions here
		
		//console.log(info.Me.id, ":", "My fixture", "'" + info.Me.fixture_name + "'", "came into contact with fixture", 
			//"'" + info.Them.fixture_name + "'", "of", info.Them.id);
		
		var type = info.Me.type;

		if(type !== "Griffin")
			console.log("Error", type, "instead of Griffin with other being", info.Them.type);
		
		
		if(info.Them.type == "hero")
		{
			
			if(info.Them.fixture_name != "bottom" && info.Me.entity.can_attack)
			{
				info.Me.entity.me_hurt_hero = true;
				
			}	
			else
			{

				info.Me.entity.hero_hurt_me = true;
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

module.exports = GriffinLogic;

var Includes = require("../Includes.js"); var include_data = Includes.get_include_data({
	current_module: "GriffinLogic", 
	include_options: Includes.choices.LOGIC_SPECIFIC
}); eval(include_data.name_statements); var include = function(){eval(include_data.module_statements);}
