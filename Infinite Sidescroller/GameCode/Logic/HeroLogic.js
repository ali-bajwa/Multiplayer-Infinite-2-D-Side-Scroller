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
		this.jumps = 0;
		this.score = 0;
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

		var cmds = KeyboardController.movement_commands();

		var MOVEMENT_EDGE = 500; // where terrain start scrolling

		if(cmds("right")){
		    // temporary
		    add_score(hero, 1);
		    move_right(hero);
		}
		if(cmds("left")){
			// temporary
		    
		    move_left(hero);
		}

		if(cmds("up")){
			jump(hero);
		}

		// TEMPORARYYYYYYYYYYYYYYYY
		if(cmds("up") || cmds("right") || cmds("left")){
			var vel = hero.body.GetLinearVelocity();
			vel = {x: vel.x, y: vel.y};
			var pos = hero.body.GetWorldCenter();
			pos = {x: pos.x, y: pos.y};
			RemoteController.add_to_next_update({purpose: "hero", content: {pos: pos, vel: vel}});
			
		}else{
			var data = RemoteController.get_data();
			
			if(data && data["hero"] != null){

				
				var body = hero.body;
				
				var vel = data["hero"].vel;
				vel = new B2d.b2Vec2(vel.x, vel.y);

				var pos = data["hero"].pos
				pos = new B2d.b2Vec2(pos.x, pos.y);
				
				body.SetLinearVelocity(vel)
				body.SetPosition(pos)
			}
		}

		if(hero.wound)
		{
			hero.hp--;
			console.log("Taking damage");
			GraphicsController.update_health(hero.hp);
		}
		
		if(hero.hp <= 0)
		{
			createjs.Ticker.paused = true;
			console.log("Player Is Dead");
		}
		GraphicsController.update_score(hero.score);
	};

	var begin_contact = function(contact, info){
		//console.log(info.Me.id, ":", "My fixture", "'" + info.Me.fixture_name + "'", "came into contact with fixture", 
			//"'" + info.Them.fixture_name + "'", "of", info.Them.id);
		if (info.Me.fixture_name == "bottom"){
			info.Me.entity.jumps = 0;
		}
		if (info.Me.fixture_name == "top"){
			take_hit(info.Me.entity, 1);
		}
		
		if(info.Me.fixture_name != "bottom" && info.Them.entity.can_attack)
		{
		    info.Me.entity.wound = true;
		    add_score(info.Me.entity, 100);
		}
				
	};
	
	var add_score = function (hero, amount) {
	    hero.score += amount;
	}
	

	var take_hit = function(hero, amount){
	    hero.hp -= amount;
		//GraphicsController.update_health(hero.hp);
	}

	var end_contact = function(contact, info){
			
		info.Me.entity.wound = false;
	};

	var move_right = function(hero){
		var body = hero.body;
		var velocity = body.GetLinearVelocity();
		velocity.x = 5;
		body.SetLinearVelocity(velocity); // body.SetLinearVelocity(new b2Vec2(5, 0)); would work too
		body.SetAwake(true);
		//hero.x += 10; // old
		//hero.x = (body.GetPosition().x + 1.5/2) * 30 ; 
	};

	var jump = function(hero){
	    var body = hero.body;
		if (hero.jumps == 0){
		    body.ApplyImpulse(new B2d.b2Vec2(0, -100), body.GetWorldCenter());
		    hero.jumps += 1;
		}
		else if (hero.jumps == 1 && body.GetLinearVelocity().y > -1) {
		    body.ApplyImpulse(new B2d.b2Vec2(0, -100), body.GetWorldCenter());
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
		velocity.x = -5;
		hero.body.SetLinearVelocity(velocity); // hero.SetLinearVelocity(new b2Vec2(5, 0)); would work too
		hero.body.SetAwake(true);
	};

	var move_right = function(hero){
		var velocity = hero.body.GetLinearVelocity();
		velocity.x = +5;
		hero.body.SetLinearVelocity(velocity); // hero.SetLinearVelocity(new b2Vec2(5, 0)); would work too
		hero.body.SetAwake(true);
	};

	var move = function(offset_x, offset_y, hero){
		// unimplemented
		// should it hard-set position (not safe!)
		// or just allow to set any velocity/impulse vector?
	};

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
