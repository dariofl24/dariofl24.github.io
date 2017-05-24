
(function(app, $){
	// application constants
	var constants = {	
		AVAIL_STATUS_IN_STOCK 		: 'ProductAvailabilityModel.AVAILABILITY_STATUS_IN_STOCK',
		AVAIL_STATUS_PREORDER 		: 'ProductAvailabilityModel.AVAILABILITY_STATUS_PREORDER',
		AVAIL_STATUS_BACKORDER 		: 'ProductAvailabilityModel.AVAILABILITY_STATUS_BACKORDER',
		AVAIL_STATUS_NOT_AVAILABLE 	: 'ProductAvailabilityModel.AVAILABILITY_STATUS_NOT_AVAILABLE',
		PI_METHOD_GIFT_CERTIFICATE	: 'dw.order.PaymentInstrument.METHOD_GIFT_CERTIFICATE'
	};
	
	// application resources
	var resources =  {
			
		SHIP_QualifiesFor 				: 'shipment.qualifiesfor',		
		CC_LOAD_ERROR 					: 'billing.creditcardloaderror',				
	
		// Registry resources
		REG_ADDR_ERROR 					: 'global.couldntloadaddress',
		
		// bonus products messages
		BONUS_PRODUCT 					: 'product.bonusproduct',
		BONUS_PRODUCTS 					: 'product.bonusproducts',
		SELECT_BONUS_PRODUCTS 			: 'product.selectbonusproducts',
		SELECT_BONUS_PRODUCT 			: 'product.selectbonusproduct',
		BONUS_PRODUCT_MAX 				: 'product.bonusproductsmax',
		SIMPLE_SEARCH 					: 'simplesearch.searchtext',
		SUBSCRIBE_EMAIL_DEFAULT			: 'forms.subscribe.email.default',
				
		CURRENCY_SYMBOL					: '$',
		MISSINGVAL						: 'global.missingval',
		SERVER_ERROR 					: 'global.servererror',
		MISSING_LIB 					: 'global.missinglib',
		BAD_RESPONSE					: 'global.badresponse',
		INVALID_PHONE					: 'global.invalidphone',
		INVALID_EMAIL					: 'profile.emailparseerror',
		REMOVE							: 'global.remove',
		QTY								: 'global.qty',
		EMPTY_IMG_ALT					: 'global.remove',
		COMPARE_BUTTON_LABEL			: 'productcomparewidget.compareitemsbutton',
		COMPARE_CONFIRMATION			: 'productcomparewidget.maxproducts',
		COMPARE_REMOVE_FAIL				: 'productcomparewidget.removefail',
		COMPARE_ADD_FAIL				: 'productcomparewidget.addfail',
		ADD_TO_CART_FAIL				: 'cart.unableToAdd',	
		REGISTRY_SEARCH_ADVANCED_CLOSE	: 'giftregistry.closeadvanced',
					
		GIFT_CERT_INVALID				: 'billing.giftcertinvalid',
		GIFT_CERT_BALANCE				: 'billing.giftcertbalance',
		GIFT_CERT_AMOUNT_INVALID		: 'giftcert.amountvalueerror',
		GIFT_CERT_MISSING				: 'billing.giftcertidmissing',
		
		COUPON_CODE_MISSING				: 'cart.COUPON_CODE_MISSING',
		
		COOKIES_DISABLED				: 'browsertoolscheck.cookies',
		BML_AGREE_TO_TERMS				: 'bml.termserror',
		CHAR_LIMIT_MSG					: 'forms.character.limit',
		CONFIRM_DELETE					: 'forms.confirm.delete',
		TITLE_GIFTREGISTRY				: 'forms.title.giftregistry',
		TITLE_ADDRESS					: 'forms.title.address',
		TITLE_CREDITCARD				: 'forms.title.creditcard',
		SERVER_CONNECTION_ERROR 		: 'global.serverconnection',
		IN_STOCK_DATE				: 'global.inStockDate'
	};
	
	// additional resources 
	resources['ProductAvailabilityModel.AVAILABILITY_STATUS_IN_STOCK'] = 'global.instock';
	resources["QTY_" + 'ProductAvailabilityModel.AVAILABILITY_STATUS_IN_STOCK'] = 'global.quantityinstock';
	resources['ProductAvailabilityModel.AVAILABILITY_STATUS_PREORDER'] = 'global.allpreorder';
	resources["QTY_" + 'ProductAvailabilityModel.AVAILABILITY_STATUS_PREORDER'] = 'global.quantitypreorder';
	resources["REMAIN_" + 'ProductAvailabilityModel.AVAILABILITY_STATUS_PREORDER'] = 'global.remainingpreorder';
	resources['ProductAvailabilityModel.AVAILABILITY_STATUS_BACKORDER'] = 'global.allbackorder';
	resources["QTY_" + 'ProductAvailabilityModel.AVAILABILITY_STATUS_BACKORDER'] = 'global.quantitybackorder';
	resources["REMAIN_" + 'ProductAvailabilityModel.AVAILABILITY_STATUS_BACKORDER'] = 'global.remainingbackorder';
	resources['ProductAvailabilityModel.AVAILABILITY_STATUS_NOT_AVAILABLE'] = 'global.allnotavailable';
	resources["REMAIN_" + 'ProductAvailabilityModel.AVAILABILITY_STATUS_NOT_AVAILABLE'] = 'global.remainingnotavailable';
			
	// application urls
	var urls =  {
		appResources				: 'Resources-Load',
		pageInclude					: 'Page-Include',
		continueUrl 				: 'url.continue',
		staticPath					: "/",
		addGiftCert					: 'GiftCert-Purchase',		
		minicartGC					: 'GiftCert-ShowMiniCart',		
		addProduct					: 'Cart-AddProduct',		
		minicart					: 'Cart-MiniAddProduct',
		cartShow 					: 'Cart-Show',
		giftRegAdd					: 'Address-GetAddressDetails',
		paymentsList				: 'PaymentInstruments-List',
		addressesList				: 'Address-List',
		wishlistAddress				: 'Wishlist-SetShippingAddress',
		deleteAddress				: 'Address-Delete',
		getProductUrl 				: 'Product-Show',
		getBonusProducts			: 'Product-GetBonusProducts',
		addBonusProduct				: 'Cart-AddBonusProduct',	
		getAvailability				: 'Product-GetAvailability',
		removeImg 					: '/images/interface/icon_remove.gif',
		searchsuggest 				: 'Search-GetSuggestions',	
		summaryRefreshURL			: 'COBilling-UpdateSummary',
		billingSelectCC				: 'COBilling-SelectCreditCard',
		updateAddressDetails		: 'COShipping-UpdateAddressDetails',
		updateAddressDetailsBilling : 'COBilling-UpdateAddressDetails',	
		shippingMethodsJSON			: 'COShipping-GetApplicableShippingMethodsJSON',
		shippingMethodsList			: 'COShipping-UpdateShippingMethodList',
		selectShippingMethodsList	: 'COShipping-SelectShippingMethod',
		resetPaymentForms 			: 'COBilling-ResetPaymentForms',
		compareShow					: 'Compare-Show',
		compareAdd					: 'Compare-AddProduct',	
		compareRemove				: 'Compare-RemoveProduct',
		compareEmptyImage			: '/images/comparewidgetempty.png',
		giftCardCheckBalance		: 'COBilling-GetGiftCertificateBalance',
		addCoupon					: 'Cart-AddCoupon',	
		powerReviewsFullJs			: '/pwr/engine/js/full.js',
		powerReviewsZip				: ''
	};
	
	var pdp = {
        shareOptionFacebookServiceTemplate: 'PDP.shareOptionFacebookServiceTemplate',
        shareOptionFacebookUrlToShareTemplate: 'PDP.shareOptionFacebookUrlToShareTemplate',
        
        shareOptionTwitterServiceTemplate: 'PDP.shareOptionTwitterServiceTemplate',
        shareOptionTwitterUrlToShareTemplate: 'PDP.shareOptionTwitterUrlToShareTemplate',
        
        shareOptionPinterestServiceTemplate: 'PDP.shareOptionPinterestServiceTemplate',
        shareOptionPinterestUrlToShareTemplate: 'PDP.shareOptionPinterestUrlToShareTemplate',

        shareOptionEmailServiceTemplate: 'PDP.shareOptionEmailServiceTemplate',
        shareOptionEmailUrlToShareTemplate: 'PDP.shareOptionEmailUrlToShareTemplate'
    };

	
	var isMobileUserAgent = true;
	app.isMobileUserAgent = true;
	app.zoomViewerEnabled = false;	
	app.constants = constants;
	app.resources = resources;	
	app.urls = urls;	
	app.pdp = pdp;
	console.log(app.resources);
}(window.app = window.app || {}));

