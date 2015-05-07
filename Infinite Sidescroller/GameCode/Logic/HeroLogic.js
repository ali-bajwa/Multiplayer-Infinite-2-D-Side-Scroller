var HeroLogic = (function(){

	var Hero = function(){
		/* Will be instantiated for every created entity to hold all the information 
			about the physical (not graphical) state of the entity in question. 
			declare the properties like this:
			this.some_state_variable_initial_value = 0;
			instantiate (most likely in the spawn function) like that:
			var new_entity_instance = new Hero();
		*/
		entity = new EntityController.create_abstract_entity();
		
		entity.hp = 100;
		entity.speed = 8;
		entity.hit_taken = false;
		entity.damage_taken = 0;
		entity.damage = 1;
		entity.is_walking = false;
		entity.point_value = 0;
		
		entity.jumps = 0;
		entity.decay_duration = 35;//time between decay animation and deletion
		entity.death_duration = 60;//time between death and deletion
		entity.jump_tick=0;

		entity.direction = 1; //default direction = left
		
		entity.needs_graphics_update = false; //accessed by renderer for animation purposes
		entity.animation = "stand"; //accessed by renderer for animation purposes
		
		return entity;
	};

	var init = function(){
		/* Is ran from the EntityController.init once during game loading 
			you should assign type to your model here using the identification controller
		*/
		include(); // satisfy requirements, GOES FIRST
		IdentificationController.assign_type(Hero, "hero");
	};

	var spawn = function(x, y){
		/* spawn instance of this entity at the given coordinates
			you will have to create new entity instance, assign it id
			using the IdentificationController.assign_id(entity_instance),
			assign it a body which you can get through PhysicsController
			do any other stuff you want to do during spawning,
			and finally you HAVE TO(!!!) return the instance you just created from this function
		*/


		var hero = new Hero();
		hero.type = "hero";
		hero.body = PhysicsController.get_rectangular({x: x, y: y, border_sensors: true}, hero);
		
		hero.player_id = NetworkController.get_network_id();
		hero.hp = 100;
		hero.wound = false;
		hero.jumps = 0;
		hero.score = 0;

		return hero;
	
	};

	var tick_AI = function(hero){
		/* Is ran each tick from the EntityController.update for every registered
			entity of this type. I given entity_instance
		*/
		if(hero.player_id == NetworkController.get_network_id()){
			var cmds = KeyboardController.movement_commands();
		}else{
			var cmds = KeyboardController.get_remote_movement(hero.player_id);
		}

		hero.direction_previous = hero.direction;
		hero.x_previous = hero.body.GetWorldCenter().x;
		hero.y_previous = hero.body.GetWorldCenter().y;
       
		if(hero.hp <= 0){
			hero.die();
		}else{
			hero.is_walking = false;	
			
			if(cmds("right")){
				 if(hero.jumps==0){
					hero.change_animation("walk");
					hero.is_walking = true;
				}
				hero.direction = true;//direction = right
				hero.move(hero.speed);
			}
			
			if(cmds("left")){
				if(hero.jumps==0){
					hero.change_animation("walk");
					hero.is_walking = true;
				}
				hero.direction = false;//direction = left
				hero.move(hero.speed);
			}
			
			if(cmds("down")){
				slam(hero);
				stop_hero(hero);
			}
			
			if(cmds("up")){
				jump(hero);
			}
			
			if(!hero.is_walking && hero.animation != "jump" && hero.body.GetLinearVelocity().y == 0){
				hero.change_animation("stand");
				hero.jump_tick = 0;
			}
			
			if(hero.animation=="jump"){
				if(hero.jump_tick == 1){
					hero.change_animation("jump");
				}
				hero.jump_tick++;
				if(hero.jump_tick >= 20){
					if(hero.jump_tick >= 25){
						hero.change_animation("finish");
						if(hero.jumps == 0){
							hero.animation = "finish";
						}
					}
				}
			}
		
			if(hero.hit_taken){
			    hero.take_damage();
			    //console.log("hold on");
			}
		
			if (hero.body.GetWorldCenter().x < WorldController.get_movement_edge() + hero.body.GetUserData().def.width/2){
				stop_hero(hero);
			}
		}
	};


	var begin_contact = function(contact, info){
		var hero = info.Me.entity;
		var other = info.Them.entity;
		if (other.type == "pizza") {
		    if (hero.hp <= 100+other.regen) {
		        hero.damage_taken = other.regen;
		        hero.hit_taken = true;
		    }
		    else if (hero.hp != 100) {
		        hero.damage_taken = hero.hp - 100;
		        hero.hit_taken = true;
		    }
		}
		if (info.Me.fixture_name == "bottom"){
			if(info.Them.fixture_name == "top" || other.kind == 1 || other.kind == 2){
				hero.jumps = 0;//if colliding with surface, reset jumps
			}
			if(other.kind == 3){
				if (hero.hp > 0){
					hero.hit_taken = true;
					hero.damage_taken = other.damage;
				}
			}
		}
		if(info.Me.fixture_name != "bottom" && other.can_attack){
			if(other.kind == null){
				var my_extents = hero.get_fixture(hero,"main").GetAABB().GetExtents();
				var my_coordinates = hero.body.GetWorldCenter();
				var other_extents = hero.get_fixture(other,"main").GetAABB().GetExtents();
				var other_coordinates = other.body.GetWorldCenter();
				//prevents taking damage while on top of enemies
				if (!(my_coordinates.y <= other_coordinates.y - (my_extents.y + other_extents.y - 0.5))) {
					if (hero.hp > 0) {
						hero.hit_taken = true;
						hero.damage_taken = other.damage;
					}
				}
			}else{//if they're spikes, take damage no matter what
				hero.hit_taken = true;
				hero.damage_taken = other.damage;
			}
		}
	};

	var end_contact = function(contact, info){
			
		//info.Me.entity.hit_taken = false;
	};

	var stop_hero = function (hero) {
		//var body = hero.body;
		//var velocity = body.GetLinearVelocity();
		//velocity.x = 0;
		//body.SetLinearVelocity(velocity); // body.SetLinearVelocity(new b2Vec2(5, 0)); would work too
		//body.SetAwake(true);

		var body = hero.body;
		var w = hero.body.GetUserData().def.width/2;
		var pos = new B2d.b2Vec2(WorldController.get_movement_edge() + w, body.GetWorldCenter().y)
		var vel = body.GetLinearVelocity();
		if(vel.x < 0 || body.GetWorldCenter().x > pos.x){
			var vel = new B2d.b2Vec2(0, vel.y);
			body.SetLinearVelocity(vel);
		}

	    body.SetAwake(true);
	}

	var slam = function(hero){
	    var body = hero.body;
	    body.ApplyImpulse(new B2d.b2Vec2(0, 20), body.GetWorldCenter());
	};
	var move_left = function(hero){
		var body = hero.body;
		var velocity = body.GetLinearVelocity();
		velocity.x = -5;
		body.SetLinearVelocity(velocity); // body.SetLinearVelocity(new b2Vec2(5, 0)); would work too
		body.SetAwake(true);
		//hero.x += 10; // old
		//hero.x = (body.GetPosition().x + 1.5/2) * 30 ; 
	};

	var jump = function(hero){
	    var body = hero.body;
	    var w = hero.body.GetUserData().def.width / 2;
	    var pos = new B2d.b2Vec2(WorldController.get_movement_edge() + w, body.GetWorldCenter().y)
	    var vel = body.GetLinearVelocity();
		//console.log(hero.jumps);
		if (hero.jumps == 0){
			hero.change_animation("jump");
			var vel = new B2d.b2Vec2(vel.x, -18);
			body.SetLinearVelocity(vel);
			hero.body.SetAwake(true);
		    hero.jumps += 1;
		}
		else if (hero.jumps == 1 && body.GetLinearVelocity().y > -1){
			hero.change_animation("jump");
			var min_check = vel.y - 18;
			if (min_check > -9){
				min_check = -9;
			}
			var vel = new B2d.b2Vec2(vel.x, min_check);
			body.SetLinearVelocity(vel);
			hero.body.SetAwake(true);
			hero.jumps += 1;
		}
	};

	
	var b2b_get_coordinates = function(hero){
		return hero.body.GetWorldCenter();
	};

	//var move_left = function(hero){
		//var velocity = hero.body.GetLinearVelocity();
		//move(hero, velocity.x - 5, velocity.y)

	//};

	//var move_right = function(hero){
		//var velocity = hero.body.GetLinearVelocity();
		//move(hero, velocity.x + 5, velocity.y)
	//};

	//var move = function(hero, x, y){
		//var velocity = new B2d.b2Vec2(x, y);
		//hero.body.SetLinearVelocity(velocity); // hero.SetLinearVelocity(new b2Vec2(5, 0)); would work too
		//hero.body.SetAwake(true);
	//};

	return {
		// declare public
		init: init, 
		spawn: spawn,
		tick_AI: tick_AI,
		begin_contact: begin_contact,
		end_contact: end_contact,
	};
})();

module.exports = HeroLogic;

var Includes = require("../Includes.js"); var include_data = Includes.get_include_data({
	current_module: "HeroLogic", 
	include_options: Includes.choices.LOGIC_SPECIFIC
}); eval(include_data.name_statements); var include = function(){eval(include_data.module_statements);}
