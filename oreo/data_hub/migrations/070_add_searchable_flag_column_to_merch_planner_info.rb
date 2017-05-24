class AddSearchableFlagColumnToMerchPlannerInfo < ActiveRecord::Migration
    def up
        add_column :tbl_MerchPlannerInfo, :searchable_flag, :boolean
    end

    def down
        remove_column :tbl_MerchPlannerInfo, :searchable_flag
    end
end
