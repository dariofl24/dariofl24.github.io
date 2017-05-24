require 'rubygems'
require 'active_record'

require "converse/models/abstract_model"

module VariationProductCommon

    def get_product_price
        product_price.price.to_i
    end

    def get_variation_name
        if master_product.physical_giftcard?
            "Converse.com $#{get_product_price} Gift Card"
        elsif master_product.electronic_giftcard?
            "Converse.com $#{get_product_price} Email Gift Cert"
        else
            master_product.name
        end
    end

end

class VariationProduct < AbstractModel
    include VariationProductCommon

    self.table_name = "tbl_VariationProduct"
    belongs_to :master_product
    has_one :product_price
    has_one :product_inventory
end
