require 'rubygems'

require 'converse/logging'
require 'converse/constants'
require 'converse/csv/csv_data_importer'
require 'converse/models/genesco_inventory_info'

module Converse
    module Impex

        class GenescoInventoryImporter < Converse::Impex::CsvDataImporter
            include Converse::Logging

            SKU_COLUMN_ID = 'Style2'
            SIZE_COLUMN_ID = 'Size'
            QTY_ON_HAND_COLUMN_ID = 'Qty On Hand'
            EXPECT_DATE_COLUMN_ID = 'Expect Date'
            QTY_ON_PO_COLUMN_ID = 'Qty On PO for Size'
            UPC_COLUMN_ID = 'Pa Num'

            COLUMNS_MAP = {
                SKU_COLUMN_ID => 'sku',
                SIZE_COLUMN_ID => 'size',
                QTY_ON_HAND_COLUMN_ID => 'qty_on_hand',
                EXPECT_DATE_COLUMN_ID => 'expect_date',
                QTY_ON_PO_COLUMN_ID => 'qty_on_po'
            }

            def initialize(options, logger = nil)
                super(options['genesco_inventory_input_file'], options.merge(:map => COLUMNS_MAP))
                @logger = logger.nil? ? setup_logger(self.class) : logger

                # TODO: once the new inventory feed is approved 'upc' column should become mandatory
                if options['genesco_inventory_process_upc_column']
                    COLUMNS_MAP[UPC_COLUMN_ID] = "upc"
                end
            end

            def import_csv(file_path, options)
                @logger.debug "Running inventory CSV import from \"#{file_path}\"..."
                GenescoInventoryInfo.import_csv(file_path, options)
                @logger.debug "Done."
            end

            def process_csv_row(row)
                if is_accessory(row)
                    row[SIZE_COLUMN_ID] = ONE_SIZE
                end
            end

            def is_accessory(row)
                return row[SIZE_COLUMN_ID].blank?
            end
        end

    end
end
