#!/usr/bin/ruby
require 'rubygems'
require 'csv'

require 'converse/constants'
require 'converse/logging'
require 'converse/oms_data_repository'
require 'converse/csv/csv_data_exporter'
require 'converse/models/nikeoms_request'

module Converse
    module Impex
        include Converse::Constants

        class NikeOMSRequestExporter < Converse::Impex::CsvDataExporter
            include Converse::Logging

            def initialize(options, logger = nil, parameters = {})
                super("nikeoms_requests_#{segment_id()}", options)

                @logger = logger.nil? ? setup_logger(self.class) : logger
                @repository = OMSDataRepository.new @logger

                @can_override_output_file = false
            end

            def segment_id
                raise "#{self.class.to_s}.#{__method__.to_s} must be implemented"
            end

            def export_csv(file_path)
                @logger.info "Running CSV export for segment \"#{segment_id()}\" to \"#{file_path}\"..."
                
                requests = @repository.fetch_nikeoms_requests_for_segment(segment_id)

                if requests.length > 0
                    dump_requests_to_file(requests, file_path)
                    @processed_file_paths.push(file_path)
                    @repository.mark_nikeoms_requests_as_exported(requests)
                else
                    @logger.info "No new requests found for segment \"#{segment_id()}\""
                end

                @logger.info "Done."
            end

            def dump_requests_to_file(requests_to_export, file_path)
                column_names = NikeOMSRequest.column_names
                
                CSV.open(file_path, "w", 
                    :write_headers => true,
                    :headers => column_names,
                    :force_quotes => true
                ) do |csv|
                    requests_to_export.each do |request|
                        csv << build_row(column_names, request)
                    end
                end
            end

            def build_row(column_names, request)
                row = []
                    
                column_names.each do |name|
                    row << request[name]
                end

                return row
            end
        end

        class USNikeOMSRequestExporter < NikeOMSRequestExporter
            def segment_id
                US_SEGMENT_ID
            end
        end

        class EMEANikeOMSRequestExporter < NikeOMSRequestExporter
            def segment_id
                GB_SEGMENT_ID
            end
        end

    end
end
