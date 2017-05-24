module( "Module App HtmlBuilder", {
    self : this,
    
	setup: function() {	
        postMessageEventType = new Array();
        postMessageObject = new Array();
        
        listenEventType = new Array();
        listenCallback = new Array();
        
        dispatchEventType = new Array();
        dispatchObject = new Array();
        
        nike = {
            id: {
                frame : {
                    PageMessageUtil: {
                        postMessage : function(eventTypeArg, objectArg)
                        {
                        	self.postMessageEventType.push(eventTypeArg);
                        	self.postMessageObject.push(objectArg);
                        },
                        
                        listen : function(eventTypeArg, callback)
                        {
                            self.listenEventType.push(eventTypeArg);
                            self.listenCallback.push(callback);
                        },
                        
                        dispatch : function(eventTypeArg, objectArg)
                        {
                            self.dispatchEventType.push(eventTypeArg);
                            self.dispatchObject.push(objectArg);
                        }
                    },
                    ClassUtil : {
                    	addCallback : function(app, callback){}
                    }
                },
                Event : {
                    postMessage: {
                        CONFIG_REQUEST : "CONFIG_REQUEST",
                        CONFIG_RESPONSE : "CONFIG_RESPONSE",
                        ADD_TO_CART : "ADD_TO_CART",
                        ADD_TO_CART_SUCCESS : "ADD_TO_CART_SUCCESS",
                        ADD_TO_CART_FAIL : "ADD_TO_CART_FAIL"
                    }
                }
            }
        };
        
        
    },
    teardown: function() {
    	postMessageEventType = null;
        postMessageObject = null;
        listenEventType = null;
        listenCallback = null;
        dispatchEventType = null;
        dispatchCallback = null;
    }
});

test("When App Html Builder generates the Item to send to Add To Cart service it is well configured", function() {

    var item = {
        metricId : "898989",
        quantity : 1,
        siteId : 12,
        commerceItemId : null,
        siteReturnUrl : "http://converse.com/pdp/dyo/12345",
        itemReturnUrl : "http://converse.com/pdp/dyo/12345&metricId=898989"
    };
    
    app.htmlBuilder.configuration.targetObject = "http://nikeid.nike.com";
    var item = app.htmlBuilder.buildAddToCartItem( "898989");
    
    ok( item.metricId == "898989", "bad metricId");
    ok( item.quantity === 1, "quantity should be 1");
    ok( item.siteId === 12, "site Id should be 12");
    ok( item.commerceItemId == null, "commerce item should not preexist");
    ok( item.siteReturnUrl == window.location.href, "siteReturnURL is not set from window.location.href");
    ok( item.itemReturnUrl == window.location.href + "&metricId=898989", "itemReturnUrl is not formed with metricId as param");
    
});


test("When App Html Builder generates the XML request for Add To Cart service it is done in the proper way", function() {

    var item = {
        metricId : "898989",
        quantity : 1,
        siteId : 12,
        commerceItemId : null,
        siteReturnUrl : "http://converse.com/pdp/dyo/12345",
        itemReturnUrl : "http://converse.com/pdp/dyo/12345&metricId=898989"
    };
    
    app.htmlBuilder.configuration.targetObject = "http://nikeid.nike.com";
    var xml = app.htmlBuilder.buildAddToCartXML( item );
    
    var expected = htmlUtil.writeAsString(function() {/*!<?xml version="1.0" encoding="UTF-8"?><root>
<configuration>
<metricId>898989</metricId>
<quantity>1</quantity>
<siteId>12</siteId>
<itemReturnUrl><![CDATA[http://converse.com/pdp/dyo/12345&metricId=898989]]></itemReturnUrl>
<siteReturnUrl><![CDATA[http://converse.com/pdp/dyo/12345]]></siteReturnUrl>
</configuration>
</root>*/});
    
    ok(xml == expected,  "XML message is not well generated. Generated = \n" + xml + "\nExpected = " + expected );
    
});

test("When App Html Builder posts a message with configuration is it well passed to postMessage", function() {

    app.htmlBuilder.postConfiguration();
    
    ok(self.postMessageEventType[0] == "CONFIG_RESPONSE",  "event type should be nike.id.Event.postMessage.CONFIG_RESPONSE");
    ok(self.postMessageObject[0] === app.htmlBuilder.configuration,  "configuration objects should be app.htmlBuilder.configuration");
    
    
});

