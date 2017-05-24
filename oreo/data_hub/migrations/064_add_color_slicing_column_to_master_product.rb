class AddColorSlicingColumnToMasterProduct < ActiveRecord::Migration
    def up
        add_column :tbl_MasterProduct, :color_slicing, :boolean
    end

    def down
        remove_column :tbl_MasterProduct, :color_slicing
    end
end