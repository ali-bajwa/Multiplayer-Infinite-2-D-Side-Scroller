var EsteemedCompanionLogic = (function(){

		
	var Companion = function(){
		/* Will be instantiated for every created entity to hold all the information 
			about the physical (not graphical) state of the entity in question. 
			declare the properties like this:
			this.some_state_variable_initial_value = 0;
			instantiate (most likely in the spawn function) like that:
			var new_entity_instance = new EsteemedCompanion();
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
		IdentificationController.assign_type(Companion, "companion");
	};

	var spawn = function(x, y){
		/* spawn instance of this entity at the given coordinates
			you will have to create new entity instance, assign it id
			using the IdentificationController.assign_id(entity_instance),
			assign it a body which you can get through PhysicsController
			do any other stuff you want to do during spawning,
			and finally you HAVE TO(!!!) return the instance you just created from this function
		*/

		var companion = new Companion();

		companion.body = PhysicsController.get_rectangular({x: x, y: y, border_sensors: true}, companion);

		var id = IdentificationController.assign_id(companion);

		companion.hp = 100;
		companion.wound = false;
		companion.jumps = 0;
		companion.score = 0;


		return companion;
	
	};

	var tick_AI = function(companion){
		/* Is ran each tick from the EntityController.update for every registered
			entity of this type. I given entity_instance
		*/

		
		console.warn("ticking companion");

		

		var cmds = KeyboardController.movement_commands();

		var MOVEMENT_EDGE = 500; // where terrain start scrolling

		if(cmds("right")){
		    // temporary
		    add_score(companion, 1);
		    move_right(companion);
		}
		if(cmds("left")){
			// temporary
		    
		    move_left(companion);
		}

		if(cmds("up")){
			jump(companion);
		}

		// TEMPORARYYYYYYYYYYYYYYYY
		if(cmds("up") || cmds("right") || cmds("left")){
			var vel = companion.body.GetLinearVelocity();
			vel = {x: vel.x, y: vel.y};
			var pos = companion.body.GetWorldCenter();
			pos = {x: pos.x, y: pos.y};
			NetworkController.add_to_next_update({purpose: "companion", content: {pos: pos, vel: vel}});
			
		}else{
			var data = NetworkController.get_data();
			
			if(data && data["companion"] != null){

				var body = companion.body;
				
				var vel = data["companion"].vel;
				vel = new B2d.b2Vec2(vel.x, vel.y);

				var pos = data["companion"].pos
				pos = new B2d.b2Vec2(pos.x, pos.y);
				
				body.SetLinearVelocity(vel)
				body.SetPosition(pos)
			}
		}

		if(companion.wound)
		{
			companion.hp--;
			console.log("Taking damage");
			GraphicsController.update_health(companion.hp);
		}
		
		if(companion.hp <= 0)
		{
			createjs.Ticker.paused = true;
			console.log("Player Is Dead");
		}
		GraphicsController.update_score(companion.score);
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
	
	var add_score = function (companion, amount) {
	    companion.score += amount;
	}
	

	var take_hit = function(companion, amount){
	    companion.hp -= amount;
		//GraphicsController.update_health(companion.hp);
	}

	var end_contact = function(contact, info){
			
		info.Me.entity.wound = false;
	};

	var move_right = function(companion){
		var body = companion.body;
		var velocity = body.GetLinearVelocity();
		velocity.x = 5;
		body.SetLinearVelocity(velocity); // body.SetLinearVelocity(new b2Vec2(5, 0)); would work too
		body.SetAwake(true);
		//companion.x += 10; // old
		//companion.x = (body.GetPosition().x + 1.5/2) * 30 ; 
	};

	var jump = function(companion){
	    var body = companion.body;
		if (companion.jumps == 0){
		    body.ApplyImpulse(new B2d.b2Vec2(0, -100), body.GetWorldCenter());
		    companion.jumps += 1;
		}
		else if (companion.jumps == 1 && body.GetLinearVelocity().y > -1) {
		    body.ApplyImpulse(new B2d.b2Vec2(0, -100), body.GetWorldCenter());
		    companion.jumps += 1;
		}

		//companion.y = body.GetPosition().y * 30;
	
	};

	var set_coordinates = function(position_vector, companion){
		// TODO: remove;
		// temporary/testing
		companion.x = (position_vector.x - 1.5/2) * 30 ;
		companion.y = (position_vector.y + 2.5/2) * 30 ;

	};

	var b2b_get_coordinates = function(companion){
		return companion.body.GetWorldCenter();
	};

	var move_left = function(companion){
		var velocity = companion.body.GetLinearVelocity();
		velocity.x = -5;
		companion.body.SetLinearVelocity(velocity); // companion.SetLinearVelocity(new b2Vec2(5, 0)); would work too
		companion.body.SetAwake(true);
	};

	var move_right = function(companion){
		var velocity = companion.body.GetLinearVelocity();
		velocity.x = +5;
		companion.body.SetLinearVelocity(velocity); // companion.SetLinearVelocity(new b2Vec2(5, 0)); would work too
		companion.body.SetAwake(true);
	};

	var move = function(offset_x, offset_y, companion){
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

module.exports = EsteemedCompanionLogic;

var Includes = require("../Includes.js"); var include_data = Includes.get_include_data({
	current_module: "EsteemedCompanionLogic", 
	include_options: Includes.choices.LOGIC_SPECIFIC
}); eval(include_data.name_statements); var include = function(){eval(include_data.module_statements);}
