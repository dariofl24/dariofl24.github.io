require_relative "support/spec_helper"

require "converse/constants"
require "converse/models/master_product"
require "converse/models/variation_product"
require "converse/export/product_catalog_exporter"

include Converse::Impex
include Converse::Constants

# MODELS FOR TESTING: eventually to be fetched through ActiveRecord from the DB (join tbl_MasterProduct and tbl_VariationProduct)
class MasterProductMock
    include MasterProductCommon

    attr_accessor :id, :product_identifier, :name, :searchable_flag, :cut, :gender, :material,
                  :merch_planner_category, :pillar, :sleeve, :brand_segment,
                  :product_type, :description, :nike_product_id, :variation_products,
                  :core, :instance_id, :inspiration_id, :color_slicing, :template

    def self.fromHash(hash)
        mp = MasterProductMock.new
        mp.id = hash[:id]
        mp.product_identifier = hash[:product_identifier]
        mp.name = hash[:name]
        mp.searchable_flag = hash[:searchable_flag].nil? ? true : hash[:searchable_flag]
        mp.cut = hash[:cut]
        mp.gender = hash[:gender]
        mp.material = hash[:material]
        mp.merch_planner_category = hash[:merch_planner_category]
        mp.pillar = hash[:pillar]
        mp.sleeve = hash[:sleeve]
        mp.brand_segment = hash[:brand_segment]
        mp.product_type = hash[:product_type]
        mp.description = hash[:description]
        mp.nike_product_id = hash[:nike_product_id]
        mp.variation_products = hash[:variation_products]
        mp.core = hash[:core] || false
        mp.instance_id = hash[:instance_id] || "instanceId1"
        mp.inspiration_id = hash[:inspiration_id] || "inspirationId1"
        mp.color_slicing = hash[:color_slicing] || false
        mp.template = hash[:template] || "default"
        return mp
    end
end

class VariationProductMock
    include VariationProductCommon

    attr_accessor :id, :product_identifier, :sku, :manufacturer_sku, :searchable_flag, :upc, :color, :size, :online,
                  :online_from, :online_to, :main_color_hex, :accent_color_hex, :master_product,
                  :product_price, :sleeve, :dyo_version_product_id, :dyo_version_inspiration_id,
                  :page_title, :page_description, :page_keywords, :meta_search_text, :badging,
                  :size_chart, :size_chart_messaging, :preorder_date, :max_order_quantity, :show_if_out_of_stock, :out_of_stock_message

    def self.fromHash(hash)
        vp = VariationProductMock.new
        vp.id = hash[:id]
        vp.product_identifier = hash[:product_identifier]
        vp.sku = hash[:sku]
        vp.manufacturer_sku = hash[:manufacturer_sku]
        vp.searchable_flag = hash[:searchable_flag].nil? ? true : hash[:searchable_flag]
        vp.upc = hash[:upc]
        vp.color = hash[:color]
        vp.size = hash[:size]
        vp.online = hash[:online] || true
        vp.online_from = hash[:online_from]
        vp.online_to = hash[:online_to]
        vp.main_color_hex = hash[:main_color_hex]
        vp.accent_color_hex = hash[:accent_color_hex]
        vp.sleeve = hash[:sleeve]
        vp.dyo_version_product_id = hash[:dyo_version_product_id] || "dyoVerProdId"
        vp.dyo_version_inspiration_id = hash[:dyo_version_inspiration_id] || "dyoVerInspProdId"
        vp.page_title = hash[:page_title] || "Page Title"
        vp.page_description = hash[:page_description] || "Page Description"
        vp.page_keywords = hash[:page_keywords] || "Page Keywords"
        vp.meta_search_text = hash[:meta_search_text] || "Meta Search Text"
        vp.size_chart = hash[:size_chart] || "standard"
        vp.size_chart_messaging = hash[:size_chart_messaging]
        vp.master_product = hash[:master_product] || get_master_product(PRODUCT_TYPE_REGULAR)
        vp.preorder_date = hash[:preorder_date]
        vp.max_order_quantity = hash[:max_order_quantity]
        vp.show_if_out_of_stock = hash[:show_if_out_of_stock] || false
        vp.out_of_stock_message = hash[:out_of_stock_message]

        return vp
    end
end

class ProductPriceMock
    attr_accessor :price;

    def initialize(price)
        @price = price;
    end
end

def get_master_product(product_type)
    return MasterProductMock.fromHash({
        :id => 1,
        :product_identifier => "master_1",
        :name => "Zerrick",
        :cut => "Hi",
        :gender => "women",
        :material => "Canvas",
        :merch_planner_category => "Chuck Taylor",
        :pillar => "Chuck Taylor",
        :brand_segment => "all-star",
        :product_type => product_type,
        :description => "Dude, wear sneakers not shoes. Sweet.",
    })
end

def get_giftcard_variation_product(sku, sleeve, price, product_type)
    master_product = get_giftcard_master_product(product_type)

    product = VariationProductMock.fromHash({
        :id => 1,
        :product_identifier => sku,
        :sku => sku,
        :manufacturer_sku => sku,
        :online => true,
        :size_chart => "standard",
        :master_product => master_product,
        :sleeve => sleeve});

    product.product_price = ProductPriceMock.new(price)
    return product
end

def get_giftcard_master_product(product_type)
    return master_product = MasterProductMock.fromHash({
        :id => 1,
        :product_identifier => "master_1",
        :name => "gitcard",
        :product_type => product_type})
end
# END MODELS FOR TESTING
def get_outfit_variation_products_subset(master_product = nil)
    [
        VariationProductMock.fromHash({:id => 1, :product_identifier => "R509M983_280", :sku => "R509M983", :color => "green", :size => "280", :master_product => master_product})
    ]
end

def get_variation_products_subset(master_product = nil)
    [
        VariationProductMock.fromHash({:id => 1, :product_identifier => "M9162_090", :sku => "M9162", :color => "taupetx", :size => "090", :master_product => master_product}),
        VariationProductMock.fromHash({:id => 1, :product_identifier => "M9162_095", :sku => "M9162", :color => "taupetx", :size => "095", :master_product => master_product}),
        VariationProductMock.fromHash({:id => 1, :product_identifier => "M9163_095", :sku => "M9163", :color => "black",  :size => "095", :main_color_hex => "000000", :master_product => master_product}),
        VariationProductMock.fromHash({:id => 1, :product_identifier => "R503009_300", :sku => "R503009", :color => "red", :size => "300", :main_color_hex => "FF0000", :accent_color_hex => "FFFF00", :master_product => master_product})
    ]
end

def get_variation_products(master_product = nil)
    outfit_variation_products_subset = get_outfit_variation_products_subset master_product
    variation_products_subset = get_variation_products_subset master_product

    variations = [
        VariationProductMock.fromHash({:id => 1, :product_identifier => "M9164_070", :sku => "M9164", :color => "taupetx", :size => "070", :master_product => master_product}),
        VariationProductMock.fromHash({:id => 1, :product_identifier => "R1199_XL", :sku => "R1199", :color => "brown", :size => "XL", :master_product => master_product}),
        VariationProductMock.fromHash({:id => 1, :product_identifier => "R1197_XL", :sku => "R1197", :color => "green", :size => "XL", :master_product => master_product}),
        VariationProductMock.fromHash({:id => 1, :product_identifier => "R1197_2XL", :sku => "R1197", :color => "green", :size => "2XL", :master_product => master_product})
    ]

    return outfit_variation_products_subset + variation_products_subset + variations
end

describe CatalogExporter do
    context "building elements" do
        before do
            @builder = Builder::XmlMarkup.new(:indent => 4)
            @exporter = CatalogExporter.new({:output_directory => '.'})
        end

        it "should create the catalog header" do

            expected =
<<-eos
<header>
    <image-settings>
        <internal-location base-path="/"/>
        <view-types>
            <view-type>hi-res</view-type>
            <view-type>large</view-type>
            <view-type>medium</view-type>
            <view-type>small</view-type>
            <view-type>swatch</view-type>
        </view-types>
        <variation-attribute-id>image-variation</variation-attribute-id>
        <alt-pattern>${productname}</alt-pattern>
        <title-pattern>${productname}</title-pattern>
    </image-settings>
</header>
eos
            result = @exporter.create_catalog_header @builder

            result.should == expected
        end


        it "should create product to category assignment" do
            category_id = "imported-products-category"

            expected =
<<-eos
<root>
    <category-assignment category-id="imported-products-category" product-id="prod_id_1">
        <primary-flag>true</primary-flag>
    </category-assignment>
    <category-assignment category-id="imported-products-category" product-id="prod_id_2">
        <primary-flag>true</primary-flag>
    </category-assignment>
    <category-assignment category-id="imported-products-category" product-id="prod_id_3">
        <primary-flag>true</primary-flag>
    </category-assignment>
</root>
eos

            result = @builder.root do |root_builder|
                @exporter.create_category_assignments root_builder, category_id, ["prod_id_1", "prod_id_2", "prod_id_3"]
            end

            result.should == expected
        end

        it "should create variation products" do

            expected =
