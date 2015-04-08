var AssetModel = new function(){
	// As always, almost anything is initialized in the InitController
	
	this.loader;

	this.manifest = [ // defining resources to be loaded in bulk with preload.js
			{src: "greek_warrior.png", id: "greek_warrior"},
			//{src:, id:},
			{src: "middle_terrain.png", id:"middle_terrain"},
			{src: "bottom_terrain.png", id: "bottom_terrain"},
			{src: "grass.png", id: "grass"},
			{src: "AntChompers.png", id: "Ant1"},
			{src: "AntChompers2.png", id: "Ant2"},
			{src: "AntChompersDeath.png", id: "Ant3"},
			{src: "Greek Landscape fall.png", id: "Fall"},
			{src: "Greek Landscape spring.png", id: "Spring"},
			{src: "Greek Landscape winter.png", id: "Winter"},
			{src: "Greek Landscape summer.png", id: "Summer"}
		]; 
		// TODO make adding resources easier? Automatic loading 
		// of everything from assets, automatic names etc.?

	this.shapes = {}; // maybe this aren't needed

	this.bitmaps = {};

	this.animations = {};

};

module.exports = AssetModel;
