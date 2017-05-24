class AddCustomerAddressTable < ActiveRecord::Migration
    def up
        create_table :tbl_CustomerAddress do |t|
            t.integer :signup_id, :null => false
            t.string :first_name, :limit => 100
            t.string :last_name, :limit => 100
            t.string :address1, :limit => 50
            t.string :address2, :limit => 50
            t.string :city, :limit => 50
            t.string :state, :limit => 50
            t.string :zip, :limit => 20
            t.string :phone, :limit => 30
            t.integer :country_id
            t.integer :type
        end
    end

    def down
        drop_table :tbl_CustomerAddress
    end
end
