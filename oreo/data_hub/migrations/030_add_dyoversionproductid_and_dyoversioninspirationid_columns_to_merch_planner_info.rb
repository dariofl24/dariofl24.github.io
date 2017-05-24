class AddDyoversionproductidAndDyoversioninspirationidColumnsToMerchPlannerInfo < ActiveRecord::Migration
    def up
        add_column :tbl_MerchPlannerInfo, :dyo_version_product_id, :string
        add_column :tbl_MerchPlannerInfo, :dyo_version_inspiration_id, :string
    end

    def down
        remove_column :tbl_MerchPlannerInfo, :dyo_version_product_id
        remove_column :tbl_MerchPlannerInfo, :dyo_version_inspiration_id
    end
end
