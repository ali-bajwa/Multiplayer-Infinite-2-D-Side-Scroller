
var PlayerController = (function(){

	var hero; // for quick access

	var init = function(){
		include();
		PlayerModel.hero = PhysicsController.get_rectangular({userData: {id: "hero"}, border_sensors: true}, "player");
		hero = PlayerModel.hero;

		var end_contact = function(contact, info){
			console.log(info);
		};

		//PhysicsController.setup_collision_listener({EndContact: end_contact}, {});
		
	};

	var update = function (){

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
			jump();
		}

	};

	var get_hero = function(){
		return PlayerModel.hero;
	};

	var move_right = function(){
		var body = GameModel.hero.b2b;
		var velocity = body.GetLinearVelocity();
		velocity.x = 5;
		body.SetLinearVelocity(velocity); // body.SetLinearVelocity(new b2Vec2(5, 0)); would work too
		body.SetAwake(true);
		//GameModel.hero.x += 10; // old
		//GameModel.hero.x = (body.GetPosition().x + 1.5/2) * 30 ; 
	};

	var jumps = 0;

	var jump = function(){
	    var body = PlayerModel.hero;
	    if (body.GetLinearVelocity().y == 0) {
	        jumps = 0;
	    }
		if (jumps == 0){
		    body.ApplyImpulse(new B2d.b2Vec2(0, -100), body.GetWorldCenter());
		    jumps += 1;
		}
		else if (jumps == 1 && body.GetLinearVelocity().y > -1) {
		    body.ApplyImpulse(new B2d.b2Vec2(0, -100), body.GetWorldCenter());
		    jumps += 1;
		}

		//GameModel.hero.y = body.GetPosition().y * 30;
	
	};

	var set_coordinates = function(position_vector){
		// TODO: remove;
		// temporary/testing
		GameModel.hero.x = (position_vector.x - 1.5/2) * 30 ;
		GameModel.hero.y = (position_vector.y + 2.5/2) * 30 ;

	};

	var b2b_get_coordinates = function(){
		return GameModel.hero.b2b.GetWorldCenter();
	};

	var move_left = function(){
		var velocity = hero.GetLinearVelocity();
		velocity.x = -5;
		hero.SetLinearVelocity(velocity); // hero.SetLinearVelocity(new b2Vec2(5, 0)); would work too
		hero.SetAwake(true);
	};

	var move_right = function(){
		var velocity = hero.GetLinearVelocity();
		velocity.x = +5;
		hero.SetLinearVelocity(velocity); // hero.SetLinearVelocity(new b2Vec2(5, 0)); would work too
		hero.SetAwake(true);
	};

	var move = function(offset_x, offset_y){
		// unimplemented
		// should it hard-set position (not safe!)
		// or just allow to set any velocity/impulse vector?
	};

	return {
		init: init,
		move_right: move_right,
		move_left: move_left,
		//move: move, // uniplemented. what will it do?
		set_coordinates: set_coordinates,
		b2b_get_coordinates: b2b_get_coordinates,
		update: update,
		jump: jump,
		get_hero: get_hero,

	};
})();

module.exports = PlayerController;

var Includes = require("../Includes.js"); var include_data = Includes.get_include_data({
	current_module: "PlayerController", 
	include_options: Includes.choices.DEFAULT
}); eval(include_data.name_statements); var include = function(){eval(include_data.module_statements);}

