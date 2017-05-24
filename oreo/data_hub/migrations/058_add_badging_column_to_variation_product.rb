class AddBadgingColumnToVariationProduct < ActiveRecord::Migration
    def up
        add_column :tbl_VariationProduct, :badging, :string
    end

    def down
        remove_column :tbl_VariationProduct, :badging
    end
end
