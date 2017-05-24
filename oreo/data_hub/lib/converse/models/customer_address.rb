require 'rubygems'
require 'active_record'

require "converse/models/abstract_model"

class CustomerAddress < AbstractModel
    self.table_name = "tbl_CustomerAddress"
    belongs_to :customer
end
