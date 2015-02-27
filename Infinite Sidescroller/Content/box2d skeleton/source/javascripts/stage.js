  var Reality, Stage, box2d, config, createjs,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  box2d = require('./vendor/box2d');

  config = require('./config');

  createjs = require('createjs');

  Reality = require('./reality');

  Stage = (function() {
    function Stage() {
      this.update = bind(this.update, this);
      this.add = bind(this.add, this);
      this.createStage = bind(this.createStage, this);
      this.createStage();
    }

    Stage.prototype.createStage = function() {
      this.stage = new createjs.Stage(config.ARCADE_CANVAS);
      return this.stage.snapToPixelsEnabled = true;
    };

    Stage.prototype.add = function(entity) {
      this.stage.addChild(entity.view);
      if (entity.update) {
        return createjs.Ticker.on('tick', entity.update);
      }
    };

    Stage.prototype.update = function(e) {
      return this.stage.update(e);
    };

    return Stage;

  })();

  module.exports = new Stage;

