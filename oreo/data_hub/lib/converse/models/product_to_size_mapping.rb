require 'rubygems'
require 'active_record'

require "converse/models/abstract_model"

class ProductToSizeMapping < AbstractModel
    self.table_name = "tbl_ProductToSizeMapping"
end