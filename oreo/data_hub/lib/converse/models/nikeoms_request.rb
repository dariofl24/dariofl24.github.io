require 'rubygems'
require 'active_record'

require "converse/models/abstract_model"

class NikeOMSRequest < AbstractModel
    self.table_name = "tbl_NikeOMSRequest"
end
