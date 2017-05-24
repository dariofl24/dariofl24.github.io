class RemoveNotnullConstraintFromVariationProductPriceTable < ActiveRecord::Migration
    def up
        change_column :tbl_ProductPrice, :price, :float, :null => true
    end

    def down
        change_column :tbl_ProductPrice, :price, :float, :null => false
    end
end
