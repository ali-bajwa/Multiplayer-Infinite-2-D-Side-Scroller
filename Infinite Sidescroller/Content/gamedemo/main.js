"use strict";

/*
 * Rules for working on this:
 *
 * 1. If you think that one of these rules is stupid or useless, tell me, along with some better suggestions.
 *
 * 2. Model [name]Model can only be accessed through [name]Controller. If you need to do something to 
 * 		change [name]Model from [other_name]Controller, write function in the [name]Controller that does
 * 		what you need, and call it from the [other_name]Controller
 *
 * 3. Controllers are allowed to have private methods/fields. Models aren't. 
 *
 * 4. Controllers aren't allowed to have public data fields. 
 * 		Those data fields that are present must not reflect state of the game, they must be related to
 * 		some internal functionality of the controller
 *
 * 5. If you write some function that doesn't logically belong to one of the controllers,
 * 		put it in the Utility
 *
 * 6. Variables are named like that: variable_name
 * 		Except (singleton)class names, that are written like that: ClassName
 *
 * 7. And all the obvious stuff that everyone knows:
 * 		function must do one thing; don't make function public unless it needs to be that; 
 * 		comment ambigious code, for larger functions indicate their purpose 
 */

window.sidescroller_game = (function namespace(){

	var Config = require("./Config.js");
		
	var Utility = require("./Utility.js");

	var lg = Utility.lg; // for quicker access
	var GameModel = require("./Models/GameModel.js");
	var PlayerModel; // TODO: must be possible to instantiate [and/or] duplicate
	var TerrainModel = require("./Models/TerrainModel.js");
	var BackgroundModel; // Split in two later? (Tow background mooving at the different speed may give more depth)
	var HUDModel; // Heads-Up Display 
	var EnemyModel;
	var AssetModel = require("./Models/AssetModel.js"); 
	var CameraModel = require("./Models/CameraModel.js"); 
	var WorldModel = require("./Models/WorldModel.js"); 
	var WorldController = require("./Controllers/WorldController.js"); 
	var GameController = require("./Controllers/GameController.js"); 
	var CameraController = require("./Controllers/CameraController.js"); 
	var WorldGenerationController;
	var PhysicsController;
	var PlayerController = require("./Controllers/PlayerController.js"); 
	var EnemyController;
	var TerrainController = require("./Controllers/TerrainController.js"); 
	var AssetController = require("./Controllers/AssetController.js"); 
	var KeyboardController = require("./Controllers/KeyboardController.js"); 
	var InitController = require("./Controllers/InitController.js"); 
	var TestController = require("./Controllers/TestController.js"); 
	

	// Game initiation section: >>>
	
		
	var load_game = function(mode)
	{

		InitController.init(mode); // init all the stuff

		if(mode == "test"){
			TestController.test();
		}
	};


	var run = function(mode)
	{
		// done this way to ensure that load_game's internals aren't accessible to the world:
		load_game(mode);
	}; 
	
	return {
		run: run
	}; // expose function run to the world

})(); 
