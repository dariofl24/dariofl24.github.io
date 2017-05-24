/*global window, ATGSvcs*/

// app.livechat
(function(app, $) {
    var ATG_SERVICE_JS_URL = '//static.atgsvcs.com/js/atgsvcs.js';

    function loadLiveChat() {
        $.getScript(ATG_SERVICE_JS_URL, function() {
            ATGSvcs.setEEID("200106296993");
            (function() {
                var l = 'converse.custhelp.com',d=document,ss='script',s=d.getElementsByTagName(ss)[0];

                function r(u){ 
                    var rn=d.createElement(ss); 
                    rn.type='text/javascript'; 
                    rn.defer=rn.async=!0; 
                    rn.src = "//" + l + u; s.parentNode.insertBefore(rn,s); 
                }
                
                r('/rnt/rnw/javascript/vs/1/vsapi.js');
                r('/vs/1/vsopts.js');
            })();
        });
    }

    function init() {
        var enabled = app.featuretoggle.isFeatureEnabled('live-chat');
        var isCustomerService = app.page.contentFolderId === app.constant.CONTENTFOLDERID.CUSTOMER_SERVICE;

        if (enabled) {
            if (!isCustomerService) {
                loadLiveChat();
            } else {
                $( "#livechat" ).addClass('rn_ChatAvailable');
                $( "#livechat" ).on("click", function() {
                    window.open(app.urls.liveChat, 'newwindow','width=550, height=500');
                });
            }
        }
    }
    
    app.livechat = {
        init: init
    };

}(window.app = window.app || {}, jQuery));
