require 'rubygems'
require 'active_record'

require 'converse/constants'
require "converse/models/abstract_model"

include Converse::Constants

module MasterProductCommon
    def electronic_giftcard?
        product_type == PRODUCT_TYPE_ELECTRONIC_GC
    end

    def physical_giftcard?
        product_type == PRODUCT_TYPE_PHYSICAL_GC
    end

    def giftcard?
        electronic_giftcard? || physical_giftcard?
    end

    def is_kids?
        gender.downcase == PRODUCT_GENDER_KIDS || gender.downcase == PRODUCT_GENDER_BOYS || gender.downcase == PRODUCT_GENDER_GIRLS
    end

    def is_sneaker?
        pillar.downcase == PRODUCT_PILLAR_SNEAKERS
    end

    def is_apparel?
        pillar.downcase == PRODUCT_PILLAR_APPAREL
    end

    def is_kids_sneaker_or_apparel?
        is_kids? && (is_sneaker? || is_apparel?)
    end

    def get_master_name
        giftcard? ? "" : name
    end
end

class MasterProduct < AbstractModel
    include MasterProductCommon

    self.table_name = "tbl_MasterProduct"
    has_many :variation_products
end
