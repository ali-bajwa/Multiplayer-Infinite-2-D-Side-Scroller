
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
		
	};

	var post_init = function(){
		/* this function will be done differently at some point
		 * it'll have something to do with refactoring InitController
		 */

		//AssetModel.animations["ant"] = new createjs.SpriteSheet({
			//"framerate": 0.2,
			//"images": [get_asset("Ant1"), get_asset("Ant2"), get_asset("Ant3")],
			//"frames": { "regX": 3, "regY": 6, "height": 25, "width": 50, "count": 6},
			//"animations": {
				//"walk": [0, 1, "walk"],
				//"upside_down": [2, 3, "upside_down"],
				//"death": [4, 5, "death"]
			//}
		//})

	};
	

	var get_asset = function(id){

		var result = AssetModel.loader.getResult(id);

		if(!result){
			throw "Error: asset with id " + id + " could not be loaded." +
				" Check that id is valid and that assets were properly loaded";
		}
		
		return result;
	};
		


	
	return {
		init: init,
		get_asset: get_asset,
	};

})();

module.exports = AssetController;

var Includes = require("../Includes.js"); var include_data = Includes.get_include_data({
	current_module: "AssetController", 
	include_options: Includes.choices.DEFAULT
}); eval(include_data.name_statements); var include = function(){eval(include_data.module_statements);}

