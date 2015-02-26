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

	var get_active_commands = function(table){
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

		return commands;
	};

	// public:
	
	var keydown = function(event){
		keys[event.keyCode] = true;
	};

	var keyup = function(event){
		delete keys[event.keyCode];
	};


	var movement_commands = function(){
		return get_active_commands(TR_TABLES.code_to_name);
	};


	return {
		keydown: keydown,
		keyup: keyup,

		movement_commands: movement_commands

	};

})();

module.exports = KeyboardController;
