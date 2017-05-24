class AddPagetitleAndPagekeywordsAndPagedescriptionAndMetasearchtextColumnsToVariationProduct < ActiveRecord::Migration
    def up
        add_column :tbl_VariationProduct, :page_title, :string, :limit => 1000
        add_column :tbl_VariationProduct, :page_keywords, :string, :limit => 1000
        add_column :tbl_VariationProduct, :page_description, :string, :limit => 1000
        add_column :tbl_VariationProduct, :meta_search_text, :string, :limit => 1000
    end

    def down
        remove_column :tbl_VariationProduct, :page_title
        remove_column :tbl_VariationProduct, :page_keywords
        remove_column :tbl_VariationProduct, :page_description
        remove_column :tbl_VariationProduct, :meta_search_text
    end
end
