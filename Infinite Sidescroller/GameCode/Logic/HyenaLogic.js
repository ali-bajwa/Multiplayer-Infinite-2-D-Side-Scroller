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

		//Declare initial variables for the Hyena
	
		entity.hp = 2;
		entity.speed = 7;
		entity.jump_force = 125;
		entity.damage = 5;
		entity.point_value = 200;
		entity.sight_range = 16; //distance at which hyena detects heroes
		entity.attack_range = 8; //distance at which hyena leaps at the hero
		
		entity.hit_taken = false; //whether a hit has been taken since the last tick
		entity.damage_taken = 0; //the amount of damage inflicted by hits since the last tick
		
		entity.direction = false;	//false=left, true=right;
		entity.direction_previous = false;//store direction from end of previous tick
		entity.x_previous = 0;		//store x value from end of previous tick
		
		entity.is_idle = true; //determines whether hyena is aggressive or idle
		entity.idle_duration = 40; // time buffer between changing idle states
		entity.idle_timer = entity.idle_duration;
		entity.idle_counter = 0; //used to manage the number of times the hyena has changed state while idle
		entity.is_alive = true; //disables attacking and plays death animation while false
		entity.death_duration = 30;//time between death and deletion
		entity.decay_duration = 20;//time between decay animation and deletion
		entity.death_timer = -1;
		entity.running_away = false; //whether the hyena is running away
		entity.run_away_duration = 30; //set cowardice level
		entity.run_away_timer = -1;
		entity.can_attack = true;	//whether attacking is enabled
		entity.attack_cooldown = 10; //attack cooldown
		entity.attack_cooldown_timer = -1;
		entity.can_leap = true;		//leaping enabled
		entity.leap_cooldown = 40;//minimum time between leaps
		entity.leap_cooldown_timer = -1; 
		entity.charge_duration = 80;//maximum length of a charge
		entity.charge_timer = entity.charge_duration;
		entity.charge_cooldown = 20;//minimum time between charges
		entity.charge_cooldown_timer = -1;
		entity.blinking = false;	//whether hyena is blinking
		entity.blink_duration = 20;//how long the hyena blinks after taking damage
		entity.blink_timer = -1;
		entity.maintenance_frequency = 20;//ticks between routine maintenance checks
		entity.maintenance_timer = entity.maintenance_frequency;
		
		entity.barely_obstructed = false;
		entity.collision_buffer = 0.2	//the region of overlap accounted for during collision checking
		entity.path_blocked = false;	//is entity deprecated? set during collision
		entity.obstruction_tolerance = 4;//how many times the hyena can be blocked before he takes action
		entity.blocked_count = 0;			//tracks number of times blocked between maintenance checks
		
		entity.needs_graphics_update = false; //accessed by renderer for animation purposes
		entity.animation = "stand"; //accessed by renderer for animation purposes
		
		return entity;
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
		//If Hyena is close to the movement edge, leap away
		if (Hyena.body.GetWorldCenter().x <= WorldController.get_movement_edge() + 1.125){
			Hyena.jump(Hyena.jump_force, 0);
		}
		if (Hyena.hp <= 0){//if mortally wounded
			Hyena.die(); //die
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
					Hyena.direction = Hyena.direction_nearest_enemy();
					Hyena.running_away = false;
				}
			}
			//check periodically to ensure the hyena is not stuck in a corner and other routine maintenance
			Hyena.maintenance_timer--;
			if (Hyena.maintenance_timer == 0){
				if (Hyena.path_free()){
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
			if(!Hyena.in_air() || Hyena.body.GetLinearVelocity().y == 0){ //if on ground OR if we suspect he's stuck on a corner
				if (Hyena.enemy_in_range(Hyena.sight_range)){ //if enemy nearby
					Hyena.idle = false;
					if (Hyena.hit_taken){	//if hyena was attacked,
						Hyena.running_away = true;	//back off
						Hyena.run_away_timer = Hyena.run_away_duration;
						Hyena.direction = !(Hyena.direction);
					}else if ((Hyena.enemy_in_range(Hyena.attack_range) || Hyena.path_blocked) && Hyena.can_leap && Hyena.leap_cooldown_timer <= 0){ //if enemy in range or path is blocked, and leaping is enabled, leap
						Hyena.direction = Hyena.direction_nearest_enemy();
						leap(Hyena);
						Hyena.can_leap = false;
						Hyena.leap_cooldown_timer = Hyena.leap_cooldown;
						Hyena.change_animation("leap");
					}else{
						if(!Hyena.running_away && !Hyena.in_air()){ //if hyena isn't cowering or in the air, face the enemy
							Hyena.direction = Hyena.direction_nearest_enemy();
						}
						if (Hyena.charge_timer > 0){ //if charge duration > 0
							run(Hyena);
							Hyena.change_animation("run"); //charge the enemy
							Hyena.charge_timer--;
							if(Hyena.charge_timer == 0){
								Hyena.charge_cooldown_timer = Hyena.charge_cooldown;
							}
							if(Hyena.x_previous == Hyena.body.GetWorldCenter().x){ //check if hyena has moved successfully
								Hyena.blocked_count++;
							}
						}else{//else stand aggressively
							Hyena.change_animation("stand");
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
						Hyena.change_animation("walk");//pace
						if(Hyena.x_previous == Hyena.body.GetWorldCenter().x){ //check if hyena has wandered successfully
							Hyena.blocked_count++; //else check for being stuck
						}
					}else{
						Hyena.change_animation("stand");//loiter
					}
				}
			}else{//if in the air
				if(Hyena.movement_voluntary()){
					Hyena.change_animation("leap");//if voluntary, leap
				}else{
					Hyena.change_animation("fall");//else, fall
				}
			}
			if (Hyena.hit_taken){
				Hyena.take_damage(); //if hit, take damage
			}
		}
	};
//...........................END............................\\
//........................ARTIFICIAL........................\\
//.......................INTELLIGENCE.......................\\


//.....................HELPER FUNCTIONS......................
	
	
	//run
	var run = function(hyena){
		hyena.move(hyena.speed);
	};
	
	//walk
	var walk = function(hyena){
		hyena.move(hyena.speed/3);
	};
	
	//leap
	var leap = function(hyena){
		if (hyena.path_blocked){//jump out of a hole or over a wall
			hyena.jump(-10+(20*hyena.direction), -1*hyena.jump_force);
		}else{ //leap viciously at hero
			hyena.jump((2*hyena.jump_force*hyena.direction) - hyena.jump_force, -1*hyena.jump_force/2);
		}
		hyena.can_leap = false;
	};
	

//......................COLLISION HANDLERS...........................
	//called at the beginning of the collision
	var begin_contact = function(contact, info){
		var type = info.Me.type;
		var hyena = info.Me.entity;
		var hyena_x = hyena.body.GetWorldCenter().x;
		var hyena_y = hyena.body.GetWorldCenter().x;
		var hyena_w = 1.125; //half width of hyena
		var hyena_h = 0.875; //half the height of hyena
		var other_x = info.Them.entity.body.GetWorldCenter().x;
		var other_y = info.Them.entity.body.GetWorldCenter().y;
		var other_w = hyena.get_fixture(info.Them.entity,"main").GetAABB().GetExtents().x;
		var other_h = hyena.get_fixture(info.Them.entity,"main").GetAABB().GetExtents().y;
		
		/**
		(hyena_w + other_w + buffer) = minimum horizontal distance for non-vertically stacked entities
		abs(them.x - me.x) = absolute horizontal distance
		(abs_hdistance < min_hdistance) implies vertical stacking
		
		(hyena_h + other_h + buffer) = minimum vertical distance for non-adjacent entities
		(abs_vdistance < min_vdistance) implies adjacency
		
		(hyena.x - other.x) < 0 if (hyena.x < other.x)
		(hyena.x - other.x) = 0 if (hyena.x = other.x)
		(hyena.x - other.x) > 0 if (hyena.x > other.x)
		smaller x is to the left of bigger x
		smaller y is above bigger y
		0 = left;
		1 = right;
		((hyena.x - other.x) > 0) returns true if hyena is to the right of the enemy, else false
		((hyena.x - other.x) < 0) returns true if other is to the right of hyena, else false
		
		((hyena.y - other.y) > 0) returns true if hyena is below the enemy (hyena_y > other_y), else false
		((hyena.y - other.y) < 0) returns true if other is above hyena(hyena_y < other_y), else false
		*/
		
		//ultimate collision detector
		if (info.Me.fixture_name == "main"){
			//if adjacent
			if (Math.abs(hyena_y - other_y) < (hyena_h + other_h - hyena.collision_buffer)){ //if adjacent
				if ((hyena_h+other_h) - (other_y-hyena_y) < hyena.collision_buffer){//if the hyena is close enough to the top that he could almost walk over it...
					hyena.barely_obstructed = true;//call for a tiny bump
				}else{
					hyena.blocked_count++; //else call for a real jump
					hyena.path_blocked = true;
				}
				if (info.Them.type == "hero"){//if other = hero, deal damage
					if(hyena.can_attack){
						hyena.attack_cooldown_timer = hyena.attack_cooldown;//set cooldown timer
					}
				}
			}else{
				//if other is below
				if(true){}
					//reset jump
					//if hero, deal damage
				
				//if other is above:
					//if hero, take damage
			}
		}
		
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
