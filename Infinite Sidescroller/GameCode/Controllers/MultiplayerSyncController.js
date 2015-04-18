
var MultiplayerSyncController = (function(){
	/* Ensures that current player is synchronized with the server
	 * or with other players
	*/

	var op_table;

	var init = function(){
		/* is ran from the InitController once when the game is loaded */
		include(); // satisfy requirements

		// table that associates >op< (operation) with the specific handler
		// at some (likely external) module
		op_table = {
			spawn: EntityController.handle_spawn,
			delete_entity: EntityController.handle_delete,
		}
	};


	var update = function(delta){
		/* is ran each tick from the GameController.update_all */

		var data = NetworkController.get_data(); // array of all packets

		var op_packet = MultiplayerSyncModel.op_packets_table; //op_packet is a list of objects

		// the following loop will store packets based on their op
		/*if(data != null){
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
		}*/
		
		//handle_packets(data); // Seans

		if(data != null){
			for(var i = 0; i < data.length; i++){
				// for each packet in incoming packets,
				// rout it
				var packet = data[i];
				route_incoming_packet(packet);
			}
		}

		NetworkController.clean_data();	// remove data that was processed
	};

	var route_outcoming_packet = function(packet){
		/**
		* route packet appropriately
		*/

		var op = packet.op;
		var handler = op_table[op];

		if(handler == null){
			// if no handler assigned
			console.warn("No handler for op", op);
			return -1;
		}

		if(Config.Remote.connected){
			// if multiplayer
			
			if(packet.player_id == null){
				// if packet wasn't identified before
				// identify the packet as mine
				packet.player_id = NetworkController.get_network_id();
			}

			if(Config.Remote.master){
				// if master of the network
				// route back to specific handler
				// echo to all clients

				handler(packet);

				var response = packet; // do we want to allow overriding the response?

				NetworkController.add_to_next_update(response);
			}else{
				// if one of the clients
				// route to the master
				NetworkController.add_to_next_update(packet);
			}
		}else{
			// if singlplayer
			// route back to the specific handler
			handler(packet);
		}
	};

	var route_incoming_packet = function(packet){
		/**
		* handle packet that arrived over the network
		* ! this function is called only when packets arrive remotely
		* ! so you may safely assume that you are connected to the network
		* ! and the packet didn't originate on your side (this last one is
		* ! especially important)
		*/

		apply_transforms(packet); // apply any necessary transformations before beginning

		var op = packet.op;
		var handler = op_table[op];

		if(handler == null){
			// if no handler assigned
			console.warn("No handler for op", op);
			return -1;
		}

		if(Config.Remote.master){
			// if master
			// route to specific handler
			// echo to the clients
			handler(packet);
			NetworkController.add_to_next_update(packet);
		}else{
			// if one of the clients
			// route to the handler
			handler(packet);
		}
		
	};

	var apply_transforms = function(packet){
		/**
		* if some specific transformation is supposed to be applied to the packet
		* (op should change somehow, new properties added etc.)
		* apply this transformation
		* ! notice that transforms are applied to incoming packets only
		* ! if you are confident you need something else, contact me (AK)
		*/

		switch(packet.op){
			case null:
				console.log(packet);
				throw "op for this packet is undefined";
				break;
			case "spawn":
				if(packet.type == "companion"){
					if(packet.player_id == NetworkController.get_network_id()){
						// if I am receiving notification about my own hero spawned
						// spawn hero instead of companion
						packet.type = "hero";
					}
				}else if(packet.type == "hero"){
					// someone requested hero spawn,
					// but I should spawn companion
					packet.type = "companion";
				}
				break;
			//default:
		}

		return packet;
	};
	
	
	
	/*
	iterates through packets and parses them based on op (operation)
	*/
	/*var handle_packets = function(data){
		if(data != null){
			for(i = 0;i < data.length; i++){
				packet = data[i];
				switch (packet.op){
					case null:
						break;
					case "spawn":
						if (packet.is_request == Config.Remote.master){
							handle_spawn(packet);
						}
						break;
					case "delete":
						if (packet.is_request == Config.Remote.master){
							handle_delete(packet);
						}
						break;
				}
			}
		}
	};
	
	var get_packets_by_op = function(op){
		[>*
		* gets all packets with the operation >op<
		* for you
		<]
		return MultiplayerSyncModel.op_packets_table[op];
	};
	
		[>
		The handle_spawn() function takes an object as a parameter
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
		<]
	var handle_spawn = function(packet){
			var type;
			var object;
			var operation;
			if (packet.type == null){
				console.log(packet);
				throw "Error, this packet has no type property"
			}
			if (!Config.Remote.connected){ //if singleplayer
				packet.assign = true;
				fulfill_spawn_request(packet);
			}else if (Config.Remote.master){ //if master
				packet.assign = true;
				packet = fulfill_spawn_request(packet);
				send_spawn_notifications(packet);
			}else{ //if slave
				if (packet.entity_id != null){//if called in response to a notification
					packet.assign = false;
					fulfill_spawn_request(packet);
				}else{//if called directly from slave session
					send_spawn_request(packet);
				}
			}
	};
		
	var fulfill_spawn_request = function(packet){
			var operation;
			var object;
			var type = packet.type;
			if (type != "hero"){
				operation = EntityController.get_operation(type); //get relevant spawn() function from EntityController
			}else{
				if (typeof packet.controller_id === 'undefined' || packet.controller_id == NetworkController.get_network_id()){
					packet.controller_id = NetworkController.get_network_id();
					operation = EntityController.get_operation("hero");
				}else{
					operation = EntityController.get_operation("companion");
				}
			}
		object = new operation(packet.x,packet.y);
		if (packet.assign){
			IdentificationController.assign_id(object);
			packet.entity_id = object.id;
		}else{
			IdentificationController.force_id(object,packet.entity_id);
		}
		EntityController.reg_for_logic_update(object);
		return packet;
	}
		
	var handle_delete = function(packet){
		if (packet.id == null){
			console.log(packet);
			throw "Error, this packet has no id property"
			}
			var id = packet.id;
			var object;
			object = IdentificationController.get_by_id(id);
			if (!Config.Remote.connected){ //if singleplayer
				EntityController.fulfill_delete_request(object);
			}else if (Config.Remote.master){ //if master
				console.log("master issues death sentence");
				EntityController.fulfill_delete_request(object); 
				packet.entity_id = object.id;
				send_delete_notifications(packet);
			}else{ //if slave
				if (typeof packet.entity_id !== 'undefined'){//if called in response to a notification
					EntityController.fulfill_delete_request(object); 
					console.log("slave got its wish");
				}else{//if called directly from slave session
					send_delete_request(packet);
					console.log("slave requests death sentence");
				}
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
	
	var send_delete_request = function(packet){
		packet.op = "delete";
		packet.is_request = true;
		NetworkController.add_to_next_update(packet);
	};
	
	//var send_spawn_notifications = function(x, y, type, id, extras){
	var send_delete_notifications = function(packet){
		//sends notifications about entity spawned, so remote people may
		//spawn their own representations of it
		packet.op = "delete";
		packet.is_request = false;
		NetworkController.add_to_next_update(packet);
	};*/

	

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
		//get_packets_by_op: get_packets_by_op,
		//handle_spawn: handle_spawn,
		//handle_delete: handle_delete,
		//send_spawn_request: send_spawn_request,
		//send_spawn_notifications: send_spawn_notifications,
		//send_delete_request: send_delete_request,
		//send_delete_notifications: send_delete_notifications,
		route_outcoming_packet: route_outcoming_packet,
		route_incoming_packet: route_incoming_packet,
	};
})();

module.exports = MultiplayerSyncController;

var Includes = require("../Includes.js"); var include_data = Includes.get_include_data({
	current_module: "MultiplayerSyncController", 
	include_options: Includes.choices.DEFAULT
}); eval(include_data.name_statements); var include = function(){eval(include_data.module_statements);}

