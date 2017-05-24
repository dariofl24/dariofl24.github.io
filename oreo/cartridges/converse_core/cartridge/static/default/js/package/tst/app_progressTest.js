module( "Module App Progress", {
	setup: function() {
			$('#qunit-fixture').html("");
			$('*').unbind();

			// setup some fixture html
			var htmlFixture = htmlUtil.writeAsString(function() {/*!	
				<div>we dont need anything here for this... but whatever</div>
			*/}); 
			$('#qunit-fixture').html(htmlFixture);	
	},
	teardown: function() {
			// run after
			$("loader").remove();
			$("loader-indicator").remove();
			$("loader-bg").remove();
			$('#qunit-fixture').html("");
			$('*').unbind();
	}
});

test("we should not have any objects of classname loader yet", function() {
	var l = $(".loader");
	ok( ( l.length === 0 ), "There is already a loader on this page... thats not correct");
});

test("we should not have any items of loader-indicator calss ", function() {
	var l = $(".loader-indicator");
	ok( ( l.length === 0 ), "There is already a loader-indicator on this page... thats not correct");
});

test("we should not have any objects of classname loader-bg yet", function() {
	var l = $(".loader-bg");
	ok( ( l.length === 0 ), "There is already a loader-bg on this page... thats not correct");
});

test("after calling show we should have an object of classname loader", function() {
	app.progress.show();
	var l = $(".loader");
	ok( ( l.length === 1 ), "There is a incorrect number of loaders.. should be 1");
});

test("after calling show we should have an object of classname loader-indicator", function() {
	app.progress.show();
	var l = $(".loader-indicator");
	ok( ( l.length === 1 ), "There is a incorrect number of loader-indicators.. should be 1");
});

test("after calling show we should have an object of classname loader-bg", function() {
	app.progress.show();
	var l = $(".loader-bg");
	ok( ( l.length === 1 ), "There is a incorrect number of loader-bgs.. should be 1");
});

test("after calling show loader should be visible", function() {
	app.progress.show();
	var l = $(".loader");
	ok( ( l.is(":visible") ), "The loader shoule be visible. it is not");
});

test("after calling show loader-indicator should be visible", function() {
	app.progress.show();
	var l = $(".loader-indicator");
	ok( ( l.is(":visible") ), "The loader-indicator shoule be visible. it is not");
});

test("after calling show loader-bg should be visible", function() {
	app.progress.show();
	var l = $(".loader-bg");
	ok( ( l.is(":visible") ), "The loader-bg shoule be visible. it is not");
});

test("after calling hide loader should be hidden", function() {
	app.progress.show();
	app.progress.hide();
	var l = $(".loader");
	ok( ( l.is(":hidden") ), "The loader shoule be hidden. it is not");
});

test("after calling hide loader-indicator should be hidden", function() {
	app.progress.show();
	app.progress.hide();
	var l = $(".loader-indicator");
	ok( ( l.is(":hidden") ), "The loader-indicator shoule be hidden. it is not");
});

test("after calling hide loader-bg should be hidden", function() {
	app.progress.show();
	app.progress.hide();
	var l = $(".loader-bg");
	ok( ( l.is(":hidden") ), "The loader-bg shoule be hidden. it is not");
});
