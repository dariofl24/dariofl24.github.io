class AddBusinessunitidColumnToMerchPlannerInfo < ActiveRecord::Migration
    def up
        add_column :tbl_MerchPlannerInfo, :business_unit_id, :string
    end

    def down
        remove_column :tbl_MerchPlannerInfo, :business_unit_id
    end
end
