module( "Module App TabTest", {
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

test("app.tabs fake pass", function() {
	ok( ( true ), "the poles have reversed and the world is ending");
});

test("app.tabs  enableCache as true", function() {
	var htmlFixture = htmlUtil.writeAsString(function() {/*!
		<div id="account-settings-tab" class="secondary-menu tabified" data-tabify-enable-cache="false">
	EMPTY FIXTURE>>> NOTHING NEEDED HERE	
		</div>
	*/}); 
	$('#qunit-fixture').html(htmlFixture);
	
	
	var cacheEnabled = app.tabs.enableCache(true);
	ok( ( cacheEnabled ), "Cache should be enabled");
});

test("app.tabs  enableCache as false", function() {
	var htmlFixture = htmlUtil.writeAsString(function() {/*!
		<div id="account-settings-tab" class="secondary-menu tabified" data-tabify-enable-cache="true">
	EMPTY FIXTURE>>> NOTHING NEEDED HERE	
		</div>
	*/}); 
	$('#qunit-fixture').html(htmlFixture);
	
	
	var cacheEnabled = app.tabs.enableCache(false);
	ok( ( !cacheEnabled ), "Cache should be disabled");
});

test("app.tabs set enableCache as true per data attribute", function() {
	var htmlFixture = htmlUtil.writeAsString(function() {/*!
		<div id="account-settings-tab" class="secondary-menu tabified" data-tabify-enable-cache="true">
	EMPTY FIXTURE>>> NOTHING NEEDED HERE	
		</div>
	*/}); 
	$('#qunit-fixture').html(htmlFixture);
	
	
	var cacheEnabled = app.tabs.enableDisableCachePerData("#account-settings-tab");
	ok( ( cacheEnabled ), "Cache should be enabled");
});

test("app.tabs set enableCache as false per explicity data attribute", function() {
	var htmlFixture = htmlUtil.writeAsString(function() {/*!
		<div id="account-settings-tab" class="secondary-menu tabified" data-tabify-enable-cache="false">
	EMPTY FIXTURE>>> NOTHING NEEDED HERE	
		</div>
	*/}); 
	$('#qunit-fixture').html(htmlFixture);
	
	
	var cacheEnabled = app.tabs.enableDisableCachePerData("#account-settings-tab");
	ok( ( !cacheEnabled ), "Cache should be disabled");
});

test("app.tabs set enableCache as false by default per no data attribute", function() {
	var htmlFixture = htmlUtil.writeAsString(function() {/*!
		<div id="account-settings-tab" class="secondary-menu tabified">
	EMPTY FIXTURE>>> NOTHING NEEDED HERE	
		</div>
	*/}); 
	$('#qunit-fixture').html(htmlFixture);
	
	
	var cacheEnabled = app.tabs.enableDisableCachePerData("#account-settings-tab");
	ok( ( !cacheEnabled ), "Cache should be disabled");
});