test("When App Html Builder attempts to bind events it does binding for CONFIG_REQUEST and ADD_TO_CART", function() {

    app.htmlBuilder.bindEvents();
    
    ok(self.listenEventType[0] == "CONFIG_REQUEST",  "evnet type should be nike.id.Event.postMessage.CONFIG_REQUEST");
    ok(self.listenCallback[0] === app.htmlBuilder.postConfiguration,  "callback should be app.htmlBuilder.postConfiguration");
    ok(self.listenEventType[1] == "ADD_TO_CART", "event type should be nike.id.Event.postMessage.ADD_TO_CART");
    ok(self.listenCallback[1] === app.htmlBuilder.addToCart,  "callback should be app.htmlBuilder.addToCart");
    
});

test("When App Html Builder receives a sucessfull response indicating the item was successfully added to cart, it can notify the results properly", function() {
    app.minicart = app.minicart || {};
    sinon.stub(app.minicart, "refresh", function(f, t){
        //nothing
    });
    
    var addToCartResponse = '<?xml version="1.0" encoding="UTF-8"?><cart itemsAdded="1" totalItems="1"><item metricId="563170361" cartId="CI885481837" status="success"></item></cart>';
    var updateMinicartMock = sinon.mock(app.product);
    updateMinicartMock.expects("addDYOProductAndUpdateMiniCart").once();
    
    app.htmlBuilder.addToCartSuccessCallback(addToCartResponse);
    
    ok(self.postMessageEventType[0] == "ADD_TO_CART_SUCCESS",  "postMessage event type should be nike.id.Event.postMessage.ADD_TO_CART_SUCCESS" );
    ok(self.postMessageObject[0].type == "nike.id.Event.postMessage.ADD_TO_CART_SUCCESS",  "postMessage object type should be nike.id.Event.postMessage.ADD_TO_CART_SUCCESS" );
    ok(self.postMessageObject[0].data === addToCartResponse,  "postMessage object sent as data should be the AddToCart response");
    ok(self.dispatchEventType[0] == "ADD_TO_CART_SUCCESS",  "postMessage event type should be nike.id.Event.postMessage.ADD_TO_CART_SUCCESS" );
    ok(self.dispatchObject[0].type == "nike.id.Event.postMessage.ADD_TO_CART_SUCCESS",  "postMessage object type should be nike.id.Event.postMessage.ADD_TO_CART_SUCCESS" );
    ok(self.dispatchObject[0].data === addToCartResponse,  "postMessage object sent as data should be the AddToCart response");
    
    updateMinicartMock.verify();
    updateMinicartMock.restore();
    
    app.minicart.refresh.restore();
    
});

test("When App Html Builder receives a sucessfull response indicating there is an error when adding the item to cart, it can notify delegate the handling to the error method", function() {
    var addToCartResponse = '<?xml version="1.0" encoding="UTF-8"?><cart itemsAdded="1" totalItems="1"><item metricId="563170361" cartId="CI885481837" status="failure"></item></cart>';
    
    var addToCartErrorCallabackSpy = sinon.spy(app.htmlBuilder, "addToCartErrorCallaback");
    
    app.htmlBuilder.addToCartSuccessCallback(addToCartResponse);
    
    ok( addToCartErrorCallabackSpy.calledWith( addToCartResponse,null), "addToCartErrorCallaback should be called" );
    
    app.htmlBuilder.addToCartErrorCallaback.restore();
    
});

test("When App Html Builder receives an error response when attempting to add an item to cart, it can notify the results properly", function() {
    
	app.htmlBuilder.addToCartErrorCallaback("Internal Error", 500);
    
    ok(self.postMessageEventType[0] == "ADD_TO_CART_FAIL",  "postMessage event type should be nike.id.Event.postMessage.ADD_TO_CART_FAIL" );
    ok(self.postMessageObject[0].type == "nike.id.Event.postMessage.ADD_TO_CART_FAIL",  "postMessage object type should be nike.id.Event.postMessage.ADD_TO_CART_FAIL" );
    ok(self.postMessageObject[0].data == "Internal Error",  "postMessage object sent as data should be the same response message");
    ok(self.dispatchEventType[0] == "ADD_TO_CART_FAIL",  "postMessage event type should be nike.id.Event.postMessage.ADD_TO_CART_FAIL" );
    ok(self.dispatchObject[0].type == "nike.id.Event.postMessage.ADD_TO_CART_FAIL",  "postMessage object type should be nike.id.Event.postMessage.ADD_TO_CART_FAIL" );
    ok(self.dispatchObject[0].data == "Internal Error",  "postMessage object sent as data should be the same response message");
    
    
});

