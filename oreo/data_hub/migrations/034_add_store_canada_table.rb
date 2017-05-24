class AddStoreCanadaTable < ActiveRecord::Migration
    def up
        create_table :tbl_Store_Canada do |t|
            t.string :name, :null => false, :limit => 100
            t.string :address1, :limit => 100
            t.string :address2, :limit => 100
            t.string :city, :limit => 100
            t.string :state, :limit => 100
            t.string :zip, :limit => 30
            t.string :phone, :limit => 50
            t.string :email, :limit => 50
            t.string :url
            t.decimal :lng, :precision => 18, :scale => 10
            t.decimal :lat, :precision => 18, :scale => 10
            t.string :account_no, :limit => 30
            t.string :company_no, :limit => 30
        end
    end

    def down
        drop_table :tbl_Store_Canada
    end
end
