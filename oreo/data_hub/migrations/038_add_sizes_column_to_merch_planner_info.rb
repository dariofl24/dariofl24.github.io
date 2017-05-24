class AddSizesColumnToMerchPlannerInfo < ActiveRecord::Migration
    def up
        add_column :tbl_MerchPlannerInfo, :sizes, :string
    end

    def down
        remove_column :tbl_MerchPlannerInfo, :sizes
    end
end