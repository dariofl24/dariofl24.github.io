class AddManufacturerSkuToVariationProduct < ActiveRecord::Migration
    def up
        add_column :tbl_VariationProduct, :manufacturer_sku, :string
    end

    def down
        remove_column :tbl_VariationProduct, :manufacturer_sku
    end
end
