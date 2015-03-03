var Config, Utility;
var PhysicsController;

Config = require("../Config.js");
Utility = require("../Utility.js");

PhysicsController = require("./PhysicsController.js");


var WorldController = (function(){

	var my_preciousss_body = new PhysicsController.get_body({});

	return {
	};
})();

module.exports = WorldController;
