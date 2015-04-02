
var TerrainCellRenderer = (function(){
	/* render one terrain cell
	*/

	var register = function(cell){
		/**
		* register the cell
		*/
		
	};

	var render = function(cell){
		/**
		* render the given cell
		*/
		
	};
	
		
	return {
		// declare public
		register: register,
		render: render,
	};
})();

module.exports = TerrainCellRenderer;

var Includes = require("../Includes.js"); var include_data = Includes.get_include_data({
	current_module: "TerrainCellRenderer", 
	include_options: Includes.choices.ALL_CONTROLLERS
}); eval(include_data.name_statements); var include = function(){eval(include_data.module_statements);}

