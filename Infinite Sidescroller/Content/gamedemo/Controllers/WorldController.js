var Config, Utility;
var PhysicsController;

Config = require("../Config.js");
Utility = require("../Utility.js");

PhysicsController = require("./PhysicsController.js");

var WorldController = (function(){

	var body_test = PhysicsController.get_body({type: "dynamic"});
	var update = function(){
	};


	return {
		update: update
	};
})();

module.exports = WorldController;
