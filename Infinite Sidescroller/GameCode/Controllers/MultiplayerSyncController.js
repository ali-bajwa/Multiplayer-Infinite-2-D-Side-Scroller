
var MultiplayerSyncController = (function(){
	/* Ensures that current player is synchronized with the server
	 * or with other players
	*/

	var op_table;

	var init = function(){
		/* is ran from the InitController once when the game is loaded */

		include(); // satisfy requirements

<<<<<<< HEAD
		// maps packet op (operation code) to the function to be called for that operation
		op_table  = {
			"hero": update_hero,
			"spawn_request": handle_spawn_request,
			"spawn_notify": handle_spawn_notify,
		};


		//patch(B2d.b2Body, function SetLinearVelocity(vec){
			//console.log(this.GetUserData().entity_instance);
=======
		//patch(B2d.b2Body, function SetLinearVelocity(vec){
			////console.log(this.GetUserData().entity_instance);
>>>>>>> a4c9a71b12c0487df72cad41d4c088b16b8d86cc
			//var entity_instance = this.GetUserData().entity_instance;
			//var old_velocity = this.GetLinearVelocity();
			//var pos = this.GetWorldCenter();

			//var vec_eq = function(vec1, vec2){
				//if((vec1.x == vec2.x) && (vec1.y == vec2.y)){
					//return true;
				//}else{
					//return false;
				//}
			//}
			
			//if(Config.Remote.master && !vec_eq(vec, old_velocity) && entity_instance.type === "hero"){
				
				
				//NetworkController.add_to_next_update({
					//op: "hero",
					//pos: {x: pos.x, y: pos.y},
					//vel: {x: vec.x, y: vec.y}
				//});
			//}

		//});
		
	};


	var update = function(delta){
		/* is ran each tick from the GameController.update_all */

		var data = NetworkController.get_data(); // array of all packets

		var op_packet = MultiplayerSyncModel.op_packets_table;
		if(data != null){
			for(var i = 0; i < data.length; i++){
				var packet = data[i];
				var op = packet.op;
				op_packet[op] = op_packet[op] || [];
				if(op != null){
					op_packet[op].push(packet);
				}else{
					console.log(packet);
					throw "Error, this packet has no op property"
				}

			}
		}

		NetworkController.clean_data();	// remove data that was processed
	};


	var get_packets_by_op = function(op){
		/**
		* gets all packets with the operation >op<
		* for you
		*/

		return MultiplayerSyncModel.op_packets_table[op];
		
	};
	

	var request_spawn = function(x, y, type, extras){
		/**
		* request the master to spawn thing
		* >extras< are any special parameters that need to be attached
		*/
		
		var command = {op: "spawn_request", type: type, x: x, y: y, extras: extras};

		NetworkController.add_to_next_update(command);

	};

	var send_spawn_notifications = function(x, y, type, id, extras){
		/**
		* sends notifications about entity spawned, so remote people may
		* spawn their own representations of it
		*/

		NetworkController.add_to_next_update({
			op: "spawn_notify",
			x: x,
			y: y,
			type: type,
			id: id,
			extras: extras,
		});
		
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
		request_spawn: request_spawn,
		send_spawn_notifications: send_spawn_notifications,
		get_packets_by_op: get_packets_by_op,
	};
})();

module.exports = MultiplayerSyncController;

var Includes = require("../Includes.js"); var include_data = Includes.get_include_data({
	current_module: "MultiplayerSyncController", 
	include_options: Includes.choices.DEFAULT
}); eval(include_data.name_statements); var include = function(){eval(include_data.module_statements);}

