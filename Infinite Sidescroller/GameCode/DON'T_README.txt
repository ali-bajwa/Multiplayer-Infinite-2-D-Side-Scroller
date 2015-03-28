INDEX
	TOOLS - tools used  to compile the project
	LIBRARIES - JavaScript libraries used for the project
	GAME ARCHITECTURE - description of game's structure.
		MODELS
		CONTROLLER
		RENDERERS
		OTHER

====================================================================================================

TOOLS that we use and respective COMMANDS with options and such:
	browserify
		description
			compiles individual modules into the bundle.js file that will be included into the .html page
		commands: 
			long options command:
				browserify --transform folderify --debug main.js --outfile bundle.js
			short options command:
				browserify -t folderify -d main.js -o bundle.js
	watchify 
		description:
			wrapper around browserify
			automatically browserifies project each time one of the sources change. Due to agressive caching,
			only the first compilation takes long
		commands:
			long options:
				watchify --transform folderify --verbose --debug main.js --outfile bundle.js
			short options:
				watchify -t folderify -vd main.js -o bundle.js

		
	folderify 
		description:
			plugin for browserify
			allows to include all files in the specified directory
		installation (I ran it in the GameCode folder. Idk if it changes anything):
			npm install folderify --save

LIBRARIES:
	box2dweb - world physics simulation (may change to the liquidfun library in the future)
	createjs package  - graphics, asset loading, sound etc. (only easeljs and preloadjs modules for now)
	jquery (very few places)
	qunit - testing 


GAME ARCHITECTURE

	MODELS
		singleton vs. instantiateable
		can contain data but not methods
		should not initialize non-trivial stuff because of undefined includes
			initialization goes into the respective controller's init function
			should not import anything because of above
		
	CONTROLLERS
		init method
		update method
		how to make public
			include short comment when makeing public to make it easy for people
			to explore API w/o looking into the main code
	RENDERERS
		[not implemented yet]

	OTHER
		Include
			enumerator
			code for include and what it does
	DESCRIPTION OF THE FLOW
		main.js -> InitController.init
		When ticker is started (after assets are loaded) the GameController.update_all is called
		each tick, and calls update method of each controller in the specified order

	DESCRIPTION OF INDIVIDUAL CONTROLLERS

		two bodies with velocity forceably set can produce weird results when colliding (sticking?)

		Graphics step follows Physics step and is complitely separate; Graphics step draws information about
		physics body and its state to display crrect visual representation
		E.g. if you want to change face of the monster to angry face whenver it's hit by the player, 
		keep the property "angry" to the MonsterModel and set it whenever monster collides with the player during physics step.
		Then in the graphics step check whether property is set to true and if so, change the animation frame to display angry face.
		rendering is done in special functions in graphics controller, but will probably be changed 
		to either separate modules or withing the respective controller;

		animations are defined in the graphics controller. Can change that but must be 
		mindful because animation definitions uses asset loader, so AssetController 
		should be initialized before anything that wants to setup animations

		many things in the project are forced to be as modular as possible, so if changes 
		are made, need to change only one place and everything else works as usually. Example: 
		instead of you quarying physics body etc. from renderer, you are getting passed this 
		info as the parameters, so if place where body is stored relative to graphics representation is changed,
		you only need to change place in graphics controller from which it's passsed
	POSSIBLE OPTIMIZATIONS 

FACTS TO REMEMBER (AVOIDING MISTAKES)
	JAVASCRIPT 
		objects are passed/assigned by reference
			var hey = {x: 0};
			var bar = hey;
			bar.x = 3;
			console.log(hey.x) // 3
		if you do not define variable using var, it gets spilled to the global scope
			var hey = 3;
			hey = 10; // OK
			bar = 10; // NOT OK, was defined in global scope 

TESTING
	[how to use qunit in general and for our project in particular]

DEBUGGING
	The following assumes that you use Chrome (Chromium) to debug javascript code
	notice that Chrome contains number of features that decent debugger should have. 

	console.log(obj) lets you see all info about object obj including all its properties and their values
	just try to log some nested object

	The Chrom(e/ium) understands source maps (which will be included in the bundle.js if you run browserify/watchify with the 
	--debug or -d option set) and can display errors or set breakpoints with respect to individual sources rather than
	the compiled bundle.js

SNIPPETS
	[short desctiption of what snippets are and where to find them]

FINALLY
	If you have any questions or ideas for improvement to my designs, it's best if you ask me immediately.
	Even if you have idea that is cool, but is hard to implement (you think), let me know about it,
	I'll just keep it in mind when I'm reserching stuff, and maybe it'll turn out to be easier than
	it seems to be.

	This guide is a subject to continious update. I'll notify everyone of new versions

	I'll try to document my code as much as possible, you probably should leave minimal documentation too,
	although do not spend too much time on it. 

	I hope it isn't too long or boring to read
