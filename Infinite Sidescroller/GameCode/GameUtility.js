var Utility = (function()
{
  function arrow_key_scrolling(flag) {
    // Configures arrow key scrolling for canvas
    if (flag == false) {
      document.addEventListener('keydown', function (e) { // .getElementById("display_canvas")
        arrows = [37, 38, 39, 40];
        if (arrows.indexOf(e.keyCode) > -1) {
          e.preventDefault();
          return false;
        } else {
          return true
        }
      })
    }
  }

	var lg = function()
	{
		/*
		 * shortcut to console.log()
		 * prints all arguments to console
		 * first argument is used as a label for the rest
		 *
		 * each labeled group is enclosed into the colored delimiters
		 * >>> and <<< so it's easily distinguished. I found it helpful,
		 * if you don't let me know, or use something else
		 */
		console.log("%s %c %s", arguments[0], "background: #DAF2B1", ">>>");
		
		for(var i = 1; i < arguments.length; i++)
		{
			console.log("\t", arguments[i]);
		}
		console.log("%c<<<", "background: #DAF2B1");

	};

	var random_choice = function(probabilities, choices){
		/*
		   takes 2 arrays with elements at corresponding indexes
		   being choice and it's probability. picks random one.
		   choices are anything, probability is integer a, such that
		   probability of a choice is a/10. with a < 10, of course
		   and probabilities adding up to 10. 
		   Yes, it's not very good implementation (read: terrible), 
		   and since you noticed, now it's your job to improve it.

		*/

		// array with choices duplicated a proper amount of times based on
		// their probability
		var blah = []; 

		for(var i = 0; i < choices.length; i++){
			for(var j = 0; j < probabilities[i]; j++){
				blah.push(choices[i]);
			}
		}

		var rand_index = Math.floor(Math.random() * blah.length);

		return blah[rand_index];
	};

	

	return {
		lg: lg,
		random_choice: random_choice
	};

})();

module.exports = Utility;
