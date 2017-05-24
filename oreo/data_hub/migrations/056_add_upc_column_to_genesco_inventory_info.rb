class AddUpcColumnToGenescoInventoryInfo < ActiveRecord::Migration
    def up
        add_column :tbl_GenescoInventoryInfo, :upc, :string
    end

    def down
        remove_column :tbl_GenescoInventoryInfo, :upc
    end
end
