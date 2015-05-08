

var GameController = (function(){

	var init = function(){
		include();
		GameModel.team_lives = Config.Init.initial_lives;
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

	var use_life = function(){
		/**
		* use 1 life from the remaining lives
		* terminate game if no more lives
		*/

		GameModel.team_lives--;
		console.log("used up life.", GameModel.team_lives, "left");
	};

	var get_life_count = function(arguments){
		/**
		* get count of remaining lives
		*/
		
		return GameModel.team_lives;
	};

	var end_game = function(message){
		/**
		* end game, print given message
		*/
		
		stop_game();
		var msg = message || "Game ended";
		console.log(msg);

		try{// doesn't really catch errors for some reason
			$.ajax({
				url: "/game/savescore",
				type: 'POST',
				traditional: true,
				contentType: 'application/json',
				data: {sessionid: Config.Init.session_id, score: WorldController.get_score()},
				success: function (result) {}
			});
		}catch(err){
			console.log("Error while attempting to transmit end game data to server", err);
		}

	};

	var check_game_ending_conditions = function(){
		/**
		* check if the game should end. Ideally it will be called
		* from any places that can affect such condition, such as
		* EntityController.handle_delete
		*/

		console.log("checking for game ending condition");
		
		var heroes = EntityController.get_all_heroes();
		var count = Object.keys(heroes).length;
		console.log("currently spawned", count, "heroes");
		
		
		if(count <= 0 && GameModel.team_lives <= 0){
			// if no one active and no more lives
			// end the game
			end_game()
		}
	};

	return {
		init: init,
		update_all: update_all,
		stop_game: stop_game,
		continue_game: continue_game,
		use_life: use_life,
		get_life_count: get_life_count,
		check_game_ending_conditions: check_game_ending_conditions,
	};

})();

module.exports = GameController;

var Includes = require("../Includes.js"); var include_data = Includes.get_include_data({
	current_module: "GameController", 
	include_options: Includes.choices.DEFAULT
}); eval(include_data.name_statements); var include = function(){eval(include_data.module_statements);}

