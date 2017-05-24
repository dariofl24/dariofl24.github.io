class IntroduceProductTypeColumn < ActiveRecord::Migration
    def up
        remove_column :tbl_MasterProduct, :converse_one
        remove_column :tbl_MasterProduct, :gift_card
        remove_column :tbl_MerchPlannerInfo, :converse_one
        remove_column :tbl_MerchPlannerInfo, :gift_card

        add_column :tbl_MasterProduct, :product_type, :string 
        add_column :tbl_MerchPlannerInfo, :product_type, :string        
    end

    def down
        add_column :tbl_MasterProduct, :converse_one, :boolean, :default => false
        add_column :tbl_MasterProduct, :gift_card, :boolean, :default => false
        add_column :tbl_MerchPlannerInfo, :converse_one, :boolean, :default => false
        add_column :tbl_MerchPlannerInfo, :gift_card, :boolean, :default => false
        
    	remove_column :tbl_MasterProduct, :product_type
        remove_column :tbl_MerchPlannerInfo, :product_type
    end
end
