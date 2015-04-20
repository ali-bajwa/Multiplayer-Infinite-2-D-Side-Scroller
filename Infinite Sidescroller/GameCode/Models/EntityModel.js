var EntityModel = function(){	
	// associates type with the AI
	this.type_to_AI = {};

	this.for_logic_update = {}; // key: type, value: table of objects with id for key, object for value

	this.hero_spawned = false;

	// assiciates player network id with the hero entity instance
	this.heroes = {};

	// last velocity for my hero
	// used to check how much velocity changed since the last tick
	this.hero_last_velocity = {x: 0, y: 0};
};

module.exports = new EntityModel;

