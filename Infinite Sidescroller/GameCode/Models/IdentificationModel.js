
var IdentificationModel = function(){
	
	// next unique id to be given if not free id's remain
	this.next_id = 0;

	// array of free id's. push when freed, pop when free id is needed
	// if array is empty, get next id using >next_id<
	this.free_ids = [];

	// array matches ids to their corresponding objects
	this.id_matching = [];

	// registry of types to make sure that no type is registerd twice
	// and enable people to get the model by type name
	this.types = {}
	
	//list of heroes and companions spawned
	this.hero;
	this.companions = [];
};

module.exports = new IdentificationModel;


