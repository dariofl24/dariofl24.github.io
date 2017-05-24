class AddColumnsToMasterProduct < ActiveRecord::Migration
    def up
        add_column :tbl_MasterProduct, :merch_planner_category, :string
        add_column :tbl_MasterProduct, :pillar, :string
        add_column :tbl_MasterProduct, :collection, :string
    end

    def down
        remove_column :tbl_MasterProduct, :merch_planner_category
        remove_column :tbl_MasterProduct, :pillar
        remove_column :tbl_MasterProduct, :collection
    end
end
