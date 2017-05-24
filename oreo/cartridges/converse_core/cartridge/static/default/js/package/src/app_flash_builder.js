/*global SWFObject,EventBridge,location*/
// app.flashbuilder
(function(app, $) {

    var $cache;
    
    app.flashbuilder = {
        containerId : "flash-builder-container",
        
        swfObject : undefined,
        
        variables : {},
        properties : {},
        
        defaultVariables : {
            id : "builderID",
            domain : window.location.protocol + "//" + window.location.hostname,
            flashSource : function(){ return this.domain + "/builder/standaloneIDBuilder.swf"; },
            width : "100%",
            height : "675",
            version : "9",
            backgroundColor : null,
            quality : "high",
            
            productId : undefined,
            nikeProductID : undefined,
            metricId : undefined,
            context : "CONVERSE_ONE",
            channel : "CONVERSE_ONE",
            lang_locale : "en_US",
            country : "US",
            language : "en",
            buildConfigDataPath : "/builder/builder_config_only_converse_en_US.xml",
            buildTranslationPath : "/builder/builder_text_one_converse_en_US.xml",
            shellDomain : function(){ return app.customization.nikeIdDomain; },
            FQDN : function(){ return this.domain + "/"; },
            sendToFriendURL : function(){ return app.urls.sendDYOToFriend; },
            saveDesignURL : function(){ return app.urls.addToMyDesigns; },
            itemReturnURL : function(){ return "?pid=" + this.productId; },
            builderVersion : "5.1",
            siteId : "12",
            site : "converse",
            reportSuiteId : "nikeall,nikeusdirect,nikeshopus",
            productDescription : "",
            startState : "",
            productSubtitle : "",
            prebuildId : "",
            instanceId : "",
            versionId : "PCV_10002",
            seasonId : "seas_4004&",
            pathName : function(){ return this.nikeProductID; }
            
        },
        
        defaultParameters : {
            requiredVersion : "9.0.28",
            allowFullscreen :  true,
            menu : false,
            loop : false,
            scale : "noscale",
            quality : "high",
            salign : "tl",
            wmode : "transparent",
            pluginspage: "http://www.adobe.com/products/flashplayer/",
            allowScriptAccess : "always",
            allownetworking : "all"
        },

        initializeCache : function()
        {
            $cache = {
                globalPromoBannerSpinner : $(".dyo-promo-banner-spinner")
            };
        },
        
        init : function(variablesArg, parametersArg) 
        {
            app.flashbuilder.variables = app.flashbuilder.obtainVariables(variablesArg);

            app.flashbuilder.initializeCache();
            
            if( typeof app.flashbuilder.variables.nikeProductID === "undefined" || app.flashbuilder.variables.nikeProductID === "" )
            {
                $("#" + app.flashbuilder.containerId).html("Application cannot load: Nike Product ID is not provided");
                return;
            }
            
            app.flashbuilder.parameters = app.flashbuilder.obtainParameters(parametersArg);
            
            app.flashbuilder.swfObject = app.flashbuilder.obtainSWFObject(app.flashbuilder.variables);
            app.flashbuilder.prepareSWFObject(app.flashbuilder.swfObject, app.flashbuilder.variables, app.flashbuilder.parameters);
            
            app.flashbuilder.subscribeToPageEvents();
            app.flashbuilder.subscribeToFlashEvents();
        },
        
        obtainVariables : function(variablesArg)
        {
            variablesArg = typeof variablesArg !== 'undefined' ? variablesArg : {};
            
            return $.extend({}, app.flashbuilder.defaultVariables, variablesArg);
        },
        
        obtainParameters : function(parametersArg)
        {
            parametersArg = typeof parametersArg !== 'undefined' ? parametersArg : {};
            
            return $.extend({}, app.flashbuilder.defaultParameters, parametersArg);
        },
        
        obtainSWFObject : function(variables)
        {
            var swfObject = new SWFObject(
                    app.flashbuilder.obtainValue(variables, variables.flashSource), 
                    app.flashbuilder.obtainValue(variables, variables.id),
                    app.flashbuilder.obtainValue(variables, variables.width),
                    app.flashbuilder.obtainValue(variables, variables.height),
                    app.flashbuilder.obtainValue(variables, variables.version),
                    app.flashbuilder.obtainValue(variables, variables.backgroundColor),
                    app.flashbuilder.obtainValue(variables, variables.quality)
                    );
            
            return swfObject; 
        },
        
        prepareSWFObject : function(swfObject, variables, parameters)
        {
            app.flashbuilder.configureParameters(swfObject, parameters);
            app.flashbuilder.configureVariables(swfObject, variables);
            swfObject.write( app.flashbuilder.containerId );
        },
        
        
        obtainValue : function(context, reference)
        {
            if( typeof(reference) === "function")
            {
                return reference.call(context);
            }
            
            return reference;
        },
        
        configureParameters : function(swfObject, parameters)
        {
            var parameterKey;
            
            for( parameterKey in parameters )
            {
                if( parameters.hasOwnProperty(parameterKey) )
                {
                    var value = app.flashbuilder.obtainValue(parameters, parameters[parameterKey]);
                    swfObject.addParam( parameterKey, value);
                }
            }
        },
        
        configureVariables : function(swfObject, variables)
        {
            var variableKey;
            
            for( variableKey in variables )
            {
                if( variables.hasOwnProperty(variableKey) )
                {
                    var value = app.flashbuilder.obtainValue(variables, variables[variableKey]);
                    swfObject.addVariable( variableKey, value);
                }
            }
        },
        
        subscribeToPageEvents : function()
        {
            app.flashbuilder.subscribeToPageLoggedIn();
            app.flashbuilder.subscribeToPageLoginCanceled();
            app.flashbuilder.subscribeToPageAttemptsToLeave();
        },
        
        notifyToFlashBuilder : function(dataArg)
        {
            console.debug("EventBridge : notifying to Flash Builder ...");
            console.debug("data");
            var e = {
                type: "builderEventType",
                data: dataArg
            };
            EventBridge.dispatchEvent(e);
        },
        
        subscribeToPageLoggedIn : function()
        {
            $.subscribe(app.constant.PUBSUB.LOGIN_PANEL.USER.LOGGED_IN, function(){
                app.flashbuilder.notifyToFlashBuilder( "loginSuccess" );
            });
        },
        
        subscribeToPageLoginCanceled : function()
        {
            $.subscribe(app.constant.PUBSUB.LOGIN_PANEL.USER.LOGIN_CANCELED, function(){
                app.flashbuilder.notifyToFlashBuilder( "loginCancel" );
            });

            $.subscribe(app.constant.SLIDER.COLLAPSED, function(topic, panelName){
                if ($('#account-info-box').hasClass('logout')) {
                    return;
                }

                if (panelName === app.constant.SLIDER.LOGIN_PANEL) {
                    app.flashbuilder.notifyToFlashBuilder( "loginCancel" );
                }
            });
        },
        
        subscribeToPageAttemptsToLeave : function()
        {
            $('a').bind('click', function(e)
            {
                var anchor = this;
                
                //Handle special case for expandable Main Menu
                if(app.primarycatalognavigation.hasSubcategories(anchor))
                {
                    //Propagate because it is expanding the subcategories menu instead of leaving the page
                    return true;
                }

                var currentHref = $(anchor).attr("href");
                
                if( currentHref.indexOf("void(0)") === -1 ){
                    e.preventDefault();
                    app.slider.collapse();
                    app.flashbuilder.notifyToFlashBuilder( currentHref );
                }

            });
        },
        
        subscribeToFlashEvents : function()
        {
            var builderEventListenerObject = { };
            
            builderEventListenerObject.listenerFunction = function(event) {
                console.debug("shellEventType:listenerFunction called by Flash");
                console.debug(event);
                var eventObj = event;

                app.omnitureflashbuilder.trackingforFlashEvents(eventObj);

                if(eventObj.data.id === "builderReady")
                {
                    app.flashbuilder.listenBuilderReady();
                }
                else if(eventObj.data.id === "loginRequired")
                {
                    app.flashbuilder.listenFlashLoginRequired();
                }
                else if(eventObj.data.id === "setLocation")
                {
                    app.flashbuilder.listenLocation(eventObj.data.loc);
                }
                //Track event triggered, need to digg into details
                else if(eventObj.data.id === "trackBuilder")
                {
                    app.flashbuilder.listenTrackingData(eventObj.data.tracking_data);
                }
            };
            
            EventBridge.addListener("shellEventType", builderEventListenerObject, "listenerFunction");
        },

        listenBuilderReady : function()
        {
            setTimeout(function() {
                $cache.globalPromoBannerSpinner.fadeOut(1000);
            }, 2000);
        },

        listenLocation : function(loc)
        {
            if( loc === "gotoGiftCard")
            {
                app.flashbuilder.listenFlashGoToGiftCard();
            }
            else if( loc === "gotoHome")
            {
                app.flashbuilder.listenFlashGoToHome();
            }
            else if( loc === "gotoLocker")
            {
                app.flashbuilder.listenFlashGoToLocker();
            }
            else
            {
                app.flashbuilder.listenFlashGoToLocation(loc);
            }
        },
        
        listenFlashLoginRequired : function()
        {
            app.login.togglePanel();
        },
        
        listenFlashGoToGiftCard : function()
        {
            location.href = app.urls.addGiftCert;
        },
        
        listenFlashGoToHome : function()
        {
            location.href = app.urls.home;
        },
        
        listenFlashGoToLocker : function()
        {
            location.href = app.urls.myDesigns;
        },
        
        listenFlashGoToLocation : function(newLocation)
        {
            location.href = newLocation;
        },

        listenTrackingData : function(tracking_data)
        {
            var trackingData = tracking_data || {};

            if (trackingData.type === "add_to_cart" )
            {
                app.flashbuilder.listenFlashAddedToCart();
            }
            else if (trackingData.type === "product_unavailable")
            {
                app.flashbuilder.listenFlashGoToLandingCreate();
            }
        },

        listenFlashGoToLandingCreate : function()
        {
            location.href = app.urls.landingCreate;
        },
        
        listenFlashAddedToCart : function()
        {
            app.product.addDYOProductAndUpdateMiniCart();
        }
    };
    
}(window.app = window.app || {}, jQuery ));
