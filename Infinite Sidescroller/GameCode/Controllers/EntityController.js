
var EntityController = (function(){
	/* Description
	*/

	var type_logic_table;
	
	var init = function(){
		/* is ran from the InitController once when the game is loaded */

		include(); // satisfy requirements

		type_logic_table = {
			"ant": AntLogic,
			"hero": HeroLogic,
			"companion": EsteemedCompanionLogic,
		};

		for(type in type_logic_table){
			var logic = type_logic_table[type];
			logic.init();

			if(logic.begin_contact){
				PhysicsController.listen_for_contact_with(type, "BeginContact", logic.begin_contact);
			}

			if(logic.end_contact){
				PhysicsController.listen_for_contact_with(type, "EndContact", logic.end_contact);
			}

			if(logic.pre_solve){
				PhysicsController.listen_for_contact_with(type, "PreSolve", logic.pre_solve);
			}

			if(logic.post_solve){
				PhysicsController.listen_for_contact_with(type, "PostSolve", logic.post_solve);
			}

		}

		spawn(10, 10, "hero");
	};

	var spawn = function(x, y, type, id){
		/**
		* spawn entity of the given type at the given coordinates
		* also registeres thing as awaiting graphics initialization
		* returns true if was spawned, false if it wasn't (maybe it just sent request to the
		* master/server to spawn the entity, and it'll be spawned eventually)
		*
		* TODO: rework how spawning works to be multiplayer friendly (a lot of things should be rewritten to do that)
		*/
		var logic = type_logic_table[type];
		var rconf = Config.Remote;

		if(logic == null){
			throw "Logic for the type " + type + " is not defined";
		}

		if(rconf.connected && !rconf.master){
			// if part of the multiplayer session and isn't master,
			if(id == null){
				// if this function isn't called remotely (otherwise id would be passed)
				// you do not want to spawn anything immediately. You want to ask master to spawn
				// stuff on their end, and to call this function again when they are done, passing
				// it id of the entity they spawned, so everyone spawns it with the same id synchronously
				// alternatively, master may decide that enemy shouldn't be spawned at all

				MultiplayerSyncController.request_spawn(x, y, type);

				return false;
				
			}else{
				// id isn't null, thus you or someone else requested spawning of thig,
				// master spawned it, and now wants you to do same
				
				var new_entity = logic.spawn(x, y);
				IdentificationController.force_id(new_entity, id);
				RegisterAsController.register_as("awaiting_graphics_initialization", new_entity)
				reg_for_logic_update(new_entity);
			}
		}else{
			// if singleplayer or master
			var new_entity = logic.spawn(x, y);
			var id = IdentificationController.assign_id(new_entity);
			RegisterAsController.register_as("awaiting_graphics_initialization", new_entity)
			reg_for_logic_update(new_entity);

			if(rconf.master){
				// if master
				MultiplayerSyncController.send_spawn_notifications(x, y, type, id);
			}
		}



	};

	var reg_for_logic_update = function(new_entity){
		/**
		* description
		*/

		var type = new_entity.type;

		if(!EntityModel.for_logic_update[type]){
			EntityModel.for_logic_update[type] = {};
		}
		var logic_upd_table = EntityModel.for_logic_update[type];
		logic_upd_table[new_entity.id] =  new_entity;
	
	};
	
	


	var delete_entity = function(entity_instance){
		/**
		* This function will remove this entity along with some other info about this entity
		* from the world, it'll also free the id of this entity. The physical body will be deleted
		* too; 
		* This function is supposed to be called by the individual logic modules, when the are finished
		* animating deat/destruction of something and want to get rid of it
		*/

		// TODO: finish this function and then update it regularly;
		// This one is very sensitive, as even one reference left may prevent 
		// object from being deleted and cause memory leaks. Testing is required
		if(entity_instance.body != null){
			var body = entity_instance.body;
		}else{
			// body is required. if place where body is stored changed, you should update this function
			throw "Body of the instance is undefined"
		}

		if(entity_instance.id != null){
			var id = entity_instance.id;
		}else{
			// id is needed, if id system changed, and you are here, update this function
			throw "There is no id associated with this instance"
		}

		if(entity_instance.type != null){
			var type = entity_instance.type;
		}else{
			// id is needed, if id system changed, and you are here, update this function
			throw "There is no type associated with this instance"
		}


		// remove graphics
			GraphicsController.destroy_graphics_for(id);
		// remove physics
			PhysicsController.remove_body(body);
		// remove stored references within EntityController/Model
			delete EntityModel.for_logic_update[type][id];
		// free the id
			IdentificationController.remove_id(id);
	};

	var update = function(delta){
		/* is ran each tick from the GameController.update_all */
		var debug_commands = KeyboardController.debug_commands();

		// demonstration purposes
		if(debug_commands("spawn_ant")){
			var new_ant = spawn(Math.random()*50 + 10, 10, "ant");
		}

		if(Config.Remote.master){
			handle_spawn_requests();
		}else if(Config.Remote.connected){
			handle_spawn_notifications();
		}

		for(var type in EntityModel.for_logic_update){
			var table = EntityModel.for_logic_update[type];

			var logic = type_logic_table[type];
			for(var id in table){
				logic.tick_AI(table[id]);
			}
			
		} // end for in 

	};

	var handle_spawn_requests = function(){
		/**
		* find out if anyone requested spawning of entities etc.
		* and execute any of the requests
		*/

		var data = MultiplayerSyncController.get_packets_by_op("spawn_request") || [];

		while(data.length > 0){
			
			var packet = data.pop();
			spawn(packet.x, packet.y, packet.type);
		}
		
	};

	var handle_spawn_notifications = function(){
		/**
		* 
		*/
		
		var data = MultiplayerSyncController.get_packets_by_op("spawn_notify") || [];
		while(data.length > 0){
			
			var packet = data.pop();
			spawn(packet.x, packet.y, packet.type, packet.id);
		}

	};

	return {
		// declare public
		init: init, 
		update: update,
		delete_entity: delete_entity,

	};
})();

module.exports = EntityController;

var Includes = require("../Includes.js"); var include_data = Includes.get_include_data({
	current_module: "EntityController", 
	include_options: Includes.choices.DEFAULT | Includes.choices.LOGIC
}); eval(include_data.name_statements); var include = function(){eval(include_data.module_statements);}

