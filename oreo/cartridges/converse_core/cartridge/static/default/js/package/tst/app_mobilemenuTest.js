module( "Module App MobileMenu", {
    setup: function() {
            $('#qunit-fixture').html("");
            $('*').unbind();

            // setup some fixture html
            var htmlFixture = htmlUtil.writeAsString(function() {/*!
                <div id="mobile-menu"></div>
                <div id="wrapper">
                    <div id="glass-panel"/>
                    <div id="overlay-area"></div>
                    <div id="header" role="banner" data-overlay-visible="true" data-overlay-order="1">
                    <header>
                        <div id="black-bar"></div>
                        <div id="mobile-header">
                            <div class="hamburg"></div>
                            <div class="icon-tray"></div>
                            <div class="primary-logo" data-overlay-visible="true" data-overlay-order="3">
                                <a href="#">
                                    <span>Converse</span>
                                </a>
                            </div>
                        </div>
                    </header>
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

test("expanding the menu adds .menu-expanded to wrapper and .catcher-in-the-rye to glass-panel", function() {
    app.mobilemenu.init();

    var EXPANDED = 'menu-expanded';
    var CATCHER_CLASS = 'catcher-in-the-rye';

    ok( !$('#glass-panel').hasClass(CATCHER_CLASS), "#glass-panel should not have the .catcher-in-the-rye class initially");
    ok( !$('#mobile-menu').hasClass(EXPANDED) && !$('#wrapper').hasClass(EXPANDED), "Neither should have the .menu-expanded class yet");

    app.mobilemenu.expandMenu();

    ok( !$('#mobile-menu').hasClass(EXPANDED), "#mobile-menu should NOT have the .menu-expanded class");
    ok( $('#wrapper').hasClass(EXPANDED), "#wrapper should have the .menu-expanded class");
    ok( $('#glass-panel').hasClass(CATCHER_CLASS), "#glass-panel should have the .catcher-in-the-rye class when menu expanded");
});

test("hiding the menu removes .menu-expanded from wrapper", function() {
    htmlFixture = htmlUtil.writeAsString(function() {/*!
        <div id="mobile-menu"></div>
        <div id="wrapper" class="menu-expanded">
            <div id="glass-panel" class="catcher-in-the-rye"/>
        </div>
    */});
    $('#qunit-fixture').html(htmlFixture);

    app.mobilemenu.init();

    var EXPANDED = 'menu-expanded';
    var CATCHER_CLASS = 'catcher-in-the-rye';

    ok( !$('#mobile-menu').hasClass(EXPANDED) && $('#wrapper').hasClass(EXPANDED), "Only #wrapper should have the .menu-expanded class");
    ok( $('#glass-panel').hasClass(CATCHER_CLASS), "#glass-panel should have the .catcher-in-the-rye class when menu expanded");
    
    app.mobilemenu.hideMenu();

    ok( !$('#mobile-menu').hasClass(EXPANDED), "#mobile-menu should still NOT have the .menu-expanded class");
    ok( !$('#wrapper').hasClass(EXPANDED), "#wrapper should NOT have the .menu-expanded class");
    ok( !$('#glass-panel').hasClass(CATCHER_CLASS), "#glass-panel should not have the .catcher-in-the-rye class when menu is hidden");

});

test("expand menu if hamburger button is pressed... contract if pressed again", function() {
    app.mobilemenu.init();

    $('.hamburg').click();

    var result = app.mobilemenu.isMenuExpanded();

    ok( result, "app.mobilemenu.isMenuExpanded should be TRUE once .hamburg is clicked" );

    $('.hamburg').click();

    result = app.mobilemenu.isMenuExpanded();

    ok( !result, "app.mobilemenu.isMenuExpanded should be FALSE now");

});

test("hide the menu if there's a click within #wrapper", function() {
    app.mobilemenu.init();

    $('.hamburg').click();

    $('#wrapper').click();

    result = app.mobilemenu.isMenuExpanded();

    ok( !result, "app.mobilemenu.isMenuExpanded should be FALSE now");
});