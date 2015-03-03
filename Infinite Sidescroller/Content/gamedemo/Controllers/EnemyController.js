var GameModel;
GameModel = require("../Models/GameModel.js");

var EnemyController = (function(){
	var move = function(offset_x, offset_y){
		GameModel.enemy.x += offset_x;
		GameModel.enemy.y += offset_y;
	};

	return {
		move: move
	};
})();

module.exports = EnemyController;
