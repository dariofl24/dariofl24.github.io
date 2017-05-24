module( "Module App Account Profile", {
    setup: function() {
        $('#qunit-fixture').html("");
        $('*').unbind();

        this.htmlFixture = htmlUtil.writeAsString(function() {/*!
            <form id="profile-form">
            </form>
            */});

        $('#qunit-fixture').html(this.htmlFixture);
    },
    teardown: function() {
            $('#qunit-fixture').html("");
            $('*').unbind();
    }
});
