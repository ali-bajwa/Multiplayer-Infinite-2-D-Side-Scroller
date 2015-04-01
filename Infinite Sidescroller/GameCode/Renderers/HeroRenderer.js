var HeroRenderer = (function(){
	// TODO: mechanism for easy finding of new ants to render

	var spritesheets = {};

	var init = function(InitGraphics){
		/**
		* will be called once when game is loaded from the GraphicsController.init
		* initialize you animation definitions and other stuff here
		* >InitGraphics< contains graphics functions needed (and available) during initialization
		*/
		var get_asset = InitGraphics.get_asset;

	};
	
	var register = function(physical_instance, Graphics){
		/**
		* description
		*/

		var hero = Graphics.request_bitmap("greek_warrior");

		Graphics.set_reg_position(hero, -20, +10);
		Graphics.reg_for_render(hero, physical_instance);

	};
	

	var render = function(hero, Graphics){
		
	};
	

	return {
		init: init, 
		render: render,
		register: register
	};
})();

module.exports = HeroRenderer;
