var HUDRenderer = (function(){
	
	var score;
	var health_bar;
	var score_title;
	var health_outline;
	var healthX;
	var player_head;
	var connected_players;
	var connected_main;
	var connected_outline;
	var connected_bar;
	var next_x = 0;
	var Y = 10;
	var screen_W;
	var container;
	var con_con;

	// remote ids associated w/ easeljs graphic representations
	var remote_hero_icons = {};

	var asset_ids = ["HeadOrange", "HeadPink", "HeadLPurple", "HeadGreen", "HeadLightBlue", "HeadLightGreen", "HeadBlue", "HeadRed"];

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



		// make less horrible TODO:
		con_con.addChild(connected_outline_bar);
		position_remote_icons_container();

		//GraphicsController.reg_for_render(connected_outline_bar);
		connected_bar = new createjs.Shape();
		con_con.addChild(connected_bar);
		//GraphicsController.reg_for_render(connected_bar);
		//container.addChild(score);
		//GraphicsController.reg_for_render(connected_head);
		container.addChild(con_con);
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
		var heros = EntityController.get_all_heroes();
		var index;
		screen_w = Config.SCREEN_W;
		//console.log("screen width", Config.SCREEN_W);
		//player_id_array.toString();
		//console.log("player_id_array: ", player_id_array);
		
		/*for(var i =0; i < connected_len; i++){
			connected_player_id = connected_players[i];
			index = player_id_array.indexOf(connected_player_id);
			container.removeChildAt(index);
		}*/
		
		
		for(var i =0; i < connected_len; i++){
			var connected_player_id = connected_players[i];
			//console.log("connected player: ", connected_player_id);

			if(remote_hero_icons[connected_player_id] == null){
				var icon = get_player_icon(player_id);
				remote_hero_icons[connected_player_id] = icon;
				position_player_icon(icon, connected_player_id);
			}
			
			//index = player_id_array.indexOf(connected_player_id);

			//create box and postions of box next
			/*connected_main.graphics.beginStroke("white").setStrokeStyle(1).drawRect(0,0,40,55);
			connected_outline_bar.graphics.beginStroke("red").setStrokeStyle(1).drawRect(0,42,40,10);
			connected_head.x=1;  
			connected_head.y = 1;
			con_con.x = screen_w - 10 - next_x;
			con_con.y = Y;
			container.addChildAt(con_con,index);
			next_x +=50;*/
		}
		next_x =0;
		connected_players.toString();
	
		// this stuff should be moved to initialization stage

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

	var position_remote_icons_container = function(arguments){
		/**
		* description
		*/

		var icon_container = con_con;
		var cell_size = 50;


		if(Config.SCREEN_W >= 600){
			icon_container.x = Config.SCREEN_W - cell_size * 4; // space for 4 player heads
		}else{
			icon_container.x = 400;
		}
	
		
		var shape = new createjs.Shape();                                       
		shape.graphics.beginFill("#ff0000").drawRect(0, 0, 10, 10);             
		//shape.x = Config.SCREEN_W - 10; // screen width minus the width of the shape (registration point is top left corner) 
		con_con.addChild(shape);
	};
	
	

	var position_player_icon = function(icon, player_id){
		/**
		* position icon of the remote player on the HUD
		*/
		
		var cell_size = 50;
		var icon_container = con_con;

		var player_id_array = Config.Init.player_id_array;
		var index = player_id_array.indexOf(player_id);
		var lvl = (index < 4) ? 1 : 2; // icon displayed on the first or second level

		var offset_y = cell_size * lvl;
		var offset_x = index * cell_size;
		icon.x = offset_x;
		icon.y = offset_y;
		
	};
	
	

	var get_player_icon = function(player_id){
		/**
		* description
		*/

		var player_id_array = Config.Init.player_id_array;

		if(player_id_array != null && player_id_array.length > 0){
				// if player id was populated properly, choose asset id corresponding to the index
			var connected_asset = get_asset(asset_ids[player_id_array.indexOf(player_id)]);
		}else{
			var connected_asset = get_asset("HeadRed");
		}
		var player_icon = new createjs.Bitmap(connected_asset);

		return player_icon;
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

