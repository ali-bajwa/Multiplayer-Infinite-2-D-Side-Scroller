//Model Component (representation of enemy data)


var AntModel = function(){
	//define your constants here
	this.H = 31;//height
	this.W = 50;
	this.sprite_array = [];  //single source for sprites
	
	this.hero_hurt_me = false;
	this.me_hurt_hero = false;
	this.death_tick = 0;

	//set your game logic parameters here
	this.object_id = 1; //hardcode a unique identifier for each new enemy class
	this.hp = 2;
	this.speed = 2;
	this.damage = 1;
	//this.attack_cooldown = 4; //use this for enemies who need
	this.can_attack = true;//use this for enemies who alternate between 
	//this.cooldown_timer=-1;
	this.AI_state = "walk";//use this to keep track of the enemy's AI state
	
	//define fixture (friction, density, etc.)
	this.fixture_def = new box2d.b2FixtureDef
	//density = (mass/volume)
	this.fixture_def.density = 1;
	//friction is what you would imagine
	this.fixture_def.friction = 1;
	//restitution = bounciness
	this.fixture_def.restitution = 0.5;
	//shape = the internal box2d polygon used for collision
	this.fixture_def.shape = new box2d.b2PolygonShape().AsBox(H,W);
	
	//define body (physics stuff)
	this.body_def = new box2d.b2BodyDef();
	this.body_def.type = box2d.b2Body.b2_dynamicBody;
	this.body_def.is_sensor = true;
	this.body.SetLinearVelocity(new box2d.b2Vec2(0, 0));
	
	//define sprite (the graphics)
	//walking sprite

	walk_sprite_sheet = new createjs.SpriteSheet({
		"framerate": 2,
		"images": ["../GameCode/assets/art/AntChompers.png"],
		"frames": { "regX": 0, "regY": 15, "height": 15, "width": 50, "count": 2 },
		"animations": {"walk": [0, 1, "walk"]}
	})

	upside_down_sprite_sheet = new createjs.SpriteSheet({
		"framerate": 2,
		"images": ["../GameCode/assets/art/AntChompers2.png"],
		"frames": { "regX": 0, "regY": 15, "height": 15, "width": 50, "count": 2 },
		"animations": {"upside-down":[0,1, "upside-down"]}
	})

	death_sprite_sheet = new createjs.SpriteSheet({
		"framerate": 2,
		"images": ["../GameCode/assets/art/AntChompersDeath.png"],
		"frames": { "regX": 0, "regY": 15, "height": 15, "width": 50, "count": 2 },
		"animations": {"death":[0,1, "death"]}

	})


	this.sprite_array.push(walk_sprite_sheet);
	this.sprite_array.push(upside_down_sprite_sheet);
	this.sprite_array.push(death_sprite_sheet);

	this.sprite = new createjs.sprite(walk_sprite_sheet, AI_state);

	//Accessor to state and sprite
	this.change_state  = function(progress_state, state_num)
	{
		this.state = progress_state;
		this.sprite = this.sprite_array[state_num];

	}
	/*
	NOTES ON GRAPHICS
	each sprite sheet contains a number of frames in a single animation. 
	create a new sprite_sheet object for each animation
	set this.sprite to the default starting animation
	
	framerate is the number of frames cycled per second
	images loads the actual png file from the assets folder
	frames specifies how the raw image should be partitioned to generate the actual frames 
		regX & regY are xy offsets
		height and width give the dimensions of the individual frames
		count specifies the number of frames
	You need to make sure that height*count <= the height of the original file (same for width)
	
	
	be aware that the origin of the body.shape(H/2,W/2) != the origin of the sprite (0,0)
	regX and regY are xy offsets for the sprite. use these to keep the 
	sprite in the right place relative to the box2d body
	
	*/
	
};

module.export = AntModel;

var Includes = require("../Includes.js"); var include_data = Includes.get_include_data({
	current_module: "EnemyController", 
	include_options: Includes.choices.DEFAULT
}); eval(include_data.name_statements); var include = function(){eval(include_data.module_statements);}
