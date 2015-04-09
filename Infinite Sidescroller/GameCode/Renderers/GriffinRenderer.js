var GriffinRenderer = (function(){

	var spritesheets = {};
	var Griffin_animation;

	var init = function(){
		/* is ran from GraphicsController.init once during game loading
		 	use this function to create spritesheets and such
			like spritesheets.first = new createjs.Spritesheet(...);
		*/

		include(); // satisfy requirements, GOES FIRST
		var get_asset = AssetController.get_asset;

		spritesheets["Griffin"] = new createjs.SpriteSheet({
			"framerate": 1,
			"images": [get_asset("Griffin")],
			"frames": { "regX": 10, "regY": 28, "height": 413, "width": 420, "count": 3},
			"animations": {
				"walk": [0, 1, 2, "walk"],
				//"death": [4, 5, "death"]
			}
		})

	};

	var register = function(entity_Griffin){
		/* is ran for every entity of this type that was just created and should
		get graphics representation. You are given the entity instance and is supposed
		to crete graphics instance, and GraphicsController.reg_for_render(graphics_instance, entity_instance); it 
		*/

		Griffin_animation = GraphicsController.request_animated(spritesheets["Griffin"], "walk");
		GraphicsController.set_reg_position(Griffin_animation, 0, 0); // change that to adjust sprite position relative to the body
		GraphicsController.reg_for_render(Griffin_animation, entity_Griffin); // sets griffin_animation's position to track the griffin's position (updates each tick)

		
	};

	var render = function(Griffin){
		/* 	is ran each tick from GraphicsController, for every registered object of this type
			is given >graphics_instance< parameter, which is also supposed to contain
			physical_instance property containing entity_instance, if it was attched correctly
		*/

		Griffin_special_render_temp(Griffin); 
	};

	var Griffin_special_render_temp = function(Griffin){
		/* how to handle special render? TEMPORARY */

		
		if(Griffin.physical_instance.AI_state == "death"&& Griffin.physical_instance.aliveflag){
			Griffin.gotoAndPlay("death");
			Griffin.physical_instance.aliveflag = false;
			
			
		}

		//if(Griffin.physical_instance.AI_state == "upside_down" && Griffin.physical_instance.unhurtflag)
		//{
		//	Griffin.gotoAndPlay("upside_down");
		//	Griffin.physical_instance.unhurtflag = false;
			
			
		//}

	};

	return {
		// declare public
		init: init, 
		register: register,
		render: render,
	};
})();

module.exports = GriffinRenderer;

var Includes = require("../Includes.js"); var include_data = Includes.get_include_data({
	current_module: "GriffinRenderer", 
	include_options: Includes.choices.RENDERER_SPECIFIC
}); eval(include_data.name_statements); var include = function(){eval(include_data.module_statements);}
