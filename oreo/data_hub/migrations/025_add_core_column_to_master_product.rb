class AddCoreColumnToMasterProduct < ActiveRecord::Migration
    def up
        add_column :tbl_MasterProduct, :core, :boolean
    end

    def down
        remove_column :tbl_MasterProduct, :core
    end
end