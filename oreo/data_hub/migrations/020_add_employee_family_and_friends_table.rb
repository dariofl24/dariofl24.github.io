class AddEmployeeFamilyAndFriendsTable < ActiveRecord::Migration
    def up
        create_table :tbl_EmployeeFamilyAndFriends do |t|
            t.integer :employee_id, :null => false
            t.integer :signup_id
            t.string :email, :limit => 150
            t.string :first_name, :limit => 100
            t.string :last_name, :limit => 100
            t.integer :state
            t.datetime :agreed_terms_date
            t.integer :relationship_id
            t.datetime :created
        end
    end

    def down
        drop_table :tbl_EmployeeFamilyAndFriends
    end
end
