var GraphicsModel;

var PlayerController;

var include = function(){
	/* browserify require statements go here */

	GraphicsModel = require("../Models/GraphicsModel.js");

	PlayerController = require("./PlayerController.js");

};

var GraphicsController = (function(){

	var init = function(){
		/* is ran from the InitController once when the game is loaded */

		include(); // satisfy requirements

	};

	var update = function(){
		PlayerController.set_coordinates(PlayerController.b2b_get_coordinates());
	};

	var switch_season = function(season_id){
		// this could be used to select sprites for the different season

	};


	return {
		// declare public
		init: init, 
		update: update
	};
})();

module.exports = GraphicsController;

