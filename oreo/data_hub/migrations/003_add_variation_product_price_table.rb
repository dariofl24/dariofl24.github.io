class AddVariationProductPriceTable < ActiveRecord::Migration
    def up
        create_table :tbl_ProductPrice do | t |
            t.float      :price, :null => false
            t.float      :sale_price
            t.references :variation_product
        end

        add_foreign_key :tbl_ProductPrice, :tbl_VariationProduct, :column => "variation_product_id"
    end

    def down
        drop_table :tbl_ProductPrice
    end
end
