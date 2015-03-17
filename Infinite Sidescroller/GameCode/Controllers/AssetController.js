
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

		var manifest = AssetModel.manifest;	


		//loader = new createjs.LoadQueue(false); // loading resourses using preload.js
		//loader.addEventListener("complete", handleComplete);
		AssetModel.loader.loadManifest(manifest, true, asset_path);

	};
	

	var request_bitmap = function(id){
		// if id is invalid, throw meaningful exception?
		var bitmap = new createjs.Bitmap(AssetModel.loader.getResult(id));
		// more complicated setting for registration position may be needed, depending on the body attached
		if (!(bitmap.image)){
			throw "Error: image wasn't correctly loaded for this bitmap";
		}
		
		bitmap.regX = bitmap.image.width/2;
		bitmap.regY = bitmap.image.height/2;

		return bitmap;
		// TODO research DisplayObject's caching. and maybe incorporate
	};

	var request_animated = function(spritesheet, frame_set){
		// this implementation is temporary
		// until I setup efficient facility for defining spritesheets
		// within this module and/or GraphicsController
		var sprite = new createjs.Sprite(spritesheet, frame_set);
		return sprite;
	};

	
	return {
		init: init,
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

