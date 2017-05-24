class AddUniqueIndexToProductToSizeMapping < ActiveRecord::Migration
    def up
        add_index :tbl_ProductToSizeMapping, [:sku, :size], :unique => true
    end

    def down
        remove_index :tbl_ProductToSizeMapping, [:sku, :size]
    end
end
