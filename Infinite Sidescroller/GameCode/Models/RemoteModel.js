var RemoteModel = function(){
	this.package_backlog = {HEAD: null, TAIL: null}
	this.role_chosen = false;
	this.display = null; // context of canvas on which to display things
	this.one_packet = null; // one pack at a time
};

module.exports = new RemoteModel;


