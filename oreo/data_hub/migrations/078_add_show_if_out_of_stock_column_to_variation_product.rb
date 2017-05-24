class AddShowIfOutOfStockColumnToVariationProduct < ActiveRecord::Migration
    def up
        add_column :tbl_VariationProduct, :show_if_out_of_stock, :boolean
    end

    def down
        remove_column :tbl_VariationProduct, :show_if_out_of_stock
    end
end
