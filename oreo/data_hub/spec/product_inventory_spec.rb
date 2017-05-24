require_relative "support/spec_helper"

describe ProductPrice do
    context "saving product inventory" do
        before do
            @product = VariationProduct.create({
                :product_identifier => "A variation id",
                :sku => "A test sku",
                :color => "A test color",
                :size => "A test size",
                :online => true,
                :master_product_id => 1
            })

            @product.product_inventory = ProductInventory.new({
                :allocation => 99,
                :po_allocation => 34,
                :in_stock_date => '10/12/20',
                :perpetual => true,
                :preorder_backorder => 'preorder'
            })
        end

        it "should find product inventory" do
            product_price = ProductInventory.find_by_variation_product_id(@product.id)
            product_price.should_not be_nil
            product_price.allocation.should eq(99)
            product_price.po_allocation.should eq(34)
            product_price.in_stock_date.should eq('10/12/20')
            product_price.perpetual.should eq(true)
            product_price.preorder_backorder.should eq('preorder')
        end
    end
end
