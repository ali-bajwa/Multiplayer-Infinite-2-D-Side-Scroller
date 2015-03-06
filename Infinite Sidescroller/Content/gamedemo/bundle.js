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

	this.score;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL0FwcERhdGEvUm9hbWluZy9ucG0vbm9kZV9tb2R1bGVzL3dhdGNoaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJDb25maWcuanMiLCJDb250cm9sbGVycy9Bc3NldENvbnRyb2xsZXIuanMiLCJDb250cm9sbGVycy9DYW1lcmFDb250cm9sbGVyLmpzIiwiQ29udHJvbGxlcnMvRW5lbXlDb250cm9sbGVyLmpzIiwiQ29udHJvbGxlcnMvR2FtZUNvbnRyb2xsZXIuanMiLCJDb250cm9sbGVycy9Jbml0Q29udHJvbGxlci5qcyIsIkNvbnRyb2xsZXJzL0tleWJvYXJkQ29udHJvbGxlci5qcyIsIkNvbnRyb2xsZXJzL1BsYXllckNvbnRyb2xsZXIuanMiLCJDb250cm9sbGVycy9UZXJyYWluQ29udHJvbGxlci5qcyIsIkNvbnRyb2xsZXJzL1Rlc3RDb250cm9sbGVyLmpzIiwiQ29udHJvbGxlcnMvV29ybGRDb250cm9sbGVyLmpzIiwiTW9kZWxzL0Fzc2V0TW9kZWwuanMiLCJNb2RlbHMvQ2FtZXJhTW9kZWwuanMiLCJNb2RlbHMvR2FtZU1vZGVsLmpzIiwiTW9kZWxzL1RlcnJhaW5Nb2RlbC5qcyIsIk1vZGVscy9Xb3JsZE1vZGVsLmpzIiwiVXRpbGl0eS5qcyIsIm1haW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciBDb25maWcgPSB7XHJcblx0U0NSRUVOX1c6IDAsIC8vIHNldCB1cCB3aGVuIHRoZSBwYWdlIGlzIGxvYWRlZCAodG8gOTUlIG9mIHdpZHRoIG9mIGNvbnRhaW5pbmcgZWxlbWVudCkgXHJcblx0U0NSRUVOX0g6IDYwMCxcclxuXHJcblxyXG5cdC8vIEZyYW1lcyBQZXIgU2Vjb25kLiBFc3NlbnRpYWxseSwgZnJlcXVlbmN5IG9mIGNyZWF0ZWpzLlRpY2tlciBcclxuXHQvLyBXYXJuaW5nISBGcmVxdWVuY3kgb2YgdGhlIEJveDJEIHBoeXNpY3MgdXBkYXRlcyBtYXkgYmUgZGlmZmVyZW50XHJcblx0Ly8gKEN1cnJlbnRseSBub3QgaW1wbGVtZW50ZWQpXHJcblx0RlBTOiAzMCwgXHJcblxyXG5cdEIyRF9TQ0FMRTogMzBcclxuXHQvLyBFTkQgQ29uc3RhbnRzIHNlY3Rpb24gPDw8XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IENvbmZpZztcclxuIiwidmFyIEFzc2V0TW9kZWwgPSByZXF1aXJlKFwiLi4vTW9kZWxzL0Fzc2V0TW9kZWwuanNcIik7XHJcblxyXG52YXIgQXNzZXRDb250cm9sbGVyID0gKGZ1bmN0aW9uKCl7XHJcblx0LypcclxuXHQgICBBc3NldENvbnRyb2xsZXIgaXMgaW4gY2hhcmdlIG9mIHNldHRpbmcgdXAgYWxsIGJpdG1hcHMvYW5pbWF0aW9ucy9vdGhlciByZXNvdXJjZXNcclxuXHQgICBmb3IgZXZlcnlvbmUgZWxzZS5cclxuICAgKi9cclxuXHJcblx0Ly8gdXNlIEFzc2V0TW9kZWwubG9hZGVyLmdldFJlc3VsdChcImlkX29mX3RoZV9hc3NldFwiKTtcclxuXHJcblxyXG5cdHZhciBsb2FkX2FsbCA9IGZ1bmN0aW9uKGFzc2V0X3BhdGgpe1xyXG5cclxuXHRcdC8qIFRPRE8gbWFrZSBtb2RlbCB3aXRoIHRoZSBlYXNpbHkgbWFuYWdlZCB0YWJsZXMgb2YgcmVzb3VyY2VzIHdoaWNoIHdpbGwgYmVcclxuXHRcdCAgIGFkZGVkIHRvIHRoZSBsb2FkZXIgYXV0b21hdGljYWxseVxyXG5cdFx0Ki9cclxuXHJcblx0XHR2YXIgbWFuaWZlc3QgPSBBc3NldE1vZGVsLm1hbmlmZXN0O1x0XHJcblxyXG5cclxuXHRcdC8vbG9hZGVyID0gbmV3IGNyZWF0ZWpzLkxvYWRRdWV1ZShmYWxzZSk7IC8vIGxvYWRpbmcgcmVzb3Vyc2VzIHVzaW5nIHByZWxvYWQuanNcclxuXHRcdC8vbG9hZGVyLmFkZEV2ZW50TGlzdGVuZXIoXCJjb21wbGV0ZVwiLCBoYW5kbGVDb21wbGV0ZSk7XHJcblx0XHRBc3NldE1vZGVsLmxvYWRlci5sb2FkTWFuaWZlc3QobWFuaWZlc3QsIHRydWUsIGFzc2V0X3BhdGgpO1xyXG5cdH1cclxuXHJcblx0dmFyIHJlcXVlc3RfYml0bWFwID0gZnVuY3Rpb24oaWQpe1xyXG5cdFx0Ly8gaWYgaWQgaXMgaW52YWxpZCwgdGhyb3cgbWVhbmluZ2Z1bCBleGNlcHRpb24/XHJcblx0XHRyZXR1cm4gbmV3IGNyZWF0ZWpzLkJpdG1hcChBc3NldE1vZGVsLmxvYWRlci5nZXRSZXN1bHQoaWQpKTtcclxuXHRcdC8vIFRPRE8gcmVzZWFyY2ggRGlzcGxheU9iamVjdCdzIGNhY2hpbmcuIGFuZCBtYXliZSBpbmNvcnBvcmF0ZVxyXG5cdH07XHJcblxyXG5cdFxyXG5cdHJldHVybiB7XHJcblx0XHRsb2FkX2FsbDogbG9hZF9hbGwsXHJcblx0XHRyZXF1ZXN0X2JpdG1hcDogcmVxdWVzdF9iaXRtYXBcclxuXHR9O1xyXG5cclxufSkoKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQXNzZXRDb250cm9sbGVyO1xyXG4iLCJ2YXIgQ2FtZXJhTW9kZWwgPSByZXF1aXJlKFwiLi4vTW9kZWxzL0NhbWVyYU1vZGVsLmpzXCIpO1xyXG5cclxudmFyIFBsYXllckNvbnRyb2xsZXIsIFRlcnJhaW5Db250cm9sbGVyO1xyXG5cclxuUGxheWVyQ29udHJvbGxlciA9IHJlcXVpcmUoXCIuL1BsYXllckNvbnRyb2xsZXIuanNcIik7XHJcbkVuZW15Q29udHJvbGxlciA9IHJlcXVpcmUoXCIuL0VuZW15Q29udHJvbGxlci5qc1wiKTtcclxuVGVycmFpbkNvbnRyb2xsZXIgPSByZXF1aXJlKFwiLi9UZXJyYWluQ29udHJvbGxlci5qc1wiKTtcclxuXHJcbnZhciBDYW1lcmFDb250cm9sbGVyID0gKGZ1bmN0aW9uKCl7XHJcblxyXG5cdHZhciB1cGRhdGUgPSBmdW5jdGlvbigpe1xyXG5cdFx0dmFyIGZvbGxvd2luZyA9IENhbWVyYU1vZGVsLmZvbGxvd2luZztcclxuXHRcdGlmKGZvbGxvd2luZyl7XHJcblx0XHRcdGNlbnRlcl9hdChmb2xsb3dpbmcueCwgIGZvbGxvd2luZy55KTtcclxuXHRcdH1cclxuXHJcblx0fTtcclxuXHJcblx0dmFyIGNlbnRlcl9hdCA9IGZ1bmN0aW9uKHgsIHkpe1xyXG5cdFx0LyogTk9UIElNUExFTUVOVEVEXHJcblx0XHQgKiBpbnN0YW50bHkgY2VudGVyIGNhbWVyYSBhdCB0aGUgZ2l2ZW4gY29vcmRpbmF0ZXNcclxuXHRcdCAqIEFsZzogY2FsY3VsYXRlIHggb2Zmc2V0LCBjYWxjdWxhdGUgeSBvZnNzZXQsIGNhbGwgPm1vdmU8XHJcblx0XHQgKi9cclxuXHRcdHZhciBzY3JfY2VudGVyID0gZ2V0X3NjcmVlbl9jZW50ZXIoKTsgLy8gY3VycmVudCBjYW1lcmEgcG9zaXRpb25cclxuXHJcblx0XHR2YXIgb2Zmc2V0X3ggPSB4IC0gc2NyX2NlbnRlci54O1xyXG5cdFx0dmFyIG9mZnNldF95ID0geSAtIHNjcl9jZW50ZXIueTtcclxuXHJcblx0XHRsZyhcIngsIHlcIiwgb2Zmc2V0X3gsIG9mZnNldF95KTtcclxuXHJcblx0XHRtb3ZlKG9mZnNldF94LCBvZmZzZXRfeSk7XHJcblx0fTtcclxuXHJcblx0dmFyIGdldF9zY3JlZW5fY2VudGVyID0gZnVuY3Rpb24oKXtcclxuXHRcdC8vIGlzIGEgZnVuY3Rpb24gdG8gaGFuZGxlIHNjcmVlbiByZXNpemUgZnVuY3Rpb25hbGl0eSwgd2hlbiBpbXBsZW1lbnRlZFxyXG5cdFx0cmV0dXJuIHtcclxuXHRcdFx0eDogU0NSRUVOX1cgLyAyLFxyXG5cdFx0XHR5OiBTQ1JFRU5fSCAvIDJcclxuXHRcdH07XHJcblxyXG5cdH07XHJcblxyXG5cdHZhciBmb2xsb3cgPSBmdW5jdGlvbihlYXNlbGpzX29iail7XHJcblx0XHQvKlxyXG5cdFx0ICogZm9sbG93IHNwZWNpZmljIGVhc2VsanMgb2JqZWN0IGV2ZXJ5d2hlcmVcclxuXHRcdCAqL1xyXG5cclxuXHRcdENhbWVyYU1vZGVsLmZvbGxvd2luZyA9IGVhc2VsanNfb2JqO1xyXG5cdH07XHJcblxyXG5cdHZhciB1bmZvbGxvdyA9IGZ1bmN0aW9uKCl7XHJcblx0XHRDYW1lcmFNb2RlbC5mb2xsb3dpbmcgPSBudWxsO1xyXG5cdH07XHJcblxyXG5cdHZhciBtb3ZlID0gZnVuY3Rpb24ob2Zmc2V0X3gsIG9mZnNldF95KXtcclxuXHRcdC8qXHJcblx0XHQgKiBtb3ZpbmcgY2FtZXJhIGluIHNvbWUgZGlyZWN0aW9uIGVzc2VudGlhbGx5IG1lYW5zXHJcblx0XHQgKiBtb3Zpbmcgd29ybGQgKHRlcnJhaW4sIGJhY2tncm91bmQsIHBsYXllcnMsIGVuZW1pZXMsIGV0Yy4pXHJcblx0XHQgKiBpbiBvcHBvc2l0ZSBkaXJlY3Rpb24sIGFuZCBzY3JlZW4gZWxlbWVudHMgKEhVRCwgbWluaW1hcCkgaW4gdGhlIHNtYWVcclxuXHRcdCAqIGRpcmVjdGlvblxyXG5cdFx0ICogTGF0ZXIgaXQgbWF5IG5lZWQgc2lnbmlmaWNhbnRseSBtb3JlIGZ1bmN0aW9uYWxpdHkgXHJcblx0XHQgKi9cclxuXHJcblx0XHR2YXIgbl94ID0gKC0xKSAqIG9mZnNldF94O1xyXG5cdFx0dmFyIG5feSA9ICgtMSkgKiBvZmZzZXRfeTtcclxuXHJcblx0XHRUZXJyYWluQ29udHJvbGxlci5tb3ZlKG5feCwgbl95KTtcclxuXHRcdEVuZW15Q29udHJvbGxlci5tb3ZlKG5feCwgbl95KTtcclxuXHRcdFBsYXllckNvbnRyb2xsZXIubW92ZShuX3gsIG5feSk7XHJcblxyXG5cdFx0Ly8gb3RoZXIgcmVsYXRlZCB0aGluZ3MubW92ZSguLi4sIC4uLilcclxuXHR9O1xyXG5cclxuXHR2YXIgc2xpZGUgPSBmdW5jdGlvbih4LCB5LCBzcGVlZCl7XHJcblx0XHQvKiBOT1QgSU1QTEVNRU5URURcclxuXHRcdCAqIGFzc2lnbiB0aGUgY2FtZXJhIGEgY29vcmRpbmF0ZXMgdG8gc2xpZGUgdG8gd2l0aCA+c3BlZWQ8IHBpeGVscy90aWNrXHJcblx0XHQgKiBpZiB3ZSBkbyBzY3JpcHRlZCBzY2VuZXMsIHRoYXQgY291bGQgYmUgdXNlZnVsXHJcblx0XHQgKi9cclxuXHR9O1xyXG5cclxuXHRyZXR1cm4ge1xyXG5cdFx0bW92ZTogbW92ZSxcclxuXHRcdGZvbGxvdzogZm9sbG93LFxyXG5cdFx0dW5mb2xsb3c6IHVuZm9sbG93LFxyXG5cdFx0dXBkYXRlOiB1cGRhdGVcclxuXHJcblx0fTtcclxufSkoKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQ2FtZXJhQ29udHJvbGxlcjtcclxuIiwidmFyIEdhbWVNb2RlbDtcclxuR2FtZU1vZGVsID0gcmVxdWlyZShcIi4uL01vZGVscy9HYW1lTW9kZWwuanNcIik7XHJcblxyXG52YXIgRW5lbXlDb250cm9sbGVyID0gKGZ1bmN0aW9uKCl7XHJcblx0dmFyIG1vdmUgPSBmdW5jdGlvbihvZmZzZXRfeCwgb2Zmc2V0X3kpe1xyXG5cdFx0R2FtZU1vZGVsLmNob21wZXIueCArPSBvZmZzZXRfeDtcclxuXHRcdEdhbWVNb2RlbC5jaG9tcGVyLnkgKz0gb2Zmc2V0X3k7XHJcblx0fTtcclxuXHJcblx0cmV0dXJuIHtcclxuXHRcdG1vdmU6IG1vdmVcclxuXHR9O1xyXG59KSgpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBFbmVteUNvbnRyb2xsZXI7XHJcbiIsInZhciBDYW1lcmFDb250cm9sbGVyLCBQbGF5ZXJDb250cm9sbGVyLCBLZXlib2FyZENvbnRyb2xsZXI7XHJcbnZhciBHYW1lTW9kZWw7XHJcblxyXG5DYW1lcmFDb250cm9sbGVyID0gcmVxdWlyZShcIi4vQ2FtZXJhQ29udHJvbGxlci5qc1wiKTtcclxuUGxheWVyQ29udHJvbGxlciA9IHJlcXVpcmUoXCIuL1BsYXllckNvbnRyb2xsZXIuanNcIik7XHJcbktleWJvYXJkQ29udHJvbGxlciA9IHJlcXVpcmUoXCIuL0tleWJvYXJkQ29udHJvbGxlci5qc1wiKTtcclxuRW5lbXlDb250cm9sbGVyID0gcmVxdWlyZShcIi4vRW5lbXlDb250cm9sbGVyLmpzXCIpO1xyXG5cclxuR2FtZU1vZGVsID0gcmVxdWlyZShcIi4uL01vZGVscy9HYW1lTW9kZWwuanNcIik7XHJcblxyXG52YXIgR2FtZUNvbnRyb2xsZXIgPSAoZnVuY3Rpb24oKXtcclxuXHJcblx0dmFyIE1PVkVNRU5UX0VER0UgPSA1MDA7IC8vIHdoZXJlIHRlcnJhaW4gc3RhcnQgc2Nyb2xsaW5nXHJcblxyXG5cdHZhciB2ZXJ0aWNhbF92ZWxvY2l0eSA9IDA7XHJcblx0dmFyIGRlbHRhX3MgPSAwO1xyXG5cdHZhciBtb3ZlbWVudF9tb2RpZmllciA9IDE7XHJcblx0dmFyIHNjb3JlID0gMDtcclxuXHR2YXIgbG9vcCA9IDA7XHJcblx0dmFyIG1hcmtlciA9IHRydWU7XHJcblxyXG5cdHZhciB1cGRhdGVfYWxsID0gZnVuY3Rpb24oZXZlbnQpe1xyXG5cdFx0LypcclxuXHRcdCAqIG1haW4gZnVuY3Rpb24gcHJldHR5IG11Y2hcclxuXHRcdCAqIGV2ZXJ5Z2hpbmcgZWxzZSBpcyBjYWxsZWQgZnJvbSBoZXJlIGV2ZXJ5IHRpY2tcclxuXHRcdCAqL1xyXG5cdFx0XHJcblx0XHR2YXIgZGVsdGEgPSBldmVudC5kZWx0YTtcclxuXHJcblx0XHR2YXIgY21kcyA9IEtleWJvYXJkQ29udHJvbGxlci5tb3ZlbWVudF9jb21tYW5kcygpO1xyXG5cclxuXHRcdC8vIFNlcGFyYXRlIGZ1bmN0aW9uID4+PlxyXG5cdFx0aWYoY21kcy5pbmRleE9mKFwicmlnaHRcIikgPiAtMSl7XHJcblx0XHQgICAgLy8gdGVtcG9yYXJ5XHJcblx0XHQgICAgc2NvcmUgKz0gMTtcclxuXHJcblx0XHRcdGlmKEdhbWVNb2RlbC5oZXJvLnggPiBNT1ZFTUVOVF9FREdFKXtcclxuXHRcdFx0XHRQbGF5ZXJDb250cm9sbGVyLm1vdmVfcmlnaHQoR2FtZU1vZGVsLmhlcm8pO1xyXG5cdFx0XHRcdENhbWVyYUNvbnRyb2xsZXIubW92ZSgxMCwgMCk7XHJcblx0XHRcdFx0Ly9UZXJyYWluQ29udHJvbGxlci5tb3ZlX2xlZnQoMTApO1xyXG5cdFx0XHRcdC8vQ2FtZXJhQ29udHJvbGxlci5mb2xsb3coR2FtZU1vZGVsLmhlcm8pO1xyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHQvL0NhbWVyYUNvbnRyb2xsZXIudW5mb2xsb3coKTtcclxuXHRcdFx0XHRQbGF5ZXJDb250cm9sbGVyLm1vdmVfcmlnaHQoR2FtZU1vZGVsLmhlcm8pO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0dmFyIGJhc2Vfc3BlZWQgPSBldmVudC5kZWx0YSAvIDEwMDAgKiA1MCAqIG1vdmVtZW50X21vZGlmaWVyO1xyXG5cclxuXHRcdGlmIChjbWRzLmluZGV4T2YoXCJ1cFwiKSA+IC0xKSB7XHJcblx0XHQgICAgaWYgKEdhbWVNb2RlbC5oZXJvLnkgPT0gNTE2KSB7XHJcblx0XHQgICAgICAgIHZlcnRpY2FsX3ZlbG9jaXR5ID0gMzAwO1xyXG5cdFx0ICAgICAgICBtb3ZlbWVudF9tb2RpZmllciA9IDAuMztcclxuXHRcdCAgICB9XHJcblx0XHR9XHJcblxyXG5cdFx0aWYoY21kcy5pbmRleE9mKFwibGVmdFwiKSA+IC0xKXtcclxuXHRcdCAgICBpZiAoR2FtZU1vZGVsLmhlcm8ueCA+IDEwKSB7XHJcblx0XHQgICAgICAgIGlmIChzY29yZSAhPSAwKSB7XHJcblx0XHQgICAgICAgICAgICBzY29yZSAtPSAxO1xyXG5cdFx0ICAgICAgICB9XHJcblx0XHRcdFx0UGxheWVyQ29udHJvbGxlci5tb3ZlX2xlZnQoR2FtZU1vZGVsLmhlcm8pO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0dmVydGljYWxfdmVsb2NpdHkgLT0gZXZlbnQuZGVsdGEgLyAxMDAwICogNzAwO1xyXG5cclxuXHRcdGRlbHRhX3MgPSB2ZXJ0aWNhbF92ZWxvY2l0eSAqIGV2ZW50LmRlbHRhIC8gMTAwMDtcclxuXHJcblx0XHRpZiAoKEdhbWVNb2RlbC5oZXJvLnkgLSBkZWx0YV9zKSA8PSA1MTYpIHtcclxuXHRcdCAgICBHYW1lTW9kZWwuaGVyby55IC09IGRlbHRhX3M7XHJcblx0XHR9XHJcblx0XHRlbHNlIHtcclxuXHRcdCAgICBHYW1lTW9kZWwuaGVyby55ID0gNTE2O1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmIChHYW1lTW9kZWwuaGVyby55ID09IDUxNikge1xyXG5cdFx0ICAgIG1vdmVtZW50X21vZGlmaWVyID0gMTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAobG9vcCA9PSA0KSB7XHJcblx0XHQgICAgbWFya2VyID0gIShtYXJrZXIpO1xyXG5cdFx0ICAgIGxvb3AgPSAwO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSB7XHJcblx0XHQgICAgbG9vcCArPSAxO1xyXG5cdFx0fVxyXG5cdFx0RW5lbXlDb250cm9sbGVyLm1vdmUoLTEsIDApO1xyXG5cdFx0R2FtZU1vZGVsLmNob21wZXIuZ290b0FuZFN0b3AobWFya2VyID8gMSA6IDApO1xyXG5cclxuXHRcdEdhbWVNb2RlbC5zY29yZS50ZXh0ID0gc2NvcmUudG9TdHJpbmcoKTtcclxuXHJcblx0XHQvLyA8PDxcclxuXHJcblx0XHQvL1RlcnJhaW5Db250cm9sbGVyLmdlbmVyYXRlX3RlcnJhaW4oKTsgXHJcblx0XHRcclxuXHRcdC8vIFNob3VsZCBiZSBjYWxsZWQgYWZ0ZXIgYWxsIG1vdmVtZW50IG9mIG9iamVjdHMgaXMgZG9uZTpcclxuXHRcdENhbWVyYUNvbnRyb2xsZXIudXBkYXRlKCk7IFxyXG5cclxuXHRcdEdhbWVNb2RlbC5zdGFnZS51cGRhdGUoKTtcclxuXHR9O1xyXG5cclxuXHJcblxyXG5cdFxyXG5cclxuXHRyZXR1cm4ge1xyXG5cdFx0dXBkYXRlX2FsbDogdXBkYXRlX2FsbCxcclxuXHR9O1xyXG5cclxufSkoKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gR2FtZUNvbnRyb2xsZXI7XHJcbiIsInZhciBLZXlib2FyZENvbnRyb2xsZXIsIEdhbWVDb250cm9sbGVyLCBBc3NldENvbnRyb2xsZXIsIFRlcnJhaW5Db250cm9sbGVyO1xyXG52YXIgR2FtZU1vZGVsLCBBc3NldE1vZGVsO1xyXG52YXIgQ29uZmlnLCBVdGlsaXR5O1xyXG5cclxuS2V5Ym9hcmRDb250cm9sbGVyID0gcmVxdWlyZShcIi4vS2V5Ym9hcmRDb250cm9sbGVyLmpzXCIpO1xyXG5HYW1lQ29udHJvbGxlciA9IHJlcXVpcmUoXCIuL0dhbWVDb250cm9sbGVyLmpzXCIpO1xyXG5Bc3NldENvbnRyb2xsZXIgPSByZXF1aXJlKFwiLi9Bc3NldENvbnRyb2xsZXIuanNcIik7XHJcblRlcnJhaW5Db250cm9sbGVyID0gcmVxdWlyZShcIi4vVGVycmFpbkNvbnRyb2xsZXIuanNcIik7XHJcblxyXG5HYW1lTW9kZWwgPSByZXF1aXJlKFwiLi4vTW9kZWxzL0dhbWVNb2RlbC5qc1wiKTtcclxuQXNzZXRNb2RlbCA9IHJlcXVpcmUoXCIuLi9Nb2RlbHMvQXNzZXRNb2RlbC5qc1wiKTtcclxuXHJcbkNvbmZpZyA9IHJlcXVpcmUoXCIuLi9Db25maWcuanNcIik7XHJcblV0aWxpdHkgPSByZXF1aXJlKFwiLi4vVXRpbGl0eS5qc1wiKTtcclxuXHJcbnZhciBJbml0Q29udHJvbGxlciA9IChmdW5jdGlvbigpe1xyXG5cclxuXHR2YXIgaW5pdCA9IGZ1bmN0aW9uKG1vZGUpe1xyXG5cclxuXHRcdHNldHVwX3NjcmVlbigpO1xyXG5cdFx0c2V0dXBfZXZlbnRzKCk7XHJcblxyXG5cclxuXHRcdC8vIE5vdGljZSB0aGF0IGFzc2V0IGRlcGVuZGVudCBzdHVmZiBkb2Vzbid0IChhbmQgbXVzdG4ndCkgc3RhcnQgdW50aWxcclxuXHRcdC8vIGFsbCBhc3NldHMgYXJlIGNvbXBsZXRlbHkgbG9hZGVkLiBUaGF0IGluY2x1ZGVzIHRpY2tlciwgaS5lLiBubyB0aWNrcyBhcmUgcHJvY2Vzc2VkXHJcblx0XHQvLyB1bnRpbCBldmVyeXRoaW5nIGlzIGxvYWRlZC4gSWYgeW91IHdhbnQgc29tZXRoaW5nIGRpZmZlcmVudCwgZS5nLiBkaXNwbGF5IHNvbWUgc29ydCBvZiBsb2FkaW5nXHJcblx0XHQvLyBhbmltYXRpb24gLSBsZXQgbWUga25vdy5cclxuXHRcdC8vIExvb2sgaW50byB0aGUgc2V0dXBfYXNzZXRfZGVwZW5kZW50IGZ1bmN0aW9uXHJcblx0XHRcdEFzc2V0TW9kZWwubG9hZGVyID0gbmV3IGNyZWF0ZWpzLkxvYWRRdWV1ZShmYWxzZSk7IC8vIGxvYWRpbmcgcmVzb3Vyc2VzIHVzaW5nIHByZWxvYWQuanNcclxuXHRcdFx0QXNzZXRNb2RlbC5sb2FkZXIuYWRkRXZlbnRMaXN0ZW5lcihcImNvbXBsZXRlXCIsIHNldHVwX2Fzc2V0X2RlcGVuZGFudCk7XHJcblxyXG5cdFx0XHQvLyBpZiBtb3JlIHN0dWZmIG5lZWRzIHRvIGJlIGRvbmUgZm9yIHRoZSB0ZXN0IG1vZGUsIFxyXG5cdFx0XHQvLyBvciBtb3JlIHR5cGVzIG9mIGl0IG5lZWRzIHRvIGJlIGFkZGVkXHJcblx0XHRcdC8vIHlvdSBjYW4gc2FmZWx5IG1ha2UgdGhlIGZvbGxvd2luZyBhIHNlcGFyYXRlIGZ1bmN0aW9uXHJcblx0XHRcdHZhciBhc3NldF9wYXRoID0gKG1vZGUgPT0gXCJ0ZXN0XCIpID8gXCIuL2Fzc2V0cy9hcnQvXCIgOiBcIi4uL0NvbnRlbnQvZ2FtZWRlbW8vYXNzZXRzL2FydC9cIjtcclxuXHJcblx0XHRcdEFzc2V0Q29udHJvbGxlci5sb2FkX2FsbChhc3NldF9wYXRoKTtcclxuXHJcblx0XHQvLyA8PDxcclxuXHJcblx0fTtcclxuXHJcblx0XHJcblx0dmFyIHNldHVwX3NjcmVlbiA9IGZ1bmN0aW9uKCl7XHJcblxyXG5cdFx0Ly8gU2V0dGluZyB1cCBvdGhlciBzdHVmZjpcclxuXHRcdC8vIGUuZyBzZXR1cCBjYW52YXMgc2l6ZVxyXG5cdFx0XHJcblx0XHQvLyBUT0RPOiBhbGxvdyByZXNpemVzP1xyXG5cclxuXHRcdENvbmZpZy5TQ1JFRU5fVyA9ICQoJyNjYW52YXNfY29udGFpbmVyJykud2lkdGgoKTsgLy8gaXMgZHluYW1pY2FsbHkgc2V0IHRvIHBpeGVsIHdpZHRoIG9mIHRoZSBjb250YWluaW5nIGVsZW1lbnRcclxuXHJcblx0XHQvLyBwb3NzaWJsZSByZXNpemluZyB0ZWNobmlxdWU6IFxyXG5cdFx0Ly8gaHR0cDovL3d3dy5mYWJpb2Jpb25kaS5jb20vYmxvZy8yMDEyLzA4L2NyZWF0ZWpzLWFuZC1odG1sNS1jYW52YXMtcmVzaXplLWZ1bGxzY3JlZW4tYW5kLWxpcXVpZC1sYXlvdXRzL1xyXG5cclxuXHRcdFxyXG5cdFx0Ly8kKCcjZGVidWdfY2FudmFzJykud2lkdGgoU3RyaW5nKFNDUkVFTl9XKSArIFwicHhcIik7XHJcblx0XHQvLyQoJyNkaXNwbGF5X2NhbnZhcycpLndpZHRoKFN0cmluZyhTQ1JFRU5fVykgKyBcInB4XCIpO1xyXG5cclxuXHRcdC8vJCgnI2RlYnVnX2NhbnZhcycpLmhlaWdodChTdHJpbmcoU0NSRUVOX0gpICsgXCJweFwiKTtcclxuXHRcdC8vJCgnI2Rpc3BsYXlfY2FudmFzJykuaGVpZ2h0KFN0cmluZyhTQ1JFRU5fSCkgKyBcInB4XCIpO1xyXG5cdFx0XHJcblx0fTtcclxuXHJcblx0dmFyIHNldHVwX3RpY2tlciA9IGZ1bmN0aW9uKCl7XHJcblxyXG5cdFx0Y3JlYXRlanMuVGlja2VyLnNldEZQUyhDb25maWcuRlBTKTtcclxuXHJcblx0XHQvLyB0aWNrZXI6IG9uIGVhY2ggdGljayBjYWxsIEdhbWVDb250cm9sbGVyLnVwZGF0ZV9hbGwoKTtcclxuXHRcdGNyZWF0ZWpzLlRpY2tlci5hZGRFdmVudExpc3RlbmVyKFwidGlja1wiLCBHYW1lQ29udHJvbGxlci51cGRhdGVfYWxsKTtcclxuXHJcblx0XHJcblx0fTtcclxuXHJcblx0dmFyIHNldHVwX2V2ZW50cyA9IGZ1bmN0aW9uKCl7XHJcblxyXG5cclxuXHRcdC8vIGtleWJvYXJkIGlucHV0IGV2ZW50OiBvbiBlYWNoIGtleWJvYXJkIGV2ZW50IGNhbGwgYXBwcm9wcmlhdGUgS2V5Ym9hcmRDb250cm9sbGVyIGZ1bmN0aW9uXHJcblx0XHRkb2N1bWVudC5vbmtleWRvd24gPSBLZXlib2FyZENvbnRyb2xsZXIua2V5ZG93bjtcclxuXHRcdGRvY3VtZW50Lm9ua2V5dXAgPSBLZXlib2FyZENvbnRyb2xsZXIua2V5dXA7XHJcblxyXG5cdFx0XHQvLyBvbiBpbnRlcnJ1cHQgZXZlbnQ6IHN0b3AvcGF1c2UgdGlja2VyID9cclxuXHJcblx0fTtcclxuXHJcblx0dmFyIHNldHVwX2Fzc2V0X2RlcGVuZGFudCA9IGZ1bmN0aW9uKCl7XHJcblx0XHQvLyB0aGlzIG1heSBuZWVkIHRvIG1vdmUgdG8gZWl0aGVyIGxvYWRfZ2FtZSBvciBzb21lIHNvcnQgb2YgcmVzaXppbmcgZnVuY3Rpb25cclxuXHRcdEdhbWVNb2RlbC5zdGFnZSA9IG5ldyBjcmVhdGVqcy5TdGFnZShcImRpc3BsYXlfY2FudmFzXCIpO1xyXG5cdFx0R2FtZU1vZGVsLnN0YWdlLmNhbnZhcy53aWR0aCA9IENvbmZpZy5TQ1JFRU5fVztcclxuXHRcdEdhbWVNb2RlbC5zdGFnZS5jYW52YXMuaGVpZ2h0ID0gQ29uZmlnLlNDUkVFTl9IO1xyXG5cclxuXHRcdGhlcm9fc2hlZXQgPSBuZXcgY3JlYXRlanMuU3ByaXRlU2hlZXQoe1xyXG5cdFx0ICAgIFwiZnJhbWVyYXRlXCI6IDIsXHJcblx0XHQgICAgXCJpbWFnZXNcIjogW1wiLi4vQ29udGVudC9nYW1lZGVtby9hc3NldHMvYXJ0L3dhcnJpb3IucG5nXCJdLFxyXG5cdFx0ICAgIFwiZnJhbWVzXCI6IHsgXCJyZWdYXCI6IDAsIFwicmVnWVwiOiA2MCwgXCJoZWlnaHRcIjogNjAsIFwid2lkdGhcIjogMzYsIFwiY291bnRcIjogMyB9LFxyXG5cdFx0ICAgIFwiYW5pbWF0aW9uc1wiOiB7XHJcblx0XHQgICAgICAgIFwicnVuXCI6IHtcclxuXHRcdCAgICAgICAgICAgIFwiZnJhbWVzXCI6IFswLCAxLCAyXSxcclxuXHRcdCAgICAgICAgICAgIFwibmV4dFwiOiBcInJ1blwiLFxyXG5cdFx0ICAgICAgICAgICAgXCJzcGVlZFwiOiAwLjVcclxuXHRcdCAgICAgICAgfVxyXG5cdFx0ICAgIH1cclxuXHJcblx0XHR9KTtcclxuXHJcblx0XHRHYW1lTW9kZWwuaGVybyA9IG5ldyBjcmVhdGVqcy5TcHJpdGUoaGVyb19zaGVldCwgXCJydW5cIik7XHJcblxyXG5cdFx0R2FtZU1vZGVsLmhlcm8ueCA9IDEwMDsgLy8gc2V0IHBvc2l0aW9uXHJcblx0XHRHYW1lTW9kZWwuaGVyby55ID0gNTE2O1xyXG5cclxuXHRcdC8qR2FtZU1vZGVsLmhlcm8gPSBBc3NldENvbnRyb2xsZXIucmVxdWVzdF9iaXRtYXAoXCJncmVla193YXJyaW9yXCIpO1xyXG5cdFx0R2FtZU1vZGVsLmhlcm8ucmVnWCA9IDA7XHJcblx0XHRHYW1lTW9kZWwuaGVyby5yZWdZID0gR2FtZU1vZGVsLmhlcm8uaW1hZ2UuaGVpZ2h0O1xyXG5cdFx0R2FtZU1vZGVsLmhlcm8ueCA9IDEwMDtcclxuXHRcdEdhbWVNb2RlbC5oZXJvLnkgPSA1MTM7Ki9cclxuXHJcblx0XHRjaG9tcGVyX3NoZWV0ID0gbmV3IGNyZWF0ZWpzLlNwcml0ZVNoZWV0KHtcclxuXHRcdCAgICBcImZyYW1lcmF0ZVwiOiAyLFxyXG5cdFx0ICAgIFwiaW1hZ2VzXCI6IFtcIi4uL0NvbnRlbnQvZ2FtZWRlbW8vYXNzZXRzL2FydC9DaG9tcGVycy5wbmdcIl0sXHJcblx0XHQgICAgXCJmcmFtZXNcIjogeyBcInJlZ1hcIjogMCwgXCJyZWdZXCI6IDIxMCwgXCJoZWlnaHRcIjogMjEwLCBcIndpZHRoXCI6IDMzNywgXCJjb3VudFwiOiAyIH0sXHJcblx0XHQgICAgXCJhbmltYXRpb25zXCI6IHtcclxuXHRcdCAgICAgICAgXCJydW5cIjogWzAsIDEsIFwicnVuXCJdXHJcblx0XHQgICAgfVxyXG5cclxuXHRcdH0pO1xyXG5cclxuXHRcdEdhbWVNb2RlbC5jaG9tcGVyID0gbmV3IGNyZWF0ZWpzLlNwcml0ZShjaG9tcGVyX3NoZWV0LCBcInJ1blwiKTtcclxuXHJcblx0XHRHYW1lTW9kZWwuY2hvbXBlci54ID0gNzAwOyAvLyBzZXQgcG9zaXRpb25cclxuXHRcdEdhbWVNb2RlbC5jaG9tcGVyLnkgPSA1NTU7XHJcblxyXG5cdFx0R2FtZU1vZGVsLnNjb3JlID0gbmV3IGNyZWF0ZWpzLlRleHQoKTtcclxuXHRcdEdhbWVNb2RlbC5zY29yZS54ID0gMTA7XHJcblx0XHRHYW1lTW9kZWwuc2NvcmUueSA9IDEwO1xyXG5cdFx0R2FtZU1vZGVsLnNjb3JlLnRleHQgPSBcIjBcIjtcclxuXHRcdEdhbWVNb2RlbC5zY29yZS5mb250ID0gXCJib2xkIDE2cHQgQXJpYWxcIjtcclxuXHJcblx0XHRHYW1lTW9kZWwuc3RhZ2UuYWRkQ2hpbGQoR2FtZU1vZGVsLmNob21wZXIsIEdhbWVNb2RlbC5oZXJvLCBHYW1lTW9kZWwuc2NvcmUpO1xyXG5cclxuXHRcdHNldHVwX3RpY2tlcigpO1xyXG5cclxuXHRcdFRlcnJhaW5Db250cm9sbGVyLmdlbmVyYXRlX3RlcnJhaW4oKTsgLy8gSW5pdGlhbCB0ZXJyYWluIGdlbmVyYXRpb25cclxuXHR9O1xyXG5cclxuXHJcblx0cmV0dXJuIHtcclxuXHRcdGluaXQ6IGluaXQsXHJcblx0fTtcclxufSkoKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gSW5pdENvbnRyb2xsZXI7XHJcbiIsInZhciBLZXlib2FyZENvbnRyb2xsZXIgPSAoZnVuY3Rpb24oKVxyXG57XHJcblx0Ly8gVE9ETzogZG9lcyB0aGlzIHNlY3Rpb24gYmVsb25nIGludG8gdGhlIGNvbnRyb2xsZXI/ID4+PlxyXG5cdHZhciBrZXlzID0ge307XHJcblxyXG5cdHZhciBUUl9UQUJMRVMgPSAvLyB0cmFuc2xhdGlvbiB0YWJsZXNcclxuXHR7XHJcblx0XHRjb2RlX3RvX25hbWU6IHtcclxuXHRcdFx0Mzc6IFwibGVmdFwiLFxyXG5cdFx0XHQzODogXCJ1cFwiLFxyXG5cdFx0XHQzOTogXCJyaWdodFwiLFxyXG5cdFx0XHQ0MDogXCJkb3duXCJcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdC8vIDw8PCBlbmQgVE9ET1xyXG5cclxuXHR2YXIgZ2V0X2FjdGl2ZV9jb21tYW5kcyA9IGZ1bmN0aW9uKHRhYmxlKXtcclxuXHRcdC8vIGdldCBhbGwgY29tbWFuZHMgYXNzb2NpYXRlZCB3aXRoIGtleXMgdGhhdCBhcmUgZGVmaW5lZCBpbiB0aGUgPnRhYmxlPCxcclxuXHRcdC8vIGFuZCBhcmUgY3VycmVudGx5IHByZXNzZWRcclxuXHRcdC8vXHJcblx0XHQvLyByZXR1cm5zOiBhcnJheSBvZiBjb21tYW5kc1xyXG5cdFx0XHJcblx0XHR2YXIgY29tbWFuZHMgPSBbXTtcclxuXHRcdFxyXG5cdFx0JC5lYWNoKHRhYmxlLCBmdW5jdGlvbihrZXksIGNtZCl7XHJcblx0XHRcdGlmKGtleXNba2V5XSl7XHJcblx0XHRcdFx0Y29tbWFuZHMucHVzaChjbWQpO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHJcblx0XHRyZXR1cm4gY29tbWFuZHM7XHJcblx0fTtcclxuXHJcblx0Ly8gcHVibGljOlxyXG5cdFxyXG5cdHZhciBrZXlkb3duID0gZnVuY3Rpb24oZXZlbnQpe1xyXG5cdFx0a2V5c1tldmVudC5rZXlDb2RlXSA9IHRydWU7XHJcblx0fTtcclxuXHJcblx0dmFyIGtleXVwID0gZnVuY3Rpb24oZXZlbnQpe1xyXG5cdFx0ZGVsZXRlIGtleXNbZXZlbnQua2V5Q29kZV07XHJcblx0fTtcclxuXHJcblxyXG5cdHZhciBtb3ZlbWVudF9jb21tYW5kcyA9IGZ1bmN0aW9uKCl7XHJcblx0XHRyZXR1cm4gZ2V0X2FjdGl2ZV9jb21tYW5kcyhUUl9UQUJMRVMuY29kZV90b19uYW1lKTtcclxuXHR9O1xyXG5cclxuXHJcblx0cmV0dXJuIHtcclxuXHRcdGtleWRvd246IGtleWRvd24sXHJcblx0XHRrZXl1cDoga2V5dXAsXHJcblxyXG5cdFx0bW92ZW1lbnRfY29tbWFuZHM6IG1vdmVtZW50X2NvbW1hbmRzXHJcblxyXG5cdH07XHJcblxyXG59KSgpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBLZXlib2FyZENvbnRyb2xsZXI7XHJcbiIsInZhciBHYW1lTW9kZWw7XHJcbkdhbWVNb2RlbCA9IHJlcXVpcmUoXCIuLi9Nb2RlbHMvR2FtZU1vZGVsLmpzXCIpO1xyXG5cclxudmFyIFBsYXllckNvbnRyb2xsZXIgPSAoZnVuY3Rpb24oKXtcclxuXHJcblx0XHR2YXIgbW92ZV9yaWdodCA9IGZ1bmN0aW9uKCl7XHJcblx0XHRtb3ZlKDEwLCAwKTtcclxuXHR9O1xyXG5cclxuXHR2YXIgbW92ZV9sZWZ0ID0gZnVuY3Rpb24oKXtcclxuXHRcdC8vR2FtZU1vZGVsLmhlcm8ueCAtPTEwO1xyXG5cdFx0bW92ZSgtMTAsIDApO1xyXG5cdH07XHJcblxyXG5cdHZhciBtb3ZlID0gZnVuY3Rpb24ob2Zmc2V0X3gsIG9mZnNldF95KXtcclxuXHRcdEdhbWVNb2RlbC5oZXJvLnggKz0gb2Zmc2V0X3g7XHJcblx0XHRHYW1lTW9kZWwuaGVyby55ICs9IG9mZnNldF95O1xyXG5cdH07XHJcblxyXG5cdHJldHVybiB7XHJcblx0XHRtb3ZlX3JpZ2h0OiBtb3ZlX3JpZ2h0LFxyXG5cdFx0bW92ZV9sZWZ0OiBtb3ZlX2xlZnQsXHJcblx0XHRtb3ZlOiBtb3ZlXHJcblx0fTtcclxufSkoKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gUGxheWVyQ29udHJvbGxlcjtcclxuIiwidmFyIEdhbWVNb2RlbCwgVGVycmFpbk1vZGVsO1xyXG52YXIgQXNzZXRDb250cm9sbGVyO1xyXG52YXIgVXRpbGl0eSwgQ29uZmlnO1xyXG5cclxuQXNzZXRDb250cm9sbGVyID0gcmVxdWlyZShcIi4vQXNzZXRDb250cm9sbGVyLmpzXCIpO1xyXG5cclxuR2FtZU1vZGVsID0gcmVxdWlyZShcIi4uL01vZGVscy9HYW1lTW9kZWwuanNcIik7XHJcblRlcnJhaW5Nb2RlbCA9IHJlcXVpcmUoXCIuLi9Nb2RlbHMvVGVycmFpbk1vZGVsLmpzXCIpO1xyXG5cclxuVXRpbGl0eSA9IHJlcXVpcmUoXCIuLi9VdGlsaXR5LmpzXCIpO1xyXG5Db25maWcgPSByZXF1aXJlKFwiLi4vQ29uZmlnLmpzXCIpO1xyXG5cclxuXHJcbnZhciBUZXJyYWluQ29udHJvbGxlciA9IChmdW5jdGlvbigpe1xyXG5cdHZhciBMVkxfUFJPQiA9IFtcclxuXHRcdFs3LCAyLCAxXSxcclxuXHRcdFswLCA3LCAzXSxcclxuXHRcdFswLCAxLCA5XVxyXG5cdF07IC8vIHByb2JhYmlsaXRpZXMgZm9yIGVhY2ggbGV2ZWw7IHRlbXBvcmFyeSFcclxuXHJcblx0XHJcblx0XHJcblx0dmFyIHJldHJpZXZlX3dvcmxkX3BhcmFtZXRlcnMgPSBmdW5jdGlvbigpe307XHJcblxyXG5cdHZhciBnZW5lcmF0ZV90ZXJyYWluID0gZnVuY3Rpb24oKXtcclxuXHRcdC8qXHJcblx0XHQgICBMb2FkIGFwcHJvcHJpYXRlIGFtb3VudCBvZiB0aGUgdGVycmFpbiBhaGVhZFxyXG5cdFx0ICAgT25seSBhIGRlbW8hISEgbXVzdCBiZSBtYWRlIG1vcmUgc29waGlzdGljYXRlZCFcclxuXHRcdCovXHJcblxyXG5cclxuXHRcdHZhciB0ZXJyYWluX2Nob2ljZXMgPSBbXCJncmFzc1wiLCBcIm1pZGRsZV90ZXJyYWluXCIsIFwiYm90dG9tX3RlcnJhaW5cIl07XHJcblxyXG5cdFx0Ly8gVE9ETzogbWFrZSBtb3JlIGVmZmljaWVudCBieSBkZXRlY3Rpbmcgd2hldGhlciB0ZXJyYWluIG1vdmVkIHNpbmNlIHRoZSBsYXN0IHRpbWVcclxuXHRcdGZvcih2YXIgaSA9IDA7IGkgPCBUZXJyYWluTW9kZWwudGVycmFpbl9xdWV1ZXMubGVuZ3RoOyBpKyspe1xyXG5cdFx0XHQvLy8vIGZvciBlYWNoIGxldmVsIG9mIHRlcnJhaW5cclxuXHRcdFx0dmFyIHNsaWNlX2luZGV4ID0gMDsgLy9cclxuXHRcdFx0dmFyIHRlcnJhaW5fcXVldWUgPSAgVGVycmFpbk1vZGVsLnRlcnJhaW5fcXVldWVzW2ldO1xyXG5cclxuXHRcdFx0Zm9yKHZhciBqID0gMDsgaiA8IHRlcnJhaW5fcXVldWUubGVuZ3RoOyBqKyspe1xyXG5cdFx0XHRcdC8vIGZvciBlYWNoIHRpbGUsIGlmIHRpbGUgaXMgb2ZzY3JlZW4sIGRlbGV0ZSBpdFxyXG5cdFx0XHRcdHZhciB0aWxlID0gdGVycmFpbl9xdWV1ZVtqXTtcclxuXHRcdFx0XHQvLyBUT0RPIGJyZWFrIGFmdGVyIGVuY291bnRlcmluZyBmaXJzdCB0aWxlIHdpdGggYmlnZ2VyIGluZGV4IChJIGRvIG5vdCBpbXBsZW1lbnQgaXQgbm93IHRvIHNpbXBsaWZ5IGRlYnVnZ2luZylcclxuXHRcdFx0XHRpZih0aWxlLnggPCAtMTAwKXtcclxuXHRcdFx0XHRcdEdhbWVNb2RlbC5zdGFnZS5yZW1vdmVDaGlsZCh0aWxlKTtcclxuXHRcdFx0XHRcdHNsaWNlX2luZGV4ICs9IDE7XHJcblx0XHRcdFx0ICAgfVxyXG5cdFx0XHQgICB9XHJcblxyXG5cdFx0XHRpZihzbGljZV9pbmRleCA+IDApe1xyXG5cdFx0XHRcdFRlcnJhaW5Nb2RlbC50ZXJyYWluX3F1ZXVlc1tpXSA9IHRlcnJhaW5fcXVldWUuc2xpY2Uoc2xpY2VfaW5kZXgpO1xyXG5cdFx0XHRcdHZhciB0ZXJyYWluX3F1ZXVlID0gIFRlcnJhaW5Nb2RlbC50ZXJyYWluX3F1ZXVlc1tpXTtcclxuXHRcdFx0fVxyXG5cclxuXHJcblx0XHRcdFxyXG5cdFx0XHR2YXIgbGFzdF90aWxlID0gdGVycmFpbl9xdWV1ZVt0ZXJyYWluX3F1ZXVlLmxlbmd0aCAtIDFdO1xyXG5cclxuXHRcdFx0d2hpbGUodGVycmFpbl9xdWV1ZS5sZW5ndGggPCA3MCl7XHJcblx0XHRcdFx0XHQvLyB3aGlsZSBsZXZlbCBxdWV1ZSBpc24ndCBmdWxsXHJcblx0XHRcdFx0XHR2YXIgbmV4dF94ID0gbGFzdF90aWxlID8gbGFzdF90aWxlLnggKyAzMCA6IC0xMDA7XHJcblxyXG5cdFx0XHRcdFx0dmFyIHJhbmRvbV9pZCA9IFV0aWxpdHkucmFuZG9tX2Nob2ljZShMVkxfUFJPQltpXSwgdGVycmFpbl9jaG9pY2VzKTtcclxuXHJcblx0XHRcdFx0XHR2YXIgcmFuZF90aWxlID0gQXNzZXRDb250cm9sbGVyLnJlcXVlc3RfYml0bWFwKHJhbmRvbV9pZCk7XHJcblxyXG5cdFx0XHRcdFx0Ly9UaGlzIG11c3QgYmUgaXQncyBvd24gZnVuY3Rpb24gYW5kIGJlIGdyZWF0ZWx5IGdlbmVyYWxpemVkIGFuZCBzdGFuZGFydGl6ZWQ6XHJcblx0XHRcdFx0XHRyYW5kX3RpbGUucmVnWCA9IDA7XHJcblx0XHRcdFx0XHRyYW5kX3RpbGUucmVnWSA9IDMwO1xyXG5cdFx0XHRcdFx0cmFuZF90aWxlLnkgPSA1MTAgKyAzMCooaSsxKTtcclxuXHRcdFx0XHRcdHJhbmRfdGlsZS54ID0gbmV4dF94O1xyXG5cclxuXHRcdFx0XHRcdC8vIHRoaXMgbXVzdCBiZSBkb25lIGluIGl0cyBvd24gZnVuY3Rpb24sIHRvIGtlZXAgdHJhY2sgb2YgZXZlcnl0aGluZ1xyXG5cdFx0XHRcdFx0Ly8gZS5nLiBcInotaW5kZXhcIiBvZiBldmVyeSBlbGVtZW50LCBldGMuXHJcblx0XHRcdFx0XHRHYW1lTW9kZWwuc3RhZ2UuYWRkQ2hpbGQocmFuZF90aWxlKTsgXHJcblxyXG5cdFx0XHRcdFx0dGVycmFpbl9xdWV1ZS5wdXNoKHJhbmRfdGlsZSk7XHJcblxyXG5cdFx0XHRcdFx0bGFzdF90aWxlID0gcmFuZF90aWxlO1xyXG5cclxuXHRcdFx0ICAgfVxyXG5cclxuXHRcdCAgIFxyXG5cdCAgIH0gLy8gZW5kIGZvciBcclxuXHJcblxyXG5cclxuXHR9OyAvL2VuZCBnZW5lcmF0ZV90ZXJyYWluXHJcblxyXG5cdHZhciBmb3JfZWFjaF90aWxlID0gZnVuY3Rpb24oZil7XHJcblx0XHQvLyB0YWtlcyBmdW5jdGlvbiA+ZjwgdGhhdCB0YWtlcyB0aHJlZSBwYXJhbWV0ZXJzOiB0aWxlIChlc2VsanMgb2JqZWN0KSxcclxuXHRcdC8vIHRlcnJhaW5fbHZsIChpbnQpLCBhbmQgdGlsZV9pbmRleCAoaW50KVxyXG5cdFx0Ly8gY2FsbHMgdGhpcyBmdW5jdGlvbiBmb3IgZXZlcnkgdGlsZSBvZiB0aGUgdGVycmFpblxyXG5cdFx0XHJcblx0XHR2YXIgcXVldWVzID0gVGVycmFpbk1vZGVsLnRlcnJhaW5fcXVldWVzO1xyXG5cclxuXHRcdCQuZWFjaChxdWV1ZXMsIGZ1bmN0aW9uKHRlcnJhaW5fbHZsKXtcclxuXHRcdFx0JC5lYWNoKHF1ZXVlc1t0ZXJyYWluX2x2bF0sIGZ1bmN0aW9uKHRpbGVfaW5kZXgpe1xyXG5cdFx0XHRcdGYocXVldWVzW3RlcnJhaW5fbHZsXVt0aWxlX2luZGV4XSwgdGVycmFpbl9sdmwsIHRpbGVfaW5kZXgpO1xyXG5cdFx0XHR9KTtcclxuXHRcdH0pO1xyXG5cclxuXHR9O1xyXG5cclxuXHR2YXIgbW92ZV9sZWZ0ID0gZnVuY3Rpb24ocGl4ZWxzKXtcclxuXHRcdC8vIFNob3VsZCBJIHNjcmFwIHRoaXMgZnVuY3Rpb24gYW5kIGp1c3QgdXNlID5tb3ZlPCwgb3IgaXMgdGhpcyBhIGhlbHBmdWwgc2hvcnRjdXQ/XHJcblx0XHRcclxuXHRcdG1vdmUoKC0xKSpwaXhlbHMsIDApO1xyXG5cclxuXHR9OyAvLyBlbmQgbW92ZV9sZWZ0XHJcblx0XHJcblx0dmFyIG1vdmUgPSBmdW5jdGlvbihvZmZzZXRfeCwgb2Zmc2V0X3kpe1xyXG5cdFx0aWYob2Zmc2V0X3ggIT0gMCl7XHJcblx0XHRcdGZvcl9lYWNoX3RpbGUoZnVuY3Rpb24odGlsZSwgdGVycmFpbl9sdmwsIHRpbGVfaW5kZXgpe1xyXG5cdFx0XHRcdHRpbGUueCArPSBvZmZzZXRfeDtcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0fS8vIGZpXHJcblxyXG5cdFx0aWYob2Zmc2V0X3kgIT0gMCl7XHJcblx0XHRcdGZvcl9lYWNoX3RpbGUoZnVuY3Rpb24odGlsZSwgdGVycmFpbl9sdmwsIHRpbGVfaW5kZXgpe1xyXG5cdFx0XHRcdHRpbGUueSArPSBvZmZzZXRfeTtcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIFRPRE86IHJld29yayB0aGlzIHN1Ym9wdGltYWwgc29sdXRpb24sIHNvIHRoYXQgdGVycmFpbiBpcyByZWdlbmVyYXRlZCBvbmx5IG9uY2UgcGVyIHRpY2tcclxuXHRcdC8vIGluc3RlYWQgb2YgYXQgZWFjaCBtb3ZlbWVudCBjb21tYW5kOyBzb2x1dGlvbiBzaG91bGQgYmUgYmV0dGVyIHRoYW4ganVzdCBwbGFjaW5nIHRoZSBjYWxsXHJcblx0XHQvLyBpbnRvIHRoZSBHYW1lQ29udHJvbGxlci51cGRhdGVfYWxsIGZ1bmN0aW9uXHJcblx0XHRnZW5lcmF0ZV90ZXJyYWluKCk7XHJcblx0fTtcclxuXHJcblx0cmV0dXJuIHtcclxuXHRcdGdlbmVyYXRlX3RlcnJhaW46IGdlbmVyYXRlX3RlcnJhaW4sXHJcblx0XHRtb3ZlX2xlZnQ6IG1vdmVfbGVmdCxcclxuXHRcdG1vdmU6IG1vdmVcclxuXHR9XHJcbn0pKCk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFRlcnJhaW5Db250cm9sbGVyO1xyXG4iLCJ2YXIgVGVzdENvbnRyb2xsZXIgPSAoZnVuY3Rpb24oKXtcclxuXHQvLyBwbGFjZWhvbGRlciBmb3IgaW1wbGVtZW50aW5nIHRlc3RpbmdcclxuXHQvLyBtYXkgYmUgY2hhbmdlZC9yZW1vdmVkL3VwZ3JhZGVkIGRlcGVuZGluZyBvbiBob3cgd2Ugd2lsbCBoYW5kbGUgb3VyIHRlc3RzXHJcblx0XHJcblx0dmFyIHRlc3QgPSBmdW5jdGlvbigpe1xyXG5cdFx0Ly8gaWYgeW91IG5lZWQgc29tZSBzb3J0IG9mIHRlc3RzIGxhdW5jaGVkLCB0aGlzIGlzIG9uZSBvZiB0aGUgcGxhY2VzIHRvIGRvIGl0XHJcblx0fTtcclxuXHJcblx0dmFyIHBvc3RfbG9hZGluZ190ZXN0ID0gZnVuY3Rpb24oKXtcclxuXHRcdC8vIFRPRE86IGNhbGwgd2hlbiBsb2FkaW5nIGFzc2V0cyBpcyBjb21wbGV0ZWQgaWYgdGhlcmUgYXJlIHNvbWUgdGVzdHMgdGhhdCBuZWVkXHJcblx0XHQvLyB0byBiZSBkb25lIGF0IHRoYXQgbW9tZW50LiAoUmVmZXIgdG8gSW5pdENvbnRyb2xsZXIuaW5pdCBhbmQgXHJcblx0XHQvLyBJbml0Q29udHJvbGxlci5zZXR1cF9hc3NldF9kZXBlbmRlbnQgbWV0aG9kc1xyXG5cdH07XHJcblxyXG5cclxuXHRyZXR1cm4ge1xyXG5cdFx0dGVzdDogdGVzdCxcclxuXHRcdHBvc3RfbG9hZGluZ190ZXN0OiBwb3N0X2xvYWRpbmdfdGVzdCxcclxuXHR9XHJcbn0pKCk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFRlc3RDb250cm9sbGVyO1xyXG4iLG51bGwsInZhciBBc3NldE1vZGVsID0gbmV3IGZ1bmN0aW9uKCl7XHJcblx0Ly8gQXMgYWx3YXlzLCBhbG1vc3QgYW55dGhpbmcgaXMgaW5pdGlhbGl6ZWQgaW4gdGhlIEluaXRDb250cm9sbGVyXHJcblx0XHJcblx0dGhpcy5sb2FkZXI7XHJcblxyXG5cdHRoaXMubWFuaWZlc3QgPSBbIC8vIGRlZmluaW5nIHJlc291cmNlcyB0byBiZSBsb2FkZWQgaW4gYnVsayB3aXRoIHByZWxvYWQuanNcclxuXHRcdFx0eyBzcmM6IFwiZ3JlZWtfd2Fycmlvci5wbmdcIiwgaWQ6IFwiZ3JlZWtfd2FycmlvclwiIH0sXHJcbiAgICAgICAgICAgIHsgc3JjOiBcImFudC5wbmdcIiwgaWQ6IFwiYW50XCIgfSxcclxuICAgICAgICAgICAgeyBzcmM6IFwiQ2hvbXBlcnMucG5nXCIsIGlkOiBcImNob21wZXJcIn0sXHJcblx0XHRcdC8ve3NyYzosIGlkOn0sXHJcblx0XHRcdHtzcmM6IFwibWlkZGxlX3RlcnJhaW4ucG5nXCIsIGlkOlwibWlkZGxlX3RlcnJhaW5cIn0sXHJcblx0XHRcdHtzcmM6IFwiYm90dG9tX3RlcnJhaW4ucG5nXCIsIGlkOiBcImJvdHRvbV90ZXJyYWluXCJ9LFxyXG5cdFx0XHR7c3JjOiBcImdyYXNzLnBuZ1wiLCBpZDogXCJncmFzc1wifVxyXG5cdFx0XTsgXHJcblx0XHQvLyBUT0RPIG1ha2UgYWRkaW5nIHJlc291cmNlcyBlYXNpZXI/IEF1dG9tYXRpYyBsb2FkaW5nIFxyXG5cdFx0Ly8gb2YgZXZlcnl0aGluZyBmcm9tIGFzc2V0cywgYXV0b21hdGljIG5hbWVzIGV0Yy4/XHJcblxyXG5cdHRoaXMuc2hhcGVzID0ge307IC8vIG1heWJlIHRoaXMgYXJlbid0IG5lZWRlZFxyXG5cclxuXHR0aGlzLmJpdG1hcHMgPSB7fTtcclxuXHJcblx0dGhpcy5hbmltYXRpb25zID0ge307XHJcblxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBBc3NldE1vZGVsO1xyXG4iLCJ2YXIgQ2FtZXJhTW9kZWwgPSBuZXcgZnVuY3Rpb24oKXtcclxuXHR0aGlzIC8vIG5vdCBpbXBsZW1lbnRlZFxyXG5cdHRoaXMuY2VudGVyX3k7IC8vIG5vdCBpbXBsZW1lbnRlZFxyXG5cclxuXHR0aGlzLmZvbGxvd2luZztcclxuXHJcblxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBDYW1lcmFNb2RlbDtcclxuIiwidmFyIEdhbWVNb2RlbCA9IG5ldyBmdW5jdGlvbigpeyAvLyBtYWluIG1vZGVsXHJcblxyXG5cdC8vIE5vdGljZSB0aGF0IGFsbCB0aGVzZSB2YXJpYWJsZXMgd2lsbCBiZSBpbml0aWFsaXplZCBmcm9tIHRoZSBJbml0Q29udHJvbGxlclxyXG5cclxuXHR0aGlzIC8vIGVhc2VsanMgcmVwcmVzZW50YXRpb24gb2YgdGhlIG1haW4gY2FudmFzXHJcblxyXG5cdHRoaXMub3RoZXJfcGxheWVycyA9IHt9OyAvLyBwbGF5ZXJzIGNvbnRyb2xsZWQgYnkgcmVtb3RlIGNsaWVudHNcclxuXHJcblx0dGhpcy5oZXJvOyAvLyBwbGF5ZXIgY29udHJvbGxlZCBieSB0aGUgY3VycmVudCB1c2VyXHJcblxyXG5cdHRoaXMuY2hvbXBlcjtcclxuXHJcblx0dGhpcy5zY29yZTtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gR2FtZU1vZGVsO1xyXG4iLCJ2YXIgVGVycmFpbk1vZGVsID0gbmV3IGZ1bmN0aW9uKCl7XHJcblxyXG5cdC8vIFRPRE86IGR5bmFtaWMgaW5pdGlhbGl6YXRpb25cclxuXHR0aGlzLnRlcnJhaW5fcXVldWVzID0gW1xyXG5cdFx0W10sXHJcblx0XHRbXSxcclxuXHRcdFtdXHJcblx0XTtcclxuXHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFRlcnJhaW5Nb2RlbDtcclxuIiwiYXJndW1lbnRzWzRdW1wiQzpcXFxcVXNlcnNcXFxca21oMTE4OTRcXFxcRG9jdW1lbnRzXFxcXFNpZGVTY3JvbGxlclxcXFxJbmZpbml0ZSBTaWRlc2Nyb2xsZXJcXFxcQ29udGVudFxcXFxnYW1lZGVtb1xcXFxDb250cm9sbGVyc1xcXFxXb3JsZENvbnRyb2xsZXIuanNcIl1bMF0uYXBwbHkoZXhwb3J0cyxhcmd1bWVudHMpIiwidmFyIFV0aWxpdHkgPSAoZnVuY3Rpb24oKVxyXG57XHJcblx0dmFyIGxnID0gZnVuY3Rpb24oKVxyXG5cdHtcclxuXHRcdC8qXHJcblx0XHQgKiBzaG9ydGN1dCB0byBjb25zb2xlLmxvZygpXHJcblx0XHQgKiBwcmludHMgYWxsIGFyZ3VtZW50cyB0byBjb25zb2xlXHJcblx0XHQgKiBmaXJzdCBhcmd1bWVudCBpcyB1c2VkIGFzIGEgbGFiZWwgZm9yIHRoZSByZXN0XHJcblx0XHQgKlxyXG5cdFx0ICogZWFjaCBsYWJlbGVkIGdyb3VwIGlzIGVuY2xvc2VkIGludG8gdGhlIGNvbG9yZWQgZGVsaW1pdGVyc1xyXG5cdFx0ICogPj4+IGFuZCA8PDwgc28gaXQncyBlYXNpbHkgZGlzdGluZ3Vpc2hlZC4gSSBmb3VuZCBpdCBoZWxwZnVsLFxyXG5cdFx0ICogaWYgeW91IGRvbid0IGxldCBtZSBrbm93LCBvciB1c2Ugc29tZXRoaW5nIGVsc2VcclxuXHRcdCAqL1xyXG5cdFx0Y29uc29sZS5sb2coXCIlcyAlYyAlc1wiLCBhcmd1bWVudHNbMF0sIFwiYmFja2dyb3VuZDogI0RBRjJCMVwiLCBcIj4+PlwiKTtcclxuXHRcdFxyXG5cdFx0Zm9yKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKylcclxuXHRcdHtcclxuXHRcdFx0Y29uc29sZS5sb2coXCJcXHRcIiwgYXJndW1lbnRzW2ldKTtcclxuXHRcdH1cclxuXHRcdGNvbnNvbGUubG9nKFwiJWM8PDxcIiwgXCJiYWNrZ3JvdW5kOiAjREFGMkIxXCIpO1xyXG5cclxuXHR9O1xyXG5cclxuXHR2YXIgcmFuZG9tX2Nob2ljZSA9IGZ1bmN0aW9uKHByb2JhYmlsaXRpZXMsIGNob2ljZXMpe1xyXG5cdFx0LypcclxuXHRcdCAgIHRha2VzIDIgYXJyYXlzIHdpdGggZWxlbWVudHMgYXQgY29ycmVzcG9uZGluZyBpbmRleGVzXHJcblx0XHQgICBiZWluZyBjaG9pY2UgYW5kIGl0J3MgcHJvYmFiaWxpdHkuIHBpY2tzIHJhbmRvbSBvbmUuXHJcblx0XHQgICBjaG9pY2VzIGFyZSBhbnl0aGluZywgcHJvYmFiaWxpdHkgaXMgaW50ZWdlciBhLCBzdWNoIHRoYXRcclxuXHRcdCAgIHByb2JhYmlsaXR5IG9mIGEgY2hvaWNlIGlzIGEvMTAuIHdpdGggYSA8IDEwLCBvZiBjb3Vyc2VcclxuXHRcdCAgIGFuZCBwcm9iYWJpbGl0aWVzIGFkZGluZyB1cCB0byAxMC4gXHJcblx0XHQgICBZZXMsIGl0J3Mgbm90IHZlcnkgZ29vZCBpbXBsZW1lbnRhdGlvbiAocmVhZDogdGVycmlibGUpLCBcclxuXHRcdCAgIGFuZCBzaW5jZSB5b3Ugbm90aWNlZCwgbm93IGl0J3MgeW91ciBqb2IgdG8gaW1wcm92ZSBpdC5cclxuXHJcblx0XHQqL1xyXG5cclxuXHRcdC8vIGFycmF5IHdpdGggY2hvaWNlcyBkdXBsaWNhdGVkIGEgcHJvcGVyIGFtb3VudCBvZiB0aW1lcyBiYXNlZCBvblxyXG5cdFx0Ly8gdGhlaXIgcHJvYmFiaWxpdHlcclxuXHRcdHZhciBibGFoID0gW107IFxyXG5cclxuXHRcdGZvcih2YXIgaSA9IDA7IGkgPCBjaG9pY2VzLmxlbmd0aDsgaSsrKXtcclxuXHRcdFx0Zm9yKHZhciBqID0gMDsgaiA8IHByb2JhYmlsaXRpZXNbaV07IGorKyl7XHJcblx0XHRcdFx0YmxhaC5wdXNoKGNob2ljZXNbaV0pO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0dmFyIHJhbmRfaW5kZXggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBibGFoLmxlbmd0aCk7XHJcblxyXG5cdFx0cmV0dXJuIGJsYWhbcmFuZF9pbmRleF07XHJcblx0fTtcclxuXHJcblx0XHJcblxyXG5cdHJldHVybiB7XHJcblx0XHRsZzogbGcsXHJcblx0XHRyYW5kb21fY2hvaWNlOiByYW5kb21fY2hvaWNlXHJcblx0fTtcclxuXHJcbn0pKCk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFV0aWxpdHk7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxuLypcclxuICogUnVsZXMgZm9yIHdvcmtpbmcgb24gdGhpczpcclxuICpcclxuICogMS4gSWYgeW91IHRoaW5rIHRoYXQgb25lIG9mIHRoZXNlIHJ1bGVzIGlzIHN0dXBpZCBvciB1c2VsZXNzLCB0ZWxsIG1lLCBhbG9uZyB3aXRoIHNvbWUgYmV0dGVyIHN1Z2dlc3Rpb25zLlxyXG4gKlxyXG4gKiAyLiBNb2RlbCBbbmFtZV1Nb2RlbCBjYW4gb25seSBiZSBhY2Nlc3NlZCB0aHJvdWdoIFtuYW1lXUNvbnRyb2xsZXIuIElmIHlvdSBuZWVkIHRvIGRvIHNvbWV0aGluZyB0byBcclxuICogXHRcdGNoYW5nZSBbbmFtZV1Nb2RlbCBmcm9tIFtvdGhlcl9uYW1lXUNvbnRyb2xsZXIsIHdyaXRlIGZ1bmN0aW9uIGluIHRoZSBbbmFtZV1Db250cm9sbGVyIHRoYXQgZG9lc1xyXG4gKiBcdFx0d2hhdCB5b3UgbmVlZCwgYW5kIGNhbGwgaXQgZnJvbSB0aGUgW290aGVyX25hbWVdQ29udHJvbGxlclxyXG4gKlxyXG4gKiAzLiBDb250cm9sbGVycyBhcmUgYWxsb3dlZCB0byBoYXZlIHByaXZhdGUgbWV0aG9kcy9maWVsZHMuIE1vZGVscyBhcmVuJ3QuIFxyXG4gKlxyXG4gKiA0LiBDb250cm9sbGVycyBhcmVuJ3QgYWxsb3dlZCB0byBoYXZlIHB1YmxpYyBkYXRhIGZpZWxkcy4gXHJcbiAqIFx0XHRUaG9zZSBkYXRhIGZpZWxkcyB0aGF0IGFyZSBwcmVzZW50IG11c3Qgbm90IHJlZmxlY3Qgc3RhdGUgb2YgdGhlIGdhbWUsIHRoZXkgbXVzdCBiZSByZWxhdGVkIHRvXHJcbiAqIFx0XHRzb21lIGludGVybmFsIGZ1bmN0aW9uYWxpdHkgb2YgdGhlIGNvbnRyb2xsZXJcclxuICpcclxuICogNS4gSWYgeW91IHdyaXRlIHNvbWUgZnVuY3Rpb24gdGhhdCBkb2Vzbid0IGxvZ2ljYWxseSBiZWxvbmcgdG8gb25lIG9mIHRoZSBjb250cm9sbGVycyxcclxuICogXHRcdHB1dCBpdCBpbiB0aGUgVXRpbGl0eVxyXG4gKlxyXG4gKiA2LiBWYXJpYWJsZXMgYXJlIG5hbWVkIGxpa2UgdGhhdDogdmFyaWFibGVfbmFtZVxyXG4gKiBcdFx0RXhjZXB0IChzaW5nbGV0b24pY2xhc3MgbmFtZXMsIHRoYXQgYXJlIHdyaXR0ZW4gbGlrZSB0aGF0OiBDbGFzc05hbWVcclxuICpcclxuICogNy4gQW5kIGFsbCB0aGUgb2J2aW91cyBzdHVmZiB0aGF0IGV2ZXJ5b25lIGtub3dzOlxyXG4gKiBcdFx0ZnVuY3Rpb24gbXVzdCBkbyBvbmUgdGhpbmc7IGRvbid0IG1ha2UgZnVuY3Rpb24gcHVibGljIHVubGVzcyBpdCBuZWVkcyB0byBiZSB0aGF0OyBcclxuICogXHRcdGNvbW1lbnQgYW1iaWdpb3VzIGNvZGUsIGZvciBsYXJnZXIgZnVuY3Rpb25zIGluZGljYXRlIHRoZWlyIHB1cnBvc2UgXHJcbiAqL1xyXG5cclxud2luZG93LnNpZGVzY3JvbGxlcl9nYW1lID0gKGZ1bmN0aW9uIG5hbWVzcGFjZSgpe1xyXG5cclxuXHR2YXIgQ29uZmlnID0gcmVxdWlyZShcIi4vQ29uZmlnLmpzXCIpO1xyXG5cdFx0XHJcblx0dmFyIFV0aWxpdHkgPSByZXF1aXJlKFwiLi9VdGlsaXR5LmpzXCIpO1xyXG5cclxuXHR2YXIgbGcgPSBVdGlsaXR5LmxnOyAvLyBmb3IgcXVpY2tlciBhY2Nlc3NcclxuXHR2YXIgR2FtZU1vZGVsID0gcmVxdWlyZShcIi4vTW9kZWxzL0dhbWVNb2RlbC5qc1wiKTtcclxuXHR2YXIgUGxheWVyTW9kZWw7IC8vIFRPRE86IG11c3QgYmUgcG9zc2libGUgdG8gaW5zdGFudGlhdGUgW2FuZC9vcl0gZHVwbGljYXRlXHJcblx0dmFyIFRlcnJhaW5Nb2RlbCA9IHJlcXVpcmUoXCIuL01vZGVscy9UZXJyYWluTW9kZWwuanNcIik7XHJcblx0dmFyIEJhY2tncm91bmRNb2RlbDsgLy8gU3BsaXQgaW4gdHdvIGxhdGVyPyAoVG93IGJhY2tncm91bmQgbW9vdmluZyBhdCB0aGUgZGlmZmVyZW50IHNwZWVkIG1heSBnaXZlIG1vcmUgZGVwdGgpXHJcblx0dmFyIEhVRE1vZGVsOyAvLyBIZWFkcy1VcCBEaXNwbGF5IFxyXG5cdHZhciBFbmVteU1vZGVsO1xyXG5cdHZhciBBc3NldE1vZGVsID0gcmVxdWlyZShcIi4vTW9kZWxzL0Fzc2V0TW9kZWwuanNcIik7IFxyXG5cdHZhciBDYW1lcmFNb2RlbCA9IHJlcXVpcmUoXCIuL01vZGVscy9DYW1lcmFNb2RlbC5qc1wiKTsgXHJcblx0dmFyIFdvcmxkTW9kZWwgPSByZXF1aXJlKFwiLi9Nb2RlbHMvV29ybGRNb2RlbC5qc1wiKTsgXHJcblxyXG5cdHZhciBXb3JsZENvbnRyb2xsZXIgPSByZXF1aXJlKFwiLi9Db250cm9sbGVycy9Xb3JsZENvbnRyb2xsZXIuanNcIik7IFxyXG5cdHZhciBHYW1lQ29udHJvbGxlciA9IHJlcXVpcmUoXCIuL0NvbnRyb2xsZXJzL0dhbWVDb250cm9sbGVyLmpzXCIpOyBcclxuXHR2YXIgQ2FtZXJhQ29udHJvbGxlciA9IHJlcXVpcmUoXCIuL0NvbnRyb2xsZXJzL0NhbWVyYUNvbnRyb2xsZXIuanNcIik7IFxyXG5cdHZhciBXb3JsZEdlbmVyYXRpb25Db250cm9sbGVyO1xyXG5cdHZhciBQaHlzaWNzQ29udHJvbGxlcjtcclxuXHR2YXIgUGxheWVyQ29udHJvbGxlciA9IHJlcXVpcmUoXCIuL0NvbnRyb2xsZXJzL1BsYXllckNvbnRyb2xsZXIuanNcIik7IFxyXG5cdHZhciBFbmVteUNvbnRyb2xsZXIgPSByZXF1aXJlKFwiLi9Db250cm9sbGVycy9FbmVteUNvbnRyb2xsZXIuanNcIik7XHJcblx0dmFyIFRlcnJhaW5Db250cm9sbGVyID0gcmVxdWlyZShcIi4vQ29udHJvbGxlcnMvVGVycmFpbkNvbnRyb2xsZXIuanNcIik7IFxyXG5cdHZhciBBc3NldENvbnRyb2xsZXIgPSByZXF1aXJlKFwiLi9Db250cm9sbGVycy9Bc3NldENvbnRyb2xsZXIuanNcIik7IFxyXG5cdHZhciBLZXlib2FyZENvbnRyb2xsZXIgPSByZXF1aXJlKFwiLi9Db250cm9sbGVycy9LZXlib2FyZENvbnRyb2xsZXIuanNcIik7IFxyXG5cdHZhciBJbml0Q29udHJvbGxlciA9IHJlcXVpcmUoXCIuL0NvbnRyb2xsZXJzL0luaXRDb250cm9sbGVyLmpzXCIpOyBcclxuXHR2YXIgVGVzdENvbnRyb2xsZXIgPSByZXF1aXJlKFwiLi9Db250cm9sbGVycy9UZXN0Q29udHJvbGxlci5qc1wiKTsgXHJcblx0XHJcblxyXG5cdC8vIEdhbWUgaW5pdGlhdGlvbiBzZWN0aW9uOiA+Pj5cclxuXHRcclxuXHRcdFxyXG5cdHZhciBsb2FkX2dhbWUgPSBmdW5jdGlvbihtb2RlKVxyXG5cdHtcclxuXHJcblx0XHRJbml0Q29udHJvbGxlci5pbml0KG1vZGUpOyAvLyBpbml0IGFsbCB0aGUgc3R1ZmZcclxuXHJcblx0XHRpZihtb2RlID09IFwidGVzdFwiKXtcclxuXHRcdFx0VGVzdENvbnRyb2xsZXIudGVzdCgpO1xyXG5cdFx0fVxyXG5cdH07XHJcblxyXG5cclxuXHR2YXIgcnVuID0gZnVuY3Rpb24obW9kZSlcclxuXHR7XHJcblx0XHQvLyBkb25lIHRoaXMgd2F5IHRvIGVuc3VyZSB0aGF0IGxvYWRfZ2FtZSdzIGludGVybmFscyBhcmVuJ3QgYWNjZXNzaWJsZSB0byB0aGUgd29ybGQ6XHJcblx0XHRsb2FkX2dhbWUobW9kZSk7XHJcblx0fTsgXHJcblx0XHJcblx0cmV0dXJuIHtcclxuXHRcdHJ1bjogcnVuXHJcblx0fTsgLy8gZXhwb3NlIGZ1bmN0aW9uIHJ1biB0byB0aGUgd29ybGRcclxuXHJcbn0pKCk7IFxyXG4iXX0=