<<-eos
<root>
    <product product-id="M9162_090">
        <ean/>
        <upc/>
        <unit/>
        <min-order-quantity>1.0</min-order-quantity>
        <step-quantity>1.0</step-quantity>
        <online-flag>true</online-flag>
        <available-flag>true</available-flag>
        <searchable-flag>true</searchable-flag>
        <searchable-if-unavailable-flag>false</searchable-if-unavailable-flag>
        <manufacturer-sku>M9162</manufacturer-sku>
        <page-attributes>
            <page-title xml:lang="x-default">Page Title</page-title>
            <page-description xml:lang="x-default">Page Description</page-description>
            <page-keywords xml:lang="x-default">Page Keywords</page-keywords>
        </page-attributes>
        <custom-attributes>
            <custom-attribute attribute-id="color">taupetx</custom-attribute>
            <custom-attribute attribute-id="image-variation">taupetx</custom-attribute>
            <custom-attribute attribute-id="size">090</custom-attribute>
            <custom-attribute attribute-id="refinementSize">Men 9 / Women 10.5</custom-attribute>
            <custom-attribute attribute-id="mainColorHex"/>
            <custom-attribute attribute-id="accentColorHex"/>
            <custom-attribute attribute-id="dyoVersionProductID">dyoVerProdId</custom-attribute>
            <custom-attribute attribute-id="dyoVersionInspirationID">dyoVerInspProdId</custom-attribute>
            <custom-attribute attribute-id="badging"/>
            <custom-attribute attribute-id="sizeChart">standard</custom-attribute>
            <custom-attribute attribute-id="sizeChartMessaging"/>
            <custom-attribute attribute-id="maxOrderQuantity"/>
            <custom-attribute attribute-id="showIfOutOfStock">false</custom-attribute>
            <custom-attribute attribute-id="outOfStockMessage"/>
            <custom-attribute attribute-id="metaSearchText">Meta Search Text</custom-attribute>
        </custom-attributes>
    </product>
    <product product-id="M9162_095">
        <ean/>
        <upc/>
        <unit/>
        <min-order-quantity>1.0</min-order-quantity>
        <step-quantity>1.0</step-quantity>
        <online-flag>true</online-flag>
        <available-flag>true</available-flag>
        <searchable-flag>true</searchable-flag>
        <searchable-if-unavailable-flag>false</searchable-if-unavailable-flag>
        <manufacturer-sku>M9162</manufacturer-sku>
        <page-attributes>
            <page-title xml:lang="x-default">Page Title</page-title>
            <page-description xml:lang="x-default">Page Description</page-description>
            <page-keywords xml:lang="x-default">Page Keywords</page-keywords>
        </page-attributes>
        <custom-attributes>
            <custom-attribute attribute-id="color">taupetx</custom-attribute>
            <custom-attribute attribute-id="image-variation">taupetx</custom-attribute>
            <custom-attribute attribute-id="size">095</custom-attribute>
            <custom-attribute attribute-id="refinementSize">Men 9.5 / Women 11</custom-attribute>
            <custom-attribute attribute-id="mainColorHex"/>
            <custom-attribute attribute-id="accentColorHex"/>
            <custom-attribute attribute-id="dyoVersionProductID">dyoVerProdId</custom-attribute>
            <custom-attribute attribute-id="dyoVersionInspirationID">dyoVerInspProdId</custom-attribute>
            <custom-attribute attribute-id="badging"/>
            <custom-attribute attribute-id="sizeChart">standard</custom-attribute>
            <custom-attribute attribute-id="sizeChartMessaging"/>
            <custom-attribute attribute-id="maxOrderQuantity"/>
            <custom-attribute attribute-id="showIfOutOfStock">false</custom-attribute>
            <custom-attribute attribute-id="outOfStockMessage"/>
            <custom-attribute attribute-id="metaSearchText">Meta Search Text</custom-attribute>
        </custom-attributes>
    </product>
    <product product-id="M9163_095">
        <ean/>
        <upc/>
        <unit/>
        <min-order-quantity>1.0</min-order-quantity>
        <step-quantity>1.0</step-quantity>
        <online-flag>true</online-flag>
        <available-flag>true</available-flag>
        <searchable-flag>true</searchable-flag>
        <searchable-if-unavailable-flag>false</searchable-if-unavailable-flag>
        <manufacturer-sku>M9163</manufacturer-sku>
        <page-attributes>
            <page-title xml:lang="x-default">Page Title</page-title>
            <page-description xml:lang="x-default">Page Description</page-description>
            <page-keywords xml:lang="x-default">Page Keywords</page-keywords>
        </page-attributes>
        <custom-attributes>
            <custom-attribute attribute-id="color">black</custom-attribute>
            <custom-attribute attribute-id="image-variation">black</custom-attribute>
            <custom-attribute attribute-id="size">095</custom-attribute>
            <custom-attribute attribute-id="refinementSize">Men 9.5 / Women 11</custom-attribute>
            <custom-attribute attribute-id="mainColorHex">000000</custom-attribute>
            <custom-attribute attribute-id="accentColorHex"/>
            <custom-attribute attribute-id="dyoVersionProductID">dyoVerProdId</custom-attribute>
            <custom-attribute attribute-id="dyoVersionInspirationID">dyoVerInspProdId</custom-attribute>
            <custom-attribute attribute-id="badging"/>
            <custom-attribute attribute-id="sizeChart">standard</custom-attribute>
            <custom-attribute attribute-id="sizeChartMessaging"/>
            <custom-attribute attribute-id="maxOrderQuantity"/>
            <custom-attribute attribute-id="showIfOutOfStock">false</custom-attribute>
            <custom-attribute attribute-id="outOfStockMessage"/>
            <custom-attribute attribute-id="metaSearchText">Meta Search Text</custom-attribute>
        </custom-attributes>
    </product>
    <product product-id="R503009_300">
        <ean/>
        <upc/>
        <unit/>
        <min-order-quantity>1.0</min-order-quantity>
        <step-quantity>1.0</step-quantity>
        <online-flag>true</online-flag>
        <available-flag>true</available-flag>
        <searchable-flag>true</searchable-flag>
        <searchable-if-unavailable-flag>false</searchable-if-unavailable-flag>
        <manufacturer-sku>R503009</manufacturer-sku>
        <page-attributes>
            <page-title xml:lang="x-default">Page Title</page-title>
            <page-description xml:lang="x-default">Page Description</page-description>
            <page-keywords xml:lang="x-default">Page Keywords</page-keywords>
        </page-attributes>
        <custom-attributes>
            <custom-attribute attribute-id="color">red</custom-attribute>
            <custom-attribute attribute-id="image-variation">red</custom-attribute>
            <custom-attribute attribute-id="size">300</custom-attribute>
            <custom-attribute attribute-id="refinementSize">300</custom-attribute>
            <custom-attribute attribute-id="mainColorHex">FF0000</custom-attribute>
            <custom-attribute attribute-id="accentColorHex">FFFF00</custom-attribute>
            <custom-attribute attribute-id="dyoVersionProductID">dyoVerProdId</custom-attribute>
            <custom-attribute attribute-id="dyoVersionInspirationID">dyoVerInspProdId</custom-attribute>
            <custom-attribute attribute-id="badging"/>
            <custom-attribute attribute-id="sizeChart">standard</custom-attribute>
            <custom-attribute attribute-id="sizeChartMessaging"/>
            <custom-attribute attribute-id="maxOrderQuantity"/>
            <custom-attribute attribute-id="showIfOutOfStock">false</custom-attribute>
            <custom-attribute attribute-id="outOfStockMessage"/>
            <custom-attribute attribute-id="metaSearchText">Meta Search Text</custom-attribute>
        </custom-attributes>
    </product>
</root>
eos

            result = @builder.root do |root_builder|
                @exporter.create_variation_products root_builder, get_variation_products_subset
            end

            result.should == expected
        end

        it "should create variation products for physical giftcards" do

            expected =
<<-eos
<root>
    <product product-id="gc100dyo">
        <ean/>
        <upc/>
        <unit/>
        <min-order-quantity>1.0</min-order-quantity>
        <step-quantity>1.0</step-quantity>
        <display-name xml:lang="x-default">Converse.com $100 Gift Card</display-name>
        <online-flag>true</online-flag>
        <available-flag>true</available-flag>
        <searchable-flag>true</searchable-flag>
        <searchable-if-unavailable-flag>false</searchable-if-unavailable-flag>
        <manufacturer-sku>gc100dyo</manufacturer-sku>
        <page-attributes>
            <page-title xml:lang="x-default">Page Title</page-title>
            <page-description xml:lang="x-default">Page Description</page-description>
            <page-keywords xml:lang="x-default">Page Keywords</page-keywords>
        </page-attributes>
        <custom-attributes>
            <custom-attribute attribute-id="sleeve">DYO</custom-attribute>
            <custom-attribute attribute-id="value">100</custom-attribute>
            <custom-attribute attribute-id="metaSearchText">Meta Search Text</custom-attribute>
        </custom-attributes>
    </product>
    <product product-id="gc150pow">
        <ean/>
        <upc/>
        <unit/>
        <min-order-quantity>1.0</min-order-quantity>
        <step-quantity>1.0</step-quantity>
        <display-name xml:lang="x-default">Converse.com $150 Gift Card</display-name>
        <online-flag>true</online-flag>
        <available-flag>true</available-flag>
        <searchable-flag>true</searchable-flag>
        <searchable-if-unavailable-flag>false</searchable-if-unavailable-flag>
        <manufacturer-sku>gc150pow</manufacturer-sku>
        <page-attributes>
            <page-title xml:lang="x-default">Page Title</page-title>
            <page-description xml:lang="x-default">Page Description</page-description>
            <page-keywords xml:lang="x-default">Page Keywords</page-keywords>
        </page-attributes>
        <custom-attributes>
            <custom-attribute attribute-id="sleeve">Star Power</custom-attribute>
            <custom-attribute attribute-id="value">150</custom-attribute>
            <custom-attribute attribute-id="metaSearchText">Meta Search Text</custom-attribute>
        </custom-attributes>
    </product>
    <product product-id="gc50Con">
        <ean/>
        <upc/>
        <unit/>
        <min-order-quantity>1.0</min-order-quantity>
        <step-quantity>1.0</step-quantity>
        <display-name xml:lang="x-default">Converse.com $50 Gift Card</display-name>
        <online-flag>true</online-flag>
        <available-flag>true</available-flag>
        <searchable-flag>true</searchable-flag>
        <searchable-if-unavailable-flag>false</searchable-if-unavailable-flag>
        <manufacturer-sku>gc50Con</manufacturer-sku>
        <page-attributes>
            <page-title xml:lang="x-default">Page Title</page-title>
            <page-description xml:lang="x-default">Page Description</page-description>
            <page-keywords xml:lang="x-default">Page Keywords</page-keywords>
        </page-attributes>
        <custom-attributes>
            <custom-attribute attribute-id="sleeve">Converse</custom-attribute>
            <custom-attribute attribute-id="value">50</custom-attribute>
            <custom-attribute attribute-id="metaSearchText">Meta Search Text</custom-attribute>
        </custom-attributes>
    </product>
</root>
eos
            @pGCs = [
                get_giftcard_variation_product('gc100dyo', 'DYO', 100.0, PRODUCT_TYPE_PHYSICAL_GC),
                get_giftcard_variation_product('gc150pow', 'Star Power', 150.0, PRODUCT_TYPE_PHYSICAL_GC),
                get_giftcard_variation_product('gc50Con', 'Converse', 50.0, PRODUCT_TYPE_PHYSICAL_GC)
            ]

            result = @builder.root do |root_builder|
                @exporter.create_variation_products root_builder, @pGCs
            end

            result.should == expected
        end

        it "should create variation products for electronic giftcards" do

            expected =
<<-eos
<root>
    <product product-id="ec25cnv">
        <ean/>
        <upc/>
        <unit/>
        <min-order-quantity>1.0</min-order-quantity>
        <step-quantity>1.0</step-quantity>
        <display-name xml:lang="x-default">Converse.com $25 Email Gift Cert</display-name>
        <online-flag>true</online-flag>
        <available-flag>true</available-flag>
        <searchable-flag>true</searchable-flag>
        <searchable-if-unavailable-flag>false</searchable-if-unavailable-flag>
        <manufacturer-sku>ec25cnv</manufacturer-sku>
        <page-attributes>
            <page-title xml:lang="x-default">Page Title</page-title>
            <page-description xml:lang="x-default">Page Description</page-description>
            <page-keywords xml:lang="x-default">Page Keywords</page-keywords>
        </page-attributes>
        <custom-attributes>
            <custom-attribute attribute-id="value">25</custom-attribute>
            <custom-attribute attribute-id="metaSearchText">Meta Search Text</custom-attribute>
        </custom-attributes>
    </product>
    <product product-id="ec50cnv">
        <ean/>
        <upc/>
        <unit/>
        <min-order-quantity>1.0</min-order-quantity>
        <step-quantity>1.0</step-quantity>
        <display-name xml:lang="x-default">Converse.com $50 Email Gift Cert</display-name>
        <online-flag>true</online-flag>
        <available-flag>true</available-flag>
        <searchable-flag>true</searchable-flag>
        <searchable-if-unavailable-flag>false</searchable-if-unavailable-flag>
        <manufacturer-sku>ec50cnv</manufacturer-sku>
        <page-attributes>
            <page-title xml:lang="x-default">Page Title</page-title>
            <page-description xml:lang="x-default">Page Description</page-description>
            <page-keywords xml:lang="x-default">Page Keywords</page-keywords>
        </page-attributes>
        <custom-attributes>
            <custom-attribute attribute-id="value">50</custom-attribute>
            <custom-attribute attribute-id="metaSearchText">Meta Search Text</custom-attribute>
        </custom-attributes>
    </product>
</root>
eos
            @eGCs = [
                get_giftcard_variation_product('ec25cnv', '', 25.0, PRODUCT_TYPE_ELECTRONIC_GC),
                get_giftcard_variation_product('ec50cnv', '', 50.0, PRODUCT_TYPE_ELECTRONIC_GC)
            ]

            result = @builder.root do |root_builder|
                @exporter.create_variation_products root_builder, @eGCs
            end

            result.should == expected
        end

        it "should create the root category" do

            expected =
<<-eos
<category category-id="root">
    <online-flag>true</online-flag>
    <position>0.0</position>
    <template/>
    <page-attributes/>
</category>
eos
            result = @exporter.create_catalog_root_category @builder
            result.should == expected
        end

        it "should create the imported-products-category category" do

            expected =
<<-eos
<category category-id="imported-products-category">
    <display-name xml:lang="x-default">Imported Products</display-name>
    <online-flag>true</online-flag>
    <parent>root</parent>
    <template/>
    <page-attributes/>
</category>
eos
            result = @exporter.create_catalog_category(@builder, "imported-products-category", "Imported Products")
            result.should == expected
        end

        it "should create product images" do
            expected =
