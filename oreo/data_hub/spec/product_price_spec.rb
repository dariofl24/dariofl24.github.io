require_relative "support/spec_helper"

describe ProductPrice do
    context "saving product price" do
        before do
            @product = VariationProduct.create({
                :product_identifier => "A variation id",
                :sku => "A test sku",
                :color => "A test color",
                :size => "A test size",
                :online => true,
                :master_product_id => 1
            })

            @product.product_price = ProductPrice.new({
                :price => 3.99,
                :sale_price => 1.99
            })
        end

        it "should find product price" do
            product_price = ProductPrice.find_by_variation_product_id(@product.id)
            product_price.should_not be_nil
            product_price.price.should eq(3.99)
            product_price.sale_price.should eq(1.99)
        end
    end
end
