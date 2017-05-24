module( "Module App PlaceHolder", {
	setup: function() {
			$('#qunit-fixture').html("");
			$('*').unbind();

			// setup some fixture html
			var htmlFixture = htmlUtil.writeAsString(function() {/*!	
				<input type="text" id="q" name="q" value="" placeholder="Enter Keyword or Item #" autocomplete="off" class="valid">	
			*/}); 
			$('#qunit-fixture').html(htmlFixture);	
	},
	teardown: function() {
			// run after
			$('#qunit-fixture').html("");
			$('*').unbind();
	}
});

test("input should have an empty value to start", function() {
	var inputField = $("#q");
	ok( ( inputField.val() === "" ), "The input fields value should be empty right now");
});

test("input should maintain an empty value when focused, prior to placeholder.init() call", function() {
	var inputField = $("#q");
	inputField.focus();
	ok( ( inputField.val() === "" ), "Focus should do nothing");
});

test("input should maintain an empty value when blurred, prior to placeholder.init() call", function() {
	var inputField = $("#q");
	inputField.blur();
	ok( ( inputField.val() === "" ), "Blur should do nothing");
});

test("after init(), call the value should be empty", function() {
	var inputField = $("#q");
	app.placeholder.init();
	ok( ( inputField.val() === "" ), "The input fields value should be empty right now");
});

test("after init(), calling focus should set the value to an empty string", function() {
	var inputField = $("#q");
	app.placeholder.init();
	inputField.focus();
	ok( ( inputField.val() === "" ), "Focus should remove the placeholder text");
});

test("after init(), calling blur should set the value to an empty string", function() {
	var inputField = $("#q");
	app.placeholder.init();
	inputField.blur();
	ok( ( inputField.val() === "" ), "Blur should return empty text");
});

test("after init(), after focusing and changing the value, when we blur the value should not return to the placeholder but rather maintain the value we added", function() {
	var inputField = $("#q");
	app.placeholder.init();
	inputField.focus();
	var testVal = "testVal";
	inputField.val(testVal);
	inputField.blur();
	ok( ( inputField.val() === testVal ) , "Blur should do nothing b/c we have a new value");
});
