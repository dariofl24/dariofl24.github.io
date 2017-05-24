require 'rubygems'
require 'trollop'

$:.unshift File.join(File.dirname(__FILE__), '../lib')

require 'converse/constants'
require 'converse/io'
require 'converse/import/store_importer'
require 'converse/export/exporter_facade'
require 'data_hub/context'

if __FILE__ == $0
    context = DataHub::Context.new( __FILE__, 'process_stores.yaml')

    opts = Trollop::options do
        opt :processed_file_suffix, 'Suffix to the input file once processed.',
            :type => :string,
            :required => false,
            :default => Converse::IO.get_default_file_suffix
    end

    context.options[PROCESSED_FILE_SUFFIX_OPTION] = opts[:processed_file_suffix]
    
    Converse::Impex::StoreImporter::TYPE.each do |key, value|
        context.execute "Import stores into the DataHub DB: Store type #{value}" do |options,logger|
            store_importer = Converse::Impex::StoreImporter.new(value, options, logger)
            store_importer.run
        end
    end

    context.execute "Export stores into DW XML" do |options,logger|
        exporter = Converse::Impex::ExporterFacade.new(options, logger, Converse::Impex::ExportMode::STORE)
        exporter.run
    end

    context.execute "Sending notification that stores export finished" do |options, logger|
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
