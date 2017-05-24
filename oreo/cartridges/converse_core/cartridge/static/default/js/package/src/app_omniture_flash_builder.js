/*global s, utag */
// app.omnitureflashbuilder
(function(app, $) {
    var clear_object = function(){
        console.debug("Not implemented!");
    };
    
    app.omnitureflashbuilder = {

        trackingforFlashEvents : function(event) {
                //console.debug("shellEventType:listenerFunction called by Flash");
                //console.debug(event);
                var eventObj = event;
                //console.debug(utag.data["product_sku"]);
                
                var trackingData = eventObj.data.tracking_data || { type: undefined };
                
                if(eventObj.data.id === "builderStarted")
                {
                    s.linkTrackVars='eVar73,eVar6,events,products';
                    s.linkTrackEvents='event9';
                    s.events = 'event9';
                    s.products = utag.data["product_category"] + ';' + utag.data["product_sku"] + ';' + utag.data["product_unit_price"];
                    s.eVar6 = "DYO_Flash";
                    //s.eVar73 = s.getTimeToComplete('start','test',0);
                    s.tl(this,'o','DYO_Flash_Start');
                    clear_object();
                }//start
                else if(trackingData.type === "100_pct_complete")
                {
                    s.linkTrackVars='eVar73,eVar6,events,products';
                    s.linkTrackEvents='event10';
                    s.events = 'event10';
                    s.products = utag.data["product_category"] + ';' + utag.data["product_sku"] + ';' + utag.data["product_unit_price"];
                    s.eVar6 = "DYO_Flash";
                    //s.eVar73 = s.getTimeToComplete('stop','test',0);
                    s.tl(this,'o','DYO_Flash_End');
                    clear_object();
                }//end
                else if(trackingData.type === "add_to_cart")
                {
                    s.linkTrackVars='eVar6,eVar61,eVar62,events,products';
                    s.linkTrackEvents='event11,scOpen,scAdd';
                    s.events = 'event11,scOpen,scAdd';
                    s.products = utag.data["product_category"] + ';' + utag.data["product_sku"] + ';' + utag.data["product_unit_price"];
                    s.eVar6 = "DYO_Flash";
                    s.eVar61 = 'right_column';
                    s.eVar62 = utag.data["product_sku"];
                    s.tl(this,'o','DYO_Flash_Add_To_Cart');
                    clear_object();
                }//add to cart
                
                return true;
            
        }
    };

}(window.app = window.app || {}, jQuery ));
