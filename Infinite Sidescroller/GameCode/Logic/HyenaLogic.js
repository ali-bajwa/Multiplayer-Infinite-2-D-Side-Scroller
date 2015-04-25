/* 
	Enemy: Hyena 
	class and functions for the Hyena type enemy
	public functions:
		-init()
			initializes default class data for all instances of class Hyena
		-spawn(int x, int y)
			returns a new instance of class Hyena with unique instance ID at global coordinates(x,y)
		-tick_AI()
			runs hyena AI script, to be called for each instance on game tick
		-begin_contact()
			handles collisions, called on collision with any object
		-end_contact()
			callback function for box2d
*/

var HyenaLogic = (function(){
	//Instantiated for each instance of hyena at creation
	//call constructor through wrapper function spawn()
	var Hyena = function(){

		var entity = EntityController.create_abstract_entity();
		entity.my_property = "dsfjsdl";
		
		
		
		return entity;
		//Declare initial variables for the Hyena
		/*
		this.hp = 2;
		this.speed = 7;
		this.jump_force = 125;
		this.damage = 5;
		this.point_value = 200;
		this.sight_range = 16; //distance at which hyena detects heroes
		this.attack_range = 8; //distance at which hyena leaps at the hero
		
		this.hit_taken = false; //whether a hit has been taken since the last tick
		this.damage_taken = 0; //the amount of damage inflicted by hits since the last tick
		
		this.direction = false;	//false=left, true=right;
		this.direction_previous = false;//store direction from end of previous tick
		this.x_previous = 0;		//store x value from end of previous tick
		
		this.is_idle = true; //determines whether hyena is aggressive or idle
		this.idle_duration = 40; // time buffer between changing idle states
		this.idle_timer = this.idle_duration;
		this.idle_counter = 0; //used to manage the number of times the hyena has changed state while idle
		this.is_alive = true; //disables attacking and plays death animation while false
		this.death_duration = 30;//time between death and deletion
		this.decay_duration = 20;//time between decay animation and deletion
		this.death_timer = -1;
		this.running_away = false; //whether the hyena is running away
		this.run_away_duration = 30; //set cowardice level
		this.run_away_timer = -1;
		this.can_attack = true;	//whether attacking is enabled
		this.attack_cooldown = 10; //attack cooldown
		this.attack_cooldown_timer = -1;
		this.can_leap = true;		//leaping enabled
		this.leap_cooldown = 40;//minimum time between leaps
		this.leap_cooldown_timer = -1; 
		this.charge_duration = 80;//maximum length of a charge
		this.charge_timer = this.charge_duration;
		this.charge_cooldown = 20;//minimum time between charges
		this.charge_cooldown_timer = -1;
		this.blinking = false;	//whether hyena is blinking
		this.blink_duration = 20;//how long the hyena blinks after taking damage
		this.blink_timer = -1;
		this.maintenance_frequency = 20;//ticks between routine maintenance checks
		this.maintenance_timer = this.maintenance_frequency;
		
		this.path_blocked = false;//is this deprecated? set during collision
		this.obstruction_tolerance = 4;//how many times the hyena can be blocked before he takes action
		this.blocked_count = 0;//tracks number of times blocked between maintenance checks
		
		this.needs_graphics_update = false; //accessed by renderer for animation purposes
		this.animation = "stand"; //accessed by renderer for animation purposes
		*/
	};

	//Initialize class variables, called once in EntityController.init() during game load
	var init = function(){
		include(); // satisfy requirements, GOES FIRST
		IdentificationController.assign_type(Hyena, "Hyena"); //assign class id
	};

	//Instantiates class Hyena
	//Wrapper for constructor, assigns unique ID
	var spawn = function(x, y){
		var new_hyena = new Hyena();
		new_hyena.type = "Hyena";
		var id = IdentificationController.assign_id(new_hyena);

		new_hyena.body = PhysicsController.get_rectangular({x: x, y: y, border_sensors: true}, new_hyena);	
		new_hyena.PhysicsController = PhysicsController;
		
		return new_hyena;
	};
	
//........................COMMENCE.........................\\
//.......................ARTIFICIAL........................\\
//.........................HYENA...........................\\
//......................INTELLIGENCE.......................\\
	
	// Is run each tick from the EntityController.update for every registered instance
	var tick_AI = function(Hyena){
		//Check if Dead........
		//If Hyena is off the screen, delete
		if (Hyena.body.GetWorldCenter().x <= WorldController.get_movement_edge() + 1.125){
			Hyena.body.ApplyImpulse(new B2d.b2Vec2(Hyena.jump_force, 0), Hyena.body.GetWorldCenter());
		}
		if (Hyena.hp <= 0){//if mortally wounded
			Hyena.die(Hyena); //die
		}else{ // Do Live Hyena Stuff
			//Maintenance....
			Hyena.direction_previous = Hyena.direction;				//remember what hyena's direction was at start of tick
			Hyena.x_previous = Hyena.body.GetWorldCenter().x; //remember what hyena's x was at start of tick
			Hyena.leap_cooldown_timer--;			//ensure the hyena is not eternally jumping
			//maintain blinking
			if(Hyena.blinking){
				Hyena.blink_timer--;
				if(Hyena.blink_timer == 0){
					Hyena.blinking = false;
				}
			}
			//maintain attack cooldown
			if(Hyena.attack_cooldown_timer > 0){ 
				Hyena.attack_cooldown_timer--;
				Hyena.can_attack = (Hyena.attack_cooldown_timer == 0);
			}
			//maintain the hyena's alternating phases of running and stopping
			if(Hyena.charge_timer <= 0){
				Hyena.charge_cooldown_timer--;
				if (Hyena.charge_cooldown_timer <= 0){
					Hyena.charge_timer = Hyena.charge_duration;
				}
			}
			//maintain the hyena's cowardly tactics
			if (Hyena.running_away){	//if hyena is deliberately running away
				Hyena.run_away_timer--;	//tickdown run_away timer
				if (Hyena.run_away_timer == 0){ //maybe stop running away
					Hyena.run_away_timer = -1;
					Hyena.direction = Hyena.direction_nearest_enemy(Hyena);
					Hyena.running_away = false;
				}
			}
			//check periodically to ensure the hyena is not stuck in a corner and other routine maintenance
			Hyena.maintenance_timer--;
			if (Hyena.maintenance_timer == 0){
				if (Hyena.path_free(Hyena)){
					Hyena.path_blocked = false;
				}
				if (Hyena.blocked_count > Hyena.obstruction_tolerance){	//you know he's stuck now
					if (Hyena.can_leap){
						Hyena.path_blocked = true;
						leap(Hyena);	//time to jump for it
						Hyena.path_blocked = false;
					}
				}
				Hyena.blocked_count = 0;
				Hyena.maintenance_timer = Hyena.maintenance_frequency; //reset check timer
			}
			//Run Main AI Script.....
			if(!Hyena.in_air(Hyena) || Hyena.body.GetLinearVelocity().y == 0){ //if on ground OR if we suspect he's stuck on a corner
				if (Hyena.enemy_in_range(Hyena,Hyena.sight_range)){ //if enemy nearby
					Hyena.idle = false;
					if (Hyena.hit_taken){	//if hyena was attacked,
						Hyena.running_away = true;	//back off
						Hyena.run_away_timer = Hyena.run_away_duration;
						Hyena.direction = !(Hyena.direction);
					}else if ((Hyena.enemy_in_range(Hyena,Hyena.attack_range) || Hyena.path_blocked) && Hyena.can_leap && Hyena.leap_cooldown_timer <= 0){ //if enemy in range or path is blocked, and leaping is enabled, leap
						Hyena.direction = Hyena.direction_nearest_enemy(Hyena);
						leap(Hyena);
						Hyena.can_leap = false;
						Hyena.leap_cooldown_timer = Hyena.leap_cooldown;
						Hyena.change_animation(Hyena,"leap");
					}else{
						if(!Hyena.running_away && !Hyena.in_air(Hyena)){ //if hyena isn't cowering or in the air, face the enemy
							Hyena.direction = Hyena.direction_nearest_enemy(Hyena);
						}
						if (Hyena.charge_timer > 0){ //if charge duration > 0
							run(Hyena);
							Hyena.change_animation(Hyena,"run"); //charge the enemy
							Hyena.charge_timer--;
							if(Hyena.charge_timer == 0){
								Hyena.charge_cooldown_timer = Hyena.charge_cooldown;
							}
							if(Hyena.x_previous == Hyena.body.GetWorldCenter().x){ //check if hyena has moved successfully
								Hyena.blocked_count++;
							}
						}else{//else stand aggressively
							Hyena.change_animation(Hyena,"stand");
						}
					}
				}else{
					Hyena.idle = true; //idle mode
					Hyena.idle_timer--;
					if (Hyena.idle_timer == 0){
						Hyena.idle_timer = Hyena.idle_duration;
						Hyena.idle_counter = (Hyena.idle_counter+1)%27;
						if (Hyena.idle_counter%4 == 0 && Hyena.idle_counter%5 != 0){
							Hyena.direction = !(Hyena.direction);//use weird modulos to get random looking idle behavior
						}
					}
					if (Hyena.idle_counter%2 == 0 || Hyena.idle_counter%3 == 0){ //use weird modulos to get random looking idle behavior
						walk(Hyena);
						Hyena.change_animation(Hyena,"walk");//pace
						if(Hyena.x_previous == Hyena.body.GetWorldCenter().x){ //check if hyena has wandered successfully
							Hyena.blocked_count++; //else check for being stuck
						}
					}else{
						Hyena.change_animation(Hyena,"stand");//loiter
					}
				}
			}else{//if in the air
				if(Hyena.movement_voluntary(Hyena)){
					Hyena.change_animation(Hyena,"leap");//if voluntary, leap
				}else{
					Hyena.change_animation(Hyena,"fall");//else, fall
				}
			}
			if (Hyena.hit_taken){
				Hyena.take_damage(Hyena); //if hit, take damage
			}
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
		velocity.x = hyena.speed*(2*hyena.direction-1); //move speed in current direction
		body.SetLinearVelocity(velocity);
		body.SetAwake(true);
	};
	
	//walk
	var walk = function(hyena){
		var body = hyena.body;
		var velocity = body.GetLinearVelocity();
		velocity.x = hyena.speed*(2*hyena.direction-1)/3;
		body.SetLinearVelocity(velocity);
		body.SetAwake(true);
	};
	
	//leap
	var leap = function(hyena){
		var body = hyena.body;
		if (hyena.path_blocked){//jump out of a hole or over a wall
			body.ApplyImpulse(new B2d.b2Vec2(-10+(20*hyena.direction), -1*hyena.jump_force), body.GetWorldCenter());
			//var a = (100 - (hyena.direction*20))*Math.PI/180;
		}else{ //leap viciously at hero
			body.ApplyImpulse(new B2d.b2Vec2((2*hyena.jump_force*hyena.direction) - hyena.jump_force, -1*hyena.jump_force/2), body.GetWorldCenter());
			//var a = Math.atan(body.GetWorldCenter().y - pconf.hero_y, body.GetWorldCenter().x - pconf.hero_x);
		}
		//body.ApplyImpulse(new B2d.b2Vec2(hyena.jump_force*Math.sin(a), hyena.jump_force*Math.cos(a)), body.GetWorldCenter());
		hyena.can_leap = false;
	};
	

//......................COLLISION HANDLERS...........................
	//called at the beginning of the collision
	var begin_contact = function(contact, info){
		var type = info.Me.type;
		var hyena = info.Me.entity;
		var hyena_x = hyena.body.GetWorldCenter().x;
		var hyena_y = hyena.body.GetWorldCenter().x;
		
		var vulnerability_radius = (1.125 + 0.45 - 0.3);// hyena_width/2 + hero_width/2 - buffer, in meters
		//if bottom colliding with the ground or top of another object, enable leap
		if (info.Me.fixture_name == "bottom" && (info.Them.fixture_name == "top" || info.Them.entity.kind == 1 || info.Them.entity.kind == 2)){
			hyena.can_leap = true;
		}
		
		//if colliding with a wall, detect blocked path
		if ((info.Me.fixture_name == "left" && !hyena.direction)||(info.Me.fixture_name == "right" && hyena.direction)){
			hyena.path_blocked = true;
			hyena.blocked_count++;
		}
		
		//if colliding with a player, check for damage
		if(info.Them.type == "hero"){
			if(info.Them.fixture_name != "bottom"){ //if can_attack and colliding with a fixture other than "bottom"
				if(hyena.can_attack){
					hyena.attack_cooldown_timer = hyena.attack_cooldown;//set cooldown timer
				}
			}else if(Math.abs(info.Them.entity.body.GetWorldCenter().x - hyena.body.GetWorldCenter().x) < vulnerability_radius && !hyena.blinking){
				hyena.hit_taken = true;//take damage if enemy collides from above and distance < vulnerability radius
				hyena.damage_taken = info.Them.entity.damage;
			}
		}
	};

	//called upon end of collision
	var end_contact = function(contact, info){
		
	};


//.................DECLARE PUBLIC FUNCTIONS.....................
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
