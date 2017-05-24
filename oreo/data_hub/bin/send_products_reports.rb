require 'rubygems'

$:.unshift File.join(File.dirname(__FILE__), '../lib')

require 'converse/io'
require 'data_hub/context'

if __FILE__ == $0
    def send_mail(from, recipients, subject, dir, prefix, logger)
        files = Dir["#{dir}/#{prefix}*"].sort_by!{ |filename | File.mtime(filename)}
        file = files[-1] if files.size > 0

        if file.nil? or !File.exists? file
            logger.warn("No products reports found for prefix: '#{prefix}'. Check the configuration file")
        else
            command = "echo \"#{subject}\" | mailx -r #{from} -s\"#{subject}\" -a #{file} #{recipients}"
        
            result = system(command)

            if result.nil? or !result
                logger.error('Sending notification has failed')
                abort
            else
                File.delete file
            end
        end
    end

    context = DataHub::Context.new( __FILE__, 'send_products_reports.yaml')

    context.execute "Sending products reports" do | options, logger |
        recipients = options['recipients']
        from = options['from']
        daily_reports_dir = options['daily_reports_dir']
        online_products_file_prefix = options['online_products_file_prefix']
        offline_products_file_prefix = options['offline_products_file_prefix']

        send_mail(from, recipients, 'Online products without inventory', daily_reports_dir, online_products_file_prefix, logger)
        send_mail(from, recipients, 'Offline products with inventory', daily_reports_dir, offline_products_file_prefix, logger)
    end
end
