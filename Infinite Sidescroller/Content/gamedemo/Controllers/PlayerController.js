var B2d;
var GameModel;
var KeyboardController;

GameModel = require("../Models/GameModel.js");

KeyboardController = require("../Controllers/KeyboardController.js");
B2d = require("../B2d.js");

var PlayerController = (function(){

<<<<<<< HEAD
		var move_right = function(){
		move(10, 0);
=======
	var update = function(){
		var cmds = KeyboardController.movement_commands();

		// Separate function >>>
		if(cmds("right")){
			// temporary

			if(GameModel.hero.x > MOVEMENT_EDGE){
				PlayerController.move_right(GameModel.hero);
				CameraController.move(10, 0);
				//TerrainController.move_left(10);
				//CameraController.follow(GameModel.hero);
			}else{
				//CameraController.unfollow();
				PlayerController.move_right(GameModel.hero);
			}
		}

		if(cmds("up")){
			PlayerController.jump();
		}


		if(cmds("left")){
			if(GameModel.hero.x > 10){
				PlayerController.move_left(GameModel.hero);
			}
		}

		// <<<

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
		var body = GameModel.hero.b2b;
		if (body.GetLinearVelocity().y == 0){
			body.ApplyImpulse(new B2d.b2Vec2(0, -100), body.GetWorldCenter());
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
>>>>>>> game_development
	};

	var move_left = function(){
		var body = GameModel.hero.b2b;
		var velocity = body.GetLinearVelocity();
		velocity.x = -5;
		body.SetLinearVelocity(velocity); // body.SetLinearVelocity(new b2Vec2(5, 0)); would work too
		body.SetAwake(true);
	};

	var move = function(offset_x, offset_y){
		GameModel.hero.x += offset_x;
		GameModel.hero.y += offset_y;
	};

	return {
		move_right: move_right,
		move_left: move_left,
		move: move,
		set_coordinates: set_coordinates,
		b2b_get_coordinates: b2b_get_coordinates,
		update: update,
		jump: jump
	};
})();

module.exports = PlayerController;
