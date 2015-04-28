var KeyboardController = (function()
{

	var init = function(){
		
		include();
	};

	var update = function(delta){
		/**
		* update called from GameController.update_all
		*/
		
		if(KeyboardModel.state_changed){
			// if keyboard state changed since the last time,
			// send the keyboard state over.
			// TODO: optimize?
			// You could send only those specific keys that changed, not whole table
			// You could send only relevant keys that might be needed there
			// Is it worth the time spent? Keep in minds, those tables are usually small,
			// unless players decide to smash their faces into the keybord repeatedly
			// (our game isn't that bad, right?)
			MultiplayerSyncController.route_outcoming_packet({
				op: "keyboard_state",
				key_table: KeyboardModel.keys,
			});

			KeyboardModel.state_changed = false;
		}
		
	};

	var handle_keyboard_change = function(packet){
		/**
		* accepts the network packet. changes the respective
		* keybord state for the given packet.player_id
		* is called from the MultiplayerSyncController
		*/
		var player_id = packet.player_id;
		
		if(player_id == null){
			throw "Error: (network) player_id is not defined";
		}

		KeyboardModel.all_keyboard_states[player_id] = packet.key_table;
	};
	
	
	var copy_object = function(obj){
		/**
		* returns (shallow) copy of the object
		*
		* @Stack Overflow:
		* With jQuery, you can shallow copy with:
		* var copiedObject = jQuery.extend({}, originalObject)
		* subsequent changes to the copiedObject will not affect the originalObject, and vice versa.
		* Or to make a deep copy:
		* var copiedObject = jQuery.extend(true, {}, originalObject)
		*/
		
		return jQuery.extend({}, obj);
	};
	
	
	
	var get_active_commands_function = function(table, player_id){
		// >player_id< is optional, and part of a dirty-ish quick implementation
		// Things should be rewritten at some point
		//
		// get all commands associated with keys that are defined in the >table<,
		// and are currently pressed
		//
		// returns: array of commands
		//
		// TODO: REFACTOR this function to work better and so people do not
		// need to call it each tick. instead they should get reference to function one time
		// and stay updated on the active commands
		
		var commands = [];
		if(player_id != null){
			var key_table = KeyboardModel.all_keyboard_states[player_id];
		}else{
			var key_table = KeyboardModel.keys;
		}
		
		$.each(KeyboardModel.translation_tables.code_to_name, function(key, cmd){
			if(key_table[key] && table[cmd]){
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
		KeyboardModel.state_changed = true;
	};

	var keyup = function(event){
		delete KeyboardModel.keys[event.keyCode];
		KeyboardModel.state_changed = true;
	};


	var movement_commands = function(){
		return get_active_commands_function(KeyboardModel.translation_tables.movement);
	};

	var pause_commands = function () {
	    return get_active_commands_function(KeyboardModel.translation_tables.pause);
	};

	var debug_commands = function(){
		/**
		* commands active in debug mode
		*/
		return get_active_commands_function(KeyboardModel.translation_tables.debug);
	};
	
	var get_remote_movement = function(player_id){
		/**
		* this it TEMPORARY function 
		* I throw it together so I do not have to change how keyboard controller works for now
		* if we find that we should send more keyboard stuff over the network, we should rewrite
		* the KeyboardController appropriately
		*/

		if(player_id == null){
			throw "Error: player_id undefined";
		}

		var key_fun = get_active_commands_function(KeyboardModel.translation_tables.movement, player_id);
		return key_fun;
	};
	
	

	return {
		keydown: keydown,
		keyup: keyup,
        pause_commands: pause_commands,
		movement_commands: movement_commands,
		debug_commands: debug_commands,
		init: init,
		update: update,
		handle_keyboard_change: handle_keyboard_change,
		get_remote_movement: get_remote_movement,
	};

})();

module.exports = KeyboardController;

var Includes = require("../Includes.js"); var include_data = Includes.get_include_data({
	current_module: "KeyboardController", 
	include_options: Includes.choices.DEFAULT
}); eval(include_data.name_statements); var include = function(){eval(include_data.module_statements);}

