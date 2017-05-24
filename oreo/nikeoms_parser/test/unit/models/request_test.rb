require 'test_helper'

class RequestTest < ActiveSupport::TestCase 

  test "package id and carrier id are optional" do
    requestModel = Request.new

    assert( requestModel.invalid?, "request should be invalid" )
    refute( requestModel.errors.include?(:package_id), "package id should not be required" )
    refute( requestModel.errors.include?(:carrier_id), "carrier id should not be required" )
    refute( requestModel.errors.include?(:item_ets_date), "item ets date should not be required" )
  end

  test "request_segment ship_group_id order_id item_old_state item_new_state and item_timestamp are required" do
    requestModel = Request.new

    assert( requestModel.invalid?, "request should be invalid" )
    assert( requestModel.errors.include?(:request_segment), "request segment is required" )
    assert( requestModel.errors.include?(:ship_group_id), "ship_group_id is required" )
    assert( requestModel.errors.include?(:order_id), "order_id is required" )
    assert( requestModel.errors.include?(:item_old_state), "item_old_state is required" )
    assert( requestModel.errors.include?(:item_new_state), "item_new_state is required" )
    assert( requestModel.errors.include?(:item_timestamp), "item_timestamp is required" )
  end


  test "a valid request" do
    requestModel = Request.new

    requestModel.request_segment = "US"
    requestModel.package_id = "1Z678RY06703005794"
    requestModel.carrier_id = "UPS"
    requestModel.ship_group_id = "521956274_00"
    requestModel.order_id = "1910255"
    requestModel.item_old_state ="FIRST_DELIVERY"
    requestModel.item_new_state = "DELIVERED"
    requestModel.item_ets_date = Date.strptime("03/11/2013", "%m/%d/%Y")
    requestModel.item_timestamp = DateTime.strptime("03/19/2013 13:41 UTC","%m/%d/%Y %H:%M %Z")

    assert( requestModel.valid?, "request should be valid" )
  end

end
