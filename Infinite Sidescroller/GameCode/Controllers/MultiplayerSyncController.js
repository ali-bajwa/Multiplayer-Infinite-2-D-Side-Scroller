
var MultiplayerSyncController = (function(){
	/* Ensures that current player is synchronized with the server
	 * or with other players
	*/

	var op_table;

	var init = function(){
		/* is ran from the InitController once when the game is loaded */
		include(); // satisfy requirements

	};


	var update = function(delta){
		/* is ran each tick from the GameController.update_all */

		var data = NetworkController.get_data(); // array of all packets

		var op_packet = MultiplayerSyncModel.op_packets_table; //op_packet is a list of objects
		if(data != null){
			for(var i = 0; i < data.length; i++){ //for each packet in buffer
				var packet = data[i];
				var op = packet.op; //get packet op
				op_packet[op] = op_packet[op] || [];
				if(op != null){
					op_packet[op].push(packet);
				}else{
					console.log(packet);
					throw "Error, this packet has no op property"
				}
			}
		}
		
		handle_packets(data);

		NetworkController.clean_data();	// remove data that was processed
	};

	/*
	iterates through packets and parses them based on op (operation)
	*/
	var handle_packets = function(data){
		if(data != null){
			for(i=0;i<data.length;i++){
				packet = data[i];
				switch (packet.op){
					case null:
						break;
					case "spawn":
						if (packet.is_request == Config.Remote.master){
							universal_spawn(packet);
						}
						break;
				}
			}
		}
	};
	
	var get_packets_by_op = function(op){
		/**
		* gets all packets with the operation >op<
		* for you
		*/
		return MultiplayerSyncModel.op_packets_table[op];
	};
	
		/*
		The universal_spawn() function takes an object as a parameter
		it handles the packet based on whether the caller is a master, slave, or single player
		and on the contents of the packet
		the packet holds the following
			required data fields:
				-string type
						string index of class to be instantiated
				-int x
						x coordinate of instance
				-int y
						y coordinate of instance
			automatically assigned data fields:
				-bool is_request
						true if request from slave
						false if notification from master
				-string op
						marks packet to be parsed as instance spawner
			additionally, the packet can be assigned any number of extra variables
			to be parsed by the class' individual spawn() function
		*/
		var universal_spawn = function(packet){
			var type;
			var object;
			var operation;
			if (packet.type != null){
				type = packet.type;
				if (type != "hero"){
				operation = EntityController.get_operation(type); //get relevant spawn() function from EntityController
				} else {
					if (typeof packet.controller_id === 'undefined' || packet.controller_id == NetworkController.get_network_id()){
						packet.controller_id = NetworkController.get_network_id();
						operation = EntityController.get_operation("hero");
					}else{
						operation = EntityController.get_operation("companion");
					}
				}
				if (!Config.Remote.connected){ //if singleplayer
					object = new operation(packet.x,packet.y);
					IdentificationController.assign_id(object);
					EntityController.reg_for_logic_update(object);
				}else if (Config.Remote.master){ //if master
					object = new operation(packet.x,packet.y);
					IdentificationController.assign_id(object);
					EntityController.reg_for_logic_update(object);
					packet.thingamajigger = object.id;
					send_spawn_notifications(packet);
				}else{ //if slave
					if (typeof packet.thingamajigger !== 'undefined'){//if called in response to a notification
						object = new operation(packet.x,packet.y);
						IdentificationController.force_id(object,packet.thingamajigger);
						EntityController.reg_for_logic_update(object);
						console.log("slave got its wish");
					}else{//if called directly from slave session
						send_spawn_request(packet);
					}
				}
			}else{
				console.log(packet);
				throw "Error, this packet has no type property"
			}
		};
	
	//send spawn request to master
	var send_spawn_request = function(packet){
		packet.op = "spawn";
		packet.is_request = true;
		NetworkController.add_to_next_update(packet);
	};
	
	//var send_spawn_notifications = function(x, y, type, id, extras){
	var send_spawn_notifications = function(packet){
		//sends notifications about entity spawned, so remote people may
		//spawn their own representations of it
		packet.op = "spawn";
		packet.is_request = false;
		NetworkController.add_to_next_update(packet);
	};
	

	

	var patch = function(object, func){
		/**
		* patch object with the function given
		* >object< - object whose prototype to patch 
		* >func< - NAMED function. it has to have the same name
		* as the function on the >object<'s prototype that it's meant to replace
		* this is function named bar: var hey = function bar(){};
		* this is unnamed function: var hey = function(){};
		*
		* the function that you pass will be called before the normal function body
		* when called, your function will be called on the same object (instance) that
		* old_function is called and will be passed the same arguments
		*/

		if(func.name === ""){
			throw "Function passed should be named function";
		}

		var old_func = object.prototype[func.name];
		var custom_function = func;

		var new_function = function overriden_by_multiplayer_controller(){

			custom_function.apply(this, arguments);
			return old_func.apply(this, arguments); // call old function and return what it returns
		}

		object.prototype[func.name] = new_function;
		
	};
	
	
	
	return {
		// declare public
		init: init, 
		update: update,
		get_packets_by_op: get_packets_by_op,
		universal_spawn: universal_spawn,
		send_spawn_request: send_spawn_request,
		send_spawn_notifications: send_spawn_notifications,
	};
})();

module.exports = MultiplayerSyncController;

var Includes = require("../Includes.js"); var include_data = Includes.get_include_data({
	current_module: "MultiplayerSyncController", 
	include_options: Includes.choices.DEFAULT
}); eval(include_data.name_statements); var include = function(){eval(include_data.module_statements);}

