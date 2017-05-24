require 'test_helper'

class OmsControllerTest < ActionController::TestCase
  
  test "should route API properly" do
      assert_routing( { :path => '/oms', :method => :post}, {:controller => "oms", :action => "new_report", :format => "xml" } )
  end
  
  
  test "should obtain the request from the request param" do
      xmlRequest = "<request segment=\"US\"></request>"
      
      def @controller.parse_request requestStr
      end
      
      def @controller.persist_model model
      end
      
      post "new_report", :request => xmlRequest, :format => 'xml'
      
      actual_request_string = @controller.obtain_request_string
      
      assert_template "oms/new_report"
      assert_equal( xmlRequest, actual_request_string, "request string is not expected" )
  end
 
  test "should obtain the request from the request body" do
      xmlRequest = "<request segment=\"US\"></request>"
      
      @request.env['RAW_POST_DATA'] = xmlRequest
      
      def @controller.parse_request requestStr
      end
      
      def @controller.persist_model model
      end
      
      post "new_report", :request => xmlRequest, :format => 'xml'
      
      actual_request_string = @controller.obtain_request_string
      
      assert_template "oms/new_report"
      assert_equal( xmlRequest, actual_request_string, "request string is not expected" )
  end
  
  test "should throw exceptions if request is incomplete" do
      requestModel = Request.new
      
      assert_raises(StandardError){
          @controller.persist_model requestModel
      }
      
  end
  
   test "should throw exceptions if problems persisting model" do
      requestModel = Request.new
      def requestModel.valid?
          return true
      end
      
      def requestModel.save
          raise StandardError.new("intentional error")
      end
      
      assert_raises(StandardError){
          @controller.persist_model requestModel
      }
  end
  
  test "should render errors template with status of 500 if any exception" do
      post "new_report", :format => 'xml'
      
      assert_template "oms/new_report_error"
      assert_response 500
  end
end
