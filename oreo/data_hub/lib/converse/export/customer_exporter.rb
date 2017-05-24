require 'rubygems'
require 'time'
require 'securerandom'

require 'converse/logging'
require 'converse/utils'
require 'converse/models/customer'
require 'converse/models/customer_address'
require 'converse/models/employee'
require 'converse/xml/xml_document_builder'

module Converse
    module Impex

        class CustomerExporter < Converse::Xml::XmlDocumentBuilder
            include Converse::Logging
            include Converse::Utils

            PROFILE_CREATED_FORMAT = '%Y-%m-%dT%H:%M:%S.%3NZ'
            BIRTHDAY_REGEX = /\A(\d{1,4})-(\d{1,2})-(\d{1,2})\z/
            BIRTHDAY_FORMAT = '%Y-%m-%dZ'

            MONTH_NAME_TO_NUMBER = {
                'jan' => '01', 'feb' => '02', 'mar' => '03', 'apr' => '04', 'may' => '05', 'jun' => '06',
                'jul' => '07', 'aug' => '08', 'sep' => '09', 'oct' => '10', 'nov' => '11', 'dec' => '12'
            }

            def initialize(options, logger = nil)
                super :output_directory => options['output_directory'], :output_file_prefix => "customers"
                @logger = logger.nil? ? setup_logger(self.class) : logger
            end

            def build_xml(xml)
                @logger.debug "Building customers XML..."
                xml.customers :xmlns => "http://www.demandware.com/xml/impex/customer/2006-10-31" do
                    create_customers xml
                end

                @processed_file_paths.push(xml.target!.path)
            end

            def create_customers(xml)
                @logger.debug "Creating customer XML records..."
                Customer.find_each(
                    :include => [ :addresses, :employee ],
                    :batch_size => 500
                ) do |customer|
                    create_customer(xml, customer)
                end
            end

            def create_customer(xml, customer)
                @logger.debug "Creating customer XML record \"#{customer.email}\"..."
                xml.customer("customer-no" => customer.signup_id) do
                    create_credentials(xml, customer)
                    create_profile(xml, customer)
                    create_addresses(xml, customer)
                end
            end

            def create_credentials(xml, customer)
                xml.credentials do
                    xml.login blank_to_nil(customer.email)
                    xml.tag! "password", { "encrypted" => false }, SecureRandom.hex
                    xml.tag! "enabled-flag", customer.active
                end
            end

            def create_profile(xml, customer)
                xml.profile do
                    xml.tag! "first-name", blank_to_nil(customer.first_name)
                    xml.tag! "last-name", blank_to_nil(customer.last_name)
                    xml.email blank_to_nil(customer.email)

                    birthday = get_birthday(customer)
                    xml.birthday birthday unless birthday.nil?

                    xml.gender get_gender(customer)
                    xml.tag! "creation-date", format_date_time(customer.profile_created, PROFILE_CREATED_FORMAT)

                    create_custom_attributes(xml, customer)
                end
            end

            def create_custom_attributes(xml, customer)
                xml.tag! "custom-attributes" do
                    xml.tag! "custom-attribute", { "attribute-id" => "postalCode" }, get_postal_code(customer.zip)
                    xml.tag! "custom-attribute", { "attribute-id" => "legacy" }, true

                    create_employee_attributes(xml, customer.employee)
                end
            end

            def create_employee_attributes(xml, employee)
                unless employee.nil?
                    xml.tag! "custom-attribute", { "attribute-id" => "employeeID" }, employee.employee_id
                    xml.tag! "custom-attribute", { "attribute-id" => "employeeEmail" }, blank_to_nil(employee.email)
                    xml.tag! "custom-attribute", { "attribute-id" => "employeeFirstName" }, blank_to_nil(employee.first_name)
                    xml.tag! "custom-attribute", { "attribute-id" => "employeeLastName" }, blank_to_nil(employee.last_name)
                    xml.tag! "custom-attribute", { "attribute-id" => "employeeBvatID" }, blank_to_nil(employee.bvat_id)
                    xml.tag! "custom-attribute", { "attribute-id" => "employeeActive" }, employee.active
                    xml.tag! "custom-attribute", { "attribute-id" => "employeeCreated" }, format_date_time(employee.created)
                end
            end

            def create_addresses(xml, customer)
                unless customer.addresses.empty?
                    xml.addresses do
                        customer.addresses.each_with_index do |address, index|
                            xml.address("address-id" => "#{customer.signup_id}_#{index + 1}", "preferred" => index == 0) do
                                xml.tag! "first-name", blank_to_nil(address.first_name)
                                xml.tag! "last-name", blank_to_nil(address.last_name)
                                xml.address1 blank_to_nil(address.address1)
                                xml.address2 blank_to_nil(address.address2)
                                xml.city blank_to_nil(address.city)
                                xml.tag! "postal-code", get_postal_code(address.zip)
                                xml.tag! "state-code",  get_address_state(address)
                                xml.tag! "country-code", blank_to_nil(address.country_code)
                                xml.phone blank_to_nil(address.phone)
                            end
                        end
                    end
                end
            end

            def get_birthday(customer)
                month = safe_downcase(customer.birth_month)
                day = safe_downcase(customer.birth_day)
                year = safe_downcase(customer.birth_year)

                if month.blank? || day.blank? || year.blank?
                    return nil
                end

                # replace month names with month numbers
                MONTH_NAME_TO_NUMBER.each do |name, num|
                    month.gsub!(/\b#{name}\b/i, num)
                end

                birthday = "#{year}-#{month}-#{day}"

                if birthday =~ BIRTHDAY_REGEX
                    birthday = DateTime.parse(birthday).strftime(BIRTHDAY_FORMAT) rescue nil
                else
                    birthday = nil
                end

                birthday
            end

            def get_gender(customer)
                gender = safe_upcase(customer.gender)
                gender == 'M' ? 1 : (gender == 'F' ? 2 : 0)
            end

            def get_postal_code(postal_code)
                blank_to_nil(safe_upcase(postal_code))
            end

            def get_address_state(address)
                state = address.state
                unless state.blank?
                    state.gsub!(/Not\s+Applicable/i, "")
                end
                blank_to_nil(state)
            end

        end

    end
end

