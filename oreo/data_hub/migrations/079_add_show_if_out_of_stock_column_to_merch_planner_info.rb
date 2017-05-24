class AddShowIfOutOfStockColumnToMerchPlannerInfo < ActiveRecord::Migration
    def up
        add_column :tbl_MerchPlannerInfo, :show_if_out_of_stock, :string
    end

    def down
        remove_column :tbl_MerchPlannerInfo, :show_if_out_of_stock
    end
end
