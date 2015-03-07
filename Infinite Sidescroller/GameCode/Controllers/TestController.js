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
