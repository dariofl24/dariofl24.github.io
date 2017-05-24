module('App Search Module', {

    setup: function() {
        $('#qunit-fixture').html('');
        $('*').unbind();

        this.htmlFixture = htmlUtil.writeAsString(function() {
            /*!
            <div class="pt_product-search-result">
                <div class="product-sort-filter-options">
                    <div class="filter-by">
                        <h3 class="toggled-in">Filters</h3>
                    </div>
                </div>

                <div id="refinements" class="clearfix">
                    <div class="primary-focus">
                        <div class="refinement gender">
                            <h3 class="toggle expanded" data-refinement-id="gender" data-refinement-used="false">
                        </div>
                        <div class="refinement refinementSize">
                            <h3 class="toggle expanded" data-refinement-id="refinementSize" data-refinement-used="false">
                        </div>
                        <div class="refinement cut">
                            <h3 class="toggle expanded" data-refinement-id="cut" data-refinement-used="false">
                        </div>
                        <div class="refinement color">
                            <h3 class="toggle expanded" data-refinement-id="color" data-refinement-used="false">
                        </div>
                        <div class="refinement brandSegment">
                            <h3 class="toggle expanded" data-refinement-id="brandSegment" data-refinement-used="false">
                        </div>
                    </div>
                </div>

                <div id="refinement-details" style="display: block;">
                    <div class="primary-focus">
                        <div class="refinement-detail gender" style="display: none;">
                            <div class="container">
                                <div class="inner-container">
                                    <ul data-refinement-id="gender">
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div class="refinement-detail refinementSize" style="display: none;">
                            <div class="container">
                                <div class="inner-container">
                                    <ul data-refinement-id="refinementSize">
                                    </ul>
                                </div>
                            </div>
                            <div class="red" id="invalid_gender"> Please select a gender before selecting a size </div>
                        </div>

                        <div class="refinement-detail cut" style="display: none;">
                            <div class="container">
                                <div class="inner-container">
                                    <ul data-refinement-id="cut">
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div class="refinement-detail color" style="display: none;">
                            <div class="container">
                                <div class="inner-container">
                                    <ul data-refinement-id="color">
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div class="refinement-detail brandSegment" style="display: none;">
                            <div class="container">
                                <div class="inner-container">
                                    <ul data-refinement-id="brandSegment">
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div id="refinement-details-mobile" style="display: none;">
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

var refinements = ['gender', 'cut', 'color', 'brandSegment'];

function enableRefinement(refinement) {
    $('#refinements .refinement.' + refinement + ' h3').attr('data-refinement-used', 'true');
}

function testRefinementSizeError() {
    test('Clicking size refinement before selecting gender shows error message', function() {
        app.search.init();
        var $refinement = $('#refinements .refinement.refinementSize h3')
        $refinement.trigger('click');
        var $refinementDetails = $('#refinement-details .refinement-detail.refinementSize').find('#invalid_gender');
        strictEqual($refinementDetails.is(':visible'), true, 'Error message is shown');
    });
}

function testRefinementSizeEnabled() {
    enableRefinement('gender');
    testRefinement('refinementSize');
}

function testRefinements() {
    $.each(refinements, function(index) {
        testRefinement(refinements[index]);
    });
    testRefinementSizeEnabled();
    testRefinementSizeError();
}
