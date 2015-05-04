var PizzaLogic = (function () {

    var Pizza = function () {
        /* Will be instPizzaiated for every created entity to hold all the information 
			about the physical (not graphical) state of the entity in question. 
			declare the properties like this:
			this.some_state_variable_initial_value = 0;
			instPizzaiate (most likely in the spawn function) like that:
			var new_entity_instance = new Pizza();
		*/
        var entity = EntityController.create_abstract_entity();

        entity.animation = "normal";
        entity.can_attack = false;
        entity.used = false;
        entity.point_value = 0;
        entity.is_alive = false;
        entity.regen = -25;

        return entity;
    };

    var init = function () {
        /* Is run from the EntityController.init once during game loading 
		 	you should assign type to your model here using the identification controller
		 */
        include(); // satisfy requirements, GOES FIRST
        IdentificationController.assign_type(Pizza, "pizza");
    };

    var spawn = function (x, y) {
        /* spawn instance of this entity at the given coordinates
			you will have to create new entity instance, assign it id
			using the IdentificationController.assign_id(entity_instance),
			assign it a body which you can get through PhysicsController
			do any other stuff you wPizza to do during spawning,
			and finally you HAVE TO(!!!) return the instance you just created from this function
		*/

        var new_Pizza = new Pizza();
        new_Pizza.type = "pizza";
        var id = IdentificationController.assign_id(new_Pizza);

        new_Pizza.body = PhysicsController.get_rectangular({ x: x, y: y, border_sensors: false }, new_Pizza);

        return new_Pizza;

    };

    var tick_AI = function (Pizza) {
        /* Is ran each tick from the EntityController.update for every registered
			entity of this type. I given entity_instance
		*/

        //if enemy is dead, die
        //if (Pizza.body.GetWorldCenter().y > 22 || Pizza.body.GetWorldCenter().x < Config.Player.movement_edge - 1) {
        //EntityController.delete_entity();
        //console.log("drop of death");
        //}
        //
        if (Pizza.used) {
            Pizza.die();
        }
    };

    // // //Set up Collision handler


    var begin_contact = function (contact, info) {
        //handle collisions here
        if (info.Them.entity.type == "hero" && info.Them.entity.hp < 100) {
            info.Me.entity.used = true;
        }

    };

    var end_contact = function (contact, info) {

    };


    return {
        // declare public
        init: init,
        spawn: spawn,
        tick_AI: tick_AI,
        begin_contact: begin_contact,
        end_contact: end_contact,
    };
})();

module.exports = PizzaLogic;

var Includes = require("../Includes.js"); var include_data = Includes.get_include_data({
    current_module: "PizzaLogic",
    include_options: Includes.choices.LOGIC_SPECIFIC
}); eval(include_data.name_statements); var include = function () { eval(include_data.module_statements); }
