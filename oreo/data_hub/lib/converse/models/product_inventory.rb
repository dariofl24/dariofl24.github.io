require 'rubygems'
require 'active_record'

require "converse/models/abstract_model"

class ProductInventory < AbstractModel
    self.table_name = "tbl_ProductInventory"
    belongs_to :variation_product

    def is_backordered
        !in_stock_date.blank? && po_allocation > 0
    end
end
