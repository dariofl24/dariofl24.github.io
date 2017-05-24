class ChangeMasterpriceAndMastersalepriceTypeForMasterProduct < ActiveRecord::Migration
    def up
        remove_column :tbl_MasterProduct, :price
        remove_column :tbl_MasterProduct, :sale_price
        add_column :tbl_MasterProduct, :price, :float
        add_column :tbl_MasterProduct, :sale_price, :float
    end

    def down
    	remove_column :tbl_MasterProduct, :price
        remove_column :tbl_MasterProduct, :sale_price
        add_column :tbl_MasterProduct, :price, :string
        add_column :tbl_MasterProduct, :sale_price, :string
    end
end
