require 'converse/constants'

class MoveSizeChartFromMasterToVariation < ActiveRecord::Migration
    include Converse::Constants

    def up
        add_column :tbl_VariationProduct, :size_chart, :string
        add_column :tbl_VariationProduct, :size_chart_messaging, :string

        remove_column :tbl_MasterProduct, :size_chart
        remove_column :tbl_MasterProduct, :size_chart_messaging
    end

    def down
        add_column :tbl_MasterProduct, :size_chart, :string
        add_column :tbl_MasterProduct, :size_chart_messaging, :string

        remove_column :tbl_VariationProduct, :size_chart
        remove_column :tbl_VariationProduct, :size_chart_messaging
    end
end