var TerrainSliceRenderer = (function(){

	var spritesheets = {}; // to store spritesheets used by this entity

	var init = function(){
		/* is ran from GraphicsController.init once during game loading
			use this function to create spritesheets and such
			like spritesheets.first = new createjs.Spritesheet(...);
		*/
		include(); // satisfy requirements, GOES FIRST

	};

	var register = function(slice, PrivateGraphics){
		/* is ran for every entity of this type that was just created and should
		get graphics representation. You are given the entity instance and is supposed
		to crete graphics instance, and GraphicsController.reg_for_render(graphics_instance, entity_instance); it 
		*/

		// TODO: change that private crap to smth more useful
		// like make graphics controller special case in includes,
		// so that only interested people can get it
		var request_animated = PrivateGraphics.request_animated;
		var request_bitmap = PrivateGraphics.request_bitmap;
		var trans_xy = PrivateGraphics.trans_xy;
		var reg_for_render = PrivateGraphics.reg_for_render;

		for(var i = 0; i < slice.grid_rows; i++){
				for(var j = 0; j < slice.grid_columns; j++){
					var kind = slice.grid[i][j].kind;
					if(kind != 0){
						// TODO: should make proper terrain collection thing to pull from
						/*
						var tile_texture = ["grass", "middle_terrain", "bottom_terrain"][kind-1];
						var tile = request_bitmap(tile_texture);
						*/
						var surface_textures = ["grass_winter","grass_spring","grass_summer","grass_fall"];
						var position = slice.grid[i][j].position;
						if (kind == 1){ //if tile is part of the ground
							switch (position){
									case "surface":
										var tile_texture = surface_textures[BackgroundController.get_season()];
									break;
								case "underground":
									var tile_texture = "bottom_terrain";
									break;
							}
						}
						if (kind == 2){ //if tile is part of a platform
							switch (position){
								case "left":
									var tile_texture = "left_platform";;
									break;
								case "middle":
									var tile_texture = "middle_platform";
									break;
								case "right":
									var tile_texture = "right_platform";
									break;
							}
						}
						if (kind == 3){//if tile is actually just spikes
							var tile_texture = "platform_spikes";
						}
						var tile = request_bitmap(tile_texture);
						var physical_instance = slice.grid[i][j];
						var body_position = physical_instance.body.GetWorldCenter();
						var trans_pos = trans_xy(body_position);
						tile.x = trans_pos.x;
						tile.y = trans_pos.y;
						reg_for_render(tile, physical_instance);
					} // end tile_texture assignment
				} // end for
			}//end for
		
	};

	var render = function(slice){
		/* 	is ran each tick from GraphicsController, for every registered object of this type
			is given >graphics_instance< parameter, which is also supposed to contain
			physical_instance property containing entity_instance, if it was attched correctly
		*/

	};

	return {
		// declare public
		init: init, 
		register: register,
		render: render,
	};
})();

module.exports = TerrainSliceRenderer;

var Includes = require("../Includes.js"); var include_data = Includes.get_include_data({
	current_module: "TerrainSliceRenderer", 
	include_options: Includes.choices.RENDERER_SPECIFIC
}); eval(include_data.name_statements); var include = function(){eval(include_data.module_statements);}

