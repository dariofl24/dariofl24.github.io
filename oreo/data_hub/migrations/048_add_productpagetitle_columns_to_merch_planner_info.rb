class AddProductpagetitleColumnsToMerchPlannerInfo < ActiveRecord::Migration
    def up
        add_column :tbl_MerchPlannerInfo, :product_page_title, :string, :limit => 1000
    end

    def down
        remove_column :tbl_MerchPlannerInfo, :product_page_title
    end
end
