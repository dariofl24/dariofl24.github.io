class AddMaxOrderQuantityColumnToVariationProduct < ActiveRecord::Migration
    def up
        add_column :tbl_VariationProduct, :max_order_quantity, :integer
    end

    def down
        remove_column :tbl_VariationProduct, :max_order_quantity
    end
end
