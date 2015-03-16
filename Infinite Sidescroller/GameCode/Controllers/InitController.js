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
		include();

		init_all_modules(); // call .init function of everyone. e.g. PlayerController.init(); etc.

		enable_arrowkey_scroll(false);
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

	};

	var init_all_modules = function(){
		// TODO: better way to do stuff like that (call certain function
		// of every module in the order. 
		// Also, init and update functions of each module should probably
		// accept some argument. I think to make this argument an object,
		// this way we can add more things to be passed w/o any problem and
		// we won't need to change anything
		
		B2d.init(); // goes first

		AssetController.init();
		CameraController.init();
		GameController.init();
		GraphicsController.init();
		KeyboardController.init();
		PhysicsController.init();
		PlayerController.init();
		TerrainController.init();
		TerrainSliceController.init();
		TestController.init();
		WorldController.init();

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

	var setup_debug_canvas = function(mode){
		// more stuff may be done later
		// should be refactored and prettyfied
		

		// does this way and not with jquery due to some strange bugs
		var d_canvas = document.getElementById(Config.DEBUG_CANVAS_NAME);
		var context = d_canvas.getContext("2d");

		if(mode == "test"){
			PhysicsModel.context = context;

			PhysicsModel.debugDraw = new B2d.b2DebugDraw();
			PhysicsModel.debugDraw.SetSprite(PhysicsModel.context);
			PhysicsModel.debugDraw.SetDrawScale(PhysicsModel.scale);
			PhysicsModel.debugDraw.SetFillAlpha(0.3);
			PhysicsModel.debugDraw.SetLineThickness(1.0);
			PhysicsModel.debugDraw.SetFlags(B2d.b2DebugDraw.e_shapeBit | B2d.b2DebugDraw.e_jointBit);
			PhysicsModel.world.SetDebugDraw(PhysicsModel.debugDraw);

			Config.B2D.debug_draw = true;

			d_canvas.width = Config.SCREEN_W;
			d_canvas.height = Config.SCREEN_H;

			//$('#'+Config.DEBUG_CANVAS_NAME).show();

		}else{
			//d_canvas.hide();
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

		// temporary/testing, do not try to understand numbers involved. I repeat, do not try to understand numbers;
		GameModel.hero.b2b = PhysicsController.get_rectangular_body(1.5, 2.5, 100/30 + (1.5/2), 510/30 - (2.5/2), true);

		GameModel.stage.addChild(GameModel.hero);

		setup_ticker();

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

