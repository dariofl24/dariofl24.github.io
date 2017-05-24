module('App Gridwall Module', {

    setup: function() {
        $('#qunit-fixture').html('');
        $('*').unbind();

        this.htmlFixture = htmlUtil.writeAsString(function() {
            /*!
             <div id="main">
                <div id="primary" class="primary-content">
                    <div class="search-result-content">
                        <ul id="search-result-items" class="search-result-items  tiles-container clearfix">
                            <li class="grid-tile"></li>
                            <li class="grid-tile"></li>
                            <li class="grid-tile"></li>
                            <li class="grid-tile"></li>
                            <li class="grid-tile"></li>
                        </ul>
                    </div>
                    <div class="more-results">
                        <a id="moreresults" href="http://www.converse.com/search?q=chucks&amp;sz=16&amp;start=16">
                            <span>View More</span>
                        </a>
                    </div>
                </div>
            </div>
             */
        });

        $('#qunit-fixture').html(this.htmlFixture);
    },

    teardown: function() {
        $('#qunit-fixture').html('');
        $('*').unbind();
    }
});

var testAjaxData = '' +
    '<div class="search-result-content">\
        <ul id="search-result-items" class="search-result-items  tiles-container clearfix">\
            <li class="grid-tile"></li>\
            <li class="grid-tile"></li>\
            <li class="grid-tile"></li>\
            <li class="grid-tile"></li>\
            <li class="grid-tile"></li>\
        </ul>\
    </div>';

var testMoreResultsHtml = '' +
    '<a id="moreresults" href="http://www.converse.com/search?q=chucks&amp;sz=16&amp;start=32">\
        <span>View More</span>\
    </a>';

var testDataMoreResultsLinkExists = testAjaxData +
    '<div class="more-results">' + testMoreResultsHtml + '</div>';

var testParams = {
    q: 'chucks',
    sz: '16',
    start: '16'
};

var testParamsSerialized = 'q=chucks&sz=16&start=16';

test('Get more results params from url - app.gridwall.getMoreResultsParams()', function() {
    var params = app.gridwall.getMoreResultsParams();
    deepEqual(testParams, params, 'More Results params are equal');
});

test('Get gridwall item count - app.gridwall.getGridwallItemCount()', function() {
    var testGridwallItemsCount = 5;
    var count = app.gridwall.getGridwallItemCount();
    strictEqual(testGridwallItemsCount, count, 'Gridwall items are equal');
});

test('Get pushstate object -  app.gridwall.getPushStateObject()', function() {
    var testPushStateObject = {
        q: 'chucks',
        sz: 5,
        start: 0
    }
    var pushStateObject = app.gridwall.getPushStateObject();
    deepEqual(testPushStateObject, pushStateObject, 'Pushstate objects are equal');
});

test('Update more results link when it exists - app.gridwall.updateMoreResultsLink()', function() {
    app.gridwall.updateMoreResultsLink($(testDataMoreResultsLinkExists));
    var testUrl = $(testDataMoreResultsLinkExists).find('#moreresults').attr('href');
    strictEqual(testUrl, app.gridwall.getMoreResultsUrl(), 'More Results URLs are equal');
});

test('Update more results link when it doesn\'t exist - app.gridwall.updateMoreResultsLink()', function() {
    app.gridwall.updateMoreResultsLink($(testAjaxData));
    ok(!app.gridwall.moreResultsUrlExists(), 'More results link doesn\'t exist');
});

test('Set pushState url - app.gridwall.pushStateUrl()', function() {
    app.gridwall.pushStateUrl(testParams, testParamsSerialized);
    var paramsSerialized = window.location.search.substr(1);
    strictEqual(testParamsSerialized, paramsSerialized, 'Serialized params are equal.');
});

test('Append items to gridwall app.gridwall.appendItemsToGridwall()', function() {
    var testCurrentGridwallCount = $('#search-result-items').find('li').length;
    var testGridwallCountAjax = 5;
    var testGridwallCount = testCurrentGridwallCount + testGridwallCountAjax;
    app.gridwall.appendItemsToGridwall($(testDataMoreResultsLinkExists));
    strictEqual(testGridwallCount, app.gridwall.getGridwallItemCount(), 'Gridwall count is 10');
});
