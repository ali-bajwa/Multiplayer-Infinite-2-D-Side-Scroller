  var Game, Reality, Scene, Stage, Stats, config, createjs,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  config = require('./config');

  createjs = require('createjs');

  Stats = require('stats');

  Reality = require('./reality');

  Scene = require('./scene');

  Stage = require('./stage');

  Game = (function() {
    function Game() {
      this.drawDebug = bind(this.drawDebug, this);
      this.update = bind(this.update, this);
      this.run = bind(this.run, this);
      this.setPaused = bind(this.setPaused, this);
      this.setPlay = bind(this.setPlay, this);
      this.toggleDebug = bind(this.toggleDebug, this);
      this.setupStats = bind(this.setupStats, this);
      this.bindEvents = bind(this.bindEvents, this);
      this.play = true;
      this.showDebug = true;
      this.fps = 60;
      this.bindEvents();
      this.run();
      if (config.SHOW_FPS) {
        this.setupStats();
      }
    }

    Game.prototype.bindEvents = function() {
      window.addEventListener('blur', this.setPaused);
      window.addEventListener('focus', this.setPlay);
      return document.getElementById('toggle-debug').onclick = this.toggleDebug;
    };

    Game.prototype.setupStats = function() {
      this.stats = new Stats;
      this.stats.setMode(0);
      this.stats.domElement.style.position = 'absolute';
      this.stats.domElement.style.right = '0px';
      this.stats.domElement.style.top = '0px';
      return document.body.appendChild(this.stats.domElement);
    };

    Game.prototype.toggleDebug = function() {
      this.showDebug = !this.showDebug;
      return Reality.debug.canvas.style.display = (this.showDebug ? 'block' : 'none');
    };

    Game.prototype.setPlay = function() {
      this.play = true;
      return createjs.Ticker.setPaused(false);
    };

    Game.prototype.setPaused = function() {
      this.play = false;
      return createjs.Ticker.setPaused(true);
    };

    Game.prototype.run = function() {
      createjs.Ticker.setFPS(this.fps);
      createjs.Ticker.useRAF = true;
      return createjs.Ticker.on('tick', this.update);
    };

    Game.prototype.update = function(e) {
      if (this.play) {
        if (config.SHOW_FPS) {
          this.stats.begin();
        }
        Stage.update(e.delta);
        Reality.world.Step(1 / this.fps, 10, 10);
        if (this.showDebug) {
          this.drawDebug(e);
        }
        if (config.SHOW_FPS) {
          return this.stats.end();
        }
      }
    };

    Game.prototype.drawDebug = function(e) {
      Reality.debug.ctx.save();
      Reality.debug.ctx.translate(Stage.stage.x, Stage.stage.y);
      Reality.debug.ctx.clearRect(0, 0, config.WIDTH, config.HEIGHT);
      Reality.world.SetDebugDraw(Reality.drawer);
      Reality.world.DrawDebugData();
      return Reality.debug.ctx.restore();
    };

    return Game;

  })();

  new Game;

