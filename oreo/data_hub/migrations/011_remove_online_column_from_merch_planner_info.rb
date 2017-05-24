class RemoveOnlineColumnFromMerchPlannerInfo < ActiveRecord::Migration
    def up
        remove_column :tbl_MerchPlannerInfo, :online
    end

    def down
        add_column :tbl_MerchPlannerInfo, :online, :string
    end
end
