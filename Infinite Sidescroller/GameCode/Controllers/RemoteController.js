
var RemoteController = (function(){
	/* manages p2p communication
	*/

	var peer, conn; // TEMPORARY. there will be multiple of those things
	var MEDIATOR_SERVER_KEY = 'a7vojcpf70ysyvi';

	var init = function(){
		/* is ran from the InitController once when the game is loaded */
		include(); // satisfy requirements
		RemoteModel.display = document.getElementById(Config.MAIN_CANVAS_NAME).getContext("2d");

	};

	var update = function(delta){
		/* is ran each tick from the GameController.update_all */

		var cmds = KeyboardController.debug_commands();

		if(!RemoteModel.role_chosen){
			if(cmds("host")){
				become_host();
				RemoteModel.role_chosen = true;
				console.log("i am host");
				
				
			}else if(cmds("connect")){
				connect_to();
				RemoteModel.role_chosen = true;
				console.log("i am player");
				
			}

		}

		if(cmds("send")){
			send_graphics_data(Math.random());
			console.log("sent");
		}

	};

			
	var become_host = function(){
		/**
		* become host for the new game
		*/
		
		peer = new Peer("host", {key: MEDIATOR_SERVER_KEY});
		Config.Remote.i_am = "host";

		peer.on('connection', function(connection) {
			conn = connection;
		});
	};

	var connect_to = function(){
		/**
		* connect to host with the given id to play the game
		*/
		
		peer = new Peer("player", {key: MEDIATOR_SERVER_KEY});
		Config.Remote.i_am = "player";
		conn = peer.connect('host');	
		conn.on('data', on_data_arrival);
		GraphicsController.become_remote();
	};

	var on_data_arrival = function(data){
		/**
		* this function is attahced to the listener for the data arriving
		*/
		RemoteModel.one_packet = data;
	};
	
	

	var get_graphics_data = function(){
		/**
		* returns next data packet recieved from the other side
		*/
		return RemoteModel.one_packet;
	};

	var send_graphics_data = function(data){
		/**
		* sends the data package to the other side
		*/
		if(conn){
			conn.send(data);
		}
	};

	var retrieve_packet = function(){
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

	var place_packet = function(packet){
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
	
	
	return {
		// declare public
		init: init, 
		update: update,
		send_graphics_data: send_graphics_data,
		get_graphics_data: get_graphics_data,
	};
})();

module.exports = RemoteController;

var Includes = require("../Includes.js"); var include_data = Includes.get_include_data({
	current_module: "RemoteController", 
	include_options: Includes.choices.DEFAULT
}); eval(include_data.name_statements); var include = function(){eval(include_data.module_statements);}


