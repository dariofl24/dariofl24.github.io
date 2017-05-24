/*global _,nikeIdTouchFlatInit*/

// app.idReactBuilder
(function(app, $) {

    var $cache = {};
    
    var $builderApi = {};
    
    // function onError(event) {}

    var idReactBuilder = {
        
        containerId: "id-react-builder",
        customizeCTAClass: "customize-b16",
        addToCartCTAId: "add-to-cart-b16",
        imageViewsContainerClass: "product-image-container",
        quantityId: "quantity",
        siteId: 12,
        
        initCache: function() {
            $cache = {
                container: $("#" + app.idReactBuilder.containerId ),
                customizeCTA: $("." + app.idReactBuilder.customizeCTAClass ),
                addToCartCTA: $("#" + app.idReactBuilder.addToCartCTAId ),
                imageViewsContainer: $("." + app.idReactBuilder.imageViewsContainerClass ),
                quantityElement: $("#" + app.idReactBuilder.quantityId )
            };
        },
        
        initPopup: function() {
            
            $cache.customizeCTA.magnificPopup({
               items: {
                   type: 'inline',
                   src: '#' + app.idReactBuilder.containerId,
                   tClose: 'x',
                   midClick: true,
                   mainClass: 'pdp-popup b16-dyo-popup',
                   closeOnContentClick: false
               },
               callbacks: {
                   open: function() {
                       console.log("idReactBuilder.customizeCTA.magnificPopup.open executed");
                       $.publish(app.constant.PUBSUB.ID_REACT_BUILDER.OPENED);
                   },
                   close: function() {
                       console.log("idReactBuilder.customizeCTA.magnificPopup.close executed");
                       $.publish(app.constant.PUBSUB.ID_REACT_BUILDER.CLOSED);
                   }
               }
               
             });
        },
        
        getBuilderConfig: function() {
            var builderConfig = {
                apiType: $cache.container.data("apitype") || "touch",
                builderMode: $cache.container.data("buildermode") || "default",
                client: $cache.container.data("client") || "touch-flat",
                locale: $cache.container.data("locale") || "en_US",
                country: $cache.container.data("country") || "US",
                pathName: $cache.container.data("pathname") || "chuTayOxCan1510_US",
                prebuildId: $cache.container.data("prebuildid") || "335616250",
                metricId: $cache.container.data("metricid") || "",
                bridge: {
                    onProductLoad: function(buildData) {
                        console.log("idReactBuilder.builderConfig.bridge.onProductLoad executed");
                        $.publish(app.constant.PUBSUB.ID_REACT_BUILDER.PRODUCT_LOADED, buildData );
                    },
                    onDone: function(buildData) {
                        console.log("idReactBuilder.builderConfig.bridge.onDone executed");
                        $.publish(app.constant.PUBSUB.ID_REACT_BUILDER.DONE, buildData );
                        
                    },
                    onPriceUpdate: function(priceData) {
                        console.log("idReactBuilder.builderConfig.bridge.onPriceUpdate executed");
                        $.publish(app.constant.PUBSUB.ID_REACT_BUILDER.PRICE_UPDATED, priceData );
                    },
                    onError: function(error){
                        console.log("idReactBuilder.builderConfig.bridge.onError executed");
                        $.publish(app.constant.PUBSUB.ID_REACT_BUILDER.ERROR, error );
                    }
                  }
              };
            
            console.log("idReactBuilder.getBuilderConfig");
            console.log(builderConfig);
            
            return builderConfig;
            
        },
        
        launchIdReactBuilder: function() {
            var newBuilderConfig = app.idReactBuilder.getBuilderConfig();
            var rootElement = document.getElementById( app.idReactBuilder.containerId );
            console.log("idReactBuilder.launchIdReactBuilder");
            console.log($builderApi);
            if( _.isEmpty( $builderApi )  )
            {
                console.log("idReactBuilder. setting builderAPI");
                $builderApi = nikeIdTouchFlatInit(rootElement, newBuilderConfig);
            } else {
                console.log("idReactBuilder. reconfiguring builderAPI");
                $builderApi.setConfig( newBuilderConfig );
            }
            
            
        },
        
        openIdReactBuilder: function() {
            console.log("idReactBuilder.openIdReactBuilder");
            $cache.container.show();
            app.idReactBuilder.launchIdReactBuilder();
        },
        
        startIdReactBuilderInitialization: function() {
            console.log("idReactBuilder.startIdReactBuilderInitialization");
            $cache.container.hide();
            app.idReactBuilder.launchIdReactBuilder();
        },
        
        finishIdReactBuilderInitialization: function(topic) {
            console.log("idReactBuilder.finishIdReactBuilderInitialization");
            if( !$cache.container.is(":visible") ) {
                $('button[data-automation="done-button"]').click();
               console.log("idReactBuilder. clicking done-button");
            }
        },
        
        close: function() {
            $.magnificPopup.close();
        },
        
        persist: function( topic, dataToPersist ) {
            console.log("idReactBuilder.persist");
            console.log(topic);
            console.log(dataToPersist);
            
            var dataToPersist4POST = JSON.stringify( dataToPersist );
            
            if( topic === app.constant.PUBSUB.ID_REACT_BUILDER.DONE ) {
                $.ajax({
                      type: "POST",
                      url: app.urls.v4PersistBuild,
                      data: dataToPersist4POST,
                      crossDomain: false,
                      dataType: "json",
                      contentType:"application/json",
                      success: function(data, textStatus, jqXHR) {
                          console.log("idReactBuilder.persist.success");
                          console.log(data);
                          if( data.result && data.result.metricId ) {
                              $.publish(app.constant.PUBSUB.ID_REACT_BUILDER.PERSISTED, data.result.metricId );
                          } else {
                              $.publish(app.constant.PUBSUB.ID_REACT_BUILDER.ERROR, "No metricId in response." );
                          }
                          
                      },
                      error: function(jqXHR, textStatus, errorThrown) {
                          console.log("idReactBuilder.persist.error");
                          $.publish(app.constant.PUBSUB.ID_REACT_BUILDER.ERROR, errorThrown );
                      }
                    });
            } 
        },
        
        updateMetricId: function( topic, metricId ) {
            console.log("idReactBuilder.updateMetricId");
            console.log( metricId );
            $cache.container.data("metricid", metricId );
        },
        
        getMetricId: function() {
            return $cache.container.data("metricid");
        },
        
        getQuantity: function() {
            return $cache.quantityElement.val();
        },
        
        getSiteId: function() {
            return app.idReactBuilder.siteId;  
        },
        
        getSiteReturnUrl: function() {
            return window.location.href;
        },
        
        getItemReturnUrl: function( metricId ) {
            return window.location.href + "&metricId=" + metricId;  
        },
        
        generateAddToCartRequestBody: function() {
            var buildData = $builderApi.getBuild();
            console.log(buildData);
            
            var template = [
            '<?xml version="1.0" encoding="UTF-8"?>',
            '<root>',
            '<configuration>',
            '<metricId>{metricId}</metricId>',
            '<quantity>{quantity}</quantity>',
            '<siteId>{siteId}</siteId>',
            '<itemReturnUrl><![CDATA[{itemReturnUrl}]]></itemReturnUrl>',
            '<siteReturnUrl><![CDATA[{siteReturnUrl}]]></siteReturnUrl>',
            '</configuration>',
            '</root>'
            ].join("\n");
            
            var metricId = app.idReactBuilder.getMetricId();
            var quantity = app.idReactBuilder.getQuantity();
            var siteId = app.idReactBuilder.getSiteId();
            var siteReturnUrl = app.idReactBuilder.getSiteReturnUrl();
            var itemReturnUrl = app.idReactBuilder.getItemReturnUrl( metricId );
            
            var xmlRequestBody = template;
            xmlRequestBody = xmlRequestBody
                .replace("{metricId}", metricId )
                .replace("{quantity}", quantity )
                .replace("{siteId}", siteId )
                .replace("{siteReturnUrl}", siteReturnUrl )
                .replace("{itemReturnUrl}", itemReturnUrl )
            ;
            
            return xmlRequestBody;
        },
        
        addToCart: function( ) {
            console.log("idReactBuilder.addToCart started");
            var cartUrl = app.urls.addDYOProduct;
            var requestBody = app.idReactBuilder.generateAddToCartRequestBody();

            $.ajax({
                type: "POST",
                dataType: "text",
                url: cartUrl,
                data: requestBody,
                success: function(data, textStatus, jqXHR) {
                    console.log("idReactBuilder.addToCart.success");
                    console.log(data);
                    $.publish(app.constant.PUBSUB.ID_REACT_BUILDER.ADDED_TO_CART, data );
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    console.log("idReactBuilder.addToCart.error");
                    $.publish(app.constant.PUBSUB.ID_REACT_BUILDER.NOT_ADDED_TO_CART, errorThrown );
                }
            });
            
        },
        
        addToCartSuccessCallback: function(data) {
            var isSuccessResponse = data.indexOf('status="success"') > -1;

            if (isSuccessResponse) {
                app.product.addDYOProductAndUpdateMiniCart();
                return;
            }

            var isDuplicateResponse = data.indexOf('status="duplicate"') > -1;

            if (isDuplicateResponse) {
                // fail silently
                return;
            }

            $.publish(app.constant.PUBSUB.ID_REACT_BUILDER.ERROR, null );
        },
        
        getBuilderApi: function() {
            return $builderApi;  
        },
        
        renderImageViews: function() {
          console.log("idReactBuilder.renderImageViews");
          var buildData = $builderApi.getBuild();
          var viewUrlTemplate = buildData.viewService + buildData.viewUrlTemplate;
          var viewNumbersArray = buildData.viewNumbers.split(",");
          
          for( var viewIndex=1; viewIndex <= 6; viewIndex++ )
          {
              $cache.imageViewsContainer.find("#image-view-" + viewIndex).empty();
          }
          
          viewNumbersArray.forEach( function(viewNumber) {
              var imageUrl = viewUrlTemplate.replace("{VIEW_NUMBER}", viewNumber);
              $cache.imageViewsContainer.find("#image-view-" + viewNumber).prepend('<img src="' + imageUrl + '" />');
          });
          
        },
        
        error: function(topic, errorObj) {
            console.log("idReactBuilder.error");
            console.log( errorObj );
        },
        
        subscribeToEvents: function()
        {
            $cache.addToCartCTA.on('click', app.idReactBuilder.addToCart );
            
            $.subscribe(app.constant.PUBSUB.ID_REACT_BUILDER.OPENED, app.idReactBuilder.openIdReactBuilder );
            $.subscribe(app.constant.PUBSUB.ID_REACT_BUILDER.PRODUCT_LOADED, app.idReactBuilder.finishIdReactBuilderInitialization );
            $.subscribe(app.constant.PUBSUB.ID_REACT_BUILDER.DONE, app.idReactBuilder.persist );
            $.subscribe(app.constant.PUBSUB.ID_REACT_BUILDER.DONE, app.idReactBuilder.close );
            $.subscribe(app.constant.PUBSUB.ID_REACT_BUILDER.DONE, app.idReactBuilder.renderImageViews );
            $.subscribe(app.constant.PUBSUB.ID_REACT_BUILDER.PRICE_UPDATED, app.idReactBuilder.renderImageViews );
            $.subscribe(app.constant.PUBSUB.ID_REACT_BUILDER.ERROR, app.idReactBuilder.error );
            $.subscribe(app.constant.PUBSUB.ID_REACT_BUILDER.PERSISTED, app.idReactBuilder.updateMetricId );
            $.subscribe(app.constant.PUBSUB.ID_REACT_BUILDER.ADDED_TO_CART, app.idReactBuilder.addToCartSuccessCallback );
            $.subscribe(app.constant.PUBSUB.ID_REACT_BUILDER.NOT_ADDED_TO_CART, app.idReactBuilder.error );
        },
        
        init: function() {
            app.idReactBuilder.initCache();
            app.idReactBuilder.subscribeToEvents();
            app.idReactBuilder.initPopup();
            app.idReactBuilder.startIdReactBuilderInitialization();
        }
    };

    app.idReactBuilder = app.idReactBuilder || {};
    $.extend(app.idReactBuilder, idReactBuilder);

}(window.app = window.app || {}, jQuery ));