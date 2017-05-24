#!/usr/bin/ruby
require 'rubygems'
require 'time'

require 'converse/logging'
require 'converse/utils'
require 'converse/models/employee_relative'
require 'converse/xml/xml_document_builder'

module Converse
    module Impex

        class EmployeeRelativesExporter < Converse::Xml::XmlDocumentBuilder
            include Converse::Logging
            include Converse::Utils

            def initialize(options, logger = nil)
                super :output_directory => options['output_directory'], :output_file_prefix => "employee_relatives"
                @logger = logger.nil? ? setup_logger(self.class) : logger
            end

            def build_xml(xml)
                @logger.debug "Building employee relatives XML..."
                xml.tag! "custom-objects", :xmlns => "http://www.demandware.com/xml/impex/customobject/2006-10-31" do
                    create_employee_relatives xml
                end

                @processed_file_paths.push(xml.target!.path)
            end

            def create_employee_relatives(xml)
                @logger.debug "Creating employee relative XML records..."
                EmployeeRelative.find_each(
                    :batch_size => 500
                ) do |relative|
                    create_employee_relative(xml, relative)
                end
            end

            def create_employee_relative(xml, relative)
                @logger.debug "Creating employee relative XML record \"#{relative.email}\"..."
                xml.tag! "custom-object", { "type-id" => "EmployeeRelative", "object-id" => relative.email } do
                    xml.tag! "object-attribute", { "attribute-id" => "employeeID" }, relative.employee_id
                    xml.tag! "object-attribute", { "attribute-id" => "customerNo" }, blank_to_nil(relative.signup_id)
                    xml.tag! "object-attribute", { "attribute-id" => "email" }, relative.email
                    xml.tag! "object-attribute", { "attribute-id" => "firstName" }, blank_to_nil(relative.first_name)
                    xml.tag! "object-attribute", { "attribute-id" => "lastName" }, blank_to_nil(relative.last_name)
                    xml.tag! "object-attribute", { "attribute-id" => "relationship" }, relative.relationship_id
                    xml.tag! "object-attribute", { "attribute-id" => "state" }, relative.state

                    agreed_to_terms = format_date_time(relative.agreed_terms_date)
                    xml.tag! "object-attribute", { "attribute-id" => "agreedToTerms" }, agreed_to_terms unless agreed_to_terms.nil?

                    xml.tag! "object-attribute", { "attribute-id" => "created" }, format_date_time(relative.created)
                end
            end

        end

    end
end

