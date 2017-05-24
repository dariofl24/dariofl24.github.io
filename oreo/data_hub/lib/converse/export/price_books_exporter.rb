require 'rubygems'
require 'csv'
require 'tempfile'
require 'log4r'
require 'time'

require 'converse/io'
require 'converse/logging'
require 'converse/constants'
require 'converse/products_repository'
require 'converse/xml/xml_document_builder'

module Converse
    module Impex

        class Sale
            attr_accessor :name, :product_ids, :start_date, :end_date
        end

        class SaleRequestReader
            include Converse::Logging
            include Converse::Constants

            DATE_FORMAT = '%d%m%y %H:%M:%S %Z'
            MIDNIGHT = ' 00:00:00 +00:00'

            def initialize(logger = nil)
                @logger = logger.nil? ? setup_logger(self.class) : logger
            end

            def read(input_file)
                sale = Sale.new
                sale.product_ids = []

                extract_name_and_dates_from input_file, sale

                CSV.foreach(input_file, { :headers => :first_row }) do |row|
                    sale.product_ids << row['ProductID']
                end

                @logger.info "Extracted info from the PriceBook filename:"
                @logger.info "  PB name: #{sale.name}"
                @logger.info "  PB start date: #{sale.start_date}"
                @logger.info "  PB end date: #{sale.end_date}"
                @logger.info "  PB products: #{sale.product_ids.size}"

                return sale
            end

            def extract_name_and_dates_from(input_file, sale)
                file_name = File.basename(input_file, CSV_EXTENSION)
                parts = file_name.split '_'

                if parts.size != 3
                    @logger.error "Sale export filename seems to be malformed. It should be in the format [name]_[date]_[date] and it should not contain underscores in the name"
                    return
                end

                sale.name = parts[0]
                sale.start_date = DateTime.strptime (parts[1] + MIDNIGHT), DATE_FORMAT
                sale.end_date = DateTime.strptime (parts[2] + MIDNIGHT), DATE_FORMAT
            end
        end

        class PriceBooksExporter < Converse::Xml::XmlDocumentBuilder
            include Converse::Logging

            DATE_EXPORT_FORMAT = "%Y-%m-%dT%H:%M:%S.%3NZ"

            def initialize(output_directory, logger)
                super :output_directory => output_directory, :output_file_prefix => "pb_export"

                @logger = logger
                @products_repository = nil
            end

            def get_product_repository
                @products_repository = ProductsRepository.new(@logger) if @products_repository == nil
                @products_repository
            end

            def move_temp_output_file_to_output_folder(prefix, temp_output_file)
                file_name = create_new_output_file_name prefix
                new_output_file_path = File.join(output_directory, file_name)
                FileUtils.mv(temp_output_file.path, new_output_file_path)
                @processed_file_paths.push(new_output_file_path)
            end

            def create_new_output_file_name(prefix)
                timestamp = Time.new.strftime "%Y%m%d_%H%M%S"
                "#{prefix}_#{timestamp}.xml"
            end

            def create_pricebook_tables(pricebook_builder, products)
                pricebook_builder.tag! "price-tables" do |tables_builder|
                    products.each do |product|
                        tables_builder.tag! "price-table", { "product-id" => product[:identifier] } do |table_builder|
                            table_builder.tag! "amount", { :quantity => "1" }, product[:price]
                        end
                    end
                end
            end

            def create_pricebook_header(pricebook_builder, id, currency, name, start_date = nil, end_date = nil)
                pricebook_builder.header("pricebook-id" => id) do |header_builder|
                    header_builder.currency currency
                    header_builder.tag! "display-name", { "xml:lang" => "x-default" }, name
                    header_builder.tag! "online-flag", "true"

                    if start_date != nil then
                        header_builder.tag! "online-from", start_date.utc.strftime(DATE_EXPORT_FORMAT)
                    end

                    if end_date != nil then
                        header_builder.tag! "online-to", end_date.utc.strftime(DATE_EXPORT_FORMAT)
                    end
                end
            end
        end

        class DefaultPriceBooksExporter < PriceBooksExporter
            def initialize(options, logger = nil)
                super options['output_directory'], logger.nil? ? setup_logger(self.class) : logger
            end

            def build_xml(builder)
                @logger.info "***************************************************************************************************"
                @logger.info "Starting processing sale price book generation requests..."
                @logger.info "  output folder: #{output_directory}"

                build_pricebooks(builder)

                @logger.info "Moving price book file to [#{output_directory}] folder..."
                move_temp_output_file_to_output_folder "default_pb_export", builder.target!
            end

            def build_pricebooks(builder)
                builder.pricebooks(:xmlns => "http://www.demandware.com/xml/impex/pricebook/2006-10-31") do |pricebooks_xml_builder|
                    build_pricebook pricebooks_xml_builder, "retailPricebook_Converse_US", USD, "Default US Price Book", get_product_repository().get_us_products_with_prices
                    build_pricebook pricebooks_xml_builder, "retailPricebook_Converse_UK", GBP, "Default UK Price Book", get_product_repository().get_uk_products_with_prices
                end
            end

            def build_pricebook(builder, pricebook_id, currency, pricebook_name, products)
                @logger.info "Getting products with prices for #{currency}..."

                if products.empty?
                    @logger.warn "  No products found."
                    return
                end

                @logger.info "  #{products.size} products found."

                @logger.info "Running xml builder for #{currency}..."
                builder.pricebook do |pricebook_xml_builder|
                    create_pricebook_header pricebook_xml_builder, pricebook_id, currency, pricebook_name
                    create_pricebook_tables pricebook_xml_builder, products
                end
            end
        end

        class SalesPriceBooksExporter < PriceBooksExporter
            include Converse::Constants
            include Converse::IO

            def initialize(options, logger = nil, parameters = {})
                super options['output_directory'], logger.nil? ? setup_logger(self.class) : logger

                @input_file = parameters[:input_file]
                @processed_directory = options['processed_directory']
                @processed_file_suffix = get_default_file_suffix
                @sale_reader = SaleRequestReader.new @logger
            end

            def build_xml(builder)
                @logger.info "Processing sale generation request file #{@input_file}..."
                sale = @sale_reader.read @input_file
                products = get_product_repository().get_products_with_sale_prices sale.product_ids

                if products.size != 0
                    @logger.info "Creating sale price book with prefix '#{sale.name}'..."

                    @logger.info "Running xml builder..."
                    builder.pricebooks(:xmlns => "http://www.demandware.com/xml/impex/pricebook/2006-10-31") do |pricebooks_xml_builder|
                        pricebooks_xml_builder.pricebook do |pricebook_xml_builder|
                            create_pricebook_header pricebook_xml_builder, sale.name, USD, sale.name, sale.start_date, sale.end_date
                            create_pricebook_tables pricebook_xml_builder, products
                        end
                    end

                    @logger.info "Moving price book file '#{sale.name}_pb_export' to '#{output_directory}' folder..."
                else
                    @logger.info "No product ids found to generate a price book"
                end

                @logger.info "Marking input file '#{@input_file}' as processed..."
                mark_as_processed @input_file

                @logger.info "Sending reports..."
                not_found_products = get_product_ids_list_diff(sale.product_ids, products)
                if not_all_products_found(not_found_products) then
                    not_found_products.each do |product_id|
                        @logger.warn "  Product with SKU or MasterProductID - '#{product_id}' was not found"
                    end
                end

                move_temp_output_file_to_output_folder "#{sale.name}_pb_export", builder.target!
            end

            def get_product_ids_list_diff(product_ids, found_products)
                result = product_ids
                found_ids = found_products.map { |product| if is_master?(product) then product[:identifier] else product[:sku] end }

                found_ids.each do |id|
                    result.delete id
                end

                return result
            end

            def not_all_products_found(product_ids)
                not product_ids.empty?
            end

            def mark_as_processed(input_file)
                unless @processed_file_suffix.blank?
                    file_path = add_suffix_to_file(input_file, @processed_file_suffix)
                    FileUtils.mv(input_file, File.join(@processed_directory, Pathname.new(file_path).basename))
                end
            end

            def is_master?(product)
                product[:is_master_product]
            end
        end
    end
end
