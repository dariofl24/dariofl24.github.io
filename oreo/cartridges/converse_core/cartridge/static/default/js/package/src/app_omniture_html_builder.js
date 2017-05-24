/*global nike,s, utag */
// app.omniturehtmlbuilder
(function(app, $) {
    var clear_object = function(){
        console.debug("Not implemented!");
    };
    
    app.omniturehtmlbuilder = { 
        DYO_Start: function(data) 
        {
            s.linkTrackVars='eVar73,eVar6,events,products';
            s.linkTrackEvents='event9';
            s.events = 'event9';
            s.products = utag.data["product_category"] + ';' + utag.data["product_sku"] + ';' + utag.data["product_unit_price"];
            s.eVar6 = 'DYO_HTML';
            //s.eVar73 = s.getTimeToComplete('start','test',0);
            s.tl(this,'o','DYO_HTML_Start');
            clear_object();
        },

        DYO_End: function(data) 
        {
            s.linkTrackVars='eVar73,eVar6,events,products';
            s.linkTrackEvents='event10';
            s.events = 'event10';
            s.products = utag.data["product_category"] + ';' + utag.data["product_sku"] + ';' + utag.data["product_unit_price"];
            s.eVar6 = 'DYO_HTML';
            //s.eVar73 = s.getTimeToComplete('stop','test',0);
            s.tl(this,'o','DYO_HTML_End');
            clear_object();
        },
        
         cartTrack: function(data) 
        {
            s.linkTrackVars='eVar6,eVar61,eVar62,events,products';
            s.linkTrackEvents='event11,scOpen,scAdd';
            s.events = 'event11,scOpen,scAdd';
            s.products = utag.data["product_category"] + ';' + utag.data["product_sku"] + ';' + utag.data["product_unit_price"];
            s.eVar6 = "DYO_HTML";
            s.eVar61 = 'right_column';
            s.eVar62 = utag.data["product_sku"];
            s.tl(this,'o','DYO_HTML_Add_To_Cart');
            clear_object();
        },

        bindEvents : function() 
        {
            nike.id.frame.PageMessageUtil.listen(nike.id.Event.postMessage.CONFIG_RESPONSE, app.omniturehtmlbuilder.DYO_Start);
            nike.id.frame.PageMessageUtil.listen(nike.id.Event.postMessage.ALL_COMPONENTS_COMPLETE, app.omniturehtmlbuilder.DYO_End);
            nike.id.frame.PageMessageUtil.listen(nike.id.Event.postMessage.ADD_TO_CART_SUCCESS, app.omniturehtmlbuilder.cartTrack);
        },
        
        init : function() 
        {
            nike.id.frame.ClassUtil.addCallback(app.omniturehtmlbuilder, app.omniturehtmlbuilder.bindEvents );
        }
    };
}(window.app = window.app || {}, jQuery ));
