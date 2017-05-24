module( "Module App MobileMenuNavigation", {
    setup: function() {
            $('#qunit-fixture').html("");
            $('*').unbind();

            // setup some fixture html
            var htmlFixture = htmlUtil.writeAsString(function() {/*!
            <div id="hamburgernav">
                <ul id="mobile-menu-list">
                    <li id="m1-first-top-element" class="menu_header_category has-sub">
                        <a data-menu-id="hamburgernav" href="javascript:void(0);">
                            <span>Men</span>
                        </a>
                        <ul id="m1-first-list" style="display: none;">
                            <li class="subcategory_name">
                                <a data-menu-id="hamburgernav" href="http://www.google.com/men/sneakers">
                                    Sneakers
                                </a>
                            </li>
                            <li class="subcategory_name">
                                <a data-menu-id="hamburgernav" href="http://www.google.com/men/clothing">
                                    Clothing
                                </a>
                            </li>
                        </ul>
                    </li>
                    <li id="m1-second-top-element" class="menu_header_category has-sub">
                        <a data-menu-id="hamburgernav" href="javascript:void(0);">
                            <span>Women</span>
                        </a>
                        <ul id="m1-second-list" style="display: none;">
                            <li class="subcategory_name">
                                <a data-menu-id="hamburgernav" href="http://www.google.com/women/sneakers">
                                    Sneakers
                                </a>
                            </li>
                            <li class="subcategory_name">
                                <a data-menu-id="hamburgernav" href="http://www.google.com/women/clothing">
                                    Clothing
                                </a>
                            </li>
                        </ul>
                    </li>
                    <li id="empty-top-element" class="menu_header_category">
                        <a data-menu-id="hamburgernav" href="http://www.converse.com/landing-design-your-own?nav_fo=custom">
                            <span>Custom</span>
                        </a>
                    </li>
                </ul>
            </div>
            <div id="lightweightnav">
                <ul id="mobile-menu-list">
                    <li id="m2-first-top-element" class="menu_header_category has-sub">
                        <a data-menu-id="hamburgernav" href="javascript:void(0);">
                            <span>Men</span>
                        </a>
                        <ul id="m2-first-list" style="display: none;">
                            <li class="subcategory_name">
                                <a data-menu-id="hamburgernav" href="http://www.google.com/men/sneakers">
                                    Sneakers
                                </a>
                            </li>
                            <li class="subcategory_name">
                                <a data-menu-id="hamburgernav" href="http://www.google.com/men/clothing">
                                    Clothing
                                </a>
                            </li>
                        </ul>
                    </li>
                    <li id="m2-second-top-element" class="menu_header_category has-sub">
                        <a data-menu-id="hamburgernav" href="javascript:void(0);">
                            <span>Women</span>
                        </a>
                        <ul id="m2-second-list" style="display: none;">
                            <li class="subcategory_name">
                                <a data-menu-id="hamburgernav" href="http://www.google.com/women/sneakers">
                                    Sneakers
                                </a>
                            </li>
                            <li class="subcategory_name">
                                <a data-menu-id="hamburgernav" href="http://www.google.com/women/clothing">
                                    Clothing
                                </a>
                            </li>
                        </ul>
                    </li>
                    <li id="empty-top-element" class="menu_header_category">
                        <a data-menu-id="hamburgernav" href="http://www.converse.com/landing-design-your-own?nav_fo=custom">
                            <span>Custom</span>
                        </a>
                    </li>
                </ul>
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

test("initial setup check for menu 1", function() {
    app.mobileMenuNavigation.init();
    ok ($('#m1-first-top-element').hasClass('has-sub'),'non-empty top-level element should have class "has-sub"');
    ok ($('#m1-second-top-element').hasClass('has-sub'),'non-empty top-level element should have class "has-sub"');
    ok (!$('#m1-first-list').is(':visible') && !$('#m1-second-list').is(':visible'), "No sub-elements should be visible" );
    ok (!$('#m1-first-top-element').hasClass('active') && !$('#m1-second-top-element').hasClass('active'), 'No top-level elements should be active');
});

test("initial setup check for menu 2", function() {
    app.mobileMenuNavigation.init();
    ok ($('#m2-first-top-element').hasClass('has-sub'),'non-empty top-level element should have class "has-sub"');
    ok ($('#m2-second-top-element').hasClass('has-sub'),'non-empty top-level element should have class "has-sub"');
    ok (!$('#m2-first-list').is(':visible') && !$('#m2-second-list').is(':visible'), "No sub-elements should be visible" );
    ok (!$('#m2-first-top-element').hasClass('active') && !$('#m2-second-top-element').hasClass('active'), 'No top-level elements should be active');
});

//there are no callbacks that we can use to run the test asynchronously, so we just set up a reasonable delay in execution
//we consider here that each slideUp/slideDown call uses default 400ms animation time
asyncTest("clicking on top-level element with subs should make it active and its sub-elements visible", function() {
    app.mobileMenuNavigation.init();
    $('#m1-first-top-element a').click();
    setTimeout(function() {
        ok ($('#m1-first-list').is(':visible'), "List of sub-elements should be visible when its parent is clicked" );
        ok ($('#m1-first-top-element').hasClass('active'),'Top level non-empty element should become active when clicked');
        ok (!$('#m1-second-list').is(':visible'), "List of sub-elements should not be visible if its parent is not clicked");
        ok (!$('#m1-second-top-element').hasClass('active'),'Top level non-empty element should not be active if not clicked');
        start();      
    }, 450 );
});

asyncTest("clicking on top-level element with subs twice should make it inactive again and its sub-elements not visible", function(assert) {
    app.mobileMenuNavigation.init();
    $('#m1-first-top-element a').click();
    $('#m1-first-top-element a').click();
    setTimeout(function() {
        ok (!$('#m1-first-list').is(':visible'), "list of sub-elements should not be visible after two clicks on its parent" );
        ok (!$('#m1-second-list').is(':visible'), "list of sub-elements should not be visible when another list is clicked on twice");
        start();      
    }, 850 );
});

asyncTest("clicking on inactive top-level element when another one is already active should revert the state of both elements and their sub-elements", function() {
    app.mobileMenuNavigation.init();
    $('#m1-first-top-element a').click();
    $('#m1-second-top-element a').click();
    setTimeout(function() {
        ok (!$('#m1-first-list').is(':visible'), "List of sub-elements should not be visible when another list's parent is clicked" );
        ok (!$('#m1-first-top-element').hasClass('active'),'Top level non-empty element should not be active if another one is clicked');
        ok ($('#m1-second-list').is(':visible'), "List of sub-elements should be visible when its parent is clicked" );
        ok ($('#m1-second-top-element').hasClass('active'),'Top level non-empty element should become active when clicked');
        start();      
    }, 900 );
});

asyncTest("single click on one menu should not affect another in any way", function() {
    app.mobileMenuNavigation.init();
    $('#m1-first-top-element a').click();
    setTimeout(function() {
        ok ($('#m2-first-top-element').hasClass('has-sub'),'non-empty top-level element should have class "has-sub"');
        ok ($('#m2-second-top-element').hasClass('has-sub'),'non-empty top-level element should have class "has-sub"');
        ok (!$('#m2-first-list').is(':visible') && !$('#m2-second-list').is(':visible'), "No sub-elements should be visible" );
        ok (!$('#m2-first-top-element').hasClass('active') && !$('#m2-second-top-element').hasClass('active'), 'No top-level elements should be active');
        start();      
    }, 450 );
});

asyncTest("two consequitive clicks on one element of one menu should not affect another menu in any way", function() {
    app.mobileMenuNavigation.init();
    $('#m1-first-top-element a').click();
    $('#m1-second-top-element a').click();
    setTimeout(function() {
        ok ($('#m2-first-top-element').hasClass('has-sub'),'non-empty top-level element should have class "has-sub"');
        ok ($('#m2-second-top-element').hasClass('has-sub'),'non-empty top-level element should have class "has-sub"');
        ok (!$('#m2-first-list').is(':visible') && !$('#m2-second-list').is(':visible'), "No sub-elements should be visible" );
        ok (!$('#m2-first-top-element').hasClass('active') && !$('#m2-second-top-element').hasClass('active'), 'No top-level elements should be active');
        start();      
    }, 850 );
});

asyncTest("two clicks on two different elements of one menu should not affect another menu in any way", function() {
    app.mobileMenuNavigation.init();
    $('#m1-first-top-element a').click();
    $('#m1-second-top-element a').click();
    setTimeout(function() {
        ok ($('#m2-first-top-element').hasClass('has-sub'),'non-empty top-level element should have class "has-sub"');
        ok ($('#m2-second-top-element').hasClass('has-sub'),'non-empty top-level element should have class "has-sub"');
        ok (!$('#m2-first-list').is(':visible') && !$('#m2-second-list').is(':visible'), "No sub-elements should be visible" );
        ok (!$('#m2-first-top-element').hasClass('active') && !$('#m2-second-top-element').hasClass('active'), 'No top-level elements should be active');
        start();      
    }, 850 );
});