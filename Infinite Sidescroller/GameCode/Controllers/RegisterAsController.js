
var RegisterAsController = (function(){
	/* Allows you to register object as something,
	 * for other modules to access
	 * One use could be registering newly generated terrain slice from the slice controller,
	 * for the GraphicsController to notice and generate graphics for it
	*/

	var init = function(){
		/* is ran from the InitController once when the game is loaded */

		include(); // satisfy requirements

	};

	var update = function(delta){
		/* is ran each tick from the GameController.update_all */

		// TODO: automatically delete stuff depending on timeout stuff
		// calculate timeout of 
	};

	var register_as = function(what, obj){
		/**
		* simple one time lookup registering of object
		* >what< - string. e.g. "new_terrain_slice"
		* >obj< - object to register
		*/
		
		var table = RegisterAsModel.simple_one_time_lookup;

		if(table[what]){
			table[what].push(obj);
		}else{
			table[what] = [obj];
		}
	};

	var retrieve_registered_as = function(what){
		/**
		* returns reference to the object contatining
		* things currently registered as >what<
		* you are responsible for popping (or not popping) them
		* from the array to no longer consieder (or continue to consider)
		* them as registered as >what<
		*/
		var list = RegisterAsModel.simple_one_time_lookup[what];
		if(list){
			return list;
		}else{
			return [];
		}
		
	};
	
	
	return {
		// declare public
		init: init, 
		update: update,
		register_as: register_as,
		retrieve_registered_as: retrieve_registered_as
	};
})();

module.exports = RegisterAsController;

var Includes = require("../Includes.js"); var include_data = Includes.get_include_data({
	current_module: "RegisterAsController", 
	include_options: Includes.choices.DEFAULT
}); eval(include_data.name_statements); var include = function(){eval(include_data.module_statements);}