<<-eos
<root>
    <images>
        <image-group view-type="hi-res" variation-value="taupetx">
            <image path="images/products/M9162/M9162_standard.png"/>
            <image path="images/products/M9162/M9162_shot1.png"/>
            <image path="images/products/M9162/M9162_shot2.png"/>
            <image path="images/products/M9162/M9162_shot3.png"/>
            <image path="images/products/M9162/M9162_shot4.png"/>
            <image path="images/products/M9162/M9162_shot5.png"/>
            <image path="images/products/M9162/M9162_shot6.png"/>
            <image path="images/products/M9162/M9162_shot7.png"/>
            <image path="images/products/M9162/M9162_shot8.png"/>
        </image-group>
        <image-group view-type="hi-res" variation-value="black">
            <image path="images/products/M9163/M9163_standard.png"/>
            <image path="images/products/M9163/M9163_shot1.png"/>
            <image path="images/products/M9163/M9163_shot2.png"/>
            <image path="images/products/M9163/M9163_shot3.png"/>
            <image path="images/products/M9163/M9163_shot4.png"/>
            <image path="images/products/M9163/M9163_shot5.png"/>
            <image path="images/products/M9163/M9163_shot6.png"/>
            <image path="images/products/M9163/M9163_shot7.png"/>
            <image path="images/products/M9163/M9163_shot8.png"/>
        </image-group>
        <image-group view-type="hi-res" variation-value="red">
            <image path="images/products/R503009/R503009_standard.png"/>
            <image path="images/products/R503009/R503009_shot1.png"/>
            <image path="images/products/R503009/R503009_shot2.png"/>
            <image path="images/products/R503009/R503009_shot3.png"/>
            <image path="images/products/R503009/R503009_shot4.png"/>
            <image path="images/products/R503009/R503009_shot5.png"/>
            <image path="images/products/R503009/R503009_shot6.png"/>
            <image path="images/products/R503009/R503009_shot7.png"/>
            <image path="images/products/R503009/R503009_shot8.png"/>
        </image-group>
    </images>
</root>
eos

            master_product = get_master_product("regular")
            master_product.variation_products = get_variation_products_subset master_product

            result = @builder.root do |root_builder|
                @exporter.create_master_product_images root_builder, master_product
            end

            result.should == expected

        end

        it "should not create product images for giftcard and egiftcard master products" do
            expected =
<<-eos
<root>
</root>
eos

            pgc_master_product = get_giftcard_master_product(PRODUCT_TYPE_PHYSICAL_GC)
            egc_master_product = get_giftcard_master_product(PRODUCT_TYPE_ELECTRONIC_GC)

            result = @builder.root do |root_builder|
                @exporter.create_master_product_images root_builder, pgc_master_product
            end

            result.should == expected

            result = @builder.root do |root_builder|
                @exporter.create_master_product_images root_builder, egc_master_product
            end

        end

        it "should create a master product" do
            product = get_master_product("regular")
            product.core = true
            product.cut = "Hi"
            product.variation_products = get_variation_products

            @exporter.stub(:create_master_product_images) do |product_builder, variation_products|
                product_builder.tag! "images"
            end

            expected =
<<-eos
<product product-id="master_1">
    <ean/>
    <upc/>
    <unit/>
    <min-order-quantity>1.0</min-order-quantity>
    <step-quantity>1.0</step-quantity>
    <display-name xml:lang="x-default">Zerrick</display-name>
    <short-description>Dude, wear sneakers not shoes. Sweet.</short-description>
    <online-flag>true</online-flag>
    <available-flag>true</available-flag>
    <searchable-flag>true</searchable-flag>
    <images/>
    <page-attributes/>
    <custom-attributes>
        <custom-attribute attribute-id="merchPlannerCategory">Chuck Taylor</custom-attribute>
        <custom-attribute attribute-id="pillar">Chuck Taylor</custom-attribute>
        <custom-attribute attribute-id="brandSegment">all-star</custom-attribute>
        <custom-attribute attribute-id="productType">regular</custom-attribute>
        <custom-attribute attribute-id="cut">Hi</custom-attribute>
        <custom-attribute attribute-id="gender">women</custom-attribute>
        <custom-attribute attribute-id="material">Canvas</custom-attribute>
        <custom-attribute attribute-id="nikeProductID"/>
        <custom-attribute attribute-id="core">true</custom-attribute>
        <custom-attribute attribute-id="instanceID">instanceId1</custom-attribute>
        <custom-attribute attribute-id="inspirationID">inspirationId1</custom-attribute>
        <custom-attribute attribute-id="pdp_template">default</custom-attribute>
    </custom-attributes>
    <variations>
        <attributes>
            <variation-attribute attribute-id="color" variation-attribute-id="color" slicing-attribute="false">
                <variation-attribute-values>
                    <variation-attribute-value value="green">
                        <display-value xml:lang="x-default">Green</display-value>
                    </variation-attribute-value>
                    <variation-attribute-value value="taupetx">
                        <display-value xml:lang="x-default">Taupetx</display-value>
                    </variation-attribute-value>
                    <variation-attribute-value value="black">
                        <display-value xml:lang="x-default">Black</display-value>
                    </variation-attribute-value>
                    <variation-attribute-value value="red">
                        <display-value xml:lang="x-default">Red</display-value>
                    </variation-attribute-value>
                    <variation-attribute-value value="brown">
                        <display-value xml:lang="x-default">Brown</display-value>
                    </variation-attribute-value>
                </variation-attribute-values>
            </variation-attribute>
            <variation-attribute attribute-id="size" variation-attribute-id="size">
                <variation-attribute-values>
                    <variation-attribute-value value="280">
                        <display-value xml:lang="x-default">280</display-value>
                    </variation-attribute-value>
                    <variation-attribute-value value="090">
                        <display-value xml:lang="x-default">Men 9 / Women 10.5</display-value>
                    </variation-attribute-value>
                    <variation-attribute-value value="095">
                        <display-value xml:lang="x-default">Men 9.5 / Women 11</display-value>
                    </variation-attribute-value>
                    <variation-attribute-value value="300">
                        <display-value xml:lang="x-default">300</display-value>
                    </variation-attribute-value>
                    <variation-attribute-value value="070">
                        <display-value xml:lang="x-default">Men 7 / Women 8.5</display-value>
                    </variation-attribute-value>
                    <variation-attribute-value value="XL">
                        <display-value xml:lang="x-default">XL</display-value>
                    </variation-attribute-value>
                    <variation-attribute-value value="2XL">
                        <display-value xml:lang="x-default">2XL</display-value>
                    </variation-attribute-value>
                </variation-attribute-values>
            </variation-attribute>
            <variation-attribute attribute-id="image-variation" variation-attribute-id="image-variation">
                <variation-attribute-values>
                    <variation-attribute-value value="green">
                        <display-value xml:lang="x-default">green</display-value>
                    </variation-attribute-value>
                    <variation-attribute-value value="taupetx">
                        <display-value xml:lang="x-default">taupetx</display-value>
                    </variation-attribute-value>
                    <variation-attribute-value value="black">
                        <display-value xml:lang="x-default">black</display-value>
                    </variation-attribute-value>
                    <variation-attribute-value value="red">
                        <display-value xml:lang="x-default">red</display-value>
                    </variation-attribute-value>
                    <variation-attribute-value value="brown">
                        <display-value xml:lang="x-default">brown</display-value>
                    </variation-attribute-value>
                </variation-attribute-values>
            </variation-attribute>
        </attributes>
        <variants>
            <variant product-id="R509M983_280"/>
            <variant product-id="M9162_090"/>
            <variant product-id="M9162_095"/>
            <variant product-id="M9163_095"/>
            <variant product-id="R503009_300"/>
            <variant product-id="M9164_070"/>
            <variant product-id="R1199_XL"/>
            <variant product-id="R1197_XL"/>
            <variant product-id="R1197_2XL"/>
        </variants>
    </variations>
</product>
eos
            result = @exporter.create_master_product(@builder, product)
            result.should == expected
        end

        it "should create a kids master sneaker product with size_chart variation attribute" do
            product = get_master_product("regular")
            product.gender = "Kids"
            product.pillar = "Sneakers"
            product.variation_products = get_variation_products product

            puts product.gender

            @exporter.stub(:create_master_product_images) do |product_builder, variation_products|
                product_builder.tag! "images"
            end

            expected =
<<-eos
<product product-id="master_1">
    <ean/>
    <upc/>
    <unit/>
    <min-order-quantity>1.0</min-order-quantity>
    <step-quantity>1.0</step-quantity>
    <display-name xml:lang="x-default">Zerrick</display-name>
    <short-description>Dude, wear sneakers not shoes. Sweet.</short-description>
    <online-flag>true</online-flag>
    <available-flag>true</available-flag>
    <searchable-flag>true</searchable-flag>
    <images/>
    <page-attributes/>
    <custom-attributes>
        <custom-attribute attribute-id="merchPlannerCategory">Chuck Taylor</custom-attribute>
        <custom-attribute attribute-id="pillar">Sneakers</custom-attribute>
        <custom-attribute attribute-id="brandSegment">all-star</custom-attribute>
        <custom-attribute attribute-id="productType">regular</custom-attribute>
        <custom-attribute attribute-id="cut">Hi</custom-attribute>
        <custom-attribute attribute-id="gender">Kids</custom-attribute>
        <custom-attribute attribute-id="material">Canvas</custom-attribute>
        <custom-attribute attribute-id="nikeProductID"/>
        <custom-attribute attribute-id="core">false</custom-attribute>
        <custom-attribute attribute-id="instanceID">instanceId1</custom-attribute>
        <custom-attribute attribute-id="inspirationID">inspirationId1</custom-attribute>
        <custom-attribute attribute-id="pdp_template">default</custom-attribute>
        <custom-attribute attribute-id="subGender">Unisex</custom-attribute>
    </custom-attributes>
    <variations>
        <attributes>
            <variation-attribute attribute-id="color" variation-attribute-id="color" slicing-attribute="false">
                <variation-attribute-values>
                    <variation-attribute-value value="green">
                        <display-value xml:lang="x-default">Green</display-value>
                    </variation-attribute-value>
                    <variation-attribute-value value="taupetx">
                        <display-value xml:lang="x-default">Taupetx</display-value>
                    </variation-attribute-value>
                    <variation-attribute-value value="black">
                        <display-value xml:lang="x-default">Black</display-value>
                    </variation-attribute-value>
                    <variation-attribute-value value="red">
                        <display-value xml:lang="x-default">Red</display-value>
                    </variation-attribute-value>
                    <variation-attribute-value value="brown">
                        <display-value xml:lang="x-default">Brown</display-value>
                    </variation-attribute-value>
                </variation-attribute-values>
            </variation-attribute>
            <variation-attribute attribute-id="sizeChart" variation-attribute-id="sizeChart">
                <variation-attribute-values>
                    <variation-attribute-value value="standard">
                        <display-value xml:lang="x-default">standard</display-value>
                    </variation-attribute-value>
                </variation-attribute-values>
            </variation-attribute>
            <variation-attribute attribute-id="size" variation-attribute-id="size">
                <variation-attribute-values>
                    <variation-attribute-value value="280">
                        <display-value xml:lang="x-default">280</display-value>
                    </variation-attribute-value>
                    <variation-attribute-value value="090">
                        <display-value xml:lang="x-default">Men 9 / Women 10.5</display-value>
                    </variation-attribute-value>
                    <variation-attribute-value value="095">
                        <display-value xml:lang="x-default">Men 9.5 / Women 11</display-value>
                    </variation-attribute-value>
                    <variation-attribute-value value="300">
                        <display-value xml:lang="x-default">300</display-value>
                    </variation-attribute-value>
                    <variation-attribute-value value="070">
                        <display-value xml:lang="x-default">Men 7 / Women 8.5</display-value>
                    </variation-attribute-value>
                    <variation-attribute-value value="XL">
                        <display-value xml:lang="x-default">XL</display-value>
                    </variation-attribute-value>
                    <variation-attribute-value value="2XL">
                        <display-value xml:lang="x-default">2XL</display-value>
                    </variation-attribute-value>
                </variation-attribute-values>
            </variation-attribute>
            <variation-attribute attribute-id="image-variation" variation-attribute-id="image-variation">
                <variation-attribute-values>
                    <variation-attribute-value value="green-standard">
                        <display-value xml:lang="x-default">green-standard</display-value>
                    </variation-attribute-value>
                    <variation-attribute-value value="taupetx-standard">
                        <display-value xml:lang="x-default">taupetx-standard</display-value>
                    </variation-attribute-value>
                    <variation-attribute-value value="black-standard">
                        <display-value xml:lang="x-default">black-standard</display-value>
                    </variation-attribute-value>
                    <variation-attribute-value value="red-standard">
                        <display-value xml:lang="x-default">red-standard</display-value>
                    </variation-attribute-value>
                    <variation-attribute-value value="brown-standard">
                        <display-value xml:lang="x-default">brown-standard</display-value>
                    </variation-attribute-value>
                </variation-attribute-values>
            </variation-attribute>
        </attributes>
        <variants>
            <variant product-id="R509M983_280"/>
            <variant product-id="M9162_090"/>
            <variant product-id="M9162_095"/>
            <variant product-id="M9163_095"/>
            <variant product-id="R503009_300"/>
            <variant product-id="M9164_070"/>
            <variant product-id="R1199_XL"/>
            <variant product-id="R1197_XL"/>
            <variant product-id="R1197_2XL"/>
        </variants>
    </variations>
