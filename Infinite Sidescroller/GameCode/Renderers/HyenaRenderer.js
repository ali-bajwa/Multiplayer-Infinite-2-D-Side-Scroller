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
			"images": [get_asset("HyenaSprite")],
			"frames": { "regX": 0, "regY": 8, "height": 64, "width": 64, "count": 17},
			"animations": {
				"run": [0,3, "run", 0.5],
				"stand": [4,5, "stand", 0.5],
				"walk": [8,11, "walk", 0.5],
				"leap": [6],
				"fall": [7],
				"death": [12,14, "decay", 0.25],
				"decay": [15,16, "decay", 0.25],
			}
		})

	};

	var register = function(entity_Hyena){
		/* is run for every entity of this type that was just created and should
		get graphics representation. You are given the entity instance and is supposed
		to create graphics instance, and GraphicsController.reg_for_render(graphics_instance, entity_instance); it 
		*/

		Hyena_animation = GraphicsController.request_animated(spritesheets["Hyena"], "walk");
		GraphicsController.set_reg_position(Hyena_animation, 0, 0); // change that to adjust sprite position relative to the body
		GraphicsController.reg_for_render(Hyena_animation, entity_Hyena); // sets hyena_animation's position to track the hyena's position (updates each tick)

		
	};

	var render = function(hyena){
		/* 	is run each tick from GraphicsController, for every registered object of this type
			is given >graphics_instance< parameter, which is also supposed to contain
			physical_instance property containing entity_instance, if it was attached correctly
		*/

		hyena_animate(hyena); 
	};

	var hyena_animate = function(hyena){
		//set graphical representation based on the animation variable determined by the AI
		if(hyena.physical_instance.needs_graphics_update){
			var animation = hyena.physical_instance.animation;
			play_animation(hyena,animation);
		}
	};
	
	var play_animation = function(hyena,animation){
		if (hyena.physical_instance.direction){ //if direction == right, flip right
			hyena.scaleX = -1;
		}else{ //else flip left
			hyena.scaleX = 1;
		}
		//play animation
		hyena.gotoAndPlay(animation)
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
