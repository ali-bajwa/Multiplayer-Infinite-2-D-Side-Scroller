var KeyboardController = (function()
{
	// TODO: does this section belong into the controller? >>>
	var keys = {};

	var TR_TABLES = // translation tables
	{
		code_to_name: {
			37: "left",
			38: "up",
			39: "right",
			40: "down"
		}
	}

	// <<< end TODO

	var init = function(){
		
		include();
	};
	
	var get_active_commands_function = function(table){
		// get all commands associated with keys that are defined in the >table<,
		// and are currently pressed
		//
		// returns: array of commands
		
		var commands = [];
		
		$.each(table, function(key, cmd){
			if(keys[key]){
				commands.push(cmd);
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
		keys[event.keyCode] = true;
	};

	var keyup = function(event){
		delete keys[event.keyCode];
	};


	var movement_commands = function(){
		return get_active_commands_function(TR_TABLES.code_to_name);
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

