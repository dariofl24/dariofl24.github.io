require_relative "support/spec_helper"

require "converse/export/product_catalog_syncer"

include Converse::Impex
include Converse::Constants

MASTER_PRICE = 35.00
MASTER_SALE_PRICE = 28.00

class ProductHelper


    def self.get_product_infos
        return [
            ProductInfo.new('136419C', 70, 0, 'Design Your Own Chuck Taylor All Star Glow', 'GLOW', 'Low', 'Unisex', 'Canvas', 'MP_292',
                            nil, nil, nil, 'CREATE', PRODUCT_TYPE_DYO,
                            'Chuck Size Chart', 'Runs a half-size large', nil, 'Active', 'chuTayOxCanGlow1205',
                            nil, nil, 'true', 1, nil, nil, nil, nil, 'default'),

            ProductInfo.new('137570C', 59, 0, 'Design Your Own Chuck Taylor All Star', 'Your Choice', 'Low', 'Unisex', 'Canvas', 'MP_292',
                            nil, nil, nil, 'CREATE', PRODUCT_TYPE_DYO,
                            nil, nil, nil, 'Active', 'chuTayOxCanCTCT1205_LS',
                            nil, nil, 'true', 1, nil, nil, nil, nil, 'default'),

            ProductInfo.new('137588C', 125, 99, 'Design Your Own Chuck Taylor All Star', 'Your Choice', 'Hi', 'Mens', 'Leather', 'MP_A614',
                            nil, nil, nil, 'CREATE', PRODUCT_TYPE_DYO,
                            'Chuck Size Chart', 'Runs a half-size large', nil, 'Active', nil,
                            nil, nil, 'true', 1, nil, nil, nil, nil, 'default'),

            ProductInfo.new('M9160', 55, 21.99, 'Chuck Taylor All Star', 'Black', 'Hi', 'Unisex', 'Canvas', 'MP_50',
                            nil, nil, nil, 'ALL STAR', PRODUCT_TYPE_REGULAR,
                            'Chuck Size Chart', 'Runs a half-size large', nil, 'Active', nil,
                            '000000', nil, 'false', 1, '035', 129, 0, nil, 'default'),

            ProductInfo.new('7S133', 37, 24.99, 'Jack Purcell', 'White', 'Low', 'Kids', 'Canvas', 'MP_205',
                            nil, nil, nil, 'JACK PURCELL', PRODUCT_TYPE_REGULAR,
                            'Kids - Toddler', 'Runs true to size', nil, 'Active', nil,
                            'f8f8f8', nil, 'false', 1, '100', -10, -4, nil, 'clothing'),

            ProductInfo.new('7S133', 37, 24.99, 'Jack Purcell', 'White', 'Low', 'Kids', 'Canvas', 'MP_205',
                            nil, nil, nil, 'JACK PURCELL', PRODUCT_TYPE_REGULAR,
                            'Kids - Toddler', 'Runs true to size', nil, 'Active', nil,
                            'f8f8f8', nil, 'false', 1, '060', 0, 10, '2013-03-05', 'clothing'),

            ProductInfo.new('7S133', 37, 24.99, 'Jack Purcell', 'White', 'Low', 'Kids', 'Canvas', 'MP_205',
                            nil, nil, nil, 'JACK PURCELL', PRODUCT_TYPE_REGULAR,
                            'Kids - Toddler', 'Runs true to size', 'Jack Purcell Kids shoe description.', 'Active', nil,
                            'f8f8f8', nil, 'false', 1, '020', 24, 0, nil, 'clothing'),

            ProductInfo.new('ec75cnv', 75, 0, 'Converse.com $75 Email Gift Cert', nil, nil, nil, nil, 'MP_A790',
                            nil, nil, nil, nil, PRODUCT_TYPE_ELECTRONIC_GC,
                            nil, nil, nil, 'Active', nil,
                            nil, nil, 'true', 1, nil, nil, nil, nil, 'default'),

            ProductInfo.new('ec40cnv', 40, 0, 'Converse.com $40 Email Gift Cert', nil, nil, nil, nil, 'MP_A792',
                            nil, nil, nil, nil, PRODUCT_TYPE_ELECTRONIC_GC,
                            nil, nil, nil, 'Active', nil,
                            nil, nil, 'true', 1, nil, nil, nil, nil, 'default'),

            ProductInfo.new('gc125dyo', 125, 0, 'Converse.com $125 Gift Card', nil, nil, nil, nil, 'MP_A806',
                            nil, nil, nil, nil, PRODUCT_TYPE_PHYSICAL_GC,
                            nil, nil, nil, 'Active', nil,
                            nil, nil, 'true', 1, 'One Size', 0, 0, nil, 'default'),

            ProductInfo.new('gc20dyo', 20, 0, 'Converse.com $20 Gift Card', nil, nil, nil, nil, 'MP_A757',
                            nil, nil, nil, nil, PRODUCT_TYPE_PHYSICAL_GC,
                            nil, nil, nil, 'Active', nil,
                            nil, nil, 'true', 1, nil, nil, nil, nil, 'default'),

            ProductInfo.new('137000C', 0, 0, 'CTAS Pro', 'Black', 'Low', 'Unisex', 'Canvas', 'MP_A909',
                            nil, nil, nil, nil, PRODUCT_TYPE_SHOWCASE,
                            nil, nil, nil, 'Active', nil,
                            nil, nil, 'false', 1, nil, nil, nil, nil, 'default'),

            ProductInfo.new('137002C', 0, 0, 'CTS', 'Red', 'Low', 'Unisex', 'Canvas', 'MP_A999',
                            nil, nil, nil, nil, PRODUCT_TYPE_SHOWCASE,
                            nil, nil, nil, 'Active', nil,
                            nil, nil, 'false', 1, nil, nil, nil, nil, 'default'),

            ProductInfo.new('117165', 0, 0, 'CTS', 'Black', 'Low', 'Unisex', 'Canvas', 'MP_A999',
                            nil, nil, nil, nil, PRODUCT_TYPE_SHOWCASE,
                            nil, nil, nil, 'Active', nil,
                            nil, nil, 'false', 1, nil, nil, nil, nil, 'default')
        ]
    end

    def self.get_product_infos_with_multiple_colors
        return [ProductInfo.new('732439F', 37, 0, 'Chuck Taylor All Star', 'Black/Amaranth Purple', 'Hi', 'Kids', 'Canvas', 'MP_A147',
                                nil, nil, nil, 'ALL STAR', PRODUCT_TYPE_REGULAR,
                                'Kids - Toddler', 'Runs a half-size large', nil, 'Active', nil,
                                nil, nil, 'false', 1, '040', 37, 0, nil, 'default')]
    end

    def self.get_product_infos_with_perpetual_inventory
        return {
            PRODUCT_TYPE_DYO =>
                ProductInfo.new('335529C', 45, 0, 'Design Your Own Chuck Taylor All Star', 'Your Choice', 'Low', 'Kids', 'Canvas', 'MP_292',
                                nil, nil, nil, 'CREATE', PRODUCT_TYPE_DYO,
                                'Kids-Youth', 'Runs a half-size large', nil, 'Active', 'chuTayOxCanYou1209',
                                nil, nil, 'true', 1, nil, nil, nil, nil, 'default'),

            PRODUCT_TYPE_PHYSICAL_GC =>
                ProductInfo.new('gc175cnv', 175, 0, 'Converse.com $175 Gift Card', nil, nil, nil, nil, 'MP_A800',
                                nil, nil, nil, nil, PRODUCT_TYPE_PHYSICAL_GC,
                                nil, nil, nil, 'Active', nil,
                                nil, nil, 'true', 1, nil, nil, nil, nil, 'default'),

            PRODUCT_TYPE_ELECTRONIC_GC =>
                ProductInfo.new('ec25cnv', 25, 0, 'Converse.com $25 Email Gift Cert', nil, nil, nil, nil, 'MP_A793',
                                nil, nil, nil, nil, PRODUCT_TYPE_ELECTRONIC_GC,
                                nil, nil, nil, 'Active', nil,
                                nil, nil, 'true', 1, nil, nil, nil, nil, 'default')
        }
    end

    def self.get_product_info_with_null_or_one_size
        return [
            ProductInfo.new('336584F', '32', '0', 'Chuck Taylor All Star', 'Neon Pink', 'Low', 'Kids', 'Textile', 'MP_1899',
                            nil, nil, nil, 'ALL STAR', PRODUCT_TYPE_REGULAR,
                            'Kids-Youth', 'Runs a half-size large', nil, 'Active', nil,
                            'FFAEB9', nil, 'false', 1, nil, nil, nil, nil, 'default'),

            ProductInfo.new('SA219955', '45', '0', 'Chuck Taylor Backpack', 'Exploded Star/Grey', nil, 'Unisex', nil, 'MP_A639',
                            nil, nil, nil, nil, PRODUCT_TYPE_REGULAR,
                            'Standard Size Chart', nil, nil, 'Active', nil,
                            nil, nil, 'false', 1, 'One Size', 12, 0, nil, 'default'),

            ProductInfo.new('2012100', '34', '0', 'Eagle V-Neck Tee', 'Bright White', nil, 'Womens', nil, 'MP_A644',
                            nil, nil, nil, nil, PRODUCT_TYPE_REGULAR,
                            'Standard Size Chart', nil, nil, 'Active', nil,
                            nil, nil, 'false', 1, 'os', nil, nil, nil, 'default'),

            ProductInfo.new('gc20Gft', '20', '0', 'Converse.com $20 Gift Card', nil, nil, nil, nil, 'MP_A803',
                            nil, nil, nil, nil, PRODUCT_TYPE_PHYSICAL_GC,
                            nil, nil, nil, 'Active', nil,
                            nil, nil, 'true', 1, nil, 0, 0, nil, 'default')
        ]
    end

    def self.get_product_info_with_various_on_hand_qty
        return [
            ProductInfo.new('7S133', 37, 24.99, 'Jack Purcell', 'White', 'Low', 'Kids', 'Canvas', 'MP_205',
                            nil, nil, nil, 'JACK PURCELL', PRODUCT_TYPE_REGULAR,
                            'Kids - Toddler', 'Runs true to size', nil, 'Active', nil,
                            'f8f8f8', nil, 'false', 1, '101', '-5', 10, '2013-03-05', 'default' ),

            ProductInfo.new('7S133', 37, 24.99, 'Jack Purcell', 'White', 'Low', 'Kids', 'Canvas', 'MP_205',
                            nil, nil, nil, 'JACK PURCELL', PRODUCT_TYPE_REGULAR,
                            'Kids - Toddler', 'Runs true to size', nil, 'Active', nil,
                            'f8f8f8', nil, 'false', 1, '102', 5, 10, '2013-03-05', 'default' ),

            ProductInfo.new('7S133', 37, 24.99, 'Jack Purcell', 'White', 'Low', 'Kids', 'Canvas', 'MP_205',
                            nil, nil, nil, 'JACK PURCELL', PRODUCT_TYPE_REGULAR,
                            'Kids - Toddler', 'Runs true to size', nil, 'Active', nil,
                            'f8f8f8', nil, 'false', 1, '103', -5, 10, '', 'default' ),

            ProductInfo.new('7S133', 37, 24.99, 'Jack Purcell', 'White', 'Low', 'Kids', 'Canvas', 'MP_205',
                            nil, nil, nil, 'JACK PURCELL', PRODUCT_TYPE_REGULAR,
                            'Kids - Toddler', 'Runs true to size', nil, 'Active', nil,
                            'f8f8f8', nil, 'false', 1, '104', -5, -9999, '2013-03-05', 'default' ),

            ProductInfo.new('7S133', 37, 24.99, 'Jack Purcell', 'White', 'Low', 'Kids', 'Canvas', 'MP_205',
                            nil, nil, nil, 'JACK PURCELL', PRODUCT_TYPE_REGULAR,
                            'Kids - Toddler', 'Runs true to size', nil, 'Active', nil,
                            'f8f8f8', nil, 'false', 1, '105', nil, 1, '2013-03-05', 'default' ),

            ProductInfo.new('7S133', 37, 24.99, 'Jack Purcell', 'White', 'Low', 'Kids', 'Canvas', 'MP_205',
                            nil, nil, nil, 'JACK PURCELL', PRODUCT_TYPE_REGULAR,
                            'Kids - Toddler', 'Runs true to size', nil, 'Active', nil,
                            'f8f8f8', nil, 'false', 1, '106', '', 1, '2013-03-05', 'default' ),

            ProductInfo.new('7S133', 37, 24.99, 'Jack Purcell', 'White', 'Low', 'Kids', 'Canvas', 'MP_205',
                            nil, nil, nil, 'JACK PURCELL', PRODUCT_TYPE_REGULAR,
                            'Kids - Toddler', 'Runs true to size', nil, 'Active', nil,
                            'f8f8f8', nil, 'false', 1, '107', -5, nil, '2013-03-05', 'default' ),

            ProductInfo.new('7S133', 37, 24.99, 'Jack Purcell', 'White', 'Low', 'Kids', 'Canvas', 'MP_205',
                            nil, nil, nil, 'JACK PURCELL', PRODUCT_TYPE_REGULAR,
                            'Kids - Toddler', 'Runs true to size', nil, 'Active', nil,
                            'f8f8f8', nil, 'false', 1, '108', -5, '', '2013-03-05', 'default' ),

            ProductInfo.new('7S133', 37, 24.99, 'Jack Purcell', 'White', 'Low', 'Kids', 'Canvas', 'MP_205',
                            nil, nil, nil, 'JACK PURCELL', PRODUCT_TYPE_REGULAR,
                            'Kids - Toddler', 'Runs true to size', nil, 'Active', nil,
                            'f8f8f8', nil, 'false', 1, '109', -5, 1,  nil, 'default'),

            ProductInfo.new('7S133', 37, 24.99, 'Jack Purcell', 'White', 'Low', 'Kids', 'Canvas', 'MP_205',
                            nil, nil, nil, 'JACK PURCELL', PRODUCT_TYPE_REGULAR,
                            'Kids - Toddler', 'Runs true to size', nil, 'Active', nil,
                            'f8f8f8', nil, 'false', 1, '110', -5, 1, '', 'default'),

            ProductInfo.new('7S133', 37, 24.99, 'Jack Purcell', 'White', 'Low', 'Kids', 'Canvas', 'MP_205',
                            nil, nil, nil, 'JACK PURCELL', PRODUCT_TYPE_REGULAR,
                            'Kids - Toddler', 'Runs true to size', nil, 'Active', nil,
                            'f8f8f8', nil, 'false', 1, '111', -2, 4, '2013-03-17', 'default'),

            ProductInfo.new('7S133', 37, 24.99, 'Jack Purcell', 'White', 'Low', 'Kids', 'Canvas', 'MP_205',
                            nil, nil, nil, 'JACK PURCELL', PRODUCT_TYPE_REGULAR,
                            'Kids - Toddler', 'Runs true to size', nil, 'Active', nil,
                            'f8f8f8', nil, 'false', 1, '112', 2, 4, '2013-03-17', 'default')
        ]
    end

    def self.create_persisted_variation_product(master_product_identifier, product_type, sku)
        master_product = MasterProduct.create({
            :product_identifier => master_product_identifier,
            :product_type => product_type
        })

        variation_product = master_product.variation_products.create({
            :product_identifier => sku,
            :sku => sku,
            :color => 'red',
            :size => '',
            :online => true
        })

        return variation_product
    end

    def self.get_product_infos_with_different_core_values
        return [
            ProductInfo.new('336584F', '32', '0', 'Chuck Taylor All Star', 'Neon Pink', 'Low', 'Kids', 'Textile', 'MP_1899',
                            nil, nil, nil, 'ALL STAR', PRODUCT_TYPE_REGULAR,
                            'Kids-Youth', 'Runs a half-size large', nil, 'Active', nil,
                            'FFAEB9', nil, 'false', 1, nil, nil, nil, nil, "Y", 'default'),

            ProductInfo.new('SA219955', '45', '0', 'Chuck Taylor Backpack', 'Exploded Star/Grey', nil, 'Unisex', nil, 'MP_A639',
                            nil, nil, nil, nil, PRODUCT_TYPE_REGULAR,
                            'Standard Size Chart', nil, nil, 'Active', nil,
                            nil, nil, 'false', 1, 'One Size', 12, 0, nil, "N", 'default'),

            ProductInfo.new('2012100', '34', '0', 'Eagle V-Neck Tee', 'Bright White', nil, 'Womens', nil, 'MP_A644',
                            nil, nil, nil, nil, PRODUCT_TYPE_REGULAR,
                            'Standard Size Chart', nil, nil, 'Active', nil,
                            nil, nil, 'false', 1, 'os', nil, nil, nil, nil, 'default')
        ]
    end
