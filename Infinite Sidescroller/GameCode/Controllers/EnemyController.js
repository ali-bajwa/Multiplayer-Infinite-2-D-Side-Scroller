
var EnemyController = (function(){
	var init = function(){
		
		include();
	};
	
	var move = function(offset_x, offset_y){
		// needs to change to not use gamemodel directly
		//GameModel.chomper.x += offset_x;
		//GameModel.chomper.y += offset_y;
	};

	return {
		move: move,
		init: init,
	};
})();

module.exports = EnemyController;

var Includes = require("../Includes.js"); var include_data = Includes.get_include_data({
	current_module: "EnemyController", 
	include_options: Includes.choices.DEFAULT
}); eval(include_data.name_statements); var include = function(){eval(include_data.module_statements);}

