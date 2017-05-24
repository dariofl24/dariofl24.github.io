require 'rubygems'
require 'active_record'

require "converse/models/abstract_model"

class Employee < AbstractModel
    self.table_name = "tbl_Employee"
    has_many :relatives, :class_name => "EmployeeRelative", :foreign_key => "signup_id", :primary_key => "employee_id", :dependent => :destroy
end
