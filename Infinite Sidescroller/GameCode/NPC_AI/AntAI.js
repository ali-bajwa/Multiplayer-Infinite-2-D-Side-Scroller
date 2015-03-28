var AntAI = (function(){
	var Ant = function(){
		this.id = null;
		this.type = null;
		this.body = null;
		//define your constants here
		this.H = 31;//height
		this.W = 50;
		this.sprite_array = [];  //single source for sprites
		this.type = "enemy";
		
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

	var init = function(IdentificationController){
		/**
		* initialize and register stuff
		*/
		IdentificationController.assign_type(Ant, "ant");	
	};
	

	var spawn = function(x, y, IdentificationController, PhysicsController, EnemyModel){
		/**
		* spawn ant
		*/
		var new_ant = new Ant();
		var id = IdentificationController.assign_id(new_ant);

		new_ant.body = PhysicsController.get_rectangular({x: x, y: y, border_sensors: true, id: id}, "ant");	
		PhysicsController.listen_for_contact_with(id, "BeginContact", begin_contact);

		EnemyModel.ants[id] = new_ant;

		// TEMPORARY, before mark for new controller 
		EnemyModel.new_ants[id] = new_ant; 
		
		return new_ant;

	};
	
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
				ant.hp--;
				ant.hero_hurt_me = false;
			}
		} 
		else if (ant.hp <= 0 && ant.death_tick == 30) {
			//ant.ant.DestroyFixture();
			ant.death_tick++;
		}
		else if (ant.hp <= 0 && ant.death_tick > 30){}
		else if (ant.hp <= 0) {
			
			change_state("death");
			GraphicsController.change_ant("death");
			console.log("Death Triggered");
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
			if (ant.can_attack && ant.me_hurt_hero && model.AI_state == "walk") 
			{

				
			}
			if (ant.hero_hurt_me)
			{
				ant.hp--;
				ant.hero_hurt_me = false;
				change_state("upside_down");
				//GraphicsController.change_ant("upside_down");
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

		
		//var mean_hero;
		//if(info.A.body_id == "hero")
		//{
			//mean_hero = info.A;
			//if(mean_hero.fixture != "bottom sensor" && AntModel.can_attack)
			//{
				//ant.me_hurt_hero = true;
			//}	
			//else
			//{

				//AntModel.hero_hurt_me = true;
			//}
		//}
		//else if(info.B.body_id == "hero")
		//{
			//mean_hero = info.B;
			//if(mean_hero.fixture != "bottom sensor" && AntModel.can_attack)
			//{
				//ant.me_hurt_hero = true;
			//}	
			//else
			//{

				//AntModel.hero_hurt_me = true;
			//}
		//}
	};

	var end_contact = function(contact, oldManifold, info) {

			AntModel.ants[info.Me.id].me_hurt_hero = false;

	};

	return {
		tick_AI: tick_AI,
		spawn: spawn,
		init: init,
	};
})();

module.exports = AntAI;
