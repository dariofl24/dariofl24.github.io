/*global window, Mustache */
/*jshint forin: false, multistr: true */

(function(app, $) {

    function PickUpPointList(data) {
        this.data = data;
        this.init();
    }

    PickUpPointList.prototype = {
        isGeocoded: function() {
            return this.geocoded;
        },
        getData: function() {
            return this.data;
        },
        setData: function(data) {
            this.data = data;
        },
        getCount: function() {
            return Object.keys(this.getData()).length;
        },
        initData: function() {
            this.geocoded = false;
            this.normalizeCoordidates();
        },
        initCache: function() {
            var cache = {
                pupList: $('#pup-list .list-container'),
                pupPopupPostal: $('#pup-popup-postal'),
                pupErrorMessagePanel: $('.pup-map-list #pup-error-message')
            };

            cache.pupInfo = cache.pupList.find('.pup-info');

            this.cache = cache;
        },
        getFormattedAddress: function(pickUpPoint) {
            var address = pickUpPoint.address;
            return [address.street, address.city, address.postalCode].join(' ');
        },
        getAddressPostalCode: function(pickUpPoint) {
            var address = pickUpPoint.address;
            return address.postalCode;
        },
        normalizeCoordidates: function() {
            for (var pickUpPointID in this.data) {
                var pickUpPoint = this.data[pickUpPointID];
                console.log(pickUpPointID+" - "+pickUpPoint);
                if ('location' in pickUpPoint) {
                    pickUpPoint.latitude = pickUpPoint.location.latitude;
                    pickUpPoint.longitude = pickUpPoint.location.longitude;
                    console.log("PUP: "+pickUpPoint.latitude+","+pickUpPoint.longitude);
                    this.geocoded = true;
                } else {
                    return;
                }
            }
        },
        resetList: function() {
            this.cache.pupInfo.remove();
        },
        removeData: function() {
            this.data = {};
        },
        removePickUpPointList: function () {
            this.cache.pupInfo.remove();
        },
        selectPickUpPointHandler: function(event) {
            event.preventDefault();
            var pickUpPointID = $(this).attr('data-pup-id');
            app.pickUpPoint.displayPickUpPointInfo(pickUpPointID);
        },
        findRouteToPickUpPointHandler: function(event) {
            event.preventDefault();
            var map = app.pickUpPoint.getPickUpPointMap();
            var pickUpPointID = $(this).attr('data-pup-id');
            map.findRouteToPickUpPoint(pickUpPointID);
        },
        renderOrderedList: function(pairs,limit) {
            console.log("++++++renderList: "+limit);
            console.log(pairs);
            
            var that = this;
            this.resetList();
            var curr=0;
            
            $.each(pairs, function(id, obj) {
            
                if((limit !== undefined) && curr<limit ){
                    var template = $('#pup-info-tpl').html();
                    var rendered = Mustache.render(template,obj.pup);
                    that.cache.pupList.append(rendered);
                }
                curr+=1;
            });
            this.bindEvents();
        },
        renderList: function() { 
            console.log("---renderList");
            var that = this;
            this.resetList();

            $.each(this.getData(), function(id, pickUpPoint) {
                var template = $('#pup-info-tpl').html();
                var rendered = Mustache.render(template, pickUpPoint);
                that.cache.pupList.append(rendered);
            });
        },
        bindEvents: function() { console.log("---bindEvents");
            
            this.cache.pupList.off('click', '.select-button');
            this.cache.pupList.on('click', '.select-button', this.selectPickUpPointHandler);
            this.cache.pupList.off('click', '.grey-car-icon');
            this.cache.pupList.on('click', '.grey-car-icon', this.findRouteToPickUpPointHandler);
        },
        displayError: function(message) {
            var that = this;
            that.cache.pupErrorMessagePanel.fadeIn();
            that.cache.pupErrorMessagePanel.html(message);
            
            setTimeout(function() {
                that.cache.pupErrorMessagePanel.fadeOut();
            }, 2000);
        },
        init: function() {
            this.initData();
            this.initCache();
//            this.renderList();
//            this.bindEvents();
        }
    };

    app.pup = app.pup || {};
    app.pup.PickUpPointList = PickUpPointList;

}(window.app = window.app || {}, jQuery));