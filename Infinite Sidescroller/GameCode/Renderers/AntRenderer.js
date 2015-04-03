var AntRenderer = (function(){
	// TODO: mechanism for easy finding of new ants to render

	var spritesheets = {};
	var ant_animation;

	var init = function(InitGraphics){
		/**
		* will be called once when game is loaded from the GraphicsController.init
		* initialize you animation definitions and other stuff here
		* >InitGraphics< contains graphics functions needed (and available) during initialization
		*/
		var get_asset = InitGraphics.get_asset;

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
	
	var register = function(physical_instance, Graphics){
		/**
		* this is called when new ant is first registered in graphics controller
		* you are responsible for registering it for rendering etc.
		* >Graphics< object gives you access to various functions and modules you are
		* allowed to use
		*/
		ant_animation = Graphics.request_animated(spritesheets["ant"], "walk");
		Graphics.set_reg_position(ant_animation, 0, 0); // change that to adjust sprite position relative to the body
		Graphics.reg_for_render(ant_animation, physical_instance); // sets ant_animation's position to track the ant's position (updates each tick)

	};
	

	var render = function(ant, Graphics){
		/**
		* takes >ant< (the ant object) and 
		* >Graphics< which is an object containing various functions/objects
		* passed from the GraphicsController to allow you to properly render the ant
		* will be called each tick
		*/

		// TEMPORARY needs to change to some sort of 
		// spawning notification system which is general 
		// idea: check for type and call function withing individual RENDERER
		// to create needed animation
		
		ant_special_render_temp(ant, Graphics); 
		console.log(ant);
		

	};
	
	var ant_special_render_temp = function(ant, Graphics){
		/* how to handle special render? TEMPORARY */

		console.log(ant);
		if(ant.AI_state == "death"){
			ant.gotoAndPlay("death");
			
		}

		if(ant.AI_state == "upside_down")
		{
			ant.gotoAndPlay("upside-down");
			
		}

		

	};

	return {
		init: init, 
		render: render,
		register: register
	};
})();

module.exports = AntRenderer;
