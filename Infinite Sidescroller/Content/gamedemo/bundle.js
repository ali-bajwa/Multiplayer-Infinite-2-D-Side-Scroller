(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"C:\\Users\\kmh11894\\Documents\\SideScroller\\Infinite Sidescroller\\Content\\gamedemo\\Config.js":[function(require,module,exports){
var Config = {
	SCREEN_W: 0, // set up when the page is loaded (to 95% of width of containing element) 
	SCREEN_H: 600,


	// Frames Per Second. Essentially, frequency of createjs.Ticker 
	// Warning! Frequency of the Box2D physics updates may be different
	// (Currently not implemented)
	FPS: 30, 

	B2D_SCALE: 30
	// END Constants section <<<
};

module.exports = Config;

},{}],"C:\\Users\\kmh11894\\Documents\\SideScroller\\Infinite Sidescroller\\Content\\gamedemo\\Controllers\\AssetController.js":[function(require,module,exports){
var AssetModel = require("../Models/AssetModel.js");

var AssetController = (function(){
	/*
	   AssetController is in charge of setting up all bitmaps/animations/other resources
	   for everyone else.
   */

	// use AssetModel.loader.getResult("id_of_the_asset");


	var load_all = function(asset_path){

		/* TODO make model with the easily managed tables of resources which will be
		   added to the loader automatically
		*/

		var manifest = AssetModel.manifest;	


		//loader = new createjs.LoadQueue(false); // loading resourses using preload.js
		//loader.addEventListener("complete", handleComplete);
		AssetModel.loader.loadManifest(manifest, true, asset_path);
	}

	var request_bitmap = function(id){
		// if id is invalid, throw meaningful exception?
		return new createjs.Bitmap(AssetModel.loader.getResult(id));
		// TODO research DisplayObject's caching. and maybe incorporate
	};

	
	return {
		load_all: load_all,
		request_bitmap: request_bitmap
	};

})();

module.exports = AssetController;

},{"../Models/AssetModel.js":"C:\\Users\\kmh11894\\Documents\\SideScroller\\Infinite Sidescroller\\Content\\gamedemo\\Models\\AssetModel.js"}],"C:\\Users\\kmh11894\\Documents\\SideScroller\\Infinite Sidescroller\\Content\\gamedemo\\Controllers\\CameraController.js":[function(require,module,exports){
var CameraModel = require("../Models/CameraModel.js");

var PlayerController, TerrainController;

PlayerController = require("./PlayerController.js");
EnemyController = require("./EnemyController.js");
TerrainController = require("./TerrainController.js");

var CameraController = (function(){

	var update = function(){
		var following = CameraModel.following;
		if(following){
			center_at(following.x,  following.y);
		}

	};

	var center_at = function(x, y){
		/* NOT IMPLEMENTED
		 * instantly center camera at the given coordinates
		 * Alg: calculate x offset, calculate y ofsset, call >move<
		 */
		var scr_center = get_screen_center(); // current camera position

		var offset_x = x - scr_center.x;
		var offset_y = y - scr_center.y;

		lg("x, y", offset_x, offset_y);

		move(offset_x, offset_y);
	};

	var get_screen_center = function(){
		// is a function to handle screen resize functionality, when implemented
		return {
			x: SCREEN_W / 2,
			y: SCREEN_H / 2
		};

	};

	var follow = function(easeljs_obj){
		/*
		 * follow specific easeljs object everywhere
		 */

		CameraModel.following = easeljs_obj;
	};

	var unfollow = function(){
		CameraModel.following = null;
	};

	var move = function(offset_x, offset_y){
		/*
		 * moving camera in some direction essentially means
		 * moving world (terrain, background, players, enemies, etc.)
		 * in opposite direction, and screen elements (HUD, minimap) in the smae
		 * direction
		 * Later it may need significantly more functionality 
		 */

		var n_x = (-1) * offset_x;
		var n_y = (-1) * offset_y;

		TerrainController.move(n_x, n_y);
		EnemyController.move(n_x, n_y);
		PlayerController.move(n_x, n_y);

		// other related things.move(..., ...)
	};

	var slide = function(x, y, speed){
		/* NOT IMPLEMENTED
		 * assign the camera a coordinates to slide to with >speed< pixels/tick
		 * if we do scripted scenes, that could be useful
		 */
	};

	return {
		move: move,
		follow: follow,
		unfollow: unfollow,
		update: update

	};
})();

module.exports = CameraController;

},{"../Models/CameraModel.js":"C:\\Users\\kmh11894\\Documents\\SideScroller\\Infinite Sidescroller\\Content\\gamedemo\\Models\\CameraModel.js","./EnemyController.js":"C:\\Users\\kmh11894\\Documents\\SideScroller\\Infinite Sidescroller\\Content\\gamedemo\\Controllers\\EnemyController.js","./PlayerController.js":"C:\\Users\\kmh11894\\Documents\\SideScroller\\Infinite Sidescroller\\Content\\gamedemo\\Controllers\\PlayerController.js","./TerrainController.js":"C:\\Users\\kmh11894\\Documents\\SideScroller\\Infinite Sidescroller\\Content\\gamedemo\\Controllers\\TerrainController.js"}],"C:\\Users\\kmh11894\\Documents\\SideScroller\\Infinite Sidescroller\\Content\\gamedemo\\Controllers\\EnemyController.js":[function(require,module,exports){
var GameModel;
GameModel = require("../Models/GameModel.js");

var EnemyController = (function(){
	var move = function(offset_x, offset_y){
		GameModel.chomper.x += offset_x;
		GameModel.chomper.y += offset_y;
	};

	return {
		move: move
	};
})();

module.exports = EnemyController;

},{"../Models/GameModel.js":"C:\\Users\\kmh11894\\Documents\\SideScroller\\Infinite Sidescroller\\Content\\gamedemo\\Models\\GameModel.js"}],"C:\\Users\\kmh11894\\Documents\\SideScroller\\Infinite Sidescroller\\Content\\gamedemo\\Controllers\\GameController.js":[function(require,module,exports){
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
		        vertical_velocity = 450;
		        movement_modifier = 0.3;
		    }
		}

		if(cmds.indexOf("left") > -1){
			if(GameModel.hero.x > 10){
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

		if (loop == 6) {
		    marker = !(marker);
		    loop = 0;
		}
		else {
		    loop += 1;
		}
		EnemyController.move(-1, 0);
		GameModel.chomper.gotoAndStop(marker ? 1 : 0);

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

},{"../Models/GameModel.js":"C:\\Users\\kmh11894\\Documents\\SideScroller\\Infinite Sidescroller\\Content\\gamedemo\\Models\\GameModel.js","./CameraController.js":"C:\\Users\\kmh11894\\Documents\\SideScroller\\Infinite Sidescroller\\Content\\gamedemo\\Controllers\\CameraController.js","./EnemyController.js":"C:\\Users\\kmh11894\\Documents\\SideScroller\\Infinite Sidescroller\\Content\\gamedemo\\Controllers\\EnemyController.js","./KeyboardController.js":"C:\\Users\\kmh11894\\Documents\\SideScroller\\Infinite Sidescroller\\Content\\gamedemo\\Controllers\\KeyboardController.js","./PlayerController.js":"C:\\Users\\kmh11894\\Documents\\SideScroller\\Infinite Sidescroller\\Content\\gamedemo\\Controllers\\PlayerController.js"}],"C:\\Users\\kmh11894\\Documents\\SideScroller\\Infinite Sidescroller\\Content\\gamedemo\\Controllers\\InitController.js":[function(require,module,exports){
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

		GameModel.stage.addChild(GameModel.chomper, GameModel.hero);

		setup_ticker();

		TerrainController.generate_terrain(); // Initial terrain generation
	};


	return {
		init: init,
	};
})();

