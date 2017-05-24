require 'log4r'

require 'rspec'
require_relative 'support/spec_helper'
require 'converse/export/price_books_exporter'

describe Converse::Impex::DefaultPriceBooksExporter do
    context "export sales price books" do

        it "should name the price book according to DW conventions" do

            builder = Builder::XmlMarkup.new(:indent => 4)

            optionsMock = {}
            loggerMock = Logger.new "specs.log"

            defaultExporter = Converse::Impex::DefaultPriceBooksExporter.new(optionsMock, loggerMock)

            defaultExporter.get_product_repository().stub(:get_us_products_with_prices).and_return([{
                :identifier => '121212C',
                :sku => '121212C',
                :price => 74,
                :is_master_product => false
            }])

            defaultExporter.get_product_repository().stub(:get_uk_products_with_prices).and_return([{
                :identifier => '121213C',
                :sku => '121213C',
                :price => 65,
                :is_master_product => false
            },
            {
                :identifier => '121214C',
                :sku => '121214C',
                :price => 70,
                :is_master_product => false
            }])

            expected =
<<-eos
<pricebooks xmlns="http://www.demandware.com/xml/impex/pricebook/2006-10-31">
    <pricebook>
        <header pricebook-id="retailPricebook_Converse_US">
            <currency>USD</currency>
            <display-name xml:lang="x-default">Default US Price Book</display-name>
            <online-flag>true</online-flag>
        </header>
        <price-tables>
            <price-table product-id="121212C">
                <amount quantity="1">74</amount>
            </price-table>
        </price-tables>
    </pricebook>
    <pricebook>
        <header pricebook-id="retailPricebook_Converse_UK">
            <currency>GBP</currency>
            <display-name xml:lang="x-default">Default UK Price Book</display-name>
            <online-flag>true</online-flag>
        </header>
        <price-tables>
            <price-table product-id="121213C">
                <amount quantity="1">65</amount>
            </price-table>
            <price-table product-id="121214C">
                <amount quantity="1">70</amount>
            </price-table>
        </price-tables>
    </pricebook>
</pricebooks>
eos

            result = defaultExporter.build_pricebooks(builder)
            result.should == expected

        end

    end
end
