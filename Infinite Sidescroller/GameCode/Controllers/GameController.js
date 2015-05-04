

var GameController = (function(){

	var init = function(){
		include();
	};
		

	var update_all = function(event){
		/*
		 * main function pretty much
		 * everyghing else is called from here every tick
		 */
		KeyboardController.update(delta);

	    var cmds = KeyboardController.pause_commands();
	    if (cmds("pause") && GameModel.pauseCounter > 10 && GraphicsController.get_health() > 0) {
	        createjs.Ticker.paused = !createjs.Ticker.paused;
	        GameModel.pauseCounter = 0;
	        console.log("pause");
	    }
	    GameModel.pauseCounter += 1;
		
		if (!createjs.Ticker.paused){
			var delta = event.delta;

			// !!!! world simulation step goes somewhere right here
			// as per current design, will take delta as an argument
		
			//TerrainController.generate_terrain(); 
			//PlayerController.update();
		
			IdentificationController.update(delta);
			WorldController.update(delta);

			TerrainController.update(delta);
			EntityController.update(delta);

			// Should be called after all movement of objects is done:
			//HUDController.update();
			//BackgroundController.update();
			GraphicsController.update();
			GraphicsController.update(delta);

			MultiplayerSyncController.update(delta);
			NetworkController.update(delta);
		}
	};

	var stop_game = function(){
		/**
		* stop the game. 
		* this one prevents any controller updates except Game and Keyboard
		* different from the PAUSE for multiplayer purposes
		*/

		createjs.Ticker.paused = true;
		
	};

	var continue_game = function(){
		/**
		* continue game
		*/
		
		createjs.Ticker.paused = false;

	};

	return {
		init: init,
		update_all: update_all,
		stop_game: stop_game,
		continue_game: continue_game,
	};

})();

module.exports = GameController;

var Includes = require("../Includes.js"); var include_data = Includes.get_include_data({
	current_module: "GameController", 
	include_options: Includes.choices.DEFAULT
}); eval(include_data.name_statements); var include = function(){eval(include_data.module_statements);}

