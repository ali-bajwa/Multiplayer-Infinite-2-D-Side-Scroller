

var GameController = (function(){

	var init = function(){
		include();
	};
		

	var update_all = function(event){
		/*
		 * main function pretty much
		 * everyghing else is called from here every tick
		 */
	    var cmds = KeyboardController.movement_commands();
	    if (cmds("pause") && GameModel.pauseCounter > 10) {
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
		
			WorldController.update(delta);

			TerrainController.update();
			EntityController.update();

			// Should be called after all movement of objects is done:
			GraphicsController.update();
		}
	};


	return {
		init: init,
		update_all: update_all,
	};

})();

module.exports = GameController;

var Includes = require("../Includes.js"); var include_data = Includes.get_include_data({
	current_module: "GameController", 
	include_options: Includes.choices.DEFAULT
}); eval(include_data.name_statements); var include = function(){eval(include_data.module_statements);}

