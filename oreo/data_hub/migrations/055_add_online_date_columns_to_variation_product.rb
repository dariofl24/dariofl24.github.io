class AddOnlineDateColumnsToVariationProduct < ActiveRecord::Migration
    def up
        add_column :tbl_VariationProduct, :online_from, :datetime
        add_column :tbl_VariationProduct, :online_to, :datetime
    end

    def down
        remove_column :tbl_VariationProduct, :online_to
        remove_column :tbl_VariationProduct, :online_from
    end
end
