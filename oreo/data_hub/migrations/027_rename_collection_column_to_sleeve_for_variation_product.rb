class RenameCollectionColumnToSleeveForVariationProduct < ActiveRecord::Migration
    def up
        rename_column :tbl_VariationProduct, :collection, :sleeve
    end

    def down
		rename_column :tbl_VariationProduct, :sleeve, :collection
    end
end