module( "Module App Overlay", {
    setup: function() {
            $('#qunit-fixture').html("");
            $('*').unbind();

            // setup some fixture html
            var htmlFixture = htmlUtil.writeAsString(function() {/*!
                <div id="wrapper">
                    <div id="overlay-area" style="display: none;"></div>
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

test("single window app.overlay.show should make the overlay display visible", function() {
    app.overlay.show();
    var overlayIsVisible = $("#overlay-area").is(":visible");
    ok( overlayIsVisible, "The overlay should be visible.");
});

test("single window app.overlay.hide should make the overlay display invisible", function() {
    app.overlay.show();
    app.overlay.hide();
    var overlayIsVisible = $("#overlay-area").is(":visible");
    ok( !overlayIsVisible, "The overlay should not be visible.");
});

test("multiple window app.overlay.show should keep the overlay showing", function() {
    app.overlay.show();
    app.overlay.show();
    var overlayIsVisible = $("#overlay-area").is(":visible");
    ok( overlayIsVisible, "The overlay should be visible.");
});

test("calling clicked should add a functor to the $.callbacks list", function() {
    var callCounter = 0;
    var testFunc = function() {
        ++callCounter;
    };
    var clickedCallbacks = app.overlay.clicked(testFunc);
    ok( clickedCallbacks.has(testFunc), "the testFunc should be in the callback list");
});

test("calling clicked multiple times should not result in duplicate callbacks added", function() {
    var callCounter = 0;
    var testFunc = function() {
        ++callCounter;
    };
    var clickedCallbacks;
    clickedCallbacks = app.overlay.clicked(testFunc);
    clickedCallbacks = app.overlay.clicked(testFunc);
    clickedCallbacks.fire();
    equal( callCounter, 1, "the testFunc should be in the callback list only once");
});

test("calling toggle on a hidden overlay should make the overlay visible", function() {
    app.overlay.toggle();
    var overlayIsVisible = $("#overlay-area").is(":visible");
    ok( overlayIsVisible, "The overlay should be visible.");
});

test("calling toggle on a visible overlay should make the overlay invisible", function() {
    app.overlay.show();
    app.overlay.toggle();
    var overlayIsVisible = $("#overlay-area").is(":visible");
    ok( !overlayIsVisible, "The overlay should not be visible.");
});

test("clicking the overlay should close the overlay", function() {
    app.overlay.init();
    app.overlay.show();
    var testFunc = function() {
        app.overlay.hide();
    };
    app.overlay.clicked(testFunc);
    $("#overlay-area").click();
    var overlayIsVisible = $("#overlay-area").is(":visible");
    ok( !overlayIsVisible, "The overlay should not be visible.");   
});

test("the overlay should have a subscription which will fire on SITE_OVERLAY_OPEN publication", function() {
    app.overlay.init();
    var callCounter = 0;
    var testFunc = function() {
        ++callCounter;
    };
    $.publish(app.constant.OBSERVERS.SITE_OVERLAY_OPEN, testFunc);
    $("#overlay-area").click();
    equal( callCounter, 1, "The publish event should have fired our testFunc and incremented the counter on click");   
});

test("the overlay should have a subscription which will fire on SITE_OVERLAY_CLOSED publication", function() {
    app.overlay.init();
    var callCounter = 0;
    var testFunc = function() {
        ++callCounter;
    };
    $.publish(app.constant.OBSERVERS.SITE_OVERLAY_CLOSED, testFunc);
    $("#overlay-area").click();
    equal( callCounter, 0, "The publish event should have fired the removal of our testFunc and not incremented the counter onclick");   
});
