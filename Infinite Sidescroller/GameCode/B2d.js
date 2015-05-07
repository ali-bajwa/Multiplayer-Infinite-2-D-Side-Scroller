// This file contains shortcuts for the methods of the Box2D library that are used
// too often to type their long names

var B2d = function(){

};

B2d.prototype.init = function(){
	include();

	this.b2Vec2 = Box2D.Common.Math.b2Vec2;
	this.b2BodyDef = Box2D.Dynamics.b2BodyDef;
	this.b2Body = Box2D.Dynamics.b2Body;
	this.b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
	this.b2Fixture = Box2D.Dynamics.b2Fixture;
	this.b2World = Box2D.Dynamics.b2World;
	this.b2MassData = Box2D.Collision.Shapes.b2MassData;
	this.b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
	this.b2CircleShape = Box2D.Collision.Shapes.b2CircleShape;
	this.b2DebugDraw = Box2D.Dynamics.b2DebugDraw; 
	this.b2ContactListener = Box2D.Dynamics.b2ContactListener;

};

module.exports = new B2d;

var Includes = require("./Includes.js"); var include_data = Includes.get_include_data({
	current_module: "B2d", 
	include_options: Includes.choices.OTHER_STUFF
}); eval(include_data.name_statements); var include = function(){eval(include_data.module_statements);}

