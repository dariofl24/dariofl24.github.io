class AddMasterProductTable < ActiveRecord::Migration
    def up
        create_table :tbl_MasterProduct do | t |
            t.string :product_identifier
            t.string :name
            t.string :cut
            t.string :gender
            t.string :material
        end
        add_index :tbl_MasterProduct, :product_identifier, :unique => true
    end

    def down
        remove_index :tbl_MasterProduct, :product_identifier
        drop_table :tbl_MasterProduct
    end
end
