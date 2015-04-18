var BackgroundRenderer = (function(){

	var season_array;
	var season_image;
	var cycle;
	var season_threshold;
	
	var hero_progress;
	var hero_progress_to_level;
	var hero_current_level;
		
	var init = function(){
		include(); //sets up dependencies MUST GO FIRST
		
		season_array = [];//stores season sprites
		season_image = ["Winter", "Spring", "Summer", "Fall"];
		cycle = 0; //season cycle
		season_threshold = 2; //So seasons only update once
		
		hero_progress = 0;
		hero_progress_to_level = 199;//season_image[cycle].width*2 + Config.SCREEN_W/2;
		hero_current_level = hero_progress_to_level;
		
		generate_season("Winter", GraphicsController.get_stage().canvas.width, 0);
	};
	
	var render = function(){

		var hero = IdentificationController.get_hero();
		var hero_x = hero.body.GetWorldCenter().x;

		if(Math.round(hero_x) > hero_current_level){
			hero_progress++;
			hero_current_level += hero_progress_to_level;
			hero.score += (hero_progress*500);
		}
		
		//Potentially change seasons based on hero progress
		change_seasons(hero_progress);
		Config.World.season = cycle;
		
		//perform parallax effect with background
		background_loop(hero_x,hero_progress);
	};
	
	//Generates tiled background for season
	var generate_season = function(season_image, canvas_width, start){
		for(i=0; i<3; i++){//create tiles 3 at a time
			var season = GraphicsController.request_bitmap(season_image);
			season.regY -= season.image.height/2;
			//create a new tile with offset
			season.x = start + i*season.image.width;
			GraphicsController.get_stage().addChildAt(season, 0);
			season_array.push(season);
		}
	};
	
	//checks for and handles potential season change
	var change_seasons = function(progress){
		var flag = false;
		if(progress == season_threshold){ //seasons will change every even progress number
			season_threshold += 2;
			flag = true;
		}
		if(flag){
			console.log("generating season");
			delete_all_season();
			cycle = (cycle+1)%4;
			generate_season(season_image[cycle], GraphicsController.get_stage().canvas.width, Config.Player.movement_edge / 30);
		}
	};
	
	//scrolls the background along with the player
	var background_loop = function(hero_x, progress){
		for(i=0; i<season_array.length; i++){
			//season_array[i].x = (i * 799) + GraphicsModel.camera.offset.x;
			//season_array[i].y = GraphicsModel.camera.offset.y;
			season_array[i].x = ((i + progress) * 799) - (hero_x * 4);
			season_array[i].y = GraphicsController.get_camera().offset.y;
		}
	};

	//deletes all background objects
	var delete_all_season = function(){
		for(var i = 0; i < season_array.length; i++){
			GraphicsController.get_stage().removeChild(season_array[i]);
		}
		season_array = [];
	};
	
	//returns the current season
	var get_season = function(){
		return cycle;
	};

	var register = function(background){
		/* is ran for every entity of this type that was just created and should
		get graphics representation. You are given the entity instance and is supposed
		to crete graphics instance, and GraphicsController.reg_for_render(graphics_instance, entity_instance); it 
		*/

		
	};

	return {
		// declare public
		init: init, 
		register: register,
		render: render,
	};
})();

module.exports = BackgroundRenderer;

var Includes = require("../Includes.js"); var include_data = Includes.get_include_data({
	current_module: "BackgroundRenderer", 
	include_options: Includes.choices.RENDERER_SPECIFIC
}); eval(include_data.name_statements); var include = function(){eval(include_data.module_statements);}