</product>
eos
            result = @exporter.create_master_product(@builder, product)
            result.should == expected
        end

        it "should create a kids master sneaker product with size_chart variation attribute and gender set to Boys" do
            product = get_master_product("regular")
            product.gender = "Boys"
            product.pillar = "Sneakers"
            product.variation_products = get_variation_products product

            puts product.gender

            @exporter.stub(:create_master_product_images) do |product_builder, variation_products|
                product_builder.tag! "images"
            end

            expected =
<<-eos
<product product-id="master_1">
    <ean/>
    <upc/>
    <unit/>
    <min-order-quantity>1.0</min-order-quantity>
    <step-quantity>1.0</step-quantity>
    <display-name xml:lang="x-default">Zerrick</display-name>
    <short-description>Dude, wear sneakers not shoes. Sweet.</short-description>
    <online-flag>true</online-flag>
    <available-flag>true</available-flag>
    <searchable-flag>true</searchable-flag>
    <images/>
    <page-attributes/>
    <custom-attributes>
        <custom-attribute attribute-id="merchPlannerCategory">Chuck Taylor</custom-attribute>
        <custom-attribute attribute-id="pillar">Sneakers</custom-attribute>
        <custom-attribute attribute-id="brandSegment">all-star</custom-attribute>
        <custom-attribute attribute-id="productType">regular</custom-attribute>
        <custom-attribute attribute-id="cut">Hi</custom-attribute>
        <custom-attribute attribute-id="gender">Kids</custom-attribute>
        <custom-attribute attribute-id="material">Canvas</custom-attribute>
        <custom-attribute attribute-id="nikeProductID"/>
        <custom-attribute attribute-id="core">false</custom-attribute>
        <custom-attribute attribute-id="instanceID">instanceId1</custom-attribute>
        <custom-attribute attribute-id="inspirationID">inspirationId1</custom-attribute>
        <custom-attribute attribute-id="pdp_template">default</custom-attribute>
        <custom-attribute attribute-id="subGender">Boys</custom-attribute>
    </custom-attributes>
    <variations>
        <attributes>
            <variation-attribute attribute-id="color" variation-attribute-id="color" slicing-attribute="false">
                <variation-attribute-values>
                    <variation-attribute-value value="green">
                        <display-value xml:lang="x-default">Green</display-value>
                    </variation-attribute-value>
                    <variation-attribute-value value="taupetx">
                        <display-value xml:lang="x-default">Taupetx</display-value>
                    </variation-attribute-value>
                    <variation-attribute-value value="black">
                        <display-value xml:lang="x-default">Black</display-value>
                    </variation-attribute-value>
                    <variation-attribute-value value="red">
                        <display-value xml:lang="x-default">Red</display-value>
                    </variation-attribute-value>
                    <variation-attribute-value value="brown">
                        <display-value xml:lang="x-default">Brown</display-value>
                    </variation-attribute-value>
                </variation-attribute-values>
            </variation-attribute>
            <variation-attribute attribute-id="sizeChart" variation-attribute-id="sizeChart">
                <variation-attribute-values>
                    <variation-attribute-value value="standard">
                        <display-value xml:lang="x-default">standard</display-value>
                    </variation-attribute-value>
                </variation-attribute-values>
            </variation-attribute>
            <variation-attribute attribute-id="size" variation-attribute-id="size">
                <variation-attribute-values>
                    <variation-attribute-value value="280">
                        <display-value xml:lang="x-default">280</display-value>
                    </variation-attribute-value>
                    <variation-attribute-value value="090">
                        <display-value xml:lang="x-default">Men 9 / Women 10.5</display-value>
                    </variation-attribute-value>
                    <variation-attribute-value value="095">
                        <display-value xml:lang="x-default">Men 9.5 / Women 11</display-value>
                    </variation-attribute-value>
                    <variation-attribute-value value="300">
                        <display-value xml:lang="x-default">300</display-value>
                    </variation-attribute-value>
                    <variation-attribute-value value="070">
                        <display-value xml:lang="x-default">Men 7 / Women 8.5</display-value>
                    </variation-attribute-value>
                    <variation-attribute-value value="XL">
                        <display-value xml:lang="x-default">XL</display-value>
                    </variation-attribute-value>
                    <variation-attribute-value value="2XL">
                        <display-value xml:lang="x-default">2XL</display-value>
                    </variation-attribute-value>
                </variation-attribute-values>
            </variation-attribute>
            <variation-attribute attribute-id="image-variation" variation-attribute-id="image-variation">
                <variation-attribute-values>
                    <variation-attribute-value value="green-standard">
                        <display-value xml:lang="x-default">green-standard</display-value>
                    </variation-attribute-value>
                    <variation-attribute-value value="taupetx-standard">
                        <display-value xml:lang="x-default">taupetx-standard</display-value>
                    </variation-attribute-value>
                    <variation-attribute-value value="black-standard">
                        <display-value xml:lang="x-default">black-standard</display-value>
                    </variation-attribute-value>
                    <variation-attribute-value value="red-standard">
                        <display-value xml:lang="x-default">red-standard</display-value>
                    </variation-attribute-value>
                    <variation-attribute-value value="brown-standard">
                        <display-value xml:lang="x-default">brown-standard</display-value>
                    </variation-attribute-value>
                </variation-attribute-values>
            </variation-attribute>
        </attributes>
        <variants>
            <variant product-id="R509M983_280"/>
            <variant product-id="M9162_090"/>
            <variant product-id="M9162_095"/>
            <variant product-id="M9163_095"/>
            <variant product-id="R503009_300"/>
            <variant product-id="M9164_070"/>
            <variant product-id="R1199_XL"/>
            <variant product-id="R1197_XL"/>
            <variant product-id="R1197_2XL"/>
        </variants>
    </variations>
</product>
eos
            result = @exporter.create_master_product(@builder, product)
            result.should == expected
        end

        it "should create a kids master sneaker product with size_chart variation attribute and gender set to Girls" do
            product = get_master_product("regular")
            product.gender = "Girls"
            product.pillar = "Sneakers"
            product.variation_products = get_variation_products product

            puts product.gender

            @exporter.stub(:create_master_product_images) do |product_builder, variation_products|
                product_builder.tag! "images"
            end

            expected =
<<-eos
<product product-id="master_1">
    <ean/>
    <upc/>
    <unit/>
    <min-order-quantity>1.0</min-order-quantity>
    <step-quantity>1.0</step-quantity>
    <display-name xml:lang="x-default">Zerrick</display-name>
    <short-description>Dude, wear sneakers not shoes. Sweet.</short-description>
    <online-flag>true</online-flag>
    <available-flag>true</available-flag>
    <searchable-flag>true</searchable-flag>
    <images/>
    <page-attributes/>
    <custom-attributes>
        <custom-attribute attribute-id="merchPlannerCategory">Chuck Taylor</custom-attribute>
        <custom-attribute attribute-id="pillar">Sneakers</custom-attribute>
        <custom-attribute attribute-id="brandSegment">all-star</custom-attribute>
        <custom-attribute attribute-id="productType">regular</custom-attribute>
        <custom-attribute attribute-id="cut">Hi</custom-attribute>
        <custom-attribute attribute-id="gender">Kids</custom-attribute>
        <custom-attribute attribute-id="material">Canvas</custom-attribute>
        <custom-attribute attribute-id="nikeProductID"/>
        <custom-attribute attribute-id="core">false</custom-attribute>
        <custom-attribute attribute-id="instanceID">instanceId1</custom-attribute>
        <custom-attribute attribute-id="inspirationID">inspirationId1</custom-attribute>
        <custom-attribute attribute-id="pdp_template">default</custom-attribute>
        <custom-attribute attribute-id="subGender">Girls</custom-attribute>
    </custom-attributes>
    <variations>
        <attributes>
            <variation-attribute attribute-id="color" variation-attribute-id="color" slicing-attribute="false">
                <variation-attribute-values>
                    <variation-attribute-value value="green">
                        <display-value xml:lang="x-default">Green</display-value>
                    </variation-attribute-value>
                    <variation-attribute-value value="taupetx">
                        <display-value xml:lang="x-default">Taupetx</display-value>
                    </variation-attribute-value>
                    <variation-attribute-value value="black">
                        <display-value xml:lang="x-default">Black</display-value>
                    </variation-attribute-value>
                    <variation-attribute-value value="red">
                        <display-value xml:lang="x-default">Red</display-value>
                    </variation-attribute-value>
                    <variation-attribute-value value="brown">
                        <display-value xml:lang="x-default">Brown</display-value>
                    </variation-attribute-value>
                </variation-attribute-values>
            </variation-attribute>
            <variation-attribute attribute-id="sizeChart" variation-attribute-id="sizeChart">
                <variation-attribute-values>
                    <variation-attribute-value value="standard">
                        <display-value xml:lang="x-default">standard</display-value>
                    </variation-attribute-value>
                </variation-attribute-values>
            </variation-attribute>
            <variation-attribute attribute-id="size" variation-attribute-id="size">
                <variation-attribute-values>
                    <variation-attribute-value value="280">
                        <display-value xml:lang="x-default">280</display-value>
                    </variation-attribute-value>
                    <variation-attribute-value value="090">
                        <display-value xml:lang="x-default">Men 9 / Women 10.5</display-value>
                    </variation-attribute-value>
                    <variation-attribute-value value="095">
                        <display-value xml:lang="x-default">Men 9.5 / Women 11</display-value>
                    </variation-attribute-value>
                    <variation-attribute-value value="300">
                        <display-value xml:lang="x-default">300</display-value>
                    </variation-attribute-value>
                    <variation-attribute-value value="070">
                        <display-value xml:lang="x-default">Men 7 / Women 8.5</display-value>
                    </variation-attribute-value>
                    <variation-attribute-value value="XL">
                        <display-value xml:lang="x-default">XL</display-value>
                    </variation-attribute-value>
                    <variation-attribute-value value="2XL">
                        <display-value xml:lang="x-default">2XL</display-value>
                    </variation-attribute-value>
                </variation-attribute-values>
            </variation-attribute>
            <variation-attribute attribute-id="image-variation" variation-attribute-id="image-variation">
                <variation-attribute-values>
                    <variation-attribute-value value="green-standard">
                        <display-value xml:lang="x-default">green-standard</display-value>
                    </variation-attribute-value>
                    <variation-attribute-value value="taupetx-standard">
                        <display-value xml:lang="x-default">taupetx-standard</display-value>
                    </variation-attribute-value>
                    <variation-attribute-value value="black-standard">
                        <display-value xml:lang="x-default">black-standard</display-value>
                    </variation-attribute-value>
                    <variation-attribute-value value="red-standard">
                        <display-value xml:lang="x-default">red-standard</display-value>
                    </variation-attribute-value>
                    <variation-attribute-value value="brown-standard">
                        <display-value xml:lang="x-default">brown-standard</display-value>
                    </variation-attribute-value>
                </variation-attribute-values>
            </variation-attribute>
        </attributes>
        <variants>
            <variant product-id="R509M983_280"/>
            <variant product-id="M9162_090"/>
            <variant product-id="M9162_095"/>
            <variant product-id="M9163_095"/>
            <variant product-id="R503009_300"/>
            <variant product-id="M9164_070"/>
            <variant product-id="R1199_XL"/>
            <variant product-id="R1197_XL"/>
            <variant product-id="R1197_2XL"/>
        </variants>
    </variations>
</product>
eos
            result = @exporter.create_master_product(@builder, product)
            result.should == expected
        end

        it "should create a kids master outfit product with size_chart variation attribute" do
            product = get_master_product("regular")
            product.gender = "Kids"
            product.pillar = "Apparel"
            product.variation_products = get_variation_products product

            puts product.gender

            @exporter.stub(:create_master_product_images) do |product_builder, variation_products|
                product_builder.tag! "images"
            end

            expected =
