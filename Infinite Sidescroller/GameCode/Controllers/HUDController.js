var HUDController = (function(){

	var init = function(){
		
		include();
		
		HUDModel.score = new createjs.Text();
		GraphicsController.reg_for_render(HUDModel.score);
		HUDModel.health = new createjs.Text();
		GraphicsController.reg_for_render(HUDModel.health);
		HUDModel.score_title = new createjs.Text();
		GraphicsController.reg_for_render(HUDModel.score_title);
		HUDModel.health_title = new createjs.Text();
		GraphicsController.reg_for_render(HUDModel.health_title);

		HUDModel.health_title.text = "Health: ";
		HUDModel.health_title.x = 10;
		HUDModel.health_title.y = 30;
		HUDModel.health.text = "100";
		HUDModel.health.x = 80;
		HUDModel.health.y = 30;
		HUDModel.health.font = "20px Arial";
		HUDModel.health_title.font = "20px Arial";
		HUDModel.health.color = "#ff0000";
		HUDModel.health_title.color = "#ff0000";
		HUDModel.score_title.text = "Score: ";
		HUDModel.score_title.x = 10;
		HUDModel.score_title.y = 10;
		HUDModel.score.text = "0";
		HUDModel.score.x = 80;
		HUDModel.score.y = 10;
		HUDModel.score.font = "20px Arial";
		HUDModel.score_title.font = "20px Arial";
	};
	
	var update = function(){
		var camera = GraphicsController.get_camera();
		var hero = EntityController.get_my_hero();
		
		update_score(WorldController.get_score());
		update_health(hero.hp);
		
	};
	
	var update_score = function(score){
		HUDModel.score.text = parseInt(score);
	};
	
	var update_health = function(health){
		HUDModel.health.text = parseInt(health);
	};
	
	return {
		// declare public
		init: init, 
		update: update,
	};
})();

module.exports = HUDController;

var Includes = require("../Includes.js"); var include_data = Includes.get_include_data({
	current_module: "HUDController", 
	include_options: Includes.choices.DEFAULT | Includes.choices.RENDERERS
}); eval(include_data.name_statements); var include = function(){eval(include_data.module_statements);}
