require_relative "support/spec_helper"

describe VariationProduct do
    context "saving variation product" do
        before do
            master = MasterProduct.create({
                :product_identifier => "A master id",
                :name => "A test name",
                :cut => "A test cut",
                :gender => "A test gender",
                :material => "A test material"
            })

            master.variation_products.create({
                :product_identifier => "A variation id",
                :sku => "A test sku",
                :color => "A test color",
                :size => "A test size",
                :online => true,
                :searchable_flag => true
            })
        end

        it "should find saved product" do
            product = VariationProduct.find_by_product_identifier("A variation id")
            product.should_not be_nil
            product.product_identifier.should eq("A variation id")
            product.sku.should eq("A test sku")
            product.color.should eq("A test color")
            product.size.should eq("A test size")
            product.online.should be_true
        end
    end
end
