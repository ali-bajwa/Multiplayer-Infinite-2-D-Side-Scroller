
//Controller component(AI script)
var AntController = (function() {

	var init = function() {
		include();

		spawn(20, 10);
	};

	var spawn = function(x, y){
		/**
		* spawn ant at given world x and y
		*/

		var new_ant = new AntModel.Ant();
		var id = IdentificationController.assign_id(new_ant);

		new_ant.body = PhysicsController.get_rectangular({x: x, y: y, border_sensors: true, id: id}, "ant");	
		PhysicsController.listen_for_contact_with(id, "BeginContact", begin_contact);

		AntModel.ants[id] = new_ant;

		// TEMPORARY, before mark for new controller 
		AntModel.new_ants[id] = new_ant; 
		
		return new_ant;
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
	
	
	//add the new listener to the main listener in PhysicsController


	//gameController calls update for each instance
	var get_new_ants = function() {
		// TODO: change this terrible thing to 
		// marking all new ants for update
		// through new shiny mark for whatever controller
		// (not implemented yet)
		var result = [];
		var ants = AntModel.new_ants;
		for(var prop in ants){
			if(ants[prop] != null){
				result.push(ants[prop].body);
				ants[prop] = null;
			}

		}
		return result;
	};

	var update = function() {
		//write your AI script here
		//Do your maintenance here
		//example maintenance: check cooldown


		var debug_commands = KeyboardController.debug_commands();

		if(debug_commands("spawn_ant")){
			spawn(Math.random()*50 + 10, 10);
		}

		for(var id in AntModel.ants){
			var ant = AntModel.ants[id];
			if(ant){
				tick_AI(ant);
			}// fi
		} // end for in 
	};

	var tick_AI = function(ant){
		/**
		* tick AI of given ant
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
				GraphicsController.change_ant("upside_down");
			}
		}
	};	

	return {
		init: init,
		update: update,
		get_new_ants: get_new_ants
	};

})();

module.exports = AntController;

var Includes = require("../Includes.js");
var include_data = Includes.get_include_data({
	current_module: "AntController",
	include_options: Includes.choices.DEFAULT
});
eval(include_data.name_statements);
var include = function(){eval(include_data.module_statements);}
