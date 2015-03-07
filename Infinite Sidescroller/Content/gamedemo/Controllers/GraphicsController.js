var GraphicsModel;

var PlayerController;

GraphicsModel = require("../Models/GraphicsModel.js");

PlayerController = require("./PlayerController.js");
var GraphicsController = (function(){

	var update = function(){
		PlayerController.set_coordinates(PlayerController.b2b_get_coordinates());

	};

	return {
		update: update
	};
})();

module.exports = GraphicsController;
