require 'active_record'

require 'converse/constants'
require 'converse/logging'
require 'converse/models/nikeoms_request'

class OMSDataRepository
    include Converse::Constants
    include Converse::Logging

    def initialize(logger = nil)
        @logger = logger.nil? ? setup_logger(self.class) : logger
    end

    def fetch_nikeoms_requests_for_segment(segment_id)
        requests = []
        NikeOMSRequest.where(request_segment: segment_id, status: OMS_STATUS::NEW).find_each(:batch_size => 500) do |request|
            requests << request
        end

        return requests
    end

    def mark_nikeoms_requests_as_exported(exported_requests)
        exported_requests.each do |request|
            request.status = OMS_STATUS::EXPORTED
            request.save
        end
    end
end
