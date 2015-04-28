var HUDRenderer = (function(){
	
	var score;
	var health;
	var score_title;
	var health_title;

	var init = function(){
		
		include();
		
		score = new createjs.Text();
		GraphicsController.reg_for_render(score);
		health = new createjs.Text();
		GraphicsController.reg_for_render(health);
		score_title = new createjs.Text();
		GraphicsController.reg_for_render(score_title);
		health_title = new createjs.Text();
		GraphicsController.reg_for_render(health_title);

		health_title.text = "Health: ";
		health_title.x = 10;
		health_title.y = 30;
		health.text = "100";
		health.x = 80;
		health.y = 30;
		health.font = "20px Arial";
		health_title.font = "20px Arial";
		health.color = "#ff0000";
		health_title.color = "#ff0000";
		score_title.text = "Score: ";
		score_title.x = 10;
		score_title.y = 10;
		score.text = "0";
		score.x = 80;
		score.y = 10;
		score.font = "20px Arial";
		score_title.font = "20px Arial";
	};
	
	var render = function(){
		var camera = GraphicsController.get_camera();
		var hero = EntityController.get_my_hero();
		
		update_score(WorldController.get_score());
		if(hero){
			update_health(hero.hp);
		}
		
	};
	
	var update_score = function(new_score){
		score.text = parseInt(new_score);
	};
	
	var update_health = function(new_health){
		health.text = parseInt(new_health);
	};
	
	return {
		// declare public
		init: init, 
		render: render,
	};
})();

module.exports = HUDRenderer;

var Includes = require("../Includes.js"); var include_data = Includes.get_include_data({
	current_module: "HUDRenderer", 
	include_options: Includes.choices.RENDERER_SPECIFIC
}); eval(include_data.name_statements); var include = function(){eval(include_data.module_statements);}

