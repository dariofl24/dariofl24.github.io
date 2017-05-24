require_relative 'support/spec_helper'

require 'converse/export/product_inventory_exporter'

include Converse::Impex

describe ProductInventoryExporter do
    context "building elements" do
        before do
            @builder = Builder::XmlMarkup.new(:indent => 4)
            @exporter = ProductInventoryExporter.new({ :output_directory => '.' })

            @product = VariationProduct.create({
                :product_identifier => "00942C_300",
                :sku => "00942C",
                :color => "red",
                :size => "300",
                :online => true,
                :master_product_id => 1
            })
        end

        it "should create the correct inventory record for products with no backorder" do

            instock_inventory = ProductInventory.new({ :allocation => 99 })
            @product.product_inventory = instock_inventory

            expected =
<<-eos
<record product-id="00942C_300">
    <allocation>99.0</allocation>
    <preorder-backorder-handling>none</preorder-backorder-handling>
</record>
eos

            result = @exporter.create_record @builder, instock_inventory

            result.should == expected
        end

        it "should create the correct inventory record for products with in stock and backorder" do

            backorder_inventory = ProductInventory.new({ :allocation => 11, :po_allocation => 8, :in_stock_date => '2013-03-16' })
            @product.product_inventory = backorder_inventory

            expected =
<<-eos
<record product-id="00942C_300">
    <allocation>11.0</allocation>
    <preorder-backorder-handling>backorder</preorder-backorder-handling>
    <preorder-backorder-allocation>8.0</preorder-backorder-allocation>
    <in-stock-date>2013-03-16</in-stock-date>
</record>
eos

            result = @exporter.create_record @builder, backorder_inventory

            result.should == expected
        end

        it "should create the correct inventory record for products with no stock and preorder" do

            preorder_inventory = ProductInventory.new({ :allocation => 0, :po_allocation => 8, :in_stock_date => '2013-03-16' , :preorder_backorder => 'preorder'})
            @product.product_inventory = preorder_inventory

            expected =
<<-eos
<record product-id="00942C_300">
    <allocation>0.0</allocation>
    <preorder-backorder-handling>preorder</preorder-backorder-handling>
    <preorder-backorder-allocation>8.0</preorder-backorder-allocation>
    <in-stock-date>2013-03-16</in-stock-date>
</record>
eos

            result = @exporter.create_record @builder, preorder_inventory

            result.should == expected
        end

        it "should create the correct inventory record for products with perpetual inventory (allocation still required by schema, though equal to 0)" do

            perpetual_inventory = ProductInventory.new({ :perpetual => true })
            @product.product_inventory = perpetual_inventory

            expected =
<<-eos
<record product-id="00942C_300">
    <allocation>0</allocation>
    <perpetual>true</perpetual>
</record>
eos

            result = @exporter.create_record @builder, perpetual_inventory

            result.should == expected
        end

        it "should create the correct default inventory header" do

            default_inventory_exporter = ProductInventoryExporter.new({ :perpetual => true })
            result = default_inventory_exporter.create_header @builder

            expected =
<<-eos
<header list-id="inventory_Converse_US">
    <default-instock>false</default-instock>
    <description>Product Sku inventory</description>
    <use-bundle-inventory-only>false</use-bundle-inventory-only>
</header>
eos

            result.should == expected
        end

    end
end
