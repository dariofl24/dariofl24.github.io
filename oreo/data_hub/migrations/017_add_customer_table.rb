class AddCustomerTable < ActiveRecord::Migration
    def up
        create_table :tbl_Customer do |t|
            t.integer :signup_id, :null => false
            t.string :email, :limit => 150
            t.string :first_name, :limit => 100
            t.string :last_name, :limit => 100
            t.string :zip, :limit => 20
            t.string :gender, :limit => 6
            t.string :birth_day, :limit => 10
            t.string :birth_month, :limit => 10
            t.string :birth_year, :limit => 10
            t.boolean :active
            t.datetime :signup_created
            t.datetime :profile_created
            t.datetime :profile_updated
        end
        add_index :tbl_Customer, :signup_id, :unique => true
    end

    def down
        drop_table :tbl_Customer
    end
end
