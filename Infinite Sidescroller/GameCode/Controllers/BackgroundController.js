Config = require ("../Config.js").Player;

var BackgroundController = (function(){
	//Controls the background and score

		
	return {
		// declare public
		init: init, 
		update: update,
		get_season: get_season,
	};
})();

module.exports = BackgroundController;

var Includes = require("../Includes.js"); var include_data = Includes.get_include_data({
	current_module: "BackgroundController", 
	include_options: Includes.choices.DEFAULT | Includes.choices.RENDERERS
}); eval(include_data.name_statements); var include = function(){eval(include_data.module_statements);}
