require 'rubygems'

$:.unshift File.join(File.dirname(__FILE__), '../lib')

require 'converse/constants'
require 'converse/export/price_books_exporter.rb'
require 'converse/export/exporter_facade'
require 'data_hub/context'

def get_available_sale_files_from(input_directory, logger)
    pattern = File.join(input_directory, "*" + Converse::Constants::CSV_EXTENSION)
    logger.info "Checking #{input_directory} for #{Converse::Constants::CSV_EXTENSION} files"
    Dir.glob pattern
end

if __FILE__ == $0
    context = DataHub::Context.new( __FILE__, 'process_sale_requests.yaml')

    $input_directory = context.options['input_directory']

    context.execute "Get available sales files from #{$input_directory}" do |options,logger|
        $files = get_available_sale_files_from($input_directory, logger)
        if $files.empty? then
            logger.info "No available sales files found!"
            exit
        end
    end

    $files.each do |input_file|
        context.execute "Export sales file #{input_file}" do |options, logger|
            exporter = Converse::Impex::ExporterFacade.new(options, logger, Converse::Impex::ExportMode::SALE_PRICE_BOOK)
            exporter.run({ :input_file => input_file })
        end
    end

    context.execute "Sending notification that sales price book export finished" do |options, logger|
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
