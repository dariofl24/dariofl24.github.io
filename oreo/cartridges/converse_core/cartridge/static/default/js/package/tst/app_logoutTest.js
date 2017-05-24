module( "Module App Logout", {
    setup: function() {
            $('#qunit-fixture').html("");
            $('*').unbind();

            // setup some fixture html
            this.htmlFixture = htmlUtil.writeAsString(function() {/*!
            <div id="menu-utility-user">
            	<div id="account-info-box" class="logout">
                    Hi User!
							</div>
              <ul class="account-box">
              	<li class="first">
                  <a href="javascript:void(0)">My Account</a>
                </li>
              	<li>
                	<a href="javascript:void(0)">Order Status</a>
                </li>
              </ul>
            </div>
            <div id="outsideBox">
                <p>Lorem Ipsum</p>
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

test("When logout link is clicked the class name 'active' is toggled on account popup panel", function() {
    app.logout.init();
		app.logout.setAnimationDelay(0);
    var logoutLink = $("#account-info-box.logout");
    var accountBox = $("#menu-utility-user .account-box");

    logoutLink.trigger("click");
    ok( accountBox.hasClass("active") === true, "cant find active class on accountbox" );

    logoutLink.trigger("click");
    ok( accountBox.hasClass("active") === false );
});

test("When account popup menu is open and the area outside the panel is clicked the panel should become non active", function() {
	app.logout.init();

	var logoutLink = $("#account-info-box.logout");
	var accountBox = $("#menu-utility-user .account-box");

	logoutLink.trigger("click");
	ok( accountBox.hasClass("active") );

	$("#outsideBox").trigger("click");
	ok( accountBox.hasClass("active") === false );
});

test("If user has logged in logout link should be initialized properly", function() {
	$('#qunit-fixture').html("");
	app.logout.init();

	$('#qunit-fixture').html(this.htmlFixture);
	$.publish(app.constant.PUBSUB.LOGIN_PANEL.USER.LOGGED_IN);

	$("#account-info-box.logout").trigger("click");
	ok( $("#menu-utility-user .account-box").hasClass("active") );
});
