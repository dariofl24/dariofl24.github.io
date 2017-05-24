class AddProductToSizeMappingTable < ActiveRecord::Migration
    def up
        create_table :tbl_ProductToSizeMapping do |t|
            t.string :sku, :null => false, :limit => 100
            t.string :size, :null => false, :limit => 100
        end
    end

    def down
        drop_table :tbl_ProductToSizeMapping
    end
end
