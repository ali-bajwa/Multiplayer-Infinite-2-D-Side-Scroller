var TestController = (function(){
	// placeholder for implementing testing
	// may be changed/removed/upgraded depending on how we will handle our tests
	
	
	var preinit_tests = function(){
	//For tests requiring run before init is called
	
	
	};
	
	
	var test = function(){
		// if you need some sort of tests launched, this is one of the places to do it
		QUnit.test( "hello test", function( assert ) {
			assert.ok( 1 == "1", "Passed!" );
		});
		Includes.automated_tests();
	};

	var post_loading_tests = function(){
		// TODO: call when loading assets is completed if there are some tests that need
		// to be done at that moment. (Refer to InitController.init and 
		// InitController.setup_asset_dependent methods
	};

	var init = function(mode){
		include();
		// Sets up the debug canvas during testing
		PhysicsModel.d_canvas = document.getElementById(Config.DEBUG_CANVAS_NAME);

		if(mode == "test"){
			PhysicsModel.context = PhysicsModel.d_canvas.getContext("2d");
			
			PhysicsModel.debugDraw = new B2d.b2DebugDraw();
			PhysicsModel.debugDraw.SetSprite(PhysicsModel.context);
			PhysicsModel.debugDraw.SetDrawScale(PhysicsModel.scale);
			PhysicsModel.debugDraw.SetFillAlpha(0.3);
			PhysicsModel.debugDraw.SetLineThickness(1.0);
			PhysicsModel.debugDraw.SetFlags(B2d.b2DebugDraw.e_shapeBit | B2d.b2DebugDraw.e_jointBit);
			PhysicsModel.world.SetDebugDraw(PhysicsModel.debugDraw);

			Config.B2D.debug_draw = true;

			PhysicsModel.d_canvas.width = Config.SCREEN_W;
			PhysicsModel.d_canvas.height = Config.SCREEN_H;
			

			//$('#'+Config.DEBUG_CANVAS_NAME).show();

		}else{
			//d_canvas.hide();
		}
	};
	
	//this function sets the x and y offsets of the debug canvas
	var set_debug_offset = function(x_offset, y_offset){
		TestModel.context.translate(x_offset, y_offset);
	};

	return {
		init: init, 
		test: test,
		post_loading_tests: post_loading_tests,
		preinit_tests: preinit_tests,
		set_debug_offset: set_debug_offset
	}
})();

module.exports = TestController;

var Includes = require("../Includes.js"); var include_data = Includes.get_include_data({
	current_module: "TestController", 
	include_options: Includes.choices.DEFAULT
}); eval(include_data.name_statements); var include = function(){eval(include_data.module_statements);}

