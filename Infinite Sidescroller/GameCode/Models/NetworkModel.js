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
	this.connections = null;

	this.send_array = null;
	this.recieve_array = null;

	this.one_packet = null; // used to store one packet, for one packet communication

	this.input_cell = null;
	this.output_cell = null;
	this.counter = 0; // temp

	// linked list to store the backlog of packets for the communication that needs that
	this.package_backlog = {HEAD: null, TAIL: null} 

	// TESTING MODE STUFF. SHOULD BE MERGED WITH GENERAL STUFF IF POSSIBLE
	
	this.non_free_ids = [
	];

	this.free_ids = [
		//"player1",
		//"player2",
		//"player3",
		//"player4",
		//"player5",
		//"player6",
		//"player7",
		//"player8",
	];

	this.master_order = [
		// order in which players will be selected for a master position
		//"player1",
		//"player2",
		//"player3",
		//"player4",
		//"player5",
		//"player6",
		//"player7",
		//"player8",

	];
	// END TESTING MODE STUFF

};

module.exports = new NetworkModel;


