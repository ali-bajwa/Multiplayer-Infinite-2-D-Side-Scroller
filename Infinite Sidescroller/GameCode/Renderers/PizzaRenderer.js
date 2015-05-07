var PizzaRenderer = (function () {

    var spritesheets = {}; // to store spritesheets used by this entity

    var init = function () {
        include(); // satisfy requirements, GOES FIRST
        var get_asset = AssetController.get_asset;
        spritesheets["pizza"] = new createjs.SpriteSheet({
            "framerate": 1,
            "images": [get_asset("pizza")],
            "frames": { "regX": 0, "regY": 0, "height": 15, "width": 15, "count": 1 },
            "animations": {
                "normal": [1, "walk"]
            }
        })
    };

    var register = function (entity_pizza) {
        pizza_animation = GraphicsController.request_animated(spritesheets["pizza"], "normal");
        GraphicsController.set_reg_position(pizza_animation, 0, 0); // change that to adjust sprite position relative to the body
        GraphicsController.reg_for_render(pizza_animation, entity_pizza); // sets ant_animation's position to track the ant's position (updates each tick)
    };

    var render = function (cell) {

    };

    return {
        // declare public
        init: init,
        register: register,
        render: render,
    };
})();

module.exports = PizzaRenderer;

var Includes = require("../Includes.js"); var include_data = Includes.get_include_data({
    current_module: "TerrainCellRenderer",
    include_options: Includes.choices.RENDERER_SPECIFIC
}); eval(include_data.name_statements); var include = function () { eval(include_data.module_statements); }

