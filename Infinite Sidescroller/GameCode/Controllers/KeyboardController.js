var KeyboardController = (function()
{

	var init = function(){
		
		include();
	};
	
	var get_active_commands_function = function(table){
		// get all commands associated with keys that are defined in the >table<,
		// and are currently pressed
		//
		// returns: array of commands
		//
		// TODO: REFACTOR this function to work better and so people do not
		// need to call it each tick. instead they should get reference to function one time
		// and stay updated on the active commands
		
		var commands = [];
		
		$.each(KeyboardModel.translation_tables.code_to_name, function(key, cmd){
			if(KeyboardModel.keys[key] && table[cmd]){
				commands.push(table[cmd]);
			}
		});

		var get_key = function(key){
			if(commands.indexOf(key) > -1){
				return true;
			}else{
				return false
			};
		};

		return get_key;
	};

	// public:
	
	var keydown = function(event){
		KeyboardModel.keys[event.keyCode] = true;
	};

	var keyup = function(event){
		delete KeyboardModel.keys[event.keyCode];
	};


	var movement_commands = function(){
		return get_active_commands_function(KeyboardModel.translation_tables.movement);
	};

	var debug_commands = function(){
		/**
		* commands active in debug mode
		*/
		return get_active_commands_function(KeyboardModel.translation_tables.debug);
	};
	

	return {
		keydown: keydown,
		keyup: keyup,

		movement_commands: movement_commands,
		init: init,
	};

})();

module.exports = KeyboardController;

var Includes = require("../Includes.js"); var include_data = Includes.get_include_data({
	current_module: "KeyboardController", 
	include_options: Includes.choices.DEFAULT
}); eval(include_data.name_statements); var include = function(){eval(include_data.module_statements);}

