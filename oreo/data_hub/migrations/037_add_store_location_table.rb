class AddStoreLocationTable < ActiveRecord::Migration
    def up
        create_table :tbl_StoreLocation do |t|
            t.string :hash_key, :null => false
            t.decimal :latitude, :precision => 18, :scale => 10
            t.decimal :longitude, :precision => 18, :scale => 10
            t.integer :geocode_attempts
        end
    end

    def down
        drop_table :tbl_StoreLocation
    end
end
