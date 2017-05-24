require 'rubygems'

require 'converse/logging'
require 'converse/csv/csv_data_importer'
require 'converse/models/employee'

module Converse
    module Impex

        class EmployeeImporter < Converse::Impex::CsvDataImporter
            include Converse::Logging

            def initialize(options, logger = nil)
                super(options['employees_input_file'], options)
                @logger = logger.nil? ? setup_logger(self.class) : logger
            end

            def import_csv(file_path, options)
                @logger.debug "Running employee CSV import from \"#{file_path}\"..."
                Employee.import_csv(file_path, options, true)
                @logger.debug "Done."
            end
        end

    end
end
