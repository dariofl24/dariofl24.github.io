/**
 * Created by esanchez on 09/03/15.
 */

module.exports = function(browser) {
    var timeout = browser.globals.elements_timeout;

    var languageSelectorUrl = browser.globals.dw.protocol + browser.globals.dw.hostname + browser.globals.dw.storefront_path + browser.globals.dw.language_selector_path;

    var xpath = {};
    xpath.selectLanguageHeader = "//h2";
    xpath.countryAndLanguageLink = "//li[@class='language-row']/a[contains(@onclick, '%s')]";
    xpath.countrySelectorLink = "//div[@class='header-country-selector']//a[@class='country-selector-popup']"

    return {
        selectCountryLanguage : function (countryLanguage){
            return browser
                .infoLog('[Language Selector] - Select ' + countryLanguage + ' language, if required')
                .useXpath()
                .url(function (result){
                    //browser.infoLog(result.value);
                    //browser.infoLog(languageSelectorUrl);
                    if (result.value == languageSelectorUrl){
                        browser
                            .waitForElementVisible(xpath.selectLanguageHeader, timeout)
                            .click(xpath.countryAndLanguageLink.replace('%s', countryLanguage))
                            //.pause(5000);
                    }
                });
        },
        switchCountryLanguage : function (countryLanguage){
            localeXpath = xpath.countryAndLanguageLink.replace('%s', countryLanguage);
            return browser
                .infoLog('[Language Selector] - Switch to ' + countryLanguage + ' language')
                .useXpath()
                .click(xpath.countrySelectorLink)
                .waitForElementVisible(localeXpath, timeout)
                .click(localeXpath)
                .pause(5000);
        }
    }
};