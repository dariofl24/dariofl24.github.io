require 'rubygems'
require 'active_record'

require "converse/models/abstract_model"

class Customer < AbstractModel
    self.table_name = "tbl_Customer"
    has_many :addresses, :class_name => "CustomerAddress", :foreign_key => "signup_id", :primary_key => "signup_id", :dependent => :destroy
    has_one :employee, :foreign_key => "signup_id", :primary_key => "signup_id"
end
