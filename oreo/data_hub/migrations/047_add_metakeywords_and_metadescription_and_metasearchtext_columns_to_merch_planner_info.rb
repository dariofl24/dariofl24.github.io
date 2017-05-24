class AddMetakeywordsAndMetadescriptionAndMetasearchtextColumnsToMerchPlannerInfo < ActiveRecord::Migration
    def up
        add_column :tbl_MerchPlannerInfo, :meta_keywords, :string
        add_column :tbl_MerchPlannerInfo, :meta_description, :string, :limit => 1000
        add_column :tbl_MerchPlannerInfo, :meta_search_text, :string, :limit => 1000
    end

    def down
        remove_column :tbl_MerchPlannerInfo, :meta_keywords
        remove_column :tbl_MerchPlannerInfo, :meta_description
        remove_column :tbl_MerchPlannerInfo, :meta_search_text
    end
end
