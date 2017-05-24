require_relative "support/spec_helper"

require "converse/models/merch_planner_info"
require "converse/models/genesco_inventory_info"
require "converse/products_repository"
require 'converse/models/product_price'

include Converse::Constants

describe ProductsRepository do
    context 'aggregated product info generation' do
        before do
            @products_repository = ProductsRepository.new
        end

        it 'regular products should be included only if they have both inventory and color and should have their perpetual flag set to false' do
            # no inventory, no color
            MerchPlannerInfo.create({
                :sku => 'M9161',
                :pillar => PILLAR_SNEAKERS,
                :product_type => PRODUCT_TYPE_REGULAR
            })

            # no inventory, color is null
            MerchPlannerInfo.create({
                :sku => 'M9162',
                :pillar => PILLAR_SNEAKERS,
                :product_type => PRODUCT_TYPE_REGULAR,
                :color => nil
            })

            # no inventory, color is empty
            MerchPlannerInfo.create({
                :sku => 'M9163',
                :pillar => PILLAR_SNEAKERS,
                :product_type => PRODUCT_TYPE_REGULAR,
                :color => ''
            })

            # no inventory, has color
            MerchPlannerInfo.create({
                :sku => 'M9164',
                :pillar => PILLAR_SNEAKERS,
                :product_type => PRODUCT_TYPE_REGULAR,
                :color => 'black'
            })

            # has inventory without size, has color
            MerchPlannerInfo.create({
                :sku => 'M9165',
                :pillar => PILLAR_SNEAKERS,
                :product_type => PRODUCT_TYPE_REGULAR,
                :color => 'red'
            })

            GenescoInventoryInfo.create({
                :sku => 'M9165'
            })

            # has inventory with null size, has color
            MerchPlannerInfo.create({
                :sku => 'M9166',
                :pillar => PILLAR_SNEAKERS,
                :product_type => PRODUCT_TYPE_REGULAR,
                :color => 'blue'
            })

            GenescoInventoryInfo.create({
                :sku => 'M9166',
                :size => nil
            })

            # has inventory with empty size, has color
            MerchPlannerInfo.create({
                :sku => 'M9167',
                :pillar => PILLAR_SNEAKERS,
                :product_type => PRODUCT_TYPE_REGULAR,
                :color => 'green'
            })

            GenescoInventoryInfo.create({
                :sku => 'M9167',
                :size => ''
            })

            # has inventory with size, has color
            MerchPlannerInfo.create({
                :sku => 'M9168',
                :pillar => PILLAR_SNEAKERS,
                :product_type => PRODUCT_TYPE_REGULAR,
                :color => 'yellow'
            })

            GenescoInventoryInfo.create({
                :sku => 'M9168',
                :size => '110'
            })

            @aggregated_product_info = @products_repository.get_aggregated_product_data

            @aggregated_product_info.size.should eq(5)

            product_info = @aggregated_product_info.first
            product_info.sku.should eq('M9164')
            product_info.color.should eq('black')
            product_info.has_perpetual_inventory.should eq('false')
            product_info.product_type.should eq(PRODUCT_TYPE_REGULAR)
        end

        it 'showcase products should be included only if they have color and should have their perpetual flag set to false' do
            # no inventory, no color
            MerchPlannerInfo.create({
                :sku => 'M9171',
                :pillar => PILLAR_SNEAKERS,
                :product_type => PRODUCT_TYPE_SHOWCASE
            })

            # no inventory, color is null
            MerchPlannerInfo.create({
                :sku => 'M9172',
                :pillar => PILLAR_SNEAKERS,
                :product_type => PRODUCT_TYPE_SHOWCASE,
                :color => nil
            })

            # no inventory, color is empty
            MerchPlannerInfo.create({
                :sku => 'M9173',
                :pillar => PILLAR_SNEAKERS,
                :product_type => PRODUCT_TYPE_SHOWCASE,
                :color => ''
            })

            # no inventory, has color
            MerchPlannerInfo.create({
                :sku => 'M9174',
                :pillar => PILLAR_SNEAKERS,
                :product_type => PRODUCT_TYPE_SHOWCASE,
                :color => 'black'
            })

            # has inventory without size, has color
            MerchPlannerInfo.create({
                :sku => 'M9175',
                :pillar => PILLAR_SNEAKERS,
                :product_type => PRODUCT_TYPE_SHOWCASE,
                :color => 'red'
            })

            GenescoInventoryInfo.create({
                :sku => 'M9175'
            })

            # has inventory with null size, has color
            MerchPlannerInfo.create({
                :sku => 'M9176',
                :pillar => PILLAR_SNEAKERS,
                :product_type => PRODUCT_TYPE_SHOWCASE,
                :color => 'blue'
            })

            GenescoInventoryInfo.create({
                :sku => 'M9176',
                :size => nil
            })

            # has inventory with empty size, has color
            MerchPlannerInfo.create({
                :sku => 'M9177',
                :pillar => PILLAR_SNEAKERS,
                :product_type => PRODUCT_TYPE_SHOWCASE,
                :color => 'green'
            })

            GenescoInventoryInfo.create({
                :sku => 'M9177',
                :size => ''
            })

            # has inventory with size, has color
            MerchPlannerInfo.create({
                :sku => 'M9178',
                :pillar => PILLAR_SNEAKERS,
                :product_type => PRODUCT_TYPE_SHOWCASE,
                :color => 'yellow'
            })

            GenescoInventoryInfo.create({
                :sku => 'M9178',
                :size => '110'
            })

            @aggregated_product_info = @products_repository.get_aggregated_product_data

            @aggregated_product_info.size.should eq(5)

            product_info = @aggregated_product_info.find { |product_info| product_info.sku == 'M9174' }
            product_info.sku.should eq('M9174')
            product_info.color.should eq('black')
            product_info.size.should eq(nil)
            product_info.has_perpetual_inventory.should eq('false')
            product_info.product_type.should eq(PRODUCT_TYPE_SHOWCASE)

            product_infos = @aggregated_product_info.find_all { |product_info| %w(M9174 M9175 M9176 M9177 M9178).include? product_info.sku }
            product_infos.each do |product_info|
                product_info.color.should_not eq('')
                product_info.color.should_not eq(nil)
                product_info.has_perpetual_inventory.should eq('false')
                product_info.product_type.should eq(PRODUCT_TYPE_SHOWCASE)
            end
        end

        it 'products for which pillar==accessories and have color should be included in result' do
            # has inventory with nil size, has color
            MerchPlannerInfo.create({
                :sku => 'W1112',
                :pillar => PILLAR_ACCESSORIES,
                :product_type => PRODUCT_TYPE_REGULAR,
                :color => 'yellow'
            })

            GenescoInventoryInfo.create({
                :sku => 'W1112',
                :size => nil
            })

            # has inventory with empty size, has color
            MerchPlannerInfo.create({
                :sku => 'SG131211',
                :pillar => PILLAR_ACCESSORIES,
                :product_type => PRODUCT_TYPE_REGULAR,
                :color => 'green'
            })

            GenescoInventoryInfo.create({
                :sku => 'SG131211',
                :size => ''
            })

            # has inventory with empty size, has no color
            MerchPlannerInfo.create({
                :sku => 'K2322',
                :pillar => PILLAR_ACCESSORIES,
                :product_type => PRODUCT_TYPE_REGULAR,
            })

            GenescoInventoryInfo.create({
                :sku => 'K2322',
                :size => ''
            })

            @aggregated_product_info = @products_repository.get_aggregated_product_data

            @aggregated_product_info.size.should eq(2)
        end

        it 'DYO and giftcards should be included and have perpetual flag set to true even if there is no inventory or color information available for them' do
            regular_product_sku1 = 'M9165'
            regular_product_sku2 = 'M9160'
            dyo_product_sku = '500333F'
            physical_giftcard_product_sku = 'gc20dyo'
            electronic_giftcard_product_sku = 'ec20dyo'

            MerchPlannerInfo.create({
                :sku => regular_product_sku1,
                :pillar => PILLAR_SNEAKERS,
                :product_type => PRODUCT_TYPE_REGULAR,
                :color => 'white'
            })

            MerchPlannerInfo.create({
                :sku => regular_product_sku2,
                :pillar => PILLAR_SNEAKERS,
                :product_type => PRODUCT_TYPE_REGULAR
            })

            MerchPlannerInfo.create({
                :sku => dyo_product_sku,
                :pillar => PILLAR_SNEAKERS,
                :product_type => PRODUCT_TYPE_DYO
            })

            MerchPlannerInfo.create({
                :sku => electronic_giftcard_product_sku,
                :pillar => PILLAR_SNEAKERS,
                :product_type => PRODUCT_TYPE_ELECTRONIC_GC,
                :color => nil
            })

            MerchPlannerInfo.create({
                :sku => physical_giftcard_product_sku,
                :pillar => PILLAR_SNEAKERS,
                :product_type => PRODUCT_TYPE_PHYSICAL_GC
            })

            ProductToSizeMapping.create({
                :sku => regular_product_sku1,
                :size => '130'
            })

            GenescoInventoryInfo.create({
                :sku => regular_product_sku1,
                :size => '130',
                :qty_on_hand => '10',
                :qty_on_po => '3',
                :expect_date => '2013-09-12'
            })

            @aggregated_product_info = @products_repository.get_aggregated_product_data

            @aggregated_product_info.size.should eq(4)

            @aggregated_product_info.find { |product_info| product_info.sku == regular_product_sku2 }.nil?.should eq(true)

            regular_product = @aggregated_product_info.find { |product_info| product_info.sku == regular_product_sku1 }
            regular_product.size.should eq('130')
            regular_product.color.should eq('white')
            regular_product.qty_on_hand.should eq('10')
            regular_product.qty_on_po.should eq('3')
            regular_product.expect_date.should eq('2013-09-12')
            regular_product.has_perpetual_inventory.should eq('false')
            regular_product.product_type.should eq(PRODUCT_TYPE_REGULAR)

            dyo_product = @aggregated_product_info.find { |product_info| product_info.sku == dyo_product_sku }
            dyo_product.has_perpetual_inventory.should eq('true')
            dyo_product.product_type.should eq(PRODUCT_TYPE_DYO)

            physical_giftcard_product = @aggregated_product_info.find { |product_info| product_info.sku == physical_giftcard_product_sku }
            physical_giftcard_product.has_perpetual_inventory.should eq('true')
            physical_giftcard_product.product_type.should eq(PRODUCT_TYPE_PHYSICAL_GC)

            electronic_giftcard_product = @aggregated_product_info.find { |product_info| product_info.sku == electronic_giftcard_product_sku }
            electronic_giftcard_product.has_perpetual_inventory.should eq('true')
            electronic_giftcard_product.product_type.should eq(PRODUCT_TYPE_ELECTRONIC_GC)
        end
    end

    context 'product with sale prices fetching' do
        before do
            @products_repository = ProductsRepository.new
        end

        it "master product with sale prices" do
            master = MasterProduct.create({
                :product_identifier => "MP_1",
                :sale_price => 25.0
            })

            variation = master.variation_products.create({
                :product_identifier => "Var1_ID",
                :sku => "Var1"
            })

            products = @products_repository.get_products_with_sale_prices(['MP_1'])

            products.size.should eq(2)

            first = products[0]
            first[:price].should eq(25.0)
            first[:identifier].should eq("MP_1")
            first[:sku].should eq(nil)
            first[:is_master_product].should eq(true)

            second = products[1]
            second[:price].should eq(25.0)
            second[:identifier].should eq("Var1_ID")
            second[:sku].should eq("Var1")
            second[:is_master_product].should eq(false)
        end

        it "master product with sale prices and sale prices for some variations" do
            master = MasterProduct.create({
                :product_identifier => "MP_1",
                :sale_price => 25.0
            })

            variation = master.variation_products.create({
                :product_identifier => "Var1_ID",
                :sku => "Var1"
            })

            variation_with_saleprice = master.variation_products.create({
                :product_identifier => "Var2_ID",
                :sku => "Var2"
            })

            variation_with_saleprice.product_price = ProductPrice.new({
                :sale_price => 35.0
            })

            products = @products_repository.get_products_with_sale_prices(['MP_1', 'Var2'])

            products.size.should eq(3)

            first = products[0]
            first[:price].should eq(25.0)
            first[:identifier].should eq("MP_1")
            first[:sku].should eq(nil)
            first[:is_master_product].should eq(true)

            second = products[1]
            second[:price].should eq(25.0)
            second[:identifier].should eq("Var1_ID")
            second[:sku].should eq("Var1")
            second[:is_master_product].should eq(false)

            third = products[2]
            third[:price].should eq(35.0)
            third[:identifier].should eq("Var2_ID")
            third[:sku].should eq("Var2")
            third[:is_master_product].should eq(false)
        end
    end
end
