class RenameEmployeeFamilyAndFriendsTable < ActiveRecord::Migration
    def self.up
        rename_table :tbl_EmployeeFamilyAndFriends, :tbl_EmployeeRelative
    end

    def self.down
        rename_table :tbl_EmployeeRelative, :tbl_EmployeeFamilyAndFriends
    end
end
