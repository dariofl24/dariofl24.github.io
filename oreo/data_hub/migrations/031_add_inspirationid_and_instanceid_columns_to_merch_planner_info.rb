class AddInspirationidAndInstanceidColumnsToMerchPlannerInfo < ActiveRecord::Migration
    def up
        add_column :tbl_MerchPlannerInfo, :instance_id, :string
        add_column :tbl_MerchPlannerInfo, :inspiration_id, :string
    end

    def down
        remove_column :tbl_MerchPlannerInfo, :instance_id
        remove_column :tbl_MerchPlannerInfo, :inspiration_id
    end
end
