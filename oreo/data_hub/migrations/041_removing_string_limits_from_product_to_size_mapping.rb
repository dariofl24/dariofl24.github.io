class RemovingStringLimitsFromProductToSizeMapping < ActiveRecord::Migration
    def up
        change_column :tbl_ProductToSizeMapping, :sku, :string, :limit => nil
        change_column :tbl_ProductToSizeMapping, :size, :string, :limit => nil
    end
end
