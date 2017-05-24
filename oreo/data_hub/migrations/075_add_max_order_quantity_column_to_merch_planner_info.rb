class AddMaxOrderQuantityColumnToMerchPlannerInfo < ActiveRecord::Migration
    def up
        add_column :tbl_MerchPlannerInfo, :max_order_quantity, :string
    end

    def down
        remove_column :tbl_MerchPlannerInfo, :max_order_quantity
    end
end
