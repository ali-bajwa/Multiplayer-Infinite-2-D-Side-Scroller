var AntRenderer = (function(){
	// TODO: mechanism for easy finding of new ants to render

	var spritesheets = {};

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
	

	var render = function(ant, Graphics){
		/**
		* takes >ant< (the ant object) and 
		* >Graphics< which is an object containing various functions/objects
		* passed from the GraphicsController to allow you to properly render the ant
		* will be called each tick
		*/

		var
			request_animated = Graphics.request_animated,
			reg_for_render = Graphics.reg_for_render
			set_reg_position = Graphics.set_reg_position;

		// TEMPORARY needs to change to some sort of 
		// spawning notification system which is general 
		// idea: check for type and call function withing individual RENDERER
		// to create needed animation
		var ant_animation = request_animated(spritesheets["ant"], "walk");
		set_reg_position(ant_animation, 0, 0);
		reg_for_render(ant_animation, ant);

		ant_special_render_temp(); // TEMPORARY!!!!!!!!!!!

	};
	
	var ant_special_render_temp = function(){
		/* how to handle special render? TEMPORARY */


		//if(ant.body.userdata.state.ant == "death"){
		//	ant.gotoAndStop("death");
		//}

		//ant.gotoAndPlay("upside_down");

	};

	return {
		init: init, 
		render: render,
	};
})();

module.exports = AntRenderer;
