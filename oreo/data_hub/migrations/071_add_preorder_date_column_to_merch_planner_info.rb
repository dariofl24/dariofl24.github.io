class AddPreorderDateColumnToMerchPlannerInfo < ActiveRecord::Migration
    def up
        add_column :tbl_MerchPlannerInfo, :preorder_date, :string
    end

    def down
        remove_column :tbl_MerchPlannerInfo, :preorder_date
    end
end
