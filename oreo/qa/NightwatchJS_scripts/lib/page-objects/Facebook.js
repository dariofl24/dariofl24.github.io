/**
 * Created by vesteban on 6/15/15.
 */

module.exports = function(browser) {
    var timeout = browser.globals.elements_timeout;

    var css = {};''

    css.email = '#email';
    css.password = '#pass';
    css.loginButton = '#u_0_2';

    css.postToFbButton = '#u_0_k';

    return {
        login : function() {
            var email = browser.globals.facebook.email;
            var password = browser.globals.facebook.password;

            return browser
                .infoLog('[Facebook] - Login')
                .windowHandles(function (windowHandles) {
                    // Assuming that the handles are in the same order as the windows were open
                    browser.switchWindow(windowHandles.value[1], function() {
                        browser
                            .useCss()
                            .waitForElementVisible(css.email, timeout)
                            .setValue(css.email, email)
                            .setValue(css.password, password)
                            .click(css.loginButton);
                    });
                });
        },
        post : function() {
            return browser
                .infoLog('[Facebook] - Post to Facebook')
                .useCss()
                .waitForElementVisible(css.postToFbButton, timeout)
                .click(css.postToFbButton);
        }
    };
};