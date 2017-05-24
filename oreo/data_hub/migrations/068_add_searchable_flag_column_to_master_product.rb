class AddSearchableFlagColumnToMasterProduct < ActiveRecord::Migration
    def up
        add_column :tbl_MasterProduct, :searchable_flag, :boolean
    end

    def down
        remove_column :tbl_MasterProduct, :searchable_flag
    end
end