<<-eos
<product product-id="master_1">
    <ean/>
    <upc/>
    <unit/>
    <min-order-quantity>1.0</min-order-quantity>
    <step-quantity>1.0</step-quantity>
    <display-name xml:lang="x-default">Zerrick</display-name>
    <short-description>Dude, wear sneakers not shoes. Sweet.</short-description>
    <online-flag>true</online-flag>
    <available-flag>true</available-flag>
    <searchable-flag>true</searchable-flag>
    <images/>
    <page-attributes/>
    <custom-attributes>
        <custom-attribute attribute-id="merchPlannerCategory">Chuck Taylor</custom-attribute>
        <custom-attribute attribute-id="pillar">Apparel</custom-attribute>
        <custom-attribute attribute-id="brandSegment">all-star</custom-attribute>
        <custom-attribute attribute-id="productType">regular</custom-attribute>
        <custom-attribute attribute-id="cut">Hi</custom-attribute>
        <custom-attribute attribute-id="gender">Kids</custom-attribute>
        <custom-attribute attribute-id="material">Canvas</custom-attribute>
        <custom-attribute attribute-id="nikeProductID"/>
        <custom-attribute attribute-id="core">false</custom-attribute>
        <custom-attribute attribute-id="instanceID">instanceId1</custom-attribute>
        <custom-attribute attribute-id="inspirationID">inspirationId1</custom-attribute>
        <custom-attribute attribute-id="pdp_template">default</custom-attribute>
        <custom-attribute attribute-id="subGender">Unisex</custom-attribute>
    </custom-attributes>
    <variations>
        <attributes>
            <variation-attribute attribute-id="color" variation-attribute-id="color" slicing-attribute="false">
                <variation-attribute-values>
                    <variation-attribute-value value="green">
                        <display-value xml:lang="x-default">Green</display-value>
                    </variation-attribute-value>
                    <variation-attribute-value value="taupetx">
                        <display-value xml:lang="x-default">Taupetx</display-value>
                    </variation-attribute-value>
                    <variation-attribute-value value="black">
                        <display-value xml:lang="x-default">Black</display-value>
                    </variation-attribute-value>
                    <variation-attribute-value value="red">
                        <display-value xml:lang="x-default">Red</display-value>
                    </variation-attribute-value>
                    <variation-attribute-value value="brown">
                        <display-value xml:lang="x-default">Brown</display-value>
                    </variation-attribute-value>
                </variation-attribute-values>
            </variation-attribute>
            <variation-attribute attribute-id="sizeChart" variation-attribute-id="sizeChart">
                <variation-attribute-values>
                    <variation-attribute-value value="standard">
                        <display-value xml:lang="x-default">standard</display-value>
                    </variation-attribute-value>
                </variation-attribute-values>
            </variation-attribute>
            <variation-attribute attribute-id="size" variation-attribute-id="size">
                <variation-attribute-values>
                    <variation-attribute-value value="280">
                        <display-value xml:lang="x-default">280</display-value>
                    </variation-attribute-value>
                    <variation-attribute-value value="090">
                        <display-value xml:lang="x-default">Men 9 / Women 10.5</display-value>
                    </variation-attribute-value>
                    <variation-attribute-value value="095">
                        <display-value xml:lang="x-default">Men 9.5 / Women 11</display-value>
                    </variation-attribute-value>
                    <variation-attribute-value value="300">
                        <display-value xml:lang="x-default">300</display-value>
                    </variation-attribute-value>
                    <variation-attribute-value value="070">
                        <display-value xml:lang="x-default">Men 7 / Women 8.5</display-value>
                    </variation-attribute-value>
                    <variation-attribute-value value="XL">
                        <display-value xml:lang="x-default">XL</display-value>
                    </variation-attribute-value>
                    <variation-attribute-value value="2XL">
                        <display-value xml:lang="x-default">2XL</display-value>
                    </variation-attribute-value>
                </variation-attribute-values>
            </variation-attribute>
            <variation-attribute attribute-id="image-variation" variation-attribute-id="image-variation">
                <variation-attribute-values>
                    <variation-attribute-value value="green-standard">
                        <display-value xml:lang="x-default">green-standard</display-value>
                    </variation-attribute-value>
                    <variation-attribute-value value="taupetx-standard">
                        <display-value xml:lang="x-default">taupetx-standard</display-value>
                    </variation-attribute-value>
                    <variation-attribute-value value="black-standard">
                        <display-value xml:lang="x-default">black-standard</display-value>
                    </variation-attribute-value>
                    <variation-attribute-value value="red-standard">
                        <display-value xml:lang="x-default">red-standard</display-value>
                    </variation-attribute-value>
                    <variation-attribute-value value="brown-standard">
                        <display-value xml:lang="x-default">brown-standard</display-value>
                    </variation-attribute-value>
                </variation-attribute-values>
            </variation-attribute>
        </attributes>
        <variants>
            <variant product-id="R509M983_280"/>
            <variant product-id="M9162_090"/>
            <variant product-id="M9162_095"/>
            <variant product-id="M9163_095"/>
            <variant product-id="R503009_300"/>
            <variant product-id="M9164_070"/>
            <variant product-id="R1199_XL"/>
            <variant product-id="R1197_XL"/>
            <variant product-id="R1197_2XL"/>
        </variants>
    </variations>
</product>
eos
            result = @exporter.create_master_product(@builder, product)
            result.should == expected
        end

        it "should create a kids master accessories product without size_chart variation attribute" do
            product = get_master_product("regular")
            product.gender = "Kids"
            product.pillar = "Accessories"
            product.variation_products = get_variation_products product

            puts product.gender

            @exporter.stub(:create_master_product_images) do |product_builder, variation_products|
                product_builder.tag! "images"
            end

            expected =
<<-eos
<product product-id="master_1">
    <ean/>
    <upc/>
    <unit/>
    <min-order-quantity>1.0</min-order-quantity>
    <step-quantity>1.0</step-quantity>
    <display-name xml:lang="x-default">Zerrick</display-name>
    <short-description>Dude, wear sneakers not shoes. Sweet.</short-description>
    <online-flag>true</online-flag>
    <available-flag>true</available-flag>
    <searchable-flag>true</searchable-flag>
    <images/>
    <page-attributes/>
    <custom-attributes>
        <custom-attribute attribute-id="merchPlannerCategory">Chuck Taylor</custom-attribute>
        <custom-attribute attribute-id="pillar">Accessories</custom-attribute>
        <custom-attribute attribute-id="brandSegment">all-star</custom-attribute>
        <custom-attribute attribute-id="productType">regular</custom-attribute>
        <custom-attribute attribute-id="cut">Hi</custom-attribute>
        <custom-attribute attribute-id="gender">Kids</custom-attribute>
        <custom-attribute attribute-id="material">Canvas</custom-attribute>
        <custom-attribute attribute-id="nikeProductID"/>
        <custom-attribute attribute-id="core">false</custom-attribute>
        <custom-attribute attribute-id="instanceID">instanceId1</custom-attribute>
        <custom-attribute attribute-id="inspirationID">inspirationId1</custom-attribute>
        <custom-attribute attribute-id="pdp_template">default</custom-attribute>
        <custom-attribute attribute-id="subGender">Unisex</custom-attribute>
    </custom-attributes>
    <variations>
        <attributes>
            <variation-attribute attribute-id="color" variation-attribute-id="color" slicing-attribute="false">
                <variation-attribute-values>
                    <variation-attribute-value value="green">
                        <display-value xml:lang="x-default">Green</display-value>
                    </variation-attribute-value>
                    <variation-attribute-value value="taupetx">
                        <display-value xml:lang="x-default">Taupetx</display-value>
                    </variation-attribute-value>
                    <variation-attribute-value value="black">
                        <display-value xml:lang="x-default">Black</display-value>
                    </variation-attribute-value>
                    <variation-attribute-value value="red">
                        <display-value xml:lang="x-default">Red</display-value>
                    </variation-attribute-value>
                    <variation-attribute-value value="brown">
                        <display-value xml:lang="x-default">Brown</display-value>
                    </variation-attribute-value>
                </variation-attribute-values>
            </variation-attribute>
            <variation-attribute attribute-id="size" variation-attribute-id="size">
                <variation-attribute-values>
                    <variation-attribute-value value="280">
                        <display-value xml:lang="x-default">280</display-value>
                    </variation-attribute-value>
                    <variation-attribute-value value="090">
                        <display-value xml:lang="x-default">Men 9 / Women 10.5</display-value>
                    </variation-attribute-value>
                    <variation-attribute-value value="095">
                        <display-value xml:lang="x-default">Men 9.5 / Women 11</display-value>
                    </variation-attribute-value>
                    <variation-attribute-value value="300">
                        <display-value xml:lang="x-default">300</display-value>
                    </variation-attribute-value>
                    <variation-attribute-value value="070">
                        <display-value xml:lang="x-default">Men 7 / Women 8.5</display-value>
                    </variation-attribute-value>
                    <variation-attribute-value value="XL">
                        <display-value xml:lang="x-default">XL</display-value>
                    </variation-attribute-value>
                    <variation-attribute-value value="2XL">
                        <display-value xml:lang="x-default">2XL</display-value>
                    </variation-attribute-value>
                </variation-attribute-values>
            </variation-attribute>
            <variation-attribute attribute-id="image-variation" variation-attribute-id="image-variation">
                <variation-attribute-values>
                    <variation-attribute-value value="green">
                        <display-value xml:lang="x-default">green</display-value>
                    </variation-attribute-value>
                    <variation-attribute-value value="taupetx">
                        <display-value xml:lang="x-default">taupetx</display-value>
                    </variation-attribute-value>
                    <variation-attribute-value value="black">
                        <display-value xml:lang="x-default">black</display-value>
                    </variation-attribute-value>
                    <variation-attribute-value value="red">
                        <display-value xml:lang="x-default">red</display-value>
                    </variation-attribute-value>
                    <variation-attribute-value value="brown">
                        <display-value xml:lang="x-default">brown</display-value>
                    </variation-attribute-value>
                </variation-attribute-values>
            </variation-attribute>
        </attributes>
        <variants>
            <variant product-id="R509M983_280"/>
            <variant product-id="M9162_090"/>
            <variant product-id="M9162_095"/>
            <variant product-id="M9163_095"/>
            <variant product-id="R503009_300"/>
            <variant product-id="M9164_070"/>
            <variant product-id="R1199_XL"/>
            <variant product-id="R1197_XL"/>
            <variant product-id="R1197_2XL"/>
        </variants>
    </variations>
</product>
eos
            result = @exporter.create_master_product(@builder, product)
            result.should == expected
        end

        it "should create product images for the dyo products" do
            expected =
<<-eos
<root>
    <images>
        <image-group view-type="hi-res">
            <image path="images/products/M9162/M9162_standard.png"/>
        </image-group>
    </images>
</root>
eos
            master_product = get_master_product("dyo")
            master_product.pillar = nil
            master_product.description = nil

            product = VariationProductMock.fromHash({
                :id => 1,
                :product_identifier => "M9162",
                :sku => "M9162",
                :online => true,
                :master_product => master_product
            })

            result = @builder.root do |root_builder|
                @exporter.create_standard_product_images root_builder, product
            end

            result.should == expected

        end

        it "should create a standard product" do
            master_product = get_master_product("regular")
            master_product.pillar = nil
            master_product.description = nil

            product = VariationProductMock.fromHash({
                :id => 1,
                :product_identifier => "M9162",
                :sku => "M9162",
                :online => true,
                :master_product => master_product
            })

            @exporter.stub(:create_standard_product_images) do |product_builder, product|
                product_builder.tag! "images"
            end

            expected =
