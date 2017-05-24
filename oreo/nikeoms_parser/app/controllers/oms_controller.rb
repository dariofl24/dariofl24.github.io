class OmsController < ActionController::Base
    rescue_from Exception, :with => :exception_handler
    
    include ApplicationHelper

    def get
    end
    
    def new_report
        xmlRequestString = obtain_request_string
        send_xml xmlRequestString

        logger.info("Processing request = " + xmlRequestString)
      
        requestModel = parse_request xmlRequestString
        persist_model requestModel
      
        logger.info("Successful")
    end

    def send_xml (xmlString)
        if Rails.configuration.oms_upload then
            puts "Sending xml to #{Rails.configuration.oms_upload_url}"

            c = Curl::Easy.http_post(Rails.configuration.oms_upload_url, xmlString)
            c.on_success {|easy| puts "success, add more easy handles" }
            c.on_failure {|easy| puts "failure" }
            c.on_complete {|easy| puts "complete - #{c.body_str}" }
            c.perform
        end
    end
    
    def obtain_request_string
        xmlRequestString = params[:request]
        if xmlRequestString.nil?
            xmlRequestString = request.body.read
        end
      
        return xmlRequestString
    end
    
    def persist_model requestModel
        if requestModel.valid?
            begin
                requestModel.save
            rescue Exception => e
                @errors = "Internal Error, please try later."
                logger.error( "#{@errors}. Exception = #{e.message}")
                raise e
            end
        else 
            @errors = requestModel.errors.messages
            logger.info(@errors.to_s)
            raise StandardError.new(@errors.to_s)
        end
    end
    
    def exception_handler
        render :template => "oms/new_report_error", :status => 500
    end
end
