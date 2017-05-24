module('App Filters Module', {

    setup: function() {
        $('#qunit-fixture').html('');
        $('*').unbind();

        this.htmlFixture = htmlUtil.writeAsString(function() {
            /*!
            <div id="refinements">
                <div class="refinement gender">
                    <h3 class="filter-type" data-refinement-id="gender"></h3>
                </div>
                <div class="refinement brandSegment">
                    <h3 class="filter-type" data-refinement-id="brandSegment"></h3>
                    <div class="refinement-detail brandSegment">
                        <ul data-refinement-id="brandSegment">
                            <li class="selected">
                                <span>all-star</span>
                            </li>
                            <li class="selected">
                                <span>cons</span>
                            </li>
                            <li class="not-selected">
                                <span>jack-purcell</span>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="refinement collection">
                    <h3 class="filter-type" data-refinement-id="collection"></h3>
                </div>
                <div class="refinement size">
                    <h3 class="filter-type" data-refinement-id="size"></h3>
                </div>
                <div class="refinement color">
                    <h3 class="filter-type" data-refinement-id="color"></h3>
                </div>
                <div class="refinement cut">
                    <h3 class="filter-type" data-refinement-id="cut"></h3>
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

test('Get all available filter types on page - app.filters.getAvailableFilters()', function() {
    var testFilters = ['gender', 'brandSegment', 'collection', 'size', 'color', 'cut']
    var filters = app.filters.getAvailableFilters();
    deepEqual(testFilters, filters, 'Filter arrays are equal');
});

test('Get all selected refinements for a paticular filter (brandSegment) - app.filters.getSelectedFilterRefinements()', function() {
    var testSelectedRefinements = ['all-star', 'cons'];
    var selectedRefinements = app.filters.getSelectedFilterRefinements('brandSegment');
    deepEqual(testSelectedRefinements, selectedRefinements, 'Selected refinements arrays are equal');
});

test('Get number of selected refinements for all filters - app.filters.getSelectedRefinementCount()', function() {
    var selectedRefinementsCount = app.filters.getSelectedRefinementCount();
    strictEqual(2, selectedRefinementsCount, 'Selected refinements counts are equal');
});
