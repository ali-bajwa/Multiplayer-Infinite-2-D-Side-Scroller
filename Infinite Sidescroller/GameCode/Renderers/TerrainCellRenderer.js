var TerrainCellRenderer = (function(){

	var spritesheets = {}; // to store spritesheets used by this entity

	var init = function(){
		/* is ran from GraphicsController.init once during game loading
			use this function to create spritesheets and such
			like spritesheets.first = new createjs.Spritesheet(...);
		*/
		include(); // satisfy requirements, GOES FIRST

	};

	var register = function(entity_cell){
		/* is ran for every entity of this type that was just created and should
		get graphics representation. You are given the entity instance and is supposed
		to crete graphics instance, and GraphicsController.reg_for_render(graphics_instance, entity_instance); it 
		*/

		
	};

	var render = function(cell){
		/* 	is ran each tick from GraphicsController, for every registered object of this type
			is given >graphics_instance< parameter, which is also supposed to contain
			physical_instance property containing entity_instance, if it was attched correctly
		*/

	};

	return {
		// declare public
		init: init, 
		register: register,
		render: render,
	};
})();

module.exports = TerrainCellRenderer;

var Includes = require("../Includes.js"); var include_data = Includes.get_include_data({
	current_module: "TerrainCellRenderer", 
	include_options: Includes.choices.RENDERER_SPECIFIC
}); eval(include_data.name_statements); var include = function(){eval(include_data.module_statements);}

