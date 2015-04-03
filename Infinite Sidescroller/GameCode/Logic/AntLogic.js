var AntAI = (function(){

	var Ant = function(){
		//define your constants here
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

	var IdentificationController, PhysicsController, RegisterAsController;

	var init = function(imports){
		/**
		* initialize and register stuff
		*/

		IdentificationController = imports.IdentificationController;
		PhysicsController = imports.PhysicsController;
		RegisterAsController = imports.RegisterAsController;

		IdentificationController.assign_type(Ant, "ant");	
	};
	

	var spawn = function(x, y){
		/**
		* spawn ant
		*/

		var new_ant = new Ant();
		var id = IdentificationController.assign_id(new_ant);

		new_ant.body = PhysicsController.get_rectangular({x: x, y: y, border_sensors: true}, new_ant);	

		// listen for type, put shit into the EnemyController
		PhysicsController.listen_for_contact_with(id, "BeginContact", begin_contact);
		PhysicsController.listen_for_contact_with(id, "EndContact", end_contact);
		return new_ant;

	};
	
	var wound_ant = function(ant, wound){

		ant.hp -= wound;
	}

	var tick_AI = function(ant, Stuff){
		/**
		* tick the AI for the given ant
		* gets instance of the ant and
		* >Stuff< which is object containing functions you need
		* and other stuff
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
				info.Them.entity.hp--;
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
		tick_AI: tick_AI,
		spawn: spawn,
		init: init,
		end_contact: end_contact,
		begin_contact: begin_contact
	};
})();

module.exports = AntAI;
