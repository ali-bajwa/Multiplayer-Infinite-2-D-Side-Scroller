  var Reality, box2d, config, createjs,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  box2d = require('./vendor/box2d');

  config = require('./config');

  createjs = require('createjs');

  Reality = (function() {
    function Reality() {
      this.createDebugCanvas = bind(this.createDebugCanvas, this);
      this.createPhysics = bind(this.createPhysics, this);
      this.createArcadeCanvas = bind(this.createArcadeCanvas, this);
      this.createPhysics();
      this.createArcadeCanvas();
      this.createDebugCanvas();
    }

    Reality.prototype.createArcadeCanvas = function() {
      this.arcade = config.ARCADE_CANVAS;
      this.arcade.width = config.WIDTH;
      return this.arcade.height = config.HEIGHT;
    };

    Reality.prototype.createPhysics = function() {
      var gravity;
      gravity = new box2d.b2Vec2(0, 50);
      return this.world = new box2d.b2World(gravity, true);
    };

    Reality.prototype.createDebugCanvas = function() {
      this.debug = {};
      this.debug.canvas = config.DEBUG_CANVAS;
      this.debug.canvas.width = config.WIDTH;
      this.debug.canvas.height = config.HEIGHT;
      this.debug.ctx = this.debug.canvas.getContext('2d');
      this.drawer = new box2d.b2DebugDraw;
      this.drawer.SetSprite(this.debug.ctx);
      this.drawer.SetDrawScale(config.SCALE);
      this.drawer.SetFillAlpha(0.3);
      this.drawer.SetFlags(box2d.b2DebugDraw.e_shapeBit | box2d.b2DebugDraw.e_jointBit);
      return this.world.SetDebugDraw(this.drawer);
    };

    return Reality;

  })();

  module.exports = new Reality;

