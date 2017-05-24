require_relative "support/spec_helper"

require "converse/models/merch_planner_info"
require "converse/models/product_to_size_mapping"
require "converse/product_to_size_mapper"

include Converse::Constants

describe ProductToSizeMapper do
    context 'product to size mapper generation' do
        before do
            @mapper = ProductToSizeMapper.new
        end

        def assert_mapping(mapping, sku, size)
            mapping.sku.should eq sku
            mapping.size.should eq size
        end    

        it 'should persist product to size when sizes are correct and exists' do
            MerchPlannerInfo.create({
                :sku => 'M9161',
                :pillar => PILLAR_SNEAKERS,
                :product_type => PRODUCT_TYPE_REGULAR,
                :sizes => '010,020,030'
            })

            @mapper.run

            mappings = ProductToSizeMapping.find(:all)

            mappings.size.should eq 3
            assert_mapping mappings[0], 'M9161', '010'
            assert_mapping mappings[1], 'M9161', '020'
            assert_mapping mappings[2], 'M9161', '030'            
        end

        it 'should persist product to size when sizes have spaces' do
            MerchPlannerInfo.create({
                :sku => 'M9161',
                :pillar => PILLAR_SNEAKERS,
                :product_type => PRODUCT_TYPE_REGULAR,
                :sizes => '010 ,   020,030      '
            })

            @mapper.run

            mappings = ProductToSizeMapping.find(:all)

            mappings.size.should eq 3
            assert_mapping mappings[0], 'M9161', '010'
            assert_mapping mappings[1], 'M9161', '020'
            assert_mapping mappings[2], 'M9161', '030'
        end

        it 'should persist product to size when a size is missing' do
            MerchPlannerInfo.create({
                :sku => 'M9161',
                :pillar => PILLAR_SNEAKERS,
                :product_type => PRODUCT_TYPE_REGULAR,
                :sizes => '010,'
            })

            @mapper.run

            mappings = ProductToSizeMapping.find(:all)

            mappings.size.should eq 1
            assert_mapping mappings[0], 'M9161', '010'
        end

        it 'should not persist product to size when size is empty' do
            MerchPlannerInfo.create({
                :sku => 'M9161',
                :pillar => PILLAR_SNEAKERS,
                :product_type => PRODUCT_TYPE_REGULAR,
                :sizes => ''
            })

            @mapper.run

            mappings = ProductToSizeMapping.find(:all)

            mappings.size.should eq 0
        end

        it 'should not persist product to size when size is nil' do
            MerchPlannerInfo.create({
                :sku => 'M9161',
                :pillar => PILLAR_SNEAKERS,
                :product_type => PRODUCT_TYPE_REGULAR,
                :sizes => nil
            })

            @mapper.run

            mappings = ProductToSizeMapping.find(:all)

            mappings.size.should eq 0
        end

        it 'should not persist product to size when size has only spaces or tabs' do
            MerchPlannerInfo.create({
                :sku => 'M9161',
                :pillar => PILLAR_SNEAKERS,
                :product_type => PRODUCT_TYPE_REGULAR,
                :sizes => "   \t"
            })

            @mapper.run

            mappings = ProductToSizeMapping.find(:all)

            mappings.size.should eq 0
        end
    end
end
