
var MultiplayerSyncController = (function(){
	/* Ensures that current player is synchronized with the server
	 * or with other players
	*/

	var init = function(){
		/* is ran from the InitController once when the game is loaded */

		include(); // satisfy requirements

	};

	var update = function(delta){
		/* is ran each tick from the GameController.update_all */

	};
	
	return {
		// declare public
		init: init, 
		update: update,
	};
})();

module.exports = MultiplayerSyncController;

var Includes = require("../Includes.js"); var include_data = Includes.get_include_data({
	current_module: "MultiplayerSyncController", 
	include_options: Includes.choices.DEFAULT
}); eval(include_data.name_statements); var include = function(){eval(include_data.module_statements);}


