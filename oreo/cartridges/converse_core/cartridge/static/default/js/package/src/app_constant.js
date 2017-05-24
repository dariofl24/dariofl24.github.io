// app.constant
//
//
(function(app, $) {

    var standardFadeDuration = 500;

    app.constant = {
        SITES: {
            US: "US",
            GB: "GB",
            DE: "DE",
            FR: "FR",
            EU: "EU"
        },

        SHIPPING_TYPE: {
            PICKUPPOINT: "pup",
            HOME: "home"
        },
        
        OBSERVERS: {
            SITE_OVERLAY_OPEN:"site-overlay-open",
            SITE_OVERLAY_CLOSE:"site-overlay-close"
        },
        
        PROFILE: {
            PROFILE_IMAGE_WIDTH: 150
        },
        
        STANDRD_FADE_DURATION: standardFadeDuration,
        MINICART_PANEL_HOLD_ON_DURATION: 6000,
        LOGIN_MENU_FORM_FADE_DURATION: standardFadeDuration,
        PDP_MAIN_IMAGE_FADE_DURATION: 400,
        OVERLAY_DELAY_DURATION: 150,
        INPUT_MESSAGING_FADEIN_DURATION: 500,
        INPUT_MESSAGING_FADEOUT_DURATION: 2000,
        NAVIGATION_SLIDE_DURATION: 700,
        HERO_HOVER_TRANSITION_DURATION: 500,
        HERO_UNHOVER_TRANSITION_DURATION: 250,
        MOBILE_NAV_UP_DOWN_DURATION: 200,
        RESPONSIVE_DEVICE_OBSERVER:"responsiveDeviceObserver",
        
        DEVICE_TYPE: {
            SMALL: "small-device-profile",
            MEDIUM: "medium-device-profile",
            LARGE: "large-device-profile"
        },

        SLIDER: {
            LOGIN_PANEL: "login-panel",
            MINICART_PANEL: "minicart-panel",
            BILLING_PAYPAL_CONTINUE_PANEL: "billing-paypal-continue-panel",
            PDP_REVIEW_AND_CONFIRM_PANEL: "pdp-review-and-confirm-panel",
            SEARCH_PANEL: "search-panel",
            SUBCATEGORY_PANEL: "subcategory-panel",
            EXPANDED: "slider_expanded",
            BEFORE_EXPANDED: "slider_before_expanded",
            COLLAPSED: "slider_collapsed",
            BEFORE_COLLAPSED: "slider_before_collapsed",
            FADE_DURATION: standardFadeDuration
        },

        CUSTOMER_SERVICE: {
            CONTENT_LOADED: "customer_service_content_loaded",
            CHECK_ORDER_STATUS: "check_order_status",
            INTERNATIONAL_DISTRIBUTORS: "international_distributors"
        },

        CONTENTFOLDERID: {
            CUSTOMER_SERVICE: "customer-service"
        },

        PUBSUB: {
            LOGIN_PANEL: {
                USER: {
                    LOGGED_IN: "loginpanel_user_loggedin",
                    REGISTERED: "loginpanel_user_registered"
                },
                TOGGLE: "loginpanel_toggle",
                LOGIN_CANCELED: "loginpanel_login_canceled"
            },
            CATALOG_NAVIGATION: {
                SHOW: "catalognavigation_show",
                HIDE: "catalognavigation_hide"
            },
            CART: {
                QTY_CHANGED: "cart_qty_changed"
            },
            TABIFY : {
                TAB_COMPLETE: "tabify_tab_complete"
            },
            SCROLL: {
                LOAD_MORE_PAGES: "ajax.load_more_pages",
                DONE_LOADING_PAGES: "ajax.done_loading_pages",
                REACHED_BOTTOM: "scroll_reached_bottom",
                ACCEPT_ACTIONS_ON_REACHED_BOTTOM: "accept_actions_on_reached_bottom",
                DO_NOT_ACCEPT_ACTIONS_ON_REACHED_BOTTOM: "do_not_accept_actions_on_reached_bottom"
            },
            PICKUP_POINT: {
                SELECTED: "pickuppoint_selected"
            },
            
            ID_REACT_BUILDER: {
                OPENED: "idreactbuilder_opened",
                CLOSED: "idreactbuilder_closed",
                PRODUCT_LOADED : "idreactbuilder_productloaded",
                DONE: "idreactbuilder_done",
                PRICE_UPDATED: "idreactbuilder_priceupdated",
                ERROR: "idreactbuilder_error",
                PERSISTED: "idreactbuilder_persisted",
                ADDED_TO_CART: "idreactbuilder_addedtocart",
                NOT_ADDED_TO_CART: "idreactbuilder_notaddedtocart"
            }
        }
    };
}(window.app = window.app || {}, jQuery));
