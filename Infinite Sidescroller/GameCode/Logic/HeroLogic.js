var HeroAI = (function(){

	this.Player = function(){
		this.hp = 100;
		this.wound = false;
		this.jumps = 0;
	}

	var IdentificationController, PhysicsController, RegisterAsController, KeyboardController, B2d, GraphicsController;
	var hero;

	var init = function(imports){
		/**
		* initialize and register stuff
		*/
		IdentificationController = imports.IdentificationController;
		PhysicsController = imports.PhysicsController;
		RegisterAsController = imports.RegisterAsController;
		KeyboardController = imports.KeyboardController;
		GraphicsController = imports.GraphicsController;
		B2d = imports.B2d;


		IdentificationController.assign_type(Player, "hero");	

	};
	

	var spawn = function(x, y){
		var hero = new Player();

		hero.body = PhysicsController.get_rectangular({x: x, y: y, border_sensors: true}, hero);

		hero.hp = 100;
		hero.wound = false;
		hero.jumps = 0;


		return hero;
	};
	
	var tick_AI = function(entity){

		hero = entity;
		
		var cmds = KeyboardController.movement_commands();

		var MOVEMENT_EDGE = 500; // where terrain start scrolling


		if(cmds("right")){
		    // temporary

		    move_right(hero);
		}
		if(cmds("left")){
			// temporary
		    
		    move_left(hero);
		}

		if(cmds("up")){
			jump(hero);
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
	
	};

	var begin_contact = function(contact, info){
		//console.log(info.Me.id, ":", "My fixture", "'" + info.Me.fixture_name + "'", "came into contact with fixture", 
			//"'" + info.Them.fixture_name + "'", "of", info.Them.id);
		//console.log("here");
		
		if (info.Me.fixture_name == "bottom"){
			info.Me.entity.jumps = 0;
		}
		if (info.Me.fixture_name == "top"){
			take_hit(info.Me.entity, 1);
		}
		
		if(info.Me.fixture_name != "bottom" && info.Them.entity.can_attack)
		{
			info.Me.entity.wound = true;
		}
				
	};
	

	

	var take_hit = function(hero, amount){
	    hero.hp -= amount;
		GraphicsController.update_health(hero.hp);
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

	var set_coordinates = function(position_vector){
		// TODO: remove;
		// temporary/testing
		hero.x = (position_vector.x - 1.5/2) * 30 ;
		hero.y = (position_vector.y + 2.5/2) * 30 ;

	};

	var b2b_get_coordinates = function(){
		return hero.body.GetWorldCenter();
	};

	var move_left = function(){
		var velocity = hero.body.GetLinearVelocity();
		velocity.x = -5;
		hero.body.SetLinearVelocity(velocity); // hero.SetLinearVelocity(new b2Vec2(5, 0)); would work too
		hero.body.SetAwake(true);
	};

	var move_right = function(){
		var velocity = hero.body.GetLinearVelocity();
		velocity.x = +5;
		hero.body.SetLinearVelocity(velocity); // hero.SetLinearVelocity(new b2Vec2(5, 0)); would work too
		hero.body.SetAwake(true);
	};

	var move = function(offset_x, offset_y){
		// unimplemented
		// should it hard-set position (not safe!)
		// or just allow to set any velocity/impulse vector?
	};



	return {
		tick_AI: tick_AI,
		spawn: spawn,
		init: init,
		begin_contact: begin_contact,
		end_contact: end_contact,
	};
})();

module.exports = HeroAI;
