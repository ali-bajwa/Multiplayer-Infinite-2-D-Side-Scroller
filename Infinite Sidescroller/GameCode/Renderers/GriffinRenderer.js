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
			"images": [get_asset("Griffin1"), get_asset("Griffin2"), get_asset("Griffin3"), get_asset("GriffinDeath")], //, get_asset("GriffinDeath2"), get_asset("GriffinDeath3")
				"frames": { "regX": 5, "regY": 14, "height": 207, "width": 210, "count": 6},
				"animations": {
				"walk": [0, 2, "walk", 0.2],
				"decay": [2, 3, "decay", .25],
				"death": [3, 4, "death", 0.6],
                "fly": [1, 2, "fly", .4],
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
			console.log("I've been squashed!");
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