test("When App Html Builder calls addToCart it generates and send the proper AJAX POST call to AddToCart service", function() {
    
	app.urls.addDYOProduct = "http://localhost/addToCart";
	
	
	var ajaxData = null;
    sinon.stub($, "ajax", function(data){
    	ajaxData = data;
    });
    
    sinon.stub(app.htmlBuilder, "buildAddToCartItem", function(metricId){
        return {};
    });
    
    sinon.stub(app.htmlBuilder, "buildAddToCartXML", function(dataItem){
        return "<root><configuration><metricId>898989</metricId></configuration></root>";
    });

    sinon.stub(app.htmlBuilder.reviewPanel, "show", function(metricId) {
        var deferred = $.Deferred();
        deferred.resolve("confirm");
        return deferred;
    });
    
    app.htmlBuilder.addToCart("898989");
    
    
    ok(ajaxData.type == "POST",  "ajax call should be of POST type" );
    ok(ajaxData.dataType == "text",  "ajax type should be text" );
    ok(ajaxData.url == app.urls.addDYOProduct, "ajax url should be the addToCart service URL" );
    ok(ajaxData.data.xml == "<root><configuration><metricId>898989</metricId></configuration></root>", "data send is not the expected XML message" );
    ok(ajaxData.success === app.htmlBuilder.addToCartSuccessCallback,  "ajax success shall be handled by app.htmlBuilder.addToCartSuccessCallback" );
    ok(ajaxData.error === app.htmlBuilder.addToCartErrorCallback,  "ajax error shall be handled by app.htmlBuilder.addToCartErrorCallback" );
    
    $.ajax.restore();
    app.htmlBuilder.buildAddToCartItem.restore();
    app.htmlBuilder.buildAddToCartXML.restore();
    
});

test("When App Html Builder initializes it makes the proper steps", function() {
    
    app.customization = {
        nikeIdDomain : "nikeid.nike.com"
    };
    
    var preparePageOriginal = app.htmlBuilder.preparePage;
    var pagePrepared = false;
    app.htmlBuilder.preparePage = function(){
        pagePrepared = true;
    };

    var classUtilAddCallbackSpy = sinon.spy(nike.id.frame.ClassUtil, "addCallback");

    var input = document.createElement("input");
    input.setAttribute("type", "hidden");
    input.setAttribute("id", "url");
    input.setAttribute("value", "ecn67-nikeid.nikedev.com/custom-builder/builder/product.html?referrer=dev03.store.converse.demandware.net&client=converse-desktop&country=US&lang_locale=de_DE&pathName=chuTayHiCan1404&mid=762360313&debug=true");

    $('body').append(input);

    app.htmlBuilder.init();

    ok( app.htmlBuilder.configuration.targetOrigin == "http://nikeid.nike.com");
    ok(classUtilAddCallbackSpy.calledWith(app.htmlBuilder, app.htmlBuilder.bindEvents), "nike.id.frame.ClassUtil.addCallback is not properly registering the app.htmlBuilder events");
    ok( pagePrepared, "preparePage was not called");
    nike.id.frame.ClassUtil.addCallback.restore();
    app.htmlBuilder.preparePage = preparePageOriginal;
});

test("When App Html Builder receives a sucessfull response and status is duplicate", function() {
    var addToCartResponse = '<?xml version="1.0" encoding="UTF-8"?><cart><item status="duplicate"/></cart>';;
    
    var addToCartErrorCallabackSpy = sinon.spy(app.htmlBuilder, "addToCartErrorCallaback");
    
    app.htmlBuilder.addToCartSuccessCallback(addToCartResponse);
    
    ok( !addToCartErrorCallabackSpy.called, "addToCartErrorCallaback should be called" );
    
    app.htmlBuilder.addToCartErrorCallaback.restore();
});





