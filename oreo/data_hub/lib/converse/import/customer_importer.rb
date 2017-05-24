require 'rubygems'

require 'converse/logging'
require 'converse/csv/csv_data_importer'
require 'converse/models/customer'

module Converse
    module Impex

        class CustomerImporter < Converse::Impex::CsvDataImporter
            include Converse::Logging

            def initialize(options, logger = nil)
                super(options['customers_input_file'], options)
                @logger = logger.nil? ? setup_logger(self.class) : logger
            end

            def import_csv(file_path, options)
                @logger.debug "Running customer CSV import from \"#{file_path}\"..."
                Customer.import_csv(file_path, options, false)
                @logger.debug "Done."
            end
        end

    end
end
