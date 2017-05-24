require 'rubygems'

require 'converse/constants'
require 'converse/logging'
require 'converse/utils'
require 'converse/models/genesco_inventory_info'
require 'converse/models/product_inventory'
require 'converse/models/variation_product'
require 'converse/models/master_product'
require 'converse/products_repository.rb'

module Converse
    module Impex

        class ProductCatalogSyncer
            include Converse::Constants
            include Converse::Logging
            include Converse::Utils

            BACKORDERED_THRESHOLD_IN_DAYS = 14

            def initialize(logger = nil)
                @logger = logger.nil? ? setup_logger(self.class) : logger
                @products_repository = ProductsRepository.new @logger
            end

            def run
                all_products_info = @products_repository.get_aggregated_product_data

                ActiveRecord::Base.transaction do
                    cleanup_product_data
                    master_products = create_and_persist_master_products all_products_info
                    create_and_persist_variation_products all_products_info, master_products
                end
            end

            def cleanup_product_data
                @logger.info "Cleaning up product data..."
                ProductPrice.delete_all_and_reset_pk
                ProductInventory.delete_all_and_reset_pk
                VariationProduct.delete_all_and_reset_pk
                MasterProduct.delete_all_and_reset_pk
                @logger.info "Product data cleaned up"
            end

            def create_and_persist_master_products(all_products_info)
                @logger.info "Creating master products..."

                master_products = {}

                all_products_info.each do |product_info|
                    key = product_info.master_product_id

                    unless master_products.key?(key)
                        persisted_master = MasterProduct.create(
                            :product_identifier => key,
                            :name => product_info.product_name,
                            :searchable_flag => product_info.searchable_flag,
                            :cut => product_info.cut,
                            :gender => get_product_gender(product_info),
                            :material => product_info.material,
                            :merch_planner_category => product_info.merch_planner_category,
                            :pillar => product_info.pillar,
                            :brand_segment => get_product_brand_segment(product_info),
                            :product_type => get_product_type(product_info),
                            :description => get_description_for_master(all_products_info, key),
                            :nike_product_id => product_info.nike_product_id,
                            :core => get_product_core(product_info),
                            :instance_id => product_info.instance_id,
                            :inspiration_id => product_info.inspiration_id,
                            :price => product_info.master_price,
                            :sale_price => product_info.master_sale_price,
                            :business_unit_id => product_info.business_unit_id,
                            :color_slicing => product_info.color_slicing,
                            :template => product_info.template
                        )
                        master_products[key] = persisted_master
                    end
                    if !master_products[key].searchable_flag && product_info.searchable_flag
                      id = MasterProduct.find_by_product_identifier(key).id
                      MasterProduct.update(id, :searchable_flag => true)
                    end
                end

                return master_products
            end

            def create_and_persist_variation_products(all_products_info, master_products)
                @logger.info "Creating variation products..."

                master_products.each_pair do |master_product_id, master_product|
                    variation_products_info = get_variation_products_info_for_master(all_products_info, master_product_id)

                    variation_products_info.each do |variation_product_info|
                        persisted_variation_product = persist_variation_product master_product, variation_product_info
                        add_price persisted_variation_product, variation_product_info
                        add_inventory persisted_variation_product, variation_product_info
                    end
                end
            end

            def persist_variation_product(master_product, variation_product_info)
                return master_product.variation_products.create({
                            :product_identifier => generate_product_identifier(variation_product_info),
                            :sku => variation_product_info.sku,
                            :manufacturer_sku => variation_product_info.manufacturer_sku,
                            :searchable_flag => variation_product_info.searchable_flag,
                            :upc => blank_to_nil(variation_product_info.upc),
                            :color => get_product_color(variation_product_info),
                            :size => get_product_size(variation_product_info, true),
                            :online => variation_product_info.online,
                            :online_from => string_to_date_time(variation_product_info.online_from),
                            :online_to => string_to_date_time(variation_product_info.online_to),
                            :main_color_hex => variation_product_info.main_color_hex,
                            :accent_color_hex => variation_product_info.accent_color_hex,
                            :sleeve => variation_product_info.sleeve,
                            :dyo_version_product_id => variation_product_info.dyo_version_product_id,
                            :dyo_version_inspiration_id => variation_product_info.dyo_version_inspiration_id,
                            :page_title => variation_product_info.product_page_title,
                            :page_keywords => variation_product_info.meta_keywords,
                            :page_description => variation_product_info.meta_description,
                            :meta_search_text => variation_product_info.meta_search_text,
                            :badging => variation_product_info.badging,
                            :size_chart => get_product_size_chart(variation_product_info),
                            :size_chart_messaging => variation_product_info.size_chart_messaging,
                            :preorder_backorder => variation_product_info.preorder_date,
                            :max_order_quantity => get_max_order_quantity(variation_product_info.max_order_quantity),
                            :show_if_out_of_stock => string_to_boolean(variation_product_info.show_if_out_of_stock),
                            :out_of_stock_message => variation_product_info.out_of_stock_message
                })
            end

            def add_price(persisted_variation_product, variation_product_info)
                persisted_variation_product.product_price = ProductPrice.new({
                            :price => variation_product_info.price,
                            :sale_price => variation_product_info.sale_price
                })
            end

            def current_date
                DateTime.now
            end

            def backordered?(qty_on_po, in_stock_date)
                qty_on_po > 0 && !in_stock_date.blank?
            end

            def get_qty_on_po(qty_on_po, in_stock_date)
                result = qty_on_po

                if backordered?(qty_on_po, in_stock_date)
                    backordered_date = /^[01]?\d\/[0123]?\d\/\d{2}$/ =~ in_stock_date ? string_to_short_date_time(in_stock_date, '%m/%d/%y') : string_to_short_date_time(in_stock_date)
                    days_diff = (backordered_date - current_date).to_i

                    if days_diff > 0 && days_diff > BACKORDERED_THRESHOLD_IN_DAYS
                        result = 0
                    end
                end

                return result
            end

            def oversold?(qty_on_hand)
                qty_on_hand < 0
            end

            def add_inventory(persisted_variation_product, variation_product_info)
                if variation_product_info.has_perpetual_inventory.downcase == 'true'
                    persisted_variation_product.product_inventory = ProductInventory.new({
                                :allocation => 0,
                                :perpetual => true
                    })
                else
                    in_stock_date = blank_to_nil(variation_product_info.preorder_date) || blank_to_nil(variation_product_info.expect_date)
                    qty_on_hand = variation_product_info.qty_on_hand.to_i
                    qty_on_po = get_qty_on_po(variation_product_info.qty_on_po.to_i, in_stock_date)

                    if !variation_product_info.preorder_date.nil? && !variation_product_info.preorder_date.empty?
                      preorder_backorder = "preorder"
                    elsif backordered?(qty_on_po, in_stock_date)
                      qty_on_po = 0
                    end

                    persisted_variation_product.product_inventory = ProductInventory.new({
                                :allocation => ensure_positive_integer(qty_on_hand),
                                :po_allocation => ensure_positive_integer(qty_on_po),
                                :in_stock_date => in_stock_date,
                                :preorder_backorder => preorder_backorder
                    })
                end
            end

            def get_variation_products_info_for_master(all_products_info, master_product_id)
                return all_products_info.select { |item| item.master_product_id == master_product_id }
            end

            def get_description_for_master(all_products_info, master_product_id)
                description = ''
                variation_products = get_variation_products_info_for_master( all_products_info, master_product_id )
                variation_products.each { |variation_product|
                    unless variation_product.description.blank?
                        description = variation_product.description
                        break
                    end
                }
                return description
            end

            def generate_product_identifier(variation_product_info)
                product_type = variation_product_info.product_type.downcase
                if product_type == PRODUCT_TYPE_REGULAR || product_type == PRODUCT_TYPE_SHOWCASE
                    return "#{variation_product_info.sku}_#{get_product_size(variation_product_info, false)}"
                end
                return "#{variation_product_info.sku}"
            end

            def get_product_gender(product_info)
                safe_downcase(product_info.gender)
            end

            def get_product_type(product_info)
                safe_downcase(product_info.product_type)
            end

            def get_product_brand_segment(product_info)
                brand_segment = product_info.brand_segment
                unless brand_segment.blank?
                    brand_segment = normalize_enum_value(brand_segment)
                end
                return brand_segment
            end

            def get_product_size_chart(product_info)
                size_chart = product_info.size_chart
                unless size_chart.blank?
                    size_chart = normalize_enum_value(size_chart)
                    size_chart = size_chart.chomp('-size-chart')
                end
                return size_chart
            end

            def get_product_color(product_info)
                color = product_info.color
                unless color.blank?
                    color = safe_downcase(color)
                end
                return color
            end

            def get_product_size(product_info, display)
                size = product_info.size
                if size.blank? || size.downcase == 'os' || size.downcase == 'one size'
                    size = display ? 'One Size' : 'ONE'
                end
                return size
            end

            def get_product_core(product_info)
                core = product_info.core
                unless core.blank?
                    return core.strip.downcase == "y"
                end
                return false
            end

            def get_max_order_quantity(max_order_quantity)
                max_order_quantity.to_i if max_order_quantity.match(/^-?\d+$/) unless max_order_quantity.nil?
            end
        end
    end
end
