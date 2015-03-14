var Include = function(){

	var modules;

	// simple enumerator // option codes MUST be power of 2 or sum of other options (with 0 being the only exception), and unique
	var choices = Object.freeze({NONE: 0, ALL_CONTROLLERS: 1, ALL_MODELS: 2, OWN_MODEL: 4, OTHER_STUFF: 8,
		DEFAULT: 1 + 4 + 8, ALL: 1 + 2 + 8}); 

	var module_names = {
		Controllers: [
			"AssetController",
			"CameraController",
			"EnemyController",
			"GameController",
			"GraphicsController",
			"InitController",
			"KeyboardController",
			"PhysicsController",
			"PlayerController",
			"TerrainController",
			"TerrainSliceController",
			"TestController",
			"WorldController",
		],

		Models: [
		
			"AssetModel",
			"CameraModel",
			"GameModel",
			"GraphicsModel",
			"KeyboardModel",
			"PhysicsModel",
			"PlayerModel",
			"TerrainModel",
			"TerrainSliceModel",
			"TestModel",
			"WorldModel",
		],

		Other: [
		
			"B2d",
			"Box2D",
			"Config",
			"GameUtility",
		]

	};


	var init = function(){

		modules = {
			AssetController: require("./Controllers/AssetController.js"),
			CameraController: require("./Controllers/CameraController.js"),
			GraphicsController: require("./Controllers/GraphicsController.js"),
			KeyboardController: require("./Controllers/KeyboardController.js"),
			PhysicsController: require("./Controllers/PhysicsController.js"),
			PlayerController: require("./Controllers/PlayerController.js"),
			TerrainController: require("./Controllers/TerrainController.js"),
			TerrainSliceController: require("./Controllers/TerrainSliceController.js"),
			WorldController: require("./Controllers/WorldController.js"),
			InitController: require("./Controllers/InitController.js"),
			TestController: require("./Controllers/TestController.js"),
			CameraController: require("./Controllers/CameraController.js"),
			GameController: require("./Controllers/GameController.js"),
			EnemyController: require("./Controllers/EnemyController.js"),
			
			// Models

			GameModel: require("./Models/GameModel.js"),
			TerrainSliceModel: require("./Models/TerrainSliceModel.js"),
			CameraModel: require("./Models/CameraModel.js"),
			AssetModel: require("./Models/AssetModel.js"),
			PhysicsModel: require("./Models/PhysicsModel.js"),
			GraphicsModel: require("./Models/GraphicsModel.js"),
			TerrainModel: require("./Models/TerrainModel.js"),
			WorldModel: require("./Models/WorldModel.js"),
			KeyboardModel: require("./Models/KeyboardModel.js"),
			PlayerModel: require("./Models/PlayerModel.js"),
			TestModel: require("./Models/TestModel.js"),
				
			// Other stuff
			
			Config: require("./Config.js"),
			GameUtility: require("./GameUtility.js"),
			B2d: require("./B2d.js"),
			Box2D: require("box2dweb"),
		
		};
	}; // end init

	var option_is_set = function(what_mods_selected, options){
		if(what_mods_selected == 0 && options == 0){
			return true;
		}
		// be mindful of bitwise operator ahead
		return (what_mods_selected & options);
	};

	var get_module = function(name){
		// can be modified to throw object error instead of simple one
		// in that case it may contain list of difined modules
		// may also be modified to check whether module is missing from 
		// module_names, modules, or both, and give more accurate description
		var message = "Module " + name + 
			" is undefined. Note that you must hardcode all new modules" + 
			" into the Includes.module_names AND Includes.modules."
		
		if(modules){
			if(modules[name]){
				return modules[name];
			}else if(console.warn){ // check if console.warn is available
				console.warn(message);
			}else{
				throw message;
			}
		}else{
			throw "Error: You must run the Includes.init() before you can use any modules";
		}
	};
	

	var get_names = function(current_module_name, options_code){
		var result = {Models: [], Controllers: [], Other: []};

		if(option_is_set(choices.NONE, options_code)){
			return result;
		}

		if (option_is_set(choices.ALL_CONTROLLERS, options_code)){

			var controller_names = module_names.Controllers;

			for(var i = 0; i < controller_names.length; i++){

				var ctl_name = controller_names[i];

				if(ctl_name != current_module_name){
					result.Controllers.push(ctl_name);
				}
			}
			
		}

		if (option_is_set(choices.ALL_MODELS, options_code)){
			result.Models = module_names.Models;
		}
		else if(option_is_set(choices.OWN_MODEL, options_code)){
			var own_model = current_module_name.replace("Controller", "Model");
			result.Models.push(own_model);
		}

		if(option_is_set(choices.OTHER_STUFF, options_code)){
			result.Other = module_names.Other;
		}

		return result;
	};

	var get_name_statements = function(names){
		var result = "";
		for(var section_index = 0; section_index < 3; section_index++){
			var section = ["Models", "Controllers", "Other"][section_index];
			for(var i = 0; i < names[section].length; i++){
				result += ("var " + names[section][i] + "; ");
			}
		}

		return result;
		
	};

	var get_module_statements = function(names){
		var result = "";
		for(var section_index = 0; section_index < 3; section_index++){
			var section = ["Models", "Controllers", "Other"][section_index];
			for(var i = 0; i < names[section].length; i++){
				result += (names[section][i] + " = Includes.get_module(\"" + names[section][i] + "\"); ");
			}
		}

		return result;
	};

	var get_include_data = function(params){
		var current_module = params.current_module;
		var include_options = params.include_options;
		var names = get_names(current_module, include_options);

		var name_statements = get_name_statements(names);
		var module_statements = get_module_statements(names);

		return {
			imported_modules: names,
			name_statements: name_statements,
			module_statements: module_statements,
		};

	};

	return {
		init: init,
		module_names: module_names,
		get_module: get_module,
		get_include_data: get_include_data,
		choices: choices,
		option_is_set: option_is_set
	};

};

module.exports = new Include;

