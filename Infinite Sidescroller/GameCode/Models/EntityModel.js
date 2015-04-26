var EntityModel = function(){	
	// associates type with the AI
	this.type_to_AI = {};

	this.for_logic_update = {}; // key: type, value: table of objects with id for key, object for value
	
	
};

module.exports = new EntityModel;