<<-eos
<product product-id="M9162">
    <ean/>
    <upc/>
    <unit/>
    <min-order-quantity>1.0</min-order-quantity>
    <step-quantity>1.0</step-quantity>
    <display-name xml:lang="x-default">Zerrick</display-name>
    <short-description/>
    <online-flag>true</online-flag>
    <available-flag>true</available-flag>
    <searchable-flag>true</searchable-flag>
    <images/>
    <manufacturer-sku>M9162</manufacturer-sku>
    <page-attributes>
        <page-title xml:lang="x-default">Page Title</page-title>
        <page-description xml:lang="x-default">Page Description</page-description>
        <page-keywords xml:lang="x-default">Page Keywords</page-keywords>
    </page-attributes>
    <custom-attributes>
        <custom-attribute attribute-id="merchPlannerCategory">Chuck Taylor</custom-attribute>
        <custom-attribute attribute-id="pillar"/>
        <custom-attribute attribute-id="brandSegment">all-star</custom-attribute>
        <custom-attribute attribute-id="productType">regular</custom-attribute>
        <custom-attribute attribute-id="cut">Hi</custom-attribute>
        <custom-attribute attribute-id="gender">women</custom-attribute>
        <custom-attribute attribute-id="material">Canvas</custom-attribute>
        <custom-attribute attribute-id="nikeProductID"/>
        <custom-attribute attribute-id="core">false</custom-attribute>
        <custom-attribute attribute-id="instanceID">instanceId1</custom-attribute>
        <custom-attribute attribute-id="inspirationID">inspirationId1</custom-attribute>
        <custom-attribute attribute-id="pdp_template">default</custom-attribute>
        <custom-attribute attribute-id="metaSearchText">Meta Search Text</custom-attribute>
        <custom-attribute attribute-id="badging"/>
        <custom-attribute attribute-id="sizeChart">standard</custom-attribute>
    </custom-attributes>
</product>
eos
            result = @exporter.create_standard_product(@builder, product)
            result.should == expected
        end

        it "should obtain the variant attributes from a list of variant products with a physical giftcard master" do

            expected = {
                "sleeve" => { "DYO" => "DYO", "Star Power" => "Star Power", "Converse" => "Converse" },
                "value" => { 100 => 100, 150 => 150, 50 => 50 }
            }

            @pGCs = [
                get_giftcard_variation_product('gc100dyo', 'DYO', 100.0, PRODUCT_TYPE_PHYSICAL_GC),
                get_giftcard_variation_product('gc150pow', 'Star Power', 150.0, PRODUCT_TYPE_PHYSICAL_GC),
                get_giftcard_variation_product('gc50Con', 'Converse', 50.0, PRODUCT_TYPE_PHYSICAL_GC)
            ]

            result = @exporter.obtain_variation_attributes(@pGCs)
            result.should == expected
        end

        it "should obtain the variant attributes from a list of variant products with an electronic giftcard master" do

            expected = {
                "value" => { 25 => 25, 50 => 50 }
            }

            @eGCs = [
                get_giftcard_variation_product('ec25cnv', '', 25.0, PRODUCT_TYPE_ELECTRONIC_GC),
                get_giftcard_variation_product('ec50cnv', '', 50.0, PRODUCT_TYPE_ELECTRONIC_GC)
            ]

            result = @exporter.obtain_variation_attributes(@eGCs)
            result.should == expected
        end

        it "should obtain the variant attributes from a list of variant products" do
            expected = {
                "color" => {
                    "green" => "Green",
                    "taupetx" => "Taupetx",
                    "black" => "Black",
                    "red" => "Red",
                    "brown" => "Brown"
                },
                "image-variation" => {
                    "green"=>"green",
                    "taupetx"=>"taupetx",
                    "black"=>"black",
                    "red"=>"red",
                    "brown"=>"brown"
                },
                "size" => {
                    "2XL" => "2XL",
                    "280" => "280",
                    "090" => "Men 9 / Women 10.5",
                    "300" => "300",
                    "095" => "Men 9.5 / Women 11",
                    "070" => "Men 7 / Women 8.5",
                    "XL" => "XL"
                }
            }

            result = @exporter.obtain_variation_attributes(get_variation_products)
            result.should == expected
        end

        it "should create the product variation attributes without slicing" do
            variation_attributes = { "color" => { "blackle" => "Blackle", "taupetx" => "Taupetx" },
                                     "size" => { "060" => "6", "065" => "6.5", "070" => "7" } }
            expected =
<<-eos
<attributes>
    <variation-attribute attribute-id="color" variation-attribute-id="color" slicing-attribute="false">
        <variation-attribute-values>
            <variation-attribute-value value="blackle">
                <display-value xml:lang="x-default">Blackle</display-value>
            </variation-attribute-value>
            <variation-attribute-value value="taupetx">
                <display-value xml:lang="x-default">Taupetx</display-value>
            </variation-attribute-value>
        </variation-attribute-values>
    </variation-attribute>
    <variation-attribute attribute-id="size" variation-attribute-id="size">
        <variation-attribute-values>
            <variation-attribute-value value="060">
                <display-value xml:lang="x-default">6</display-value>
            </variation-attribute-value>
            <variation-attribute-value value="065">
                <display-value xml:lang="x-default">6.5</display-value>
            </variation-attribute-value>
            <variation-attribute-value value="070">
                <display-value xml:lang="x-default">7</display-value>
            </variation-attribute-value>
        </variation-attribute-values>
    </variation-attribute>
</attributes>
eos

            result = @exporter.create_product_variation_attributes(@builder, variation_attributes, false)
            result.should == expected
        end

        it "should create the product variation attributes with slicing" do
            variation_attributes = { "color" => { "blackle" => "Blackle", "taupetx" => "Taupetx" },
                                     "size" => { "060" => "6", "065" => "6.5", "070" => "7" } }
            expected =
<<-eos
<attributes>
    <variation-attribute attribute-id="color" variation-attribute-id="color" slicing-attribute="true">
        <variation-attribute-values>
            <variation-attribute-value value="blackle">
                <display-value xml:lang="x-default">Blackle</display-value>
            </variation-attribute-value>
            <variation-attribute-value value="taupetx">
                <display-value xml:lang="x-default">Taupetx</display-value>
            </variation-attribute-value>
        </variation-attribute-values>
    </variation-attribute>
    <variation-attribute attribute-id="size" variation-attribute-id="size">
        <variation-attribute-values>
            <variation-attribute-value value="060">
                <display-value xml:lang="x-default">6</display-value>
            </variation-attribute-value>
            <variation-attribute-value value="065">
                <display-value xml:lang="x-default">6.5</display-value>
            </variation-attribute-value>
            <variation-attribute-value value="070">
                <display-value xml:lang="x-default">7</display-value>
            </variation-attribute-value>
        </variation-attribute-values>
    </variation-attribute>
</attributes>
eos

            result = @exporter.create_product_variation_attributes(@builder, variation_attributes, true)
            result.should == expected
        end

        it "should obtain variants from a list of variant products" do

            expected =
<<-eos
<variants>
    <variant product-id="M9162_090"/>
    <variant product-id="M9162_095"/>
    <variant product-id="M9163_095"/>
    <variant product-id="R503009_300"/>
</variants>
eos

            result = @exporter.create_variants(@builder, get_variation_products_subset)
            result.should == expected
        end

        it "should create the catalog main element" do

            expected =
<<-eos
<catalog xmlns="http://www.demandware.com/xml/impex/catalog/2006-10-31" catalog-id="masterCatalog_Converse">
</catalog>
eos

            result = @exporter.create_catalog_main_element(@builder)
            result.should == expected
        end

        it "should ensure catalog element can contain body after its creation" do

            expected =
<<-eos
<catalog xmlns="http://www.demandware.com/xml/impex/catalog/2006-10-31" catalog-id="masterCatalog_Converse">
    <somethingelse/>
</catalog>
eos

            result = @exporter.create_catalog_main_element(@builder) do |main_builder|
                main_builder.somethingelse
            end

            result.should == expected
        end

        it "should obtain the variant attributes for Kids Apparel product" do
            master_product = get_master_product("regular")
            master_product.pillar = "Apparel"
            master_product.gender = "Kids"
            master_product.description = nil

            product = VariationProductMock.fromHash({
                :id => 1,
                :product_identifier => "M9162",
                :sku => "M9162",
                :online => true,
                :master_product => master_product,
                :size => "S",
                :color => "red",
                :size_chart => "kids-toddler"
            })

            master_product.variation_products = [ product ]

            @exporter.stub(:create_master_product_images) do |product_builder, variation_products|
                product_builder.tag! "images"
            end

            expected =
<<-eos
<product product-id="master_1">
    <ean/>
    <upc/>
    <unit/>
    <min-order-quantity>1.0</min-order-quantity>
    <step-quantity>1.0</step-quantity>
    <display-name xml:lang="x-default">Zerrick</display-name>
    <short-description/>
    <online-flag>true</online-flag>
    <available-flag>true</available-flag>
    <searchable-flag>true</searchable-flag>
    <images/>
    <page-attributes/>
    <custom-attributes>
        <custom-attribute attribute-id="merchPlannerCategory">Chuck Taylor</custom-attribute>
        <custom-attribute attribute-id="pillar">Apparel</custom-attribute>
        <custom-attribute attribute-id="brandSegment">all-star</custom-attribute>
        <custom-attribute attribute-id="productType">regular</custom-attribute>
        <custom-attribute attribute-id="cut">Hi</custom-attribute>
        <custom-attribute attribute-id="gender">Kids</custom-attribute>
        <custom-attribute attribute-id="material">Canvas</custom-attribute>
        <custom-attribute attribute-id="nikeProductID"/>
        <custom-attribute attribute-id="core">false</custom-attribute>
        <custom-attribute attribute-id="instanceID">instanceId1</custom-attribute>
        <custom-attribute attribute-id="inspirationID">inspirationId1</custom-attribute>
        <custom-attribute attribute-id="pdp_template">default</custom-attribute>
        <custom-attribute attribute-id="subGender">Unisex</custom-attribute>
    </custom-attributes>
    <variations>
        <attributes>
            <variation-attribute attribute-id="color" variation-attribute-id="color" slicing-attribute="false">
                <variation-attribute-values>
                    <variation-attribute-value value="red">
                        <display-value xml:lang="x-default">Red</display-value>
                    </variation-attribute-value>
                </variation-attribute-values>
            </variation-attribute>
            <variation-attribute attribute-id="sizeChart" variation-attribute-id="sizeChart">
                <variation-attribute-values>
                    <variation-attribute-value value="kids-toddler">
                        <display-value xml:lang="x-default">kids-toddler</display-value>
                    </variation-attribute-value>
                </variation-attribute-values>
            </variation-attribute>
            <variation-attribute attribute-id="size" variation-attribute-id="size">
                <variation-attribute-values>
                    <variation-attribute-value value="S">
                        <display-value xml:lang="x-default">S (1 - 3.5 yrs)</display-value>
                    </variation-attribute-value>
                </variation-attribute-values>
            </variation-attribute>
            <variation-attribute attribute-id="image-variation" variation-attribute-id="image-variation">
                <variation-attribute-values>
                    <variation-attribute-value value="red-kids-toddler">
                        <display-value xml:lang="x-default">red-kids-toddler</display-value>
                    </variation-attribute-value>
                </variation-attribute-values>
            </variation-attribute>
        </attributes>
        <variants>
            <variant product-id="M9162"/>
        </variants>
    </variations>
</product>
eos

            result = @exporter.create_master_product(@builder, master_product)

            result.should == expected
        end

        it "should create variation products with searchable_flag not set" do

            expected =
<<-eos
<root>
    <product product-id="M9162_095">
        <ean/>
        <upc/>
        <unit/>
        <min-order-quantity>1.0</min-order-quantity>
        <step-quantity>1.0</step-quantity>
        <online-flag>true</online-flag>
        <available-flag>true</available-flag>
        <searchable-flag>true</searchable-flag>
        <searchable-if-unavailable-flag>false</searchable-if-unavailable-flag>
        <manufacturer-sku>M9162</manufacturer-sku>
        <page-attributes>
            <page-title xml:lang="x-default">Page Title</page-title>
            <page-description xml:lang="x-default">Page Description</page-description>
            <page-keywords xml:lang="x-default">Page Keywords</page-keywords>
        </page-attributes>
        <custom-attributes>
            <custom-attribute attribute-id="color">taupetx</custom-attribute>
            <custom-attribute attribute-id="image-variation">taupetx</custom-attribute>
            <custom-attribute attribute-id="size">095</custom-attribute>
            <custom-attribute attribute-id="refinementSize">Men 9.5 / Women 11</custom-attribute>
            <custom-attribute attribute-id="mainColorHex"/>
            <custom-attribute attribute-id="accentColorHex"/>
            <custom-attribute attribute-id="dyoVersionProductID">dyoVerProdId</custom-attribute>
            <custom-attribute attribute-id="dyoVersionInspirationID">dyoVerInspProdId</custom-attribute>
            <custom-attribute attribute-id="badging"/>
            <custom-attribute attribute-id="sizeChart">standard</custom-attribute>
            <custom-attribute attribute-id="sizeChartMessaging"/>
            <custom-attribute attribute-id="maxOrderQuantity"/>
            <custom-attribute attribute-id="showIfOutOfStock">false</custom-attribute>
            <custom-attribute attribute-id="outOfStockMessage"/>
            <custom-attribute attribute-id="metaSearchText">Meta Search Text</custom-attribute>
        </custom-attributes>
    </product>
