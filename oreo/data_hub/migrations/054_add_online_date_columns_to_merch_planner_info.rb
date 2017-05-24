class AddOnlineDateColumnsToMerchPlannerInfo < ActiveRecord::Migration
    def up
        add_column :tbl_MerchPlannerInfo, :online_from, :string
        add_column :tbl_MerchPlannerInfo, :online_to, :string
    end

    def down
        remove_column :tbl_MerchPlannerInfo, :online_to
        remove_column :tbl_MerchPlannerInfo, :online_from
    end
end
