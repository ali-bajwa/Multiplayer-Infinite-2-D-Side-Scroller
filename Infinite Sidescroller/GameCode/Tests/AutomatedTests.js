//AUTOMATED TESTING SUITE
//Insert a test case here using QUnit(description of test, function(assert){})
//use assert.equal to test output of function
//Compile testing suite by typing
//browserify -d AutomatedTests.js -o TestSuite.js


//Importing Game Code
var IncludeFile = require("../Includes.js");

//Test will fail if QUnit isn't working
QUnit.test( "hello test", function( assert ) {
	assert.ok( 1 == "1", "Passed!" );
});

//*************************************************************************************************
//Testing Includes.js
QUnit.test("option matching function", function( assert) {

	//If both are none
	assert.equal(IncludeFile.option_is_set(IncludeFile.choices.NONE, IncludeFile.choices.NONE), true);

	//If both match, it returns the value of choices
	//If they don't match, it returns 0
	
	//MATCH
	assert.equal(IncludeFile.option_is_set(IncludeFile.choices.ALL_CONTROLLERS, IncludeFile.choices.ALL_CONTROLLERS), 1);
	assert.equal(IncludeFile.option_is_set(IncludeFile.choices.ALL_MODELS, IncludeFile.choices.ALL_MODELS), 2);
	assert.equal(IncludeFile.option_is_set(IncludeFile.choices.OTHER_STUFF, IncludeFile.choices.OTHER_STUFF), 8);

	//Mismatch
	assert.equal(IncludeFile.option_is_set(IncludeFile.choices.NONE, IncludeFile.choices.ALL_CONTROLLERS), 0);
	assert.equal(IncludeFile.option_is_set(IncludeFile.choices.OTHER_STUFF, IncludeFile.choices.NONE), 0);
	assert.equal(IncludeFile.option_is_set(IncludeFile.choices.ALL_MODELS, IncludeFile.choices.ALL_CONTROLLERS), 0);
	assert.equal(IncludeFile.option_is_set(IncludeFile.choices.OWN_MODEL, IncludeFile.choices.ALL_MODELS), 0);


});





