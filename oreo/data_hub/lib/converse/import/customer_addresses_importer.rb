require 'rubygems'

require 'converse/logging'
require 'converse/csv/csv_data_importer'
require 'converse/models/customer_address'

module Converse
    module Impex

        class CustomerAddressesImporter < Converse::Impex::CsvDataImporter
            include Converse::Logging

            def initialize(options, logger = nil)
                super(options['customer_addresses_input_file'], options)
                @logger = logger.nil? ? setup_logger(self.class) : logger
            end

            def import_csv(file_path, options)
                @logger.debug "Running customer addresses CSV import from \"#{file_path}\"..."
                CustomerAddress.import_csv(file_path, options, false)
                @logger.debug "Done."
            end
        end

    end
end