end

class ProductInfo
    attr_accessor :sku, :manufacturer_sku, :upc, :price, :sale_price, :product_name, :color, :cut, :gender, :material, :master_product_id,
                  :merch_planner_category, :pillar, :sleeve, :brand_segment, :product_type, :searchable_flag, :max_order_quantity, :show_if_out_of_stock, :out_of_stock_message,
                  :size_chart, :size_chart_messaging, :description, :current_status, :nike_product_id, :main_color_hex, :accent_color_hex,
                  :has_perpetual_inventory, :online, :online_from, :online_to, :size, :qty_on_hand, :qty_on_po,
                  :expect_date, :preorder_date, :core, :dyo_version_product_id, :dyo_version_inspiration_id, :instance_id, :inspiration_id,
                  :master_price, :master_sale_price, :product_page_title, :meta_keywords, :meta_description, :meta_search_text, :badging,
                  :business_unit_id, :color_slicing, :template

    def initialize(sku, price, sale_price, product_name, color, cut, gender, material, master_product_id,
                   merch_planner_category, pillar, sleeve, brand_segment, product_type,
                   size_chart, size_chart_messaging, description, current_status, nike_product_id,
                   main_color_hex, accent_color_hex, has_perpetual_inventory, online, size, qty_on_hand, qty_on_po, expect_date,
                   core = "Y", searchable_flag = true, preorder_date = "", max_order_quantity = "", show_if_out_of_stock=false, out_of_stock_message = "", dyo_version_product_id = "dyoVerProdId",
                   dyo_version_inspiration_id = "dyoVerInspProdId", instance_id = "instanceId1", inspiration_id = "inspirationId1", master_price = MASTER_PRICE,
                   master_sale_price = MASTER_SALE_PRICE, online_from = nil, online_to = nil, upc = nil, business_unit_id = "3", template)
        @sku = sku
        @manufacturer_sku = sku
        @upc = upc
        @price = price
        @sale_price = sale_price
        @master_price = master_price
        @master_sale_price = master_sale_price
        @product_name = product_name
        @searchable_flag = searchable_flag
        @color = color
        @cut = cut
        @gender = gender
        @material = material
        @master_product_id = master_product_id
        @merch_planner_category = merch_planner_category
        @pillar = pillar
        @sleeve = sleeve
        @brand_segment = brand_segment
        @product_type = product_type
        @size_chart = size_chart
        @size_chart_messaging = size_chart_messaging
        @description = description
        @current_status = current_status
        @nike_product_id = nike_product_id
        @main_color_hex = main_color_hex
        @accent_color_hex = accent_color_hex
        @has_perpetual_inventory = has_perpetual_inventory
        @online = online
        @online_from = online_from
        @online_to = online_to
        @size = size
        @qty_on_hand = qty_on_hand
        @qty_on_po = qty_on_po
        @expect_date = expect_date
        @preorder_date = preorder_date
        @max_order_quantity = max_order_quantity
        @show_if_out_of_stock = show_if_out_of_stock
        @out_of_stock_message = out_of_stock_message
        @core = core
        @dyo_version_product_id = dyo_version_product_id
        @dyo_version_inspiration_id = dyo_version_inspiration_id
        @instance_id = instance_id
        @inspiration_id = inspiration_id
        @business_unit_id = business_unit_id
        @color_slicing = false
        @template = template
    end
