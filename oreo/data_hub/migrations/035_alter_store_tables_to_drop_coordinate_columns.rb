class AlterStoreTablesToDropCoordinateColumns < ActiveRecord::Migration
    def up
        remove_column :tbl_Store_USA, :lat
        remove_column :tbl_Store_USA, :lng

        remove_column :tbl_Store_Canada, :lat
        remove_column :tbl_Store_Canada, :lng
    end

    def down
        add_column :tbl_Store_Canada, :lat, :decimal, :precision => 18, :scale => 10
        add_column :tbl_Store_Canada, :lng, :decimal, :precision => 18, :scale => 10

        add_column :tbl_Store_USA, :lat, :decimal, :precision => 18, :scale => 10
        add_column :tbl_Store_USA, :lng, :decimal, :precision => 18, :scale => 10
    end
end
