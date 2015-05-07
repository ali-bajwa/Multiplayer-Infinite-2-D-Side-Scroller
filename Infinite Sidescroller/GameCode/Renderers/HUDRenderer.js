var HUDRenderer = (function(){
	
	var score;
	var health_bar;
	var score_title;
	var health_outline;
	var healthX;
	var player_head;
	
	var init = function(){
		include();
		healthX = 100;
		
		get_asset = AssetController.get_asset; // for quicker access
		score = new createjs.Text();
		GraphicsController.reg_for_render(score);
		health_bar = new createjs.Shape();
		GraphicsController.reg_for_render(health_bar);
		score_title = new createjs.Text();
		GraphicsController.reg_for_render(score_title);
		health_outline = new createjs.Shape();
		GraphicsController.reg_for_render(health_outline);
		player_head = new createjs.Bitmap(get_asset("HeadRed"));
		GraphicsController.reg_for_render(player_head);
		
		health_outline.x = 30;
		health_outline.y = 25;
		health_outline.graphics.beginStroke("red").setStrokeStyle(1).drawRect(30,25,100,20);
		health_bar.x = 30;
		health_bar.y = 25;
		health_bar.graphics.beginFill("red");
		health_bar.graphics.drawRect(30,25,healthX, 20);
		
		player_head.x = 10;
		player_head.y = 35;
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
		var asset;
		//var player_id = Config.Init.player_id;
		var player_id = NetworkController.get_network_id();
		console.log("hud render player_id", player_id);
		switch(player_id){
			case "player1":
				asset = get_asset("HeadOrange");
				break;
			case "player2":
				asset = get_asset("HeadPink");
				break;
			case "player3":
				asset = get_asset("HeadPurple");
				break;
			case "player4":
				asset = get_asset("HeadGreen");
				break;
			case "player5":
				asset = get_asset("HeadLightBlue");
				break;
			case "player6":
				asset = get_asset("HeadLightGreen");
				break;
			case "player7":
				asset = get_asset("HeadBlue");
				break;
			case "player8":
				asset = get_asset("HeadRed");
				break;
			default:
				asset = get_asset("HeadRed");
				
		}
		player_head.image = asset;
		update_score(WorldController.get_score());
		if(hero){
			update_health(hero.hp);
		}
		
	};
	
	var update_score = function(new_score){
		score.text = parseInt(new_score);
	};
	
	var update_health = function(new_health){
		healthX = parseInt(new_health);
		health_bar.graphics.clear();
		health_bar.graphics.beginFill("red");
		if(healthX >= 0){
			health_bar.graphics.drawRect(30,25,healthX, 20);
		}
		else{
			health_bar.graphics.drawRect(30,25,1, 20);
		} 
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

