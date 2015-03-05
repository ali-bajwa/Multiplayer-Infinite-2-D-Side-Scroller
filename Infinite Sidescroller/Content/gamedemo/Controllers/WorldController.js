var Config, Utility;
var PhysicsController;

Config = require("../Config.js");
Utility = require("../Utility.js");

PhysicsController = require("./PhysicsController.js");

var WorldController = (function(){

	var body_test = PhysicsController.get_body({type: "dynamic", x:10, y: 10});

	var update = function(delta){
		PhysicsController.step(delta);
	};


	return {
		update: update
	};
})();

module.exports = WorldController;
