class AddBadgingColumnToMerchPlannerInfo < ActiveRecord::Migration
    def up
        add_column :tbl_MerchPlannerInfo, :badging, :string
    end

    def down
        remove_column :tbl_MerchPlannerInfo, :badging
    end
end
