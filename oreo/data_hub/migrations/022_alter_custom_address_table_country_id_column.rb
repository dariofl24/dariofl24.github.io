class AlterCustomAddressTableCountryIdColumn < ActiveRecord::Migration
    def up
        rename_column :tbl_CustomerAddress, :country_id, :country_code
        change_column :tbl_CustomerAddress, :country_code, :string, :limit => 3
    end

    def down
        remove_column :tbl_CustomerAddress, :country_code
        add_column :tbl_CustomerAddress, :country_id, :integer
    end
end
