var NetworkModel = function(){
	this.connected = false; // flag to indicate if already connected to the network

	// flag to indicate whether to disallow connections, useful to prevent
	// more attempts to connect when connection is already being established
	this.block_connections; 

	this.my_peer = null;
	this.my_id = null;

	this.master_id = null; // id of the master with whome everyone synces

	// this is for standart (non-test) mode
	// I plan to make test mode use this too, eventually
	this.peers_to_connect = null;
	

	// player_id associated with the connection object
	this.connections = {};

	this.send_array = null;
	this.recieve_array = null;

	this.one_packet = null; // used to store one packet, for one packet communication

	this.input_cell = null;
	this.output_cell = null;
	this.counter = 0; // temp

	// linked list to store the backlog of packets for the communication that needs that
	this.package_backlog = {HEAD: null, TAIL: null} 

	// TIME 
		this.begin_time = null; // seconds
		this.timeout_id = null;
	// END TIME
	
	// TESTING MODE STUFF. SHOULD BE MERGED WITH GENERAL STUFF IF POSSIBLE
	
	this.non_free_ids = [
	];

	this.free_ids = [
	];

	// END TESTING MODE STUFF

};

module.exports = new NetworkModel;


