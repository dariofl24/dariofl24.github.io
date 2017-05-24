require 'active_record'

require 'converse/constants'
require 'converse/logging'
require 'converse/models/variation_product'
require 'converse/models/master_product'
require 'converse/models/product_price'
require 'converse/models/product_to_size_mapping'
require 'converse/models/merch_planner_info'
require 'converse/models/genesco_inventory_info'

class ProductsRepository
    include Converse::Constants
    include Converse::Logging

    def initialize(logger = nil)
        @logger = logger.nil? ? setup_logger(self.class) : logger
    end

    def get_aggregated_product_data
        @logger.info "Fetching aggregated products..."

        merchplanner_data = MerchPlannerInfo.quoted_table_name
        product_to_size_mapping = ProductToSizeMapping.quoted_table_name
        genesco_inventory = GenescoInventoryInfo.quoted_table_name

        aggregated_data = MerchPlannerInfo.find(
            :all,
            :select => " mp.*,
                         (CASE WHEN lower(mp.product_type) IN ('#{PRODUCT_TYPE_REGULAR}', '#{PRODUCT_TYPE_SHOWCASE}') THEN 'false' ELSE 'true' END) AS has_perpetual_inventory,
                         (CASE WHEN lower(mp.current_status) = 'online' THEN 1 ELSE 0 END) AS online,
                         pts.size,
                         gi.qty_on_hand,
                         gi.qty_on_po,
                         gi.expect_date,
                         gi.upc,
                         mp.preorder_date ",
            :from => " #{merchplanner_data} mp ",
            :joins => [
                        " LEFT JOIN #{product_to_size_mapping} pts ON mp.sku = pts.sku ",
                        " LEFT JOIN #{genesco_inventory} gi ON mp.sku = gi.sku and pts.size = gi.size "
                    ],
            :order => "mp.master_product_id,
                       (CASE WHEN lower(mp.product_type) IN ('#{PRODUCT_TYPE_REGULAR}', '#{PRODUCT_TYPE_SHOWCASE}') THEN mp.sku END),
                       pts.position,
                       cast(mp.price as decimal)"
        )

        filtered_products = []

        aggregated_data.each do |product_info|
            if passes_filter?(product_info)
                filtered_products << product_info
            end
        end

        return filtered_products
    end

    def get_us_products_with_prices
        get_products_with_prices('business_unit_id <> \'4\'')
    end

    def get_uk_products_with_prices
        get_products_with_prices('business_unit_id = \'4\'')
    end

    def get_products_with_prices(products_filter)
        @logger.info "Searching for variations..."

        result = []
        master_product_ids = []
        
        VariationProduct.joins(:master_product).find_each(
            :include => :product_price,
            :conditions => products_filter,
            :batch_size => 500
        ) do |variation_product|
            identifier = variation_product.product_identifier
            price = variation_product.product_price.price

            if should_override_variation_price?(price)
                next if master_product_ids.include? variation_product.master_product.product_identifier

                identifier = variation_product.master_product.product_identifier
                price = variation_product.master_product.price

                master_product_ids << variation_product.master_product.product_identifier
            end

            product = create_lightweight_product(identifier, price)
            result.push product
        end

        return result
    end

    def get_products_with_sale_prices(product_ids)
        @logger.info "Searching for products..."

        result = []

        VariationProduct.find_each(
            :batch_size => 500
        ) do |variation_product|
            if variation_exists_and_has_prices?(product_ids, variation_product)
                define_price_for_variation(result, variation_product)
            elsif master_product_exists?(product_ids, variation_product)
                redefine_prices_for_master_product(result, variation_product)
            end
        end

        return result
    end   

    def passes_filter?(product_info)
        product_type = product_info.product_type.downcase
        
        case product_type
            when PRODUCT_TYPE_REGULAR, PRODUCT_TYPE_SHOWCASE
                return has_color?(product_info)

            when PRODUCT_TYPE_DYO, PRODUCT_TYPE_PHYSICAL_GC, PRODUCT_TYPE_ELECTRONIC_GC
                return true
            else
                raise "Unsupported product type found: #{product_type}"
        end
    end

    def has_color?(product_info)
        !product_info.color.blank?
    end

    def variation_exists_and_has_prices?(product_ids, variation_product)
        product_exists?(product_ids, variation_product.sku) and variation_product.product_price != nil
    end

    def master_product_exists?(product_ids, variation_product)
        product_exists?(product_ids, variation_product.master_product.product_identifier)
    end

    def product_exists?(product_ids, product_id)
        product_ids.index(product_id) != nil
    end

    def should_override_variation_price?(price)
        price.blank? or price == 0
    end

    def create_lightweight_product(product_identifier, price, sku = nil, is_master_product = nil)
        return {
            :identifier => product_identifier,
            :sku => sku,
            :price => price,
            :is_master_product => is_master_product
        }
    end

    def create_lightweight_variation_product(product_identifier, price, sku)
        return create_lightweight_product(product_identifier, price, sku, false)
    end

    def create_lightweight_master_product(product_identifier, price)
        return create_lightweight_product(product_identifier, price, nil, true)
    end

    def redefine_prices_for_master_product(result, product)
        master_product_identifier = product.master_product.product_identifier
        master_product_sale_price = product.master_product.sale_price

        assert_price(master_product_sale_price, master_product_identifier)

        master_product = create_lightweight_master_product(product.master_product.product_identifier, master_product_sale_price)
        variation_product = create_lightweight_variation_product(product.product_identifier, master_product_sale_price, product.sku)

        unless already_in_result_set?(master_product_identifier, result)
            result.push master_product
        end
        
        result.push variation_product
    end

    def define_price_for_variation(result, product)
        assert_price(product.product_price.sale_price, product.sku)

        variation_product = create_lightweight_variation_product(product.product_identifier, product.product_price.sale_price, product.sku)
        result.push variation_product
    end

    def already_in_result_set?(product_identifier, result)
        result.any? { |lightweight_product| lightweight_product[:identifier] == product_identifier }
    end

    def assert_price(price, product_id)
        raise "Product with SKU (or master product ID) - #{product_id} has no SalePrice (or MasterSalePrice) defined" if price.blank?
    end
end
