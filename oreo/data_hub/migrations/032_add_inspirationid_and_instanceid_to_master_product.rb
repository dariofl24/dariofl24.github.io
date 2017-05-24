class AddInspirationidAndInstanceidToMasterProduct < ActiveRecord::Migration
    def up
        add_column :tbl_MasterProduct, :instance_id, :string
        add_column :tbl_MasterProduct, :inspiration_id, :string
    end

    def down
        remove_column :tbl_MasterProduct, :instance_id
        remove_column :tbl_MasterProduct, :inspiration_id
	end
end
