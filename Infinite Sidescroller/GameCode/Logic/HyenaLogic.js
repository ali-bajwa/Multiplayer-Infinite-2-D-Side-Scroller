var HyenaLogic = (function(){

/* 
	Enemy: Hyena 
	class and functions for the hyena type enemy
	public functions:
		-init()
			initializes class data for all instances of class Hyena
		-spawn()
			returns a new instance of class Hyena
		-tick_AI()
			runs hyena AI script, to be called for each instance on game tick
*/

	//Instantiated for each instance of hyena at creation
	//call constructor through wrapper function spawn()
	var Hyena = function(){
		this.hero_hurt_me = false;
		this.me_hurt_hero = false;
		

		//set your game logic parameters here
		//this.object_id = 1; //hardcode a unique identifier for each new enemy class
		this.hp = 2;
		this.speed = 6;
		this.damage = 1;
		
		this.death_tick = 0;
		this.AI_state = 0;	//0 = idle; 1 = engaged; 2 = other
		this.direction = false;	//false=left, true=right;
		this.can_attack = true;	//attacking enabled
		this.attack_cooldown_timer = -1; 
		this.can_leap = true;		//leaping enabled
		this.leap_cooldown = 30;
		this.path_blocked = false;
		this.recently_attacked = false; //if the hyena has recently attacked
		this.blinking = false;	//whether hyena is blinking
		this.blink_timer = -1;	//tracks blink time
		this.check_timer = 20;
		//this.aliveflag = true;
		this.unhurtflag = true;
		
		this.needs_graphics_update = false;
		this.animation = "stand";
	};

	//initialize class variables, called once in EntityController.init during game load
	var init = function(){
		include(); // satisfy requirements, GOES FIRST
		IdentificationController.assign_type(Hyena, "Hyena"); //assign class id
	};

	//instantiates class Hyena
	//wrapper for constructor and assigns unique ID
	var spawn = function(x, y){
		var new_hyena = new Hyena();
		var id = IdentificationController.assign_id(new_hyena);

		new_hyena.body = PhysicsController.get_rectangular({x: x, y: y, border_sensors: true}, new_hyena);	

		return new_hyena;
	};
	
//........................COMMENCE.........................\\
//.......................ARTIFICIAL........................\\
//.........................HYENA...........................\\
//......................INTELLIGENCE.......................\\
	
	// Is run each tick from the EntityController.update for every registered instance
	var tick_AI = function(Hyena){
		
		//if hyena is dead, die
		if (Hyena.body.GetWorldCenter().y > 22 || Hyena.body.GetWorldCenter().x < Config.Player.movement_edge - 1){
			EntityController.delete_entity(Hyena);
			console.log("drop of death");
		}
		if (Hyena.hp == 1) {
			
			if (Hyena.hero_hurt_me){
				wound_Hyena(Hyena, 1);
				Hyena.hero_hurt_me = false;
				Hyena.can_attack = false;
				change_animation(Hyena,"quincy");
			}
		}else if (Hyena.hp <= 0){
			Hyena.can_attack = false;
			Hyena.death_tick++;
			if (Hyena.death_tick == 5){
				change_animation(Hyena,"decay");
				return 
			}
			if(Hyena.death_tick == 20){
				EntityController.delete_entity(Hyena);
				return 
			}
		}else{ // Do live Hyena stuff
				Hyena.leap_cooldown--;
				Hyena.check_timer--;
				if (Hyena.check_timer == 0){
					if (path_free(Hyena)){
						Hyena.path_blocked = false;
					}
					Hyena.check_timer = 40;
				}
				if(!in_air(Hyena) || Hyena.body.GetLinearVelocity().y == 0){ //if on ground OR if we suspect he's stuck on a corner
					if (enemy_nearby(Hyena)){
						if (Hyena.recently_attacked){
							//back off
						}
						else if ((enemy_in_range(Hyena) || Hyena.path_blocked) && Hyena.can_leap && Hyena.leap_cooldown <= 0){
							//TO DO: face nearest player
							leap(Hyena);
							Hyena.can_leap = false;
							Hyena.leap_cooldown = 30;
							change_animation(Hyena,"leap");
						}else{
							//TO DO: face nearest player
							run(Hyena);
							change_animation(Hyena,"run");
						}
					}else{
						//idle
						//tick down idle timer
						//alternate between pacing and loitering
					}
				}else{//if in the air
					if(movement_voluntary(Hyena)){		//if leaping
						change_animation(Hyena,"leap");
					}else{//else fall
						change_animation(Hyena,"fall");
					}
				}
			}
			if (Hyena.can_attack && Hyena.me_hurt_hero && !in_air(Hyena)){
				// pass
			}
			if (Hyena.hero_hurt_me)
			{
				wound_Hyena(Hyena, 1);
				Hyena.hero_hurt_me = false;
				Hyena.can_attack = false;
				
			}
	};
//...........................END............................\\
//........................ARTIFICIAL........................\\
//.......................INTELLIGENCE.......................\\


//.....................HELPER FUNCTIONS......................
	
	//run
	var run = function(hyena){
		var body = hyena.body;
		var velocity = body.GetLinearVelocity();
		velocity.x = hyena.speed*(2*hyena.direction-1);
		body.SetLinearVelocity(velocity);
		body.SetAwake(true);
	};
	
	//leap
	var leap = function(hyena){
		var body = hyena.body;
		if (hyena.path_blocked){
			body.ApplyImpulse(new B2d.b2Vec2(-10+(20*hyena.direction), -100), body.GetWorldCenter());
			hyena.can_leap = false;
		}else{
		body.ApplyImpulse(new B2d.b2Vec2(-100+(200*hyena.direction), -50), body.GetWorldCenter());
		}
	};
	
	//decrease health
	var wound_Hyena = function(Hyena, wound){
		Hyena.hp -= wound;
		Hyena.hero_hurt_me = false;
	};

	//change the state of the hyena (deprecated)
	var change_state = function(Hyena, progress_state) {
		Hyena.AI_state = progress_state;
	};

	//checks for nearby enemies
	var enemy_nearby = function(hyena){
		return true;
	};

	//checks for nearby enemies
	var enemy_in_range = function(hyena){
		return true;
	};

	var movement_voluntary = function(hyena){
		//negative speed = moving left
		var output = false;
		var velocity = hyena.body.GetLinearVelocity().x;
		if(velocity != 0){
			output = (velocity/Math.abs(velocity) == (hyena.direction)*2-1);
		}
		return output;
	};

	//checks if in the air
	var in_air = function(hyena){
		var body = hyena.body;
		var objects_beneath;
		if (body.GetFixtureList() != null){//prevent bugs on destruction
			var AABB = body.GetFixtureList().GetNext().GetNext().GetAABB();
			objects_beneath = PhysicsController.query_aabb(AABB);
		}else{
			objects_beneath = 0;
		}
		return (objects_beneath<4);
	};

	var path_free = function(hyena){
		var body = hyena.body;
		var objects_before;
		var AABB;
		if (body.GetFixtureList() != null){//prevent bugs on destruction
			if (hyena.direction){
				AABB = body.GetFixtureList().GetAABB();
				objects_before = PhysicsController.query_aabb(AABB);
			}else{
				AABB = body.GetFixtureList().GetNext().GetAABB();
				objects_before = PhysicsController.query_aabb(AABB);
			}
		}else{
			objects_before = 0;
		}
		return (objects_before<4);
	};

	var change_animation = function(hyena,animation){
		if(hyena.animation != animation){
			hyena.animation = animation;
			hyena.needs_graphics_update = true;
		}else{ 
			hyena.needs_graphics_update = false;
		}
	};



//......................COLLISION HANDLERS...........................
	//handle collisions here
	var begin_contact = function(contact, info){
		var type = info.Me.type;
		
		//throw error if type is not hyena
		if(type != "Hyena"){
			console.log("Error", type, "instead of Hyena with other being", info.Them.type);
		}
		
		//if colliding with the ground, enable leap
		if (info.Me.fixture_name == "bottom"){
			info.Me.entity.can_leap = true;
		}
		
		//if colliding with a wall, detect blocked path
		if ((info.Me.fixture_name == "left" && !info.Me.direction)||(info.Me.fixture_name == "left" && info.Me.direction)){
			info.Me.entity.path_blocked = true;
		}
		
		if(info.Them.type == "hero"){
			if(info.Them.fixture_name != "bottom" && info.Me.entity.can_attack){
				info.Me.entity.me_hurt_hero = true;
			}else{
				info.Me.entity.hero_hurt_me = true;
			}
		}
	};

	//called upon end of collision
	var end_contact = function(contact, info){
	
	};

//declare the following functions public
	return {
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
