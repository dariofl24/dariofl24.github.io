class RenameCustomAddressTableTypeColumn < ActiveRecord::Migration
    def up
        rename_column :tbl_CustomerAddress, :type, :address_type
    end

    def down
        rename_column :tbl_CustomerAddress, :address_type, :type
    end
end
