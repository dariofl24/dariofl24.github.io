class AddGenescoInventoryInfoTable < ActiveRecord::Migration
  def up
    create_table :tbl_GenescoInventoryInfo do |t|
      t.string :sku, :null => false
      t.string :size
      t.string :qty_on_hand
      t.string :expect_date
      t.string :qty_on_po
    end
  end

  def down
    drop_table :tbl_GenescoInventoryInfo
  end
end