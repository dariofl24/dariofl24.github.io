module( "Module App Util", {
	setup: function() {
		$('#qunit-fixture').html("");
		$('*').unbind();
		this.defaultValue = 4;
		this.defaultMin = 1;
		this.defaultMax = 99;
		var htmlFixture = htmlUtil.writeAsString( function() {/*!
			<input type="number" value="" max="" min="" />
		*/});
		$('#qunit-fixture').html(htmlFixture);
		this.inputElem = $('#qunit-fixture input');
		this.inputElem.val(this.defaultValue);	
		this.inputElem.attr('min',this.defaultMin);	
		this.inputElem.attr('max',this.defaultMax);	
	},
	teardown: function() {
		$('#qunit-fixture').html("");
		$('*').unbind();
	}
});

test("cleanCssContent should not fail on undefined value", function() {
    ok( app.util.getDeviceProfile() == "" , "Something went wrong with the parsing of an undefined value" );
});

test("cleanCssContent should remove \"s from the string", function() {
    var controlContentArg = "\"thisString\"";
    var controlResult = "thisString";
    $(document.body).css('content', controlContentArg);
    var result = app.util.getDeviceProfile();
    $(document.body).css('content', "");
    equal( result , controlResult );
});
