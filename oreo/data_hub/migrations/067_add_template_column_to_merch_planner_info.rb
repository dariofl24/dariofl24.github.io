class AddTemplateColumnToMerchPlannerInfo < ActiveRecord::Migration
    def up
        add_column :tbl_MerchPlannerInfo, :template, :string
    end

    def down
        remove_column :tbl_MerchPlannerInfo, :template
    end
end