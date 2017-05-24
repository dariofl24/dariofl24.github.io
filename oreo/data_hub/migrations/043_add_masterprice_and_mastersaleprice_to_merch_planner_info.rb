class AddMasterpriceAndMastersalepriceToMerchPlannerInfo < ActiveRecord::Migration
    def up
        add_column :tbl_MerchPlannerInfo, :master_price, :string
        add_column :tbl_MerchPlannerInfo, :master_sale_price, :string
    end

    def down
        remove_column :tbl_MerchPlannerInfo, :master_price
        remove_column :tbl_MerchPlannerInfo, :master_sale_price
    end
end
