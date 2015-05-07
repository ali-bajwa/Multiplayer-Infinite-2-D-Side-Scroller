var HUDRenderer = (function(){
	
	var score;
	var health_bar;
	var score_title;
	var health_outline;
	var healthX;
	var player_head;
	var connected_players;
	var connected_main;
	var connected_head;
	var connected_outline;
	var connected_bar;
	var next_x = 0;
	var Y = 10;
	var screen_W;
	var container;
	var con_con;
	var init = function(){
		include();
		healthX = 100;
		container = new createjs.Container();
		con_con = new createjs.Container();
		get_asset = AssetController.get_asset; // for quicker access
		score = new createjs.Text();
		container.addChild(score);
		//GraphicsController.reg_for_render(score);
		health_bar = new createjs.Shape();
		container.addChild(health_bar);
		//GraphicsController.reg_for_render(health_bar);
		score_title = new createjs.Text();
		container.addChild(score_title);
		//GraphicsController.reg_for_render(score_title);
		health_outline = new createjs.Shape();
		container.addChild(health_outline);
		//GraphicsController.reg_for_render(health_outline);
		player_head = new createjs.Bitmap(get_asset("HeadRed"));
		container.addChild(player_head);
		//GraphicsController.reg_for_render(player_head);
		connected_main= new createjs.Shape();
		con_con.addChild(connected_main);
		//GraphicsController.reg_for_render(connected_main);
		connected_outline_bar = new createjs.Shape();
		con_con.addChild(connected_outline_bar);
		//GraphicsController.reg_for_render(connected_outline_bar);
		connected_bar = new createjs.Shape();
		con_con.addChild(connected_bar);
		//GraphicsController.reg_for_render(connected_bar);
		connected_head = new createjs.Bitmap();
		//container.addChild(score);
		//GraphicsController.reg_for_render(connected_head);
		//container.addChild(con_con);
		GraphicsController.reg_for_render(container);
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
		var connected_players = NetworkController.get_all_connected();
		var connected_len = connected_players.length;
		var player_id_array = Config.Init.player_id_array;
		var asset_ids = ["HeadOrange", "HeadPink", "HeadLPurple", "HeadGreen", "HeadLightBlue", "HeadLightGreen", "HeadBlue", "HeadRed"];
		var connected_player_id;
		var heros = EntityController.get_all_heroes();
		var index;
		screen_w = Config.SCREEN_W;
		//player_id_array.toString();
		for(var i =0; i < connected_len; i++){
			connected_player_id = connected_players[i];
			index = player_id_array.indexOf(connected_player_id);
			container.removeChildAt(index);
		}
		
		
		for(var i =0; i < connected_len; i++){
			connected_player_id = connected_players[i];
			if(player_id_array != null && player_id_array.length > 0){
				// if player id was populated properly, choose asset id corresponding to the index
				var connected_asset = get_asset(asset_ids[player_id_array.indexOf(connected_player_id)]);
			}else{
			var connected_asset = get_asset("HeadRed");
			}
			connected_head.image = connected_asset;
			
			index = player_id_array.indexOf(connected_player_id);
			//create box and postions of box next
			connected_main.graphics.beginStroke("white").setStrokeStyle(1).drawRect(0,0,40,55);
			connected_outline_bar.graphics.beginStroke("red").setStrokeStyle(1).drawRect(0,42,40,10);
			connected_head.x=1;  
			connected_head.y = 1;
			con_con.x = screen_w - 10 - next_x;
			con_con.y = Y;
			container.addChildAt(con_con,index);
			next_x +=50;
		}
		next_x =0;
		connected_players.toString();



		// this stuff should be moved to initialization stage

		var asset_ids = ["HeadOrange", "HeadPink", "HeadLPurple", "HeadGreen", "HeadLightBlue", "HeadLightGreen", "HeadBlue", "HeadRed"];
		if(player_id_array != null && player_id_array.length > 0){
			// if player id was populated properly, choose asset id corresponding to the index
			var asset = get_asset(asset_ids[player_id_array.indexOf(player_id)]);
		}else{
			var asset = get_asset("HeadRed");
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

