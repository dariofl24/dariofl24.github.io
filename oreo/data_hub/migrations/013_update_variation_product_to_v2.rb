class UpdateVariationProductToV2 < ActiveRecord::Migration
    def up
        add_column :tbl_VariationProduct, :main_color_hex, :string
        add_column :tbl_VariationProduct, :accent_color_hex, :string
    end

    def down
        remove_column :tbl_VariationProduct, :main_color_hex
        remove_column :tbl_VariationProduct, :accent_color_hex
    end
end
