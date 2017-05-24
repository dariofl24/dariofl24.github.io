/*global _*/
// app.tabs
(function(app, $) {
    _.mixin(_.str.exports());
    var TABIFY = app.constant.PUBSUB.TABIFY;
    var self = this;
    var $tabifyElement;
    var tabContentClassName;
    var $cacheEnabled;
    $tabifyElement = null;
    tabContentClassName = null;
    $cacheEnabled = null;

    var $cache = {
        loadingMessage: "Loading...",
        defaultClassName: "content-container",
        defaultConverseTabClass: "converse-tabs",
        unchangedMobileClass: "unch-mobile",
        mobileFlag: "mobile",
        standardFlag: "standard",
        defaultAjaxSelector: "#main",
        dataKeyForEnableCache: "tabify-enable-cache"
    };

    function hasCachedContent(e) {
        return e.html() !== "" && e.html() !== $cache.loadingMessage;
    }

    function createHtmlContainerString(p, n) {
        return _.sprintf("<div class='%s %s-%s'></div>",
            $cache.defaultConverseTabClass,
            p,
            n);
    }

    function isMobile() {
        return app.util.isSmallDevice();
    }

    function showContent(container) {
        if ( isMobile() ) {
            container.show();
        } else {
            processTransition($cache.standardFlag);
        }
    }

    function loadUrlDataToPageAjax(url, container, selector, tabContentInitializer) {
        $.ajax({
                async: false,
                url: url,
                beforeSend: function(xhr) {
                    container.html($cache.loadingMessage);
                }
            })
            .fail(function(jqXHR, textStatus, errorThrown) {
                if (jqXHR && jqXHR.status === 401) {
                    var response = $.parseJSON(jqXHR.responseText);
                    if (response && response.redirect) {
                        window.location.href = response.redirect;
                    }
                }
            })
            .done(function(data) {
                container.html($(selector, $(data)).html());
                tabContentInitializer();
            });
    }

    function loadUrlDataToPage(url, container, selector, tabContentInitializer) {
        if ( self.$cacheEnabled === true && hasCachedContent(container) ) {
            $(document).trigger("ajaxComplete");
        } else {
            loadUrlDataToPageAjax(url, container, selector, tabContentInitializer);
        }
    }

    function getAjaxSelector(link) {
        return link.data("ajax-selector") || $cache.defaultAjaxSelector;
    }

    function getTabContentInitializer(link) {
        var initializerName = link.data("ajax-initializer");
        var initializer = app[initializerName] && app[initializerName].init;
        var dummyInitializer = function() {};
        return _.isFunction(initializer) ? initializer : dummyInitializer;
    }

    function makeClassSelector(s) {
        return _.sprintf(".%s", s);
    }

    function getConverseTabContainerClassName() {
        return makeClassSelector($cache.defaultConverseTabClass);
    }

    function getDesktopDisplayContainer() {
        return self.$tabifyElement.next(getConverseTabContainerClassName());
    }

    function getDataContainerElement(tab) {
        return tab.next(getConverseTabContainerClassName());
    }

    function clearAllMobileContainers() {
        var mobileClassSelector = makeClassSelector(_.sprintf("%s-%s",
                                                              $cache.mobileFlag,
                                                              self.tabContentClassName));

        self.$tabifyElement.find(mobileClassSelector).hide();
    }

    function clearAllTabState() {
        self.$tabifyElement.find("li a").removeClass("active");
    }

    function clearStaticContent(s, u) {
        if ( $(self.$tabifyElement).exists() && u === document.URL ) {
            $(s).remove();
        }
    }

    function swapElementContent(o, n) {
        var content = o.children().detach();
        o.html("");
        n.children().remove();
        n.append(content);
    }

    function resetCurrentTabState() {
        var container = getDataContainerElement(self.$tabifyElement.find("li a.active").closest("li"));
        var desktopContainer = getDesktopDisplayContainer();
        if ( hasCachedContent(desktopContainer) ) {
            swapElementContent(desktopContainer, container);
        }
    }

    function shuffleContent(tabLink, tab) {
        resetCurrentTabState();
        clearAllMobileContainers();

        var tabContentUrl = tabLink.attr("href");
        var selector = getAjaxSelector(tabLink);
        var tabContentInitializer = getTabContentInitializer(tabLink);
        var container = getDataContainerElement(tab);

        loadUrlDataToPage(tabContentUrl, container, selector, tabContentInitializer);
        clearAllTabState();
        clearStaticContent(selector, tabLink);
        tab.find("a").addClass("active");
        showContent(container);
        $.publish(TABIFY.TAB_COMPLETE);
    }

    function hasMobileAndStandardContainers(m, s) {
        return m.exists() && s.exists();
    }

    function transitionIsMobile(transitionType) {
        return transitionType === $cache.mobileFlag;
    }

    function transitionIsStandard(transitionType) {
        return transitionType === $cache.standardFlag;
    }

    function getMobileClass() {
        return _.sprintf(".%s-%s", $cache.mobileFlag, self.tabContentClassName);
    }

    function getStandardClass() {
        return _.sprintf(".%s-%s", $cache.standardFlag, self.tabContentClassName);
    }

    function isTransitioningToMobile(transitionType) {
        var mobile = $(getMobileClass());
        var standard = $(getStandardClass());  
        var $standardContainer = self.$tabifyElement.next(getStandardClass());
        return hasMobileAndStandardContainers(mobile, standard) && transitionIsMobile(transitionType) && hasCachedContent($standardContainer);
    }

    function isTransitioningToStandard(transitionType) {
        var mobile = $(getMobileClass());
        var standard = $(getStandardClass());          
        var activeTab = self.$tabifyElement.find("li a.active").eq(0).closest("li");
        var $mobileContainer = activeTab.next(getMobileClass());
        return hasMobileAndStandardContainers(mobile, standard) && transitionIsStandard(transitionType) && hasCachedContent($mobileContainer);
    }

    function processTransition(transitionType) {
        var activeTab = self.$tabifyElement.find("li a.active").eq(0).closest("li");
        var $mobileContainer = activeTab.next(getMobileClass());
        var $standardContainer = self.$tabifyElement.next(getStandardClass());

        if ( isTransitioningToMobile(transitionType) ) {
            swapElementContent($standardContainer, $mobileContainer);
            $mobileContainer.show();
        } else if ( isTransitioningToStandard(transitionType) ) {
            swapElementContent($mobileContainer, $standardContainer);
            $mobileContainer.hide();
        }
    }

    function bindTabBtnAction(tab) {
        var link = tab.find("a").eq(0);
        link.on('click', function(e) {
            e.preventDefault();

            if (!link.hasClass("active")) {
                shuffleContent(link, tab);              
            }
        });
    }

    function initializeIndividualTab(tab, htmlString) {
        tab.after(htmlString);
        bindTabBtnAction(tab);
    }

    function processTransitionToLargeDevice() {
        if ( self.$tabifyElement.find("li a.active").exists() ) {
            processTransition($cache.standardFlag);
        } else {
            setStandardInitState();
        }
    }

    function processDeviceChangeSubscriptions(s) {
        switch ( s ) {
            case app.constant.DEVICE_TYPE.SMALL:
                processTransition($cache.mobileFlag);
                break;
            case app.constant.DEVICE_TYPE.MEDIUM:
                processTransitionToLargeDevice();
                break;
            case app.constant.DEVICE_TYPE.LARGE:
                processTransitionToLargeDevice();
                break;
        }
    }

    function bindAllEvents() {
        var tabHead = self.$tabifyElement.find("ul").eq(0);
        var mobileHtmlString = createHtmlContainerString($cache.mobileFlag, self.tabContentClassName);

        tabHead.find("li").each(function(i, v) {
            initializeIndividualTab($(this), mobileHtmlString);
        });

        $.subscribe(app.constant.RESPONSIVE_DEVICE_OBSERVER, function(pub, arg) {
            processDeviceChangeSubscriptions( arg[0] );
        });
    }

    function setInitState(displayContainerFunc) {
        var contentSelector = getAjaxSelector(self.$tabifyElement.find("li a").eq(0));
        var containerSelector = $(contentSelector).find("activetab").eq(0).data("active-tab");
        var displayContainer = displayContainerFunc(containerSelector);
        
        displayContainer.html($(contentSelector).html());
        $(containerSelector).addClass("active");
        displayContainer.show();
        
        var tabLink = self.$tabifyElement.find("li a.active").eq(0).attr("href");
        clearStaticContent(contentSelector, tabLink);
        
        $(document).trigger("ajaxComplete");
    }

    function setMobileInitState() {
        clearAllMobileContainers();
        clearAllTabState();
        
        var displayContainerFunc = function(selector) {
            return self.$tabifyElement.find(selector).parent().next();
        };

        setInitState(displayContainerFunc);
    }

    function setStandardInitState() {
        var displayContainerFunc = function(selector) {
            return self.$tabifyElement.next(_.sprintf(".%s-%s", $cache.standardFlag, self.tabContentClassName));
        };

        setInitState(displayContainerFunc);
    }

    function tabDocumentReadyFunctionality() {
        $(document).ready(function() {
            if (isMobile()) {
                setMobileInitState();
            } else {
                setStandardInitState();
            }
            
            $.publish(TABIFY.TAB_COMPLETE);
        });
    }
    
    function enableCache( isEnabled ) {
        self.$cacheEnabled = (isEnabled === true);
        
        return self.$cacheEnabled;
    }

    function enableDisableCachePerData(el){
        var enableCacheFromData = $(el).data($cache.dataKeyForEnableCache);
        
        return enableCache(enableCacheFromData);
    }

    function invalidArguments(a) {
        var r = false;

        if( a.length > 2 || a.length === 0 ) {
            console.error("You have not passed the proper arguments to tabify");
            r = true;
        }
        
        return r;
    }
    
    function tabify(el, cn) {
        self.$tabifyElement = $(el);

        if ( self.$tabifyElement.exists() ) {

            if ( invalidArguments(arguments) ) {
                return;
            } else if (arguments.length === 1) {
                self.tabContentClassName = $cache.defaultClassName;
            } else if (arguments.length === 2) {
                self.tabContentClassName = cn;
            }
            
            enableDisableCachePerData(self.$tabifyElement);
            
            var standardHtmlString = createHtmlContainerString($cache.standardFlag, self.tabContentClassName);
            
            bindAllEvents();
            self.$tabifyElement.after(standardHtmlString);
            tabDocumentReadyFunctionality(self.$tabifyElement);
        }
    }

    app.tabs = {
        tabify: tabify,
        enableCache: enableCache,
        enableDisableCachePerData: enableDisableCachePerData,
        hasCachedContent: hasCachedContent
    };
}(window.app = window.app || {}, jQuery));
