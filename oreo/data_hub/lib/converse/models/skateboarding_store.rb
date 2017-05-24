require 'rubygems'
require 'active_record'

require "converse/models/store"

class SkateboardingStore < Store
    self.table_name = "tbl_Store_Skateboarding"

    def type
        Store::TYPE[:SKATEBOARDING]
    end

    def country
        Store::COUNTRY[:US]
    end

    def latitude
       lat
    end

    def longitude
       lng
    end
end
