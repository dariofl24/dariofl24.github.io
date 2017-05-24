require 'active_record'

require 'converse/constants'
require 'converse/logging'
require 'converse/models/product_to_size_mapping'
require 'converse/models/merch_planner_info'

class ProductToSizeMapper
    include Converse::Constants
    include Converse::Logging

    def initialize(logger = nil)
        @logger = logger.nil? ? setup_logger(self.class) : logger
    end

    def run
        @logger.info "Persisting product to size mappings..."
        
        ProductToSizeMapping.delete_all_and_reset_pk

        ActiveRecord::Base.transaction do
            MerchPlannerInfo.find_each(batch_size: 500) do |info|
                sizes_set = get_sizes_set(info.sizes)

                unless sizes_set.empty? then
                    sizes_set.each_with_index do |size, index|
                        ProductToSizeMapping.create({
                            :sku => info.sku,
                            :size => size,
                            :position => index
                        })
                    end    
                end    
            end
        end
    end

    def get_sizes_set(sizes)
        return [] if sizes.blank?

        result = sizes.split(",").map { |s| s.strip }
        return result.uniq
    end    
end
