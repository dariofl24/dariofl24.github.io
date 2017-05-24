require 'rubygems'
require 'active_record'

require "converse/models/abstract_model"

class ProductPrice < AbstractModel
    self.table_name = "tbl_ProductPrice"
    belongs_to :variation_product
end
