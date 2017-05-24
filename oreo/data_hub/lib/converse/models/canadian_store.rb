require 'rubygems'
require 'active_record'

require "converse/models/store"

class CanadianStore < Store
    self.table_name = "tbl_Store_Canada"

    def type
        Store::TYPE[:CA]
    end

    def country
        Store::COUNTRY[:CA]
    end
end
