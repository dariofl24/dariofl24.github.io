class AddMerchPlannerInfoTable < ActiveRecord::Migration
  def up
    create_table :tbl_MerchPlannerInfo do |t|
      t.string :sku, :null => false
      t.string :price
      t.string :sale_price
      t.string :product_name
      t.string :color
      t.string :cut
      t.string :gender
      t.string :material
      t.string :master_product_id
      t.string :converse_one
      t.string :gift_card
      t.string :online
    end
  end

  def down
    drop_table :tbl_MerchPlannerInfo
  end
end