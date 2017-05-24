/*global _, window */
(function(app, $) {

    var AppUtils = app.util,
        Helper = app.storeLocator.StoreLocatorHelper;

    function StoreLocatorList(locator) {
        if (!(this instanceof StoreLocatorList)) {
            return new StoreLocatorList(locator);
        }

        this.locator = locator;
        this.config = locator.getConfig();
        this.cache = locator.getCache();

        this.init();
    }

    StoreLocatorList.prototype = {

        syncSearchRadius: function() {
            this.cache.searchRadius.text(this.locator.getRadiusWithUnits());
            this.cache.storesFooter.show();
        },

        clearList: function() {
            this.cache.storesList.empty();
        },

        getListItem: function(store) {
            return $(_.sprintf("#store-%s", store.id));
        },

        getFirstListItem: function () {
            return this.cache.storesList.find("li:visible").first();
        },

        getListItemStore: function(itemEl) {
            var storeId = itemEl.attr("id").replace("store-", "");
            return this.locator.getStore(storeId);
        },

        getFirstListItemStore: function() {
            return this.getListItemStore(this.getFirstListItem());
        },

        scrollListToStore: function(store) {
            var offset = this.getFirstListItem().position().top;
            var top = this.getListItem(store).position().top;
            $(this.cache.scrollerDiv).animate({ scrollTop: top - offset }, 'fast');
        },

        selectListStore: function(store) {
            if (this.config.listItemSelectedEnabled) {
                this.cache.storesList.find("li").removeClass("selected");
                this.getListItem(store).addClass("selected");
            }
        },

        syncListStore: function(store) {
            this.selectListStore(store);
            this.scrollListToStore(store);
        },

        getScrollerHeight: function() {
            var pageTopOffset = this.cache.pageDiv.offset().top,
                contentTopOffset = this.cache.contentDiv.offset().top,
                padding = contentTopOffset - pageTopOffset,
                resultsTopOffset = this.cache.resultsDiv.offset().top,
                footerTopOffset = this.cache.footerDiv.offset().top,
                resultsHeight = footerTopOffset - resultsTopOffset,
                storesMessageHeight = this.cache.storeMessage.outerHeight(),
                storesFooterHeight = this.cache.storesFooter.outerHeight();

            return resultsHeight - storesMessageHeight - storesFooterHeight - padding;
        },

        resizeScroller: function() {
            this.cache.scrollerDiv.css({ 'max-height': this.getScrollerHeight() });
        },

        createListItem: function(store) {
            var elId = _.sprintf("store-%s", store.id);
            return Helper.createStoreDiv("<li/>", store, this.config, { id: elId });
        },

        addListItemOverEvent: function() {
            this.cache.storesList.on("mouseenter", ".store", function() {
                var itemEl = $(this);
                itemEl.addClass("active");
            });
        },

        addListItemOutEvent: function() {
            this.cache.storesList.on("mouseleave", ".store", function() {
                var itemEl = $(this);
                itemEl.removeClass("active");
            });
        },

        handleListItemClick: function(itemEl) {
            var store = this.getListItemStore(itemEl);
            this.selectListStore(store);

            if (this.locator.hasMap()) {
                this.locator.getMap().syncMarkerStore(store);
            }
        },

        addListItemClickEvent: function() {
            var that = this;
            this.cache.storesList.on("click", ".store", function() {
                var itemEl = $(this);
                that.handleListItemClick(itemEl);
            });
        },

        addListItemEvents: function() {
            if (this.config.listItemOverEnabled && !this.locator.isTouch()) {
                this.addListItemOverEvent();
                this.addListItemOutEvent();
            }

            this.addListItemClickEvent();
        },

        bindEvents: function() {
            this.addListItemEvents();
        },

        reset: function() {
            this.clearList();
        },

        syncListUI: function(count) {
            if (count > 0) {
                var store = this.getFirstListItemStore();
                this.syncListStore(store);
            }
        },

        filterListItem: function(listItem, filters, store) {
            var visible = this.locator.passesFilters(filters, store);
            AppUtils.setElementVisible(listItem, visible);
            return visible;
        },

        applyFilters: function() {
            var that = this,
                filters = this.locator.getSelectedFilters(),
                count = 0;

            var listItems = that.cache.storesList.find("li");
            listItems.each(function() {
                var listItem = $(this),
                    store = that.getListItemStore(listItem),
                    visible = that.filterListItem(listItem, filters, store);

                if (visible) {
                    count++;
                }
            });

            this.syncListUI(count);

            return count;
        },

        populate: function(userSearch) {
            this.reset();

            var count = 0;

            if (this.locator.getStoreCount() > 0) {
                var that = this,
                    filters = this.locator.getSelectedFilters();

                $.each(this.locator.getStores(), function(id, store) {
                    var listItem = that.createListItem(store),
                        visible = that.filterListItem(listItem, filters, store);

                    that.cache.storesList.append(listItem);

                    if (visible) {
                        count++;
                    }
                });
            }

            this.syncListUI(count);
            this.syncSearchRadius();

            return count;
        },

        init: function() {
            this.bindEvents();
        }
    };

    app.storeLocator = app.storeLocator || {};
    app.storeLocator.StoreLocatorList = StoreLocatorList;

}(window.app = window.app || {}, jQuery));
