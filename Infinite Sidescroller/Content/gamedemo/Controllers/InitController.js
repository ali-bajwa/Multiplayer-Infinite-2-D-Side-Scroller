var KeyboardController, GameController, AssetController, TerrainController;
var GameModel, AssetModel;
var Config, Utility;

KeyboardController = require("./KeyboardController.js");
GameController = require("./GameController.js");
AssetController = require("./AssetController.js");
TerrainController = require("./TerrainController.js");

GameModel = require("../Models/GameModel.js");
AssetModel = require("../Models/AssetModel.js");

Config = require("../Config.js");
Utility = require("../Utility.js");

var InitController = (function(){

	var init = function(mode){

		setup_screen();
		setup_events();


		// Notice that asset dependent stuff doesn't (and mustn't) start until
		// all assets are completely loaded. That includes ticker, i.e. no ticks are processed
		// until everything is loaded. If you want something different, e.g. display some sort of loading
		// animation - let me know.
		// Look into the setup_asset_dependent function
			AssetModel.loader = new createjs.LoadQueue(false); // loading resourses using preload.js
			AssetModel.loader.addEventListener("complete", setup_asset_dependant);

			// if more stuff needs to be done for the test mode, 
			// or more types of it needs to be added
			// you can safely make the following a separate function
			var asset_path = (mode == "test") ? "./assets/art/" : "../Content/gamedemo/assets/art/";

			AssetController.load_all(asset_path);

		// <<<

	};

	
	var setup_screen = function(){

		// Setting up other stuff:
		// e.g setup canvas size
		
		// TODO: allow resizes?

		Config.SCREEN_W = $('#canvas_container').width(); // is dynamically set to pixel width of the containing element

		// possible resizing technique: 
		// http://www.fabiobiondi.com/blog/2012/08/createjs-and-html5-canvas-resize-fullscreen-and-liquid-layouts/

		
		//$('#debug_canvas').width(String(SCREEN_W) + "px");
		//$('#display_canvas').width(String(SCREEN_W) + "px");

		//$('#debug_canvas').height(String(SCREEN_H) + "px");
		//$('#display_canvas').height(String(SCREEN_H) + "px");
		
	};

	var setup_ticker = function(){

		createjs.Ticker.setFPS(Config.FPS);

		// ticker: on each tick call GameController.update_all();
		createjs.Ticker.addEventListener("tick", GameController.update_all);

	
	};

	var setup_events = function(){


		// keyboard input event: on each keyboard event call appropriate KeyboardController function
		document.onkeydown = KeyboardController.keydown;
		document.onkeyup = KeyboardController.keyup;

			// on interrupt event: stop/pause ticker ?

	};

	var setup_asset_dependant = function(){
		// this may need to move to either load_game or some sort of resizing function
		GameModel.stage = new createjs.Stage("display_canvas");
		GameModel.stage.canvas.width = Config.SCREEN_W;
		GameModel.stage.canvas.height = Config.SCREEN_H;

		hero_sheet = new createjs.SpriteSheet({
		    "framerate": 2,
		    "images": ["../Content/gamedemo/assets/art/warrior.png"],
		    "frames": { "regX": 0, "regY": 60, "height": 60, "width": 36, "count": 3 },
		    "animations": {
		        "run": {
		            "frames": [0, 1, 2],
		            "next": "run",
		            "speed": 0.5
		        }
		    }

		});

		GameModel.hero = new createjs.Sprite(hero_sheet, "run");

		GameModel.hero.x = 100; // set position
		GameModel.hero.y = 516;

		/*GameModel.hero = AssetController.request_bitmap("greek_warrior");
		GameModel.hero.regX = 0;
		GameModel.hero.regY = GameModel.hero.image.height;
		GameModel.hero.x = 100;
		GameModel.hero.y = 513;*/

		chomper_sheet = new createjs.SpriteSheet({
		    "framerate": 2,
		    "images": ["../Content/gamedemo/assets/art/Chompers.png"],
		    "frames": { "regX": 0, "regY": 210, "height": 210, "width": 337, "count": 2 },
		    "animations": {
		        "run": [0, 1, "run"]
		    }

		});

		GameModel.chomper = new createjs.Sprite(chomper_sheet, "run");

		GameModel.chomper.x = 700; // set position
		GameModel.chomper.y = 555;

		GameModel.score = new createjs.Text();
		GameModel.score.x = 10;
		GameModel.score.y = 10;
		GameModel.score.text = "0";
		GameModel.score.font = "bold 16pt Arial";

		GameModel.stage.addChild(GameModel.chomper, GameModel.hero, GameModel.score);

		setup_ticker();

		TerrainController.generate_terrain(); // Initial terrain generation
	};


	return {
		init: init,
	};
})();

module.exports = InitController;
