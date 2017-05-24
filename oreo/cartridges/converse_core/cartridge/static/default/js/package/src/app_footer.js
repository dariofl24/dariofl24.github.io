/*global window */
(function(app, $) {
    var $cache;

    function initializeCache() {
        $cache = {
            footerLinks: $(".footer-bottom")
        };

        $cache.linkList = $cache.footerLinks.find(".link-list");
        $cache.linkSelect = $cache.footerLinks.find(".link-select");
    }

    function getLink(contentVal) {
        return $cache.linkList.find("a[title='"+contentVal+"']");
    }

    function handleLinkSelectChange() {
        if(this.value === 'nikeSites-link'){
            event.preventDefault();
            app.popUpNikeSites.init();
        }else{
            var selected = $cache.linkSelect.find("option:selected").first(),
            link = getLink(selected.text()),
            url = link.attr("href");
            if (url) {
                if (url.match("^#.*") === null) {
                    app.page.setLocationHref(url);
                }else {
                    $cache.linkSelect.find("[value='more']").attr("selected", "selected");
                    $cache.linkSelect.blur();
                    link.click();
                }
            }
        }
    }

    function bindEvents() {
        $cache.linkSelect.customSelect();
        $cache.linkSelect.on("change", handleLinkSelectChange);
    }

    function initializePopup() {
        $('.country-selector-popup').on('click', function(event){
            event.preventDefault();

            var url = $(this).attr('href');

            $.magnificPopup.open({
                items: {
                    src: url,
                    type: 'ajax'
                },
                callbacks: {
                    open: function() {
                        $('.mfp-content').css('height', '100%');
                        $('.mfp-container').css('padding', '0');
                        $('.mfp-wrap').css('z-index', '1000000000 !important');
                    },
                    close: function() {
                        $('.mfp-content').css('height', 'auto');
                        $('.mfp-container').css('padding', '0 8px');
                        $('.mfp-wrap').css('z-index', '1043 !important');
                    }
                }
            });
        });
        
        $('.country-selector-popup').removeAttr("style");
    }
    
    /*function initializeNikePopup() {
        $('.nikeSites-link').on('click', function(event){
            event.preventDefault();

            var url = $(this).attr('href');

            $.magnificPopup.open({
                items: {
                    src: url,
                    type: 'ajax'
                },
                callbacks: {
                    open: function() {
                        $('.mfp-content').css('height', '100%');
                        $('.mfp-container').css('padding', '0');
                        $('.mfp-wrap').css('z-index', '1000000000 !important');
                    },
                    close: function() {
                        $('.mfp-content').css('height', 'auto');
                        $('.mfp-container').css('padding', '0 8px');
                        $('.mfp-wrap').css('z-index', '1043 !important');
                    }
                }
            });
        });
        
    }*/
    
    function adaptFooter() {
        var footerHeight = $("footer").height();
        var prevDiv = $("footer").prevAll("div:visible,section:visible").first();
        var storePadding = $(".footer-top").height() +  $("header").height() + "px";
        prevDiv.css("padding-bottom", footerHeight + "px" );

        // Show map and a part of the footer
        $(".pt_store-locator").parent().css("padding-bottom", storePadding);
    }

    // Initialize footer.
    app.footer = {
        init: function() {
            initializeCache();
            bindEvents();
            initializePopup();
            //initializeNikePopup();
            adaptFooter();
        }
    };

    $(window).resize(function () {
        adaptFooter();
    });


} (window.app = window.app || {}, jQuery));
