class AddTemplateColumnToMasterProduct < ActiveRecord::Migration
    def up
        add_column :tbl_MasterProduct, :template, :string
    end

    def down
        remove_column :tbl_MasterProduct, :template
    end
end