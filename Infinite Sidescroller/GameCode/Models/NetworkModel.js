var NetworkModel = function(){
	this.connected = false; // flag to indicate if already connected to the network

	// flag to indicate whether to disallow connections, useful to prevent
	// more attempts to connect when connection is already being established
	this.block_connections; 

	this.my_peer = null;
	this.my_id = null;

	this.free_ids = [
		"player1",
		"player2",
		"player3",
		"player4",
		"player5",
		"player6",
		"player7",
		"player8",
	];

	this.non_free_ids = [
	];

	this.connections = {
		"player1": null,
		"player2": null,
		"player3": null,
		"player4": null,
		"player5": null,
		"player6": null,
		"player7": null,
		"player8": null,

	};

	this.one_packet = null; // used to store one packet, for one packet communication

	this.input_cell = null;
	this.output_cell = null;
	this.counter = 0; // temp

	// linked list to store the backlog of packets for the communication that needs that
	this.package_backlog = {HEAD: null, TAIL: null} 

};

module.exports = new NetworkModel;


