class AddVariationProductInventoryTable < ActiveRecord::Migration
    def up
        create_table :tbl_ProductInventory do | t |
            t.float      :allocation
            t.float      :po_allocation
            t.string     :in_stock_date
            t.references :variation_product
        end

        add_foreign_key :tbl_ProductInventory, :tbl_VariationProduct, :column => "variation_product_id"
    end

    def down
        drop_table :tbl_ProductInventory
    end
end
