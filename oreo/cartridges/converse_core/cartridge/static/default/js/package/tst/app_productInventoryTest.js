module( "Module App Product Inventory", {
	setup: function() {
			$('#qunit-fixture').html("");
			$('*').unbind();

			var htmlFixture = htmlUtil.writeAsString(function() {/*!
				<div id="avRoot">
					<span class="in-stock-msg">in-stock-msg</span>
					<span class="preorder-msg">preorder-msg</span>
					<span class="backorder-msg"></span>
					<span class="in-stock-date-msg">in-stock-date-msg</span>
					<span class="not-available-msg"></span>
					</div>
			*/});
			$('#qunit-fixture').html(htmlFixture);

			this.inventory = app.productInventory;

			this.data = {
				levels: { IN_STOCK: 0, PREORDER: 0, BACKORDER: 0, NOT_AVAILABLE: 0 }
			};

			this.avRoot = $('#avRoot');
	},
	teardown: function() {
			// run after
			$('#qunit-fixture').html("");
			$('*').unbind();
	}
});

test("the product is just in stock", function() {
	this.data.levels.IN_STOCK = 2;
	app.resources = { "IN_STOCK": "in stock" };

	var result = this.inventory.setAvailabilityMessage(this.data, this.avRoot);

	equal(this.avRoot.find(".in-stock-msg").text(), app.resources.IN_STOCK);
});

test("the product is in stock with message displayed from product data availability", function() {
	this.data.levels.IN_STOCK = 20;
	this.data.levels.PREORDER = 10;
	this.data.inStockMsg = "custom in stock";

	var result = this.inventory.setAvailabilityMessage(this.data, this.avRoot);

	equal(this.avRoot.find(".in-stock-msg").text(), "custom in stock");
});

test("the product preorder is greater than zero", function() {
	this.data.levels.PREORDER = 2;
	app.resources = { "PREORDER": "preorder" };

	var result = this.inventory.setAvailabilityMessage(this.data, this.avRoot);

	equal(this.avRoot.find(".preorder-msg.red").text(), app.resources.PREORDER);
});

test("the product preorder with non zero quantity in the other levels", function() {
	this.data.levels.PREORDER = 20;
	this.data.levels.IN_STOCK = 10;
	this.data.preOrderMsg = "custom preorder";

	var result = this.inventory.setAvailabilityMessage(this.data, this.avRoot);

	equal(this.avRoot.find(".preorder-msg.red").text(), "custom preorder");
});

test("the product backorder is greater than zero", function() {
	this.data.levels.BACKORDER = 2;
	this.data.backOrderMsg = 'test';

	var result = this.inventory.setAvailabilityMessage(this.data, this.avRoot);

	equal(this.avRoot.find(".backorder-msg").text(), this.data.backOrderMsg);
});

test("the product backorder with non zero quantity in the other levels", function() {
	this.data.levels.BACKORDER = 20;
	this.data.levels.IN_STOCK = 10;
	this.data.inStockDate="Fri 15 Mar 2013";
	this.data.backOrderMsg = 'test';
	
	var result = this.inventory.setAvailabilityMessage(this.data, this.avRoot);

	equal(this.avRoot.find(".backorder-msg").text(), this.data.backOrderMsg);
});

test("the product availability is greater than zero", function() {
	this.data.levels.NOT_AVAILABLE = 2;
	app.resources = { "NOT_AVAILABLE": "NOT_AVAILABLE" };

	var result = this.inventory.setAvailabilityMessage(this.data, this.avRoot);

	equal(this.avRoot.find(".not-available-msg").text(), app.resources.NOT_AVAILABLE);
});

test("the product availability with non zero quantity in the other levels", function() {
	this.data.levels.NOT_AVAILABLE = 20;
	this.data.levels.IN_STOCK = 10;
	app.resources = { "REMAIN_NOT_AVAILABLE": "REMAIN_NOT_AVAILABLE" };

	var result = this.inventory.setAvailabilityMessage(this.data, this.avRoot);

	equal(this.avRoot.find(".not-available-msg").text(), app.resources.REMAIN_NOT_AVAILABLE);
});


test("check instock date message appears from product availability data when preorder is greater than 0", function() {
    this.data.inStockDate = "date1";
    this.data.levels.PREORDER = 1;
    app.resources = { "IN_STOCK_DATE": "date_{0}" };

    var result = this.inventory.instockDate(this.data, this.avRoot);

    equal(this.avRoot.find(".in-stock-date-msg.red").text(), "date_date1" );
});
