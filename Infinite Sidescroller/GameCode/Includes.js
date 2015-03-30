var Include = function(){

	var modules;

	// simple enumerator // option codes MUST be power of 2 or sum of other options (with 0 being the only exception), and unique
	var choices = (function(){
		// simple options: numberic value must be 0 or some power of 2, name should be all caps and unique
		var result = {NONE: 0, ALL_CONTROLLERS: 1, ALL_MODELS: 2, OWN_MODEL: 4, OTHER_STUFF: 8, RENDERERS: 16, LOGIC: 32};

		// complex options: should consist of simple options, bitwise(!) OR'ed or AND'ed together in any fashion
		result.DEFAULT = (result.ALL_CONTROLLERS | result.OWN_MODEL | result.OTHER_STUFF);
		result.ALL =  (result.ALL_CONTROLLERS | result.ALL_MODELS | result.OTHER_STUFF); 

		// object is immutable
		return Object.freeze(result);
	})();

	var module_names = {
		Controllers: [
			"AssetController",
			"EnemyController",
			"GameController",
			"GraphicsController",
			"InitController",
			"KeyboardController",
			"PhysicsController",
			//"PlayerController",
			"TerrainController",
			"TerrainSliceController",
			"TestController",
			"WorldController",
			//"AntController",
			"IdentificationController",
			"RegisterAsController",
		],

		Models: [
		
			"AssetModel",
			"GameModel",
			"GraphicsModel",
			"KeyboardModel",
			"PhysicsModel",
			//"PlayerModel",
			"TerrainModel",
			"TerrainSliceModel",
			"TestModel",
			"WorldModel",
			//"AntModel",
			"EnemyModel",
			"RegisterAsModel",
		],

		Other: [
		
			"B2d",
			"Box2D",
			"Config",
			"GameUtility",
		],

		Renderers: [
			"AntRenderer",
			"HeroRenderer",
		],

		Logic: [
			"AntLogic",
			"HeroLogic",
		],

	};//end module_names


	var init = function(){

		modules = {
			AssetController: require("./Controllers/AssetController.js"),
			GraphicsController: require("./Controllers/GraphicsController.js"),
			KeyboardController: require("./Controllers/KeyboardController.js"),
			PhysicsController: require("./Controllers/PhysicsController.js"),
			//PlayerController: require("./Controllers/PlayerController.js"),
			TerrainController: require("./Controllers/TerrainController.js"),
			TerrainSliceController: require("./Controllers/TerrainSliceController.js"),
			WorldController: require("./Controllers/WorldController.js"),
			InitController: require("./Controllers/InitController.js"),
			TestController: require("./Controllers/TestController.js"),
			GameController: require("./Controllers/GameController.js"),
			EnemyController: require("./Controllers/EnemyController.js"),
			//AntController: require("./Controllers/AntController.js"),
			IdentificationController: require("./Controllers/IdentificationController.js"),
			RegisterAsController: require("./Controllers/RegisterAsController.js"),
			
			
			
			// Models

			GameModel: require("./Models/GameModel.js"),
			TerrainSliceModel: require("./Models/TerrainSliceModel.js"),
			AssetModel: require("./Models/AssetModel.js"),
			PhysicsModel: require("./Models/PhysicsModel.js"),
			GraphicsModel: require("./Models/GraphicsModel.js"),
			TerrainModel: require("./Models/TerrainModel.js"),
			WorldModel: require("./Models/WorldModel.js"),
			KeyboardModel: require("./Models/KeyboardModel.js"),
			//PlayerModel: require("./Models/PlayerModel.js"),
			TestModel: require("./Models/TestModel.js"),
			//AntModel: require("./Models/AntModel.js"),
			IdentificationModel: require("./Models/IdentificationModel.js"),
			EnemyModel: require("./Models/EnemyModel.js"),
			RegisterAsModel: require("./Models/RegisterAsModel.js"),
			
			
			
				
			// Other stuff
			
			Config: require("./Config.js"),
			GameUtility: require("./GameUtility.js"),
			B2d: require("./B2d.js"),
			Box2D: require("box2dweb"),
			
			// Renderers
			
			AntRenderer: require("./Renderers/AntRenderer.js"),
			HeroRenderer: require("./Renderers/HeroRenderer.js"),
			

			// Logic
			AntLogic: require("./Logic/AntLogic.js"),
			HeroLogic: require("./Logic/HeroLogic.js"),
			
			

		};

	}; // end init

	var option_is_set = function(what_mods_selected, options){
		if(what_mods_selected == 0 && options == 0){
			return true;
		}
		// be mindful of bitwise operator ahead
		return (what_mods_selected & options);
	};//end option_is_set

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
	};//end get_module
	

	var get_names = function(current_module_name, options_code){
		var result = {Models: [], Controllers: [], Other: [], Renderers: [], Logic: [],};

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
		}else if(option_is_set(choices.OWN_MODEL, options_code)){
			var own_model = current_module_name.replace("Controller", "Model");
			result.Models.push(own_model);
		}

		if(option_is_set(choices.OTHER_STUFF, options_code)){
			result.Other = module_names.Other;
		}

		if(option_is_set(choices.RENDERERS, options_code)){
			result.Renderers = module_names.Renderers;
		}

		if(option_is_set(choices.LOGIC, options_code)){
			result.Logic = module_names.Logic;
		}

		return result;
	};//end get_names

	var sections = ["Models", "Controllers", "Other", "Renderers", "Logic"];
	var get_name_statements = function(names){
		var result = "";
		for(var section_index = 0; section_index < sections.length; section_index++){
			var section = sections[section_index];
			for(var i = 0; i < names[section].length; i++){
				result += ("var " + names[section][i] + "; ");
			}
		}

		return result;
		
	};//end get_name_statements

	var get_module_statements = function(names){
		var result = "";
		for(var section_index = 0; section_index < sections.length; section_index++){
			var section = sections[section_index];
			for(var i = 0; i < names[section].length; i++){
				result += (names[section][i] + " = Includes.get_module(\"" + names[section][i] + "\"); ");
			}
		}

		return result;
	};//end get_module_statements

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

	};//end get_include_data

	var automated_tests = function(){
		
		QUnit.test("option matching function", function( assert) {

			//If both are none
			assert.equal(option_is_set(choices.NONE, choices.NONE), true);

			assert.throws(option_is_set(choices.NONE, -1));

			//If both match, it returns the value of choices
			//If they don't match, it returns 0
			
			//MATCH
			assert.equal(option_is_set(choices.ALL_CONTROLLERS, choices.ALL_CONTROLLERS), 1);
			assert.equal(option_is_set(choices.ALL_MODELS, choices.ALL_MODELS), 2);
			assert.equal(option_is_set(choices.OTHER_STUFF, choices.OTHER_STUFF), 8);

			//Mismatch
			assert.equal(option_is_set(choices.NONE, choices.ALL_CONTROLLERS), 0);
			assert.equal(option_is_set(choices.OTHER_STUFF, choices.NONE), 0);
			assert.equal(option_is_set(choices.ALL_MODELS, choices.ALL_CONTROLLERS), 0);
			assert.equal(option_is_set(choices.OWN_MODEL, choices.ALL_MODELS), 0);
		});//end option matching test
		
	};//end automated_tests


	return {
		init: init,
		module_names: module_names,
		get_module: get_module,
		get_include_data: get_include_data,
		choices: choices,
		automated_tests: automated_tests
	};

};

module.exports = new Include;

