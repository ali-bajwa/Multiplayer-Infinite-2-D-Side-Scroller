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
				"stand": [4,5, "stand", 0.25],
				"walk": [8,11, "walk", 0.2],
				"leap": [6],
				"fall": [7],
				"death": [12,14, "decay", 0.25],
				"decay": [15,16, "decay", 0.25],
			}
		})

	};

	var register = function(entity_hyena){
		/* is run for every entity of this type that was just created and should
		get graphics representation. You are given the entity instance and is supposed
		to create graphics instance, and GraphicsController.reg_for_render(graphics_instance, entity_instance); it 
		*/

		hyena_animation = GraphicsController.request_animated(spritesheets["Hyena"], "walk");
		GraphicsController.set_reg_position(hyena_animation, 0, 0); // change that to adjust sprite position relative to the body
		GraphicsController.reg_for_render(hyena_animation, entity_hyena); // sets hyena_animation's position to track the hyena's position (updates each tick)
		/*
		hyena_animation is the easeljs_obj passed through graphicsController
		entity_hyena is the physical object spawned in HyenaLogic
		request_animated returns an easeljs object of type Sprite
		this Sprite is the object passed to render
		*/
		
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
		//set animation
		if(hyena.physical_instance.needs_graphics_update){
			var animation = hyena.physical_instance.animation;
			hyena.gotoAndPlay(animation)
		}
		
		//set direction
		if (hyena.physical_instance.direction){ //if direction == right, flip right
			hyena.scaleX = -1;
		}else{ //else flip left
			hyena.scaleX = 1;
		}

		//set alpha if blinking
		if(hyena.physical_instance.blinking && hyena.physical_instance.blink_timer%2 == 1){
			hyena.alpha = 0;
		}else{
			hyena.alpha = 1;
		}
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
