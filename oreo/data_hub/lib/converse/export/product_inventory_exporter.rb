require 'rubygems'

require 'converse/logging'
require 'converse/models/product_inventory'
require 'converse/models/variation_product'
require 'converse/xml/xml_document_builder'

module Converse
    module Impex

        class ProductInventoryExporter < Converse::Xml::XmlDocumentBuilder
            include Converse::Logging

            def initialize(options, logger = nil, list_id = "inventory_Converse_US", description = "Product Sku inventory")
                super :output_directory => options['output_directory'], :output_file_prefix => "inventory"
                @logger = logger.nil? ? setup_logger(self.class) : logger

                @list_id = list_id
                @description = description
            end

            def build_xml(xml)
                @logger.debug "Building product inventory XML..."
                xml.inventory :xmlns => "http://www.demandware.com/xml/impex/inventory/2007-05-31" do
                    xml.tag! "inventory-list" do
                        create_header xml
                        create_records xml
                    end
                end

                @processed_file_paths.push(xml.target!.path)
            end

            def create_header(xml)
                @logger.debug "Creating product inventory XML header..."
                xml.header("list-id" => @list_id) do
                    xml.tag! "default-instock", false
                    xml.description @description
                    xml.tag! "use-bundle-inventory-only", false
                end
            end

            def create_records(xml)
                @logger.debug "Creating product inventory XML records..."
                xml.records do
                    ProductInventory.joins(:variation_product).find_each(
                        :include => :variation_product,
                        :batch_size => 500
                    ) do |product_inventory|
                        create_record(xml, product_inventory)
                    end
                end
            end

            def create_record(xml, product_inventory)
                @logger.debug "Creating product inventory XML record for product \"#{product_inventory.variation_product.product_identifier}\"..."
                xml.record("product-id" => product_inventory.variation_product.product_identifier) do
                    allocation = product_inventory.allocation.blank? ? 0 : product_inventory.allocation 

                    if product_inventory.perpetual
                        xml.allocation 0
                        xml.perpetual product_inventory.perpetual
                    else   
                        xml.allocation allocation

                        if product_inventory.is_backordered
                            xml.tag! "preorder-backorder-handling", product_inventory.preorder_backorder || "backorder"
                            xml.tag! "preorder-backorder-allocation", product_inventory.po_allocation
                            xml.tag! "in-stock-date", product_inventory.in_stock_date
                        else
                            xml.tag! "preorder-backorder-handling", "none"
                        end
                    end   
                end
            end
        end
    end
end

