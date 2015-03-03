var GameModel;
GameModel = require("../Models/GameModel.js");

var EnemyController = (function(){
	var move = function(offset_x, offset_y){
		GameModel.chomper.x += offset_x;
		GameModel.chomper.y += offset_y;
	};

	return {
		move: move
	};
})();

module.exports = EnemyController;
