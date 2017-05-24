class AddManufacturerSkuToMerchPlannerInfo < ActiveRecord::Migration
    def up
        add_column :tbl_MerchPlannerInfo, :manufacturer_sku, :string
    end

    def down
        remove_column :tbl_MerchPlannerInfo, :manufacturer_sku
    end
end
