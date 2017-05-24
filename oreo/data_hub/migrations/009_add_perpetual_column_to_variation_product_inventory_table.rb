class AddPerpetualColumnToVariationProductInventoryTable < ActiveRecord::Migration
    def up
        add_column :tbl_ProductInventory, :perpetual, :boolean, :default => false
    end

    def down
        remove_column :tbl_ProductInventory, :perpetual 
    end
end
