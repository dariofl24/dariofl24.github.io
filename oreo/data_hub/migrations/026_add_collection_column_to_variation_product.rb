class AddCollectionColumnToVariationProduct < ActiveRecord::Migration
    def up
        add_column :tbl_VariationProduct, :collection, :string
        remove_column :tbl_MasterProduct, :collection
    end

    def down
        remove_column :tbl_VariationProduct, :collection
        add_column :tbl_MasterProduct, :collection, :string
    end
end