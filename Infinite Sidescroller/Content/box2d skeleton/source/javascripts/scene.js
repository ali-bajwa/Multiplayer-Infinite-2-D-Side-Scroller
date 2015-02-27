  var Player, Platform, Reality, Scene, Stage, box2d, config, createjs,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  box2d = require('./vendor/box2d');

  config = require('./config');

  createjs = require('createjs');

  Player = require('./player');

  Platform = require('./platform');

  Reality = require('./reality');

  Stage = require('./stage');

  Scene = (function() {
    function Scene() {
      this.createPlayer = bind(this.createPlayer, this);
      this.createPlatform = bind(this.createPlatform, this);
      this.createGround = bind(this.createGround, this);
      this.platforms = [];
      this.createGround();
      this.createPlatform();
      this.createPlayer();
    }

    Scene.prototype.createGround = function() {
      var options;
      options = {
        id: 'ground',
        x: 100,
        y: config.HEIGHT - 10,
        width: config.WIDTH - 200,
        height: 10
      };
      this.ground = new Platform(options);
      return Stage.add(this.ground);
    };

    Scene.prototype.createPlatform = function() {
      var options, platform;
      options = {
        id: 'platform_1',
        x: config.WIDTH / 2 - 75,
        y: 350,
        width: 150,
        height: 10
      };
      platform = new Platform(options);
      return Stage.add(platform);
    };

    Scene.prototype.createPlayer = function() {
      this.player = new Player;
      Stage.add(this.player);
      return this.player.moveToStartingPosition();
    };

    return Scene;

  })();

  module.exports = new Scene;

