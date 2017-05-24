require 'converse/logging'
require 'converse/io'
require 'converse/export/customer_exporter'
require 'converse/export/employee_relatives_exporter'
require 'converse/export/price_books_exporter'
require 'converse/export/product_catalog_exporter'
require 'converse/export/product_inventory_exporter'
require 'converse/export/nikeoms_request_exporter'
require 'converse/export/store_exporter'

module Converse
    module Impex
        module ExportMode

            CATALOG = 1
            PRICE_BOOK = 2
            INVENTORY = 4
            CUSTOMER = 8
            EMPLOYEE = 16
            NIKE_OMS_US = 32
            NIKE_OMS_EMEA = 64
            STORE = 128
            SALE_PRICE_BOOK = 256
            ALL = CATALOG | PRICE_BOOK | INVENTORY | CUSTOMER | EMPLOYEE | NIKE_OMS_US | NIKE_OMS_EMEA | STORE | SALE_PRICE_BOOK

            def self.name_by_value(value)
                constants.find{ |name| const_get(name) == value }.to_s()
            end

            def self.value_by_name(name)
                const_get(name)
            end
        end

        class ExporterFacade
            include Converse::Logging
            include Converse::IO

            timestamp = Time.new.strftime "%Y%m%d_%H%M%S"

            EXPORTERS = [
                { :mode => ExportMode::CATALOG, :class => CatalogExporter, :file_name => 'catalog.xml' },
                { :mode => ExportMode::PRICE_BOOK, :class => DefaultPriceBooksExporter, :file_name => 'prices.xml' },
                { :mode => ExportMode::INVENTORY, :class => ProductInventoryExporter, :file_name => 'inventory.xml' },
                { :mode => ExportMode::CUSTOMER, :class => CustomerExporter, :file_name => 'customers.xml' },
                { :mode => ExportMode::EMPLOYEE, :class => EmployeeRelativesExporter, :file_name => 'employee_relatives.xml' },
                { :mode => ExportMode::NIKE_OMS_US, :class => USNikeOMSRequestExporter, :file_name => "nikeoms_requests_US_#{timestamp}.csv" },
                { :mode => ExportMode::NIKE_OMS_EMEA, :class => EMEANikeOMSRequestExporter, :file_name => "nikeoms_requests_EMEA_#{timestamp}.csv" },
                { :mode => ExportMode::STORE, :class => StoreExporter, :file_name => 'stores.xml' },
                { :mode => ExportMode::SALE_PRICE_BOOK, :class => SalesPriceBooksExporter, :file_name => 'sale-prices.xml' }
            ]

            attr_accessor :options, :logger, :mode

            def initialize(options, logger = nil, mode = ExportMode::ALL)
                self.options = options
                self.logger = logger.nil? ? setup_logger(self.class) : logger
                self.mode = mode
            end

            def run(parameters = {})
                EXPORTERS.each do |exporter|
                    if should_export(exporter[:mode], mode)
                        run_exporter(exporter, parameters)
                    end
                end
            end

            def should_export(export_mode, mode)
                export_mode & mode == export_mode
            end

            def run_exporter(exporter, parameters = {})
                output_file_name = exporter[:file_name]
                data_exporter = instantiate_exporter_class(exporter[:class], parameters)

                unless data_exporter.can_override_output?(output_file_name)
                    raise "Looks like the previously generated feed ('#{output_file_name}') was not consumed by DW. Cannot override!"
                end

                data_exporter.run

                logger.info("Exporter class: '#{exporter[:class]}'")

                if (data_exporter.processed_file_paths.length > 0) && (exporter[:class] != EMEANikeOMSRequestExporter)
                    logger.info("Copying '#{data_exporter.processed_file_paths[0]}' to '#{output_file_name}'...")
                    safe_copy(data_exporter.processed_file_paths[0], output_file_name)
                end
            end

            def instantiate_exporter_class(exporter_class, parameters = {})                
                if parameters.length > 0
                    return exporter_class.new(options, logger, parameters)
                end

                return exporter_class.new(options, logger)
            end
        end
    end
end
