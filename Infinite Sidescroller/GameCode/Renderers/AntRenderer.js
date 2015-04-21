var AntRenderer = (function(){

	var spritesheets = {};
	var ant_animation;

	var init = function(){
		/* is ran from GraphicsController.init once during game loading
		 	use this function to create spritesheets and such
			like spritesheets.first = new createjs.Spritesheet(...);
		*/

		include(); // satisfy requirements, GOES FIRST
		var get_asset = AssetController.get_asset;

		spritesheets["ant"] = new createjs.SpriteSheet({
			"framerate": 1,
			"images": [get_asset("Ant1"), get_asset("Ant2"), get_asset("Ant3")],
			"frames": { "regX": 3, "regY": 6, "height": 25, "width": 50, "count": 6},
			"animations": {
				"walk": [0, 1, "walk"],
				"upside_down": [2, 3, "upside_down"],
				"death": [4, 5, "death"]
			}
		})

	};

	var register = function(entity_ant){
		/* is ran for every entity of this type that was just created and should
		get graphics representation. You are given the entity instance and is supposed
		to crete graphics instance, and GraphicsController.reg_for_render(graphics_instance, entity_instance); it 
		*/

		ant_animation = GraphicsController.request_animated(spritesheets["ant"], "walk");
		GraphicsController.set_reg_position(ant_animation, 0, 0); // change that to adjust sprite position relative to the body
		GraphicsController.reg_for_render(ant_animation, entity_ant); // sets ant_animation's position to track the ant's position (updates each tick)

		
	};

	var render = function(ant){
		/* 	is ran each tick from GraphicsController, for every registered object of this type
			is given >graphics_instance< parameter, which is also supposed to contain
			physical_instance property containing entity_instance, if it was attched correctly
		*/

		ant_special_render_temp(ant); 
	};

	var ant_special_render_temp = function(ant){
		/* how to handle special render? TEMPORARY */

		
		if(ant.physical_instance.AI_state == "death"&& ant.physical_instance.aliveflag){
			ant.gotoAndPlay("death");
			ant.physical_instance.aliveflag = false;
			
			
		}

		if(ant.physical_instance.AI_state == "upside_down" && ant.physical_instance.unhurtflag)
		{
			ant.gotoAndPlay("upside_down");
			ant.physical_instance.unhurtflag = false;
			
			
		}
		if(ant.physical_instance.AI_state == "walk" && ant.physical_instance.start_walking)
		{
			ant.gotoAndPlay("walk");
			//ant.physical_instance.hp += 1;
			ant.physical_instance.start_walking = false;
			
			
		}

	};

	return {
		// declare public
		init: init, 
		register: register,
		render: render,
	};
})();

module.exports = AntRenderer;

var Includes = require("../Includes.js"); var include_data = Includes.get_include_data({
	current_module: "AntRenderer", 
	include_options: Includes.choices.RENDERER_SPECIFIC
}); eval(include_data.name_statements); var include = function(){eval(include_data.module_statements);}
