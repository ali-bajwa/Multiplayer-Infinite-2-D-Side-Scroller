
var CameraController = (function(){

	var init = function(){
		include();

	};

	var update = function(){

		var following = CameraModel.following;
		if(following){
			center_at(following.x,  following.y);
		}

	};

	var center_at = function(x, y){
		/* NOT IMPLEMENTED
		 * instantly center camera at the given coordinates
		 * Alg: calculate x offset, calculate y ofsset, call >move<
		 */
		var scr_center = get_screen_center(); // current camera position

		var offset_x = x - scr_center.x;
		var offset_y = y - scr_center.y;

		lg("x, y", offset_x, offset_y);

		move(offset_x, offset_y);
	};

	var get_screen_center = function(){
		// is a function to handle screen resize functionality, when implemented
		return {
			x: SCREEN_W / 2,
			y: SCREEN_H / 2
		};

	};

	var follow = function(easeljs_obj){
		/*
		 * follow specific easeljs object everywhere
		 */

		CameraModel.following = easeljs_obj;
	};

	var unfollow = function(){
		CameraModel.following = null;
	};

	var move = function(offset_x, offset_y){
		/*
		 * moving camera in some direction essentially means
		 * moving world (terrain, background, players, enemies, etc.)
		 * in opposite direction, and screen elements (HUD, minimap) in the smae
		 * direction
		 * Later it may need significantly more functionality 
		 */

		var n_x = (-1) * offset_x;
		var n_y = (-1) * offset_y;

		TerrainController.move(n_x, n_y);
		PlayerController.move(n_x, n_y);

		// other related things.move(..., ...)
	};

	var slide = function(x, y, speed){
		/* NOT IMPLEMENTED
		 * assign the camera a coordinates to slide to with >speed< pixels/tick
		 * if we do scripted scenes, that could be useful
		 */
	};

	return {
		init: init,
		move: move,
		follow: follow,
		unfollow: unfollow,
		update: update

	};
})();


module.exports = CameraController;

var Includes = require("../Includes.js"); var include_data = Includes.get_include_data({
	current_module: "CameraController", 
	include_options: Includes.choices.DEFAULT
}); eval(include_data.name_statements); var include = function(){eval(include_data.module_statements);}

