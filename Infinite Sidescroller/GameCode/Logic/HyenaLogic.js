var HyenaLogic = (function(){

	var Hyena = function(){
		/* Will be instantiated for every created entity to hold all the information 
			about the physical (not graphical) state of the entity in question. 
			declare the properties like this:
			this.some_state_variable_initial_value = 0;
			instantiate (most likely in the spawn function) like that:
			var new_entity_instance = new Hyena();
		*/
		this.hero_hurt_me = false;
		this.me_hurt_hero = false;
		this.death_tick = 0;

		//set your game logic parameters here
		//this.object_id = 1; //hardcode a unique identifier for each new enemy class
		this.hp = 2;
		this.speed = 6;
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
		IdentificationController.assign_type(Hyena, "Hyena");
	};

	var spawn = function(x, y){
		/* spawn instance of this entity at the given coordinates
			you will have to create new entity instance, assign it id
			using the IdentificationController.assign_id(entity_instance),
			assign it a body which you can get through PhysicsController
			do any other stuff you want to do during spawning,
			and finally you HAVE TO(!!!) return the instance you just created from this function
		*/

		var new_hyena = new Hyena();
		var id = IdentificationController.assign_id(new_hyena);

		new_hyena.body = PhysicsController.get_rectangular({x: x, y: y, border_sensors: true}, new_hyena);	

		return new_hyena;

	};

	var tick_AI = function(Hyena){
		/* Is ran each tick from the EntityController.update for every registered
			entity of this type. I given entity_instance
		*/

		//if enemy is dead, die
		if (Hyena.hp == 1) {
			
			if (Hyena.hero_hurt_me){
				wound_Hyena(Hyena, 1);
				Hyena.hero_hurt_me = false;
				Hyena.can_attack = false;
			}

		}else if (Hyena.hp <= 0) {
			change_state(Hyena, "death");
			Hyena.can_attack = false;
			Hyena.death_tick++;
			
			if(Hyena.death_tick == 30){
				EntityController.delete_entity(Hyena);
				return 
			}else if(Hyena.death_tick > 30){
			}

		}else { // Hyena.hp >= 1

			if (Hyena.AI_state == "walk") {
				var Hyenabody = Hyena.body;
				var velocity = Hyenabody.GetLinearVelocity();
				velocity.x = -Hyena.speed;
				Hyenabody.SetLinearVelocity(velocity); // body.SetLinearVelocity(new b2Vec2(5, 0)); would work too
				Hyenabody.SetAwake(true);
			}
			if (Hyena.can_attack && Hyena.me_hurt_hero && Hyena.AI_state == "walk"){
				// pass
			}
			if (Hyena.hero_hurt_me)
			{
				wound_Hyena(Hyena, 1);
				Hyena.hero_hurt_me = false;
				Hyena.can_attack = false;
				change_state(Hyena, "upside_down");
				
			}
		}

	};

	var wound_Hyena = function(Hyena, wound){
		Hyena.hp -= wound;
		Hyena.hero_hurt_me = false;
	};

	var change_state = function(Hyena, progress_state) {
		Hyena.AI_state = progress_state;

	};

	// // //Set up Collision handler
	
	
	var begin_contact = function(contact, info){
		//handle collisions here
		
		//console.log(info.Me.id, ":", "My fixture", "'" + info.Me.fixture_name + "'", "came into contact with fixture", 
			//"'" + info.Them.fixture_name + "'", "of", info.Them.id);
		
		var type = info.Me.type;

		if(type !== "Hyena")
			console.log("Error", type, "instead of Hyena with other being", info.Them.type);
		
		
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

module.exports = HyenaLogic;

var Includes = require("../Includes.js"); var include_data = Includes.get_include_data({
	current_module: "HyenaLogic", 
	include_options: Includes.choices.LOGIC_SPECIFIC
}); eval(include_data.name_statements); var include = function(){eval(include_data.module_statements);}
