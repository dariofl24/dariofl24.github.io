require 'rubygems'
require 'csv'
require 'fileutils'
require 'time'

require 'converse/constants'
require 'converse/io'

module Converse
    module Impex

        class CsvDataImporter
            include Converse::Constants
            include Converse::IO

            DEFAULT_OPTIONS = {
                :force_quotes => false,
                :headers => true,
                :return_headers => true,
                :assert_headers => true,
                :encoding => Encoding.default_external

            }.freeze

            attr_reader :file_path, :options

            def initialize(file_path, options)
                @file_path = file_path
                @options = DEFAULT_OPTIONS.merge(options)
            end

            def run
                if file_exists?
                    import
                    mark_as_processed
                end
            end

            def file_ready?
                return self.file_exists? && !self.file_in_use?
            end

            def file_in_use?
                return (Time.now - File.mtime(file_path)) < 30
            end

            def file_exists?
                return File.exists?(file_path)
            end

            def import
                temp_file_path = add_suffix_to_file(file_path, '_tmp')

                begin
                    filter_csv(file_path, temp_file_path, options)
                    import_csv(temp_file_path, options)
                ensure
                    File.delete(temp_file_path) if File.exist?(temp_file_path)
                end
            end

            def import_csv(file_path, options)
                raise "#{self.class.to_s}.#{__method__.to_s} must be implemented"
            end

            def filter_csv(file_path, temp_file_path, options)
                headers_asserted = false
                csv_columns = get_csv_columns(options)

                CSV.open(temp_file_path, "w", {
                    force_quotes: options[:force_quotes]
                }) do |csv|
                    CSV.foreach(file_path, {
                        encoding: options[:encoding],
                        headers: options[:headers],
                        return_headers: options[:return_headers]
                    }) do |row|
                        if should_assert_headers(options, headers_asserted)
                            assert_headers(row.headers, csv_columns)
                            headers_asserted = true
                        end

                        if accept_csv_row?(row)
                            process_csv_row(row)
                            write_csv_row(csv, row, csv_columns)
                        end
                    end
                end
            end

            def get_csv_columns(options)
                if options[:map]
                    return trim_double_quotes(options[:map].keys)
                elsif options[:columns]
                    return trim_double_quotes(options[:columns])
                end
                return nil
            end

            def accept_csv_row?(row)
                return true
            end

            def process_csv_row(row)
                trim_white_space(row)
            end

            def write_csv_row(csv, row, csv_columns)
                csv << (csv_columns.nil? ? row : row.values_at(*csv_columns))
            end

            def trim_white_space(map)
                map.each { |k, v| map[k.strip] = v.nil? ? nil : v.strip }
            end

            def trim_double_quotes(arr)
                arr.map { |v| v.gsub(/^"(.*?)"$/, '\1') }
            end

            def double_quote_keys(map)
               map.inject({}){ |map,(k,v)| map["\"#{k}\""] = v; map }
            end

            def matches(str, regex)
                !str.blank? && !str.strip.match(regex).nil?
            end

            def should_assert_headers(options, already_asserted)
                options[:headers] and options[:assert_headers] and not already_asserted
            end

            def assert_headers(header_columns, csv_columns)
                actual = header_columns.sort
                expected = csv_columns.sort

                if actual != expected
                    missing = expected - actual
                    raise "The following columns are expected but not found: #{missing}" unless missing.empty?
                end
            end

            def mark_as_processed
                suffix = options[PROCESSED_FILE_SUFFIX_OPTION]
                unless suffix.blank?
                    mark_file_processed(file_path, suffix)
                end
            end
        end
    end
end
