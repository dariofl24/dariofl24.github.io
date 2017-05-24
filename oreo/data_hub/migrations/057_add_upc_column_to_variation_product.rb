class AddUpcColumnToVariationProduct < ActiveRecord::Migration
    def up
        add_column :tbl_VariationProduct, :upc, :string, :limit => 12
    end

    def down
        remove_column :tbl_VariationProduct, :upc
    end
end
