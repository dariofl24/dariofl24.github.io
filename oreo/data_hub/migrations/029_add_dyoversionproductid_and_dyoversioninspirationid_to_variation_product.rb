class AddDyoversionproductidAndDyoversioninspirationidToVariationProduct < ActiveRecord::Migration
    def up
        add_column :tbl_VariationProduct, :dyo_version_product_id, :string
        add_column :tbl_VariationProduct, :dyo_version_inspiration_id, :string
    end

    def down
        remove_column :tbl_VariationProduct, :dyo_version_product_id
        remove_column :tbl_VariationProduct, :dyo_version_inspiration_id
	end
end
