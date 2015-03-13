var Include = function(){

	this.modules = {error: "Error: Modules have not been defined yet. You must call Include.init() first"};

	this.names = [
		// Controllers
		"PlayerController",
		"KeyboardController",
		"WorldController",
		"GraphicsController",
		"TerrainController",
		"PhysicsController",
		"AssetController",
		"TerrainSliceController",
		// Non-Controller Non-Models:
		"GameUtility",
		"Config",

	];
	

	this.init = function(){

		this.modules = {
			PlayerController: require("./Controllers/PlayerController.js"),
			KeyboardController: require("./Controllers/KeyboardController.js"),
			WorldController: require("./Controllers/WorldController.js"),
			GraphicsController: require("./Controllers/GraphicsController.js"),
			TerrainController: require("./Controllers/TerrainController.js"),
			PhysicsController: require("./Controllers/PhysicsController.js"),
			AssetController: require("./Controllers/AssetController.js"),
			TerrainSliceController: require("./Controllers/TerrainSliceController.js"),
			
			// Models

			GameModel: require("./Models/GameModel.js"),
			TerrainSliceModel: require("./Models/TerrainSliceModel.js"),
			

			// Other stuff
			GameUtility: require("./GameUtility.js"),
			Config: require("./Config.js"),
			
			
		};
	};

};

module.exports = new Include;
