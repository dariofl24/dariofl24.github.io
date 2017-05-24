class AddPreorderBackorderColumnToVariationProductInventoryTable < ActiveRecord::Migration
    def up
        add_column :tbl_ProductInventory, :preorder_backorder, :string
    end

    def down
        remove_column :tbl_ProductInventory, :preorder_backorder
    end
end
