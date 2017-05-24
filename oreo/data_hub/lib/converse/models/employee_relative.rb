require 'rubygems'
require 'active_record'

require "converse/models/abstract_model"

class EmployeeRelative < AbstractModel
    self.table_name = "tbl_EmployeeRelative"
    belongs_to :employee
end
