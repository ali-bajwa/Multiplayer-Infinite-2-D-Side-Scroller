
var PlayerController = (function(){

	var hero; // for quick access

	var init = function(){
		include();
		PlayerModel.hero = PhysicsController.get_rectangular({id: "hero", border_sensors: true}, "player");
		hero = PlayerModel.hero;
		PlayerModel.hp = 100;
		PlayerModel.wound = false;
		
		PhysicsController.listen_for_contact_with("hero", "BeginContact", begin_contact);
		
		
	};

	var begin_contact = function(contact, info){
		//console.log(info.Me.id, ":", "My fixture", "'" + info.Me.fixture_name + "'", "came into contact with fixture", 
			//"'" + info.Them.fixture_name + "'", "of", info.Them.id);
		if (info.Me.fixture_name == "bottom"){
			PlayerModel.jumps = 0;
		}
		if (info.Me.fixture_name == "top"){
			take_hit(1)
		}
				
	};

	var take_hit = function(amount){
		PlayerModel.hp -= 1;
		GraphicsController.update_health(PlayerModel.hp);
	}

	var end_contact = function(contact, info){
			
		PlayerModel.wound = false;
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
		if(PlayerModel.wound)
		{
			PlayerModel.hp--;
			console.log("Taking damage");
			GraphicsController.update_health(PlayerModel.hp);
		}
		
		if(PlayerModel.hp <= 0)
		{
			console.log("Player Is Dead");
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

	var jump = function(){
	    var body = PlayerModel.hero;
		if (PlayerModel.jumps == 0){
		    body.ApplyImpulse(new B2d.b2Vec2(0, -100), body.GetWorldCenter());
		    PlayerModel.jumps += 1;
		}
		else if (PlayerModel.jumps == 1 && body.GetLinearVelocity().y > -1) {
		    body.ApplyImpulse(new B2d.b2Vec2(0, -100), body.GetWorldCenter());
		    PlayerModel.jumps += 1;
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

