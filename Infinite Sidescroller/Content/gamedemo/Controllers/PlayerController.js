var GameModel;
GameModel = require("../Models/GameModel.js");

var PlayerController = (function(){

		var move_right = function(){
		GameModel.hero.x += 10;
	};

	var move_left = function(){
		//GameModel.hero.x -=10;
		move(-10, 0);
	};

	var move = function(offset_x, offset_y){
		GameModel.hero.x += offset_x;
		GameModel.hero.y += offset_y;
	};

	return {
		move_right: move_right,
		move_left: move_left,
		move: move
	};
})();

module.exports = PlayerController;
