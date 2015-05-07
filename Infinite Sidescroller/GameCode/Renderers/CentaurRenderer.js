var CentaurRenderer = (function(){

	var spritesheets = {};
	var Centaur_animation;

	var init = function(){
		/* is ran from GraphicsController.init once during game loading
		 	use this function to create spritesheets and such
			like spritesheets.first = new createjs.Spritesheet(...);
		*/

		include(); // satisfy requirements, GOES FIRST
		var get_asset = AssetController.get_asset;

		spritesheets["Centaur"] = new createjs.SpriteSheet({
			"framerate": 1,
			"images": [get_asset("Centaur1"),], //CentaurSpriteSheet
			"frames": { "regX": 0, "regY": 0, "height": 105, "width": 70.7, "count": 4},
				"animations": {
				"walk": [0, 3, "walk", 0.1],
				"injury": {
				    frames: [3, 4, .25]
				},
				"death": [3, 4, "death", 0.6],
                
			}
		})

	};

	var register = function(entity_Centaur){
		/* is ran for every entity of this type that was just created and should
		get graphics representation. You are given the entity instance and is supposed
		to crete graphics instance, and GraphicsController.reg_for_render(graphics_instance, entity_instance); it 
		*/

		Centaur_animation = GraphicsController.request_animated(spritesheets["Centaur"], "walk");
		GraphicsController.set_reg_position(Centaur_animation, 0, 0); // change that to adjust sprite position relative to the body
		GraphicsController.reg_for_render(Centaur_animation, entity_Centaur); // sets Centaur_animation's position to track the Centaur's position (updates each tick)

		
	};

	var render = function(Centaur){
		/* 	is ran each tick from GraphicsController, for every registered object of this type
			is given >graphics_instance< parameter, which is also supposed to contain
			physical_instance property containing entity_instance, if it was attched correctly
		*/

		Centaur_special_render_temp(Centaur); 
	};

	var Centaur_special_render_temp = function(Centaur){
		/* how to handle special render? TEMPORARY */

		//set graphical representation based on the animation variable determined by the AI
		//set animation
		if(Centaur.physical_instance.needs_graphics_update){
			var animation = Centaur.physical_instance.animation;
			Centaur.gotoAndPlay(animation)
		}
		
		//set direction
		if (Centaur.physical_instance.direction){ //if direction == right, flip right
			Centaur.scaleX = -1;
		}else{ //else flip left
			Centaur.scaleX = 1;
		}

		//set alpha if blinking
		if(Centaur.physical_instance.blinking && Centaur.physical_instance.blink_timer%2 == 1){
			Centaur.alpha = 0;
		}else{
			Centaur.alpha = 1;
		}
	};

	return {
		// declare public
		init: init, 
		register: register,
		render: render,
	};
})();

module.exports = CentaurRenderer;

var Includes = require("../Includes.js"); var include_data = Includes.get_include_data({
	current_module: "CentaurRenderer", 
	include_options: Includes.choices.RENDERER_SPECIFIC
}); eval(include_data.name_statements); var include = function(){eval(include_data.module_statements);}