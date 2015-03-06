var CameraController, PlayerController, KeyboardController;
var GameModel;

CameraController = require("./CameraController.js");
PlayerController = require("./PlayerController.js");
KeyboardController = require("./KeyboardController.js");
EnemyController = require("./EnemyController.js");

GameModel = require("../Models/GameModel.js");

var GameController = (function(){

	var MOVEMENT_EDGE = 500; // where terrain start scrolling

	var vertical_velocity = 0;
	var delta_s = 0;
	var movement_modifier = 1;
	var score = 0;
	var loop = 0;
	var marker = true;

	var update_all = function(event){
		/*
		 * main function pretty much
		 * everyghing else is called from here every tick
		 */
		
		var delta = event.delta;

		var cmds = KeyboardController.movement_commands();

		// Separate function >>>
		if(cmds.indexOf("right") > -1){
		    // temporary
		    score += 1;

			if(GameModel.hero.x > MOVEMENT_EDGE){
				PlayerController.move_right(GameModel.hero);
				CameraController.move(10, 0);
				//TerrainController.move_left(10);
				//CameraController.follow(GameModel.hero);
			}else{
				//CameraController.unfollow();
				PlayerController.move_right(GameModel.hero);
			}
		}

		var base_speed = event.delta / 1000 * 50 * movement_modifier;

		if (cmds.indexOf("up") > -1) {
		    if (GameModel.hero.y == 516) {
		        vertical_velocity = 300;
		        movement_modifier = 0.3;
		    }
		}

		if(cmds.indexOf("left") > -1){
		    if (GameModel.hero.x > 10) {
		        if (score != 0) {
		            score -= 1;
		        }
				PlayerController.move_left(GameModel.hero);
			}
		}

		vertical_velocity -= event.delta / 1000 * 700;

		delta_s = vertical_velocity * event.delta / 1000;

		if ((GameModel.hero.y - delta_s) <= 516) {
		    GameModel.hero.y -= delta_s;
		}
		else {
		    GameModel.hero.y = 516;
		}

		if (GameModel.hero.y == 516) {
		    movement_modifier = 1;
		}

		if (loop == 4) {
		    marker = !(marker);
		    loop = 0;
		}
		else {
		    loop += 1;
		}
		EnemyController.move(-1, 0);
		GameModel.chomper.gotoAndStop(marker ? 1 : 0);

		GameModel.score.text = score.toString();

		// <<<

		//TerrainController.generate_terrain(); 
		
		// Should be called after all movement of objects is done:
		CameraController.update(); 

		GameModel.stage.update();
	};



	

	return {
		update_all: update_all,
	};

})();

module.exports = GameController;
