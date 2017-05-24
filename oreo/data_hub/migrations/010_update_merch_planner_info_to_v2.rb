class UpdateMerchPlannerInfoToV2 < ActiveRecord::Migration
    def up
        add_column :tbl_MerchPlannerInfo, :brand_segment, :string
        add_column :tbl_MerchPlannerInfo, :size_chart, :string
        add_column :tbl_MerchPlannerInfo, :size_chart_messaging, :string
        add_column :tbl_MerchPlannerInfo, :description, :string, :limit => 1000
        add_column :tbl_MerchPlannerInfo, :current_status, :string
        add_column :tbl_MerchPlannerInfo, :nike_product_id, :string
        add_column :tbl_MerchPlannerInfo, :main_color_hex, :string
        add_column :tbl_MerchPlannerInfo, :accent_color_hex, :string
    end

    def down
        remove_column :tbl_MerchPlannerInfo, :brand_segment
        remove_column :tbl_MerchPlannerInfo, :size_chart
        remove_column :tbl_MerchPlannerInfo, :size_chart_messaging
        remove_column :tbl_MerchPlannerInfo, :description
        remove_column :tbl_MerchPlannerInfo, :current_status
        remove_column :tbl_MerchPlannerInfo, :nike_product_id
        remove_column :tbl_MerchPlannerInfo, :main_color_hex
        remove_column :tbl_MerchPlannerInfo, :accent_color_hex
    end
end
