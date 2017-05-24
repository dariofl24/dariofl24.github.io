require 'rubygems'
require 'active_record'

require "converse/models/abstract_model"

class GenescoInventoryInfo < AbstractModel
    self.table_name = "tbl_GenescoInventoryInfo"

    def to_s
        "SKU: #{sku}, Size: #{size}, Qty on Hand: #{qty_on_hand}, Qty on PO: #{qty_on_po}, Expect Date: #{expect_date}"
    end

end
