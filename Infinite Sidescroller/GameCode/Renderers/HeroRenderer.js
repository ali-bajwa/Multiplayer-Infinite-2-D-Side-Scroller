var HeroRenderer = (function(){

	var spritesheets = {}; // to store spritesheets used by this entity

	var init = function(){
		/* is ran from GraphicsController.init once during game loading
			use this function to create spritesheets and such
			like spritesheets.first = new createjs.Spritesheet(...);
		*/
		include(); // satisfy requirements, GOES FIRST
		
		//SpriteSheetUtils.addFlippedFrames(spriteSheets["Hero"], true, false, false);
	};

	var register = function(entity_hero){
		/* is ran for every entity of this type that was just created and should
		get graphics representation. You are given the entity instance and is supposed
		to crete graphics instance, and GraphicsController.reg_for_render(graphics_instance, entity_instance); it 
		*/
		var hero_sprite;
		var hero_index;
		var en_id = entity_hero.player_id;
		var id = NetworkController.get_network_id();
		var player_id = Config.Init.player_id;
		var player_id_array = Config.Init.player_id_array;
		var get_asset = AssetController.get_asset;
		//console.log("Player id", id);
		//console.log("entity id", en_id);
		//switch(en_id){
			//case "player1":
				//hero_index = "HeroOrange";
				//hero_sprite = get_asset("HeroOrange");
				//break;
			//case "player2":
				//hero_index = "HeroPink";
				//hero_sprite = get_asset("HeroPink");
				//break;
			//case "player3":
				//hero_index = "HeroLPurple";
				//hero_sprite = get_asset("HeroLPurple");
				//break;
			//case "player4":
				//hero_index = "HeroGreen";
				//hero_sprite = get_asset("HeroGreen");
				//break;
			//case "player5":
				//hero_index = "HeroLightBlue";
				//hero_sprite = get_asset("HeroLightBlue");
				//break;
			//case "player6":
				//hero_index = "HeroLightGreen";
				//hero_sprite = get_asset("HeroLightGreen");
				//break;
			//case "player7":
				//hero_index = "HeroBlue";
				//hero_sprite = get_asset("HeroBlue");
				//break;
			//case "player8":
				//hero_index = "HeroRed";
				//hero_sprite = get_asset("HeroRed");
				//break;
			//default:
				//hero_index = "HeroRed";
				//hero_sprite = get_asset("HeroRed");
				

				
		//}
		var asset_ids = ["HeroOrange", "HeroPink", "HeroLPurple", "HeroGreen", "HeroLightBlue", "HeroLightGreen", "HeroBlue", "HeroRed", "HeroRed"];
			
		if(player_id_array != null && player_id_array.length > 0){
			// if player id was populated properly, choose asset id corresponding to the index
			var hero_index = asset_ids[player_id_array.indexOf(en_id)];
		}else{
			var hero_index = "HeroRed";
		}
		var hero_sprite = get_asset(hero_index);

		// spritesheet is recreated each time hero is spawned. that is completely unnecessary
		spritesheets[hero_index] = new createjs.SpriteSheet({
			"framerate": 1,
			"images": [hero_sprite], //get_asset("HeroR"), get_asset("HeroW")
			"frames": { "regX": 25, "regY": 25, "height": 50, "width": 50, "count": 16},
			"animations": {
				"stand": {
				frames: [0]
				},
				"finish": {
					frames: [8]
				},				
				"walk": {
					 frames: [0,1, 2],
					 speed: 0.2
				 },
				"jump": {
					frames: [3, 4, 5, 6, 7, 8],
					speed: 0.2
				},
				"death": {
					frames: [9, 10, 11, 12, 13, 14, 15],
					speed: 0.1,
					next: "death"
				},
				"decay": {
					frames: [15]
				},
			}
		})

		hero_animation = GraphicsController.request_animated(spritesheets[hero_index], "stand");
		hero_animation.graphics_id = hero_index;
		GraphicsController.set_reg_position(hero_animation, -25, -25);
		GraphicsController.reg_for_render(hero_animation, entity_hero);
		if(entity_hero.player_id == NetworkController.get_network_id()){
			GraphicsController.follow(entity_hero.id);
		}

	};
	/*
	var render = function(hero){

		if(hero.physical_instance.state=="walk"&&hero.physical_instance.is_walk == true){
			if(hero.physical_instance.walk_tick ==1){
				hero.gotoAndPlay("walk");
			}
			hero.physical_instance.walk_tick++;
			if(hero.physical_instance.walk_tick ==10){
				hero.physical_instance.state= "stand";
				hero.physical_instance.is_walk = false;
			}
		}
		
		if(hero.physical_instance.state=="jump"){
			if(hero.physical_instance.jump_tick ==1){
				hero.gotoAndPlay("jump");
			}
			hero.physical_instance.jump_tick++;
			if(hero.physical_instance.jump_tick >= 20){
				hero.gotoAndPlay("finish");
				if(hero.physical_instance.jumps==0){
					hero.physical_instance.state="finish";
				}
				
			}
		}
		
		if(hero.physical_instance.state=="finish"){
			hero.gotoAndPlay("finish");
		}
		if(hero.physical_instance.state=="deathFinal"){
			hero.gotoAndPlay("deathFinal");
		}
		if(hero.physical_instance.state=="stand"){
			hero.gotoAndPlay("stand");
		}
		//console.log(hero.physical_instance.state);
		if (hero.physical_instance.state == "death") {
			//console.log(hero.physical_instance.death_tick);
			if(hero.physical_instance.death_tick ==1){
			    hero.gotoAndPlay("death");
			}
			else if(hero.physical_instance.death_tick >=20){
				hero.physical_instance.state="deathFinal";
			}
		}
		
		//set direction
		if (hero.physical_instance.left){ //if direction == right, flip right
			hero.scaleX = -1;
		}else{ //else flip left
			hero.scaleX = 1;
		}
	};
	*/

	return {
		// declare public
		init: init, 
		register: register,
		//render: render,
	};
})();

module.exports = HeroRenderer;

var Includes = require("../Includes.js"); var include_data = Includes.get_include_data({
	current_module: "HeroRenderer", 
	include_options: Includes.choices.RENDERER_SPECIFIC
}); eval(include_data.name_statements); var include = function(){eval(include_data.module_statements);}
