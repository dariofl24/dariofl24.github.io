class AddBusinessunitidColumnToMasterProduct < ActiveRecord::Migration
    def up
        add_column :tbl_MasterProduct, :business_unit_id, :string
    end

    def down
        remove_column :tbl_MasterProduct, :business_unit_id
    end
end
