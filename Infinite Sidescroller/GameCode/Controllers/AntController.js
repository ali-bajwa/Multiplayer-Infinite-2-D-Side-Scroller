//Controller component(AI script)




var AntController = (function()
{

	var init = function(){
		include();
	};

	// // //Set up Collision handler
	/*
	var b2Listener = Box2d.Dynamics.b2ContactListener;

	//Add listeners for contact
	this.listener = new box2d.Dynamics.b2Listener;
	this.listener.BeginContact = function(contact)
		{
		//handle collisions here
		console.log(contact.GetFixtureA().GetBody().GetUserData());
		switch (contact.object_id)
			{

			case 0:
				this.me_hurt_hero = true;
				break;
				
			case 1:
				this.hero_hurt_me = true;
				break;
			}
		
		}

	*/
	//add the new listener to the main listener in PhysicsController
	//PhysicsController.SetContactListener(this.listener);

	//listener.BeginContact = function(contact) 
		//{
		//console.log(contact.GetFixtureA().GetBody().GetUserData());
		//}

	//gameController calls update for each instance
	var get_ant = function(){
		return AntModel;
	};

	var update = function()
		{
		//write your AI script here
		//Do your maintenance here
			//example maintenance: check cooldown

		
		//if enemy is dead, die
		if (AntModel.hp == 1)
			{
				AntModel.change_state("upside-down", 1);
			}
		else if(AntModel.hp <=0 && model.death_tick == 30)
			{

			}

		else if (Antmodel.hp<=0)
			{
				AntModel.body.destroy();
				AntModel.change_state("death", 2);
				AntModel.death_tick++;
			}
		//else move & attack
		else
			{
				
			if(AntModel.AI_state == "walk")
			{
			var Antbody = GameModel.ant.B2d;
			var velocity = Antbody.GetLinearVelocity();
			velocity.x = -AntModel.speed;
			Antbody.SetLinearVelocity(velocity); // body.SetLinearVelocity(new b2Vec2(5, 0)); would work too
			Antbody.SetAwake(true);
			}

			if (AntModel.can_attack && AntModel.me_hurt_hero && model.AI_state == "walk")
				{
				
				AntModel.me_hurt_hero = false;
				}
			if (AntModel.hero_hurt_me)
				{

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

module.export = AntController;

var Includes = require("../Includes.js"); var include_data = Includes.get_include_data({
	current_module: "EnemyController", 
	include_options: Includes.choices.DEFAULT
}); eval(include_data.name_statements); var include = function(){eval(include_data.module_statements);}