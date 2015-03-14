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

	var init = function(){
		include();	
		
	};

	return {
		init: init, 
		test: test,
		post_loading_test: post_loading_test,
	}
})();

module.exports = TestController;

var Includes = require("../Includes.js"); var include_data = Includes.get_include_data({
	current_module: "TestController", 
	include_options: Includes.choices.DEFAULT
}); eval(include_data.name_statements); var include = function(){eval(include_data.module_statements);}

