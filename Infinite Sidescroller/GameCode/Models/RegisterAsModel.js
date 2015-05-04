var RegisterAsModel = function(){
	
	// register stuff for one time lookup
	// the one requesting stuff is supposed to pop the each examined element
	// there is no timeouts or automatic cleanup
	this.simple_one_time_lookup = {};
};

module.exports = new RegisterAsModel;

