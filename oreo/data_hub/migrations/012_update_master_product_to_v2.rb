class UpdateMasterProductToV2 < ActiveRecord::Migration
    def up
        add_column :tbl_MasterProduct, :brand_segment, :string
        add_column :tbl_MasterProduct, :size_chart, :string
        add_column :tbl_MasterProduct, :size_chart_messaging, :string
        add_column :tbl_MasterProduct, :description, :string, :limit => 1000
        add_column :tbl_MasterProduct, :nike_product_id, :string
    end

    def down
        remove_column :tbl_MasterProduct, :brand_segment
        remove_column :tbl_MasterProduct, :size_chart
        remove_column :tbl_MasterProduct, :size_chart_messaging
        remove_column :tbl_MasterProduct, :description
        remove_column :tbl_MasterProduct, :nike_product_id
    end
end
