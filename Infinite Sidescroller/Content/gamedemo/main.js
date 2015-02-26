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

	var MODELS_PATH = "./Models/";
	var CONTROLLERS_PATH = "./Controllers/";

	var lg = Utility.lg; // for quicker access
	var GameModel = require(MODELS_PATH + "GameModel.js");
	var PlayerModel; // TODO: must be possible to instantiate [and/or] duplicate
	var TerrainModel = require(MODELS_PATH + "TerrainModel.js");
	var BackgroundModel; // Split in two later? (Tow background mooving at the different speed may give more depth)
	var HUDModel; // Heads-Up Display 
	var EnemyModel;
	var AssetModel = require(MODELS_PATH + "AssetModel.js"); 
	var CameraModel = require(MODELS_PATH + "CameraModel.js"); 
	var WorldModel = require(MODELS_PATH + "WorldModel.js"); 
	var WorldController = require(CONTROLLERS_PATH + "WorldController.js"); 
	var GameController = require(CONTROLLERS_PATH + "GameController.js"); 
	var CameraController = require(CONTROLLERS_PATH + "CameraController.js"); 
	var WorldGenerationController;
	var PhysicsController;
	var PlayerController = require(CONTROLLERS_PATH + "PlayerController.js"); 
	var EnemyController;
	var TerrainController = require(CONTROLLERS_PATH + "TerrainController.js"); 
	var AssetController = require(CONTROLLERS_PATH + "AssetController.js"); 
	var KeyboardController = require(CONTROLLERS_PATH + "KeyboardController.js"); 
	var InitController = require(CONTROLLERS_PATH + "InitController.js"); 
	var TestController = require(CONTROLLERS_PATH + "TestController.js"); 
	

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
