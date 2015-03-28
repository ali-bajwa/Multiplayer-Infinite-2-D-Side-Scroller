
var GraphicsController = (function(){
	/* all the graphics stuff. and what did you expect?
	*/

	var get_asset; 
	var hero, ant; // for quicker access

	var init = function(){
		/* is ran from the InitController once when the game is loaded */

		include(); // satisfy requirements

		get_asset = AssetController.get_asset; // for quicker access

		init_animations();


		GraphicsModel.stage = new createjs.Stage(Config.MAIN_CANVAS_NAME);
		GraphicsModel.stage.canvas.width = Config.SCREEN_W;
		GraphicsModel.stage.canvas.height = Config.SCREEN_H;

		GraphicsModel.hero = request_bitmap("greek_warrior");
		GraphicsModel.ant = request_animated("ant", "walk");

		hero = GraphicsModel.hero;

		ant = GraphicsModel.ant;
		ant.gotoAndPlay("walk");

		set_reg_position(hero, -20, +10);
		
		
		reg_for_render(GraphicsModel.hero, PlayerController.get_hero());

		
		GraphicsModel.camera.following = hero;
        //PIZZAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
		GraphicsModel.score = new createjs.Text();
		reg_for_render(GraphicsModel.score);
		GraphicsModel.health = new createjs.Text();
		reg_for_render(GraphicsModel.health);
		hud_temp();

	};
    
	var update = function(delta){
		/* is ran each tick from the GameController.update_all */

	    update_camera(); // needs to be updated first

		check_for_new_terrain();

		synchronize_to_physical_bodies();

	    //PIZZAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
		hud_temp_update();

		// TEMPORARY needs to change to some sort of 
		// spawning notification system which is general 
		// idea: check for type and call function withing individual RENDERER
		// to create needed animation
		var ants = AntController.get_new_ants();
		for(var i = 0; i < ants.length; i++){
			var ant = ants[i];
			var ant_animation = request_animated("ant", "walk");
			set_reg_position(ant_animation, 0, 0);
			reg_for_render(ant_animation, ant);
		}


		ant_special_render_temp(); // TEMPORARY!!!!!!!!!!!

		GraphicsModel.stage.update();
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
	console.log("I've been called");
	}

	var update_camera = function(){
		var camera = GraphicsModel.camera;
		var center = camera.center;

		center.x = Config.SCREEN_W/2 - camera.offset_from_followed.x;
		center.y = Config.SCREEN_H/2 - camera.offset_from_followed.y;

		if(camera.following != null){
			camera.offset.x = center.x - camera.following.body.GetWorldCenter().x * Config.B2D.SCALE;
			camera.offset.y =  center.y - camera.following.body.GetWorldCenter().y * Config.B2D.SCALE;
		}

		adjust_debug_draw(); // goes last
	};

	//**********TEMPORARY*****************
	var change_ant = function(state){
		if(state == "death")
		{	
			console.log("ANT GOES HERE")
			ant.gotoAndStop("death");
		}
		else if(state == "upside_down")
		{
			console.log("ANT GOES HERE")
			ant.gotoAndPlay("upside_down");
		}
		


	}	


	//*************************************
	var adjust_debug_draw = function(){
		var camera = GraphicsModel.camera;
		TestController.set_debug_offset(camera.offset.x, camera.offset.y);
	};

	var init_animations = function(){
		
		GraphicsModel.spritesheets["ant"] = new createjs.SpriteSheet({
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

		var sprite = new createjs.Sprite(GraphicsModel.spritesheets[id], start_frame);

		return sprite;
	};

	var ant_special_render_temp = function(){
		/* how to handle special render? TEMPORARY */


		//if(ant.body.userdata.state.ant == "death"){
		//	ant.gotoAndStop("death");
		//}

		//ant.gotoAndPlay("upside_down");

	};
	
	
	var synchronize_to_physical_bodies = function(){

		var tiles = GraphicsModel.all_physical;

		for(var i = 0; i < tiles.length; i++){
			var tile = tiles[i];
			var body = tile.body;

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
						var body = slice.grid[i][j].body;
						var body_position = body.GetWorldCenter();
						var trans_pos = trans_xy(body_position);
						tile.x = trans_pos.x;
						tile.y = trans_pos.y;
						reg_for_render(tile, body);
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

	var reg_for_render = function(easeljs_obj, physical_body){
		// registeres object for rendering within graphics controller
		// if (OPTIONAL!) physical_body is given, graphics controller will automatically
		// set the easeljs_obj's position to position of that body, each tick.
			
		if(physical_body){

			easeljs_obj.body = physical_body;
			GraphicsModel.all_physical.push(easeljs_obj);
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

	return {
		// declare public
		init: init, 
		update: update,
		get_stage: get_stage,
		change_ant: change_ant,
		update_health: update_health,
	};
})();

module.exports = GraphicsController;

var Includes = require("../Includes.js"); var include_data = Includes.get_include_data({
	current_module: "GraphicsController", 
	include_options: Includes.choices.DEFAULT
}); eval(include_data.name_statements); var include = function(){eval(include_data.module_statements);}

