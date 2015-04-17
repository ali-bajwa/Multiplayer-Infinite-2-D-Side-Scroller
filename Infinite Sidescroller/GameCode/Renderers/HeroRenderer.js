var HeroRenderer = (function(){

	var spritesheets = {}; // to store spritesheets used by this entity

	var init = function(){
		/* is ran from GraphicsController.init once during game loading
			use this function to create spritesheets and such
			like spritesheets.first = new createjs.Spritesheet(...);
		*/
		include(); // satisfy requirements, GOES FIRST
		var get_asset = AssetController.get_asset;
		spritesheets["hero"] = new createjs.SpriteSheet({
			"framerate": 1,
			"images": [get_asset("Hero")], //get_asset("HeroR"), get_asset("HeroW")
			"frames": { "regX": 25, "regY": 25, "height": 50, "width": 50, "count": 16},
			"animations": {
				stand: {
				frames: [0]
				},
				finish: {
					frames: [8]
				},				
				walk: {
					 frames: [0,1, 2],
					 speed: 0.4
				 },
                jump: {
					frames: [3, 4, 5, 6, 7, 8],
					speed: 0.3
				},
                death: {
					frames: [9, 10, 11, 12, 13, 14, 15],
					speed: 0.3
				}
			}
		})
		//SpriteSheetUtils.addFlippedFrames(spriteSheets["Hero"], true, false, false);
	};

	var register = function(entity_hero){
		/* is ran for every entity of this type that was just created and should
		get graphics representation. You are given the entity instance and is supposed
		to crete graphics instance, and GraphicsController.reg_for_render(graphics_instance, entity_instance); it 
		*/

		hero_animation = GraphicsController.request_animated(spritesheets["hero"], "stand");
		hero_animation.graphics_id = "hero";
		GraphicsController.set_reg_position(hero_animation, -25, -25);
		GraphicsController.reg_for_render(hero_animation, entity_hero);
		GraphicsController.follow(entity_hero.id);

	};

	var render = function(hero){
		/* 	is ran each tick from GraphicsController, for every registered object of this type
			is given >graphics_instance< parameter, which is also supposed to contain
			physical_instance property containing entity_instance, if it was attched correctly
		*/
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
		
		if(hero.physical_instance.state=="stand"){
			hero.gotoAndPlay("stand");
		}
	};

	return {
		// declare public
		init: init, 
		register: register,
		render: render,
	};
})();

module.exports = HeroRenderer;

var Includes = require("../Includes.js"); var include_data = Includes.get_include_data({
	current_module: "HeroRenderer", 
	include_options: Includes.choices.RENDERER_SPECIFIC
}); eval(include_data.name_statements); var include = function(){eval(include_data.module_statements);}
