
var IdentificationController = (function(){
	/* Is in charge of giving unique ID's to everything
	 * that wants them
	*/

	var init = function(){
		/* is ran from the InitController once when the game is loaded */

		include(); // satisfy requirements

		// create 100 id's
		for(var i = 0; i < 100; i++){
			var id = IdentificationModel.next_id ++;
			IdentificationModel.free_ids.push(id);
			IdentificationModel.id_matching[id] = null;
		}

	};

	var update = function(delta){
		/* is ran each tick from the GameController.update_all */
		// cleanup ids, if too many free ids (like if non-free id's < free id's/10
		
		//TODO: make function to actually be called from the GameController.update_all
		// TODO: loop through all non-free id's, and if any of them reference null,
		// remove (unregister) them;

	};

	var assign_id = function(obj, set_id){
		/**
		* assigns id to the object
		* sets property id on the object given. you can give OPTIONAL parameter
		* set_id which should be a function that takes object and id and assigns
		* id to the object. this can be useful if you want to store id in some unusual
		* place, or perform some extra operations before id is assigned
		*
		* return id assigned
		* IdentificationController will remember that this id has been assigned
		* this object
		*/
		var free = IdentificationModel.free_ids;
		var id;

		// get free id
		if(free.length > 0){
			id = free.pop();
		}else{
			id = IdentificationModel.next_id++;
		}

		// set id on the object. through function if provided
		if(set_id){
			set_id(obj, id);
		}else{
			obj.id = id;
		}

		// associate id with the object obj
		IdentificationModel.id_matching[id] = obj;

		return id
	};

	var get_by_id = function(id){
		/**
		* get object associated with the given id
		*/
		return IdentificationModel.id_matching[id];
	};

	var remove_id = function(id){
		/**
		* mark id as free and no longer assiciate it with any object
		* notice that you yourself is responsible for making sure
		* that object that was associated with this id doesn't think
		* that he is still assigned this is
		*/

		// TODO: make sure that all known places that use ids (PhysicsControllers'
		// contact listener for example) are notified that id had been unregistered
		delete IdentificationModel.id_matching[id];
		IdentificationModel.free_ids.push(id);
	};
	
	var assign_type = function(obj, type){
		/**
		* assigns wanted type (string) to the given
		* model definition
		* if you try to assign same type twice, throws exception;
		* Id...Controller allows you to retrieve model
		*/

		var types = IdentificationModel.types;
		if(types[type]){
			throw "Error: type " + type + " is already registered. " +
				"You can't register the same type twice";
		}else{
			types[type] = obj;
			obj.prototype.type = type;
		}
		
	};
	
	var get_by_type = function(type){
		/**
		* gets object by it's type
		*/
		var types = IdentificationModel.types;
		if(types[type]){
			return types[type];
		}else{
			throw "Error: type " + type + " wasn't defined yet";
		}
	};
	
	
	
	
	return {
		// declare public
		init: init, 
		update: update,
		assign_id: assign_id,
		get_by_id: get_by_id,
		remove_id: remove_id,
		assign_type: assign_type,
		get_by_type: get_by_type,
	};
})();

module.exports = IdentificationController;

var Includes = require("../Includes.js"); var include_data = Includes.get_include_data({
	current_module: "IdentificationController", 
	include_options: Includes.choices.OWN_MODEL
}); eval(include_data.name_statements); var include = function(){eval(include_data.module_statements);}

