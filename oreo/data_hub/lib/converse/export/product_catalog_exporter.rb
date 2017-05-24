#!/usr/bin/ruby
require 'rubygems'

require 'converse/constants'
require 'converse/logging'
require 'converse/utils'
require 'converse/models/size_charts'
require 'converse/models/master_product'
require 'converse/models/variation_product'
require 'converse/xml/xml_document_builder'

=begin
This class is meant to build the catalog XML file compliant with DW import file. The script uses the information
from the DataHub DB (check https://milestone.tacitknowledge.com/display/Converse/DataHub+DB+Information for more info
on DB schema)
=end
module Converse
    module Impex

        class CatalogExporter < Converse::Xml::XmlDocumentBuilder
            include Converse::Constants
            include Converse::SizeCharts
            include Converse::Logging
            include Converse::Utils

            MIN_ORDER_QUANTITY = 1.0
            STEP_QUANTITY = 1.0
            SIZE_RAW_VALUE_ELEMENT = 'size_raw_value'
            SIZE_DISPLAY_VALUE_ELEMENT = 'size_display_value'

            ONLINE_DATE_FORMAT = '%Y-%m-%dT%H:%M:%S.%3NZ'

            PRODUCT_IMAGES = {
                PRODUCT_TYPE_REGULAR => ["standard", "shot1", "shot2", "shot3", "shot4", "shot5", "shot6", "shot7", "shot8"],
                PRODUCT_TYPE_SHOWCASE => ["standard", "shot1", "shot2", "shot3", "shot4", "shot5", "shot6", "shot7", "shot8"],
                PRODUCT_TYPE_DYO => ["standard"],
                PRODUCT_TYPE_PHYSICAL_GC => [],
                PRODUCT_TYPE_ELECTRONIC_GC => []
            }

            def initialize(options, logger = nil)
                super :output_directory => options['output_directory'], :output_file_prefix => "catalog"
                @logger = logger.nil? ? setup_logger(self.class) : logger

                @catalog_id = "masterCatalog_Converse"
                @category_id = "imported-products-category"
                @category_name = "Imported Products"
            end

            #TODO Needs Unit Test. For this test some data are required into the tbl_MasterProduct and tbl_VariantProduct
            def build_xml(builder)
                @logger.debug "Building Catalog XML..."
                create_catalog_main_element(builder) do |catalog_xml_builder|
                    create_catalog_header catalog_xml_builder
                    create_catalog_root_category catalog_xml_builder
                    create_catalog_category catalog_xml_builder, @category_id, @category_name

                    standard_product_ids = []
                    VariationProduct.joins(:master_product).find_each(
                        :include => :master_product,
                        :conditions => "product_type='#{PRODUCT_TYPE_DYO}'",
                        :batch_size => 500
                    ) do |product|
                        create_standard_product(catalog_xml_builder, product)
                        standard_product_ids << product.product_identifier
                    end

                    master_product_ids = []
                    MasterProduct.joins(:variation_products).find_each(
                        :include => {:variation_products => :product_price},
                        :conditions => "product_type<>'#{PRODUCT_TYPE_DYO}'",
                        :batch_size => 500
                    ) do |master_product|
                        next if master_product_ids.include? master_product.product_identifier

                        create_master_product(catalog_xml_builder, master_product)
                        master_product_ids << master_product.product_identifier

                        create_variation_products(catalog_xml_builder, master_product.variation_products)
                    end

                    create_category_assignments catalog_xml_builder, @category_id, master_product_ids + standard_product_ids
                end

                @processed_file_paths.push(builder.target!.path)
            end

            def create_catalog_main_element(builder)
                builder.catalog(:xmlns => "http://www.demandware.com/xml/impex/catalog/2006-10-31", "catalog-id" => @catalog_id) do |main_element_builder|
                    yield(main_element_builder) if block_given?
                end
            end

            def create_catalog_header(catalog_xml_builder)
                catalog_xml_builder.header do |header_builder|
                    header_builder.tag! "image-settings" do |image_settings_builder|
                        image_settings_builder.tag! "internal-location", { "base-path" => "/" }
                        image_settings_builder.tag! "view-types" do |view_types_builder|
                            image_settings_builder.tag! "view-type", "hi-res"
                            image_settings_builder.tag! "view-type", "large"
                            image_settings_builder.tag! "view-type", "medium"
                            image_settings_builder.tag! "view-type", "small"
                            image_settings_builder.tag! "view-type", "swatch"
                        end
                        image_settings_builder.tag! "variation-attribute-id", "image-variation"
                        image_settings_builder.tag! "alt-pattern", "${productname}"
                        image_settings_builder.tag! "title-pattern", "${productname}"
                    end
                end
            end

            def create_catalog_root_category(catalog_builder)
                catalog_builder.category("category-id" => "root") do |category_builder|
                    category_builder.tag! "online-flag", "true"
                    category_builder.position 0.0
                    category_builder.template
                    category_builder.tag! "page-attributes"
                end
            end

            def create_catalog_category(catalog_builder, category_id, category_name)
                catalog_builder.category("category-id" => category_id) do |category_builder|
                    category_builder.tag! "display-name", { "xml:lang" => "x-default" }, category_name
                    category_builder.tag! "online-flag", "true"
                    category_builder.parent "root"
                    category_builder.template
                    category_builder.tag! "page-attributes"
                end
            end

            def create_category_assignments(catalog_builder, category_id, product_ids)
                product_ids.each do |product_id|
                    catalog_builder.tag! "category-assignment", { "category-id" => category_id, "product-id" => product_id } do |category_assignment_builder|
                        category_assignment_builder.tag! "primary-flag", "true"
                    end
                end
            end

            def create_master_product(catalog_builder, product)
                catalog_builder.product("product-id" => product.product_identifier) do |product_builder|
                    product_builder.ean
                    product_builder.upc
                    product_builder.unit
                    product_builder.tag! "min-order-quantity", MIN_ORDER_QUANTITY
                    product_builder.tag! "step-quantity", STEP_QUANTITY
                    product_builder.tag! "display-name", { "xml:lang" => "x-default" }, product.get_master_name
                    product_builder.tag! "short-description", blank_to_nil(product.description)
                    product_builder.tag! "online-flag", true
                    product_builder.tag! "available-flag", true #TODO Verify if this data is correct or should be obtained based on certain logic or db table.
                    product_builder.tag! "searchable-flag", product.searchable_flag

                    create_master_product_images(product_builder, product)

                    product_builder.tag! "page-attributes"

                    create_master_product_custom_attributes(product_builder, product)

                    product_builder.variations do |variations_builder|
                        create_product_variation_attributes(variations_builder, obtain_variation_attributes(product.variation_products), product.color_slicing)
                        create_variants(variations_builder, product.variation_products)
                    end
                end
            end

            def create_variation_products(catalog_xml_builder, variation_products)
                variation_products.each do |variation_product|
                    online_from = format_date_time(variation_product.online_from, ONLINE_DATE_FORMAT)
                    online_to = format_date_time(variation_product.online_to, ONLINE_DATE_FORMAT)

                    catalog_xml_builder.product("product-id" => variation_product.product_identifier) do |product_builder|
                        product_builder.ean
                        product_builder.upc variation_product.upc
                        product_builder.unit
                        product_builder.tag! "min-order-quantity", MIN_ORDER_QUANTITY
                        product_builder.tag! "step-quantity", STEP_QUANTITY
                        build_variation_product_name(product_builder, variation_product)
                        product_builder.tag! "online-flag", variation_product.online
                        product_builder.tag! "online-from", online_from unless online_from.blank?
                        product_builder.tag! "online-to", online_to unless online_to.blank?
                        product_builder.tag! "available-flag", true #TODO Verify if this data is correct or should be obtained based on certain logic or db table.
                        product_builder.tag! "searchable-flag", variation_product.searchable_flag
                        product_builder.tag! "searchable-if-unavailable-flag", variation_product.show_if_out_of_stock
                        product_builder.tag! "manufacturer-sku", get_manufacturer_sku(variation_product)
                        product_builder.tag! "page-attributes" do |page_attributes|
                            page_attributes.tag! "page-title", { "xml:lang" => "x-default" }, variation_product.page_title
                            page_attributes.tag! "page-description", { "xml:lang" => "x-default" }, variation_product.page_description
                            page_attributes.tag! "page-keywords", { "xml:lang" => "x-default" }, variation_product.page_keywords
                        end

                        create_variation_product_custom_attributes(product_builder, variation_product)
                    end
                end
            end

            def create_master_product_images(product_builder, master_product)
                image_list = PRODUCT_IMAGES[master_product.product_type]
                return if image_list.nil? or image_list.empty?

                variation_products = master_product.variation_products
                color_variations = Hash.new
                product_builder.tag! "images" do |product_images|
                    variation_products.each do |variation_product|
                        sku = variation_product.sku
                        color = variation_product.color

                        if master_product.is_kids_sneaker_or_apparel?
                            size_chart = variation_product.size_chart
                            image_variation = "#{sku}_#{color}_#{size_chart}"
                            image_variation_value = get_image_variation_value variation_product
                        else
                            image_variation = "#{sku}_#{color}"
                            image_variation_value = get_image_variation_value variation_product
                        end

                        next if color_variations.has_key?(image_variation)
                        color_variations[image_variation] = true

                        image_list = PRODUCT_IMAGES[master_product.product_type]

                        product_images.tag! "image-group", { "view-type" => "hi-res", "variation-value" => image_variation_value } do |image_group|
                            image_list.each do |image_name|
                                path = "images/products/#{sku}/#{sku}_#{image_name}.png"
                                image_group.tag! "image", { "path" => path }
                            end
                        end
                    end
                end
            end

            def create_standard_product_images(product_builder, product)
                image_list = PRODUCT_IMAGES[product.master_product.product_type]
                return if image_list.nil? or image_list.empty?

                product_builder.tag! "images" do |product_images|
                    product_images.tag! "image-group", { "view-type" => "hi-res" } do |image_group|
                        image_list.each do |image_name|
                            path = "images/products/#{product.sku}/#{product.sku}_#{image_name}.png"
                            image_group.tag! "image", { "path" => path }
                        end
                    end
                end
            end

            def create_standard_product(catalog_builder, standard_product)
                master_product = standard_product.master_product

                catalog_builder.product("product-id" => standard_product.product_identifier) do |product_builder|
                    product_builder.ean
                    product_builder.upc
                    product_builder.unit
                    product_builder.tag! "min-order-quantity", MIN_ORDER_QUANTITY
                    product_builder.tag! "step-quantity", STEP_QUANTITY
                    product_builder.tag! "display-name", { "xml:lang" => "x-default" }, master_product.name
                    product_builder.tag! "short-description", blank_to_nil(master_product.description)
                    product_builder.tag! "online-flag", standard_product.online
                    product_builder.tag! "available-flag", true #TODO Verify if this data is correct or should be obtained based on certain logic or db table.
                    product_builder.tag! "searchable-flag", standard_product.searchable_flag

                    create_standard_product_images(product_builder, standard_product)

                    product_builder.tag! "manufacturer-sku", get_manufacturer_sku(standard_product)
                    product_builder.tag! "page-attributes" do |page_attributes|
                        page_attributes.tag! "page-title", { "xml:lang" => "x-default" }, standard_product.page_title
                        page_attributes.tag! "page-description", { "xml:lang" => "x-default" }, standard_product.page_description
                        page_attributes.tag! "page-keywords", { "xml:lang" => "x-default" }, standard_product.page_keywords
                    end

                    custom_attributes = create_master_product_custom_attributes(product_builder, master_product, standard_product)
                end
            end

            def create_master_product_custom_attributes(product_builder, master_product, standard_product = nil)
                product_builder.tag! "custom-attributes" do |custom_attributes_builder|
                    custom_attributes_builder.tag! "custom-attribute", { "attribute-id" => "merchPlannerCategory" }, blank_to_nil(master_product.merch_planner_category)
                    custom_attributes_builder.tag! "custom-attribute", { "attribute-id" => "pillar" }, blank_to_nil(master_product.pillar)
                    custom_attributes_builder.tag! "custom-attribute", { "attribute-id" => "brandSegment" }, blank_to_nil(master_product.brand_segment)
                    custom_attributes_builder.tag! "custom-attribute", { "attribute-id" => "productType" }, master_product.product_type
                    custom_attributes_builder.tag! "custom-attribute", { "attribute-id" => "cut" }, blank_to_nil(master_product.cut)
                    custom_attributes_builder.tag! "custom-attribute", { "attribute-id" => "gender" }, blank_to_nil(get_gender(master_product))
                    custom_attributes_builder.tag! "custom-attribute", { "attribute-id" => "material" }, blank_to_nil(master_product.material)
                    custom_attributes_builder.tag! "custom-attribute", { "attribute-id" => "nikeProductID" }, blank_to_nil(master_product.nike_product_id)
                    custom_attributes_builder.tag! "custom-attribute", { "attribute-id" => "core" }, master_product.core
                    custom_attributes_builder.tag! "custom-attribute", { "attribute-id" => "instanceID" }, master_product.instance_id
                    custom_attributes_builder.tag! "custom-attribute", { "attribute-id" => "inspirationID" }, master_product.inspiration_id
                    custom_attributes_builder.tag! "custom-attribute", { "attribute-id" => "pdp_template" }, master_product.template

                    sub_gender = get_sub_gender(master_product)

                    if !sub_gender.blank?
                        custom_attributes_builder.tag! "custom-attribute", { "attribute-id" => "subGender" }, sub_gender
                    end

                    if standard_product
                        custom_attributes_builder.tag! "custom-attribute", { "attribute-id" => "metaSearchText" }, standard_product.meta_search_text
                        custom_attributes_builder.tag! "custom-attribute", { "attribute-id" => "badging" }, blank_to_nil(standard_product.badging)
                        custom_attributes_builder.tag! "custom-attribute", { "attribute-id" => "sizeChart" }, blank_to_nil(standard_product.size_chart)
                    end
                end
            end

            def create_variation_product_custom_attributes(product_builder, variation_product)
                product_builder.tag! "custom-attributes" do |custom_attributes_builder|
                    if variation_product.master_product.giftcard?
                        create_variation_product_custom_attributes_for_giftcards(custom_attributes_builder, variation_product)
                    else
                        create_variation_product_custom_attributes_for_non_giftcards(custom_attributes_builder, variation_product)
                    end
                    custom_attributes_builder.tag! "custom-attribute", { "attribute-id" => "metaSearchText" }, variation_product.meta_search_text
                end
            end

            def create_variation_product_custom_attributes_for_giftcards(custom_attributes_builder, variation_product)
                if variation_product.master_product.product_type == PRODUCT_TYPE_PHYSICAL_GC
                    custom_attributes_builder.tag! "custom-attribute", { "attribute-id" => "sleeve" }, variation_product.sleeve
                end

                custom_attributes_builder.tag! "custom-attribute", { "attribute-id" => "value" }, variation_product.get_product_price
            end

            def create_variation_product_custom_attributes_for_non_giftcards(custom_attributes_builder, variation_product)
                formatted_size = get_formatted_size(variation_product)

                custom_attributes_builder.tag! "custom-attribute", { "attribute-id" => "color" }, variation_product.color
                custom_attributes_builder.tag! "custom-attribute", { "attribute-id" => "image-variation" }, get_image_variation_value(variation_product)
                custom_attributes_builder.tag! "custom-attribute", { "attribute-id" => "size" }, formatted_size[SIZE_RAW_VALUE_ELEMENT]
                custom_attributes_builder.tag! "custom-attribute", { "attribute-id" => "refinementSize" }, formatted_size[SIZE_DISPLAY_VALUE_ELEMENT]
                custom_attributes_builder.tag! "custom-attribute", { "attribute-id" => "mainColorHex" }, blank_to_nil(variation_product.main_color_hex)
                custom_attributes_builder.tag! "custom-attribute", { "attribute-id" => "accentColorHex" }, blank_to_nil(variation_product.accent_color_hex)
                custom_attributes_builder.tag! "custom-attribute", { "attribute-id" => "dyoVersionProductID" }, variation_product.dyo_version_product_id
                custom_attributes_builder.tag! "custom-attribute", { "attribute-id" => "dyoVersionInspirationID" }, variation_product.dyo_version_inspiration_id
                custom_attributes_builder.tag! "custom-attribute", { "attribute-id" => "badging" }, blank_to_nil(variation_product.badging)
                custom_attributes_builder.tag! "custom-attribute", { "attribute-id" => "sizeChart" }, blank_to_nil(variation_product.size_chart)
                custom_attributes_builder.tag! "custom-attribute", { "attribute-id" => "sizeChartMessaging" }, blank_to_nil(variation_product.size_chart_messaging)
                custom_attributes_builder.tag! "custom-attribute", { "attribute-id" => "maxOrderQuantity" }, blank_to_nil(variation_product.max_order_quantity)
                custom_attributes_builder.tag! "custom-attribute", { "attribute-id" => "showIfOutOfStock" }, variation_product.show_if_out_of_stock
                custom_attributes_builder.tag! "custom-attribute", { "attribute-id" => "outOfStockMessage" }, blank_to_nil(variation_product.out_of_stock_message)
            end

            def get_image_variation_value(variation_product)
                image_variation_value = variation_product.color
                if variation_product.master_product.is_kids_sneaker_or_apparel?
                    image_variation_value = "#{variation_product.color}-#{variation_product.size_chart}"
                end

                return image_variation_value
            end

            def obtain_variation_attributes(variation_products)
                variation_attributes = {}
                master_product = variation_products.first.master_product

                if master_product.giftcard?
                    variation_attributes = obtain_variation_attributes_for_giftcard_products(variation_products)
                elsif master_product.is_kids_sneaker_or_apparel?
                    variation_attributes = obtain_variation_attributes_for_kids_products(variation_products)
                else
                    variation_attributes = obtain_variation_attributes_for_products(variation_products)
                end

                return variation_attributes
            end

            def obtain_variation_attributes_for_giftcard_products(variation_products)
                variation_attributes = { }
                product_type = variation_products.first.master_product.product_type

                if product_type == PRODUCT_TYPE_PHYSICAL_GC
                    sleeves = {}
                    variation_attributes = { "sleeve" => sleeves }

                    variation_products.each do |product_variant|
                        sleeves[product_variant.sleeve] = product_variant.sleeve
                    end
                end

                values = {}
                variation_attributes["value"] = values

                variation_products.each do |product_variant|
                    values[product_variant.get_product_price] = product_variant.get_product_price
                end

                return variation_attributes
            end

            def obtain_variation_attributes_for_products(variation_products)
                colors = obtain_color_variation_attribute_values variation_products
                sizes = obtain_size_variation_attribute_values variation_products
                image_variations = obtain_image_variation_attribute_values variation_products

                return {
                    "color" => colors,
                    "size" => sizes,
                    "image-variation" => image_variations
                }
            end

            def obtain_variation_attributes_for_kids_products(variation_products)
                colors = obtain_color_variation_attribute_values variation_products
                sizes = obtain_size_variation_attribute_values variation_products
                image_variations = obtain_image_variation_attribute_values variation_products
                size_charts = obtain_size_chart_variation_attribute_values variation_products

                return {
                    "color" => colors,
                    "sizeChart" => size_charts,
                    "size" => sizes,
                    "image-variation" => image_variations
                }
            end

            def obtain_size_chart_variation_attribute_values(variation_products)
                size_charts = {}

                variation_products.each do |product_variant|
                    size_chart = product_variant.size_chart
                    size_charts[size_chart] = size_chart
                end

                return size_charts
            end

            def obtain_color_variation_attribute_values(variation_products)
                colors = {}

                variation_products.each do |product_variant|
                    color = product_variant.color
                    unless color.blank? || colors.has_key?(color)
                        colors[color] = color.capitalize
                    end
                end

                return colors
            end

            def obtain_image_variation_attribute_values(variation_products)
                values = {}

                variation_products.each do |product_variant|
                    value = get_image_variation_value product_variant
                    unless value.blank? || values.has_key?(value)
                        values[value] = value
                    end
                end

                return values
            end

            def obtain_size_variation_attribute_values(variation_products)
                sizes = {}

                variation_products.each do |product_variant|
                    size = product_variant.size.to_s
                    unless size.blank? || sizes.has_key?(size)
                        formatted_size = get_formatted_size(product_variant)
                        sizes[formatted_size[SIZE_RAW_VALUE_ELEMENT]] = formatted_size[SIZE_DISPLAY_VALUE_ELEMENT]
                    end
                end

                return sizes
            end

            def get_manufacturer_sku(product)
                product.manufacturer_sku.blank? ? product.sku : product.manufacturer_sku
            end

            def get_formatted_size(variation_product)
                return {
                    SIZE_RAW_VALUE_ELEMENT => get_size_value(variation_product).to_s,
                    SIZE_DISPLAY_VALUE_ELEMENT => get_size_display(variation_product).to_s
                }
            end

            def get_size_value(variation_product)
                variation_product.size
            end

            def get_size_display(variation_product)
                get_chart_size_display(variation_product.size_chart, variation_product.size)
            end

            def create_product_variation_attributes(variations_builder, variation_attributes_info, has_color_slicing)
                variations_builder.attributes do |attributes_builder|
                    variation_attributes_info.each { |attribute_name, attribute_map|
                        attrs = { "attribute-id" => attribute_name, "variation-attribute-id" => attribute_name }

                        if attribute_name == 'color'
                            attrs['slicing-attribute'] = has_color_slicing.to_s
                        end

                        attributes_builder.tag! "variation-attribute", attrs do |variation_attribute_builder|
                            variation_attribute_builder.tag! "variation-attribute-values" do |variation_attributes_builder|
                                attribute_map.each { |attribute_item_value, attribute_item_name|
                                    variation_attributes_builder.tag!("variation-attribute-value", { "value" => attribute_item_value }) do |variation_attribute_name_builder|
                                        variation_attribute_name_builder.tag! "display-value", { "xml:lang" => "x-default" }, attribute_item_name
                                    end
                                }
                            end
                        end
                    }
                end
            end

            def build_variation_product_name(product_builder, variation_product)
                master_product = variation_product.master_product

                if master_product.giftcard?
                    product_builder.tag! "display-name", { "xml:lang" => "x-default" }, variation_product.get_variation_name
                end
            end

            def create_variants(variations_builder, product_variants)
                variations_builder.variants do |variants_builder|
                    product_variants.each do |product_variant|
                        variants_builder.tag! "variant", { "product-id" => product_variant.product_identifier }
                    end
                end
            end

            def get_gender(master_product)
                if master_product.gender.blank?
                    return ''
                end

                if master_product.gender.downcase == PRODUCT_GENDER_BOYS || master_product.gender.downcase == PRODUCT_GENDER_GIRLS
                    return PRODUCT_GENDER_KIDS.capitalize
                end

                return master_product.gender
            end

            def get_sub_gender(master_product)
                if master_product.gender.blank?
                    return ''
                end

                gender = master_product.gender.downcase

                if gender != PRODUCT_GENDER_KIDS && gender != PRODUCT_GENDER_BOYS && gender != PRODUCT_GENDER_GIRLS
                    return ''
                end

                if master_product.gender.downcase == PRODUCT_GENDER_KIDS
                    return PRODUCT_GENDER_UNISEX.capitalize
                end

                return master_product.gender
            end

        end

    end
end
