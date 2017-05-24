class AddPositionColumnToProductToSizeMapping < ActiveRecord::Migration
    def up
        add_column :tbl_ProductToSizeMapping, :position, :integer
    end

    def down
        remove_column :tbl_ProductToSizeMapping, :position
    end
end
