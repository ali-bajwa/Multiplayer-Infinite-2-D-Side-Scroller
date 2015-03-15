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
IncludeFile.automated_tests();

