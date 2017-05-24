/**
 * Created by vesteban on 6/16/15.
 */



module.exports = function(browser) {
    var timeout = browser.globals.elements_timeout;

    var css = {};''

    css.loginNowButton = '.emailLogin';

    css.email = 'input[name="id"]';
    css.password = 'input[name="password"]';
    css.loginButton = 'body > div > div.appContent > div.mainContainer > div > div > div > form > div.formFooter > div > button';
    css.continueButton = 'button.red';

    css.pinIt = '#u_0_1e';

    return {
        login : function() {
            var email = browser.globals.pinterest.email;
            var password = browser.globals.pinterest.password;

            return browser
                .infoLog('[Pinterest] - Login')
                .windowHandles(function (windowHandles) {
                    // Assuming that the handles are in the same order as the windows were open
                    browser.switchWindow(windowHandles.value[1], function() {
                        browser
                            .useCss()
                            //.waitForElementVisible(css.loginNowButton, timeout)
                            //.click(css.loginNowButton)
                            .waitForElementVisible(css.email, timeout)
                            .setValue(css.email, email)
                            .setValue(css.password, password)
                            .click(css.continueButton);
                    });
                });
        },
        pinIt : function() {
            return browser
                .infoLog('[Pinterest] - Pin It!')
                .useCss()
                .waitForElementVisible(css.pinIt, timeout)
                .click(css.pinIt);
        }
    };
};