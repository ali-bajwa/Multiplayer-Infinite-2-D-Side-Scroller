var GameModel = new function(){ // main model

	// Notice that all these variables will be initialized from the InitController

	this // easeljs representation of the main canvas

	this.other_players = {}; // players controlled by remote clients

	this.hero; // player controlled by the current user

	this.chomper;

	this.score;
};

module.exports = GameModel;
