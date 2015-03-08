var B2d;
var GameModel;

GameModel = require("../Models/GameModel.js");

B2d = require("../B2d.js");

var PlayerController = (function(){

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
	    var body = GameModel.hero.b2b;
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
		//GameModel.hero.x -=10;
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
		jump: jump
	};
})();

module.exports = PlayerController;
