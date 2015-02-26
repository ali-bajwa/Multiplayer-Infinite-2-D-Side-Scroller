var AssetController = (function(){
	/*
	   AssetController is in charge of setting up all bitmaps/animations/other resources
	   for everyone else.
   */

	// use AssetModel.loader.getResult("id_of_the_asset");


	var load_all = function(asset_path){

		/* TODO make model with the easily managed tables of resources which will be
		   added to the loader automatically
		*/

		var manifest = AssetModel.manifest;	


		//loader = new createjs.LoadQueue(false); // loading resourses using preload.js
		//loader.addEventListener("complete", handleComplete);
		AssetModel.loader.loadManifest(manifest, true, asset_path);
	}

	var request_bitmap = function(id){
		// if id is invalid, throw meaningful exception?
		return new createjs.Bitmap(AssetModel.loader.getResult(id));
		// TODO research DisplayObject's caching. and maybe incorporate
	};

	
	return {
		load_all: load_all,
		request_bitmap: request_bitmap
	};

})();

modules.exports = AssetController;
