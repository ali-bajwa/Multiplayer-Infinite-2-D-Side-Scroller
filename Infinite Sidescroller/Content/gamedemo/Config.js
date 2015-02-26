var Config = {
	SCREEN_W: 0, // set up when the page is loaded (to 95% of width of containing element) 
	SCREEN_H: 600,


	// Frames Per Second. Essentially, frequency of createjs.Ticker 
	// Warning! Frequency of the Box2D physics updates may be different
	// (Currently not implemented)
	FPS: 30, 

	B2D_SCALE: 30
	// END Constants section <<<
};

module.exports = Config;
