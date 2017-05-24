class RenameCollectionColumnToSleeveForMerchPlannerInfo < ActiveRecord::Migration
    def up
        rename_column :tbl_MerchPlannerInfo, :collection, :sleeve
    end

    def down
       rename_column :tbl_MerchPlannerInfo, :sleeve, :collection
    end
end
