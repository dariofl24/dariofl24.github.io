require 'rubygems'

require 'converse/logging'
require 'converse/csv/csv_data_importer'
require 'converse/models/employee_relative'

module Converse
    module Impex

        class EmployeeRelativesImporter < Converse::Impex::CsvDataImporter
            include Converse::Logging

            def initialize(options, logger = nil)
                super(options['employee_relatives_input_file'], options)
                @logger = logger.nil? ? setup_logger(self.class) : logger
            end

            def import_csv(file_path, options)
                @logger.debug "Running employee relatives CSV import from \"#{file_path}\"..."
                EmployeeRelative.import_csv(file_path, options, true)
                @logger.debug "Done."
            end
        end

    end
end
