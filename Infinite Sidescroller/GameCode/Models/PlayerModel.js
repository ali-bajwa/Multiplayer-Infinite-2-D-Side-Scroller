var PlayerModel = function(){
	this.hero;
	this.type = "hero";
	this.hp = 100;
	this.wound = false;
	this.jumps = 0;
};

module.exports = new PlayerModel;

