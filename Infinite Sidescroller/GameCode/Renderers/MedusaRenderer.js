var MedusaRenderer = (function(){

	var spritesheets = {};
	var Medusa_animation;

	var init = function(){
		/* is ran from GraphicsController.init once during game loading
		 	use this function to create spritesheets and such
			like spritesheets.first = new createjs.Spritesheet(...);
		*/

		include(); // satisfy requirements, GOES FIRST
		var get_asset = AssetController.get_asset;

		spritesheets["Medusa"] = new createjs.SpriteSheet({
			"framerate": 1,
			"images": [get_asset("Medusa1"),], //MedusaSpriteSheet
			"frames": { "regX": 0, "regY": 0, "height": 85, "width": 47.5, "count": 3},
				"animations": {
				"walk": [0, 2, "walk", 0.2],
				"injury": {
				    frames: [2, 3, .25]
				},
				"death": [2, 3, "death", 0.6],
                
			}
		})

	};

	var register = function(entity_Medusa){
		/* is ran for every entity of this type that was just created and should
		get graphics representation. You are given the entity instance and is supposed
		to crete graphics instance, and GraphicsController.reg_for_render(graphics_instance, entity_instance); it 
		*/

		Medusa_animation = GraphicsController.request_animated(spritesheets["Medusa"], "walk");
		GraphicsController.set_reg_position(Medusa_animation, 0, 0); // change that to adjust sprite position relative to the body
		GraphicsController.reg_for_render(Medusa_animation, entity_Medusa); // sets medusa_animation's position to track the medusa's position (updates each tick)

		
	};

	var render = function(Medusa){
		/* 	is ran each tick from GraphicsController, for every registered object of this type
			is given >graphics_instance< parameter, which is also supposed to contain
			physical_instance property containing entity_instance, if it was attched correctly
		*/

		Medusa_special_render_temp(Medusa); 
	};

	var Medusa_special_render_temp = function(Medusa){
		/* how to handle special render? TEMPORARY */

		//set graphical representation based on the animation variable determined by the AI
		//set animation
		if(Medusa.physical_instance.needs_graphics_update){
			var animation = Medusa.physical_instance.animation;
			Medusa.gotoAndPlay(animation)
		}
		
		//set direction
		if (Medusa.physical_instance.direction){ //if direction == right, flip right
			Medusa.scaleX = -1;
		}else{ //else flip left
			Medusa.scaleX = 1;
		}

		//set alpha if blinking
		if(Medusa.physical_instance.blinking && Medusa.physical_instance.blink_timer%2 == 1){
			Medusa.alpha = 0;
		}else{
			Medusa.alpha = 1;
		}
	};

	return {
		// declare public
		init: init, 
		register: register,
		render: render,
	};
})();

module.exports = MedusaRenderer;

var Includes = require("../Includes.js"); var include_data = Includes.get_include_data({
	current_module: "MedusaRenderer", 
	include_options: Includes.choices.RENDERER_SPECIFIC
}); eval(include_data.name_statements); var include = function(){eval(include_data.module_statements);}
