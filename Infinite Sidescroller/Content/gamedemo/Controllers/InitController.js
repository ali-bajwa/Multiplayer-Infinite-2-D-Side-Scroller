var KeyboardController, GameController, AssetController, TerrainController, PhysicsController;
var GameModel, AssetModel, PhysicsModel;
var Config, Utility, B2d;

KeyboardController = require("./KeyboardController.js");
GameController = require("./GameController.js");
AssetController = require("./AssetController.js");
TerrainController = require("./TerrainController.js");
PhysicsController = require("./PhysicsController.js");

GameModel = require("../Models/GameModel.js");
AssetModel = require("../Models/AssetModel.js");
PhysicsModel = require("../Models/PhysicsModel.js");

Config = require("../Config.js");
Utility = require("../Utility.js");
B2d = require("../B2d.js");

var InitController = (function(){
	// why do you want to put initialization of everything into the InitController?
	// Because if initialization of smth depends on initialization of smth else,
	// it's easier to control here
	//
	// e.g. if you try to do var foo = $('#foo'); somewhere in other module,
	// you can get foo = null; as code of that module can execute before the html document
	// was fully loaded, but >InitController.init< is called after document was loaded, so
	// -1 potential problem. Btw, at this moment in time the the stuff is set to work that way
	// using html (<body onload=...); maybe using JS would be better? Idk;

	var init = function(mode){

		setup_screen();
		setup_events();
		setup_debug_canvas(mode);


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
			setup_debug_canvas();



		AssetController.load_all(asset_path);

		// <<<
		

	};

	var physics = function(){
		// a lot of 
		// sutff from the PhysicsModel and PhysicsController should be moved here	
	};

	var setup_debug_canvas = function(mode){
		// more stuff may be done later
		// should be refactored and prettyfied
		
		if(mode == "test"){
			var context = $(Config.DEBUG_CANVAS_NAME).context // something weird goes here maybe .getContext("2d");?
			PhysicsModel.context = context;
			PhysicsModel.debugDraw = new B2d.b2DebugDraw();
			PhysicsModel.debugDraw.SetSprite(PhysicsModel.context);
			PhysicsModel.debugDraw.SetDrawScale(PhysicsModel.scale);
			PhysicsModel.debugDraw.SetFillAlpha(0.3);
			PhysicsModel.debugDraw.SetLineThickness(1.0);
			PhysicsModel.debugDraw.SetFlags(B2d.b2DebugDraw.e_shapeBit | B2d.b2DebugDraw.e_jointBit);
			PhysicsModel.world.SetDebugDraw(PhysicsModel.debugDraw);

			Config.B2D.debug_draw = true;
		}else{
			// nothing
		}
	
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
		GameModel.stage = new createjs.Stage(Config.MAIN_CANVAS_NAME);
		GameModel.stage.canvas.width = Config.SCREEN_W;
		GameModel.stage.canvas.height = Config.SCREEN_H;


		GameModel.hero = AssetController.request_bitmap("greek_warrior");
		GameModel.hero.regX = 0;
		GameModel.hero.regY = GameModel.hero.image.height;
		GameModel.hero.x = 100;
		GameModel.hero.y = 510;

		GameModel.stage.addChild(GameModel.hero);

		setup_ticker();

		TerrainController.generate_terrain(); // Initial terrain generation
	};


	return {
		init: init,
	};
})();

module.exports = InitController;
