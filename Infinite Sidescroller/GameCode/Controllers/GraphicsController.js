/*
GraphicsController
	Public Functions:
	-init()
		sets up the GraphicsController for the rest of the game, called once during initialization
	-update(int delta)
		common function, called each tick. performs routine graphics maintenance
		registers all instances that were marked for registration since the last tick
		renders all registered instances
	-get_stage()
		returns the stage object, an easeljs object that stores information about the game
	-get_camera()
		returns the camera object, which controls the view offset
	-get_asset(string id)
		retrieves the asset with id; an alias for the same function in AssetController
	-reg_for_render(Easeljs_obj sprite, Object entity_instance)
		links an entity with a sprite and registers it to be rendered each tick
	-set_reg_position(easeljs_obj,int offset_x,int offset_y)
		adjusts a sprites x and y offsets to conform to the box2d system
	-request_bitmap(string? id)
		retrieves a previously loaded asset as a sprite
	-request_animated(string id, string||int start_animation/start_frame)
		returns a new sprite object generated from the image id and the start frame
	-destroy_graphics_for(int id)
		destroys the graphics objects associated with the instance of the passed id
	-follow(int id)
		sets the camera to follow the object of the passed id
	-get_movement_edge()
		returns left camera bound, a.k.a, the movement edge. used for lots of things
		
*/
var GraphicsController = (function(){
	/* 
	Controls all graphics and provides an interface for common easel.js functions
	*/
	
	var get_asset; 
	var type_renderer_table;
	var PrivateGraphics; 
	var reRender = false;

	var init = function(){
		/* is ran from the InitController once when the game is loaded */
		include(); // satisfy requirements

		//All renderers must be registered here
		//Links each renderer with its object id
		type_renderer_table = {
		// type:	renderer:
			"ant": AntRenderer,
			"hero": HeroRenderer,
			"Griffin": GriffinRenderer,
			"Medusa": MedusaRenderer,
            "Centaur": CentaurRenderer,
			"Hyena": HyenaRenderer,
			"terrain_cell": TerrainCellRenderer,
			"terrain_slice": TerrainSliceRenderer,
			"companion": EsteemedCompanionRenderer,
            "pizza": PizzaRenderer,
		};

		get_asset = AssetController.get_asset; // for quicker access

		GraphicsModel.stage = new createjs.Stage(Config.MAIN_CANVAS_NAME);
		GraphicsModel.stage.canvas.width = Config.SCREEN_W;
		GraphicsModel.stage.canvas.height = Config.SCREEN_H;
		
		GraphicsModel.camera.offset_from_followed.x -= (1614 - GraphicsModel.stage.canvas.width) / 3;

		// init all renderers
		for(type in type_renderer_table){
			type_renderer_table[type].init();
		}

		// this object is passed to all renderers to give them access to functions
		// that no one else is supposed to be able to access
		PrivateGraphics = {
			stage: GraphicsModel.stage,
			request_bitmap: request_bitmap,
			request_animated: request_animated,
			get_asset: get_asset,
			trans_xy: trans_xy,
			reg_for_render: reg_for_render,
		};

		BackgroundRenderer.init();
		HUDRenderer.init();

	};

    
	var update = function(delta){
		/* is ran each tick from the GameController.update_all */
		
		update_camera(); // needs to be updated first

		destroy_unneeded(); // goes second, do not update any stuff before unneeded stuff is removed

		register_new_stuff();

		render_things();
		
		synchronize_to_physical_bodies();

		BackgroundRenderer.render();
		
		HUDRenderer.render();
		
		GraphicsModel.stage.update();
	};

	var destroy_unneeded = function(){
		/**
		* destroy graphics for everything that was marked
		* for destruction
		*/

		var slices = RegisterAsController.retrieve_registered_as("removed_slice");

		var entities = RegisterAsController.retrieve_registered_as("removed_entity");

		while(slices.length > 0){
			var slice = slices.pop();
			var grid = slice.grid;

			for(var i = 0; i < grid.length; i++){
				var row = grid[i]; // or is it a column?

				for(var j = 0; j < row.length; j++){
					var cell = row[j];
					if(cell.kind != 0){
						destroy_graphics_for(cell.id);
					}
				}
			}
			
		}
		
		while(entities.length > 0){
			var entity = entities.pop();
			destroy_graphics_for(entity.id);
		}
	};
	
	

	var follow = function(id){
		//order camera to follow the graphical representation
		//of an object with the given id, if it exists
		GraphicsModel.camera.following = GraphicsModel.all_physical[id];
	};
	
	
	var register_new_stuff = function(){
		//search through all instances in the queue 
		//and register them for graphics updates.

		// retrieve instances of physical things that do not have graphics yet
		var new_stuff = RegisterAsController.retrieve_registered_as("awaiting_graphics_initialization");

		var length = new_stuff.length
		for(var i = 0; i < length; i++){
			var new_obj = new_stuff.pop();
			if(type_renderer_table[new_obj.type]){
				// if renderer exists for this type, register through it
				type_renderer_table[new_obj.type].register(new_obj, PrivateGraphics);	
			}else{
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
				sprite_animate(table[id], PrivateGraphics);
			}
		}
		
	};
	
	var sprite_animate = function(sprite){
		//set graphical representation based on the animation variable determined by the AI
		//set animation
		if(sprite.physical_instance.needs_graphics_update){
			var animation = sprite.physical_instance.animation;
			sprite.gotoAndPlay(animation)
		}
		
		//set direction
		if (sprite.physical_instance.direction){ //if direction == right, flip right
			sprite.scaleX = -1;
		}else{ //else flip left
			sprite.scaleX = 1;
		}

		//set alpha if blinking
		if(sprite.physical_instance.blinking && sprite.physical_instance.blink_timer%2 == 1){
			sprite.alpha = 0;
		}else{
			sprite.alpha = 1;
		}
	};

	//called from update(), maintains camera position
	var update_camera = function(){
		var camera = GraphicsModel.camera;
		var center = camera.center;
		
		center.x = Config.SCREEN_W/2 - camera.offset_from_followed.x;
		//CAMERA SHOULD NOT MOVE VERTICALLY
		//center.y = Config.SCREEN_H/2 - camera.offset_from_followed.y;
		
		if(camera.following != null){
		    camera.offset.x = center.x - camera.following.physical_instance.body.GetWorldCenter().x * Config.B2D.SCALE;
			camera.offset.y = center.y - camera.following.physical_instance.body.GetWorldCenter().y * Config.B2D.SCALE;
			// now, we do not want the camera to display what is behind the movement edge. but the camera is a relative thing
			// so we can't just limit some sort of x position or such.
			// I'll use the following technique: 
			//   1. calculate were the physical movement edge would be if drawn right now to the canvas
			//   2. if it would be displayed on-screen, offset camera so that it wouldn't be anymore

			var mov_edge_graphics_x = (WorldController.get_movement_edge() * Config.B2D.SCALE) + camera.offset.x;

			// recall that left display edge is 0 for graphics, as (0, 0) is the top-left corner
			if(mov_edge_graphics_x > 0){
				// if movement edge would be displayed
				camera.offset.x -= mov_edge_graphics_x;
			}
		}
		if (camera.offset.y < 0) {
		    camera.offset.y = 0;
		}

		adjust_debug_draw(); // goes last
	};

	


	//*************************************
	var adjust_debug_draw = function(){
		var camera = GraphicsModel.camera;
		TestController.set_debug_offset(camera.offset.x, camera.offset.y);
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

	
	//converts easeljs origins to box2d origins
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

			if(physical_instance.body == null){
				// are you trying to do something terrible? such as registering
				// some object that doesn't need graphical representation?
				throw "Physical instance is provided, but it has no body";
			}
			var id = physical_instance.id;
			var type = physical_instance.type;

			if(id == null || type == null){
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
	
	var get_camera = function(){
		return GraphicsModel.camera;
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
		get_camera: get_camera,
		get_asset: get_asset,
		reg_for_render: reg_for_render,
		set_reg_position: set_reg_position,
		request_bitmap: request_bitmap,
		request_animated: request_animated,
		destroy_graphics_for: destroy_graphics_for,
		follow: follow,
	};
})();

module.exports = GraphicsController;

var Includes = require("../Includes.js"); var include_data = Includes.get_include_data({
	current_module: "GraphicsController", 
	include_options: Includes.choices.DEFAULT | Includes.choices.RENDERERS
}); eval(include_data.name_statements); var include = function(){eval(include_data.module_statements);}

