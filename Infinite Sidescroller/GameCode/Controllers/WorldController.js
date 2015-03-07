var Config, GameUtility;
var PhysicsController;

Config = require("../Config.js");
GameUtility = require("../GameUtility.js");

PhysicsController = require("./PhysicsController.js");

var WorldController = (function(){

	//var body_test = PhysicsController.get_body({type: "dynamic", x: 10, y: 3});
	var body_test = PhysicsController.get_rectangular_body(1.3, 2.5, 10, 3.3, true);
	
	var update = function(delta){
		PhysicsController.step(delta);
	};


	return {
		update: update
	};
})();

module.exports = WorldController;
