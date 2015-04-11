var HyenaRenderer = (function(){

	var spritesheets = {};
	var Hyena_animation;

	var init = function(){
		/* is ran from GraphicsController.init once during game loading
		 	use this function to create spritesheets and such
			like spritesheets.first = new createjs.Spritesheet(...);
		*/

		include(); // satisfy requirements, GOES FIRST
		var get_asset = AssetController.get_asset;

		spritesheets["Hyena"] = new createjs.SpriteSheet({
			"framerate": 1,
			"images": [get_asset("Hyena1"), get_asset("Hyena2"), get_asset("Hyena3") ],
			"frames": { "regX": 0, "regY": 16, "height": 128, "width": 128, "count": 4},
			"animations": {
				"walk": [0, 3, "walk", 0.5],
				//"death": [4, 5, "death"]
			}
		})

	};

	var register = function(entity_Hyena){
		/* is ran for every entity of this type that was just created and should
		get graphics representation. You are given the entity instance and is supposed
		to crete graphics instance, and GraphicsController.reg_for_render(graphics_instance, entity_instance); it 
		*/

		Hyena_animation = GraphicsController.request_animated(spritesheets["Hyena"], "walk");
		GraphicsController.set_reg_position(Hyena_animation, 0, 0); // change that to adjust sprite position relative to the body
		GraphicsController.reg_for_render(Hyena_animation, entity_Hyena); // sets hyena_animation's position to track the hyena's position (updates each tick)

		
	};

	var render = function(Hyena){
		/* 	is ran each tick from GraphicsController, for every registered object of this type
			is given >graphics_instance< parameter, which is also supposed to contain
			physical_instance property containing entity_instance, if it was attched correctly
		*/

		Hyena_special_render_temp(Hyena); 
	};

	var Hyena_special_render_temp = function(Hyena){
		/* how to handle special render? TEMPORARY */

		
		if(Hyena.physical_instance.AI_state == "death"&& Hyena.physical_instance.aliveflag){
			Hyena.gotoAndPlay("death");
			Hyena.physical_instance.aliveflag = false;
			
			
		}

		//if(Hyena.physical_instance.AI_state == "upside_down" && Hyena.physical_instance.unhurtflag)
		//{
		//	Hyena.gotoAndPlay("upside_down");
		//	Hyena.physical_instance.unhurtflag = false;
			
			
		//}

	};

	return {
		// declare public
		init: init, 
		register: register,
		render: render,
	};
})();

module.exports = HyenaRenderer;

var Includes = require("../Includes.js"); var include_data = Includes.get_include_data({
	current_module: "HyenaRenderer", 
	include_options: Includes.choices.RENDERER_SPECIFIC
}); eval(include_data.name_statements); var include = function(){eval(include_data.module_statements);}
