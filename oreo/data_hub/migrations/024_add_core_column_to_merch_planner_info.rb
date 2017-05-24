class AddCoreColumnToMerchPlannerInfo < ActiveRecord::Migration
    def up
        add_column :tbl_MerchPlannerInfo, :core, :string
    end

    def down
        remove_column :tbl_MerchPlannerInfo, :core
    end
end