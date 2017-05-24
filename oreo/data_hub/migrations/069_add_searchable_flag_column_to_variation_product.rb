class AddSearchableFlagColumnToVariationProduct < ActiveRecord::Migration
    def up
        add_column :tbl_VariationProduct, :searchable_flag, :boolean
    end

    def down
        remove_column :tbl_VariationProduct, :searchable_flag
    end
end
