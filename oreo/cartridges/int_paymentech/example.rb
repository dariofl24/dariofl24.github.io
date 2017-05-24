require 'activemerchant'

options = {
	:merchant_id => '007964',
	:login => 'T6904CONVERS',
	:password => '72Y6SBP499WR',
	:test => true
}

order_id = '86a67330-71d4-11e2-8afa-0800276d4286'
currency = 'USD'
credit_card = ActiveMerchant::Billing::CreditCard.new(
  	:number     => '4112344112344113',
  	:month      => '12',
  	:year       => '2015',
  	:first_name => 'Luke',
  	:last_name  => 'Skywalker',
  	:verification_value  => '111',
	:brand => 'visa'
)

billing_address = {
	:zip => "12345",
	:address1 => "123 Happy Place",
	:address2 => "Apt 1",
  	:city => "SuperVille",
  	:state => "NY",
  	:name => "Joe Smith",
  	:country => "US"
}

gateway = ActiveMerchant::Billing::OrbitalGateway.new options
response = gateway.authorize(000, credit_card, {
	:billing_address => billing_address,
	:order_id => order_id,
	:currency => currency
});

puts response.message
puts response.avs_result
puts response.cvv_result
