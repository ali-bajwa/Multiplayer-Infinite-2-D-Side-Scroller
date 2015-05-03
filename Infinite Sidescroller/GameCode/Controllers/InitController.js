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
		

	var init = function(mode, session_id, player_id, player_id_array){
		include();

		Config.Init.mode = mode;
		Config.Init.session_id = session_id;
		Config.Init.player_id = player_id;
		Config.Init.player_id_array = player_id_array;

		enable_arrowkey_scroll(false);
		setup_screen();
		setup_events();

		init_all_modules(mode); // call .init function of everyone. e.g. PlayerController.init(); etc.

		
		// Notice that asset dependent stuff doesn't (and mustn't) start until
		// all assets are completely loaded. That includes ticker, i.e. no ticks are processed
		// until everything is loaded. If you want something different, e.g. display some sort of loading
		// animation - let me know.
		// Look into the setup_asset_dependent function
			AssetModel.loader = new createjs.LoadQueue(false); // loading resourses using preload.js
			AssetModel.loader.addEventListener("complete", setup_asset_dependent);

		// if more stuff needs to be done for the test mode, 
		// or more types of it needs to be added
		// you can safely make the following a separate function
			var asset_path = (mode == "test") ? "./assets/art/" : "../GameCode/assets/art/";

		AssetController.init(asset_path);


	};

	var init_all_modules = function(mode){
		// TODO: better way to do stuff like that (call certain function
		// of every module in the order. 
		// Also, init and update functions of each module should probably
		// accept some argument. I think to make this argument an object,
		// this way we can add more things to be passed w/o any problem and
		// we won't need to change anything
		
		B2d.init(); // goes first
		IdentificationController.init();
		RegisterAsController.init();

		//AssetController.init(); // called from the InitController.init// stuff has to change
		GameController.init();
		KeyboardController.init();
		PhysicsController.init();

		TestController.init(mode);
		

		//PlayerController.init();
		TerrainController.init();
		TerrainSliceController.init();
		WorldController.init();
		



		// WARNING!!! GraphicsController.init is called from the
		// setup_asset_dependent function as it, well, depends on assets being loaded

	};


	var enable_arrowkey_scroll = function(enable_scroll){
		if(enable_scroll == false){                                                          
			document.addEventListener('keydown', function(e){ // .getElementById("display_canvas")
				arrows = [37, 38, 39, 40];                                          
				if(arrows.indexOf(e.keyCode) > -1){                                 
					e.preventDefault();                                             
					return false;                                                   
				}else{                                                              
					return true                                                     
				}                                                                   
			})                                                                      
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

	var setup_asset_dependent = function(){
		// this may need to move to either load_game or some sort of resizing function
		MultiplayerSyncController.init();
		
		
		NetworkController.init();
		EntityController.init();
		GraphicsController.init();
		//HUDController.init();
		//BackgroundController.init();

		
		setup_ticker();

		if(Config.Init.mode == "multiplayer" && Config.Init.player_id_array != null){
			NetworkController.start_multiplayer_session(Config.Init.player_id_array);
		}

		//TerrainController.generate_terrain(); // Initial terrain generation // deprecated, generation will be called from update each tick
	};


	return {
		init: init,
	};
})();

module.exports = InitController;

var Includes = require("../Includes.js"); var include_data = Includes.get_include_data({
	current_module: "InitController", 
	include_options: Includes.choices.ALL
}); eval(include_data.name_statements); var include = function(){eval(include_data.module_statements);}

