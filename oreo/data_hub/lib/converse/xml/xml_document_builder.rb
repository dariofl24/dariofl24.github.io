require 'rubygems'
require 'builder'
require 'time'

module Converse
    module Xml

        class XmlDocumentBuilder
            attr_accessor :output_directory, :output_file_prefix, :processed_file_paths

            def initialize(options = {})
                options.assert_valid_keys(:output_directory, :output_file_prefix)
                options.each { |k, v| self.send("#{k}=", v) }

                @processed_file_paths = []
            end

            def run
                build
            end

            def can_override_output?(file_name)
                true
            end

            protected
            def build
                output_file_path = create_output_file_path

                begin
                    File.open(output_file_path, "w") do |target|
                        xml = create_xml_builder target
                        build_xml xml
                    end
                end
            end

            def build_xml(xml)
                raise "#{self.class.to_s}.#{__method__.to_s} must be implemented"
            end

            def create_xml_builder(target)
                builder = Builder::XmlMarkup.new(:target => target, :indent => 2)
                builder.instruct! :xml, :encoding => "UTF-8"
                builder
            end

            def create_output_file_path
                timestamp = Time.new.strftime "%Y%m%d_%H%M%S"
                File.join(output_directory, "#{output_file_prefix}_#{timestamp}.xml")
            end
        end

    end
end

