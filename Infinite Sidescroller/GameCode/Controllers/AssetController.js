
var AssetController = (function(){
	/*
	   AssetController is in charge of setting up all bitmaps/animations/other resources
	   for everyone else.
   */

	// use AssetModel.loader.getResult("id_of_the_asset");

	var init = function(asset_path){
		include();	

		/* TODO make model with the easily managed tables of resources which will be
		   added to the loader automatically
		*/

		//loader = new createjs.LoadQueue(false); // loading resourses using preload.js
		//loader.addEventListener("complete", handleComplete);
		var manifest = AssetModel.manifest;	
		AssetModel.loader.loadManifest(manifest, true, asset_path);

		
		
		//AssetModel.animations.ant.upside_down = new createjs.SpriteSheet({
			//"framerate": 2,
			//"images": ["../GameCode/assets/art/AntChompers2.png"],
			//"frames": { "regX": 0, "regY": 15, "height": 15, "width": 50, "count": 2 },
			//"animations": {"upside-down":[0,1, "upside-down"]}
		//})

		//AssetModel.animations.ant.death = new createjs.SpriteSheet({
			//"framerate": 2,
			//"images": ["../GameCode/assets/art/AntChompersDeath.png"],
			//"frames": { "regX": 0, "regY": 15, "height": 15, "width": 50, "count": 2 },
			//"animations": {"death":[0,1, "death"]}

		//})

	};

	var post_init = function(){
		/* this function will be done differently at some point
		 * it'll have something to do with refactoring InitController
		 */

		AssetModel.animations["ant"] = new createjs.SpriteSheet({
			"framerate": 0.2,
			"images": [get_asset("Ant1"), get_asset("Ant2"), get_asset("Ant3")],
			"frames": { "regX": 3, "regY": 6, "height": 25, "width": 50, "count": 6},
			"animations": {
				"walk": [0, 1, "walk"],
				"upside_down": [2, 3, "upside_down"],
				"death": [4, 5, "death"]
			}
		})

		
	};
	

	var get_asset = function(id){
		var result = AssetModel.loader.getResult(id);
		
		return result;
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
		// within this module and/or GraphicsController
		// id of "category:spritesheet_id" is supported. E.g. "ant:walk"
		var spritesheet_path = id.split(":");

		if(!id || !start_frame){
			if(!id){
				throw "wrong id";
			}else{
				throw "wrong start_frame";
			}
		};

		//var spritesheet = AssetModel.animations[spritesheet_path[0]];
		//for(var i = 1; i < spritesheet_path.length; i++){
			//var spritesheet = spritesheet[spritesheet_path[i]];
		//}

		var sprite = new createjs.Sprite(AssetModel.animations[id], start_frame);

		return sprite;
	};

	
	return {
		init: init,
		post_init: post_init,
		//load_all: load_all,
		request_bitmap: request_bitmap,
		request_animated: request_animated,
	};

})();

module.exports = AssetController;

var Includes = require("../Includes.js"); var include_data = Includes.get_include_data({
	current_module: "AssetController", 
	include_options: Includes.choices.DEFAULT
}); eval(include_data.name_statements); var include = function(){eval(include_data.module_statements);}

