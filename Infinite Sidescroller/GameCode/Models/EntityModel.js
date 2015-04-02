var EntityModel = function(){	
	// associates type with the AI
	this.type_to_AI = {};

	// DEPRECATED
	this.ants = {};

	this.for_logic_update = {}; // key: type, value: array of objects

};

module.exports = new EntityModel;

