
var GraphicsController = (function(){
	/* all the graphics stuff. and what did you expect?
	*/

	var get_asset; 
	var hero, ant; // for quicker access
	var type_renerer_table;
	var Graphics;

	var init = function(){
		/* is ran from the InitController once when the game is loaded */
		include(); // satisfy requirements

		type_renderer_table = {
		// type:	renderer:
			"ant": AntRenderer,
			"hero": HeroRenderer,
			"terrain_cell": TerrainCellRenderer,
		};

		get_asset = AssetController.get_asset; // for quicker access

		init_animations();


		GraphicsModel.stage = new createjs.Stage(Config.MAIN_CANVAS_NAME);
		GraphicsModel.stage.canvas.width = Config.SCREEN_W;
		GraphicsModel.stage.canvas.height = Config.SCREEN_H;

		
		
		//GraphicsModel.camera.following = hero;
        //PIZZAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
		GraphicsModel.score = new createjs.Text();
		reg_for_render(GraphicsModel.score);
		GraphicsModel.health = new createjs.Text();
		reg_for_render(GraphicsModel.health);
		hud_temp();

		// init all renderers
		for(type in type_renderer_table){
			type_renderer_table[type].init();
		}
	};
    
	var update = function(delta){
		/* is ran each tick from the GameController.update_all */

	    update_camera(); // needs to be updated first

		register_new_stuff();

		check_for_new_terrain();

		render_things();
		synchronize_to_physical_bodies();

	    //PIZZAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
		hud_temp_update();

		// <<<<
		//update_health(hero.hp);
		GraphicsModel.stage.update();
	};

	var register_new_stuff = function(){
		/**
		* description
		*/

		// retrieve instances of physical things that do not have graphics yet
		var new_stuff = RegisterAsController.retrieve_registered_as("awaiting_graphics_initialization");

		var length = new_stuff.length
		for(var i = 0; i < length; i++){
			var new_obj = new_stuff.pop();
			if(type_renderer_table[new_obj.type]){
				// if renderer exists for this type, register through it
				type_renderer_table[new_obj.type].register(new_obj, Graphics);	

				
			}else{
				console.log(new_obj);
				
				throw "No renderer found for the type " + String(new_obj.type) +
					" confirm that renderer exists and is added to the GraphicsController.type_renderer_table"
			}
		}

	};
	
	var render_things = function(){
		/**
		* call renderers for everything
		*/
		
		var to_render = GraphicsModel.special_render;

		for(var type in to_render){

			var table = to_render[type];
			var renderer = type_renderer_table[type];

			for(var id in table){
				renderer.render(table[id]);
			}

		}
		
	};
	

    //DELETE ME PIZZAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
	var hud_temp = function () {
	    GraphicsModel.health.text = "100";
	    GraphicsModel.health.x = 10;
	    GraphicsModel.health.y = 30;
	    GraphicsModel.health.font = "20px Arial";
	    GraphicsModel.health.color = "#ff0000";
	    GraphicsModel.score.text = "10";
	    GraphicsModel.score.x = 10;
	    GraphicsModel.score.y = 10;
	    GraphicsModel.score.font = "20px Arial";
	}

    //DELETE ME PIZZAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
	var hud_temp_update = function () {
	    temp_score = parseInt(GraphicsModel.score.text);
	    temp_score += 1;
	    GraphicsModel.score.text = temp_score.toString();
	}
	
	var update_health = function(passed) {
	
	GraphicsModel.health.text = passed;
	//console.log("I've been called");
	}

	var update_camera = function(){
		var camera = GraphicsModel.camera;
		var center = camera.center;

		center.x = Config.SCREEN_W/2 - camera.offset_from_followed.x;
		center.y = Config.SCREEN_H/2 - camera.offset_from_followed.y;

		if(camera.following != null){
			camera.offset.x = center.x - camera.following.physical_instance.body.GetWorldCenter().x * Config.B2D.SCALE;
			camera.offset.y =  center.y - camera.following.physical_instance.body.GetWorldCenter().y * Config.B2D.SCALE;
		}

		adjust_debug_draw(); // goes last
	};

	


	//*************************************
	var adjust_debug_draw = function(){
		var camera = GraphicsModel.camera;
		TestController.set_debug_offset(camera.offset.x, camera.offset.y);
	};

	var init_animations = function(){
		
		
	};
	
	var request_bitmap = function(id){
		// if id is invalid, throw meaningful exception?
		var bitmap = new createjs.Bitmap(get_asset(id));
		// more complicated setting for registration position may be needed, depending on the body attached
		if (!(bitmap.image)){
			throw "Error: image wasn't correctly loaded for this bitmap";
		}
		
		bitmap.regX = bitmap.image.width/2;
		bitmap.regY = bitmap.image.height/2;

		return bitmap;
		// TODO research DisplayObject's caching. and maybe incorporate
	};

	var request_animated = function(id, start_frame){
		// this implementation is temporary
		// until I setup efficient facility for defining spritesheets
		// within GraphicsController

		if(!id || !start_frame){
			if(!id){
				throw "wrong id";
			}else{
				throw "wrong start_frame";
			}
		};

		var sprite = new createjs.Sprite(id, start_frame);

		return sprite;
	};

	
	
	var synchronize_to_physical_bodies = function(){

		var tiles = GraphicsModel.all_physical;

		for(var id in tiles){
			var tile = tiles[id];
			var body = tile.physical_instance.body;

			var tile_pos = trans_xy(body.GetWorldCenter());

			tile.x = tile_pos.x;
			tile.y = tile_pos.y;
		}

	};
	

	var check_for_new_terrain = function(){
		/* If new terrain has been generated, render it
		 */

		var new_slices = TerrainController.GetNewTerrainSlices();
		while(new_slices.length > 0){

			var slice = new_slices.pop();

			for(var i = 0; i < slice.grid_rows; i++){
				/* graphics pass. should be probably moved to the graphics controller
				 * didn't decide on it yet
				 */


				var lvl = slice.grid_rows - i; // level from the bottom

				for(var j = 0; j < slice.grid_columns; j++){
					var id = slice.grid[i][j].id;
					if(id != 0){
						// TODO: should make proper terrain collection thing to pull from 
						var tile_texture = ["grass", "middle_terrain", "bottom_terrain"][id-1];
						var tile = request_bitmap(tile_texture);
						var physical_instance = slice.grid[i][j];
						var body_position = physical_instance.body.GetWorldCenter();
						var trans_pos = trans_xy(body_position);
						tile.x = trans_pos.x;
						tile.y = trans_pos.y;
						reg_for_render(tile, physical_instance);
					} // fi


				} // end for

			}//end for

		} // end while

	}; // end check_for_new_terrain

	var trans_xy = function(position_vector_unscaled){
		// takes position vector with values in meters, translates
		// it to pixel position taking the camera position into account
		var camera = GraphicsModel.camera;

		var x = (position_vector_unscaled.x * Config.B2D.SCALE) + camera.offset.x;
		var y = (position_vector_unscaled.y * Config.B2D.SCALE) + camera.offset.y;

		return {x: x, y: y};	
	};

	var set_reg_position = function(easeljs_obj, offset_x, offset_y){
		// sets registration position of the easeljs object
		// regisration position is the relative point of the object
		// that you move when you set object's x and y coordinats
		// i.e. if reg. position of the player is head, and you set their
		// position to (0, 0), their head will be at (0, 0)
		// currently the registration position is set to the middle of the body
		// to match what box2d does
		// last two arguments are optional and set PIXEL offset from the normal registration
		// position
		
		// this if statement should be temporary
		if(easeljs_obj.image){
			var w = easeljs_obj.image.width;	
			var h = easeljs_obj.image.height;	
		}else{
			var w = easeljs_obj.spriteSheet._frameWidth;
			var h = easeljs_obj.spriteSheet._frameHeight;
		};

		var offset_x = offset_x || 0;
		var offset_y = offset_y || 0;

		easeljs_obj.regX = w/2 + offset_x;
		easeljs_obj.regY = h/2 + offset_y;

	};

	var reg_for_render = function(easeljs_obj, physical_instance){
		// registeres object for rendering within graphics controller
		// if (OPTIONAL!) physical_instance is given, graphics controller will automatically
		// set the easeljs_obj's position to position of that body, each tick.
		// if the type of the physical instance is associated with some renderer
			
		
		if(physical_instance){
			var id = physical_instance.id;
			var type = physical_instance.type;

			if(id == null || type == null){
				console.log(physical_instance);
				throw "Id or type is undefined for this physical instance";
			}

			easeljs_obj.physical_instance = physical_instance;
			GraphicsModel.all_physical[id] = easeljs_obj;

			if(!GraphicsModel.special_render[type]){
				GraphicsModel.special_render[type] = {};
			}

			GraphicsModel.special_render[type][id] = easeljs_obj;
		}


		AddToStage(easeljs_obj);
	};

	var AddToStage = function(element){
		// can be updated later to manage z-index or whatever
		GraphicsModel.stage.addChild(element);
	};

	var get_stage = function(){
		return GraphicsModel.stage;
	};
	
	var destroy_graphics_for = function(id){
		/**
		* remove from the stage and destroy graphics instances for the object with the given id
		* this includes removing all references to it.
		* TODO: IMPORTANT!!! if GraphicsController was updated to store more
		* references to some graphics instances, UPDATE this function to reflect changes
		* even a single reference to the object may cause it to stay in memory
		*/

		if(GraphicsModel.all_physical[id] != null){
			var graphics_instance = GraphicsModel.all_physical[id];
		}else{
			// if you encounter this exception, maybe implementation changed. 
			// If that's the case, some things need rewriting. This function in
			// prticular. Or maybe there is a bug.
			throw "The graphics object with id " + String(id) + " isn't registered as having physical body";
		}

		if(graphics_instance.physical_instance.type != null){
			var type = graphics_instance.physical_instance.type;

		}else{
			// if you encounter this exception it may mean a bug, or alternatively
			// it may mean that implementation changed and this function needs an update
			throw "Physical instance with id " + String(id) + " doesn't seem to have a type";
		}

		
		
		// remove from the stage 
		
			/* graphics_instance.removeAllEventListeners(); 
			   could be necessary to remove attached event listeners, but it seems, at least
			   so far, that this stuff is done automatically be easeljs */

			GraphicsModel.stage.removeChild(graphics_instance);

		// remove from all_physical (responsible tracking for body position)
			delete GraphicsModel.all_physical[id];
		// remove from special_render
			delete GraphicsModel.special_render[type][id];
		// TODO: remove camera reference if following this object
			
	};

	return {
		// declare public
		init: init, 
		update: update,
		get_stage: get_stage,
		update_health: update_health,
		get_asset: get_asset,
		reg_for_render: reg_for_render,
		set_reg_position: set_reg_position,
		request_bitmap: request_bitmap,
		request_animated: request_animated,
		destroy_graphics_for: destroy_graphics_for,
	};
})();

module.exports = GraphicsController;

var Includes = require("../Includes.js"); var include_data = Includes.get_include_data({
	current_module: "GraphicsController", 
	include_options: Includes.choices.DEFAULT | Includes.choices.RENDERERS
}); eval(include_data.name_statements); var include = function(){eval(include_data.module_statements);}

