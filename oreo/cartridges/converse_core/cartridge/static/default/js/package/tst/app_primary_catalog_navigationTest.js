module( "Module App PrimaryCatalogNavigation", {
    setup: function() {
            $('#qunit-fixture').html("");
            $('*').unbind();

            // setup some fixture html
            var htmlFixture = htmlUtil.writeAsString(function() {/*!
<div id="navigation" role="navigation">
  <nav>
    <h1 class="visually-hidden navigation-header">Catalog Navigation</h1>        
    <div class="menu-category-container">                
        <ul class="menu-category level-1">
            
            <li id='men-category-container'>
                <a href="javascript:void(0);" class="level-1" data-category="men-category">MEN</a>
    
                <div class="level-2 " data-parent-category='men-category' id='men-category-level-2'>
                    <div class="menu-wrapper">
                        <ul class="level-2">
                            <li class=first ><a href="" class="level-2"><img src="" alt="ACCESSORIES"></a></li>
                            <li><a href="" class="level-2"><img src="" alt="ALL STAR"></a></li>
                        </ul>
                      </div>
                </div>
            </li>
            
            <li id='custom-category-container'>
                <a href="http://test.com" class="level-1" data-category="custom-category">CUSTOM</a>
                
                <div class="level-2 " data-parent-category='custom-category' id='custom-category-level-2'>
                    <div class="menu-wrapper">
                        <ul class="level-2">
                            <li class=first ><a href="" class="level-2"><img src="" alt="RANDOM CUSTOM STUFF"></a></li>
                        </ul>
                      </div>
                </div>
            </li>
            
            <li id='women-category-container'>
                <a href="javascript:void(0);" class="level-1" data-category="women-category">WOMEN</a>
            </li>
            
            <li id='kids-category-container'>
                <a href="javascript:void(0);" class="level-1" data-category="kids-category">MEN</a>
    
                <div class="level-2 " data-parent-category='kids-category' id='kids-category-level-2'>
                    <div class="menu-wrapper testPassClass">
                        <ul class="level-2">
                            <li class=first ><a href="" class="level-2"><img src="" alt="RANDOM KID STUFF"></a></li>
                        </ul>
                      </div>
                </div>
            </li>
        </ul>
    </div>
    <div class="external-category-container" style="height: 0px; display: none;">
        <div class="level-2 " style="display: block;"></div>
    </div>
  </nav>
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

test("app.primarycatalognavigation.hasSubcategories should return true when there are subcategories", function() {
    var result = app.primarycatalognavigation.hasSubcategories($('#men-category-container'));

    ok( result, "app.primarycatalognavigation.hasSubcategories should be true for category with subcategories");
});

test("app.primarycatalognavigation should NOT expand when category has NO subcategories", function() {
    var expanded = false;

    app.slider.toggle = function() {
        expanded = true;
    }        

    app.primarycatalognavigation.init();

    $('#women-category-container a').click();

    ok( !expanded, "app.primarycatalognavigation should NOT be expanded for categories wihtout subcategories");
});

test("app.primarycatalognavigation should expand when category has alternative URL set", function() {
    var expanded = false;

    app.slider.toggle = function() {
        expanded = true;
    }        

    app.primarycatalognavigation.init();

    $('#custom-category-container a').click();

    ok( expanded, "app.primarycatalognavigation should expand even if category has alternative URL set");
});

test("app.primarycatalognavigation should expand category panels if category has subcategories", function() {
    var expanded = false;

    app.slider.toggle = function() {
        expanded = true;
    }

    app.primarycatalognavigation.init();

    $('#men-category-container a').click();

    ok( expanded, "app.primarycatalognavigation should be expanded");
    ok( $('.external-category-container').find('li.first').exists(), "app.primarycatalognavigation menu should be copied to submenus container");
});

test("app.primarycatalognavigation should be empty in case other slider areas are clicked", function() {
    var expanded = false;

    app.slider.toggle = function() {
        expanded = true;
    }

    app.primarycatalognavigation.init();

    $('#men-category-container a').click();

    ok( expanded, "app.primarycatalognavigation should be expanded");
    ok( $('.external-category-container').find('li.first').exists(), "app.primarycatalognavigation menu should be copied to submenus container");

    $.publish(app.constant.SLIDER.BEFORE_EXPANDED, 'test');

    ok( !$('.external-category-container').find('li.first').exists(), "app.primarycatalognavigation submenu should be empty");
});

test("app.primarycatalognavigation should be empty in case overlay is clicked", function() {
    var expanded = false;

    app.slider.toggle = function() {
        expanded = true;
    }

    app.primarycatalognavigation.init();

    $('#men-category-container a').click();

    ok( expanded, "app.primarycatalognavigation should be expanded");
    ok( $('.external-category-container').find('li.first').exists(), "app.primarycatalognavigation menu should be copied to submenus container");

    $.publish(app.constant.SLIDER.COLLAPSED, app.constant.SLIDER.SUBCATEGORY_PANEL);

    ok( !$('.external-category-container').find('li.first').exists(), "app.primarycatalognavigation submenu should be empty");
});
