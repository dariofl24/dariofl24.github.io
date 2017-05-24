class AddMasterpriceAndMastersalepriceToMasterProduct < ActiveRecord::Migration
    def up
        add_column :tbl_MasterProduct, :price, :string
        add_column :tbl_MasterProduct, :sale_price, :string
    end

    def down
        remove_column :tbl_MasterProduct, :price
        remove_column :tbl_MasterProduct, :sale_price
    end
end
