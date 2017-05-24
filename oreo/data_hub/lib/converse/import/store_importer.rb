require 'rubygems'

require 'converse/logging'
require 'converse/utils'
require 'converse/csv/csv_data_importer'
require 'converse/models/store'
require 'converse/models/canadian_store'
require 'converse/models/usa_store'
require 'converse/models/skateboarding_store'

module Converse
    module Impex

        class StoreImporter < Converse::Impex::CsvDataImporter
            include Converse::Logging
            include Converse::Utils

            TYPE = Store::TYPE

            XPERIA_COLUMNS = {
                'CUST-NAME' => 'name',
                'ADDRESS-1' => 'address1',
                'ADDRESS-2' => 'address2',
                'CITY' => 'city',
                'STATE' => 'state',
                'ZIPCD' => 'zip',
                'CUST-SOLDTO' => 'account_no',
                'COMPANY' => 'company_no',
                'PHONE-NO' => 'phone'
            }

            COLUMNS_MAP = {
                TYPE[:US] => XPERIA_COLUMNS,
                TYPE[:CA] => XPERIA_COLUMNS,
                TYPE[:SKATEBOARDING] => {
                    'Name' => 'name',
                    'Address1' => 'address1',
                    'Address2' => 'address2',
                    'City' => 'city',
                    'State' => 'state',
                    'ZipCode' => 'zip',
                    'Url' => 'url',
                    'Lat' => 'lat',
                    'Lng' => 'lng'
                }
            }

            US_STATE_REGEX = /^[a-zA-Z]{2}$/
            US_ZIP_REGEX = /^\d{5}([\-]?\d{4})?$/

            attr_accessor :type

            def self.get_file_name(type, options)
                options["#{type[:code]}_store_input_file"]
            end

            def self.get_options(type, options)
                options.merge({ :map => COLUMNS_MAP[type], :encoding => 'ISO-8859-1:UTF-8' })
            end

            def initialize(type, options, logger = nil)
                super(StoreImporter.get_file_name(type, options), StoreImporter.get_options(type, options))
                @type = type
                @logger = logger.nil? ? setup_logger(self.class) : logger
            end

            def import_csv(file_path, options)
                @logger.debug "Running #{type[:name]} store CSV import from \"#{file_path}\"..."
                clazz = Object.const_get("#{type[:name]}Store")
                clazz.import_csv(file_path, options)
                clazz.delete_duplicates(options[:map].values)
                generate_hash_keys(clazz)
                @logger.debug 'Done.'
            end

            def accept_csv_row?(row)
                accept = true
                if row.field_row?
                    if type == TYPE[:US]
                        accept = matches(row.field('STATE'), US_STATE_REGEX) && matches(row.field('ZIPCD'), US_ZIP_REGEX)
                    end
                end
                accept
            end

            def process_csv_row(row)
                super(row)
                if row.field_row?
                    if type == TYPE[:US]
                        zip = row.field('ZIPCD')
                        row['ZIPCD'] = zip[0..4]
                    end
                end
            end

            def generate_hash_keys(clazz)
                clazz.find_each(
                    :batch_size => 500,
                    :conditions => 'hash_key IS NULL'
                ) do |store|
                    generate_hash_key(store)
                end
            end

            def generate_hash_key(store)
                store.hash_key = store.generate_hash_key
                store.save
            end

        end

    end
end