</root>
eos
            variation_products =   [
                VariationProductMock.fromHash({:id => 1, :product_identifier => "M9162_095", :sku => "M9162", :color => "taupetx", :size => "095", :master_product => nil})
            ]
            result = @builder.root do |root_builder|
                @exporter.create_variation_products root_builder, variation_products
            end

            result.should == expected
        end

        it "should create variation products with searchable_flag true" do

            expected =
<<-eos
<root>
    <product product-id="M9162_095">
        <ean/>
        <upc/>
        <unit/>
        <min-order-quantity>1.0</min-order-quantity>
        <step-quantity>1.0</step-quantity>
        <online-flag>true</online-flag>
        <available-flag>true</available-flag>
        <searchable-flag>true</searchable-flag>
        <searchable-if-unavailable-flag>false</searchable-if-unavailable-flag>
        <manufacturer-sku>M9162</manufacturer-sku>
        <page-attributes>
            <page-title xml:lang="x-default">Page Title</page-title>
            <page-description xml:lang="x-default">Page Description</page-description>
            <page-keywords xml:lang="x-default">Page Keywords</page-keywords>
        </page-attributes>
        <custom-attributes>
            <custom-attribute attribute-id="color">taupetx</custom-attribute>
            <custom-attribute attribute-id="image-variation">taupetx</custom-attribute>
            <custom-attribute attribute-id="size">095</custom-attribute>
            <custom-attribute attribute-id="refinementSize">Men 9.5 / Women 11</custom-attribute>
            <custom-attribute attribute-id="mainColorHex"/>
            <custom-attribute attribute-id="accentColorHex"/>
            <custom-attribute attribute-id="dyoVersionProductID">dyoVerProdId</custom-attribute>
            <custom-attribute attribute-id="dyoVersionInspirationID">dyoVerInspProdId</custom-attribute>
            <custom-attribute attribute-id="badging"/>
            <custom-attribute attribute-id="sizeChart">standard</custom-attribute>
            <custom-attribute attribute-id="sizeChartMessaging"/>
            <custom-attribute attribute-id="maxOrderQuantity"/>
            <custom-attribute attribute-id="showIfOutOfStock">false</custom-attribute>
            <custom-attribute attribute-id="outOfStockMessage"/>
            <custom-attribute attribute-id="metaSearchText">Meta Search Text</custom-attribute>
        </custom-attributes>
    </product>
</root>
eos
            master_product = nil
            variation_products =   [
                VariationProductMock.fromHash({:id => 1, :product_identifier => "M9162_095", :sku => "M9162", :searchable_flag => true, :color => "taupetx", :size => "095", :master_product => master_product})
            ]
            result = @builder.root do |root_builder|
                @exporter.create_variation_products root_builder, variation_products
            end

            result.should == expected
        end

        it "should create variation products with searchable_flag false" do

            expected =
<<-eos
<root>
    <product product-id="M9162_095">
        <ean/>
        <upc/>
        <unit/>
        <min-order-quantity>1.0</min-order-quantity>
        <step-quantity>1.0</step-quantity>
        <online-flag>true</online-flag>
        <available-flag>true</available-flag>
        <searchable-flag>false</searchable-flag>
        <searchable-if-unavailable-flag>false</searchable-if-unavailable-flag>
        <manufacturer-sku>M9162</manufacturer-sku>
        <page-attributes>
            <page-title xml:lang="x-default">Page Title</page-title>
            <page-description xml:lang="x-default">Page Description</page-description>
            <page-keywords xml:lang="x-default">Page Keywords</page-keywords>
        </page-attributes>
        <custom-attributes>
            <custom-attribute attribute-id="color">taupetx</custom-attribute>
            <custom-attribute attribute-id="image-variation">taupetx</custom-attribute>
            <custom-attribute attribute-id="size">095</custom-attribute>
            <custom-attribute attribute-id="refinementSize">Men 9.5 / Women 11</custom-attribute>
            <custom-attribute attribute-id="mainColorHex"/>
            <custom-attribute attribute-id="accentColorHex"/>
            <custom-attribute attribute-id="dyoVersionProductID">dyoVerProdId</custom-attribute>
            <custom-attribute attribute-id="dyoVersionInspirationID">dyoVerInspProdId</custom-attribute>
            <custom-attribute attribute-id="badging"/>
            <custom-attribute attribute-id="sizeChart">standard</custom-attribute>
            <custom-attribute attribute-id="sizeChartMessaging"/>
            <custom-attribute attribute-id="maxOrderQuantity"/>
            <custom-attribute attribute-id="showIfOutOfStock">false</custom-attribute>
            <custom-attribute attribute-id="outOfStockMessage"/>
            <custom-attribute attribute-id="metaSearchText">Meta Search Text</custom-attribute>
        </custom-attributes>
    </product>
</root>
eos
            master_product = nil
            variation_products =   [
                VariationProductMock.fromHash({:id => 1, :product_identifier => "M9162_095", :sku => "M9162", :searchable_flag => false, :color => "taupetx", :size => "095", :master_product => master_product})
            ]
            result = @builder.root do |root_builder|
                @exporter.create_variation_products root_builder, variation_products
            end

            result.should == expected
        end


        it "should create a master product with searchable_flag true" do
            master_product = get_master_product("regular")
            master_product.searchable_flag = true
            master_product.variation_products = [
                VariationProductMock.fromHash({:id => 1, :product_identifier => "M9162_100", :sku => "M9162", :color => "taupetx", :size => "100", :master_product => master_product})
            ]

            @exporter.stub(:create_master_product_images) do |product_builder, variation_products|
                product_builder.tag! "images"
            end

            expected =
<<-eos
<product product-id="master_1">
    <ean/>
    <upc/>
    <unit/>
    <min-order-quantity>1.0</min-order-quantity>
    <step-quantity>1.0</step-quantity>
    <display-name xml:lang="x-default">Zerrick</display-name>
    <short-description>Dude, wear sneakers not shoes. Sweet.</short-description>
    <online-flag>true</online-flag>
    <available-flag>true</available-flag>
    <searchable-flag>true</searchable-flag>
    <images/>
    <page-attributes/>
    <custom-attributes>
        <custom-attribute attribute-id="merchPlannerCategory">Chuck Taylor</custom-attribute>
        <custom-attribute attribute-id="pillar">Chuck Taylor</custom-attribute>
        <custom-attribute attribute-id="brandSegment">all-star</custom-attribute>
        <custom-attribute attribute-id="productType">regular</custom-attribute>
        <custom-attribute attribute-id="cut">Hi</custom-attribute>
        <custom-attribute attribute-id="gender">women</custom-attribute>
        <custom-attribute attribute-id="material">Canvas</custom-attribute>
        <custom-attribute attribute-id="nikeProductID"/>
        <custom-attribute attribute-id="core">false</custom-attribute>
        <custom-attribute attribute-id="instanceID">instanceId1</custom-attribute>
        <custom-attribute attribute-id="inspirationID">inspirationId1</custom-attribute>
        <custom-attribute attribute-id="pdp_template">default</custom-attribute>
    </custom-attributes>
    <variations>
        <attributes>
            <variation-attribute attribute-id="color" variation-attribute-id="color" slicing-attribute="false">
                <variation-attribute-values>
                    <variation-attribute-value value="taupetx">
                        <display-value xml:lang="x-default">Taupetx</display-value>
                    </variation-attribute-value>
                </variation-attribute-values>
            </variation-attribute>
            <variation-attribute attribute-id="size" variation-attribute-id="size">
                <variation-attribute-values>
                    <variation-attribute-value value="100">
                        <display-value xml:lang="x-default">Men 10 / Women 11.5</display-value>
                    </variation-attribute-value>
                </variation-attribute-values>
            </variation-attribute>
            <variation-attribute attribute-id="image-variation" variation-attribute-id="image-variation">
                <variation-attribute-values>
                    <variation-attribute-value value="taupetx">
                        <display-value xml:lang="x-default">taupetx</display-value>
                    </variation-attribute-value>
                </variation-attribute-values>
            </variation-attribute>
        </attributes>
        <variants>
            <variant product-id="M9162_100"/>
        </variants>
    </variations>
</product>
eos
            result = @exporter.create_master_product(@builder, master_product)
            result.should == expected
        end

        it "should create a master product with searchable_flag false" do
            master_product = get_master_product("regular")
            master_product.searchable_flag = false
            master_product.variation_products = [
                VariationProductMock.fromHash({:id => 1, :product_identifier => "M9162_100", :sku => "M9162", :color => "taupetx", :size => "100", :master_product => master_product})
            ]

            @exporter.stub(:create_master_product_images) do |product_builder, variation_products|
                product_builder.tag! "images"
            end

            expected =
<<-eos
<product product-id="master_1">
    <ean/>
    <upc/>
    <unit/>
    <min-order-quantity>1.0</min-order-quantity>
    <step-quantity>1.0</step-quantity>
    <display-name xml:lang="x-default">Zerrick</display-name>
    <short-description>Dude, wear sneakers not shoes. Sweet.</short-description>
    <online-flag>true</online-flag>
    <available-flag>true</available-flag>
    <searchable-flag>false</searchable-flag>
    <images/>
    <page-attributes/>
    <custom-attributes>
        <custom-attribute attribute-id="merchPlannerCategory">Chuck Taylor</custom-attribute>
        <custom-attribute attribute-id="pillar">Chuck Taylor</custom-attribute>
        <custom-attribute attribute-id="brandSegment">all-star</custom-attribute>
        <custom-attribute attribute-id="productType">regular</custom-attribute>
        <custom-attribute attribute-id="cut">Hi</custom-attribute>
        <custom-attribute attribute-id="gender">women</custom-attribute>
        <custom-attribute attribute-id="material">Canvas</custom-attribute>
        <custom-attribute attribute-id="nikeProductID"/>
        <custom-attribute attribute-id="core">false</custom-attribute>
        <custom-attribute attribute-id="instanceID">instanceId1</custom-attribute>
        <custom-attribute attribute-id="inspirationID">inspirationId1</custom-attribute>
        <custom-attribute attribute-id="pdp_template">default</custom-attribute>
    </custom-attributes>
    <variations>
        <attributes>
            <variation-attribute attribute-id="color" variation-attribute-id="color" slicing-attribute="false">
                <variation-attribute-values>
                    <variation-attribute-value value="taupetx">
                        <display-value xml:lang="x-default">Taupetx</display-value>
                    </variation-attribute-value>
                </variation-attribute-values>
            </variation-attribute>
            <variation-attribute attribute-id="size" variation-attribute-id="size">
                <variation-attribute-values>
                    <variation-attribute-value value="100">
                        <display-value xml:lang="x-default">Men 10 / Women 11.5</display-value>
                    </variation-attribute-value>
                </variation-attribute-values>
            </variation-attribute>
            <variation-attribute attribute-id="image-variation" variation-attribute-id="image-variation">
                <variation-attribute-values>
                    <variation-attribute-value value="taupetx">
                        <display-value xml:lang="x-default">taupetx</display-value>
                    </variation-attribute-value>
                </variation-attribute-values>
            </variation-attribute>
        </attributes>
        <variants>
            <variant product-id="M9162_100"/>
        </variants>
    </variations>
</product>
eos
            result = @exporter.create_master_product(@builder, master_product)
            result.should == expected
        end

        it "should create a variation product with max_order_quantity" do
            master_product = get_master_product("regular")
            max_order_quantity_variation_product = [
                VariationProductMock.fromHash({:id => 1, :product_identifier => "M9162_090", :sku => "M9162", :color => "taupetx", :size => "090", :max_order_quantity => 7, :master_product => master_product})
            ]

                expected =
