class AlterStoreTablesToAddHashKeyColumn < ActiveRecord::Migration
    def up
        add_column :tbl_Store_USA, :hash_key, :string
        add_column :tbl_Store_Canada, :hash_key, :string
    end

    def down
        remove_column :tbl_Store_Canada, :hash_key
        remove_column :tbl_Store_USA, :hash_key
    end
end
