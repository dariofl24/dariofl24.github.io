module( "Module App Checkout", {
    setup: function() {
            app.site = {};
            app.site.id = 'US';
            
            $('#qunit-fixture').html("");
            $('*').unbind();

            // setup some fixture html
            this.htmlFixture = htmlUtil.writeAsString(function() {/*!
            <form class="checkout-billing address">
            	<div class="payment-method-options">
					<div class="form-row">
						<label for="is-CREDIT_CARD">Credit Card:</label>
						<input id="is-CREDIT_CARD" class="input-radio" type="radio" value="CREDIT_CARD" name="dwfrm_billing_paymentMethods_selectedPaymentMethodID"">
					</div>
					<div class="form-row">
						<label for="is-PAY_PAL">PayPal:</label>
						<input id="is-PAY_PAL" class="input-radio" type="radio" value="PAY_PAL" name="dwfrm_billing_paymentMethods_selectedPaymentMethodID">
					</div>
				</div>
            	<fieldset>
            		<div id="PaymentMethod_CREDIT_CARD" class="payment-method payment-method-expanded">
            			<div class="giftcard-info payment-method payment-method-expanded"/>
            		</div>
            		<div id="PaymentMethod_BML" class="payment-method"/>
            	</fieldset>
            	<div class="billingaddress-info">
            		<div class="billingaddress-wrapper"/>
            	</div>
            </form>
            */});
            $('#qunit-fixture').html(this.htmlFixture);
    },
    teardown: function() {
            // run after
            $('#qunit-fixture').html("");
            $('*').unbind();
            app.site = undefined;

    }
});

test("Initial load, CREDIT_CARD payment selected", function() {
	var $creditCardPaymentOption = $("#is-CREDIT_CARD");
	$creditCardPaymentOption.attr("checked", "checked");
	
    app.checkout.init();

    var $creditCardPayment = $("#PaymentMethod_CREDIT_CARD");
    var $bmlPayment = $("#PaymentMethod_BML");
    var $giftcardPayment = $(".giftcard-info");

    ok( $creditCardPayment.hasClass("payment-method-expanded") );
    ok( $giftcardPayment.hasClass("payment-method-expanded") );
    ok( $bmlPayment.hasClass("payment-method-expanded") === false);
});

test("Initial load, PAY_PAL payment selected", function() {
	var $payPalPaymentOption = $("#is-PAY_PAL");
	$payPalPaymentOption.attr("checked", "checked");
	
    app.checkout.init();

    var $creditCardPayment = $("#PaymentMethod_CREDIT_CARD");
    var $bmlPayment = $("#PaymentMethod_BML");
    var $giftcardPayment = $(".giftcard-info");

    ok( $creditCardPayment.hasClass("payment-method-expanded") === false );
    ok( $giftcardPayment.hasClass("payment-method-expanded") === false );
    ok( $bmlPayment.hasClass("payment-method-expanded") === false);
});

test("Test interactive payment selection hides/shows payment details correctly", function() {
	var $creditCardPaymentOption = $("#is-CREDIT_CARD");
	$creditCardPaymentOption.attr("checked", "checked");
	
	var $payPalPaymentOption = $("#is-PAY_PAL");
	
    app.checkout.init();

    var $creditCardPayment = $("#PaymentMethod_CREDIT_CARD");
    var $bmlPayment = $("#PaymentMethod_BML");
    var $giftcardPayment = $(".giftcard-info");
    
    $payPalPaymentOption.trigger("click");

    ok( $creditCardPayment.hasClass("payment-method-expanded") === false );
    ok( $giftcardPayment.hasClass("payment-method-expanded") === false );
    ok( $bmlPayment.hasClass("payment-method-expanded") === false);
    
    $creditCardPaymentOption.trigger("click");

    ok( $creditCardPayment.hasClass("payment-method-expanded") );
    ok( $giftcardPayment.hasClass("payment-method-expanded") );
    ok( $bmlPayment.hasClass("payment-method-expanded") === false);
});

test("Test billing form is hidden when PAY_PAL is choosen as payment method and restored when CREDIT_CARD is selected", function() {
	var $creditCardPaymentOption = $("#is-CREDIT_CARD");
	$creditCardPaymentOption.attr("checked", "checked");
	
	var $payPalPaymentOption = $("#is-PAY_PAL");
	
    app.checkout.init();
    $creditCardPaymentOption.trigger("click");
    
    var $billingAddressWrapper = $(".billingaddress-wrapper");

    ok( $billingAddressWrapper.is(":visible"));
    
    $payPalPaymentOption.trigger("click");
    
    ok( $billingAddressWrapper.is(":hidden"));
});

test("Test billing form stays hidden after an already selected PAY_PAL option is selected again as payment option", function() {
	
	var $payPalPaymentOption = $("#is-PAY_PAL");
	
    app.checkout.init();
    
    $payPalPaymentOption.trigger("click");
    
    var $billingAddressWrapper = $(".billingaddress-wrapper");
    
    ok( $billingAddressWrapper.is(":hidden"));
    
    $payPalPaymentOption.trigger("click");
    
    ok( $billingAddressWrapper.is(":hidden"));
});