<<-eos
<root>
    <product product-id="M9162_090">
        <ean/>
        <upc/>
        <unit/>
        <min-order-quantity>1.0</min-order-quantity>
        <step-quantity>1.0</step-quantity>
        <online-flag>true</online-flag>
        <available-flag>true</available-flag>
        <searchable-flag>true</searchable-flag>
        <searchable-if-unavailable-flag>false</searchable-if-unavailable-flag>
        <manufacturer-sku>M9162</manufacturer-sku>
        <page-attributes>
            <page-title xml:lang="x-default">Page Title</page-title>
            <page-description xml:lang="x-default">Page Description</page-description>
            <page-keywords xml:lang="x-default">Page Keywords</page-keywords>
        </page-attributes>
        <custom-attributes>
            <custom-attribute attribute-id="color">taupetx</custom-attribute>
            <custom-attribute attribute-id="image-variation">taupetx</custom-attribute>
            <custom-attribute attribute-id="size">090</custom-attribute>
            <custom-attribute attribute-id="refinementSize">Men 9 / Women 10.5</custom-attribute>
            <custom-attribute attribute-id="mainColorHex"/>
            <custom-attribute attribute-id="accentColorHex"/>
            <custom-attribute attribute-id="dyoVersionProductID">dyoVerProdId</custom-attribute>
            <custom-attribute attribute-id="dyoVersionInspirationID">dyoVerInspProdId</custom-attribute>
            <custom-attribute attribute-id="badging"/>
            <custom-attribute attribute-id="sizeChart">standard</custom-attribute>
            <custom-attribute attribute-id="sizeChartMessaging"/>
            <custom-attribute attribute-id="maxOrderQuantity">7</custom-attribute>
            <custom-attribute attribute-id="showIfOutOfStock">false</custom-attribute>
            <custom-attribute attribute-id="outOfStockMessage"/>
            <custom-attribute attribute-id="metaSearchText">Meta Search Text</custom-attribute>
        </custom-attributes>
    </product>
</root>
eos

                result = @builder.root do |root_builder|
                    @exporter.create_variation_products root_builder, max_order_quantity_variation_product
                end

                result.should == expected
        end

        it "should create a variation product with max_order_quantity empty" do
            master_product = get_master_product("regular")
            max_order_quantity_variation_product = [
                VariationProductMock.fromHash({:id => 1, :product_identifier => "M9162_090", :sku => "M9162", :color => "taupetx", :size => "090", :max_order_quantity => nil, :master_product => master_product})
            ]

                expected =
<<-eos
<root>
    <product product-id="M9162_090">
        <ean/>
        <upc/>
        <unit/>
        <min-order-quantity>1.0</min-order-quantity>
        <step-quantity>1.0</step-quantity>
        <online-flag>true</online-flag>
        <available-flag>true</available-flag>
        <searchable-flag>true</searchable-flag>
        <searchable-if-unavailable-flag>false</searchable-if-unavailable-flag>
        <manufacturer-sku>M9162</manufacturer-sku>
        <page-attributes>
            <page-title xml:lang="x-default">Page Title</page-title>
            <page-description xml:lang="x-default">Page Description</page-description>
            <page-keywords xml:lang="x-default">Page Keywords</page-keywords>
        </page-attributes>
        <custom-attributes>
            <custom-attribute attribute-id="color">taupetx</custom-attribute>
            <custom-attribute attribute-id="image-variation">taupetx</custom-attribute>
            <custom-attribute attribute-id="size">090</custom-attribute>
            <custom-attribute attribute-id="refinementSize">Men 9 / Women 10.5</custom-attribute>
            <custom-attribute attribute-id="mainColorHex"/>
            <custom-attribute attribute-id="accentColorHex"/>
            <custom-attribute attribute-id="dyoVersionProductID">dyoVerProdId</custom-attribute>
            <custom-attribute attribute-id="dyoVersionInspirationID">dyoVerInspProdId</custom-attribute>
            <custom-attribute attribute-id="badging"/>
            <custom-attribute attribute-id="sizeChart">standard</custom-attribute>
            <custom-attribute attribute-id="sizeChartMessaging"/>
            <custom-attribute attribute-id="maxOrderQuantity"/>
            <custom-attribute attribute-id="showIfOutOfStock">false</custom-attribute>
            <custom-attribute attribute-id="outOfStockMessage"/>
            <custom-attribute attribute-id="metaSearchText">Meta Search Text</custom-attribute>
        </custom-attributes>
    </product>
</root>
eos

                result = @builder.root do |root_builder|
                    @exporter.create_variation_products root_builder, max_order_quantity_variation_product
                end

                result.should == expected
        end

        it "should create a variation product with max_order_quantity empty when attribute is ''" do
            master_product = get_master_product("regular")
            max_order_quantity_variation_product = [
                VariationProductMock.fromHash({:id => 1, :product_identifier => "M9162_090", :sku => "M9162", :color => "taupetx", :size => "090", :max_order_quantity => '', :master_product => master_product})
            ]

                expected =
<<-eos
<root>
    <product product-id="M9162_090">
        <ean/>
        <upc/>
        <unit/>
        <min-order-quantity>1.0</min-order-quantity>
        <step-quantity>1.0</step-quantity>
        <online-flag>true</online-flag>
        <available-flag>true</available-flag>
        <searchable-flag>true</searchable-flag>
        <searchable-if-unavailable-flag>false</searchable-if-unavailable-flag>
        <manufacturer-sku>M9162</manufacturer-sku>
        <page-attributes>
            <page-title xml:lang="x-default">Page Title</page-title>
            <page-description xml:lang="x-default">Page Description</page-description>
            <page-keywords xml:lang="x-default">Page Keywords</page-keywords>
        </page-attributes>
        <custom-attributes>
            <custom-attribute attribute-id="color">taupetx</custom-attribute>
            <custom-attribute attribute-id="image-variation">taupetx</custom-attribute>
            <custom-attribute attribute-id="size">090</custom-attribute>
            <custom-attribute attribute-id="refinementSize">Men 9 / Women 10.5</custom-attribute>
            <custom-attribute attribute-id="mainColorHex"/>
            <custom-attribute attribute-id="accentColorHex"/>
            <custom-attribute attribute-id="dyoVersionProductID">dyoVerProdId</custom-attribute>
            <custom-attribute attribute-id="dyoVersionInspirationID">dyoVerInspProdId</custom-attribute>
            <custom-attribute attribute-id="badging"/>
            <custom-attribute attribute-id="sizeChart">standard</custom-attribute>
            <custom-attribute attribute-id="sizeChartMessaging"/>
            <custom-attribute attribute-id="maxOrderQuantity"/>
            <custom-attribute attribute-id="showIfOutOfStock">false</custom-attribute>
            <custom-attribute attribute-id="outOfStockMessage"/>
            <custom-attribute attribute-id="metaSearchText">Meta Search Text</custom-attribute>
        </custom-attributes>
    </product>
</root>
eos

                result = @builder.root do |root_builder|
                    @exporter.create_variation_products root_builder, max_order_quantity_variation_product
                end

                result.should == expected
        end

        it "should create a variation product with 'out of stock' false" do
            master_product = get_master_product("regular")
            max_order_quantity_variation_product = [
                VariationProductMock.fromHash({:id => 1, :product_identifier => "M9162_090", :sku => "M9162", :color => "taupetx", :size => "090", :show_if_out_of_stock => false, :out_of_stock_message => "", :master_product => master_product})
            ]

                expected =
<<-eos
<root>
    <product product-id="M9162_090">
        <ean/>
        <upc/>
        <unit/>
        <min-order-quantity>1.0</min-order-quantity>
        <step-quantity>1.0</step-quantity>
        <online-flag>true</online-flag>
        <available-flag>true</available-flag>
        <searchable-flag>true</searchable-flag>
        <searchable-if-unavailable-flag>false</searchable-if-unavailable-flag>
        <manufacturer-sku>M9162</manufacturer-sku>
        <page-attributes>
            <page-title xml:lang="x-default">Page Title</page-title>
            <page-description xml:lang="x-default">Page Description</page-description>
            <page-keywords xml:lang="x-default">Page Keywords</page-keywords>
        </page-attributes>
        <custom-attributes>
            <custom-attribute attribute-id="color">taupetx</custom-attribute>
            <custom-attribute attribute-id="image-variation">taupetx</custom-attribute>
            <custom-attribute attribute-id="size">090</custom-attribute>
            <custom-attribute attribute-id="refinementSize">Men 9 / Women 10.5</custom-attribute>
            <custom-attribute attribute-id="mainColorHex"/>
            <custom-attribute attribute-id="accentColorHex"/>
            <custom-attribute attribute-id="dyoVersionProductID">dyoVerProdId</custom-attribute>
            <custom-attribute attribute-id="dyoVersionInspirationID">dyoVerInspProdId</custom-attribute>
            <custom-attribute attribute-id="badging"/>
            <custom-attribute attribute-id="sizeChart">standard</custom-attribute>
            <custom-attribute attribute-id="sizeChartMessaging"/>
            <custom-attribute attribute-id="maxOrderQuantity"/>
            <custom-attribute attribute-id="showIfOutOfStock">false</custom-attribute>
            <custom-attribute attribute-id="outOfStockMessage"/>
            <custom-attribute attribute-id="metaSearchText">Meta Search Text</custom-attribute>
        </custom-attributes>
    </product>
</root>
eos

                result = @builder.root do |root_builder|
                    @exporter.create_variation_products root_builder, max_order_quantity_variation_product
                end

                result.should == expected
        end

        it "should create a variation product with 'out of stock' true and 'out_of_stock_message'" do
            master_product = get_master_product("regular")
            max_order_quantity_variation_product = [
                VariationProductMock.fromHash({:id => 1, :product_identifier => "M9162_090", :sku => "M9162", :color => "taupetx", :size => "090", :show_if_out_of_stock => true, :out_of_stock_message => "Out Of Stock Message", :master_product => master_product})
            ]

                expected =
<<-eos
<root>
    <product product-id="M9162_090">
        <ean/>
        <upc/>
        <unit/>
        <min-order-quantity>1.0</min-order-quantity>
        <step-quantity>1.0</step-quantity>
        <online-flag>true</online-flag>
        <available-flag>true</available-flag>
        <searchable-flag>true</searchable-flag>
        <searchable-if-unavailable-flag>true</searchable-if-unavailable-flag>
        <manufacturer-sku>M9162</manufacturer-sku>
        <page-attributes>
            <page-title xml:lang="x-default">Page Title</page-title>
            <page-description xml:lang="x-default">Page Description</page-description>
            <page-keywords xml:lang="x-default">Page Keywords</page-keywords>
        </page-attributes>
        <custom-attributes>
            <custom-attribute attribute-id="color">taupetx</custom-attribute>
            <custom-attribute attribute-id="image-variation">taupetx</custom-attribute>
            <custom-attribute attribute-id="size">090</custom-attribute>
            <custom-attribute attribute-id="refinementSize">Men 9 / Women 10.5</custom-attribute>
            <custom-attribute attribute-id="mainColorHex"/>
            <custom-attribute attribute-id="accentColorHex"/>
            <custom-attribute attribute-id="dyoVersionProductID">dyoVerProdId</custom-attribute>
            <custom-attribute attribute-id="dyoVersionInspirationID">dyoVerInspProdId</custom-attribute>
            <custom-attribute attribute-id="badging"/>
            <custom-attribute attribute-id="sizeChart">standard</custom-attribute>
            <custom-attribute attribute-id="sizeChartMessaging"/>
            <custom-attribute attribute-id="maxOrderQuantity"/>
            <custom-attribute attribute-id="showIfOutOfStock">true</custom-attribute>
            <custom-attribute attribute-id="outOfStockMessage">Out Of Stock Message</custom-attribute>
            <custom-attribute attribute-id="metaSearchText">Meta Search Text</custom-attribute>
        </custom-attributes>
    </product>
</root>
eos

                result = @builder.root do |root_builder|
                    @exporter.create_variation_products root_builder, max_order_quantity_variation_product
                end

                result.should == expected
        end

    end

end
