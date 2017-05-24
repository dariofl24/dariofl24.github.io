class AddOutOfStockMessageColumnToMerchPlannerInfo < ActiveRecord::Migration
    def up
        add_column :tbl_MerchPlannerInfo, :out_of_stock_message, :string
    end

    def down
        remove_column :tbl_MerchPlannerInfo, :out_of_stock_message
    end
end
