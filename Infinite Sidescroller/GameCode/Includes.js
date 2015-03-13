var Include = function(){

	this.modules = {error: "Error: Modules have not been defined yet. You must call Include.init() first"};

	this.names = [
			"PlayerController",
			"KeyboardController",
			"WorldController",
			"GraphicsController",
			"TerrainController",
			"GameModel"
	];
	

	this.init = function(){

		this.modules = {
			PlayerController: require("./Controllers/PlayerController.js"),

			KeyboardController: require("./Controllers/KeyboardController.js"),
			WorldController: require("./Controllers/WorldController.js"),
			GraphicsController: require("./Controllers/GraphicsController.js"),
			TerrainController: require("./Controllers/TerrainController.js"),
			

			GameModel: require("./Models/GameModel.js"),
		};
	};

};

module.exports = new Include;
