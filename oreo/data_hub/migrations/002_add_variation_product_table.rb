class AddVariationProductTable < ActiveRecord::Migration
    def up
        create_table :tbl_VariationProduct do | t |
            t.string  :product_identifier
            t.string  :sku
            t.string  :color
            t.string  :size
            t.boolean :online
            t.references :master_product
        end
        add_index :tbl_VariationProduct, :product_identifier, :unique => true
        add_foreign_key :tbl_VariationProduct, :tbl_MasterProduct, :column => "master_product_id"
    end

    def down
        remove_index :tbl_VariationProduct, :product_identifier
        drop_table :tbl_VariationProduct
    end
end
