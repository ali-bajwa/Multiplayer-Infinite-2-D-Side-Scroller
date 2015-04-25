var EntityModel = function(){	
	// associates type with the AI
	this.type_to_AI = {};

	this.for_logic_update = {}; // key: type, value: table of objects with id for key, object for value
	
	
	this.AbstractEntity = function(){
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
		
		this.jump = function(){};
	};

};

module.exports = new EntityModel;

