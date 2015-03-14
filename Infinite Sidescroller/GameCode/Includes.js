var Include = function(){

	this.modules = {error: "Error: Modules have not been defined yet. You must call Include.init() first"};

	this.names = [
		// Controllers
		"AssetController",
		"GraphicsController",
		"KeyboardController",
		"PhysicsController",
		"PlayerController",
		"TerrainController",
		"TerrainSliceController",
		"WorldController",
		"InitController",
		"TestController",
		// Non-Controller Non-Models:
		"Config",
		"GameUtility",

	];
	

	this.init = function(){

		this.modules = {
			AssetController: require("./Controllers/AssetController.js"),
			GraphicsController: require("./Controllers/GraphicsController.js"),
			KeyboardController: require("./Controllers/KeyboardController.js"),
			PhysicsController: require("./Controllers/PhysicsController.js"),
			PlayerController: require("./Controllers/PlayerController.js"),
			TerrainController: require("./Controllers/TerrainController.js"),
			TerrainSliceController: require("./Controllers/TerrainSliceController.js"),
			WorldController: require("./Controllers/WorldController.js"),
			InitController: require("./Controllers/InitController.js"),
			TestController: require("./Controllers/TestController.js"),
			
			
			
			// Models

			GameModel: require("./Models/GameModel.js"),
			TerrainSliceModel: require("./Models/TerrainSliceModel.js"),
			CameraModel: require("./Models/CameraModel.js"),
		
			// Other stuff
			Config: require("./Config.js"),
			GameUtility: require("./GameUtility.js"),
			
			
		};
	};

};

module.exports = new Include;
