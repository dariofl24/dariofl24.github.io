require 'rubygems'
require 'active_record'

require "converse/models/store"

class USAStore < Store
    self.table_name = "tbl_Store_USA"

    OUTLET_REGEX = /6000[\d]{3}/

    def type
        Store::TYPE[:US]
    end

    def country
        Store::COUNTRY[:US]
    end

    def outlet?
        !OUTLET_REGEX.match(account_no).nil?
    end
end
