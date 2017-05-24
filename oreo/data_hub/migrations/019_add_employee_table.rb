class AddEmployeeTable < ActiveRecord::Migration
    def up
        create_table :tbl_Employee do |t|
            t.integer :employee_id, :null => false
            t.integer :signup_id, :null => false
            t.string :email, :limit => 150
            t.string :first_name, :limit => 100
            t.string :last_name, :limit => 100
            t.string :bvat_id, :limit => 50
            t.boolean :active
            t.datetime :created
        end
        add_index :tbl_Employee, :employee_id, :unique => true
    end

    def down
        drop_table :tbl_Employee
    end
end
