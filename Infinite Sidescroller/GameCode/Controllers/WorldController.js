var Config, GameUtility;
var PhysicsController, TerrainSliceController, TerrainController;

var include = function(){
	Config = require("../Config.js");
	GameUtility = require("../GameUtility.js");

	PhysicsController = require("./PhysicsController.js");
	TerrainSliceController = require("./TerrainSliceController.js");
	TerrainController = require("./TerrainController.js");
	
};

var WorldController = (function(){

	//var body_test = PhysicsController.get_body({type: "dynamic", x: 10, y: 3});
	var body_test;
	var temp = 0;

	var init = function(){
		include();
		body_test = PhysicsController.get_rectangular_body(1.3, 2.5, 10, 3.3, true);
	};
	

	var update = function(delta){

		PhysicsController.step(delta);

		if(temp++ == 0){
			TerrainController.NewTerrainSlice();
		}

	};



	return {
		update: update,
		init: init,
	};
})();

module.exports = WorldController;
