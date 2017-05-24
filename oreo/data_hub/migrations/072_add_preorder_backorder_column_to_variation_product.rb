class AddPreorderBackorderColumnToVariationProduct < ActiveRecord::Migration
    def up
        add_column :tbl_VariationProduct, :preorder_backorder, :string
    end

    def down
        remove_column :tbl_VariationProduct, :preorder_backorder
    end
end