end

describe ProductCatalogSyncer do
    context "re-generate catalog data" do
        before do
            master = MasterProduct.create({
                :product_identifier => "A master id",
                :name => "A test name",
                :cut => "A test cut",
                :gender => "A test gender",
                :material => "A test material"
            })

            variation = master.variation_products.create({
                :product_identifier => "A variation id",
                :sku => "A test sku",
                :color => "A test color",
                :size => "A test size",
                :online => true
            })

            variation.product_price = ProductPrice.new({
                :price => 20,
                :sale_price => 13
            })

            variation.product_inventory = ProductInventory.new({
                :allocation => 12,
                :po_allocation => 0,
                :in_stock_date => ''
            })

            @product_catalog_syncer = Converse::Impex::ProductCatalogSyncer.new
        end

        it "should delete all product data present" do
            @product_catalog_syncer.cleanup_product_data

            MasterProduct.count.should eq(0)
            VariationProduct.count.should eq(0)
            ProductPrice.count.should eq(0)
            ProductInventory.count.should eq(0)
        end
    end

    context "master products generation" do
        before do
            @product_catalog_syncer = Converse::Impex::ProductCatalogSyncer.new
            @product_info_data = ProductHelper.get_product_infos
        end

        it "should create and persist master products having the product aggregated data provided" do
            @product_catalog_syncer.create_and_persist_master_products @product_info_data

            MasterProduct.count.should eq(10)

            master_product = MasterProduct.find_by_product_identifier('MP_292')
            master_product.name.should eq('Design Your Own Chuck Taylor All Star Glow')
            master_product.cut.should eq('Low')
            master_product.price.should eq(MASTER_PRICE)
            master_product.sale_price.should eq(MASTER_SALE_PRICE)
            master_product.gender.should eq('unisex')
            master_product.material.should eq('Canvas')
            master_product.product_type.should eq(PRODUCT_TYPE_DYO)
            master_product.brand_segment.should eq('create')
            master_product.nike_product_id.should eq('chuTayOxCanGlow1205')
            master_product.instance_id.should eq('instanceId1')
            master_product.inspiration_id.should eq('inspirationId1')
            master_product.business_unit_id.should eq('3')
            master_product.template.should eq('default')

            master_product = MasterProduct.find_by_product_identifier('MP_205')
            master_product.name.should eq('Jack Purcell')
            master_product.cut.should eq('Low')
            master_product.gender.should eq('kids')
            master_product.material.should eq('Canvas')
            master_product.product_type.should eq(PRODUCT_TYPE_REGULAR)
            master_product.brand_segment.should eq('jack-purcell')
            master_product.nike_product_id.should eq(nil)
            master_product.business_unit_id.should eq('3')
            master_product.template.should eq('clothing')
        end

        it "should return a hash map with master_product_id to master_product mapping" do
            master_products = @product_catalog_syncer.create_and_persist_master_products @product_info_data

            master_products.keys.size.should eq(10)

            master_products['MP_292'].product_identifier.should eq('MP_292')
            master_products['MP_205'].name.should eq('Jack Purcell')
            master_products['MP_A792'].product_type.should eq(PRODUCT_TYPE_ELECTRONIC_GC)
        end

        it "should persist master product with correct core values" do
            product_infos = ProductHelper.get_product_infos_with_different_core_values
            master_products = @product_catalog_syncer.create_and_persist_master_products product_infos

            master_product = MasterProduct.find_by_product_identifier('MP_1899')
            master_product.core.should eq(true)

            master_product = MasterProduct.find_by_product_identifier('MP_A639')
            master_product.core.should eq(false)

            master_product = MasterProduct.find_by_product_identifier('MP_A644')
            master_product.core.should eq(false)
        end

        it "should find the first non-empty description from all variants of a master product" do
            description = @product_catalog_syncer.get_description_for_master( @product_info_data, 'MP_205' )

            description.should eq('Jack Purcell Kids shoe description.')

        end

        it "should get an empty description if no descriptions found in any of the variants of a master product" do
            description = @product_catalog_syncer.get_description_for_master( @product_info_data, 'MP_50' )

            description.should eq('')

        end

    end

    context "variation products generation" do
        before do
            @product_catalog_syncer = Converse::Impex::ProductCatalogSyncer.new
            @product_info_data = ProductHelper.get_product_infos
        end

        it "should create and persist product variations with inventory and price information" do
            master_products = @product_catalog_syncer.create_and_persist_master_products @product_info_data

            @product_catalog_syncer.create_and_persist_variation_products @product_info_data, master_products

            VariationProduct.count.should eq(14)

            variation_product = VariationProduct.find_by_product_identifier('M9160_035')
            variation_product.sku.should eq('M9160')
            variation_product.color.should eq('black')
            variation_product.size.should eq('035')
            variation_product.online.should eq(true)
            variation_product.dyo_version_product_id.should eq('dyoVerProdId')
            variation_product.dyo_version_inspiration_id.should eq('dyoVerInspProdId')
            variation_product.size_chart.should eq('chuck')
            variation_product.size_chart_messaging.should eq('Runs a half-size large')
            variation_product.product_price.price.should eq(55)
            variation_product.product_price.sale_price.should eq(21.99)
            variation_product.product_inventory.allocation.should eq(129)
            variation_product.product_inventory.po_allocation.should eq(0)
            variation_product.product_inventory.in_stock_date.should eq(nil)

            # the product below has negative quantity values coming from the feed
            variation_product = VariationProduct.find_by_product_identifier('7S133_100')
            variation_product.product_inventory.allocation.should eq(0)
            variation_product.product_inventory.po_allocation.should eq(0)
            variation_product.size_chart.should eq('kids-toddler')
            variation_product.size_chart_messaging.should eq('Runs true to size')
        end


        it "should consider a product oversold if qty_on_hand is a negative number" do
            @product_catalog_syncer.oversold?(-1).should eq(true)
            @product_catalog_syncer.oversold?(0).should eq(false)
            @product_catalog_syncer.oversold?(1).should eq(false)
        end

        it "should consider a product backordered if qty_on_po is a positive number and in_stock_date is set" do
            def @product_catalog_syncer.current_date
                DateTime.strptime('2013-03-01', '%Y-%m-%d')
            end

            @product_catalog_syncer.backordered?(1, '2013-03-05').should eq true
            @product_catalog_syncer.backordered?(0, '2013-03-05').should eq false
            @product_catalog_syncer.backordered?(-1, '2013-03-05').should eq false

            @product_catalog_syncer.backordered?(1, '').should eq false
            @product_catalog_syncer.backordered?(0, '').should eq false
            @product_catalog_syncer.backordered?(-1, '').should eq false

            @product_catalog_syncer.backordered?(1, nil).should eq false
            @product_catalog_syncer.backordered?(0, nil).should eq false
            @product_catalog_syncer.backordered?(-1, nil).should eq false
        end

        it "should create and persist variation product that is oversold and on back order" do
            master_product = @product_catalog_syncer.create_and_persist_master_products ProductHelper.get_product_info_with_various_on_hand_qty
            @product_catalog_syncer.create_and_persist_variation_products ProductHelper.get_product_info_with_various_on_hand_qty, master_product

            variation_product = VariationProduct.find_by_product_identifier('7S133_101')
            variation_product.product_inventory.allocation.should eq(0)
            variation_product.product_inventory.po_allocation.should eq(0)
            variation_product.product_inventory.in_stock_date.should eq('2013-03-05')
        end

        it "should create and persist variation product that is not oversold but is backordered" do
            def @product_catalog_syncer.current_date
                DateTime.strptime('2013-03-01', '%Y-%m-%d')
            end

            master_product = @product_catalog_syncer.create_and_persist_master_products ProductHelper.get_product_info_with_various_on_hand_qty
            @product_catalog_syncer.create_and_persist_variation_products ProductHelper.get_product_info_with_various_on_hand_qty, master_product

            variation_product = VariationProduct.find_by_product_identifier('7S133_102')
            variation_product.product_inventory.allocation.should eq(5)
            variation_product.product_inventory.po_allocation.should eq(0)
            variation_product.product_inventory.in_stock_date.should eq('2013-03-05')
        end

        it "should create and persist variation product that is oversold but not backordered because in stock date is null" do
            master_product = @product_catalog_syncer.create_and_persist_master_products ProductHelper.get_product_info_with_various_on_hand_qty
            @product_catalog_syncer.create_and_persist_variation_products ProductHelper.get_product_info_with_various_on_hand_qty, master_product

            variation_product = VariationProduct.find_by_product_identifier('7S133_103')
            variation_product.product_inventory.allocation.should eq(0)
            variation_product.product_inventory.po_allocation.should eq(10)
            variation_product.product_inventory.in_stock_date.should eq(nil)
        end

        it "should create and persist variation product that is oversold but not back ordered because po_qty is <= 0" do
            master_product = @product_catalog_syncer.create_and_persist_master_products ProductHelper.get_product_info_with_various_on_hand_qty
            @product_catalog_syncer.create_and_persist_variation_products ProductHelper.get_product_info_with_various_on_hand_qty, master_product

            variation_product = VariationProduct.find_by_product_identifier('7S133_104')
            variation_product.product_inventory.allocation.should eq(0)
            variation_product.product_inventory.po_allocation.should eq(0)
            variation_product.product_inventory.in_stock_date.should eq('2013-03-05')
        end

        it "should create and persist variation product that is not oversold (on hand qty is nil) and is backordered" do
            master_product = @product_catalog_syncer.create_and_persist_master_products ProductHelper.get_product_info_with_various_on_hand_qty
            @product_catalog_syncer.create_and_persist_variation_products ProductHelper.get_product_info_with_various_on_hand_qty, master_product

            variation_product = VariationProduct.find_by_product_identifier('7S133_105')
            variation_product.product_inventory.allocation.should eq(0)
            variation_product.product_inventory.po_allocation.should eq(0)
            variation_product.product_inventory.in_stock_date.should eq('2013-03-05')
        end

        it "should create and persist variation product that is not oversold (on hand qty is blank) and is backordered" do
            master_product = @product_catalog_syncer.create_and_persist_master_products ProductHelper.get_product_info_with_various_on_hand_qty
            @product_catalog_syncer.create_and_persist_variation_products ProductHelper.get_product_info_with_various_on_hand_qty, master_product

            variation_product = VariationProduct.find_by_product_identifier('7S133_106')
            variation_product.product_inventory.allocation.should eq(0)
            variation_product.product_inventory.po_allocation.should eq(0)
            variation_product.product_inventory.in_stock_date.should eq('2013-03-05')
        end

        it "should create and persist variation product that is oversold and is not backordered because po_qty is nil" do
            master_product = @product_catalog_syncer.create_and_persist_master_products ProductHelper.get_product_info_with_various_on_hand_qty
            @product_catalog_syncer.create_and_persist_variation_products ProductHelper.get_product_info_with_various_on_hand_qty, master_product

            variation_product = VariationProduct.find_by_product_identifier('7S133_107')
            variation_product.product_inventory.allocation.should eq(0)
            variation_product.product_inventory.po_allocation.should eq(0)
            variation_product.product_inventory.in_stock_date.should eq('2013-03-05')
        end

        it "should create and persist variation product that is oversold but not backordered because po_qty is blank" do
            master_product = @product_catalog_syncer.create_and_persist_master_products ProductHelper.get_product_info_with_various_on_hand_qty
            @product_catalog_syncer.create_and_persist_variation_products ProductHelper.get_product_info_with_various_on_hand_qty, master_product

            variation_product = VariationProduct.find_by_product_identifier('7S133_108')
            variation_product.product_inventory.allocation.should eq(0)
            variation_product.product_inventory.po_allocation.should eq(0)
            variation_product.product_inventory.in_stock_date.should eq('2013-03-05')
        end

        it "should create and persist variation product that is oversold and is not backordered because in_stock_date is nil" do
            master_product = @product_catalog_syncer.create_and_persist_master_products ProductHelper.get_product_info_with_various_on_hand_qty
            @product_catalog_syncer.create_and_persist_variation_products ProductHelper.get_product_info_with_various_on_hand_qty, master_product

            variation_product = VariationProduct.find_by_product_identifier('7S133_109')
            variation_product.product_inventory.allocation.should eq(0)
            variation_product.product_inventory.po_allocation.should eq(1)
            variation_product.product_inventory.in_stock_date.should eq(nil)
        end

        it "should create and persist variation product that is oversold and is not backordered because in_stock_date is blank" do
            master_product = @product_catalog_syncer.create_and_persist_master_products ProductHelper.get_product_info_with_various_on_hand_qty
            @product_catalog_syncer.create_and_persist_variation_products ProductHelper.get_product_info_with_various_on_hand_qty, master_product

            variation_product = VariationProduct.find_by_product_identifier('7S133_110')
            variation_product.product_inventory.allocation.should eq(0)
            variation_product.product_inventory.po_allocation.should eq(1)
            variation_product.product_inventory.in_stock_date.should eq(nil)
        end

        it "should create and persist variation product that is oversold and is backordered, but back ordered date is more than 14 days away" do
            def @product_catalog_syncer.current_date
                DateTime.strptime('2013-03-01', '%Y-%m-%d')
            end

            master_product = @product_catalog_syncer.create_and_persist_master_products ProductHelper.get_product_info_with_various_on_hand_qty
            @product_catalog_syncer.create_and_persist_variation_products ProductHelper.get_product_info_with_various_on_hand_qty, master_product

            variation_product = VariationProduct.find_by_product_identifier('7S133_111')
            variation_product.product_inventory.allocation.should eq(0)
            variation_product.product_inventory.po_allocation.should eq(0)
            variation_product.product_inventory.in_stock_date.should eq('2013-03-17')
        end

        it "should create and persist variation product that has on hand and on PO, but back ordered date is more than 14 days away" do
            def @product_catalog_syncer.current_date
                DateTime.strptime('2013-03-01', '%Y-%m-%d')
            end

            master_product = @product_catalog_syncer.create_and_persist_master_products ProductHelper.get_product_info_with_various_on_hand_qty
            @product_catalog_syncer.create_and_persist_variation_products ProductHelper.get_product_info_with_various_on_hand_qty, master_product

            variation_product = VariationProduct.find_by_product_identifier('7S133_112')
            variation_product.product_inventory.allocation.should eq(2)
            variation_product.product_inventory.po_allocation.should eq(0)
            variation_product.product_inventory.in_stock_date.should eq('2013-03-17')
        end


        # TODO we should review how do we handler multiple colors for a product, for now we just pick the first one
        # to define the product variation.
        it "should persist the full color value even if it represents multiple colors at same time (i.e. red/green/blue)" do

            product_infos = ProductHelper.get_product_infos_with_multiple_colors

            master_products = @product_catalog_syncer.create_and_persist_master_products product_infos

            @product_catalog_syncer.create_and_persist_variation_products product_infos, master_products

            variation_product = VariationProduct.find_by_product_identifier('732439F_040')
            variation_product.color.should eq('black/amaranth purple')
        end

        it "should return 'One Size' for regular products with empty/null/'OS' sizes and 'nil' for gift cards" do
            master_product = MasterProduct.create({
                :product_identifier => "1",
                :name => "A test name",
                :cut => "A test cut",
                :gender => "A test gender",
                :material => "A test material"
            })

            ProductHelper.get_product_info_with_null_or_one_size.each do |variation_product|
                @product_catalog_syncer.persist_variation_product(master_product, variation_product)
            end

            variation_product = VariationProduct.find_by_product_identifier('336584F_ONE')
            variation_product.size.should eq('One Size')

            variation_product = VariationProduct.find_by_product_identifier('SA219955_ONE')
            variation_product.size.should eq('One Size')

            variation_product = VariationProduct.find_by_product_identifier('2012100_ONE')
            variation_product.size.should eq('One Size')

            variation_product = VariationProduct.find_by_product_identifier('gc20Gft')
            variation_product.size.should eq('One Size')
        end

        it "should persist physical/electronic giftcards and DYO products as having perpetual inventory" do
            dyo_sku = '335529C'
            physicalgc_sku = 'gc175cnv'
            electronicgc_sku = 'ec25cnv'

            product_infos = ProductHelper.get_product_infos_with_perpetual_inventory

            dyo_product_info = product_infos[PRODUCT_TYPE_DYO]
            pgc_product_info = product_infos[PRODUCT_TYPE_PHYSICAL_GC]
            egc_product_info = product_infos[PRODUCT_TYPE_ELECTRONIC_GC]

            dyo_variation_product = ProductHelper.create_persisted_variation_product('MP_A147', PRODUCT_TYPE_DYO, dyo_sku)
            gc_variation_product = ProductHelper.create_persisted_variation_product('MP_A800', PRODUCT_TYPE_PHYSICAL_GC, physicalgc_sku)
            egc_variation_product = ProductHelper.create_persisted_variation_product('MP_A793', PRODUCT_TYPE_ELECTRONIC_GC, electronicgc_sku)

            @product_catalog_syncer.add_inventory(dyo_variation_product, dyo_product_info)
            @product_catalog_syncer.add_inventory(gc_variation_product, pgc_product_info)
            @product_catalog_syncer.add_inventory(egc_variation_product, egc_product_info)

            variation_product = VariationProduct.find_by_product_identifier(dyo_sku)
            variation_product.product_inventory.perpetual.should eq(true)

            variation_product = VariationProduct.find_by_product_identifier(physicalgc_sku)
            variation_product.product_inventory.perpetual.should eq(true)

            variation_product = VariationProduct.find_by_product_identifier(electronicgc_sku)
            variation_product.product_inventory.perpetual.should eq(true)
        end

        it "should create and persist variation product with searchable_flag" do
            get_product_infos_with_searchable_flag = [
                ProductInfo.new('136420C', 70, 0, 'Design Your Own Chuck Taylor All Star Glow', 'GLOW', 'Low', 'Unisex', 'Canvas', 'MP_292',
                                nil, nil, nil, 'CREATE', PRODUCT_TYPE_DYO,
                                'Chuck Size Chart', 'Runs a half-size large', nil, 'Active', 'chuTayOxCanGlow1205',
                                nil, nil, 'true', 1, nil, nil, nil, nil, nil, true, 'default'),

                ProductInfo.new('136421C', 70, 0, 'Design Your Own Chuck Taylor All Star Glow', 'GLOW', 'Low', 'Unisex', 'Canvas', 'MP_292',
                                nil, nil, nil, 'CREATE', PRODUCT_TYPE_DYO,
                                'Chuck Size Chart', 'Runs a half-size large', nil, 'Active', 'chuTayOxCanGlow1205',
                                nil, nil, 'true', 1, nil, nil, nil, nil, nil, false, 'default')
            ]
            master_product = @product_catalog_syncer.create_and_persist_master_products get_product_infos_with_searchable_flag
            @product_catalog_syncer.create_and_persist_variation_products get_product_infos_with_searchable_flag, master_product

            master_product = MasterProduct.find_by_product_identifier('MP_292')
            variation_product_with_true_flag = VariationProduct.find_by_product_identifier('136420C')
            variation_product_with_false_flag = VariationProduct.find_by_product_identifier('136421C')

            master_product.searchable_flag.should eq(true)
            variation_product_with_true_flag.searchable_flag.should eq(true)
            variation_product_with_false_flag.searchable_flag.should eq(false)
        end

        it "should have searchable_flag true when at least one variation has searchable_flag true and smallest variation is false" do
            get_product_infos_with_searchable_flag = [
                ProductInfo.new('136419C', 70, 0, 'Design Your Own Chuck Taylor All Star Glow', 'GLOW', 'Low', 'Unisex', 'Canvas', 'MP_292',
                                nil, nil, nil, 'CREATE', PRODUCT_TYPE_DYO,
                                'Chuck Size Chart', 'Runs a half-size large', nil, 'Active', 'chuTayOxCanGlow1205',
                                nil, nil, 'true', 1, nil, nil, nil, nil, nil, false, 'default'),

                ProductInfo.new('136420C', 70, 0, 'Design Your Own Chuck Taylor All Star Glow', 'GLOW', 'Low', 'Unisex', 'Canvas', 'MP_292',
                                nil, nil, nil, 'CREATE', PRODUCT_TYPE_DYO,
                                'Chuck Size Chart', 'Runs a half-size large', nil, 'Active', 'chuTayOxCanGlow1205',
                                nil, nil, 'true', 1, nil, nil, nil, nil, nil, true, 'default')
            ]
            master_product = @product_catalog_syncer.create_and_persist_master_products get_product_infos_with_searchable_flag

            master_product = MasterProduct.find_by_product_identifier('MP_292')

            master_product.searchable_flag.should eq(true)
        end

        it "should have searchable_flag false when all variations have searchable_flag false" do
            get_product_infos_with_searchable_flag = [
                ProductInfo.new('136419C', 70, 0, 'Design Your Own Chuck Taylor All Star Glow', 'GLOW', 'Low', 'Unisex', 'Canvas', 'MP_292',
                                nil, nil, nil, 'CREATE', PRODUCT_TYPE_DYO,
                                'Chuck Size Chart', 'Runs a half-size large', nil, 'Active', 'chuTayOxCanGlow1205',
                                nil, nil, 'true', 1, nil, nil, nil, nil, nil, false, 'default'),

                ProductInfo.new('136420C', 70, 0, 'Design Your Own Chuck Taylor All Star Glow', 'GLOW', 'Low', 'Unisex', 'Canvas', 'MP_292',
                                nil, nil, nil, 'CREATE', PRODUCT_TYPE_DYO,
                                'Chuck Size Chart', 'Runs a half-size large', nil, 'Active', 'chuTayOxCanGlow1205',
                                nil, nil, 'true', 1, nil, nil, nil, nil, nil, false, 'default')
            ]
            master_product = @product_catalog_syncer.create_and_persist_master_products get_product_infos_with_searchable_flag

            master_product = MasterProduct.find_by_product_identifier('MP_292')

            master_product.searchable_flag.should eq(false)
        end

        it "should create a product with preorder_date" do
          get_product_info_preorder_date = [
            ProductInfo.new('7S133', 37, 24.99, 'Jack Purcell', 'White', 'Low', 'Kids', 'Canvas', 'MP_205',
            nil, nil, nil, 'JACK PURCELL', PRODUCT_TYPE_REGULAR,
            'Kids - Toddler', 'Runs true to size', nil, 'Active', nil,
            'f8f8f8', nil, 'false', 1, '101', '-5', 10, '2013-03-05', nil, nil, '2013-03-06', 'default' )
          ]

          master_product = @product_catalog_syncer.create_and_persist_master_products get_product_info_preorder_date
          @product_catalog_syncer.create_and_persist_variation_products get_product_info_preorder_date, master_product

          variation_product = VariationProduct.find_by_product_identifier('7S133_101')
          variation_product.product_inventory.preorder_backorder.should eq('preorder')
          variation_product.product_inventory.po_allocation.should eq(10)
          variation_product.product_inventory.in_stock_date.should eq('2013-03-06')
        end

        it "should create a product with max_order_quantity blank" do
          get_product_info_max_order_quantity = [
            ProductInfo.new('7S133', 37, 24.99, 'Jack Purcell', 'White', 'Low', 'Kids', 'Canvas', 'MP_205',
            nil, nil, nil, 'JACK PURCELL', PRODUCT_TYPE_REGULAR,
            'Kids - Toddler', 'Runs true to size', nil, 'Active', nil,
            'f8f8f8', nil, 'false', 1, '101', nil, nil, nil, nil, nil, nil, "", 'default' )
          ]

          master_product = @product_catalog_syncer.create_and_persist_master_products get_product_info_max_order_quantity
          @product_catalog_syncer.create_and_persist_variation_products get_product_info_max_order_quantity, master_product

          variation_product = VariationProduct.find_by_product_identifier('7S133_101')
          variation_product.max_order_quantity.should eq(nil)
        end

        it "should create a product with max_order_quantity not number" do
          get_product_info_max_order_quantity = [
            ProductInfo.new('7S133', 37, 24.99, 'Jack Purcell', 'White', 'Low', 'Kids', 'Canvas', 'MP_205',
            nil, nil, nil, 'JACK PURCELL', PRODUCT_TYPE_REGULAR,
            'Kids - Toddler', 'Runs true to size', nil, 'Active', nil,
            'f8f8f8', nil, 'false', 1, '101', nil, nil, nil, nil, nil, nil, "n", 'default' )
          ]

          master_product = @product_catalog_syncer.create_and_persist_master_products get_product_info_max_order_quantity
          @product_catalog_syncer.create_and_persist_variation_products get_product_info_max_order_quantity, master_product

          variation_product = VariationProduct.find_by_product_identifier('7S133_101')

          variation_product.max_order_quantity.should eq(nil)
        end

        it "should create a product with max_order_quantity" do
          get_product_info_max_order_quantity = [
            ProductInfo.new('7S133', 37, 24.99, 'Jack Purcell', 'White', 'Low', 'Kids', 'Canvas', 'MP_205',
            nil, nil, nil, 'JACK PURCELL', PRODUCT_TYPE_REGULAR,
            'Kids - Toddler', 'Runs true to size', nil, 'Active', nil,
            'f8f8f8', nil, 'false', 1, '101', nil, nil, nil, nil, nil, nil, "7", 'default' )
          ]

          master_product = @product_catalog_syncer.create_and_persist_master_products get_product_info_max_order_quantity
          @product_catalog_syncer.create_and_persist_variation_products get_product_info_max_order_quantity, master_product

          variation_product = VariationProduct.find_by_product_identifier('7S133_101')

          variation_product.max_order_quantity.should eq(7)
        end

        it "should create a product with show_if_out_of_stock false" do
          get_product_info_max_order_quantity = [
            ProductInfo.new('7S133', 37, 24.99, 'Jack Purcell', 'White', 'Low', 'Kids', 'Canvas', 'MP_205',
            nil, nil, nil, 'JACK PURCELL', PRODUCT_TYPE_REGULAR,
            'Kids - Toddler', 'Runs true to size', nil, 'Active', nil,
            'f8f8f8', nil, 'false', 1, '101', nil, nil, nil, nil, nil, nil, nil, "N", "Out Of Stock Message", 'default' )
          ]

          master_product = @product_catalog_syncer.create_and_persist_master_products get_product_info_max_order_quantity
          @product_catalog_syncer.create_and_persist_variation_products get_product_info_max_order_quantity, master_product

          variation_product = VariationProduct.find_by_product_identifier('7S133_101')

          variation_product.show_if_out_of_stock.should eq(false)
        end

        it "should create a product with show_if_out_of_stock true" do
          get_product_info_max_order_quantity = [
            ProductInfo.new('7S133', 37, 24.99, 'Jack Purcell', 'White', 'Low', 'Kids', 'Canvas', 'MP_205',
            nil, nil, nil, 'JACK PURCELL', PRODUCT_TYPE_REGULAR,
            'Kids - Toddler', 'Runs true to size', nil, 'Active', nil,
            'f8f8f8', nil, 'false', 1, '101', nil, nil, nil, nil, nil, nil, nil, "Y", "Out Of Stock Message", 'default' )
          ]

          master_product = @product_catalog_syncer.create_and_persist_master_products get_product_info_max_order_quantity
          @product_catalog_syncer.create_and_persist_variation_products get_product_info_max_order_quantity, master_product

          variation_product = VariationProduct.find_by_product_identifier('7S133_101')

          variation_product.show_if_out_of_stock.should eq(true)
        end

        it "should create a product with out_of_stock_message" do
          get_product_info_max_order_quantity = [
            ProductInfo.new('7S133', 37, 24.99, 'Jack Purcell', 'White', 'Low', 'Kids', 'Canvas', 'MP_205',
            nil, nil, nil, 'JACK PURCELL', PRODUCT_TYPE_REGULAR,
            'Kids - Toddler', 'Runs true to size', nil, 'Active', nil,
            'f8f8f8', nil, 'false', 1, '101', nil, nil, nil, nil, nil, nil, nil, nil, "Out Of Stock Message", 'default' )
          ]

          master_product = @product_catalog_syncer.create_and_persist_master_products get_product_info_max_order_quantity
          @product_catalog_syncer.create_and_persist_variation_products get_product_info_max_order_quantity, master_product

          variation_product = VariationProduct.find_by_product_identifier('7S133_101')

          variation_product.out_of_stock_message.should eq("Out Of Stock Message")
        end
    end

    context "inventory calculation" do
        before do
            @product_catalog_syncer = Converse::Impex::ProductCatalogSyncer.new
        end

    end
 end
