//AUTOMATED TESTING SUITE
//Insert a test case in the file where the code resides where
//you want to use QUnit.tests(description of test, function(assert){})
//use assert.equal to test output of function
//Then, add a call to that test here in AutomatedTests.js
//Compile testing suite by typing
//browserify -d AutomatedTests.js -o TestSuite.js


//Importing Game Code
var IncludeFile = require("../Includes.js");

//#TEST 1
//Test will fail if QUnit isn't working
QUnit.test( "hello test", function( assert ) {
	assert.ok( 1 == "1", "Passed!" );
});

//#TEST 2
//Testing Includes.js
IncludeFile.automated_tests();

