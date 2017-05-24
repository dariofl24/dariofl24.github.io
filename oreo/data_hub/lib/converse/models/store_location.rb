require 'rubygems'
require 'active_record'

require "converse/models/abstract_model"
require "converse/models/store"

class StoreLocation < AbstractModel
    self.table_name = "tbl_StoreLocation"
    belongs_to :store
end