module.exports = InitController;

},{"../Config.js":"C:\\Users\\kmh11894\\Documents\\SideScroller\\Infinite Sidescroller\\Content\\gamedemo\\Config.js","../Models/AssetModel.js":"C:\\Users\\kmh11894\\Documents\\SideScroller\\Infinite Sidescroller\\Content\\gamedemo\\Models\\AssetModel.js","../Models/GameModel.js":"C:\\Users\\kmh11894\\Documents\\SideScroller\\Infinite Sidescroller\\Content\\gamedemo\\Models\\GameModel.js","../Utility.js":"C:\\Users\\kmh11894\\Documents\\SideScroller\\Infinite Sidescroller\\Content\\gamedemo\\Utility.js","./AssetController.js":"C:\\Users\\kmh11894\\Documents\\SideScroller\\Infinite Sidescroller\\Content\\gamedemo\\Controllers\\AssetController.js","./GameController.js":"C:\\Users\\kmh11894\\Documents\\SideScroller\\Infinite Sidescroller\\Content\\gamedemo\\Controllers\\GameController.js","./KeyboardController.js":"C:\\Users\\kmh11894\\Documents\\SideScroller\\Infinite Sidescroller\\Content\\gamedemo\\Controllers\\KeyboardController.js","./TerrainController.js":"C:\\Users\\kmh11894\\Documents\\SideScroller\\Infinite Sidescroller\\Content\\gamedemo\\Controllers\\TerrainController.js"}],"C:\\Users\\kmh11894\\Documents\\SideScroller\\Infinite Sidescroller\\Content\\gamedemo\\Controllers\\KeyboardController.js":[function(require,module,exports){
var KeyboardController = (function()
{
	// TODO: does this section belong into the controller? >>>
	var keys = {};

	var TR_TABLES = // translation tables
	{
		code_to_name: {
			37: "left",
			38: "up",
			39: "right",
			40: "down"
		}
	}

	// <<< end TODO

	var get_active_commands = function(table){
		// get all commands associated with keys that are defined in the >table<,
		// and are currently pressed
		//
		// returns: array of commands
		
		var commands = [];
		
		$.each(table, function(key, cmd){
			if(keys[key]){
				commands.push(cmd);
			}
		});

		return commands;
	};

	// public:
	
	var keydown = function(event){
		keys[event.keyCode] = true;
	};

	var keyup = function(event){
		delete keys[event.keyCode];
	};


	var movement_commands = function(){
		return get_active_commands(TR_TABLES.code_to_name);
	};


	return {
		keydown: keydown,
		keyup: keyup,

		movement_commands: movement_commands

	};

})();

module.exports = KeyboardController;

},{}],"C:\\Users\\kmh11894\\Documents\\SideScroller\\Infinite Sidescroller\\Content\\gamedemo\\Controllers\\PlayerController.js":[function(require,module,exports){
var GameModel;
GameModel = require("../Models/GameModel.js");

var PlayerController = (function(){

		var move_right = function(){
		move(10, 0);
	};

	var move_left = function(){
		//GameModel.hero.x -=10;
		move(-10, 0);
	};

	var move = function(offset_x, offset_y){
		GameModel.hero.x += offset_x;
		GameModel.hero.y += offset_y;
	};

	return {
		move_right: move_right,
		move_left: move_left,
		move: move
	};
})();

module.exports = PlayerController;

},{"../Models/GameModel.js":"C:\\Users\\kmh11894\\Documents\\SideScroller\\Infinite Sidescroller\\Content\\gamedemo\\Models\\GameModel.js"}],"C:\\Users\\kmh11894\\Documents\\SideScroller\\Infinite Sidescroller\\Content\\gamedemo\\Controllers\\TerrainController.js":[function(require,module,exports){
var GameModel, TerrainModel;
var AssetController;
var Utility, Config;

AssetController = require("./AssetController.js");

GameModel = require("../Models/GameModel.js");
TerrainModel = require("../Models/TerrainModel.js");

Utility = require("../Utility.js");
Config = require("../Config.js");


var TerrainController = (function(){
	var LVL_PROB = [
		[7, 2, 1],
		[0, 7, 3],
		[0, 1, 9]
	]; // probabilities for each level; temporary!

	
	
	var retrieve_world_parameters = function(){};

	var generate_terrain = function(){
		/*
		   Load appropriate amount of the terrain ahead
		   Only a demo!!! must be made more sophisticated!
		*/


		var terrain_choices = ["grass", "middle_terrain", "bottom_terrain"];

		// TODO: make more efficient by detecting whether terrain moved since the last time
		for(var i = 0; i < TerrainModel.terrain_queues.length; i++){
			//// for each level of terrain
			var slice_index = 0; //
			var terrain_queue =  TerrainModel.terrain_queues[i];

			for(var j = 0; j < terrain_queue.length; j++){
				// for each tile, if tile is ofscreen, delete it
				var tile = terrain_queue[j];
				// TODO break after encountering first tile with bigger index (I do not implement it now to simplify debugging)
				if(tile.x < -100){
					GameModel.stage.removeChild(tile);
					slice_index += 1;
				   }
			   }

			if(slice_index > 0){
				TerrainModel.terrain_queues[i] = terrain_queue.slice(slice_index);
				var terrain_queue =  TerrainModel.terrain_queues[i];
			}


			
			var last_tile = terrain_queue[terrain_queue.length - 1];

			while(terrain_queue.length < 70){
					// while level queue isn't full
					var next_x = last_tile ? last_tile.x + 30 : -100;

					var random_id = Utility.random_choice(LVL_PROB[i], terrain_choices);

					var rand_tile = AssetController.request_bitmap(random_id);

					//This must be it's own function and be greately generalized and standartized:
					rand_tile.regX = 0;
					rand_tile.regY = 30;
					rand_tile.y = 510 + 30*(i+1);
					rand_tile.x = next_x;

					// this must be done in its own function, to keep track of everything
					// e.g. "z-index" of every element, etc.
					GameModel.stage.addChild(rand_tile); 

					terrain_queue.push(rand_tile);

					last_tile = rand_tile;

			   }

		   
	   } // end for 



	}; //end generate_terrain

	var for_each_tile = function(f){
		// takes function >f< that takes three parameters: tile (eseljs object),
		// terrain_lvl (int), and tile_index (int)
		// calls this function for every tile of the terrain
		
		var queues = TerrainModel.terrain_queues;

		$.each(queues, function(terrain_lvl){
			$.each(queues[terrain_lvl], function(tile_index){
				f(queues[terrain_lvl][tile_index], terrain_lvl, tile_index);
			});
		});

	};

	var move_left = function(pixels){
		// Should I scrap this function and just use >move<, or is this a helpful shortcut?
		
		move((-1)*pixels, 0);

	}; // end move_left
	
	var move = function(offset_x, offset_y){
		if(offset_x != 0){
			for_each_tile(function(tile, terrain_lvl, tile_index){
				tile.x += offset_x;
			});

		}// fi

		if(offset_y != 0){
			for_each_tile(function(tile, terrain_lvl, tile_index){
				tile.y += offset_y;
			});

		}

		// TODO: rework this suboptimal solution, so that terrain is regenerated only once per tick
		// instead of at each movement command; solution should be better than just placing the call
		// into the GameController.update_all function
		generate_terrain();
	};

	return {
		generate_terrain: generate_terrain,
		move_left: move_left,
		move: move
	}
})();

module.exports = TerrainController;

},{"../Config.js":"C:\\Users\\kmh11894\\Documents\\SideScroller\\Infinite Sidescroller\\Content\\gamedemo\\Config.js","../Models/GameModel.js":"C:\\Users\\kmh11894\\Documents\\SideScroller\\Infinite Sidescroller\\Content\\gamedemo\\Models\\GameModel.js","../Models/TerrainModel.js":"C:\\Users\\kmh11894\\Documents\\SideScroller\\Infinite Sidescroller\\Content\\gamedemo\\Models\\TerrainModel.js","../Utility.js":"C:\\Users\\kmh11894\\Documents\\SideScroller\\Infinite Sidescroller\\Content\\gamedemo\\Utility.js","./AssetController.js":"C:\\Users\\kmh11894\\Documents\\SideScroller\\Infinite Sidescroller\\Content\\gamedemo\\Controllers\\AssetController.js"}],"C:\\Users\\kmh11894\\Documents\\SideScroller\\Infinite Sidescroller\\Content\\gamedemo\\Controllers\\TestController.js":[function(require,module,exports){
var TestController = (function(){
	// placeholder for implementing testing
	// may be changed/removed/upgraded depending on how we will handle our tests
	
	var test = function(){
		// if you need some sort of tests launched, this is one of the places to do it
	};

	var post_loading_test = function(){
		// TODO: call when loading assets is completed if there are some tests that need
		// to be done at that moment. (Refer to InitController.init and 
		// InitController.setup_asset_dependent methods
	};


	return {
		test: test,
		post_loading_test: post_loading_test,
	}
})();

module.exports = TestController;

},{}],"C:\\Users\\kmh11894\\Documents\\SideScroller\\Infinite Sidescroller\\Content\\gamedemo\\Controllers\\WorldController.js":[function(require,module,exports){

},{}],"C:\\Users\\kmh11894\\Documents\\SideScroller\\Infinite Sidescroller\\Content\\gamedemo\\Models\\AssetModel.js":[function(require,module,exports){
var AssetModel = new function(){
	// As always, almost anything is initialized in the InitController
	
	this.loader;

	this.manifest = [ // defining resources to be loaded in bulk with preload.js
			{ src: "greek_warrior.png", id: "greek_warrior" },
            { src: "ant.png", id: "ant" },
            { src: "Chompers.png", id: "chomper"},
			//{src:, id:},
			{src: "middle_terrain.png", id:"middle_terrain"},
			{src: "bottom_terrain.png", id: "bottom_terrain"},
			{src: "grass.png", id: "grass"}
		]; 
		// TODO make adding resources easier? Automatic loading 
		// of everything from assets, automatic names etc.?

	this.shapes = {}; // maybe this aren't needed

	this.bitmaps = {};

	this.animations = {};

};

module.exports = AssetModel;

},{}],"C:\\Users\\kmh11894\\Documents\\SideScroller\\Infinite Sidescroller\\Content\\gamedemo\\Models\\CameraModel.js":[function(require,module,exports){
var CameraModel = new function(){
	this // not implemented
	this.center_y; // not implemented

	this.following;


};

module.exports = CameraModel;

},{}],"C:\\Users\\kmh11894\\Documents\\SideScroller\\Infinite Sidescroller\\Content\\gamedemo\\Models\\GameModel.js":[function(require,module,exports){
var GameModel = new function(){ // main model

	// Notice that all these variables will be initialized from the InitController

	this // easeljs representation of the main canvas

	this.other_players = {}; // players controlled by remote clients

	this.hero; // player controlled by the current user

	this.chomper; 
};

module.exports = GameModel;

},{}],"C:\\Users\\kmh11894\\Documents\\SideScroller\\Infinite Sidescroller\\Content\\gamedemo\\Models\\TerrainModel.js":[function(require,module,exports){
var TerrainModel = new function(){

	// TODO: dynamic initialization
	this.terrain_queues = [
		[],
		[],
		[]
	];

};

module.exports = TerrainModel;

},{}],"C:\\Users\\kmh11894\\Documents\\SideScroller\\Infinite Sidescroller\\Content\\gamedemo\\Models\\WorldModel.js":[function(require,module,exports){
arguments[4]["C:\\Users\\kmh11894\\Documents\\SideScroller\\Infinite Sidescroller\\Content\\gamedemo\\Controllers\\WorldController.js"][0].apply(exports,arguments)
},{}],"C:\\Users\\kmh11894\\Documents\\SideScroller\\Infinite Sidescroller\\Content\\gamedemo\\Utility.js":[function(require,module,exports){
var Utility = (function()
{
	var lg = function()
	{
		/*
		 * shortcut to console.log()
		 * prints all arguments to console
		 * first argument is used as a label for the rest
		 *
		 * each labeled group is enclosed into the colored delimiters
		 * >>> and <<< so it's easily distinguished. I found it helpful,
		 * if you don't let me know, or use something else
		 */
		console.log("%s %c %s", arguments[0], "background: #DAF2B1", ">>>");
		
		for(var i = 1; i < arguments.length; i++)
		{
			console.log("\t", arguments[i]);
		}
		console.log("%c<<<", "background: #DAF2B1");

	};

	var random_choice = function(probabilities, choices){
		/*
		   takes 2 arrays with elements at corresponding indexes
		   being choice and it's probability. picks random one.
		   choices are anything, probability is integer a, such that
		   probability of a choice is a/10. with a < 10, of course
		   and probabilities adding up to 10. 
		   Yes, it's not very good implementation (read: terrible), 
		   and since you noticed, now it's your job to improve it.

		*/

		// array with choices duplicated a proper amount of times based on
		// their probability
		var blah = []; 

		for(var i = 0; i < choices.length; i++){
			for(var j = 0; j < probabilities[i]; j++){
				blah.push(choices[i]);
			}
		}

		var rand_index = Math.floor(Math.random() * blah.length);

		return blah[rand_index];
	};

	

	return {
		lg: lg,
		random_choice: random_choice
	};

})();

module.exports = Utility;

},{}],"C:\\Users\\kmh11894\\Documents\\SideScroller\\Infinite Sidescroller\\Content\\gamedemo\\main.js":[function(require,module,exports){
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
	var EnemyController = require("./Controllers/EnemyController.js");
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

},{"./Config.js":"C:\\Users\\kmh11894\\Documents\\SideScroller\\Infinite Sidescroller\\Content\\gamedemo\\Config.js","./Controllers/AssetController.js":"C:\\Users\\kmh11894\\Documents\\SideScroller\\Infinite Sidescroller\\Content\\gamedemo\\Controllers\\AssetController.js","./Controllers/CameraController.js":"C:\\Users\\kmh11894\\Documents\\SideScroller\\Infinite Sidescroller\\Content\\gamedemo\\Controllers\\CameraController.js","./Controllers/EnemyController.js":"C:\\Users\\kmh11894\\Documents\\SideScroller\\Infinite Sidescroller\\Content\\gamedemo\\Controllers\\EnemyController.js","./Controllers/GameController.js":"C:\\Users\\kmh11894\\Documents\\SideScroller\\Infinite Sidescroller\\Content\\gamedemo\\Controllers\\GameController.js","./Controllers/InitController.js":"C:\\Users\\kmh11894\\Documents\\SideScroller\\Infinite Sidescroller\\Content\\gamedemo\\Controllers\\InitController.js","./Controllers/KeyboardController.js":"C:\\Users\\kmh11894\\Documents\\SideScroller\\Infinite Sidescroller\\Content\\gamedemo\\Controllers\\KeyboardController.js","./Controllers/PlayerController.js":"C:\\Users\\kmh11894\\Documents\\SideScroller\\Infinite Sidescroller\\Content\\gamedemo\\Controllers\\PlayerController.js","./Controllers/TerrainController.js":"C:\\Users\\kmh11894\\Documents\\SideScroller\\Infinite Sidescroller\\Content\\gamedemo\\Controllers\\TerrainController.js","./Controllers/TestController.js":"C:\\Users\\kmh11894\\Documents\\SideScroller\\Infinite Sidescroller\\Content\\gamedemo\\Controllers\\TestController.js","./Controllers/WorldController.js":"C:\\Users\\kmh11894\\Documents\\SideScroller\\Infinite Sidescroller\\Content\\gamedemo\\Controllers\\WorldController.js","./Models/AssetModel.js":"C:\\Users\\kmh11894\\Documents\\SideScroller\\Infinite Sidescroller\\Content\\gamedemo\\Models\\AssetModel.js","./Models/CameraModel.js":"C:\\Users\\kmh11894\\Documents\\SideScroller\\Infinite Sidescroller\\Content\\gamedemo\\Models\\CameraModel.js","./Models/GameModel.js":"C:\\Users\\kmh11894\\Documents\\SideScroller\\Infinite Sidescroller\\Content\\gamedemo\\Models\\GameModel.js","./Models/TerrainModel.js":"C:\\Users\\kmh11894\\Documents\\SideScroller\\Infinite Sidescroller\\Content\\gamedemo\\Models\\TerrainModel.js","./Models/WorldModel.js":"C:\\Users\\kmh11894\\Documents\\SideScroller\\Infinite Sidescroller\\Content\\gamedemo\\Models\\WorldModel.js","./Utility.js":"C:\\Users\\kmh11894\\Documents\\SideScroller\\Infinite Sidescroller\\Content\\gamedemo\\Utility.js"}]},{},["C:\\Users\\kmh11894\\Documents\\SideScroller\\Infinite Sidescroller\\Content\\gamedemo\\main.js"])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL0FwcERhdGEvUm9hbWluZy9ucG0vbm9kZV9tb2R1bGVzL3dhdGNoaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJDb25maWcuanMiLCJDb250cm9sbGVycy9Bc3NldENvbnRyb2xsZXIuanMiLCJDb250cm9sbGVycy9DYW1lcmFDb250cm9sbGVyLmpzIiwiQ29udHJvbGxlcnMvRW5lbXlDb250cm9sbGVyLmpzIiwiQ29udHJvbGxlcnMvR2FtZUNvbnRyb2xsZXIuanMiLCJDb250cm9sbGVycy9Jbml0Q29udHJvbGxlci5qcyIsIkNvbnRyb2xsZXJzL0tleWJvYXJkQ29udHJvbGxlci5qcyIsIkNvbnRyb2xsZXJzL1BsYXllckNvbnRyb2xsZXIuanMiLCJDb250cm9sbGVycy9UZXJyYWluQ29udHJvbGxlci5qcyIsIkNvbnRyb2xsZXJzL1Rlc3RDb250cm9sbGVyLmpzIiwiQ29udHJvbGxlcnMvV29ybGRDb250cm9sbGVyLmpzIiwiTW9kZWxzL0Fzc2V0TW9kZWwuanMiLCJNb2RlbHMvQ2FtZXJhTW9kZWwuanMiLCJNb2RlbHMvR2FtZU1vZGVsLmpzIiwiTW9kZWxzL1RlcnJhaW5Nb2RlbC5qcyIsIk1vZGVscy9Xb3JsZE1vZGVsLmpzIiwiVXRpbGl0eS5qcyIsIm1haW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIENvbmZpZyA9IHtcclxuXHRTQ1JFRU5fVzogMCwgLy8gc2V0IHVwIHdoZW4gdGhlIHBhZ2UgaXMgbG9hZGVkICh0byA5NSUgb2Ygd2lkdGggb2YgY29udGFpbmluZyBlbGVtZW50KSBcclxuXHRTQ1JFRU5fSDogNjAwLFxyXG5cclxuXHJcblx0Ly8gRnJhbWVzIFBlciBTZWNvbmQuIEVzc2VudGlhbGx5LCBmcmVxdWVuY3kgb2YgY3JlYXRlanMuVGlja2VyIFxyXG5cdC8vIFdhcm5pbmchIEZyZXF1ZW5jeSBvZiB0aGUgQm94MkQgcGh5c2ljcyB1cGRhdGVzIG1heSBiZSBkaWZmZXJlbnRcclxuXHQvLyAoQ3VycmVudGx5IG5vdCBpbXBsZW1lbnRlZClcclxuXHRGUFM6IDMwLCBcclxuXHJcblx0QjJEX1NDQUxFOiAzMFxyXG5cdC8vIEVORCBDb25zdGFudHMgc2VjdGlvbiA8PDxcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQ29uZmlnO1xyXG4iLCJ2YXIgQXNzZXRNb2RlbCA9IHJlcXVpcmUoXCIuLi9Nb2RlbHMvQXNzZXRNb2RlbC5qc1wiKTtcclxuXHJcbnZhciBBc3NldENvbnRyb2xsZXIgPSAoZnVuY3Rpb24oKXtcclxuXHQvKlxyXG5cdCAgIEFzc2V0Q29udHJvbGxlciBpcyBpbiBjaGFyZ2Ugb2Ygc2V0dGluZyB1cCBhbGwgYml0bWFwcy9hbmltYXRpb25zL290aGVyIHJlc291cmNlc1xyXG5cdCAgIGZvciBldmVyeW9uZSBlbHNlLlxyXG4gICAqL1xyXG5cclxuXHQvLyB1c2UgQXNzZXRNb2RlbC5sb2FkZXIuZ2V0UmVzdWx0KFwiaWRfb2ZfdGhlX2Fzc2V0XCIpO1xyXG5cclxuXHJcblx0dmFyIGxvYWRfYWxsID0gZnVuY3Rpb24oYXNzZXRfcGF0aCl7XHJcblxyXG5cdFx0LyogVE9ETyBtYWtlIG1vZGVsIHdpdGggdGhlIGVhc2lseSBtYW5hZ2VkIHRhYmxlcyBvZiByZXNvdXJjZXMgd2hpY2ggd2lsbCBiZVxyXG5cdFx0ICAgYWRkZWQgdG8gdGhlIGxvYWRlciBhdXRvbWF0aWNhbGx5XHJcblx0XHQqL1xyXG5cclxuXHRcdHZhciBtYW5pZmVzdCA9IEFzc2V0TW9kZWwubWFuaWZlc3Q7XHRcclxuXHJcblxyXG5cdFx0Ly9sb2FkZXIgPSBuZXcgY3JlYXRlanMuTG9hZFF1ZXVlKGZhbHNlKTsgLy8gbG9hZGluZyByZXNvdXJzZXMgdXNpbmcgcHJlbG9hZC5qc1xyXG5cdFx0Ly9sb2FkZXIuYWRkRXZlbnRMaXN0ZW5lcihcImNvbXBsZXRlXCIsIGhhbmRsZUNvbXBsZXRlKTtcclxuXHRcdEFzc2V0TW9kZWwubG9hZGVyLmxvYWRNYW5pZmVzdChtYW5pZmVzdCwgdHJ1ZSwgYXNzZXRfcGF0aCk7XHJcblx0fVxyXG5cclxuXHR2YXIgcmVxdWVzdF9iaXRtYXAgPSBmdW5jdGlvbihpZCl7XHJcblx0XHQvLyBpZiBpZCBpcyBpbnZhbGlkLCB0aHJvdyBtZWFuaW5nZnVsIGV4Y2VwdGlvbj9cclxuXHRcdHJldHVybiBuZXcgY3JlYXRlanMuQml0bWFwKEFzc2V0TW9kZWwubG9hZGVyLmdldFJlc3VsdChpZCkpO1xyXG5cdFx0Ly8gVE9ETyByZXNlYXJjaCBEaXNwbGF5T2JqZWN0J3MgY2FjaGluZy4gYW5kIG1heWJlIGluY29ycG9yYXRlXHJcblx0fTtcclxuXHJcblx0XHJcblx0cmV0dXJuIHtcclxuXHRcdGxvYWRfYWxsOiBsb2FkX2FsbCxcclxuXHRcdHJlcXVlc3RfYml0bWFwOiByZXF1ZXN0X2JpdG1hcFxyXG5cdH07XHJcblxyXG59KSgpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBBc3NldENvbnRyb2xsZXI7XHJcbiIsInZhciBDYW1lcmFNb2RlbCA9IHJlcXVpcmUoXCIuLi9Nb2RlbHMvQ2FtZXJhTW9kZWwuanNcIik7XHJcblxyXG52YXIgUGxheWVyQ29udHJvbGxlciwgVGVycmFpbkNvbnRyb2xsZXI7XHJcblxyXG5QbGF5ZXJDb250cm9sbGVyID0gcmVxdWlyZShcIi4vUGxheWVyQ29udHJvbGxlci5qc1wiKTtcclxuRW5lbXlDb250cm9sbGVyID0gcmVxdWlyZShcIi4vRW5lbXlDb250cm9sbGVyLmpzXCIpO1xyXG5UZXJyYWluQ29udHJvbGxlciA9IHJlcXVpcmUoXCIuL1RlcnJhaW5Db250cm9sbGVyLmpzXCIpO1xyXG5cclxudmFyIENhbWVyYUNvbnRyb2xsZXIgPSAoZnVuY3Rpb24oKXtcclxuXHJcblx0dmFyIHVwZGF0ZSA9IGZ1bmN0aW9uKCl7XHJcblx0XHR2YXIgZm9sbG93aW5nID0gQ2FtZXJhTW9kZWwuZm9sbG93aW5nO1xyXG5cdFx0aWYoZm9sbG93aW5nKXtcclxuXHRcdFx0Y2VudGVyX2F0KGZvbGxvd2luZy54LCAgZm9sbG93aW5nLnkpO1xyXG5cdFx0fVxyXG5cclxuXHR9O1xyXG5cclxuXHR2YXIgY2VudGVyX2F0ID0gZnVuY3Rpb24oeCwgeSl7XHJcblx0XHQvKiBOT1QgSU1QTEVNRU5URURcclxuXHRcdCAqIGluc3RhbnRseSBjZW50ZXIgY2FtZXJhIGF0IHRoZSBnaXZlbiBjb29yZGluYXRlc1xyXG5cdFx0ICogQWxnOiBjYWxjdWxhdGUgeCBvZmZzZXQsIGNhbGN1bGF0ZSB5IG9mc3NldCwgY2FsbCA+bW92ZTxcclxuXHRcdCAqL1xyXG5cdFx0dmFyIHNjcl9jZW50ZXIgPSBnZXRfc2NyZWVuX2NlbnRlcigpOyAvLyBjdXJyZW50IGNhbWVyYSBwb3NpdGlvblxyXG5cclxuXHRcdHZhciBvZmZzZXRfeCA9IHggLSBzY3JfY2VudGVyLng7XHJcblx0XHR2YXIgb2Zmc2V0X3kgPSB5IC0gc2NyX2NlbnRlci55O1xyXG5cclxuXHRcdGxnKFwieCwgeVwiLCBvZmZzZXRfeCwgb2Zmc2V0X3kpO1xyXG5cclxuXHRcdG1vdmUob2Zmc2V0X3gsIG9mZnNldF95KTtcclxuXHR9O1xyXG5cclxuXHR2YXIgZ2V0X3NjcmVlbl9jZW50ZXIgPSBmdW5jdGlvbigpe1xyXG5cdFx0Ly8gaXMgYSBmdW5jdGlvbiB0byBoYW5kbGUgc2NyZWVuIHJlc2l6ZSBmdW5jdGlvbmFsaXR5LCB3aGVuIGltcGxlbWVudGVkXHJcblx0XHRyZXR1cm4ge1xyXG5cdFx0XHR4OiBTQ1JFRU5fVyAvIDIsXHJcblx0XHRcdHk6IFNDUkVFTl9IIC8gMlxyXG5cdFx0fTtcclxuXHJcblx0fTtcclxuXHJcblx0dmFyIGZvbGxvdyA9IGZ1bmN0aW9uKGVhc2VsanNfb2JqKXtcclxuXHRcdC8qXHJcblx0XHQgKiBmb2xsb3cgc3BlY2lmaWMgZWFzZWxqcyBvYmplY3QgZXZlcnl3aGVyZVxyXG5cdFx0ICovXHJcblxyXG5cdFx0Q2FtZXJhTW9kZWwuZm9sbG93aW5nID0gZWFzZWxqc19vYmo7XHJcblx0fTtcclxuXHJcblx0dmFyIHVuZm9sbG93ID0gZnVuY3Rpb24oKXtcclxuXHRcdENhbWVyYU1vZGVsLmZvbGxvd2luZyA9IG51bGw7XHJcblx0fTtcclxuXHJcblx0dmFyIG1vdmUgPSBmdW5jdGlvbihvZmZzZXRfeCwgb2Zmc2V0X3kpe1xyXG5cdFx0LypcclxuXHRcdCAqIG1vdmluZyBjYW1lcmEgaW4gc29tZSBkaXJlY3Rpb24gZXNzZW50aWFsbHkgbWVhbnNcclxuXHRcdCAqIG1vdmluZyB3b3JsZCAodGVycmFpbiwgYmFja2dyb3VuZCwgcGxheWVycywgZW5lbWllcywgZXRjLilcclxuXHRcdCAqIGluIG9wcG9zaXRlIGRpcmVjdGlvbiwgYW5kIHNjcmVlbiBlbGVtZW50cyAoSFVELCBtaW5pbWFwKSBpbiB0aGUgc21hZVxyXG5cdFx0ICogZGlyZWN0aW9uXHJcblx0XHQgKiBMYXRlciBpdCBtYXkgbmVlZCBzaWduaWZpY2FudGx5IG1vcmUgZnVuY3Rpb25hbGl0eSBcclxuXHRcdCAqL1xyXG5cclxuXHRcdHZhciBuX3ggPSAoLTEpICogb2Zmc2V0X3g7XHJcblx0XHR2YXIgbl95ID0gKC0xKSAqIG9mZnNldF95O1xyXG5cclxuXHRcdFRlcnJhaW5Db250cm9sbGVyLm1vdmUobl94LCBuX3kpO1xyXG5cdFx0RW5lbXlDb250cm9sbGVyLm1vdmUobl94LCBuX3kpO1xyXG5cdFx0UGxheWVyQ29udHJvbGxlci5tb3ZlKG5feCwgbl95KTtcclxuXHJcblx0XHQvLyBvdGhlciByZWxhdGVkIHRoaW5ncy5tb3ZlKC4uLiwgLi4uKVxyXG5cdH07XHJcblxyXG5cdHZhciBzbGlkZSA9IGZ1bmN0aW9uKHgsIHksIHNwZWVkKXtcclxuXHRcdC8qIE5PVCBJTVBMRU1FTlRFRFxyXG5cdFx0ICogYXNzaWduIHRoZSBjYW1lcmEgYSBjb29yZGluYXRlcyB0byBzbGlkZSB0byB3aXRoID5zcGVlZDwgcGl4ZWxzL3RpY2tcclxuXHRcdCAqIGlmIHdlIGRvIHNjcmlwdGVkIHNjZW5lcywgdGhhdCBjb3VsZCBiZSB1c2VmdWxcclxuXHRcdCAqL1xyXG5cdH07XHJcblxyXG5cdHJldHVybiB7XHJcblx0XHRtb3ZlOiBtb3ZlLFxyXG5cdFx0Zm9sbG93OiBmb2xsb3csXHJcblx0XHR1bmZvbGxvdzogdW5mb2xsb3csXHJcblx0XHR1cGRhdGU6IHVwZGF0ZVxyXG5cclxuXHR9O1xyXG59KSgpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBDYW1lcmFDb250cm9sbGVyO1xyXG4iLCJ2YXIgR2FtZU1vZGVsO1xyXG5HYW1lTW9kZWwgPSByZXF1aXJlKFwiLi4vTW9kZWxzL0dhbWVNb2RlbC5qc1wiKTtcclxuXHJcbnZhciBFbmVteUNvbnRyb2xsZXIgPSAoZnVuY3Rpb24oKXtcclxuXHR2YXIgbW92ZSA9IGZ1bmN0aW9uKG9mZnNldF94LCBvZmZzZXRfeSl7XHJcblx0XHRHYW1lTW9kZWwuY2hvbXBlci54ICs9IG9mZnNldF94O1xyXG5cdFx0R2FtZU1vZGVsLmNob21wZXIueSArPSBvZmZzZXRfeTtcclxuXHR9O1xyXG5cclxuXHRyZXR1cm4ge1xyXG5cdFx0bW92ZTogbW92ZVxyXG5cdH07XHJcbn0pKCk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEVuZW15Q29udHJvbGxlcjtcclxuIiwidmFyIENhbWVyYUNvbnRyb2xsZXIsIFBsYXllckNvbnRyb2xsZXIsIEtleWJvYXJkQ29udHJvbGxlcjtcclxudmFyIEdhbWVNb2RlbDtcclxuXHJcbkNhbWVyYUNvbnRyb2xsZXIgPSByZXF1aXJlKFwiLi9DYW1lcmFDb250cm9sbGVyLmpzXCIpO1xyXG5QbGF5ZXJDb250cm9sbGVyID0gcmVxdWlyZShcIi4vUGxheWVyQ29udHJvbGxlci5qc1wiKTtcclxuS2V5Ym9hcmRDb250cm9sbGVyID0gcmVxdWlyZShcIi4vS2V5Ym9hcmRDb250cm9sbGVyLmpzXCIpO1xyXG5FbmVteUNvbnRyb2xsZXIgPSByZXF1aXJlKFwiLi9FbmVteUNvbnRyb2xsZXIuanNcIik7XHJcblxyXG5HYW1lTW9kZWwgPSByZXF1aXJlKFwiLi4vTW9kZWxzL0dhbWVNb2RlbC5qc1wiKTtcclxuXHJcbnZhciBHYW1lQ29udHJvbGxlciA9IChmdW5jdGlvbigpe1xyXG5cclxuXHR2YXIgTU9WRU1FTlRfRURHRSA9IDUwMDsgLy8gd2hlcmUgdGVycmFpbiBzdGFydCBzY3JvbGxpbmdcclxuXHJcblx0dmFyIHZlcnRpY2FsX3ZlbG9jaXR5ID0gMDtcclxuXHR2YXIgZGVsdGFfcyA9IDA7XHJcblx0dmFyIG1vdmVtZW50X21vZGlmaWVyID0gMTtcclxuXHR2YXIgbG9vcCA9IDA7XHJcblx0dmFyIG1hcmtlciA9IHRydWU7XHJcblxyXG5cdHZhciB1cGRhdGVfYWxsID0gZnVuY3Rpb24oZXZlbnQpe1xyXG5cdFx0LypcclxuXHRcdCAqIG1haW4gZnVuY3Rpb24gcHJldHR5IG11Y2hcclxuXHRcdCAqIGV2ZXJ5Z2hpbmcgZWxzZSBpcyBjYWxsZWQgZnJvbSBoZXJlIGV2ZXJ5IHRpY2tcclxuXHRcdCAqL1xyXG5cdFx0XHJcblx0XHR2YXIgZGVsdGEgPSBldmVudC5kZWx0YTtcclxuXHJcblx0XHR2YXIgY21kcyA9IEtleWJvYXJkQ29udHJvbGxlci5tb3ZlbWVudF9jb21tYW5kcygpO1xyXG5cclxuXHRcdC8vIFNlcGFyYXRlIGZ1bmN0aW9uID4+PlxyXG5cdFx0aWYoY21kcy5pbmRleE9mKFwicmlnaHRcIikgPiAtMSl7XHJcblx0XHRcdC8vIHRlbXBvcmFyeVxyXG5cclxuXHRcdFx0aWYoR2FtZU1vZGVsLmhlcm8ueCA+IE1PVkVNRU5UX0VER0Upe1xyXG5cdFx0XHRcdFBsYXllckNvbnRyb2xsZXIubW92ZV9yaWdodChHYW1lTW9kZWwuaGVybyk7XHJcblx0XHRcdFx0Q2FtZXJhQ29udHJvbGxlci5tb3ZlKDEwLCAwKTtcclxuXHRcdFx0XHQvL1RlcnJhaW5Db250cm9sbGVyLm1vdmVfbGVmdCgxMCk7XHJcblx0XHRcdFx0Ly9DYW1lcmFDb250cm9sbGVyLmZvbGxvdyhHYW1lTW9kZWwuaGVybyk7XHJcblx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdC8vQ2FtZXJhQ29udHJvbGxlci51bmZvbGxvdygpO1xyXG5cdFx0XHRcdFBsYXllckNvbnRyb2xsZXIubW92ZV9yaWdodChHYW1lTW9kZWwuaGVybyk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHR2YXIgYmFzZV9zcGVlZCA9IGV2ZW50LmRlbHRhIC8gMTAwMCAqIDUwICogbW92ZW1lbnRfbW9kaWZpZXI7XHJcblxyXG5cdFx0aWYgKGNtZHMuaW5kZXhPZihcInVwXCIpID4gLTEpIHtcclxuXHRcdCAgICBpZiAoR2FtZU1vZGVsLmhlcm8ueSA9PSA1MTYpIHtcclxuXHRcdCAgICAgICAgdmVydGljYWxfdmVsb2NpdHkgPSA0NTA7XHJcblx0XHQgICAgICAgIG1vdmVtZW50X21vZGlmaWVyID0gMC4zO1xyXG5cdFx0ICAgIH1cclxuXHRcdH1cclxuXHJcblx0XHRpZihjbWRzLmluZGV4T2YoXCJsZWZ0XCIpID4gLTEpe1xyXG5cdFx0XHRpZihHYW1lTW9kZWwuaGVyby54ID4gMTApe1xyXG5cdFx0XHRcdFBsYXllckNvbnRyb2xsZXIubW92ZV9sZWZ0KEdhbWVNb2RlbC5oZXJvKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdHZlcnRpY2FsX3ZlbG9jaXR5IC09IGV2ZW50LmRlbHRhIC8gMTAwMCAqIDcwMDtcclxuXHJcblx0XHRkZWx0YV9zID0gdmVydGljYWxfdmVsb2NpdHkgKiBldmVudC5kZWx0YSAvIDEwMDA7XHJcblxyXG5cdFx0aWYgKChHYW1lTW9kZWwuaGVyby55IC0gZGVsdGFfcykgPD0gNTE2KSB7XHJcblx0XHQgICAgR2FtZU1vZGVsLmhlcm8ueSAtPSBkZWx0YV9zO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSB7XHJcblx0XHQgICAgR2FtZU1vZGVsLmhlcm8ueSA9IDUxNjtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoR2FtZU1vZGVsLmhlcm8ueSA9PSA1MTYpIHtcclxuXHRcdCAgICBtb3ZlbWVudF9tb2RpZmllciA9IDE7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKGxvb3AgPT0gNikge1xyXG5cdFx0ICAgIG1hcmtlciA9ICEobWFya2VyKTtcclxuXHRcdCAgICBsb29wID0gMDtcclxuXHRcdH1cclxuXHRcdGVsc2Uge1xyXG5cdFx0ICAgIGxvb3AgKz0gMTtcclxuXHRcdH1cclxuXHRcdEVuZW15Q29udHJvbGxlci5tb3ZlKC0xLCAwKTtcclxuXHRcdEdhbWVNb2RlbC5jaG9tcGVyLmdvdG9BbmRTdG9wKG1hcmtlciA/IDEgOiAwKTtcclxuXHJcblx0XHQvLyA8PDxcclxuXHJcblx0XHQvL1RlcnJhaW5Db250cm9sbGVyLmdlbmVyYXRlX3RlcnJhaW4oKTsgXHJcblx0XHRcclxuXHRcdC8vIFNob3VsZCBiZSBjYWxsZWQgYWZ0ZXIgYWxsIG1vdmVtZW50IG9mIG9iamVjdHMgaXMgZG9uZTpcclxuXHRcdENhbWVyYUNvbnRyb2xsZXIudXBkYXRlKCk7IFxyXG5cclxuXHRcdEdhbWVNb2RlbC5zdGFnZS51cGRhdGUoKTtcclxuXHR9O1xyXG5cclxuXHJcblxyXG5cdFxyXG5cclxuXHRyZXR1cm4ge1xyXG5cdFx0dXBkYXRlX2FsbDogdXBkYXRlX2FsbCxcclxuXHR9O1xyXG5cclxufSkoKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gR2FtZUNvbnRyb2xsZXI7XHJcbiIsInZhciBLZXlib2FyZENvbnRyb2xsZXIsIEdhbWVDb250cm9sbGVyLCBBc3NldENvbnRyb2xsZXIsIFRlcnJhaW5Db250cm9sbGVyO1xyXG52YXIgR2FtZU1vZGVsLCBBc3NldE1vZGVsO1xyXG52YXIgQ29uZmlnLCBVdGlsaXR5O1xyXG5cclxuS2V5Ym9hcmRDb250cm9sbGVyID0gcmVxdWlyZShcIi4vS2V5Ym9hcmRDb250cm9sbGVyLmpzXCIpO1xyXG5HYW1lQ29udHJvbGxlciA9IHJlcXVpcmUoXCIuL0dhbWVDb250cm9sbGVyLmpzXCIpO1xyXG5Bc3NldENvbnRyb2xsZXIgPSByZXF1aXJlKFwiLi9Bc3NldENvbnRyb2xsZXIuanNcIik7XHJcblRlcnJhaW5Db250cm9sbGVyID0gcmVxdWlyZShcIi4vVGVycmFpbkNvbnRyb2xsZXIuanNcIik7XHJcblxyXG5HYW1lTW9kZWwgPSByZXF1aXJlKFwiLi4vTW9kZWxzL0dhbWVNb2RlbC5qc1wiKTtcclxuQXNzZXRNb2RlbCA9IHJlcXVpcmUoXCIuLi9Nb2RlbHMvQXNzZXRNb2RlbC5qc1wiKTtcclxuXHJcbkNvbmZpZyA9IHJlcXVpcmUoXCIuLi9Db25maWcuanNcIik7XHJcblV0aWxpdHkgPSByZXF1aXJlKFwiLi4vVXRpbGl0eS5qc1wiKTtcclxuXHJcbnZhciBJbml0Q29udHJvbGxlciA9IChmdW5jdGlvbigpe1xyXG5cclxuXHR2YXIgaW5pdCA9IGZ1bmN0aW9uKG1vZGUpe1xyXG5cclxuXHRcdHNldHVwX3NjcmVlbigpO1xyXG5cdFx0c2V0dXBfZXZlbnRzKCk7XHJcblxyXG5cclxuXHRcdC8vIE5vdGljZSB0aGF0IGFzc2V0IGRlcGVuZGVudCBzdHVmZiBkb2Vzbid0IChhbmQgbXVzdG4ndCkgc3RhcnQgdW50aWxcclxuXHRcdC8vIGFsbCBhc3NldHMgYXJlIGNvbXBsZXRlbHkgbG9hZGVkLiBUaGF0IGluY2x1ZGVzIHRpY2tlciwgaS5lLiBubyB0aWNrcyBhcmUgcHJvY2Vzc2VkXHJcblx0XHQvLyB1bnRpbCBldmVyeXRoaW5nIGlzIGxvYWRlZC4gSWYgeW91IHdhbnQgc29tZXRoaW5nIGRpZmZlcmVudCwgZS5nLiBkaXNwbGF5IHNvbWUgc29ydCBvZiBsb2FkaW5nXHJcblx0XHQvLyBhbmltYXRpb24gLSBsZXQgbWUga25vdy5cclxuXHRcdC8vIExvb2sgaW50byB0aGUgc2V0dXBfYXNzZXRfZGVwZW5kZW50IGZ1bmN0aW9uXHJcblx0XHRcdEFzc2V0TW9kZWwubG9hZGVyID0gbmV3IGNyZWF0ZWpzLkxvYWRRdWV1ZShmYWxzZSk7IC8vIGxvYWRpbmcgcmVzb3Vyc2VzIHVzaW5nIHByZWxvYWQuanNcclxuXHRcdFx0QXNzZXRNb2RlbC5sb2FkZXIuYWRkRXZlbnRMaXN0ZW5lcihcImNvbXBsZXRlXCIsIHNldHVwX2Fzc2V0X2RlcGVuZGFudCk7XHJcblxyXG5cdFx0XHQvLyBpZiBtb3JlIHN0dWZmIG5lZWRzIHRvIGJlIGRvbmUgZm9yIHRoZSB0ZXN0IG1vZGUsIFxyXG5cdFx0XHQvLyBvciBtb3JlIHR5cGVzIG9mIGl0IG5lZWRzIHRvIGJlIGFkZGVkXHJcblx0XHRcdC8vIHlvdSBjYW4gc2FmZWx5IG1ha2UgdGhlIGZvbGxvd2luZyBhIHNlcGFyYXRlIGZ1bmN0aW9uXHJcblx0XHRcdHZhciBhc3NldF9wYXRoID0gKG1vZGUgPT0gXCJ0ZXN0XCIpID8gXCIuL2Fzc2V0cy9hcnQvXCIgOiBcIi4uL0NvbnRlbnQvZ2FtZWRlbW8vYXNzZXRzL2FydC9cIjtcclxuXHJcblx0XHRcdEFzc2V0Q29udHJvbGxlci5sb2FkX2FsbChhc3NldF9wYXRoKTtcclxuXHJcblx0XHQvLyA8PDxcclxuXHJcblx0fTtcclxuXHJcblx0XHJcblx0dmFyIHNldHVwX3NjcmVlbiA9IGZ1bmN0aW9uKCl7XHJcblxyXG5cdFx0Ly8gU2V0dGluZyB1cCBvdGhlciBzdHVmZjpcclxuXHRcdC8vIGUuZyBzZXR1cCBjYW52YXMgc2l6ZVxyXG5cdFx0XHJcblx0XHQvLyBUT0RPOiBhbGxvdyByZXNpemVzP1xyXG5cclxuXHRcdENvbmZpZy5TQ1JFRU5fVyA9ICQoJyNjYW52YXNfY29udGFpbmVyJykud2lkdGgoKTsgLy8gaXMgZHluYW1pY2FsbHkgc2V0IHRvIHBpeGVsIHdpZHRoIG9mIHRoZSBjb250YWluaW5nIGVsZW1lbnRcclxuXHJcblx0XHQvLyBwb3NzaWJsZSByZXNpemluZyB0ZWNobmlxdWU6IFxyXG5cdFx0Ly8gaHR0cDovL3d3dy5mYWJpb2Jpb25kaS5jb20vYmxvZy8yMDEyLzA4L2NyZWF0ZWpzLWFuZC1odG1sNS1jYW52YXMtcmVzaXplLWZ1bGxzY3JlZW4tYW5kLWxpcXVpZC1sYXlvdXRzL1xyXG5cclxuXHRcdFxyXG5cdFx0Ly8kKCcjZGVidWdfY2FudmFzJykud2lkdGgoU3RyaW5nKFNDUkVFTl9XKSArIFwicHhcIik7XHJcblx0XHQvLyQoJyNkaXNwbGF5X2NhbnZhcycpLndpZHRoKFN0cmluZyhTQ1JFRU5fVykgKyBcInB4XCIpO1xyXG5cclxuXHRcdC8vJCgnI2RlYnVnX2NhbnZhcycpLmhlaWdodChTdHJpbmcoU0NSRUVOX0gpICsgXCJweFwiKTtcclxuXHRcdC8vJCgnI2Rpc3BsYXlfY2FudmFzJykuaGVpZ2h0KFN0cmluZyhTQ1JFRU5fSCkgKyBcInB4XCIpO1xyXG5cdFx0XHJcblx0fTtcclxuXHJcblx0dmFyIHNldHVwX3RpY2tlciA9IGZ1bmN0aW9uKCl7XHJcblxyXG5cdFx0Y3JlYXRlanMuVGlja2VyLnNldEZQUyhDb25maWcuRlBTKTtcclxuXHJcblx0XHQvLyB0aWNrZXI6IG9uIGVhY2ggdGljayBjYWxsIEdhbWVDb250cm9sbGVyLnVwZGF0ZV9hbGwoKTtcclxuXHRcdGNyZWF0ZWpzLlRpY2tlci5hZGRFdmVudExpc3RlbmVyKFwidGlja1wiLCBHYW1lQ29udHJvbGxlci51cGRhdGVfYWxsKTtcclxuXHJcblx0XHJcblx0fTtcclxuXHJcblx0dmFyIHNldHVwX2V2ZW50cyA9IGZ1bmN0aW9uKCl7XHJcblxyXG5cclxuXHRcdC8vIGtleWJvYXJkIGlucHV0IGV2ZW50OiBvbiBlYWNoIGtleWJvYXJkIGV2ZW50IGNhbGwgYXBwcm9wcmlhdGUgS2V5Ym9hcmRDb250cm9sbGVyIGZ1bmN0aW9uXHJcblx0XHRkb2N1bWVudC5vbmtleWRvd24gPSBLZXlib2FyZENvbnRyb2xsZXIua2V5ZG93bjtcclxuXHRcdGRvY3VtZW50Lm9ua2V5dXAgPSBLZXlib2FyZENvbnRyb2xsZXIua2V5dXA7XHJcblxyXG5cdFx0XHQvLyBvbiBpbnRlcnJ1cHQgZXZlbnQ6IHN0b3AvcGF1c2UgdGlja2VyID9cclxuXHJcblx0fTtcclxuXHJcblx0dmFyIHNldHVwX2Fzc2V0X2RlcGVuZGFudCA9IGZ1bmN0aW9uKCl7XHJcblx0XHQvLyB0aGlzIG1heSBuZWVkIHRvIG1vdmUgdG8gZWl0aGVyIGxvYWRfZ2FtZSBvciBzb21lIHNvcnQgb2YgcmVzaXppbmcgZnVuY3Rpb25cclxuXHRcdEdhbWVNb2RlbC5zdGFnZSA9IG5ldyBjcmVhdGVqcy5TdGFnZShcImRpc3BsYXlfY2FudmFzXCIpO1xyXG5cdFx0R2FtZU1vZGVsLnN0YWdlLmNhbnZhcy53aWR0aCA9IENvbmZpZy5TQ1JFRU5fVztcclxuXHRcdEdhbWVNb2RlbC5zdGFnZS5jYW52YXMuaGVpZ2h0ID0gQ29uZmlnLlNDUkVFTl9IO1xyXG5cclxuXHRcdGhlcm9fc2hlZXQgPSBuZXcgY3JlYXRlanMuU3ByaXRlU2hlZXQoe1xyXG5cdFx0ICAgIFwiZnJhbWVyYXRlXCI6IDIsXHJcblx0XHQgICAgXCJpbWFnZXNcIjogW1wiLi4vQ29udGVudC9nYW1lZGVtby9hc3NldHMvYXJ0L3dhcnJpb3IucG5nXCJdLFxyXG5cdFx0ICAgIFwiZnJhbWVzXCI6IHsgXCJyZWdYXCI6IDAsIFwicmVnWVwiOiA2MCwgXCJoZWlnaHRcIjogNjAsIFwid2lkdGhcIjogMzYsIFwiY291bnRcIjogMyB9LFxyXG5cdFx0ICAgIFwiYW5pbWF0aW9uc1wiOiB7XHJcblx0XHQgICAgICAgIFwicnVuXCI6IHtcclxuXHRcdCAgICAgICAgICAgIFwiZnJhbWVzXCI6IFswLCAxLCAyXSxcclxuXHRcdCAgICAgICAgICAgIFwibmV4dFwiOiBcInJ1blwiLFxyXG5cdFx0ICAgICAgICAgICAgXCJzcGVlZFwiOiAwLjVcclxuXHRcdCAgICAgICAgfVxyXG5cdFx0ICAgIH1cclxuXHJcblx0XHR9KTtcclxuXHJcblx0XHRHYW1lTW9kZWwuaGVybyA9IG5ldyBjcmVhdGVqcy5TcHJpdGUoaGVyb19zaGVldCwgXCJydW5cIik7XHJcblxyXG5cdFx0R2FtZU1vZGVsLmhlcm8ueCA9IDEwMDsgLy8gc2V0IHBvc2l0aW9uXHJcblx0XHRHYW1lTW9kZWwuaGVyby55ID0gNTE2O1xyXG5cclxuXHRcdC8qR2FtZU1vZGVsLmhlcm8gPSBBc3NldENvbnRyb2xsZXIucmVxdWVzdF9iaXRtYXAoXCJncmVla193YXJyaW9yXCIpO1xyXG5cdFx0R2FtZU1vZGVsLmhlcm8ucmVnWCA9IDA7XHJcblx0XHRHYW1lTW9kZWwuaGVyby5yZWdZID0gR2FtZU1vZGVsLmhlcm8uaW1hZ2UuaGVpZ2h0O1xyXG5cdFx0R2FtZU1vZGVsLmhlcm8ueCA9IDEwMDtcclxuXHRcdEdhbWVNb2RlbC5oZXJvLnkgPSA1MTM7Ki9cclxuXHJcblx0XHRjaG9tcGVyX3NoZWV0ID0gbmV3IGNyZWF0ZWpzLlNwcml0ZVNoZWV0KHtcclxuXHRcdCAgICBcImZyYW1lcmF0ZVwiOiAyLFxyXG5cdFx0ICAgIFwiaW1hZ2VzXCI6IFtcIi4uL0NvbnRlbnQvZ2FtZWRlbW8vYXNzZXRzL2FydC9DaG9tcGVycy5wbmdcIl0sXHJcblx0XHQgICAgXCJmcmFtZXNcIjogeyBcInJlZ1hcIjogMCwgXCJyZWdZXCI6IDIxMCwgXCJoZWlnaHRcIjogMjEwLCBcIndpZHRoXCI6IDMzNywgXCJjb3VudFwiOiAyIH0sXHJcblx0XHQgICAgXCJhbmltYXRpb25zXCI6IHtcclxuXHRcdCAgICAgICAgXCJydW5cIjogWzAsIDEsIFwicnVuXCJdXHJcblx0XHQgICAgfVxyXG5cclxuXHRcdH0pO1xyXG5cclxuXHRcdEdhbWVNb2RlbC5jaG9tcGVyID0gbmV3IGNyZWF0ZWpzLlNwcml0ZShjaG9tcGVyX3NoZWV0LCBcInJ1blwiKTtcclxuXHJcblx0XHRHYW1lTW9kZWwuY2hvbXBlci54ID0gNzAwOyAvLyBzZXQgcG9zaXRpb25cclxuXHRcdEdhbWVNb2RlbC5jaG9tcGVyLnkgPSA1NTU7XHJcblxyXG5cdFx0R2FtZU1vZGVsLnN0YWdlLmFkZENoaWxkKEdhbWVNb2RlbC5jaG9tcGVyLCBHYW1lTW9kZWwuaGVybyk7XHJcblxyXG5cdFx0c2V0dXBfdGlja2VyKCk7XHJcblxyXG5cdFx0VGVycmFpbkNvbnRyb2xsZXIuZ2VuZXJhdGVfdGVycmFpbigpOyAvLyBJbml0aWFsIHRlcnJhaW4gZ2VuZXJhdGlvblxyXG5cdH07XHJcblxyXG5cclxuXHRyZXR1cm4ge1xyXG5cdFx0aW5pdDogaW5pdCxcclxuXHR9O1xyXG59KSgpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBJbml0Q29udHJvbGxlcjtcclxuIiwidmFyIEtleWJvYXJkQ29udHJvbGxlciA9IChmdW5jdGlvbigpXHJcbntcclxuXHQvLyBUT0RPOiBkb2VzIHRoaXMgc2VjdGlvbiBiZWxvbmcgaW50byB0aGUgY29udHJvbGxlcj8gPj4+XHJcblx0dmFyIGtleXMgPSB7fTtcclxuXHJcblx0dmFyIFRSX1RBQkxFUyA9IC8vIHRyYW5zbGF0aW9uIHRhYmxlc1xyXG5cdHtcclxuXHRcdGNvZGVfdG9fbmFtZToge1xyXG5cdFx0XHQzNzogXCJsZWZ0XCIsXHJcblx0XHRcdDM4OiBcInVwXCIsXHJcblx0XHRcdDM5OiBcInJpZ2h0XCIsXHJcblx0XHRcdDQwOiBcImRvd25cIlxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0Ly8gPDw8IGVuZCBUT0RPXHJcblxyXG5cdHZhciBnZXRfYWN0aXZlX2NvbW1hbmRzID0gZnVuY3Rpb24odGFibGUpe1xyXG5cdFx0Ly8gZ2V0IGFsbCBjb21tYW5kcyBhc3NvY2lhdGVkIHdpdGgga2V5cyB0aGF0IGFyZSBkZWZpbmVkIGluIHRoZSA+dGFibGU8LFxyXG5cdFx0Ly8gYW5kIGFyZSBjdXJyZW50bHkgcHJlc3NlZFxyXG5cdFx0Ly9cclxuXHRcdC8vIHJldHVybnM6IGFycmF5IG9mIGNvbW1hbmRzXHJcblx0XHRcclxuXHRcdHZhciBjb21tYW5kcyA9IFtdO1xyXG5cdFx0XHJcblx0XHQkLmVhY2godGFibGUsIGZ1bmN0aW9uKGtleSwgY21kKXtcclxuXHRcdFx0aWYoa2V5c1trZXldKXtcclxuXHRcdFx0XHRjb21tYW5kcy5wdXNoKGNtZCk7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cclxuXHRcdHJldHVybiBjb21tYW5kcztcclxuXHR9O1xyXG5cclxuXHQvLyBwdWJsaWM6XHJcblx0XHJcblx0dmFyIGtleWRvd24gPSBmdW5jdGlvbihldmVudCl7XHJcblx0XHRrZXlzW2V2ZW50LmtleUNvZGVdID0gdHJ1ZTtcclxuXHR9O1xyXG5cclxuXHR2YXIga2V5dXAgPSBmdW5jdGlvbihldmVudCl7XHJcblx0XHRkZWxldGUga2V5c1tldmVudC5rZXlDb2RlXTtcclxuXHR9O1xyXG5cclxuXHJcblx0dmFyIG1vdmVtZW50X2NvbW1hbmRzID0gZnVuY3Rpb24oKXtcclxuXHRcdHJldHVybiBnZXRfYWN0aXZlX2NvbW1hbmRzKFRSX1RBQkxFUy5jb2RlX3RvX25hbWUpO1xyXG5cdH07XHJcblxyXG5cclxuXHRyZXR1cm4ge1xyXG5cdFx0a2V5ZG93bjoga2V5ZG93bixcclxuXHRcdGtleXVwOiBrZXl1cCxcclxuXHJcblx0XHRtb3ZlbWVudF9jb21tYW5kczogbW92ZW1lbnRfY29tbWFuZHNcclxuXHJcblx0fTtcclxuXHJcbn0pKCk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEtleWJvYXJkQ29udHJvbGxlcjtcclxuIiwidmFyIEdhbWVNb2RlbDtcclxuR2FtZU1vZGVsID0gcmVxdWlyZShcIi4uL01vZGVscy9HYW1lTW9kZWwuanNcIik7XHJcblxyXG52YXIgUGxheWVyQ29udHJvbGxlciA9IChmdW5jdGlvbigpe1xyXG5cclxuXHRcdHZhciBtb3ZlX3JpZ2h0ID0gZnVuY3Rpb24oKXtcclxuXHRcdG1vdmUoMTAsIDApO1xyXG5cdH07XHJcblxyXG5cdHZhciBtb3ZlX2xlZnQgPSBmdW5jdGlvbigpe1xyXG5cdFx0Ly9HYW1lTW9kZWwuaGVyby54IC09MTA7XHJcblx0XHRtb3ZlKC0xMCwgMCk7XHJcblx0fTtcclxuXHJcblx0dmFyIG1vdmUgPSBmdW5jdGlvbihvZmZzZXRfeCwgb2Zmc2V0X3kpe1xyXG5cdFx0R2FtZU1vZGVsLmhlcm8ueCArPSBvZmZzZXRfeDtcclxuXHRcdEdhbWVNb2RlbC5oZXJvLnkgKz0gb2Zmc2V0X3k7XHJcblx0fTtcclxuXHJcblx0cmV0dXJuIHtcclxuXHRcdG1vdmVfcmlnaHQ6IG1vdmVfcmlnaHQsXHJcblx0XHRtb3ZlX2xlZnQ6IG1vdmVfbGVmdCxcclxuXHRcdG1vdmU6IG1vdmVcclxuXHR9O1xyXG59KSgpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBQbGF5ZXJDb250cm9sbGVyO1xyXG4iLCJ2YXIgR2FtZU1vZGVsLCBUZXJyYWluTW9kZWw7XHJcbnZhciBBc3NldENvbnRyb2xsZXI7XHJcbnZhciBVdGlsaXR5LCBDb25maWc7XHJcblxyXG5Bc3NldENvbnRyb2xsZXIgPSByZXF1aXJlKFwiLi9Bc3NldENvbnRyb2xsZXIuanNcIik7XHJcblxyXG5HYW1lTW9kZWwgPSByZXF1aXJlKFwiLi4vTW9kZWxzL0dhbWVNb2RlbC5qc1wiKTtcclxuVGVycmFpbk1vZGVsID0gcmVxdWlyZShcIi4uL01vZGVscy9UZXJyYWluTW9kZWwuanNcIik7XHJcblxyXG5VdGlsaXR5ID0gcmVxdWlyZShcIi4uL1V0aWxpdHkuanNcIik7XHJcbkNvbmZpZyA9IHJlcXVpcmUoXCIuLi9Db25maWcuanNcIik7XHJcblxyXG5cclxudmFyIFRlcnJhaW5Db250cm9sbGVyID0gKGZ1bmN0aW9uKCl7XHJcblx0dmFyIExWTF9QUk9CID0gW1xyXG5cdFx0WzcsIDIsIDFdLFxyXG5cdFx0WzAsIDcsIDNdLFxyXG5cdFx0WzAsIDEsIDldXHJcblx0XTsgLy8gcHJvYmFiaWxpdGllcyBmb3IgZWFjaCBsZXZlbDsgdGVtcG9yYXJ5IVxyXG5cclxuXHRcclxuXHRcclxuXHR2YXIgcmV0cmlldmVfd29ybGRfcGFyYW1ldGVycyA9IGZ1bmN0aW9uKCl7fTtcclxuXHJcblx0dmFyIGdlbmVyYXRlX3RlcnJhaW4gPSBmdW5jdGlvbigpe1xyXG5cdFx0LypcclxuXHRcdCAgIExvYWQgYXBwcm9wcmlhdGUgYW1vdW50IG9mIHRoZSB0ZXJyYWluIGFoZWFkXHJcblx0XHQgICBPbmx5IGEgZGVtbyEhISBtdXN0IGJlIG1hZGUgbW9yZSBzb3BoaXN0aWNhdGVkIVxyXG5cdFx0Ki9cclxuXHJcblxyXG5cdFx0dmFyIHRlcnJhaW5fY2hvaWNlcyA9IFtcImdyYXNzXCIsIFwibWlkZGxlX3RlcnJhaW5cIiwgXCJib3R0b21fdGVycmFpblwiXTtcclxuXHJcblx0XHQvLyBUT0RPOiBtYWtlIG1vcmUgZWZmaWNpZW50IGJ5IGRldGVjdGluZyB3aGV0aGVyIHRlcnJhaW4gbW92ZWQgc2luY2UgdGhlIGxhc3QgdGltZVxyXG5cdFx0Zm9yKHZhciBpID0gMDsgaSA8IFRlcnJhaW5Nb2RlbC50ZXJyYWluX3F1ZXVlcy5sZW5ndGg7IGkrKyl7XHJcblx0XHRcdC8vLy8gZm9yIGVhY2ggbGV2ZWwgb2YgdGVycmFpblxyXG5cdFx0XHR2YXIgc2xpY2VfaW5kZXggPSAwOyAvL1xyXG5cdFx0XHR2YXIgdGVycmFpbl9xdWV1ZSA9ICBUZXJyYWluTW9kZWwudGVycmFpbl9xdWV1ZXNbaV07XHJcblxyXG5cdFx0XHRmb3IodmFyIGogPSAwOyBqIDwgdGVycmFpbl9xdWV1ZS5sZW5ndGg7IGorKyl7XHJcblx0XHRcdFx0Ly8gZm9yIGVhY2ggdGlsZSwgaWYgdGlsZSBpcyBvZnNjcmVlbiwgZGVsZXRlIGl0XHJcblx0XHRcdFx0dmFyIHRpbGUgPSB0ZXJyYWluX3F1ZXVlW2pdO1xyXG5cdFx0XHRcdC8vIFRPRE8gYnJlYWsgYWZ0ZXIgZW5jb3VudGVyaW5nIGZpcnN0IHRpbGUgd2l0aCBiaWdnZXIgaW5kZXggKEkgZG8gbm90IGltcGxlbWVudCBpdCBub3cgdG8gc2ltcGxpZnkgZGVidWdnaW5nKVxyXG5cdFx0XHRcdGlmKHRpbGUueCA8IC0xMDApe1xyXG5cdFx0XHRcdFx0R2FtZU1vZGVsLnN0YWdlLnJlbW92ZUNoaWxkKHRpbGUpO1xyXG5cdFx0XHRcdFx0c2xpY2VfaW5kZXggKz0gMTtcclxuXHRcdFx0XHQgICB9XHJcblx0XHRcdCAgIH1cclxuXHJcblx0XHRcdGlmKHNsaWNlX2luZGV4ID4gMCl7XHJcblx0XHRcdFx0VGVycmFpbk1vZGVsLnRlcnJhaW5fcXVldWVzW2ldID0gdGVycmFpbl9xdWV1ZS5zbGljZShzbGljZV9pbmRleCk7XHJcblx0XHRcdFx0dmFyIHRlcnJhaW5fcXVldWUgPSAgVGVycmFpbk1vZGVsLnRlcnJhaW5fcXVldWVzW2ldO1xyXG5cdFx0XHR9XHJcblxyXG5cclxuXHRcdFx0XHJcblx0XHRcdHZhciBsYXN0X3RpbGUgPSB0ZXJyYWluX3F1ZXVlW3RlcnJhaW5fcXVldWUubGVuZ3RoIC0gMV07XHJcblxyXG5cdFx0XHR3aGlsZSh0ZXJyYWluX3F1ZXVlLmxlbmd0aCA8IDcwKXtcclxuXHRcdFx0XHRcdC8vIHdoaWxlIGxldmVsIHF1ZXVlIGlzbid0IGZ1bGxcclxuXHRcdFx0XHRcdHZhciBuZXh0X3ggPSBsYXN0X3RpbGUgPyBsYXN0X3RpbGUueCArIDMwIDogLTEwMDtcclxuXHJcblx0XHRcdFx0XHR2YXIgcmFuZG9tX2lkID0gVXRpbGl0eS5yYW5kb21fY2hvaWNlKExWTF9QUk9CW2ldLCB0ZXJyYWluX2Nob2ljZXMpO1xyXG5cclxuXHRcdFx0XHRcdHZhciByYW5kX3RpbGUgPSBBc3NldENvbnRyb2xsZXIucmVxdWVzdF9iaXRtYXAocmFuZG9tX2lkKTtcclxuXHJcblx0XHRcdFx0XHQvL1RoaXMgbXVzdCBiZSBpdCdzIG93biBmdW5jdGlvbiBhbmQgYmUgZ3JlYXRlbHkgZ2VuZXJhbGl6ZWQgYW5kIHN0YW5kYXJ0aXplZDpcclxuXHRcdFx0XHRcdHJhbmRfdGlsZS5yZWdYID0gMDtcclxuXHRcdFx0XHRcdHJhbmRfdGlsZS5yZWdZID0gMzA7XHJcblx0XHRcdFx0XHRyYW5kX3RpbGUueSA9IDUxMCArIDMwKihpKzEpO1xyXG5cdFx0XHRcdFx0cmFuZF90aWxlLnggPSBuZXh0X3g7XHJcblxyXG5cdFx0XHRcdFx0Ly8gdGhpcyBtdXN0IGJlIGRvbmUgaW4gaXRzIG93biBmdW5jdGlvbiwgdG8ga2VlcCB0cmFjayBvZiBldmVyeXRoaW5nXHJcblx0XHRcdFx0XHQvLyBlLmcuIFwiei1pbmRleFwiIG9mIGV2ZXJ5IGVsZW1lbnQsIGV0Yy5cclxuXHRcdFx0XHRcdEdhbWVNb2RlbC5zdGFnZS5hZGRDaGlsZChyYW5kX3RpbGUpOyBcclxuXHJcblx0XHRcdFx0XHR0ZXJyYWluX3F1ZXVlLnB1c2gocmFuZF90aWxlKTtcclxuXHJcblx0XHRcdFx0XHRsYXN0X3RpbGUgPSByYW5kX3RpbGU7XHJcblxyXG5cdFx0XHQgICB9XHJcblxyXG5cdFx0ICAgXHJcblx0ICAgfSAvLyBlbmQgZm9yIFxyXG5cclxuXHJcblxyXG5cdH07IC8vZW5kIGdlbmVyYXRlX3RlcnJhaW5cclxuXHJcblx0dmFyIGZvcl9lYWNoX3RpbGUgPSBmdW5jdGlvbihmKXtcclxuXHRcdC8vIHRha2VzIGZ1bmN0aW9uID5mPCB0aGF0IHRha2VzIHRocmVlIHBhcmFtZXRlcnM6IHRpbGUgKGVzZWxqcyBvYmplY3QpLFxyXG5cdFx0Ly8gdGVycmFpbl9sdmwgKGludCksIGFuZCB0aWxlX2luZGV4IChpbnQpXHJcblx0XHQvLyBjYWxscyB0aGlzIGZ1bmN0aW9uIGZvciBldmVyeSB0aWxlIG9mIHRoZSB0ZXJyYWluXHJcblx0XHRcclxuXHRcdHZhciBxdWV1ZXMgPSBUZXJyYWluTW9kZWwudGVycmFpbl9xdWV1ZXM7XHJcblxyXG5cdFx0JC5lYWNoKHF1ZXVlcywgZnVuY3Rpb24odGVycmFpbl9sdmwpe1xyXG5cdFx0XHQkLmVhY2gocXVldWVzW3RlcnJhaW5fbHZsXSwgZnVuY3Rpb24odGlsZV9pbmRleCl7XHJcblx0XHRcdFx0ZihxdWV1ZXNbdGVycmFpbl9sdmxdW3RpbGVfaW5kZXhdLCB0ZXJyYWluX2x2bCwgdGlsZV9pbmRleCk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fSk7XHJcblxyXG5cdH07XHJcblxyXG5cdHZhciBtb3ZlX2xlZnQgPSBmdW5jdGlvbihwaXhlbHMpe1xyXG5cdFx0Ly8gU2hvdWxkIEkgc2NyYXAgdGhpcyBmdW5jdGlvbiBhbmQganVzdCB1c2UgPm1vdmU8LCBvciBpcyB0aGlzIGEgaGVscGZ1bCBzaG9ydGN1dD9cclxuXHRcdFxyXG5cdFx0bW92ZSgoLTEpKnBpeGVscywgMCk7XHJcblxyXG5cdH07IC8vIGVuZCBtb3ZlX2xlZnRcclxuXHRcclxuXHR2YXIgbW92ZSA9IGZ1bmN0aW9uKG9mZnNldF94LCBvZmZzZXRfeSl7XHJcblx0XHRpZihvZmZzZXRfeCAhPSAwKXtcclxuXHRcdFx0Zm9yX2VhY2hfdGlsZShmdW5jdGlvbih0aWxlLCB0ZXJyYWluX2x2bCwgdGlsZV9pbmRleCl7XHJcblx0XHRcdFx0dGlsZS54ICs9IG9mZnNldF94O1xyXG5cdFx0XHR9KTtcclxuXHJcblx0XHR9Ly8gZmlcclxuXHJcblx0XHRpZihvZmZzZXRfeSAhPSAwKXtcclxuXHRcdFx0Zm9yX2VhY2hfdGlsZShmdW5jdGlvbih0aWxlLCB0ZXJyYWluX2x2bCwgdGlsZV9pbmRleCl7XHJcblx0XHRcdFx0dGlsZS55ICs9IG9mZnNldF95O1xyXG5cdFx0XHR9KTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gVE9ETzogcmV3b3JrIHRoaXMgc3Vib3B0aW1hbCBzb2x1dGlvbiwgc28gdGhhdCB0ZXJyYWluIGlzIHJlZ2VuZXJhdGVkIG9ubHkgb25jZSBwZXIgdGlja1xyXG5cdFx0Ly8gaW5zdGVhZCBvZiBhdCBlYWNoIG1vdmVtZW50IGNvbW1hbmQ7IHNvbHV0aW9uIHNob3VsZCBiZSBiZXR0ZXIgdGhhbiBqdXN0IHBsYWNpbmcgdGhlIGNhbGxcclxuXHRcdC8vIGludG8gdGhlIEdhbWVDb250cm9sbGVyLnVwZGF0ZV9hbGwgZnVuY3Rpb25cclxuXHRcdGdlbmVyYXRlX3RlcnJhaW4oKTtcclxuXHR9O1xyXG5cclxuXHRyZXR1cm4ge1xyXG5cdFx0Z2VuZXJhdGVfdGVycmFpbjogZ2VuZXJhdGVfdGVycmFpbixcclxuXHRcdG1vdmVfbGVmdDogbW92ZV9sZWZ0LFxyXG5cdFx0bW92ZTogbW92ZVxyXG5cdH1cclxufSkoKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gVGVycmFpbkNvbnRyb2xsZXI7XHJcbiIsInZhciBUZXN0Q29udHJvbGxlciA9IChmdW5jdGlvbigpe1xyXG5cdC8vIHBsYWNlaG9sZGVyIGZvciBpbXBsZW1lbnRpbmcgdGVzdGluZ1xyXG5cdC8vIG1heSBiZSBjaGFuZ2VkL3JlbW92ZWQvdXBncmFkZWQgZGVwZW5kaW5nIG9uIGhvdyB3ZSB3aWxsIGhhbmRsZSBvdXIgdGVzdHNcclxuXHRcclxuXHR2YXIgdGVzdCA9IGZ1bmN0aW9uKCl7XHJcblx0XHQvLyBpZiB5b3UgbmVlZCBzb21lIHNvcnQgb2YgdGVzdHMgbGF1bmNoZWQsIHRoaXMgaXMgb25lIG9mIHRoZSBwbGFjZXMgdG8gZG8gaXRcclxuXHR9O1xyXG5cclxuXHR2YXIgcG9zdF9sb2FkaW5nX3Rlc3QgPSBmdW5jdGlvbigpe1xyXG5cdFx0Ly8gVE9ETzogY2FsbCB3aGVuIGxvYWRpbmcgYXNzZXRzIGlzIGNvbXBsZXRlZCBpZiB0aGVyZSBhcmUgc29tZSB0ZXN0cyB0aGF0IG5lZWRcclxuXHRcdC8vIHRvIGJlIGRvbmUgYXQgdGhhdCBtb21lbnQuIChSZWZlciB0byBJbml0Q29udHJvbGxlci5pbml0IGFuZCBcclxuXHRcdC8vIEluaXRDb250cm9sbGVyLnNldHVwX2Fzc2V0X2RlcGVuZGVudCBtZXRob2RzXHJcblx0fTtcclxuXHJcblxyXG5cdHJldHVybiB7XHJcblx0XHR0ZXN0OiB0ZXN0LFxyXG5cdFx0cG9zdF9sb2FkaW5nX3Rlc3Q6IHBvc3RfbG9hZGluZ190ZXN0LFxyXG5cdH1cclxufSkoKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gVGVzdENvbnRyb2xsZXI7XHJcbiIsbnVsbCwidmFyIEFzc2V0TW9kZWwgPSBuZXcgZnVuY3Rpb24oKXtcclxuXHQvLyBBcyBhbHdheXMsIGFsbW9zdCBhbnl0aGluZyBpcyBpbml0aWFsaXplZCBpbiB0aGUgSW5pdENvbnRyb2xsZXJcclxuXHRcclxuXHR0aGlzLmxvYWRlcjtcclxuXHJcblx0dGhpcy5tYW5pZmVzdCA9IFsgLy8gZGVmaW5pbmcgcmVzb3VyY2VzIHRvIGJlIGxvYWRlZCBpbiBidWxrIHdpdGggcHJlbG9hZC5qc1xyXG5cdFx0XHR7IHNyYzogXCJncmVla193YXJyaW9yLnBuZ1wiLCBpZDogXCJncmVla193YXJyaW9yXCIgfSxcclxuICAgICAgICAgICAgeyBzcmM6IFwiYW50LnBuZ1wiLCBpZDogXCJhbnRcIiB9LFxyXG4gICAgICAgICAgICB7IHNyYzogXCJDaG9tcGVycy5wbmdcIiwgaWQ6IFwiY2hvbXBlclwifSxcclxuXHRcdFx0Ly97c3JjOiwgaWQ6fSxcclxuXHRcdFx0e3NyYzogXCJtaWRkbGVfdGVycmFpbi5wbmdcIiwgaWQ6XCJtaWRkbGVfdGVycmFpblwifSxcclxuXHRcdFx0e3NyYzogXCJib3R0b21fdGVycmFpbi5wbmdcIiwgaWQ6IFwiYm90dG9tX3RlcnJhaW5cIn0sXHJcblx0XHRcdHtzcmM6IFwiZ3Jhc3MucG5nXCIsIGlkOiBcImdyYXNzXCJ9XHJcblx0XHRdOyBcclxuXHRcdC8vIFRPRE8gbWFrZSBhZGRpbmcgcmVzb3VyY2VzIGVhc2llcj8gQXV0b21hdGljIGxvYWRpbmcgXHJcblx0XHQvLyBvZiBldmVyeXRoaW5nIGZyb20gYXNzZXRzLCBhdXRvbWF0aWMgbmFtZXMgZXRjLj9cclxuXHJcblx0dGhpcy5zaGFwZXMgPSB7fTsgLy8gbWF5YmUgdGhpcyBhcmVuJ3QgbmVlZGVkXHJcblxyXG5cdHRoaXMuYml0bWFwcyA9IHt9O1xyXG5cclxuXHR0aGlzLmFuaW1hdGlvbnMgPSB7fTtcclxuXHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEFzc2V0TW9kZWw7XHJcbiIsInZhciBDYW1lcmFNb2RlbCA9IG5ldyBmdW5jdGlvbigpe1xyXG5cdHRoaXMgLy8gbm90IGltcGxlbWVudGVkXHJcblx0dGhpcy5jZW50ZXJfeTsgLy8gbm90IGltcGxlbWVudGVkXHJcblxyXG5cdHRoaXMuZm9sbG93aW5nO1xyXG5cclxuXHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IENhbWVyYU1vZGVsO1xyXG4iLCJ2YXIgR2FtZU1vZGVsID0gbmV3IGZ1bmN0aW9uKCl7IC8vIG1haW4gbW9kZWxcclxuXHJcblx0Ly8gTm90aWNlIHRoYXQgYWxsIHRoZXNlIHZhcmlhYmxlcyB3aWxsIGJlIGluaXRpYWxpemVkIGZyb20gdGhlIEluaXRDb250cm9sbGVyXHJcblxyXG5cdHRoaXMgLy8gZWFzZWxqcyByZXByZXNlbnRhdGlvbiBvZiB0aGUgbWFpbiBjYW52YXNcclxuXHJcblx0dGhpcy5vdGhlcl9wbGF5ZXJzID0ge307IC8vIHBsYXllcnMgY29udHJvbGxlZCBieSByZW1vdGUgY2xpZW50c1xyXG5cclxuXHR0aGlzLmhlcm87IC8vIHBsYXllciBjb250cm9sbGVkIGJ5IHRoZSBjdXJyZW50IHVzZXJcclxuXHJcblx0dGhpcy5jaG9tcGVyOyBcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gR2FtZU1vZGVsO1xyXG4iLCJ2YXIgVGVycmFpbk1vZGVsID0gbmV3IGZ1bmN0aW9uKCl7XHJcblxyXG5cdC8vIFRPRE86IGR5bmFtaWMgaW5pdGlhbGl6YXRpb25cclxuXHR0aGlzLnRlcnJhaW5fcXVldWVzID0gW1xyXG5cdFx0W10sXHJcblx0XHRbXSxcclxuXHRcdFtdXHJcblx0XTtcclxuXHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFRlcnJhaW5Nb2RlbDtcclxuIiwiYXJndW1lbnRzWzRdW1wiQzpcXFxcVXNlcnNcXFxca21oMTE4OTRcXFxcRG9jdW1lbnRzXFxcXFNpZGVTY3JvbGxlclxcXFxJbmZpbml0ZSBTaWRlc2Nyb2xsZXJcXFxcQ29udGVudFxcXFxnYW1lZGVtb1xcXFxDb250cm9sbGVyc1xcXFxXb3JsZENvbnRyb2xsZXIuanNcIl1bMF0uYXBwbHkoZXhwb3J0cyxhcmd1bWVudHMpIiwidmFyIFV0aWxpdHkgPSAoZnVuY3Rpb24oKVxyXG57XHJcblx0dmFyIGxnID0gZnVuY3Rpb24oKVxyXG5cdHtcclxuXHRcdC8qXHJcblx0XHQgKiBzaG9ydGN1dCB0byBjb25zb2xlLmxvZygpXHJcblx0XHQgKiBwcmludHMgYWxsIGFyZ3VtZW50cyB0byBjb25zb2xlXHJcblx0XHQgKiBmaXJzdCBhcmd1bWVudCBpcyB1c2VkIGFzIGEgbGFiZWwgZm9yIHRoZSByZXN0XHJcblx0XHQgKlxyXG5cdFx0ICogZWFjaCBsYWJlbGVkIGdyb3VwIGlzIGVuY2xvc2VkIGludG8gdGhlIGNvbG9yZWQgZGVsaW1pdGVyc1xyXG5cdFx0ICogPj4+IGFuZCA8PDwgc28gaXQncyBlYXNpbHkgZGlzdGluZ3Vpc2hlZC4gSSBmb3VuZCBpdCBoZWxwZnVsLFxyXG5cdFx0ICogaWYgeW91IGRvbid0IGxldCBtZSBrbm93LCBvciB1c2Ugc29tZXRoaW5nIGVsc2VcclxuXHRcdCAqL1xyXG5cdFx0Y29uc29sZS5sb2coXCIlcyAlYyAlc1wiLCBhcmd1bWVudHNbMF0sIFwiYmFja2dyb3VuZDogI0RBRjJCMVwiLCBcIj4+PlwiKTtcclxuXHRcdFxyXG5cdFx0Zm9yKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKylcclxuXHRcdHtcclxuXHRcdFx0Y29uc29sZS5sb2coXCJcXHRcIiwgYXJndW1lbnRzW2ldKTtcclxuXHRcdH1cclxuXHRcdGNvbnNvbGUubG9nKFwiJWM8PDxcIiwgXCJiYWNrZ3JvdW5kOiAjREFGMkIxXCIpO1xyXG5cclxuXHR9O1xyXG5cclxuXHR2YXIgcmFuZG9tX2Nob2ljZSA9IGZ1bmN0aW9uKHByb2JhYmlsaXRpZXMsIGNob2ljZXMpe1xyXG5cdFx0LypcclxuXHRcdCAgIHRha2VzIDIgYXJyYXlzIHdpdGggZWxlbWVudHMgYXQgY29ycmVzcG9uZGluZyBpbmRleGVzXHJcblx0XHQgICBiZWluZyBjaG9pY2UgYW5kIGl0J3MgcHJvYmFiaWxpdHkuIHBpY2tzIHJhbmRvbSBvbmUuXHJcblx0XHQgICBjaG9pY2VzIGFyZSBhbnl0aGluZywgcHJvYmFiaWxpdHkgaXMgaW50ZWdlciBhLCBzdWNoIHRoYXRcclxuXHRcdCAgIHByb2JhYmlsaXR5IG9mIGEgY2hvaWNlIGlzIGEvMTAuIHdpdGggYSA8IDEwLCBvZiBjb3Vyc2VcclxuXHRcdCAgIGFuZCBwcm9iYWJpbGl0aWVzIGFkZGluZyB1cCB0byAxMC4gXHJcblx0XHQgICBZZXMsIGl0J3Mgbm90IHZlcnkgZ29vZCBpbXBsZW1lbnRhdGlvbiAocmVhZDogdGVycmlibGUpLCBcclxuXHRcdCAgIGFuZCBzaW5jZSB5b3Ugbm90aWNlZCwgbm93IGl0J3MgeW91ciBqb2IgdG8gaW1wcm92ZSBpdC5cclxuXHJcblx0XHQqL1xyXG5cclxuXHRcdC8vIGFycmF5IHdpdGggY2hvaWNlcyBkdXBsaWNhdGVkIGEgcHJvcGVyIGFtb3VudCBvZiB0aW1lcyBiYXNlZCBvblxyXG5cdFx0Ly8gdGhlaXIgcHJvYmFiaWxpdHlcclxuXHRcdHZhciBibGFoID0gW107IFxyXG5cclxuXHRcdGZvcih2YXIgaSA9IDA7IGkgPCBjaG9pY2VzLmxlbmd0aDsgaSsrKXtcclxuXHRcdFx0Zm9yKHZhciBqID0gMDsgaiA8IHByb2JhYmlsaXRpZXNbaV07IGorKyl7XHJcblx0XHRcdFx0YmxhaC5wdXNoKGNob2ljZXNbaV0pO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0dmFyIHJhbmRfaW5kZXggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBibGFoLmxlbmd0aCk7XHJcblxyXG5cdFx0cmV0dXJuIGJsYWhbcmFuZF9pbmRleF07XHJcblx0fTtcclxuXHJcblx0XHJcblxyXG5cdHJldHVybiB7XHJcblx0XHRsZzogbGcsXHJcblx0XHRyYW5kb21fY2hvaWNlOiByYW5kb21fY2hvaWNlXHJcblx0fTtcclxuXHJcbn0pKCk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFV0aWxpdHk7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxuLypcclxuICogUnVsZXMgZm9yIHdvcmtpbmcgb24gdGhpczpcclxuICpcclxuICogMS4gSWYgeW91IHRoaW5rIHRoYXQgb25lIG9mIHRoZXNlIHJ1bGVzIGlzIHN0dXBpZCBvciB1c2VsZXNzLCB0ZWxsIG1lLCBhbG9uZyB3aXRoIHNvbWUgYmV0dGVyIHN1Z2dlc3Rpb25zLlxyXG4gKlxyXG4gKiAyLiBNb2RlbCBbbmFtZV1Nb2RlbCBjYW4gb25seSBiZSBhY2Nlc3NlZCB0aHJvdWdoIFtuYW1lXUNvbnRyb2xsZXIuIElmIHlvdSBuZWVkIHRvIGRvIHNvbWV0aGluZyB0byBcclxuICogXHRcdGNoYW5nZSBbbmFtZV1Nb2RlbCBmcm9tIFtvdGhlcl9uYW1lXUNvbnRyb2xsZXIsIHdyaXRlIGZ1bmN0aW9uIGluIHRoZSBbbmFtZV1Db250cm9sbGVyIHRoYXQgZG9lc1xyXG4gKiBcdFx0d2hhdCB5b3UgbmVlZCwgYW5kIGNhbGwgaXQgZnJvbSB0aGUgW290aGVyX25hbWVdQ29udHJvbGxlclxyXG4gKlxyXG4gKiAzLiBDb250cm9sbGVycyBhcmUgYWxsb3dlZCB0byBoYXZlIHByaXZhdGUgbWV0aG9kcy9maWVsZHMuIE1vZGVscyBhcmVuJ3QuIFxyXG4gKlxyXG4gKiA0LiBDb250cm9sbGVycyBhcmVuJ3QgYWxsb3dlZCB0byBoYXZlIHB1YmxpYyBkYXRhIGZpZWxkcy4gXHJcbiAqIFx0XHRUaG9zZSBkYXRhIGZpZWxkcyB0aGF0IGFyZSBwcmVzZW50IG11c3Qgbm90IHJlZmxlY3Qgc3RhdGUgb2YgdGhlIGdhbWUsIHRoZXkgbXVzdCBiZSByZWxhdGVkIHRvXHJcbiAqIFx0XHRzb21lIGludGVybmFsIGZ1bmN0aW9uYWxpdHkgb2YgdGhlIGNvbnRyb2xsZXJcclxuICpcclxuICogNS4gSWYgeW91IHdyaXRlIHNvbWUgZnVuY3Rpb24gdGhhdCBkb2Vzbid0IGxvZ2ljYWxseSBiZWxvbmcgdG8gb25lIG9mIHRoZSBjb250cm9sbGVycyxcclxuICogXHRcdHB1dCBpdCBpbiB0aGUgVXRpbGl0eVxyXG4gKlxyXG4gKiA2LiBWYXJpYWJsZXMgYXJlIG5hbWVkIGxpa2UgdGhhdDogdmFyaWFibGVfbmFtZVxyXG4gKiBcdFx0RXhjZXB0IChzaW5nbGV0b24pY2xhc3MgbmFtZXMsIHRoYXQgYXJlIHdyaXR0ZW4gbGlrZSB0aGF0OiBDbGFzc05hbWVcclxuICpcclxuICogNy4gQW5kIGFsbCB0aGUgb2J2aW91cyBzdHVmZiB0aGF0IGV2ZXJ5b25lIGtub3dzOlxyXG4gKiBcdFx0ZnVuY3Rpb24gbXVzdCBkbyBvbmUgdGhpbmc7IGRvbid0IG1ha2UgZnVuY3Rpb24gcHVibGljIHVubGVzcyBpdCBuZWVkcyB0byBiZSB0aGF0OyBcclxuICogXHRcdGNvbW1lbnQgYW1iaWdpb3VzIGNvZGUsIGZvciBsYXJnZXIgZnVuY3Rpb25zIGluZGljYXRlIHRoZWlyIHB1cnBvc2UgXHJcbiAqL1xyXG5cclxud2luZG93LnNpZGVzY3JvbGxlcl9nYW1lID0gKGZ1bmN0aW9uIG5hbWVzcGFjZSgpe1xyXG5cclxuXHR2YXIgQ29uZmlnID0gcmVxdWlyZShcIi4vQ29uZmlnLmpzXCIpO1xyXG5cdFx0XHJcblx0dmFyIFV0aWxpdHkgPSByZXF1aXJlKFwiLi9VdGlsaXR5LmpzXCIpO1xyXG5cclxuXHR2YXIgbGcgPSBVdGlsaXR5LmxnOyAvLyBmb3IgcXVpY2tlciBhY2Nlc3NcclxuXHR2YXIgR2FtZU1vZGVsID0gcmVxdWlyZShcIi4vTW9kZWxzL0dhbWVNb2RlbC5qc1wiKTtcclxuXHR2YXIgUGxheWVyTW9kZWw7IC8vIFRPRE86IG11c3QgYmUgcG9zc2libGUgdG8gaW5zdGFudGlhdGUgW2FuZC9vcl0gZHVwbGljYXRlXHJcblx0dmFyIFRlcnJhaW5Nb2RlbCA9IHJlcXVpcmUoXCIuL01vZGVscy9UZXJyYWluTW9kZWwuanNcIik7XHJcblx0dmFyIEJhY2tncm91bmRNb2RlbDsgLy8gU3BsaXQgaW4gdHdvIGxhdGVyPyAoVG93IGJhY2tncm91bmQgbW9vdmluZyBhdCB0aGUgZGlmZmVyZW50IHNwZWVkIG1heSBnaXZlIG1vcmUgZGVwdGgpXHJcblx0dmFyIEhVRE1vZGVsOyAvLyBIZWFkcy1VcCBEaXNwbGF5IFxyXG5cdHZhciBFbmVteU1vZGVsO1xyXG5cdHZhciBBc3NldE1vZGVsID0gcmVxdWlyZShcIi4vTW9kZWxzL0Fzc2V0TW9kZWwuanNcIik7IFxyXG5cdHZhciBDYW1lcmFNb2RlbCA9IHJlcXVpcmUoXCIuL01vZGVscy9DYW1lcmFNb2RlbC5qc1wiKTsgXHJcblx0dmFyIFdvcmxkTW9kZWwgPSByZXF1aXJlKFwiLi9Nb2RlbHMvV29ybGRNb2RlbC5qc1wiKTsgXHJcblxyXG5cdHZhciBXb3JsZENvbnRyb2xsZXIgPSByZXF1aXJlKFwiLi9Db250cm9sbGVycy9Xb3JsZENvbnRyb2xsZXIuanNcIik7IFxyXG5cdHZhciBHYW1lQ29udHJvbGxlciA9IHJlcXVpcmUoXCIuL0NvbnRyb2xsZXJzL0dhbWVDb250cm9sbGVyLmpzXCIpOyBcclxuXHR2YXIgQ2FtZXJhQ29udHJvbGxlciA9IHJlcXVpcmUoXCIuL0NvbnRyb2xsZXJzL0NhbWVyYUNvbnRyb2xsZXIuanNcIik7IFxyXG5cdHZhciBXb3JsZEdlbmVyYXRpb25Db250cm9sbGVyO1xyXG5cdHZhciBQaHlzaWNzQ29udHJvbGxlcjtcclxuXHR2YXIgUGxheWVyQ29udHJvbGxlciA9IHJlcXVpcmUoXCIuL0NvbnRyb2xsZXJzL1BsYXllckNvbnRyb2xsZXIuanNcIik7IFxyXG5cdHZhciBFbmVteUNvbnRyb2xsZXIgPSByZXF1aXJlKFwiLi9Db250cm9sbGVycy9FbmVteUNvbnRyb2xsZXIuanNcIik7XHJcblx0dmFyIFRlcnJhaW5Db250cm9sbGVyID0gcmVxdWlyZShcIi4vQ29udHJvbGxlcnMvVGVycmFpbkNvbnRyb2xsZXIuanNcIik7IFxyXG5cdHZhciBBc3NldENvbnRyb2xsZXIgPSByZXF1aXJlKFwiLi9Db250cm9sbGVycy9Bc3NldENvbnRyb2xsZXIuanNcIik7IFxyXG5cdHZhciBLZXlib2FyZENvbnRyb2xsZXIgPSByZXF1aXJlKFwiLi9Db250cm9sbGVycy9LZXlib2FyZENvbnRyb2xsZXIuanNcIik7IFxyXG5cdHZhciBJbml0Q29udHJvbGxlciA9IHJlcXVpcmUoXCIuL0NvbnRyb2xsZXJzL0luaXRDb250cm9sbGVyLmpzXCIpOyBcclxuXHR2YXIgVGVzdENvbnRyb2xsZXIgPSByZXF1aXJlKFwiLi9Db250cm9sbGVycy9UZXN0Q29udHJvbGxlci5qc1wiKTsgXHJcblx0XHJcblxyXG5cdC8vIEdhbWUgaW5pdGlhdGlvbiBzZWN0aW9uOiA+Pj5cclxuXHRcclxuXHRcdFxyXG5cdHZhciBsb2FkX2dhbWUgPSBmdW5jdGlvbihtb2RlKVxyXG5cdHtcclxuXHJcblx0XHRJbml0Q29udHJvbGxlci5pbml0KG1vZGUpOyAvLyBpbml0IGFsbCB0aGUgc3R1ZmZcclxuXHJcblx0XHRpZihtb2RlID09IFwidGVzdFwiKXtcclxuXHRcdFx0VGVzdENvbnRyb2xsZXIudGVzdCgpO1xyXG5cdFx0fVxyXG5cdH07XHJcblxyXG5cclxuXHR2YXIgcnVuID0gZnVuY3Rpb24obW9kZSlcclxuXHR7XHJcblx0XHQvLyBkb25lIHRoaXMgd2F5IHRvIGVuc3VyZSB0aGF0IGxvYWRfZ2FtZSdzIGludGVybmFscyBhcmVuJ3QgYWNjZXNzaWJsZSB0byB0aGUgd29ybGQ6XHJcblx0XHRsb2FkX2dhbWUobW9kZSk7XHJcblx0fTsgXHJcblx0XHJcblx0cmV0dXJuIHtcclxuXHRcdHJ1bjogcnVuXHJcblx0fTsgLy8gZXhwb3NlIGZ1bmN0aW9uIHJ1biB0byB0aGUgd29ybGRcclxuXHJcbn0pKCk7IFxyXG4iXX0=
