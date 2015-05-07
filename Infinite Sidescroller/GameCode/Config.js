var Config = function(){
	this.SCREEN_W = 0; // set up when the page is loaded (to 95% of width of containing element) 
	this.SCREEN_H = 600;

	this.MAIN_CANVAS_NAME = "display_canvas";
	this.DEBUG_CANVAS_NAME = "debug_canvas";

	// Frames Per Second. Essentially, frequency of createjs.Ticker 
	// Warning! Frequency of the Box2D physics updates may be different
	// (Currently not implemented)
	this.FPS = 30; 
	
	//the movement edge, controls terrain generation
	this.movement_edge = 0;

	// Box2D stuff >>>
	this.B2D = {
		SCALE: 30,
		SPS: 60, 			// Steps Per Second
		VELOCITY_ITR: 8,	// velocity iterations
		POSITION_ITR: 3,	// position iterations
		debug_draw: false
	};

	this.TerrainSlice = {
		grid_rows: 20,
		grid_columns: 20,
		cell_w: 1, // in meters

		// is automatically incremented each time new TerrainSliceModel is instantiated:
		next_slice_id: 0 
	};

	this.World = {
		maxy: 22,

	};

	this.Remote = {
		master: false, // am I the one with whome other players sync? 
		connected: false, // am I in multiplayer mode
		connection_timeout: 1000, // ms
		notification_wait: 3000, // ms !!! SHOULD BE AT LEAST 1000 bigger THAN THE PREVIOUS ONE
	};
	
	this.Init = {
		session_id: null,
		player_id: null,
		mode: null,
		initial_lives: 1,

		// for multiplayer game you have certain time limit
		// to join the game. In this time limit players shouldn't be able to go past
		// certain point of the map.
		movement_blocked: true,
		time_limit: 15, // seconds
		// we should begin automatically after everyone is joined

	}
};

module.exports = new Config;
