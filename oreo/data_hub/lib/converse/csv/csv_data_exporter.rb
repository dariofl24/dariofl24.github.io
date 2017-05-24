require 'rubygems'
require 'fileutils'

require 'converse/io'

module Converse
    module Impex
        class CsvDataExporter
            include Converse::IO

            attr_accessor :file_path, :options, :processed_file_paths, :can_override_output_file

            def initialize(output_file_prefix, options)
                @output_directory = options['output_directory']
                @output_file_prefix = output_file_prefix

                @processed_file_paths = []
            end

            def run
                export
            end

            def export
                temp_file_path = generate_temporary_output_file_path()
                export_csv(temp_file_path)
            end

            def export_csv(file_path)
                raise "#{self.class.to_s}.#{__method__.to_s} must be implemented"
            end

            def can_override_output?(file_name)
                file_path = File.join(@output_directory, file_name)
                return !File.exists?(file_path) || File.exists?(file_path) && @can_override_output_file
            end

            def generate_temporary_output_file_path
                timestamp = Time.new.strftime "%Y%m%d_%H%M%S"
                File.join(@output_directory, "#{@output_file_prefix}_#{timestamp}.csv")
            end

        end
    end
end
