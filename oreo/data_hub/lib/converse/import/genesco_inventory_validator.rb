require 'rubygems'

require 'csv'
require 'converse/logging'
require 'converse/constants'

module Converse
    module Impex
        class GenescoInventoryValidator
            include Converse::Logging

            def initialize(options, logger = nil)
                @file_path = options['genesco_inventory_input_file']
                @products_threshold = options['genesco_inventory_minimum_number_of_skus']
                @logger = logger.nil? ? setup_logger(self.class) : logger
            end

            def validate()
                skus = []

                CSV.foreach(@file_path) do |row|
                    skus << row[0]
                end

                count = skus.uniq.size
                raise "It seems that Genesco inventory feed is corrupt. Expecting at least #{@products_threshold} products, but #{count} found" unless count > @products_threshold
            end
        end
    end
end
