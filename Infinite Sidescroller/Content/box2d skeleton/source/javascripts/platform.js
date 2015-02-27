  var Platform, Reality, box2d, config, createjs,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  box2d = require('./vendor/box2d');

  config = require('./config');

  createjs = require('createjs');

  Reality = require('./reality');

  Platform = (function() {
    function Platform(options) {
      this.createBox2DBody = bind(this.createBox2DBody, this);
      this.createBodyDefinition = bind(this.createBodyDefinition, this);
      this.createFixtureDefinition = bind(this.createFixtureDefinition, this);
      this.createVectors = bind(this.createVectors, this);
      this.options = options;
      this.vertex = [];
      this.createVectors();
      this.createFixtureDefinition();
      this.createBodyDefinition();
      this.createBox2DBody();
    }

    Platform.prototype.createVectors = function() {
      var coords, i, j, ref, results, vector;
      coords = [[0, 0], [this.options.width, 0], [this.options.width, this.options.height], [0, this.options.height]];
      results = [];
      for (i = j = 0, ref = coords.length - 1; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
        vector = new box2d.b2Vec2;
        vector.Set(coords[i][0] / config.SCALE, coords[i][1] / config.SCALE);
        results.push(this.vertex.push(vector));
      }
      return results;
    };

    Platform.prototype.createFixtureDefinition = function() {
      this.fixtureDef = new box2d.b2FixtureDef;
      this.fixtureDef.density = 0;
      this.fixtureDef.friction = 0.5;
      this.fixtureDef.restitution = 0;
      this.fixtureDef.shape = new box2d.b2PolygonShape;
      return this.fixtureDef.shape.SetAsArray(this.vertex, this.vertex.length);
    };

    Platform.prototype.createBodyDefinition = function() {
      this.bodyDef = new box2d.b2BodyDef;
      this.bodyDef.type = box2d.b2Body.b2_staticBody;
      this.bodyDef.position.Set(this.options.x / config.SCALE, this.options.y / config.SCALE);
      return this.bodyDef.userData = this.options.id;
    };

    Platform.prototype.createBox2DBody = function() {
      this.body = Reality.world.CreateBody(this.bodyDef);
      this.body.CreateFixture(this.fixtureDef);
      this.view = new createjs.Shape;
      return this.view.graphics.beginFill('#000').drawRect(this.options.x, this.options.y, this.options.width, this.options.height);
    };

    return Platform;

  })();

  module.exports = Platform;

