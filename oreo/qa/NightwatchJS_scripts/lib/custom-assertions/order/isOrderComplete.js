/**
 * Created by vesteban on 5/6/15.
 */

exports.assertion = function(lang, msg) {
    var timeout = this.api.globals.elements_timeout;
    var DEFAULT_MSG = "Validating if order is complete";

    var css = {};
    css.orderConfirmationMessage = '.checkout-confirmation-header>h1';

    this.message = msg || DEFAULT_MSG;

    if (lang == 'de_DE'){
        this.expected = "Deine Bestellung ist abgeschlossen.";
    } else if (lang == 'fr_FR' || lang == 'fr_BE'){
        this.expected = "Votre commande est terminée.";
    } else if (lang == 'es_ES'){
        this.expected = "Tu pedido se ha completado.";
    } else if (lang == 'nl_NL') {
        this.expected = "Je bestelling is voltooid!";
    } else if (lang == 'it_IT') {
        this.expected = "L'ordine è stato completato.";
    } else {
        this.expected = 'Your Order is Complete';
    }

    this.pass = function(value) {
        return expected.equals(value);
    };

    this.value = function(result) {
        return result.value;
    };

    this.command = function(callback) {
        return this.api
            .useCss()
            .waitForElementVisible(css.orderConfirmationMessage, timeout)
            .assert.containsText(css.orderConfirmationMessage, this.expected);
    };
};