require 'rubygems'
require 'active_record'

require "converse/models/abstract_model"

class MerchPlannerInfo < AbstractModel
    self.table_name = "tbl_MerchPlannerInfo"
end
