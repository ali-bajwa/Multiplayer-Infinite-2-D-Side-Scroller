
//Controller component(AI script)
var AntController = (function() {

	var init = function() {
		include();
		//AntModel.ant = PhysicsController.get_rectangular_body(1, 0.5, 600 / 30 + (2.5 / 2), 510 / 30 - (1.5 / 2), true);
		AntModel.ant = PhysicsController.get_rectangular({userData: {id: "ant", state: AntModel.AI_state}}, "ant");
		ant = AntModel.ant;
	};

	var change_state = function(progress_state) {
		AntModel.AI_state = {ant: progress_state};

	}

	// // //Set up Collision handler
	
	
	var begin_contact = function(contact, info)
		{
		//handle collisions here
		console.log(contact);
		console.log(info);
		var mean_hero;
		if(info.A.body_id == "hero")
		{
			mean_hero = info.A;
		}
		else if(info.B.body_id == "hero")
		{
			mean_hero = info.B;
		}

		switch (mean_hero.fixture)
			{

			case !"bottom":
				this.me_hurt_hero = true;
				break;
				
			case "bottom":
				this.hero_hurt_me = true;
				break;
			}
		
		};
	PhysicsController.setup_collision_listener({BeginContact: begin_contact}, {must_be_involved: ant});

	//add the new listener to the main listener in PhysicsController
	//PhysicsController.SetContactListener(this.listener);

	//listener.BeginContact = function(contact) 
	//{
	//console.log(contact.GetFixtureA().GetBody().GetUserData());
	//}

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
			change_state("upside_down");
		} else if (AntModel.hp <= 0 && model.death_tick == 30) {

		} else if (AntModel.hp <= 0) {
			AntModel.body.destroy();
			change_state("death");
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
