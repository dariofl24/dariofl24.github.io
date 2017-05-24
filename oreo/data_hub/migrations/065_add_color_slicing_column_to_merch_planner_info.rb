class AddColorSlicingColumnToMerchPlannerInfo < ActiveRecord::Migration
    def up
        add_column :tbl_MerchPlannerInfo, :color_slicing, :boolean
    end

    def down
        remove_column :tbl_MerchPlannerInfo, :color_slicing
    end
end