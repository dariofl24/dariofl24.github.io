module( "Module App Minicart", {
    setup: function() {
            $('#qunit-fixture').html("");
            $('*').unbind();
            // setup some fixture html
            this.htmlFixture = htmlUtil.writeAsString(function() {/*!
						<div id="mini-cart" class="mini-cart mini-cart-empty" icon-text-attr="">
						CART
						</div>
            */});
            $('#qunit-fixture').html(this.htmlFixture);
						
    },
    teardown: function() {
            // run after
            $('#qunit-fixture').html("");
            $('*').unbind();
    }
});

test("addQtyToCart function handles non integers properly", function() {
	htmlFixture = htmlUtil.writeAsString(function() {/*!
						<div id="mini-cart" class="mini-cart mini-cart-empty" icon-text-attr=" ">
						CART
						</div>
            */});

  $('#qunit-fixture').html(htmlFixture);
	app.minicart.init();
	var minicart = $(".mini-cart");
	var controlVal = 1;
	app.minicart.addQtyToCart(controlVal);
	var cartVal = parseInt(minicart.attr("icon-text-attr"), 10);
	equal(controlVal, cartVal);
});

test("addQtyToCart function should change class when going from empty to having items", function() {
	htmlFixture = htmlUtil.writeAsString(function() {/*!
					<div id="mini-cart" class="mini-cart mini-cart-empty" icon-text-attr=" ">
					CART
					</div>
					*/});

	$('#qunit-fixture').html(htmlFixture);
	app.minicart.init();
	var minicart = $(".mini-cart");
	var qty = 1;
	var controlValOld = "mini-cart-empty";
	var controlValNew = "mini-cart-full";
	ok( minicart.hasClass(controlValOld) === true, "the minicart should have mini-cart-empty class");
	ok( minicart.hasClass(controlValNew) === false, "the minicart should not have mini-cart-full class");
	app.minicart.addQtyToCart(qty);
	ok( minicart.hasClass(controlValOld) === false, "the minicart should not have mini-cart-empty class");
	ok( minicart.hasClass(controlValNew) === true, "the minicart should have mini-cart-full class");
});

test("addQtyToCart function should update value on already populated cart", function() {
	htmlFixture = htmlUtil.writeAsString(function() {/*!
					<div id="mini-cart" class="mini-cart mini-cart-full" icon-text-attr="2">
					CART
					</div>
					*/});

	$('#qunit-fixture').html(htmlFixture);	app.minicart.init();
	var minicart = $(".mini-cart");
	var initQty = 2;
	var addQty = 2;
	var controlQty = initQty + addQty;
	equal( parseInt(minicart.attr("icon-text-attr"), 10), initQty);
	app.minicart.addQtyToCart(addQty);
	equal( parseInt(minicart.attr("icon-text-attr"), 10), controlQty);
});
