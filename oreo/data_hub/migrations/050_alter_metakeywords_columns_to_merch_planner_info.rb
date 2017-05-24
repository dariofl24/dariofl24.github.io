class AlterMetakeywordsColumnsToMerchPlannerInfo < ActiveRecord::Migration
    def up
        change_column :tbl_MerchPlannerInfo, :meta_keywords, :string, :limit => 1000
    end

    def down
        change_column :tbl_MerchPlannerInfo, :meta_keywords, :string
    end
end
