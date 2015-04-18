
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

	};


	var update = function(delta){
		/* is ran each tick from the GameController.update_all */
		var debug_commands = KeyboardController.debug_commands();

		// demonstration purposes
		if(debug_commands("spawn_ant")){
			spawn((Math.random()*50 + 10),10, "ant");
		}
		if(debug_commands("request_hero") && !EntityModel.hero_spawned){
			// if hero is requested, and not spawned yet,
			// spawn hero
			EntityModel.hero_spawned = true;
			spawn(20,10, "hero");
		}

		/*
		//This should be handled in the update of MultiplayerSync
		if(Config.Remote.master){//if master, parse requests
			MultiplayerSyncController.receive_spawn_request();
		}else if(Config.Remote.connected){//if slave, parse notifications
			MultiplayerSyncController.receive_spawn_notification();
		}
		*/
		for(var type in EntityModel.for_logic_update){
			var table = EntityModel.for_logic_update[type];

			var logic = type_logic_table[type];
			for(var id in table){
				logic.tick_AI(table[id]);
			}
			
		} // end for in 

	};

	var spawn = function(x, y, type){
		/**
		* spawn entity of type >type<
		* at position (x, y)
		*/
		MultiplayerSyncController.route_outcoming_packet({
			op: "spawn",
			type: type,
			x: x,
			y: y
		});
	};

	var handle_spawn = function(packet){
		/**
		* takes the packet with >op< "spawn"
		* containing properties >x<, >y<, >type<, and possibly more
		* handles creation of the entity, id assignment, etc.
		*/
		var x = packet.x,
			y = packet.y,
			type = packet.type;

		if(type == "companion" || type == "hero"){
			// TEMPPP
			console.log("spawned", type);
		}
		if(type_logic_table[type] == null){
			throw "No logic found for the type" + String(type);
		}

		var logic = type_logic_table[type];
		var entity = logic.spawn(x, y);

		IdentificationController.assign_id(entity);

		reg_for_logic_update(entity);

		RegisterAsController.register_as("awaiting_graphics_initialization", entity)
	};
	
	

	//takes a string type index as parameter 
	//and returns the spawn() function associated with it
	//var get_operation = function(type){
		//var spawn = type_logic_table[type].spawn;
		//return spawn;
	//};
	
	//registers a new instance
	//so that renderers and updaters know to update it on tick
	var reg_for_logic_update = function(new_entity){
		var type = new_entity.type;
		if(!EntityModel.for_logic_update[type]){
			EntityModel.for_logic_update[type] = {};
		}
		var logic_upd_table = EntityModel.for_logic_update[type];
		logic_upd_table[new_entity.id] =  new_entity;
		
	};
	
	//wrapper for universal spawn
	//maintains the old interface
	//var spawn = function(type,x,y){
		//MultiplayerSyncController.handle_spawn({type:type,x:x,y:y});
	//};
	
	var delete_entity = function(entity_instance){
		MultiplayerSyncController.route_outcoming_packet({
			op: "delete_entity",
			id: entity_instance.id,
			type: entity_instance.type,
		});
	};
	
	var handle_delete = function(packet){
		/**
		* This function will remove this entity along with some other info about this entity
		* from the world, it'll also free the id of this entity. The physical body will be deleted
		* too; 
		* This function is supposed to be called by the individual logic modules, when the are finished
		* animating deat/destruction of something and want to get rid of it
		*/

		var entity_instance = EntityModel.for_logic_update[packet.type][packet.id];

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

	return {
		// declare public
		init: init, 
		update: update,
		//get_operation: get_operation,
		reg_for_logic_update: reg_for_logic_update,
		spawn: spawn,
		delete_entity: delete_entity,
		//fulfill_delete_request: fulfill_delete_request,
		handle_spawn: handle_spawn,
		handle_delete: handle_delete,
	};
})();

module.exports = EntityController;

var Includes = require("../Includes.js"); var include_data = Includes.get_include_data({
	current_module: "EntityController", 
	include_options: Includes.choices.DEFAULT | Includes.choices.LOGIC
}); eval(include_data.name_statements); var include = function(){eval(include_data.module_statements);}

