
var RemoteController = (function(){
	/* manages p2p communication
	*/

	var peer, conn; // TEMPORARY. there will be multiple of those things
	var MEDIATOR_SERVER_KEY = 'a7vojcpf70ysyvi';

	var init = function(){
		/* is ran from the InitController once when the game is loaded */
		include(); // satisfy requirements

		document.onbeforeunload = on_unload; // will be executed before user leaves page
	};


	var update = function(delta){
		/* is ran each tick from the GameController.update_all */

		var cmds = KeyboardController.debug_commands();

		if(!RemoteModel.block_connections && cmds("connect")){
			RemoteModel.block_connections = true;
			start_multiplayer_session();
		}

		if(RemoteModel.counter > 5){
			RemoteModel.counter = 0;
			send_out_data();
		}else{
			RemoteModel.counter++
		}


	};

	var start_multiplayer_session = function(){
		/**
		* perform procedures to start playing with all
		* other connected people
		*/
		setup_my_peer(); // setup peer // also picks free id
				
	};

	var on_obtaining_id_successfully = function(id){
		/**
		* when the player id for this client was successfully
		* found through the process in the setup_my_peer(); function,
		* this function is called, which should setup all necessary things for 
		* the multiplayer to work, and connect to the other player
		*/

		RemoteModel.my_id = id;
		RemoteModel.connected = true;

		if(RemoteModel.my_id != RemoteModel.my_peer.id){
			// not a meaningful check, terrible practices are terrible
			throw "Id's do not match. Smth went wrong" 
		}

		console.log("obtained id sucessfully, my id is", id);

		for(var i = 0; i < RemoteModel.non_free_ids.length; i++){
			// establish connections with every other player
			var id = RemoteModel.non_free_ids[i];
			if(id != RemoteModel.my_id){
				var connection = RemoteModel.my_peer.connect(id);
				RemoteModel.connections[id] =  connection;
				connection.on('data', on_data_arrival);
				connection.on('close', on_connection_closed);
			}
		}

		// TEMPORARRYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY
		// TODO: determine that dynamically and make sure there ia always a host
		if(id === "player8"){
			this.am_master = true;
		}

	};
	
	var setup_my_peer = function(error){
		/**
		* setups your personal peer picking free id, and returning it
		* looking up for the free id's is a huge pain now, once we run our
		* own peer matching server, it'll be a lot easier
		*
		* >error< parameter is null on the first call, but if first id that was
		* tried was already taken, and function is called again, it'll not be null 
		*/

		if(error == null || error.type == "unavailable-id"){
			if(RemoteModel.free_ids.length > 0){
				var id = RemoteModel.free_ids.pop();
				RemoteModel.non_free_ids.push(id);
				var peer = RemoteModel.my_peer = new_peer(id); 
				peer.on('error', setup_my_peer);
				peer.on('open', on_obtaining_id_successfully);
			}else{
				console.warn("Couldn't establish multiplayer session, all 8 available slots taken");
				RemoteModel.connected = false;
				RemoteModel.block_connections = false;
				RemoteModel.free_ids = [
					"player1",
					"player2",
					"player3",
					"player4",
					"player5",
					"player6",
					"player7",
					"player8",
				];

				RemoteModel.non_free_ids = [];

			}
		}
		
	};

	var on_connection_closed = function(){
		/**
		* called when some connection closes
		*/
		var id = this.peer;
		var nfree = RemoteModel.non_free_ids;

		nfree.splice(nfree.indexOf(id), 1);

		RemoteModel.free_ids.push(id);

		delete RemoteModel.connections[id];
	};
	
	
	
	var new_peer = function(id){
		/**
		* pass the id you want the peer to have
		* returns created peer
		*/
		
		var peer = new Peer(id, {key: MEDIATOR_SERVER_KEY});

		peer.on('connection', accept_connection);


		return peer;
	};

	var accept_connection = function(conn){
		/**
		* takes connection
		* is called when someone attempts to establish connection
		* with this client
		*/

		var free_ids = RemoteModel.free_ids;
		var nfree_ids = RemoteModel.non_free_ids;

		var id = conn.peer;
		RemoteModel.connections[id] = conn;

		// remove the id from list of free ids. notice that 
		// array is relatively small, and operation happends seldomly
		free_ids.splice(free_ids.indexOf(id), 1); 

		console.log("accepting connection from peer", id);
		
		nfree_ids.push(id);

		conn.on('data', on_data_arrival);

	};

	var connection_unsuccessful = function(error){
		/**
		* for now, just add the peer to which was trying to connect to the
		* free peers list. Later some investigation or reconnection attempts
		* may be implemented
		*/

		console.log(error);
		
	};
	
	

	var update_player_list = function(){
		/**
		* searches for new players using standart player id's
		* this function will be called only once, when this client decides
		* to join multiplayer session, at least theoretically.
		* If you need to call it regularly, it probably should be rewritten
		*/

		var free_ids = RemoteModel.free_ids;

		var peer = RemoteModel.my_peer;
		
		for(var i = 0; i < free_ids.length; i++){
			var conn = peer.connect(free_ids[i]);
			conn.on('error', connection_unsuccessful);
		}
		
	};
	
	
	
	var send_to = function(peer_id, data){
		/**
		* send data to the peer with the peer_id
		* you can make decision to delay data sending, or change
		* procedure somehow right here
		* but do not try to compress the data in this function.
		* send_to will be fired multiple times per each piece of data
		* (it'll be sent to all other players) so any compression should
		* take place in the "distribute_data" function
		*/

		var conn = RemoteModel.connections[peer_id];

		if(conn != null){
			conn.send(data);
		}else{
			throw "No connection exists for the peer with id " + String(id);
		}
		
	};

	var distribute_data = function(data){
		/**
		* First, manipulate the data to properly compress it, or decide what should
		* and what shouldn't be sent (make sure to document stuff here, because people
		* will pull thir hair out trying to understand why their stuff doesn't get sent)
		* Second, send the data to all the connected players in this game
		*/

		var conns = RemoteModel.connections;
		for(var id in conns){
			if(id != RemoteModel.my_id && conns[id]){
				conns[id].send(data);
			}
		}
		
	};

	var on_unload = function(arguments){
		/**
		* will be called when the user is about to leave the web page
		* will make sure connections are gracefully closed and peers are destroyed
		*/

		console.log("document is unloaded now. Destroying peer, disconnecting from others");
		RemoteModel.my_peer.destroy();	
	};
	
	
	
	var on_event = function(smth){
		/**
		* dummy function, delete when isn't called from anywhere
		*/
		
	};

	var on_data_arrival = function(data){
		/**
		* is called whenever new data arrives
		*/

		RemoteModel.input_cell = data;
	};

	var on_error = function(error){
		/**
		* called when error occurs with the peer
		*/
	};

	var connect_to = function(id, peer){
		/**
		* connect peer >peer< to the peer with the given >id<
		* returns connection object
		*/
		
		var conn = peer.connect(id);

		return conn;
	};
	
	var retrieve_from_backlog = function(){
		/**
		* gets packet from the linked list
		* and removes it from the list
		*/
		
		var list = RemoteModel.package_backlog;

		if(list.HEAD == null){
			return null;
		}

		var packet = list.HEAD.packet;

		list.HEAD = list.HEAD.next;
		list.HEAD.previous = null;

		return packet;

	};

	var place_to_backlog = function(packet){
		/**
		* puts packet into the linked list
		*/
		var list = RemoteModel.package_backlog;
		var packet_container = {packet: packet}; 
		if(list.HEAD == null){
			list.HEAD = packet_container;
			list.TAIL = packet_container;
		}else{
			packet_container.previous = list.TAIL;
			list.TAIL.next = packet_container;
			list.TAIL = packet_container;
		}
	};
	
	var add_to_next_update = function(data){
		/**
		* call this function to schedule the data to be passed to the master/clients.
		* note that this module will decide itself when and how to send the data,
		* so you are not guaranteed that it'll be send immediately, or with the next update
		* You should account for that. This function is meant to be intelligent and prioritize more important
		* stuff
		*/

		// TEMPORARYYYYYYYYYYYYYYYYYYYYYYYYYY	
		RemoteModel.output_cell = RemoteModel.output_cell || {};
		RemoteModel.output_cell[data.purpose] = data.content;
	};

	var send_out_data = function(){
		/**
		* temp
		*/
		if(RemoteModel.output_cell != null){
			distribute_data(RemoteModel.output_cell);
			RemoteModel.output_cell = null;
			
			
		}

	};

	var get_data = function(){
		/**
		* temp
		*/
		
		return RemoteModel.input_cell;
	};

	return {
		// declare public
		init: init, 
		update: update,
		add_to_next_update: add_to_next_update,
		get_data: get_data,
	};
})();

module.exports = RemoteController;

var Includes = require("../Includes.js"); var include_data = Includes.get_include_data({
	current_module: "RemoteController", 
	include_options: Includes.choices.DEFAULT
}); eval(include_data.name_statements); var include = function(){eval(include_data.module_statements);}
