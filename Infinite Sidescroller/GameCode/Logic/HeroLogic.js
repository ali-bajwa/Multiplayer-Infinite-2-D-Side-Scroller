Config = require ("../Config.js");

var HeroLogic = (function(){

	var Hero = function(){
		/* Will be instantiated for every created entity to hold all the information 
			about the physical (not graphical) state of the entity in question. 
			declare the properties like this:
			this.some_state_variable_initial_value = 0;
			instantiate (most likely in the spawn function) like that:
			var new_entity_instance = new Hero();
		*/
		this.hp = 100;
		this.wound = false;
		this.damage_taken = 1;
		this.jumps = 0;
		this.score = 0;
		this.progress = 0;
		this.progress_to_level = 199;  //affects tiling
		this.current_level = 199;
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

		hero.body = PhysicsController.get_rectangular({x: x, y: y, border_sensors: true}, hero);

		var id = IdentificationController.assign_id(hero);

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

		var hero_x = hero.body.GetWorldCenter().x;
		var pconf = Config.Player;
		var rounded_hero_x = Math.round(hero.body.GetWorldCenter().x);
		
		//console.log(rounded_hero_x);
		//console.log(hero.current_level);
		if(rounded_hero_x > hero.current_level)
		{
			hero.progress++;
			hero.current_level += hero.progress_to_level;
			console.log(hero.progress);
			hero.score += (hero.progress * 500);
		}
		
		GraphicsController.change_seasons(hero.progress);

		//make x and y coordinates available to enemy AI's that need to know them efficiently
		//pconf.hero_x[player_id] = hero_x; //for multiplayer mode
		//pconf.hero_y[player_id] = hero.y;
		pconf.hero_x = hero.body.GetWorldCenter().x; //while stuck in single player mode
		pconf.hero_y = hero.body.GetWorldCenter().y;
		if(pconf.movement_edge < hero_x - 20){
			pconf.movement_edge = hero_x - 20;
		}

		var cmds = KeyboardController.movement_commands();

       
        //End Score Tracking

		if(cmds("right")){
		    // temporary
		    move_right(hero);
		    //console.log("Movement Edge: " + parseInt(pconf.movement_edge) + " of type: " + typeof (pconf.movement_edge));
			GraphicsController.background_loop(hero.body.GetWorldCenter(), hero.progress);
		}
		if(cmds("left")){
		    // temporary
		    move_left(hero);
		    GraphicsController.background_loop(hero.body.GetWorldCenter(), hero.progress);
		}
		if(cmds("down")){
			slam(hero);
			
		}
		if(cmds("up")){
			jump(hero);
			
		}
		if(hero.wound)
		{
			hero.hp -= hero.damage_taken;
			console.log("Taking damage");
			GraphicsController.update_health(hero.hp);
		}
		
		if(hero.hp <= 0)
		{
		    EntityController.delete_entity(hero);
			console.log("Player Is Dead");
		}
		
		if (hero.body.GetWorldCenter().x < pconf.movement_edge + hero.body.GetUserData().def.width/2) {
			stop_hero(hero);
			console.log("working");
		}
		if (hero.body.GetWorldCenter().y > 22) {
		    hero.hp = 0;
		    console.log("drop of death");
		}
		GraphicsController.update_score(hero.score);
	};

	var begin_contact = function(contact, info){
		//console.log(info.Me.id, ":", "My fixture", "'" + info.Me.fixture_name + "'", "came into contact with fixture", 
			//"'" + info.Them.fixture_name + "'", "of", info.Them.id);
		if (info.Me.fixture_name == "bottom"){
			info.Me.entity.jumps = 0;
			if(info.Them.entity.kind == 3){
				info.Me.entity.wound = true;
			}
		}
		if(info.Me.fixture_name != "bottom" && info.Them.entity.can_attack)
		{
			//stupid chain of box2d functions returns {x:half_height,y:half_width}
			var my_extents = info.Me.entity.body.GetFixtureList().GetNext().GetNext().GetNext().GetNext().GetAABB().GetExtents();
			var my_coordinates = info.Me.entity.body.GetWorldCenter();
			var other_extents = info.Them.entity.body.GetFixtureList().GetNext().GetNext().GetNext().GetNext().GetAABB().GetExtents();
			var other_coordinates = info.Them.entity.body.GetWorldCenter();
			//try to prevent taking damage while on top of enemies
			if (!(my_coordinates.y <= other_coordinates.y - (my_extents.y + other_extents.y - 0.3))){
				info.Me.entity.wound = true;
				info.Me.entity.damage_taken = info.Them.entity.damage;
			}
		}
				
	};

	var take_hit = function(hero, amount){
	    hero.hp -= amount;
		//GraphicsController.update_health(hero.hp);
	}

	var end_contact = function(contact, info){
			
		info.Me.entity.wound = false;
	};

	var stop_hero = function (hero) {
		//var body = hero.body;
		//var velocity = body.GetLinearVelocity();
		//velocity.x = 0;
		//body.SetLinearVelocity(velocity); // body.SetLinearVelocity(new b2Vec2(5, 0)); would work too
		//body.SetAwake(true);

		var body = hero.body;
		var w = hero.body.GetUserData().def.width/2;
		var pos = new B2d.b2Vec2(Config.Player.movement_edge + w, body.GetWorldCenter().y)
		var vel = body.GetLinearVelocity();
		if(vel.x < 0){
			var vel = new B2d.b2Vec2(0, vel.y);
			body.SetLinearVelocity(vel);
		}

	    body.SetAwake(true);
	}

	var slam = function(hero){
	    var body = hero.body;
	    body.ApplyImpulse(new B2d.b2Vec2(0, 20), body.GetWorldCenter());
	};
	var jump = function(hero){
	    var body = hero.body;
		if (hero.jumps == 0){
		    body.ApplyImpulse(new B2d.b2Vec2(0, -125), body.GetWorldCenter());
		    hero.jumps += 1;
		}
		else if (hero.jumps == 1 && body.GetLinearVelocity().y > -1) {
		    body.ApplyImpulse(new B2d.b2Vec2(0, -125), body.GetWorldCenter());
		    hero.jumps += 1;
		}

		//hero.y = body.GetPosition().y * 30;
	
	};

	var set_coordinates = function(position_vector, hero){
		// TODO: remove;
		// temporary/testing
		hero.x = (position_vector.x - 1.5/2) * 30 ;
		hero.y = (position_vector.y + 2.5/2) * 30 ;

	};

	var b2b_get_coordinates = function(hero){
		return hero.body.GetWorldCenter();
	};

	var move_left = function(hero){
		var velocity = hero.body.GetLinearVelocity();
		velocity.x = -8;
		hero.body.SetLinearVelocity(velocity); // hero.SetLinearVelocity(new b2Vec2(5, 0)); would work too
		hero.body.SetAwake(true);
	};

	var move_right = function(hero){
		var velocity = hero.body.GetLinearVelocity();
		velocity.x = +8;
		hero.body.SetLinearVelocity(velocity); // hero.SetLinearVelocity(new b2Vec2(5, 0)); would work too
		hero.body.SetAwake(true);
	};

	var move = function(offset_x, offset_y, hero){
		// unimplemented
		// should it hard-set position (not safe!)
		// or just allow to set any velocity/impulse vector?
	};
	var get_hero_x = function(){
			return hero.body.GetWorldCenter().x;
	
	};

	return {
		// declare public
		init: init, 
		spawn: spawn,
		tick_AI: tick_AI,
		begin_contact: begin_contact,
		end_contact: end_contact,
		get_hero_x: get_hero_x,
	};
})();

module.exports = HeroLogic;

var Includes = require("../Includes.js"); var include_data = Includes.get_include_data({
	current_module: "HeroLogic", 
	include_options: Includes.choices.LOGIC_SPECIFIC
}); eval(include_data.name_statements); var include = function(){eval(include_data.module_statements);}
