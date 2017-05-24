require 'test_helper'

class ApplicationHelperTest < ActionView::TestCase

  test "parse_request should return a requestModel populated with ALL the values from a well-formed XML request" do
    xmlOrderString = <<EOF
      <request segment="US">
          <package id="1Z678RY06703005794" carrier_id="UPS">
              <ship_group_id>521956274_00</ship_group_id>
              <order_id>1910255</order_id>
              <changed_item>
                  <commerce_item_id />
                  <old_state>FIRST_DELIVERY</old_state>
                  <new_state>DELIVERED</new_state>
                  <ets_date>03/14/2013</ets_date>
                  <timestamp>03/19/2013 13:41 GMT</timestamp>
              </changed_item>
          </package>
      </request>
EOF

    requestModel = parse_request  xmlOrderString

    refute_nil( requestModel, "a model with the XML content should be generated")
    assert(requestModel.valid?, "request should be valid")
    assert_equal("US", requestModel.request_segment, "request segment was not properly found" )
    assert_equal("1Z678RY06703005794", requestModel.package_id, "package id was not properly found" )
    assert_equal("UPS", requestModel.carrier_id, "carrier_id was not properly found" )
    assert_equal("521956274_00", requestModel.ship_group_id, "ship_group_id was not properly found" )
    assert_equal("1910255", requestModel.order_id, "order_id was not properly found" )
    assert_equal("FIRST_DELIVERY", requestModel.item_old_state, "item/old_state was not properly found" )
    assert_equal("DELIVERED", requestModel.item_new_state, "item/new state was not properly found" )
    assert_equal("03/14/2013", requestModel.item_ets_date.strftime("%m/%d/%Y"), "item/ets date was not properly found" )
    assert_equal("03/19/2013 13:41 UTC", requestModel.item_timestamp.strftime("%m/%d/%Y %H:%M %Z"), "item/timestamp was not properly found" )
  end

  test "parse_request should return a requestModel populated only with REQUIRED values from a well-formed XML request" do
    xmlOrderString = <<EOF
      <request segment="US">
          <package>
              <ship_group_id>521956274_00</ship_group_id>
              <order_id>1910255</order_id>
              <changed_item>
                  <commerce_item_id />
                  <old_state>FIRST_DELIVERY</old_state>
                  <new_state>DELIVERED</new_state>
                  <timestamp>03/19/2013 13:41 GMT</timestamp>
              </changed_item>
          </package>
      </request>
EOF

    requestModel = parse_request  xmlOrderString

    refute_nil( requestModel, "a model with the XML content should be generated")
    assert(requestModel.valid?, "request should be valid")
    assert_equal("US", requestModel.request_segment, "request segment was not properly found" )
    assert_nil(requestModel.package_id, "package id should be missing" )
    assert_nil(requestModel.carrier_id, "carrier id should be missing" )
    assert_equal("521956274_00", requestModel.ship_group_id, "ship_group_id was not properly found" )
    assert_equal("1910255", requestModel.order_id, "order_id was not properly found" )
    assert_equal("FIRST_DELIVERY", requestModel.item_old_state, "item/old_state was not properly found" )
    assert_equal("DELIVERED", requestModel.item_new_state, "item/new state was not properly found" )
    assert_nil(requestModel.item_ets_date, "item ets date should be missing" )
    assert_equal("03/19/2013 13:41 UTC", requestModel.item_timestamp.strftime("%m/%d/%Y %H:%M %Z"), "item/timestamp was not properly found" )
  end

  test "parse_request should return a requestModel populated only with REQUIRED values from a well-formed XML request, when ets_date is empty" do
    xmlOrderString = <<EOF
      <request segment="US">
          <package>
              <ship_group_id>521956274_00</ship_group_id>
              <order_id>1910255</order_id>
              <changed_item>
                  <commerce_item_id />
                  <old_state>FIRST_DELIVERY</old_state>
                  <new_state>DELIVERED</new_state>
                  <ets_date/>
                  <timestamp>03/19/2013 13:41 GMT</timestamp>
              </changed_item>
          </package>
      </request>
EOF

    requestModel = parse_request  xmlOrderString

    refute_nil( requestModel, "a model with the XML content should be generated")
    assert(requestModel.valid?, "request should be valid")
    assert_equal("US", requestModel.request_segment, "request segment was not properly found" )
    assert_nil(requestModel.package_id, "package id should be missing" )
    assert_nil(requestModel.carrier_id, "carrier id should be missing" )
    assert_equal("521956274_00", requestModel.ship_group_id, "ship_group_id was not properly found" )
    assert_equal("1910255", requestModel.order_id, "order_id was not properly found" )
    assert_equal("FIRST_DELIVERY", requestModel.item_old_state, "item/old_state was not properly found" )
    assert_equal("DELIVERED", requestModel.item_new_state, "item/new state was not properly found" )
    assert_nil(requestModel.item_ets_date, "item ets date should be missing" )
    assert_equal("03/19/2013 13:41 UTC", requestModel.item_timestamp.strftime("%m/%d/%Y %H:%M %Z"), "item/timestamp was not properly found" )
  end

  test "parse_request should return an empty requestModel when a malformed XML request" do
    xmlOrderString = <<EOF
      <request segment="US">
          <package id="1Z678RY06703005794" carrier_id="UPS"
EOF

    requestModel = parse_request xmlOrderString

    refute_nil( requestModel, "a model should be generated")
    assert(requestModel.invalid?, "request should be invalid")
  end

#  test "parse_request should return an empty requestModel when empty XML request" do
#    xmlOrderString = ""
#    requestModel = parse_request xmlOrderString
#
#    refute_nil( requestModel, "a model should be generated")
#    assert(requestModel.invalid?, "request should be invalid")
#  end

end
