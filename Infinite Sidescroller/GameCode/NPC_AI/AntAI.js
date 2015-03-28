var AntAI = (function(){
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
			if (ant.can_attack && ant.me_hurt_hero && model.AI_state == "walk") 
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
	

	return {
		tick_AI: tick_AI	
	};
})();

module.exports = AntAI;
