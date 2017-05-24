/*global gigya */

(function(app, $) {
    function onError(event) {
    }

    function sendDYOEmail(data) {
        return function() {
            return $.ajax({
                url: app.urls.sharedyohtml,
                type: 'POST',
                data: data
            });
        };
    }

    function onSendInlineHandler(event, productId) {
        if (event.providers === 'email') {
            var emails = [];

            for (var index = 0; index < event.recipients.length; index++) {
                var recipient = event.recipients[index];
                emails.push(recipient.email);
            }

            var request = {
                url: app.urls.shareinlineproduct,
                data: {
                   sender: event.sender,
                   userMessage: event.userMessage,
                   recipients: emails,
                   productId: productId
                }
            };

            app.ajax.post(request);
        }
    }

    app.product.share = {
        init: function(context) {
        
            if (typeof gigya === 'undefined') {
                 return;
            }
            
            var action = new gigya.socialize.UserAction();
            action.setLinkBack(context.productUrl);
            action.setTitle(context.productName);
            action.addMediaItem({
                type: 'image',
                src: context.productImageUrl,
                href: context.productUrl
            });

            var params = {
                userAction: action,
                shareButtons: 'facebook,twitter,pinterest,googleplus,email',
                containerID: context.containerID,
                layout: context.layout,
                showCounts: 'none',
                dontSendEmail: true,
                iconsOnly: true,
                onError: onError,
                onSendDone: function(event) { 
                    onSendInlineHandler(event, context.productId);
                }
            };
            
            gigya.socialize.showShareBarUI(params);
        },

        sendDYOEmail: sendDYOEmail
    };

}(window.app = window.app || {}, jQuery));
