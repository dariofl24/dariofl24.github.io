require 'rubygems'

require 'converse/logging'
require 'converse/utils'
require 'converse/constants'
require 'converse/csv/csv_data_importer'
require 'converse/models/merch_planner_info'

module Converse
    module Impex

        class MerchPlannerDataImporter < Converse::Impex::CsvDataImporter
            include Converse::Logging
            include Converse::Utils
            include Converse::Constants

            COLUMNS_MAP = {
                'MasterProductID' => 'master_product_id',
                'MerchPlannerCategory' => 'merch_planner_category',
                'Pillar' => 'pillar',
                'Sleeve' => 'sleeve',
                'BrandSegment' => 'brand_segment',
                'ProductType' => 'product_type',
                'SKU' => 'sku',
                'ManufacturerSKU' => 'manufacturer_sku',
                'SearchableFlag' => 'searchable_flag',
                'ProductName' => 'product_name',
                'SizeChart' => 'size_chart',
                'SizeChartMessaging' => 'size_chart_messaging',
                'Color' => 'color',
                'Cut' => 'cut',
                'Gender' => 'gender',
                'Material' => 'material',
                'Price' => 'price',
                'SalePrice' => 'sale_price',
                'MasterPrice' => 'master_price',
                'MasterSalePrice' => 'master_sale_price',
                'Status' => 'current_status',
                'OnlineFrom' => 'online_from',
                'OnlineTo' => 'online_to',
                'Description' => 'description',
                'NikeProductID' => 'nike_product_id',
                'MainColorHex' => 'main_color_hex',
                'AccentColorHex' => 'accent_color_hex',
                'CORE' => 'core',
                'dyoVersionProductID' => 'dyo_version_product_id',
                'dyoVersionInspirationID' => 'dyo_version_inspiration_id',
                'InstanceID' => 'instance_id',
                'InspirationID' => 'inspiration_id',
                'Sizes' => 'sizes',
                'ProductPageTitle' => 'product_page_title',
                'MetaKeywords' => 'meta_keywords',
                'MetaDescription' => 'meta_description',
                'MetaSearchText' => 'meta_search_text',
                'BADGING' => 'badging',
                'Business Unit ID' => 'business_unit_id',
                'Color Slicing' => 'color_slicing',
                'PreorderDate' => 'preorder_date',
                'MaxOrderQuantity' => 'max_order_quantity',
                'ShowIfOutOfStock' => 'show_if_out_of_stock',
                'OutOfStockMessage' => 'out_of_stock_message',
                'Template' => 'template'
            }

            GENDER_MAP = {
                'mens' => 'men',
                'womens' => 'women'
            }

            def initialize(options, logger = nil)
                super(options['merchplanner_input_file'], options.merge(:map => double_quote_keys(COLUMNS_MAP), :force_quotes => true))
                @logger = logger.nil? ? setup_logger(self.class) : logger

                @master_product_seq = 0
                @skus = []
                @duplicate_skus = []
            end

            def import_csv(file_path, options)
                @logger.debug "Running catalog CSV import from \"#{file_path}\"..."
                MerchPlannerInfo.import_csv(file_path, options)
                @logger.warn "Duplicate SKUs found: #{@duplicate_skus}" unless @duplicate_skus.empty?
                @logger.debug "Done."
            end

            def accept_csv_row?(row)
                if row.header_row?
                    return true
                end

                sku = row.field('SKU')
                sizes = row.field('Sizes')
                product_type = strip_whitespace(row.field('ProductType'))

                if sku.blank?
                    raise "The #{row} doesn't have a sku"
                end

                if product_type != PRODUCT_TYPE_DYO && sizes.blank?
                    raise "The SKU: #{sku} doesn't have sizes"
                 end

                if product_type != PRODUCT_TYPE_DYO && !has_valid_sizes(sizes)
                   raise "The SKU: #{sku} with Sizes: #{sizes} can not be processed"
                end

                if @skus.include?(sku)
                    accept = false
                    @duplicate_skus << sku
                else
                    accept = true
                    @skus << sku
                end

                return accept
            end

            def process_csv_row(row)
                super(row)

                unless row.header_row?
                    set_master_product_id_if_necessary(row)
                    set_template_to_default_if_blank(row)
                    set_searchable_flag_to_default_if_blank(row)
                    normalize_gender_value(row)
                    normalize_text_value(row, 'Description')
                    normalize_text_value(row, 'MetaKeywords')
                    normalize_text_value(row, 'MetaDescription')
                    normalize_text_value(row, 'MetaSearchText')
                    normalize_hex_value(row, 'MainColorHex')
                    normalize_hex_value(row, 'AccentColorHex')
                end
            end

            def set_master_product_id_if_necessary(row)
                if row['MasterProductID'].blank?
                    row['MasterProductID'] = "MP_A#{@master_product_seq += 1}"
                end
            end

            def set_template_to_default_if_blank(row)
                if row['Template'].blank?
                    row['Template'] = "default"
                end
            end

            def set_searchable_flag_to_default_if_blank(row)
                if(row['SearchableFlag']=="N")
                    row['SearchableFlag'] = "False"
                else
                    row['SearchableFlag'] = "True"
                end
            end

            def normalize_gender_value(row)
                gender_value = safe_downcase(row['Gender'])
                row['Gender'] = GENDER_MAP.has_key?(gender_value) ? GENDER_MAP[gender_value] : gender_value
            end

            def normalize_text_value(row, field_name)
                text_value = row[field_name]
                row[field_name] = text_value.blank? ? text_value : ellipse(text_value, 1000)
            end

            def normalize_hex_value(row, field_name)
                hex_value = row[field_name]
                row[field_name] = hex_value.blank? ? hex_value : hex_value.rjust(6, '0')
            end
        end

    end
end
