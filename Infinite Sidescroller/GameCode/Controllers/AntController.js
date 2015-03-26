
//Controller component(AI script)
var AntController = (function() {

	var init = function() {
		include();
		//AntModel.ant = PhysicsController.get_rectangular_body(1, 0.5, 600 / 30 + (2.5 / 2), 510 / 30 - (1.5 / 2), true);
		AntModel.ant = PhysicsController.get_rectangular({border_sensors:true,userData: {id: "enemy"}}, "ant");
		ant = AntModel.ant;
		PhysicsController.setup_collision_listener({BeginContact: begin_contact, EndContact: end_contact}, {must_be_involved: ant});
	};

	var change_state = function(progress_state) {
		AntModel.AI_state = progress_state;

	}

	// // //Set up Collision handler
	
	
	var begin_contact = function(contact, info)
		{
		//handle collisions here
		
		var mean_hero;
		if(info.A.body_id == "hero")
		{
			mean_hero = info.A;
			if(mean_hero.fixture != "bottom sensor" && AntModel.can_attack)
			{
				ant.me_hurt_hero = true;
				console.log(contact);
				console.log(info);
			}	
			else
			{

				AntModel.hero_hurt_me = true;
				console.log(contact);
				console.log(info);
			}
		}
		else if(info.B.body_id == "hero")
		{
			mean_hero = info.B;
			if(mean_hero.fixture != "bottom sensor" && AntModel.can_attack)
			{
				ant.me_hurt_hero = true;
				console.log(contact);
				console.log(info);
			}	
			else
			{

				AntModel.hero_hurt_me = true;
				console.log(contact);
				console.log(info);
			}
		}
	};

	var end_contact = function() {

			AntModel.me_hurt_hero = false;

	};
	
	
	//add the new listener to the main listener in PhysicsController


	//gameController calls update for each instance
	var get_ant = function() {
		return AntModel.ant;
	};

	var update = function() {
		//write your AI script here
		//Do your maintenance here
		//example maintenance: check cooldown

		//if enemy is dead, die
		if (AntModel.hp == 1) {
			
			if (AntModel.hero_hurt_me)
			{
				AntModel.hp--;
				AntModel.hero_hurt_me = false;
			}
		} 
		else if (AntModel.hp <= 0 && AntModel.death_tick == 30) {
			//AntModel.ant.DestroyFixture();
			AntModel.death_tick++;
		}
		else if (AntModel.hp <= 0 && AntModel.death_tick > 30){}
		else if (AntModel.hp <= 0) {
			
			change_state("death");
			GraphicsController.change_ant("death");
			console.log("Death Triggered");
			AntModel.death_tick++;
		}
		//else move & attack
	
		else {

			if (AntModel.AI_state == "walk") {
				var Antbody = AntModel.ant;
				var velocity = Antbody.GetLinearVelocity();
				velocity.x = -AntModel.speed;
				Antbody.SetLinearVelocity(velocity); // body.SetLinearVelocity(new b2Vec2(5, 0)); would work too
				Antbody.SetAwake(true);
			}
			if (AntModel.can_attack && AntModel.me_hurt_hero && model.AI_state == "walk") 
			{

				
			}
			if (AntModel.hero_hurt_me)
			{
				AntModel.hp--;
				AntModel.hero_hurt_me = false;
				change_state("upside_down");
				GraphicsController.change_ant("upside_down");
			}
		}
	}


	return {
		init: init,
		update: update,
		get_ant: get_ant
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
