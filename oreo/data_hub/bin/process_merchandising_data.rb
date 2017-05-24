require 'rubygems'
require 'trollop'

$:.unshift File.join(File.dirname(__FILE__), '../lib')

require 'converse/constants'
require 'converse/io'
require 'converse/product_to_size_mapper'
require 'converse/import/merchplanner_data_importer'
require 'converse/import/genesco_inventory_importer'
require 'converse/import/genesco_inventory_validator'
require 'converse/export/product_catalog_syncer'
require 'converse/export/exporter_facade'
require 'data_hub/context'

if __FILE__ == $0
    context = DataHub::Context.new( __FILE__, 'process_merchandising_data.yaml')

    opts = Trollop::options do
        opt :processed_file_suffix, 'Suffix to the input file once processed.',
            :type => :string,
            :required => false,
            :default => Converse::IO.get_default_file_suffix
    end

    context.options[Converse::Constants::PROCESSED_FILE_SUFFIX_OPTION] = opts[:processed_file_suffix]

    context.execute "Prepare importers" do |options,logger|
        $merchplanner_data_importer = Converse::Impex::MerchPlannerDataImporter.new(options, logger)
        $genesco_inventory_importer = Converse::Impex::GenescoInventoryImporter.new(options, logger)

        if not $merchplanner_data_importer.file_ready? and not $genesco_inventory_importer.file_ready?
            logger.info('No feeds to process. Exiting...')
            abort
        end
    end

    context.execute "catalog feed import" do
        $merchplanner_data_importer.run if $merchplanner_data_importer.file_ready?
    end

    context.execute "inventory feed import" do |options,logger|
         if $genesco_inventory_importer.file_ready?
            genesco_inventory_validator = Converse::Impex::GenescoInventoryValidator.new(options, logger)
            genesco_inventory_validator.validate
            
            $genesco_inventory_importer.run
         end
    end

    context.execute "product to size mapper" do |options, logger|
        product_to_size_mapper = ProductToSizeMapper.new(logger)
        product_to_size_mapper.run
    end

    context.execute "product data synchronization" do |options, logger|
        product_catalog_syncer = Converse::Impex::ProductCatalogSyncer.new(logger)
        product_catalog_syncer.run
    end

    context.execute "Export catalog, price book and inventory" do |options, logger|
        exporter = Converse::Impex::ExporterFacade.new(options, logger, Converse::Impex::ExportMode::CATALOG | Converse::Impex::ExportMode::PRICE_BOOK | Converse::Impex::ExportMode::INVENTORY)
        exporter.run
    end

    context.execute "Sending notification that catalog export finished" do |options, logger|
        recipients = options['notification_recipients']
        subject = options['notification_subject']
        message = options['notification_message']
        from = options['notification_from']

        command = "echo \"#{message}\" | mailx -r #{from} -s\"#{subject}\" #{recipients}"

        result = system(command)

        if result.nil? or !result
            logger.error('Sending notification has failed')
            abort
        end
    end
end
