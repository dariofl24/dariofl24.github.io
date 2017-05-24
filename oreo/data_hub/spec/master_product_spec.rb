require_relative "support/spec_helper"

include Converse::Constants

describe MasterProduct do
    context "saving product" do
        before do
            MasterProduct.create({
                :product_identifier => "A test id",
                :name => "A test name",
                :cut => "A test cut",
                :gender => "A test gender",
                :material => "A test material",
                :merch_planner_category => "Chuck Taylor",
                :brand_segment => "all-star",
                :product_type => PRODUCT_TYPE_DYO,
                :core => true,
                :price => 75.00,
                :sale_price => 55.00,
                :business_unit_id => '3',
                :color_slicing => true,
                :template => 'clothing'
            })
        end

        it "should find saved product" do
            product = MasterProduct.find_by_product_identifier("A test id")
            product.should_not be_nil
            product.product_identifier.should eq("A test id")
            product.name.should eq("A test name")
            product.cut.should eq("A test cut")
            product.gender.should eq("A test gender")
            product.material.should eq("A test material")
            product.merch_planner_category.should eq("Chuck Taylor")
            product.brand_segment.should eq("all-star")
            product.product_type.should eq(PRODUCT_TYPE_DYO)
            product.core.should eq(true)
            product.price.should eq(75.00)
            product.sale_price.should eq(55.00)
            product.business_unit_id.should eq('3')
            product.color_slicing.should eq(true)
            product.template.should eq('clothing')
        end
    end
end
