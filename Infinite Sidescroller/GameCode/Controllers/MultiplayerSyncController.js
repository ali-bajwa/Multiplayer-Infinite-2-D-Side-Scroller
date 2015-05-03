
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
			keyboard_state: KeyboardController.handle_keyboard_change,
			hero_sync: EntityController.handle_hero_sync,
			terrain_seed: sync_seed,
		}
	};


	var update = function(delta){
		/* is ran each tick from the GameController.update_all */

		var data = NetworkController.get_data(); // array of all packets

		var op_packet = MultiplayerSyncModel.op_packets_table; //op_packet is a list of objects

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
		if(packet.player_id == null){
				// if packet wasn't identified before
				// identify the packet as mine
				packet.player_id = NetworkController.get_network_id();
		}

		var op = packet.op;
		var handler = op_table[op];

		if(handler == null){
			// if no handler assigned
			console.warn("No handler for op", op);
			return -1;
		}

		if(Config.Remote.connected){
			// if multiplayer
			
			
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
			//console.log(op,handler);
			
			
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

		if(packet.personal_communication != null){
			console.warn(packet.personal_communication);
		}

		if(Config.Remote.master && packet.personal_communication != true){
			// if master and packet isn't meant personally for me
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
				break;
			//default:
		}

		return packet;
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

	var get_initialization_data_master = function(){
		/**
		* get array packets that should be sent from master to all other people after the connection
		* with them is established
		*/

		var data = [];
		data.push({op: "terrain_seed", seed: TerrainController.get_seed(),});


		return data;
	};

	var get_initialization_data_common = function(){
		/**
		* get the array of packets that should be sent when to newly connected player
		* regardless whether this player is a master or not
		*/

		var data = [];

		var my_hero = EntityController.get_my_hero();

		if(my_hero != null){
			var pos = my_hero.body.GetWorldCenter();
			data.push({
				op: "spawn",
				personal_communication: true,
				type: "hero",
				x: pos.x,
				y: pos.y,
				// TODO: synchronize the state ??? or will it be handled automatically w/ herosync?
			});
		}
		
		return data;
	};

	var purge_all_data_for = function(network_id){
		/**
		* despawn hero and remove all traces of presence for the player
		* with this network id
		* called when player disconnects from the game
		*/
		
		var heroes = EntityController.get_all_heroes(); 
		var hero = heroes[network_id];
		

		if(hero != null){
			EntityController.delete_entity(hero);
		}
	};
	
	
	var sync_seed = function(packet){
		/**
		* description
		*/
		
		console.log("syncing my seed with master; the seed is", packet.seed);
		
		var seed = packet.seed;
		if(seed != null){
			TerrainController.set_seed(seed);
		}else{
			throw "seed is not defined";
		}
	};

	return {
		// declare public
		init: init, 
		update: update,
		route_outcoming_packet: route_outcoming_packet,
		route_incoming_packet: route_incoming_packet,
		get_initialization_data_master: get_initialization_data_master,
		get_initialization_data_common: get_initialization_data_common,
		purge_all_data_for: purge_all_data_for,
	};
})();

module.exports = MultiplayerSyncController;

var Includes = require("../Includes.js"); var include_data = Includes.get_include_data({
	current_module: "MultiplayerSyncController", 
	include_options: Includes.choices.DEFAULT
}); eval(include_data.name_statements); var include = function(){eval(include_data.module_statements);}

