var AntLogic = (function(){

	var Ant = function(){
		/* Will be instantiated for every created entity to hold all the information 
			about the physical (not graphical) state of the entity in question. 
			declare the properties like this:
			this.some_state_variable_initial_value = 0;
			instantiate (most likely in the spawn function) like that:
			var new_entity_instance = new Ant();
		*/

		this.H = 31;//height
		this.W = 50;
		this.sprite_array = [];  //single source for sprites
		
		this.hero_hurt_me = false;
		this.me_hurt_hero = false;
		this.death_tick = 0;

		//set your game logic parameters here
		//this.object_id = 1; //hardcode a unique identifier for each new enemy class
		this.hp = 2;
		this.speed = 4;
		this.damage = 1;
		//this.attack_cooldown = 4; //use this for enemies who need
		this.can_attack = true;//use this for enemies who alternate between 
		//this.cooldown_timer=-1;
		this.AI_state = "walk";//use this to keep track of the enemy's AI state

	};

	var init = function(){
		/* Is ran from the EntityController.init once during game loading 
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
		var id = IdentificationController.assign_id(new_ant);

		new_ant.body = PhysicsController.get_rectangular({x: x, y: y, border_sensors: true}, new_ant);	

		return new_ant;

	};

	var tick_AI = function(ant){
		/* Is ran each tick from the EntityController.update for every registered
			entity of this type. I given entity_instance
		*/

		//if enemy is dead, die
		if (ant.hp == 1) {
			
			if (ant.hero_hurt_me)
			{
				wound_ant(ant, 1);
				ant.hero_hurt_me = false;
			}
		} 
		else if (ant.hp <= 0 && ant.death_tick == 30) {
			//ant.ant.DestroyFixture();
			ant.death_tick++;
		}
		else if (ant.hp <= 0 && ant.death_tick > 30){}
		else if (ant.hp <= 0) {
			
			change_state(ant, "death");
			ant.death_tick++;
			
		}
		//else move & attack
	
		else {

			if (ant.AI_state == "walk") {
				var Antbody = ant.body;
				var velocity = Antbody.GetLinearVelocity();
				velocity.x = -ant.speed;
				Antbody.SetLinearVelocity(velocity); // body.SetLinearVelocity(new b2Vec2(5, 0)); would work too
				Antbody.SetAwake(true);
			}
			if (ant.can_attack && ant.me_hurt_hero && ant.AI_state == "walk") 
			{
				
				
			}
			if (ant.hero_hurt_me)
			{
				wound_ant(ant, 1);
				ant.hero_hurt_me = false;
				change_state(ant, "upside_down");
				
				
			}
		}

	};

	var wound_ant = function(ant, wound){

		ant.hp -= wound;
	}
	var change_state = function(ant, progress_state) {
		ant.AI_state = progress_state;

	}

	// // //Set up Collision handler
	
	
	var begin_contact = function(contact, info){
		//handle collisions here
		
		//console.log(info.Me.id, ":", "My fixture", "'" + info.Me.fixture_name + "'", "came into contact with fixture", 
			//"'" + info.Them.fixture_name + "'", "of", info.Them.id);

		
		//console.log(info.Me);
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
	
			info.Me.entity.me_hurt_hero = false;

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
