module( "Module App PageTest", {
	setup: function() {
			$('#qunit-fixture').html("");
			$('*').unbind();

			// setup some fixture html
			var htmlFixture = htmlUtil.writeAsString(function() {/*!
				<div >
			EMPTY FIXTURE>>> NOTHING NEEDED HERE	
				</div>
			*/}); 
			$('#qunit-fixture').html(htmlFixture);
	},
	teardown: function() {
			// run after
			$('#qunit-fixture').html("");
			$('*').unbind();
	}
});

test("app.page.title should match the argument we pass in setContext", function() {
	app.page.setContext({"title":"Storefront","type":"storefront","ns":"storefront"});
	ok( ( app.page.title === "Storefront" ), "app.page.title should return Storefront not:"+app.page.title);
});

test("app.page.redirect should call setLocationHref method with the proper url", function() {
	sinon.stub(window, "setTimeout", function(f, t){
		f();
	});
	var testUrl = "www.google.com";
	var passed = false;
	sinon.stub(app.page, "setLocationHref", function(url){
		if ( url === testUrl ) {
			passed = true;
		}
	});
	app.page.redirect(testUrl);
	ok(passed, "the setLocationHref was not called with the proper url");
	window.setTimeout.restore();
	app.page.setLocationHref.restore();
});

test("app.page.refresh should call assignLocationHref method with the current url", function() {
	sinon.stub(window, "setTimeout", function(f, t){
		f();
	});
	var testUrl = window.location.href;
	var passed = false;
	sinon.stub(app.page, "assignLocationHref", function(url){
		if ( url === testUrl ) {
			passed = true;
		}
	});
	app.page.refresh();
	ok(passed, "the setLocationHref method was not called with the proper url");
	window.setTimeout.restore();
	app.page.assignLocationHref.restore();
});

test("app.page.params should call app.util.getQueryStringParams(window.location.search.substr(1))", function() {
	deepEqual(app.page.params(), app.util.getQueryStringParams(window.location.search.substr(1)), "the two values should be the same:");
});
