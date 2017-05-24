class AddColumnsToMerchPlannerInfo < ActiveRecord::Migration
    def up
        add_column :tbl_MerchPlannerInfo, :merch_planner_category, :string
        add_column :tbl_MerchPlannerInfo, :pillar, :string
        add_column :tbl_MerchPlannerInfo, :collection, :string
    end

    def down
        remove_column :tbl_MerchPlannerInfo, :merch_planner_category
        remove_column :tbl_MerchPlannerInfo, :pillar
        remove_column :tbl_MerchPlannerInfo, :collection
    end
end
