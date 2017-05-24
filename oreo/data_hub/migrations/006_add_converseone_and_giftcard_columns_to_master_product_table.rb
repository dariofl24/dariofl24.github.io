class AddConverseoneAndGiftcardColumnsToMasterProductTable < ActiveRecord::Migration
    def up
        add_column :tbl_MasterProduct, :converse_one, :boolean, :default => false
        add_column :tbl_MasterProduct, :gift_card, :boolean, :default => false
    end

    def down
        remove_column :tbl_MasterProduct, :converse_one
        remove_column :tbl_MasterProduct, :gift_card
    end
end
